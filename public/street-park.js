/* Original perspective skatepark, inspired by concrete street competition parks. */
(()=>{
function project(x,y){const t=Math.max(0,(y+30)/550);return{x:320+(x-320)*(.24+.76*t),y:132+388*Math.pow(t,1.65),s:.24+.76*t};}
function poly(c,points,fill,stroke){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.stroke();}}
function block(c,x,y,w,h,d){poly(c,[[x-w,y],[x+w,y],[x+w+d,y-d],[x-w+d,y-d]],'#999c9d');poly(c,[[x-w,y],[x+w,y],[x+w,y+h],[x-w,y+h]],'#a86650');poly(c,[[x+w,y],[x+w+d,y-d],[x+w+d,y+h-d],[x+w,y+h]],'#754d3f');c.strokeStyle='#3f4449';c.lineWidth=4;c.beginPath();c.moveTo(x-w,y);c.lineTo(x+w,y);c.stroke();}
function rail(c,x,y,w,h){c.strokeStyle='#0002';c.lineWidth=6;c.beginPath();c.moveTo(x-w+12,y+8);c.lineTo(x+w+12,y+8);c.stroke();c.strokeStyle='#292f35';c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(x-w,y);c.lineTo(x-w,y-h);c.lineTo(x+w,y-h);c.lineTo(x+w,y);c.stroke();c.strokeStyle='#879098';c.lineWidth=1;c.beginPath();c.moveTo(x-w,y-h-1);c.lineTo(x+w,y-h-1);c.stroke();}
function stairs(c,x,y,w){for(let i=5;i>=0;i--){const yy=y-i*9;poly(c,[[x-w,yy],[x+w,yy],[x+w+20,yy-13],[x-w+20,yy-13]],'#bababc');poly(c,[[x-w,yy],[x+w,yy],[x+w,yy+5],[x-w,yy+5]],'#555b61');}rail(c,x,y-4,w*.7,65);}
function ramp(c,x,y,sign){poly(c,[[x,y],[x+sign*90,y],[x+sign*90,y-65],[x+sign*65,y-50],[x+sign*35,y-15]],'#979ca0','#686e73');poly(c,[[x+sign*90,y],[x+sign*106,y-12],[x+sign*106,y-77],[x+sign*90,y-65]],'#a86650');c.strokeStyle='#363c42';c.lineWidth=4;c.beginPath();c.moveTo(x+sign*90,y-65);c.lineTo(x+sign*106,y-77);c.stroke();}
function draw(c,distance,objects){const sky=c.createLinearGradient(0,0,0,170);sky.addColorStop(0,'#b4c8ba');sky.addColorStop(1,'#e3dcc4');c.fillStyle=sky;c.fillRect(0,0,640,180);c.fillStyle='#ffffff90';for(let j=0;j<4;j++){c.beginPath();c.ellipse(80+j*160,30+j%2*18,55,9,0,0,7);c.fill();}
// Low skyline, park trees and branching street lights.
for(let i=0;i<13;i++){const xx=i*55;c.fillStyle=i%2?'#98a5a5':'#afbab6';c.fillRect(xx,70-i%3*9,43,75);c.fillStyle='#c5d0cc';for(let k=0;k<3;k++)c.fillRect(xx+5+k*11,83,5,15);}
c.fillStyle='#667b64';for(let i=0;i<11;i++){const xx=i*65+12;c.fillRect(xx,105,4,33);c.beginPath();c.ellipse(xx,97,18,22,0,0,7);c.fill();}
c.strokeStyle='#3c494f';c.lineWidth=3;for(const xx of [45,170,470,605]){c.beginPath();c.moveTo(xx,132);c.lineTo(xx,46);c.moveTo(xx,78);c.quadraticCurveTo(xx-8,61,xx-24,59);c.moveTo(xx,65);c.quadraticCurveTo(xx+10,49,xx+23,48);c.stroke();}
c.fillStyle='#6c7778';c.fillRect(0,128,640,5);c.strokeStyle='#59686c';c.lineWidth=1;for(let xx=0;xx<640;xx+=12){c.beginPath();c.moveTo(xx,119);c.lineTo(xx,137);c.stroke();}
const ground=c.createLinearGradient(0,132,0,520);ground.addColorStop(0,'#afb5a4');ground.addColorStop(1,'#d2c7b3');c.fillStyle=ground;c.fillRect(0,133,640,387);
c.strokeStyle='#a4a6a5';c.lineWidth=1;for(const xx of [-300,-50,180,460,690,940]){let a=project(xx,-25),b=project(xx,550);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}
for(let i=0;i<9;i++){let yy=((i*90+distance)%720)-80;if(yy<-25||yy>555)continue;const p=project(0,yy);c.strokeStyle='#a2a5a3';c.beginPath();c.moveTo(0,p.y);c.lineTo(640,p.y);c.stroke();}
// Red ledges, banks and stairs frame the skating line.
for(let i=0;i<3;i++){const yy=((i*250+distance*.65)%800)-100;if(yy<10||yy>580)continue;for(const side of [-1,1]){const p=project(side<0?-35:675,yy);c.save();c.translate(p.x,p.y);c.scale(p.s,p.s);if(i===0)stairs(c,0,0,58);else if(i===1)ramp(c,0,0,-side);else block(c,0,-14,52,28,20);c.restore();}}
// Gameplay objects share the same projection as the selected skateboard.
for(const o of [...objects].sort((a,b)=>a.y-b.y)){const p=project(o.x,o.y);if(p.y<132)continue;c.save();c.translate(p.x,p.y);c.scale(p.s,p.s);if(o.type==='tree')rail(c,0,0,42,28);else if(o.type==='stone')block(c,0,-12,33,22,12);else{c.fillStyle='#0002';c.beginPath();c.ellipse(0,6,14,5,0,0,7);c.fill();c.strokeStyle='#41494b';c.lineWidth=3;c.beginPath();c.moveTo(0,5);c.lineTo(0,-34);c.stroke();poly(c,[[1,-34],[25,-26],[1,-18]],'#c4855e');}c.restore();}
c.fillStyle='#24333b';c.font='bold 10px Arial';c.fillText('CONCRETE SESSION / STREET PARK',16,20);
}
window.StreetPark={draw,project};
})();
