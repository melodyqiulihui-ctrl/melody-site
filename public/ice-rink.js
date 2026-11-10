/* Interactive free-skating and skate-trail drawing. No video playback. */
(()=>{
const sprite=new Image();sprite.src='assets/ice/red-skater.png';
let active=false;
let skater={x:320,y:380,tx:320,ty:380},trails=[],spin=0,jump=0,cooldown=0,stars=[],elapsed=0,strokes=0,lastColor='#f4f2df';
const colors={ice:'#f4f2df',silver:'#d5e4df',rose:'#e5b7b6',blue:'#bbe2e4'};
function reset(){skater={x:320,y:380,tx:320,ty:380};trails=[];spin=0;jump=0;cooldown=0;elapsed=0;strokes=0;stars=Array.from({length:5},()=>({x:100+Math.random()*440,y:150+Math.random()*300}));}
function hit(x,y){const lift=jump>0?Math.sin((1-jump/1.05)*Math.PI)*78:0;return Math.abs(x-skater.x)<85&&y>skater.y-lift-145&&y<skater.y-lift+15;}
function move(x,y){if(hit(x,y))return;skater.tx=Math.max(45,Math.min(595,x));skater.ty=Math.max(145,Math.min(475,y));}
function rotate(){if(!active)return;if(jump>0)return;spin=1.25;cooldown=1.6;skater.tx=skater.x;skater.ty=skater.y;}
function leap(){if(!active)return;if(jump>0||spin>0||cooldown>0)return;jump=1.05;cooldown=1.4;}
function tap(x,y){if(hit(x,y))rotate();else move(x,y);}
function update(dt){elapsed+=dt;let gained=0;cooldown=Math.max(0,cooldown-dt);const old={x:skater.x,y:skater.y};const amount=1-Math.exp(-dt*5);if(spin<=0){skater.x+=(skater.tx-skater.x)*amount;skater.y+=(skater.ty-skater.y)*amount;}
const chosen=document.querySelector('#ice-color').value;lastColor=colors[chosen]||colors.ice;
if(jump<=0&&Math.hypot(skater.x-old.x,skater.y-old.y)>.2){trails.push({x1:old.x,y1:old.y,x2:skater.x,y2:skater.y,color:lastColor});if(trails.length>5000)trails.shift();strokes++;}
if(spin>0){const prev=spin;spin=Math.max(0,spin-dt);const a=(1.25-spin)*Math.PI*5;trails.push({x1:skater.x+Math.cos(a-.12)*12,y1:skater.y+Math.sin(a-.12)*5,x2:skater.x+Math.cos(a)*12,y2:skater.y+Math.sin(a)*5,color:lastColor});if(prev>0&&spin===0)gained+=10;}
if(jump>0){const prev=jump;jump=Math.max(0,jump-dt);if(prev>0&&jump===0)gained+=15;}
for(const s of stars)if(Math.hypot(skater.x-s.x,skater.y-s.y)<24){s.x=90+Math.random()*460;s.y=150+Math.random()*300;gained+=5;}
document.querySelector('#ice-action-status').textContent=jump>0?'Jump!':spin>0?'Spin!':'Glide to sketch · '+strokes+' skate marks';return gained;}
// Cached, code-generated print grain and faint old skate marks.
const paper=document.createElement('canvas');paper.width=640;paper.height=520;const pc=paper.getContext('2d'),pixels=pc.createImageData(640,520);let seed=373;
function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
for(let i=0;i<pixels.data.length;i+=4){const n=(rnd()-.5)*27;pixels.data[i]=80+n;pixels.data[i+1]=129+n;pixels.data[i+2]=125+n;pixels.data[i+3]=255;}pc.putImageData(pixels,0,0);
for(let j=0;j<18;j++){pc.strokeStyle='rgba(226,239,228,'+(.04+rnd()*.09)+')';pc.lineWidth=.6+rnd()*1.1;pc.beginPath();let x=rnd()*700-30,y=rnd()*550;pc.moveTo(x,y);for(let k=0;k<2;k++)pc.bezierCurveTo(rnd()*640,rnd()*520,rnd()*640,rnd()*520,rnd()*640,rnd()*520);pc.stroke();}
function draw(c){c.drawImage(paper,0,0);c.fillStyle='#f1eee0';c.font='10px Georgia';c.fillText('SKETCHES ON ICE',18,24);c.globalAlpha=.55;c.font='italic 10px Georgia';c.fillText('a little glide, a line of your own',18,40);c.globalAlpha=1;
for(const t of trails){for(const shift of [-2,2]){c.strokeStyle=t.color;c.globalAlpha=.9;c.lineWidth=1.5;c.beginPath();c.moveTo(t.x1+shift,t.y1);c.lineTo(t.x2+shift,t.y2);c.stroke();}}c.globalAlpha=1;
for(const s of stars){c.save();c.translate(s.x,s.y);c.rotate(Math.sin(elapsed)*.1);c.strokeStyle='#ecedde';c.lineWidth=1.5;for(let k=0;k<6;k++){c.rotate(Math.PI/3);c.beginPath();c.moveTo(0,0);c.lineTo(0,-9);c.moveTo(0,-5);c.lineTo(-3,-7);c.moveTo(0,-5);c.lineTo(3,-7);c.stroke();}c.restore();}
const h=jump>0?Math.sin((1-jump/1.05)*Math.PI)*78:0;
c.save();c.translate(skater.x,skater.y);c.fillStyle='#184e582b';c.beginPath();c.ellipse(0,3,30-h*.18,7,0,0,7);c.fill();c.translate(0,-h);if(spin>0){const phase=(1.25-spin)*Math.PI*5;c.translate(0,-55);c.rotate(phase);c.translate(0,55);}else c.rotate((skater.tx-skater.x)*.0006);if(sprite.complete&&sprite.naturalWidth)c.drawImage(sprite,-100,-132,200,134);else{c.fillStyle='#0870d0';c.fillRect(-15,-65,30,60);}c.restore();}
reset();document.querySelector('#ice-clear').onclick=()=>{trails=[];strokes=0;document.querySelector('#ice-action-status').textContent='Fresh ice. Sketch a new line!';};document.querySelector('#ice-spin').onclick=()=>{rotate();document.querySelector('#game').focus();};document.querySelector('#ice-jump').onclick=()=>{leap();document.querySelector('#game').focus();};
window.IceRink={reset,update,draw,move,tap,hit,leap,setActive(value){active=value;}};
})();
