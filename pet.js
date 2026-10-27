(() => {
  'use strict';
  const panel = document.createElement('section');
  panel.className = 'pet-panel';
  panel.setAttribute('aria-label', 'Your cat companion');
  panel.innerHTML = `<div class="pet-heading"><div><span class="eyebrow">A LITTLE COMPANY</span><h2>Meet Mochi <span>Your focus buddy</span></h2></div><div class="pet-buttons"><button id="pet-play" class="outline">Toss a ball</button><button id="pet-hide" class="text-button">Hide cat</button></div></div><div id="pet-garden"><span class="pet-ground" aria-hidden="true"></span><span class="pet-grass" aria-hidden="true">✦ &nbsp; ˖ &nbsp; ✦</span><span id="pet-ball" hidden aria-hidden="true"></span><button id="pet-cat" aria-label="Pet Mochi the cat"><span id="pet-reaction" aria-hidden="true"></span><svg viewBox="0 0 48 40" width="96" height="80" shape-rendering="crispEdges" aria-hidden="true"><g class="cat-tail" fill="#b47645"><path d="M35 24h7V14h4v14H35z"/></g><g class="cat-body"><path fill="#d59b63" d="M12 19h23v15H12z"/><path fill="#efc28d" d="M13 23h16v9H13z"/><path fill="#b47645" d="M24 20h3v7h-3zm6 0h3v7h-3z"/><path class="cat-leg front" fill="#b47645" d="M12 31h7v6h-7z"/><path class="cat-leg back" fill="#b47645" d="M29 31h7v6h-7z"/></g><g class="cat-head"><path fill="#d59b63" d="M7 7h6v4h9V7h6v20H7z"/><path fill="#efa3a1" d="M9 10h3v5H9zm14 0h3v5h-3z"/><path fill="#efc28d" d="M7 18h21v9H7z"/><g class="cat-eyes" fill="#3b342a"><path d="M11 17h3v4h-3zm11 0h3v4h-3z"/></g><path class="cat-sleep-eyes" fill="#3b342a" d="M10 20h5v2h-5zm11 0h5v2h-5z"/><path fill="#b86c66" d="M17 21h3v2h-3z"/><path fill="#8e6447" d="M3 21h5v1H3zm25 0h5v1h-5z"/></g></svg></button></div><p id="pet-message" role="status" aria-live="polite">Click Mochi for a little love, or toss a ball.</p>`;
  document.querySelector('.history').after(panel);
  const garden=panel.querySelector('#pet-garden'),cat=panel.querySelector('#pet-cat'),ball=panel.querySelector('#pet-ball'),reaction=panel.querySelector('#pet-reaction'),play=panel.querySelector('#pet-play'),hide=panel.querySelector('#pet-hide'),message=panel.querySelector('#pet-message');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let hidden=false,sleeping=false,x=16,target=16,last=0,nextWalk=0,chasing=false,affectionUntil=0;
  let speed=0,phase=0,face=-1,turn=0,blinkAt=3000,blinkEnd=0,flight=null,pounceAt=0;
  try { hidden=localStorage.getItem('focusquest.pet.hidden')==='true'; } catch {}
  const body=cat.querySelector('.cat-body'),head=cat.querySelector('.cat-head'),tail=cat.querySelector('.cat-tail');
  const front=cat.querySelector('.front'),back=cat.querySelector('.back'),eyes=cat.querySelector('.cat-eyes');
  function text(value){if(message.textContent!==value)message.textContent=value;}
  function bound(value){return Math.max(0,Math.min(Math.max(0,garden.clientWidth-100),value));}
  function stopPlay(){chasing=false;flight=null;ball.hidden=true;pounceAt=0;speed=0;target=x;}
  function appearance(){garden.hidden=hidden;hide.textContent=hidden?'Show cat':'Hide cat';hide.setAttribute('aria-expanded',String(!hidden));play.disabled=hidden||sleeping;cat.classList.toggle('sleeping',sleeping);if(hidden)text('Mochi is tucked away. Bring your buddy back anytime.');else text(sleeping?'Mochi is napping while you focus. You’ve got this.':'Click Mochi for a little love, or toss a ball.');}
  hide.addEventListener('click',()=>{hidden=!hidden;try{localStorage.setItem('focusquest.pet.hidden',String(hidden));}catch{}stopPlay();appearance();});
  cat.addEventListener('click',()=>{affectionUntil=performance.now()+1800;reaction.textContent='♥';text(sleeping?'A gentle pat. Mochi keeps snoozing.':'Purr… Mochi likes you!');});
  play.addEventListener('click',()=>{if(hidden||sleeping)return;const now=performance.now();target=bound(x<garden.clientWidth/2?garden.clientWidth-125:20);flight={start:now,from:x+42,to:target+42};ball.hidden=false;chasing=true;affectionUntil=0;pounceAt=0;text('Go get it, Mochi!');});
  window.focusQuestPetUpdate=({focusing})=>{if(sleeping===focusing)return;sleeping=focusing;stopPlay();appearance();};
  function frame(now){const dt=Math.min((now-last)/1000||0,.04);last=now;
    if(!hidden&&!document.hidden){
      x=bound(x);target=bound(target);
      if(flight){flight.to=bound(flight.to-42)+42;const t=Math.min(1,(now-flight.start)/1100);const u=1-Math.pow(1-t,2);const bounce=reduced.matches?0:Math.abs(Math.sin(t*Math.PI*3))*(1-t)*65;ball.style.left=(flight.from+(flight.to-flight.from)*u)+'px';ball.style.bottom=(10+bounce)+'px';ball.style.transform=`rotate(${reduced.matches?0:t*540}deg)`;}
      const canMove=!sleeping&&now>affectionUntil&&!pounceAt;
      if(canMove&&!chasing&&now>nextWalk&&Math.abs(target-x)<3){target=bound(x+(Math.random()>.5?1:-1)*(65+Math.random()*160));nextWalk=now+3500+Math.random()*5000;}
      const delta=target-x,maxSpeed=chasing?170:38;
      // Ease in, brake near the goal, and slow down before reversing direction.
      const desired=canMove?Math.sign(delta)*Math.min(maxSpeed,Math.abs(delta)*3):0;
      speed+=(desired-speed)*(1-Math.exp(-dt*7));
      if(canMove){if(reduced.matches){x=target;speed=0;}else x=bound(x+speed*dt);}
      if(Math.abs(speed)>5){const nextFace=speed>0?-1:1;if(nextFace!==face){face=nextFace;turn=now;}}
      const turnScale=reduced.matches?1:1-.22*Math.sin(Math.min(1,(now-turn)/220)*Math.PI);
      cat.style.setProperty('--face',String(face));cat.style.setProperty('--turn',String(turnScale));
      phase+=Math.abs(speed)*dt*.16;
      const moving=Math.abs(speed)>3&&!sleeping&&!reduced.matches;
      const bob=moving?Math.abs(Math.sin(phase))*(chasing?1.1:.55):0;
      const breath=reduced.matches?0:Math.sin(now/(sleeping?650:950))*.32;
      body.style.transform=`translateY(${-bob+breath}px)`;
      head.style.transform=`translateY(${-bob*.6+breath*.4}px) rotate(${!reduced.matches&&now<affectionUntil?-5:0}deg)`;
      front.style.transform=`translate(${moving?Math.sin(phase)*2:0}px,${moving?-Math.max(0,Math.cos(phase))*1.8:0}px)`;
      back.style.transform=`translate(${moving?-Math.sin(phase)*2:0}px,${moving?-Math.max(0,-Math.cos(phase))*1.8:0}px)`;
      tail.style.transform=`rotate(${reduced.matches?0:Math.sin(now/(sleeping?1500:chasing?170:500))*(sleeping?3:12)}deg)`;
      if(now>blinkAt){blinkEnd=now+140;blinkAt=now+2500+Math.random()*4000;}
      eyes.style.transform=`scaleY(${now<blinkEnd&&!reduced.matches?.12:1})`;
      if(chasing&&Math.abs(delta)<9&&flight&&now-flight.start>1100&&!pounceAt){pounceAt=now;speed=0;}
      let hop=0;
      if(pounceAt){const t=Math.min(1,(now-pounceAt)/460);hop=reduced.matches?0:Math.sin(t*Math.PI)*18;if(t===1){stopPlay();affectionUntil=now+1300;reaction.textContent='✦';text('Caught it! A tiny victory for Mochi.');nextWalk=now+4000;}}
      cat.style.left=x+'px';cat.style.bottom=(6+hop)+'px';
      if(now>affectionUntil)reaction.textContent=sleeping?'z z Z':'';
    }
    requestAnimationFrame(frame);
  }
  appearance();requestAnimationFrame(frame);
})();
