/* Shared core for the avatar game library: canvas, helpers, drawing primitives, sound and particles.
 Each game defines W and H (its canvas size in game units) and a `state` object with a `cam` field
 before calling anything here. The page must contain <canvas id="c">. */
'use strict';
const cv=document.getElementById('c');let cx=cv.getContext('2d');
const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=t=>{t=Math.max(0,t);const m=Math.floor(t/60),s=t-m*60;return m+':'+(s<10?'0':'')+s.toFixed(1)};

/* ---------- audio ---------- */
let AC=null,muted=false;
function beep(f,d,type,v,slide){if(muted)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
  const o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.value=f;if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),AC.currentTime+d);
  g.gain.value=v||.05;g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
const SFX={jump:()=>beep(380,.13,'square',.04,320),coin:()=>{beep(880,.08,'triangle',.07);setTimeout(()=>beep(1320,.12,'triangle',.07),60)},
  hit:()=>beep(160,.3,'sawtooth',.07,-110),good:()=>{beep(520,.1,'triangle',.08);setTimeout(()=>beep(780,.18,'triangle',.08),90)},
  late:()=>beep(220,.28,'square',.06,-80),tick:()=>beep(600,.08,'square',.05),go:()=>beep(900,.4,'square',.07),
  fall:()=>beep(500,.5,'triangle',.06,-420),throw:()=>beep(700,.12,'triangle',.04,-300),win:()=>{[523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,.2,'triangle',.08),i*110))}};

/* ---------- particles ---------- */
let parts=[];
function burst(x,y,col,n,sp,up){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=sp*(.3+Math.random());parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(up||0),life:.5+Math.random()*.4,max:.9,col,r:2+Math.random()*3})}}
function stepParts(dt){for(const p of parts){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=700*dt}parts=parts.filter(p=>p.life>0)}
function drawParts(){for(const p of parts){cx.globalAlpha=clamp(p.life/.4,0,1);cx.fillStyle=p.col;cx.beginPath();cx.arc(p.x-state.cam,p.y,p.r,0,6.3);cx.fill()}cx.globalAlpha=1}

/* ---------- canvas drawing ---------- */
const FD='"Baloo 2","Trebuchet MS",system-ui,sans-serif';
const C={ink:'#17203A',teal:'#12A594',tealL:'#46D6C4',tealD:'#0B6E66',signal:'#FF5436',gold:'#FFC83D',goldD:'#C98F00',violet:'#6B4EFF',violetL:'#9783FF'};
function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath()}
function mix(a,b,k){const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A=p(a),B=p(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*k)).join(',')+')'}
function txt(s,x,y,size,col,align,stroke){cx.font='800 '+size+'px '+FD;cx.textAlign=align||'left';cx.textBaseline='middle';
  if(stroke){cx.lineWidth=stroke[1];cx.strokeStyle=stroke[0];cx.lineJoin='round';cx.strokeText(s,x,y)}cx.fillStyle=col;cx.fillText(s,x,y)}
function hash(k){const s=Math.sin(k*127.1+311.7)*43758.5453;return s-Math.floor(s)}
function layer(par,period,cam,fn){const k0=Math.floor(cam*par/period)-1,n=Math.ceil(W/period)+3;for(let k=k0;k<k0+n;k++)fn(k*period-cam*par,k)}
function withCtx(ctx,fn){const o=cx;cx=ctx;try{fn()}finally{cx=o}}

/* ---------- text and misc helpers ---------- */
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function hashStr(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
/* scale the canvas backing store to the screen (1x to 2x), keeping w by h game units */
function fitCanvas(w,h){const S=Math.min(2,Math.max(1,Math.round(((cv.clientWidth||w)*(window.devicePixelRatio||1)/w)*4)/4));
  if(cv.width!==Math.round(w*S)){cv.width=Math.round(w*S);cv.height=Math.round(h*S)}
  cx.setTransform(cv.width/w,0,0,cv.width/w,0,0)}
/* run go() once the game fonts are loaded, or after 1.5 s at most */
function whenFontsReady(go){
  if(document.fonts&&document.fonts.load){Promise.race([Promise.all([document.fonts.load('800 20px "Baloo 2"'),document.fonts.load('700 14px "Figtree"')]),new Promise(r=>setTimeout(r,1500))]).then(go,go)}else go()}
