// Service Worker - はり師きゅう師・あマ指 国試学習アプリ
// キャッシュバージョン: アプリ更新時はここを変更してください
const CACHE_VERSION = 'v2026.5.19';
const CACHE_NAME = 'study-app-' + CACHE_VERSION;

// キャッシュ対象ファイル
const CACHE_FILES = [
  './',
  './index.html',
  './questions.json',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// 外部CDN（jsPDF）もキャッシュ
const CACHE_CDN = [
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
];

// インストール: キャッシュ対象ファイルを事前キャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // ローカルファイルをキャッシュ
      await cache.addAll(CACHE_FILES);
      // CDNファイルは失敗してもインストールを止めない
      for (const url of CACHE_CDN) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn('CDNキャッシュ失敗（オフライン時は正常）:', url);
        }
      }
    })
  );
  // 待機中のSWをすぐに有効化
  self.skipWaiting();
});

// アクティベート: 古いキャッシュを削除
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
    )
  );
  // 全クライアントを即座に制御下に置く
  self.clients.claim();
});

// フェッチ: キャッシュ優先（オフライン対応）
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // questions.json は「ネット優先 → 失敗時キャッシュ」で常に最新を取得
  if (url.pathname.endsWith('questions.json')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          // 取得成功したらキャッシュを更新
          if (res.ok) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
          }
          return res;
        })
        .catch(() => {
          // オフライン時はキャッシュから返す
          return caches.match(event.request);
        })
    );
    return;
  }

  // その他のファイルは「キャッシュ優先 → なければネット」
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        // 正常なレスポンスはキャッシュに追加
        if (res && res.status === 200 && res.type !== 'opaque') {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        }
        return res;
      });
    })
  );
});
