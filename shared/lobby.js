/* Shared waiting-room panels: player colours, saved avatar look, dress-up panel, emote buttons and room roster.
 The look is saved under 'ecoa-look', so a player's avatar carries over between games.
 Needs from the game: myCol, room, roomCode and rosterRows() returning [{name,col,rd,me,host}]. */
'use strict';
const DR=document.getElementById('dress');
const PCOL=['#2F8CFF','#FF6B9A','#FFB02E','#7B61FF','#2EC4B6','#FF6B4A','#8BD450','#E85DFF'];
const SW=['#2F8CFF','#FF6B9A','#FFB02E','#7B61FF','#2EC4B6','#FF6B4A','#8BD450','#E85DFF','#17203A','#F2F2F2','#C0392B','#00B8D9','#6C757D','#A0522D','#FFD6A5','#3FA34D'];
const EMOTES=['','Wave','Dance','Cheer'],EMOJI=['','\u{1F44B}','\u{1F483}','\u{1F389}'];
const emoBtn=(i,on)=>`<button type="button" class="chip big" data-a="emo" data-v="${i}" aria-pressed="${on}"><span class="ek">${i}</span><span class="ee">${EMOJI[i]}</span>${EMOTES[i]}</button>`;
const LKEY={hat:'h',eye:'y',gl:'g',out:'o',pat:'p',shoe:'l'};
let look={c:'',h:0,g:0,y:0,o:0,p:0,l:0};
try{const s=JSON.parse(localStorage.getItem('ecoa-look')||'{}');if(/^#[0-9a-fA-F]{6}$/.test(s.c))look.c=s.c;look.h=clamp(s.h|0,0,10);look.g=clamp(s.g|0,0,3);look.y=clamp(s.y|0,0,4);look.o=clamp(s.o|0,0,4);look.p=clamp(s.p|0,0,2);look.l=clamp(s.l|0,0,5)}catch(e){}
function rosterHTML(){const rs=rosterRows();return rs.map(r=>`<div class="rs${r.rd?' on':''}"><i style="background:${esc(r.col)}"></i><span class="rn">${esc(r.name)}${r.me?' (you)':''}</span>${r.host?'<span class="rh" title="Room host">&#128081; Host</span>':''}</div>`).join('')}
function roomTop(){if(!room)return'';return `<div class="rc"><span class="rc-l">Room code</span><b class="rc-c">${esc(roomCode)}</b></div><div class="rc-b"><button class="btn sm alt" data-a="copylink" type="button">Copy invite link</button><button class="btn ghost sm" data-a="copycode" type="button">Copy code</button></div>`}
function rosterPanel(){if(!room)return'';return `<div class="roster-h">Players in the room</div><div id="roster" class="roster">${rosterHTML()}</div>`}
function randLook(){const R=n=>Math.random()*n|0;myCol=SW[R(SW.length)];look.c=myCol;look.h=R(HATS.length);look.g=0;look.y=R(EYES.length);look.o=R(OUTS.length);look.p=R(PATS.length);look.l=R(SHOES.length)}
const LISTS={hat:()=>HATS,eye:()=>EYES,gl:()=>GLS,out:()=>OUTS,pat:()=>PATS,shoe:()=>SHOES};
function buildDress(){
  const row=(k,lab)=>{const L=LISTS[k](),cur=look[LKEY[k]]|0;return`<div class="ar"><span class="al">${lab}</span><button type="button" class="arw" data-a="step" data-k="${k}" data-d="-1" aria-label="Previous ${lab}">&#9664;</button><b class="av">${esc(L[cur])}</b><button type="button" class="arw" data-a="step" data-k="${k}" data-d="1" aria-label="Next ${lab}">&#9654;</button></div>`};
  DR.innerHTML=(`<h2>Dress your digital implementation manager</h2>
  <div class="dr"><canvas id="dv" width="220" height="260" aria-label="Your runner"></canvas>
  <div class="dcol"><h3>Head</h3>${row('hat','Hat')}${row('eye','Eyes')}
  <h3>Body</h3>${row('out','Outfit')}${row('pat','Pattern')}<div class="ar"><span class="al">Colour</span><span class="sw">${SW.map(c=>`<button type="button" class="swb" data-a="col" data-v="${c}" style="background:${c}" aria-label="Colour ${c}" aria-pressed="${myCol===c}"></button>`).join('')}</span></div>
  <h3>Legs</h3>${row('shoe','Shoes')}</div></div>
  <div class="row"><button class="btn alt sm" data-a="rand" type="button">Surprise me</button></div>`)}
function applyLook(o){o.col=myCol;o.hat=look.h;o.gl=look.g;o.eye=look.y;o.fit=look.o;o.pat=look.p;o.shoe=look.l}
