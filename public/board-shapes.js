/* Original canvas silhouettes matching the fourteen boards in the chooser. */
(()=>{
const names=['Penny board','Streetboard','Cruiser','Old school','Surfskate','Foldable skateboard','Electric skateboard','Caster board','Fishtail','Twin tip','Drop-through','Drop-down','Pintail','Dancing longboard'];
const colors=['#268fbc','#ddb477','#ba7947','#caa36a','#9a693c','#737976','#252b2b','#d73b42','#caa16b','#9c5736','#c49b67','#654d38','#dec28a','#bb9563'];
const outlines=[
'M0-38C-15-38-15-20-14 0L-12 28Q0 48 12 28L14 0C15-20 15-38 0-38Z',
'M0-36C-15-36-16-23-15-16L-15 22C-15 42 15 42 15 22L15-16C16-23 15-36 0-36Z',
'M0-40Q-16-40-18-21L-16 27Q-14 42 0 42Q14 42 16 27L18-21Q16-40 0-40Z',
'M0-37Q-16-38-17-22L-20 26Q-20 39 0 39Q20 39 20 26L17-22Q16-38 0-37Z',
'M0-43Q-19-32-17-9L-15 28Q0 48 15 28L17-9Q19-32 0-43Z',
'M0-43Q-11-43-12-28L-14 27Q0 47 14 27L12-28Q11-43 0-43Z',
'M0-46Q-12-44-12-31L-19-20L-17 30L-10 43Q0 49 10 43L17 30L19-20L12-31Q12-44 0-46Z',
'M0-46Q-12-46-18-23Q-19-13-5-5L-4 10Q-17 17-16 29Q-13 48 0 48Q13 48 16 29Q17 17 4 10L5-5Q19-13 18-23Q12-46 0-46Z',
'M0-44Q-19-34-19-8L-20 35L-9 43L0 34L9 43L20 35L19-8Q19-34 0-44Z',
'M0-47Q-10-47-10-32L-10-26L-18-18L-18 18L-10 26L-10 32Q-10 47 0 47Q10 47 10 32L10 26L18 18L18-18L10-26L10-32Q10-47 0-47Z',
'M0-47Q-10-47-10-33L-10-29L-20-18L-20 18L-10 29L-10 33Q-10 47 0 47Q10 47 10 33L10 29L20 18L20-18L10-29L10-33Q10-47 0-47Z',
'M0-49Q-9-49-9-32L-18-25L-19 26L-9 33Q-9 49 0 49Q9 49 9 33L19 26L18-25L9-32Q9-49 0-49Z',
'M0-52C-11-42-21-24-18-6Q-13 28 0 51Q13 28 18-6C21-24 11-42 0-52Z',
'M0-53Q-11-53-11-38L-19-25L-20 25L-11 38Q-11 53 0 53Q11 53 11 38L20 25L19-25L11-38Q11-53 0-53Z'
];
let selected=1;try{const saved=JSON.parse(localStorage.getItem('sic-board'));if(Number.isInteger(saved)&&saved>=0&&saved<names.length)selected=saved;}catch{}
function choose(i){if(!Number.isInteger(i)||i<0||i>=names.length)return;selected=i;try{localStorage.setItem('sic-board',JSON.stringify(i));}catch{}document.dispatchEvent(new CustomEvent('street-board-selected',{detail:{index:i,name:names[i]}}));}
function draw(c,underside){const i=selected,p=new Path2D(outlines[i]);c.save();c.fillStyle=underside?'#086ccb':colors[i];c.strokeStyle='#302b29';c.lineWidth=1.7;c.fill(p);c.stroke(p);c.save();c.clip(p);c.strokeStyle=i===0?'#80d8e5':i===7?'#292b2c':'#76502c';c.lineWidth=i===7?6:2;for(const xx of [-7,7]){c.beginPath();c.moveTo(xx,-55);c.lineTo(xx,55);c.stroke();}if(i===6){c.fillStyle='#4d5551';c.fillRect(-8,-20,16,39);c.fillStyle='#db8245';c.fillRect(-3,-29,6,5);}if(i===5){c.fillStyle='#c1c6c3';c.fillRect(-14,-3,28,6);}c.restore();c.save();c.clip(p);window.BoardStickers?.draw(c);c.restore();if(i===7){c.strokeStyle='#b7bab5';c.lineWidth=4;c.beginPath();c.moveTo(0,-7);c.lineTo(0,12);c.stroke();c.fillStyle='#ddd';for(const yy of [-25,29]){c.beginPath();c.ellipse(0,yy,4,8,0,0,7);c.fill();}}else{const axle=i<4?22:i===12?29:34;for(const yy of [-axle,axle]){c.fillStyle='#aaa';c.fillRect(-17,yy-1.5,34,3);c.fillStyle=i===0?'#75c95e':'#3f3c38';for(const xx of [-19,19]){c.beginPath();c.roundRect(xx-4,yy-5,8,10,3);c.fill();}}}c.restore();}
window.StreetBoards={names,choose,draw,get outline(){return outlines[selected];},get selected(){return selected;}};
})();
