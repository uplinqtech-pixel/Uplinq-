/* VYBRION service worker: keeps Firebase code + the app on the phone so it opens fast on weak networks */
const V='vybrion-v45';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 let u;try{u=new URL(r.url)}catch(_){return}
 if(u.hostname==='www.gstatic.com'&&u.pathname.indexOf('/firebasejs/')===0){
  e.respondWith(caches.open(V).then(async c=>{const m=await c.match(r);if(m)return m;const n=await fetch(r);if(n&&n.ok)c.put(r,n.clone());return n}));return}
 if(u.origin===self.location.origin&&(r.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname))){
  e.respondWith(caches.open(V).then(async c=>{const m=await c.match(r);
   const net=fetch(r).then(n=>{if(n&&n.ok)c.put(r,n.clone());return n}).catch(()=>null);
   return m||(await net)||new Response('Offline',{status:503})}));}
});
