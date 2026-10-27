/* Shared multiplayer rooms: joins a team room through Claude (window.claude) when available,
 otherwise through the WebSocket relay server. Messages: presence per player plus named events. */
'use strict';
let netMsg='';
const RELAY_URL='https://gray-puffin-1203.petergmorrice.deno.net';
const relayUrl=()=>{try{return new URLSearchParams(location.search).get('relay')||RELAY_URL}catch(e){return RELAY_URL}};
/* Team rooms outside Claude: a small relay server passes messages between everyone with the same room code. */
function relayJoin(base,code){return new Promise((res,rej)=>{
  const url=base.trim().replace(/^http/i,'ws').replace(/\/+$/,'')+'/'+encodeURIComponent(code);
  const peers=new Map(),hs={},pcb=[];let ws=null,closed=false,opened=false,lastP=null,tries=0,gotFirst=false;
  const fire=()=>{const list=[...peers].map(([peer,presence])=>({peer,presence,sameTab:false}));for(const f of pcb){try{f({peers:list})}catch(e){}}};
  const wsend=o=>{if(ws&&ws.readyState===1){try{ws.send(JSON.stringify(o))}catch(e){}}};
  const room={
    on(t,f){hs[t]=f},onPeers(f){pcb.push(f);fire()},
    emit(t,d){wsend({t:'ev',topic:t,data:d});return Promise.resolve()},
    presence(o){lastP=o;wsend({t:'pres',d:o});return Promise.resolve()},
    leave(){closed=true;try{ws&&ws.close()}catch(e){}return Promise.resolve()}};
  const to=setTimeout(()=>{if(!opened){closed=true;try{ws&&ws.close()}catch(e){}rej(new Error('timeout'))}},8000);
  const connect=()=>{
    try{ws=new WebSocket(url)}catch(e){clearTimeout(to);rej(e);return}
    ws.onopen=()=>{opened=true;tries=0;netMsg='';clearTimeout(to);if(lastP)wsend({t:'pres',d:lastP});if(!gotFirst){gotFirst=true;res(room)}else{const e=document.getElementById('err');if(e)e.hidden=true}};
    ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}
      if(m.t==='pres'){peers.set(m.id,m.d);fire()}
      else if(m.t==='leave'){if(peers.delete(m.id))fire()}
      else if(m.t==='ev'&&hs[m.topic]){try{hs[m.topic]({data:m.data,sameTab:false,peer:m.id})}catch(e){}}};
    ws.onclose=()=>{if(closed)return;peers.clear();fire();if(!opened){clearTimeout(to);rej(new Error('closed'));return}
      if(tries<6){tries++;netMsg='Connection lost. Reconnecting...';showErr('Connection lost. Reconnecting...');setTimeout(connect,1000*tries)}else{netMsg='Connection lost. Leave the room and rejoin, or play solo.';showErr('Connection to the multiplayer server was lost. You can still play solo.')}};
    ws.onerror=()=>{}};
  connect()})}
const use=n=>(window.claude&&window.claude.use)?window.claude.use(n).catch(()=>null):Promise.resolve(null);
function showErr(m){const e=document.getElementById('err');if(e){e.textContent=m;e.hidden=false}}
function copyText(s,b,msg){const done=()=>{if(!b)return;const o=b.textContent;b.textContent=msg;setTimeout(()=>{b.textContent=o},1600)};
  try{navigator.clipboard.writeText(s).then(done,()=>fb())}catch(e){fb()}
  function fb(){try{const ta=document.createElement('textarea');ta.value=s;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();done()}catch(e){}}}
