// Service Worker - はり師きゅう師・あマ指 国試学習アプリ
// キャッシュバージョン: アプリ更新時はここを変更してください
const CACHE_VERSION = 'v2026.5.20';
const CACHE_NAME = 'study-app-' + CACHE_VERSION;

// キャッシュ対象ファイル
const CACHE_FILES = [
  './',
  './index.html',
  './questions.json',
  './manifest.json',
  './manual.html',
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
      await cache.addAll(CACHE_FILES);
      for (const url of CACHE_CDN) {
        try { await cache.add(url); }
        catch (e) { console.warn('CDNキャッシュ失敗（オフライン時は正常）:', url); }
      }
    })
  );
  // 待機中のSWをすぐに有効化（古いSWを即座に置き換える）
  self.skipWaiting();
});

// アクティベート: 古いキャッシュを削除して即座に全クライアントを制御
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
    ).then(() => self.clients.claim()) // 全クライアントを即座に制御下に
  );
});

// フェッチ戦略:
//   index.html / sw.js → ネット優先（常に最新を取得）→ 失敗時キャッシュ
//   questions.json     → ネット優先（常に最新を取得）→ 失敗時キャッシュ
//   その他             → キャッシュ優先 → なければネット取得してキャッシュ更新
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const path = url.pathname;

  // ③ index.html・sw.js・questions.json はネット優先（ブラウザキャッシュを上書き）
  const networkFirst = path.endsWith('index.html') ||
                       path.endsWith('sw.js') ||
                       path.endsWith('questions.json') ||
                       path === url.origin + '/';

  if (networkFirst) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }) // ブラウザキャッシュを使わずネット取得
        .then(res => {
          if (res.ok) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
          }
          return res;
        })
        .catch(() => {
          // オフライン時はService Workerキャッシュから返す
          return caches.match(event.request);
        })
    );
    return;
  }

  // その他（アイコン・マニュアル・CDN等）はキャッシュ優先
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
