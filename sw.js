// Caches the app so D Cast opens with no internet after the first visit.
const V='dcast-v12',FILES=['/','/index.html','/manifest.webmanifest','/logo.svg','/icon-192.png','/icon-512.png','/apple-touch-icon.png','/icons/volume.png','/icons/mute.png','/icons/screenshot-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Network first (3s), cache as fallback: updates show up immediately, and it still opens offline.
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  const cached=()=>caches.match(e.request,{ignoreSearch:true});
  e.respondWith(new Promise(res=>{const t=setTimeout(()=>cached().then(h=>h&&res(h)),3000);
    fetch(e.request).then(r=>{clearTimeout(t);if(r.ok)caches.open(V).then(c=>c.put(e.request,r.clone()));res(r)})
      .catch(()=>{clearTimeout(t);cached().then(h=>res(h||Response.error()))})}))});
