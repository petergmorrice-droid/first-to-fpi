/* Shared live leaderboard under the stage; rows slide to their new rank. */
'use strict';
const BD=document.getElementById('board'),BDI=document.getElementById('bdIn'),bdRows=new Map(),bdIds=new WeakMap();let bdN=0;
function bdId(o){let k=bdIds.get(o);if(!k){k='r'+(++bdN);bdIds.set(o,k)}return k}
function setBoardTitle(s){const h=BD.querySelector('.bd-h');if(h)h.textContent=s}
/* ents: already sorted, each {id,name,col,me,fin,pc} where pc is the right-hand text */
function renderBoard(ents){
  const n=ents.length,cols=n>7?2:1,per=Math.ceil(n/cols),RH=32;BDI.style.height=per*RH-4+'px';
  const seen=new Set();
  ents.forEach((e,i)=>{seen.add(e.id);let o=bdRows.get(e.id);
    if(!o){const el=document.createElement('div');el.className='bd-row';el.innerHTML='<b class="bn"></b><i></i><span class="bnm"></span><span class="bpc"></span>';BDI.appendChild(el);o={el,rank:i,nn:el.children[0],dot:el.children[1],nm:el.children[2],pc:el.children[3],ft:0};bdRows.set(e.id,o)}
    if(i!==o.rank){o.el.classList.remove('up','dn');void o.el.offsetWidth;o.el.classList.add(i<o.rank?'up':'dn');clearTimeout(o.ft);o.ft=setTimeout(()=>o.el.classList.remove('up','dn'),700);o.rank=i}
    const col=i%per,cI=Math.floor(i/per),w=100/cols;
    o.el.style.width='calc('+w+'% - '+(cols>1?4:0)+'px)';o.el.style.transform='translate('+(cI?'calc('+100+'% + 8px)':'0px')+','+col*RH+'px)';
    o.el.classList.toggle('me',!!e.me);o.el.classList.toggle('fin',e.fin);
    o.nn.textContent=i+1;o.dot.style.background=e.col||'#fff';o.nm.textContent=e.name+(e.me?' (you)':'');o.pc.textContent=e.pc});
  for(const[k,o]of bdRows)if(!seen.has(k)){o.el.remove();bdRows.delete(k)}}
function clearBoard(){for(const o of bdRows.values())o.el.remove();bdRows.clear()}
