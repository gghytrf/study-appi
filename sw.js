// Service Worker - 国試学習アプリ（移行・バックアップ専用版）
// キャッシュバージョン: バージョンを変えると古いキャッシュ（旧index.html・questions.json）が破棄されます
const CACHE_VERSION = 'v2026.7.23-retire';
const CACHE_NAME = 'study-app-' + CACHE_VERSION;

// キャッシュ対象ファイル（questions.json は意図的に含めません）
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './manual.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// クライアントからのメッセージで待機中SWを即時有効化
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// インストール: 移行画面のファイルを事前キャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES))
  );
  self.skipWaiting();
});

// アクティベート: 古いキャッシュ（questions.json を含む旧キャッシュ）を全削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('study-app-') && key !== CACHE_NAME)
          .map(key => {
            console.log('古いキャッシュを削除:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// フェッチ戦略:
//   questions.json     → キャッシュを一切使わず、キャッシュにも残さない（問題データの配布・保持を防ぐ）
//   index.html / sw.js → ネット優先（常に最新の移行画面を取得）→ 失敗時キャッシュ
//   その他             → キャッシュ優先 → なければネット取得してキャッシュ更新
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const path = url.pathname;

  // ① questions.json はネット専用。取得できてもキャッシュしない。
  if (path.endsWith('questions.json')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => new Response('{"questions":[]}', {
          headers: { 'Content-Type': 'application/json' }
        }))
    );
    return;
  }

  // ② index.html・sw.js はネット優先（移行画面を確実に最新へ）
  const networkFirst = path.endsWith('index.html') ||
                       path.endsWith('sw.js') ||
                       path === url.origin + '/';

  if (networkFirst) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(res => {
          if (res.ok) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // ③ その他（アイコン・マニュアル等）はキャッシュ優先
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        }
        return res;
      });
    })
  );
});
