(function(root){
 const defaults={focus:25,short:5,long:15,sound:true};
 function dayKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
 function remaining(end,now=Date.now()){return Math.max(0,Math.ceil((end-now)/1000));}
 function next(mode,count){return mode==='focus'?(count>0&&count%4===0?'long':'short'):'focus';}
 function format(s){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
 function cleanSettings(v={}){const s={...defaults};for(const [k,max] of [['focus',180],['short',60],['long',120]])if(Number.isInteger(v[k])&&v[k]>=1&&v[k]<=max)s[k]=v[k];if(typeof v.sound==='boolean')s.sound=v.sound;return s;}
 const api={defaults,dayKey,remaining,next,format,cleanSettings};if(typeof module!=='undefined')module.exports=api;else root.FocusCore=api;
})(globalThis);
