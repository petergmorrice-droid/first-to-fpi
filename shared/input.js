/* Shared controls: arrow/WASD key map, on-screen touch buttons, mute, exit and leave-room buttons.
 Needs from the game: inp ({l,r,j,jp}) and leaveRoom(). The game adds its own keydown handler using KM. */
'use strict';
const KM={ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',ArrowUp:'j',KeyW:'j',Space:'j'};
addEventListener('keyup',e=>{const k=KM[e.code];if(!k)return;inp[k]=false});
addEventListener('blur',()=>{inp.l=inp.r=inp.j=false});
function bindBtn(id,k){const b=document.getElementById(id);
  const on=e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){}b.classList.add('on');if(k==='j'){inp.j=true;inp.jp=true}else inp[k]=true};
  const off=()=>{b.classList.remove('on');inp[k]=false};
  b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('lostpointercapture',off);b.addEventListener('contextmenu',e=>e.preventDefault())}
bindBtn('bL','l');bindBtn('bR','r');bindBtn('bJ','j');
{const eb=document.getElementById('exitg');let et=0;
  eb.addEventListener('click',()=>{if(!et){eb.textContent='Tap again to exit';et=setTimeout(()=>{et=0;eb.textContent='Exit game'},3000);return}
    clearTimeout(et);et=0;eb.textContent='Exit game';leaveRoom()})}
document.getElementById('leaveb').addEventListener('click',()=>leaveRoom());
document.getElementById('mute').addEventListener('click',e=>{muted=!muted;e.target.textContent='Sound: '+(muted?'off':'on')});
