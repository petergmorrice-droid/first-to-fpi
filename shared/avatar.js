/* Shared avatar: the little runner every game uses, its outfits and the dress-up preview.
 Needs from the game: state.cam and myName (the label drawn over your own avatar). */
'use strict';
function drawRunner(r,t,isYou,solid){
  if(r.respawn>0)return;const sx=r.x-state.cam+r.w/2,sy=r.y+r.h;if(sx<-60||sx>W+60)return;
  let a=(r.out&&!r.fin)?.35:1;if(!isYou&&!solid)a=.5;if(r.inv>0&&Math.floor(t*18)%2)a*=.45;cx.globalAlpha=a;
  const st=clamp(Math.abs(r.vy)/3200,0,.28),sY=1+(r.vy<0?st:-st*.6),sX=1/sY;
  cx.save();cx.translate(sx,sy);
  cx.fillStyle='rgba(23,32,58,.18)';cx.beginPath();cx.ellipse(0,1,13,4,0,0,6.3);cx.fill();
  const ph=Math.sin(r.walk*2.2),lift=r.onG?Math.abs(ph)*4:5;
  drawFeet(r,-3-(ph>0?lift:0),-3-(ph<0?lift:0));
  const em=r.em|0,f=r.face||1;
  if(em===2){cx.translate(0,-Math.abs(Math.sin(t*9))*6);cx.rotate(Math.sin(t*9)*.16)}
  cx.scale(sX,sY);cx.rotate(clamp(r.vx/240,-1,1)*.1+(r.stun>0?Math.sin(t*30)*.15:0));
  drawBack(r,f);
  const g=cx.createLinearGradient(-14,-38,14,0);g.addColorStop(0,mix(r.col,'#ffffff',.4));g.addColorStop(.55,r.col);g.addColorStop(1,mix(r.col,'#000000',.22));
  rr(-14,-38,28,36,14);cx.fillStyle=g;cx.fill();cx.lineWidth=1.6;cx.strokeStyle=mix(r.col,'#000000',.4);cx.stroke();
  const pt=r.pat|0;if(pt){cx.save();rr(-14,-38,28,36,14);cx.clip();
    if(pt===1){cx.fillStyle='rgba(23,32,58,.2)';for(let y=-34;y<-2;y+=9)cx.fillRect(-15,y,30,4.5)}
    else{cx.fillStyle='rgba(255,255,255,.34)';for(const [px,py,pr] of [[-8,-30,3],[7,-33,2.4],[-3,-20,3.2],[9,-18,2.8],[-9,-9,2.6],[3,-7,3]]){cx.beginPath();cx.arc(px,py,pr,0,6.3);cx.fill()}}
    cx.restore()}
  drawEyes(r,f);
  if(r.stun>0){cx.fillStyle=C.ink;cx.beginPath();cx.arc(f*3,-18,2.2,0,6.3);cx.fill()}
  if(em===1||em===3){const sw=em===3?Math.sin(t*14):Math.sin(t*9);
    for(const s of em===3?[-1,1]:[1]){const ex=s*(15+sw*3*s*(em===3?1:0)+ (em===1?5:3)),ey=-39+(em===3?Math.abs(sw)*-5:0);
      cx.strokeStyle=mix(r.col,'#000000',.2);cx.lineWidth=6;cx.lineCap='round';cx.beginPath();cx.moveTo(s*13,-22);cx.lineTo(ex+(em===1?sw*6:0),ey);cx.stroke();
      cx.fillStyle='#fff';cx.beginPath();cx.arc(ex+(em===1?sw*6:0),ey-1,4.5,0,6.3);cx.fill()}}
  else if(em===2){const sw=Math.sin(t*9);for(const s of[-1,1]){cx.strokeStyle=mix(r.col,'#000000',.2);cx.lineWidth=6;cx.lineCap='round';const ey=-30-sw*s*10;cx.beginPath();cx.moveTo(s*13,-22);cx.lineTo(s*22,ey);cx.stroke();cx.fillStyle='#fff';cx.beginPath();cx.arc(s*22,ey-1,4.5,0,6.3);cx.fill()}}
  drawLook(r,f);
  cx.restore();cx.globalAlpha=1;
  if(isYou){const b=Math.sin(t*6)*3;cx.fillStyle=C.gold;cx.beginPath();cx.moveTo(sx,r.y-10+b);cx.lineTo(sx-8,r.y-22+b);cx.lineTo(sx+8,r.y-22+b);cx.fill();txt(myName||'YOU',sx,r.y-31+b,16,C.gold,'center',[C.ink,5])}
  else if(r.nameA!==undefined){if(r.nameA>.05){cx.globalAlpha=r.nameA;txt(r.name,sx,r.y-10,14,'#fff','center',[C.ink,4]);cx.globalAlpha=1}}
  else txt(r.name,sx,r.y-10,14,'#fff','center',[C.ink,4]);
}
function drawFeet(r,yl,yr){
  const s=r.shoe|0,dk=mix(r.col,'#000000',.35);
  for(const [fx,fy] of [[-7,yl],[7,yr]]){
    if(s===0){cx.fillStyle=dk;cx.beginPath();cx.ellipse(fx,fy,6,5,0,0,6.3);cx.fill()}
    else if(s===1){cx.fillStyle='#fff';cx.beginPath();cx.ellipse(fx,fy,7,5.4,0,0,6.3);cx.fill();cx.lineWidth=1.6;cx.strokeStyle=C.ink;cx.stroke();cx.fillStyle=C.signal;cx.fillRect(fx-4,fy-1.5,8,2.4)}
    else if(s===2){rr(fx-6,fy-8,12,12,3);cx.fillStyle='#8A5A2B';cx.fill();cx.fillStyle='#5C3A19';cx.fillRect(fx-6.5,fy+2,13,3)}
    else if(s===3){cx.fillStyle='#fff';cx.beginPath();cx.ellipse(fx,fy,6,5,0,0,6.3);cx.fill();for(let i=0;i<2;i++){cx.fillStyle=i?'#fff':C.signal;cx.fillRect(fx-5,fy-9+i*3,10,3)}cx.fillStyle=C.signal;cx.fillRect(fx-5,fy-3,10,2.5)}
    else if(s===4){cx.fillStyle=C.gold;cx.beginPath();cx.ellipse(fx,fy,7,5.4,0,0,6.3);cx.fill();cx.lineWidth=1.8;cx.strokeStyle=C.goldD;cx.stroke()}
    else{cx.fillStyle='#FF8A3D';cx.beginPath();cx.ellipse(fx+(fx<0?-2:2),fy+1,10,3.6,0,0,6.3);cx.fill();cx.lineWidth=1.5;cx.strokeStyle='#C25F1B';cx.stroke()}
  }}
function drawEyes(r,f){
  const e=r.eye|0,xs=[f*3-4,f*3+5],d=f*1.8;
  const white=(x,R)=>{cx.fillStyle='#fff';cx.beginPath();cx.arc(x,-27,R,0,6.3);cx.fill()};
  const pupil=(x,R)=>{cx.fillStyle=C.ink;cx.beginPath();cx.arc(x+d,-27,R,0,6.3);cx.fill()};
  const arc=x=>{cx.strokeStyle=C.ink;cx.lineWidth=2.6;cx.lineCap='round';cx.beginPath();cx.arc(x,-25,4,Math.PI*1.1,Math.PI*1.9);cx.stroke()};
  xs.forEach((x,i)=>{
    if(e===1){arc(x)}
    else if(e===3&&i===1){cx.strokeStyle=C.ink;cx.lineWidth=2.6;cx.lineCap='round';cx.beginPath();cx.moveTo(x-4,-27);cx.lineTo(x+4,-27);cx.stroke()}
    else if(e===4){white(x,6.6);pupil(x,3.4);cx.fillStyle='#fff';cx.beginPath();cx.arc(x+d-1,-28.5,1.1,0,6.3);cx.fill()}
    else{white(x,5);pupil(x,2.2);
      if(e===2){cx.fillStyle=r.col;cx.beginPath();cx.moveTo(x-5.4,-27);cx.arc(x,-27,5.4,Math.PI,2*Math.PI);cx.closePath();cx.fill();cx.strokeStyle=C.ink;cx.lineWidth=1.6;cx.beginPath();cx.moveTo(x-5,-27);cx.lineTo(x+5,-27);cx.stroke()}}
  })}
/* things drawn behind the body: backpack and cape */
function drawBack(r,f){
  const o=r.fit|0;
  if(o===3){rr(f>0?-22:10,-32,12,22,4);cx.fillStyle=C.violet;cx.fill();cx.fillStyle=C.gold;cx.fillRect(f>0?-19:13,-24,6,3)}
  else if(o===4){cx.beginPath();cx.moveTo(-9*f,-34);cx.lineTo(9*f,-34);cx.lineTo(-f*19,-4);cx.lineTo(-f*4,-6);cx.closePath();cx.fillStyle=C.signal;cx.fill()}
}
/* ---------- avatar looks: hats and glasses ---------- */
const HATS=['None','Cap','Hard hat','Party','Crown','Headset','Antennae','Beanie','Top hat','Flower','Halo'],GLS=['None','Round','Shades','Square'],EYES=['Normal','Happy','Sleepy','Wink','Big'],OUTS=['None','Bow tie','Scarf','Backpack','Cape'],PATS=['Plain','Stripes','Spots'],SHOES=['Default','Trainers','Boots','Socks','Gold shoes','Flippers'];
function drawLook(r,f){
  const h=r.hat|0,g=r.gl|0,x0=f*3;cx.lineJoin='round';cx.lineCap='round';
  if(g===3){cx.strokeStyle=C.ink;cx.lineWidth=2;rr(x0-10.5,-31,9,8,2);cx.stroke();rr(x0+1.5,-31,9,8,2);cx.stroke();cx.beginPath();cx.moveTo(x0-1.5,-27);cx.lineTo(x0+1.5,-27);cx.stroke()}
  else if(g===1){cx.strokeStyle=C.ink;cx.lineWidth=2;cx.beginPath();cx.arc(x0-4,-27,6.6,0,6.3);cx.moveTo(x0+11.6,-27);cx.arc(x0+5,-27,6.6,0,6.3);cx.moveTo(x0+2.6,-27);cx.lineTo(x0-.4,-27);cx.stroke()}
  else if(g===2){rr(x0-11,-32,22,9,3.5);cx.fillStyle=C.ink;cx.fill();cx.fillStyle='rgba(255,255,255,.35)';cx.fillRect(x0-8,-30,5,2);cx.fillRect(x0+2,-30,5,2)}
  if(h===1){cx.fillStyle=C.signal;cx.beginPath();cx.arc(x0,-36,13,Math.PI,0);cx.fill();rr(f>0?x0+1:x0-17,-38,16,4.5,2);cx.fill();cx.fillStyle='#fff';cx.beginPath();cx.arc(x0,-49,2,0,6.3);cx.fill()}
  else if(h===2){cx.fillStyle=C.gold;rr(x0-13,-47,26,12,6);cx.fill();rr(x0-3,-50,6,6,2);cx.fill();rr(x0-16,-38,32,4.5,2);cx.fillStyle=C.goldD;cx.fill()}
  else if(h===3){cx.beginPath();cx.moveTo(x0-10,-36);cx.lineTo(x0+10,-36);cx.lineTo(x0+1,-63);cx.closePath();cx.fillStyle=C.violet;cx.fill();cx.strokeStyle='#fff';cx.lineWidth=2.5;cx.beginPath();cx.moveTo(x0-6,-44);cx.lineTo(x0+5,-48);cx.moveTo(x0-3,-52);cx.lineTo(x0+3,-54);cx.stroke();cx.beginPath();cx.arc(x0+1,-64,3.5,0,6.3);cx.fillStyle=C.gold;cx.fill()}
  else if(h===4){cx.beginPath();cx.moveTo(x0-12,-36);cx.lineTo(x0-13,-51);cx.lineTo(x0-6,-44);cx.lineTo(x0,-54);cx.lineTo(x0+6,-44);cx.lineTo(x0+13,-51);cx.lineTo(x0+12,-36);cx.closePath();cx.fillStyle=C.gold;cx.fill();cx.lineWidth=2;cx.strokeStyle=C.goldD;cx.stroke()}
  else if(h===5){cx.strokeStyle=C.ink;cx.lineWidth=3;cx.beginPath();cx.arc(x0,-24,16.5,Math.PI*1.02,Math.PI*1.98);cx.stroke();rr(x0-19,-31,7,14,3);cx.fillStyle=C.violet;cx.fill();rr(x0+12,-31,7,14,3);cx.fill();cx.lineWidth=2.4;cx.beginPath();cx.moveTo(x0+f*15,-17);cx.quadraticCurveTo(x0+f*15,-9,x0+f*7,-8);cx.stroke()}
  else if(h===6){for(const s of[-1,1]){cx.strokeStyle=C.ink;cx.lineWidth=2.2;cx.beginPath();cx.moveTo(x0+s*5,-37);cx.quadraticCurveTo(x0+s*9,-48,x0+s*12,-53);cx.stroke();cx.beginPath();cx.arc(x0+s*12,-54,3.6,0,6.3);cx.fillStyle=s>0?C.signal:C.tealL;cx.fill()}}
  else if(h===7){cx.fillStyle=C.violet;cx.beginPath();cx.arc(x0,-36,13,Math.PI,0);cx.fill();rr(x0-14,-40,28,6,3);cx.fillStyle=C.tealL;cx.fill();cx.fillStyle='#fff';cx.beginPath();cx.arc(x0,-50,3.4,0,6.3);cx.fill()}
  else if(h===8){cx.fillStyle=C.ink;rr(x0-15,-39,30,5,2.5);cx.fill();rr(x0-9,-58,18,20,3);cx.fill();cx.fillStyle=C.signal;cx.fillRect(x0-9,-45,18,4)}
  else if(h===9){cx.strokeStyle='#3FA34D';cx.lineWidth=2;cx.beginPath();cx.moveTo(x0,-37);cx.lineTo(x0,-44);cx.stroke();for(let i=0;i<5;i++){const a=i*1.2566;cx.beginPath();cx.arc(x0+Math.cos(a)*4.6,-48+Math.sin(a)*4.6,3.6,0,6.3);cx.fillStyle='#FF6B9A';cx.fill()}cx.beginPath();cx.arc(x0,-48,3,0,6.3);cx.fillStyle=C.gold;cx.fill()}
  else if(h===10){cx.strokeStyle=C.gold;cx.lineWidth=3.2;cx.beginPath();cx.ellipse(x0,-46,11,3.6,0,0,6.3);cx.stroke()}
  const o=r.fit|0;
  if(o===1){cx.fillStyle=C.signal;cx.beginPath();cx.moveTo(x0,-13);cx.lineTo(x0-9,-18);cx.lineTo(x0-9,-8);cx.closePath();cx.moveTo(x0,-13);cx.lineTo(x0+9,-18);cx.lineTo(x0+9,-8);cx.closePath();cx.fill();cx.beginPath();cx.arc(x0,-13,2.8,0,6.3);cx.fillStyle=C.goldD;cx.fill()}
  else if(o===2){rr(x0-15,-15,30,7,3.5);cx.fillStyle=C.tealD;cx.fill();rr(x0+(f>0?3:-9),-10,7,13,3);cx.fill()}
}
function drawDressPreview(c,t,lk){
  withCtx(c.getContext('2d'),()=>{
    const w=c.width,h=c.height;cx.clearRect(0,0,w,h);
    const g=cx.createRadialGradient(w/2,h*.55,10,w/2,h*.55,w*.8);g.addColorStop(0,'#EAF7F2');g.addColorStop(1,'#CFF1E7');cx.fillStyle=g;cx.fillRect(0,0,w,h);
    cx.fillStyle='rgba(18,165,148,.35)';cx.beginPath();cx.ellipse(w/2,h-26,w*.34,10,0,0,6.3);cx.fill();
    const k=3.3;cx.save();cx.scale(k,k);
    const wave=(t%7)<1.8;
    const r=Object.assign({},lk,{x:w/k/2-14,y:(h-26)/k-38,w:28,h:38,vx:0,vy:0,onG:true,walk:0,face:1,stun:0,inv:0,respawn:0,out:false,fin:false,name:'',em:wave?1:0});
    const sc=state.cam;state.cam=0;drawRunner(r,t,false,true);state.cam=sc;cx.restore()})}
