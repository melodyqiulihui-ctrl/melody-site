(()=>{

const bpm=146,beat=60/bpm,bar=beat*4;
const lead=[['e5','e5','c5','a4','c5','d5','e5','g5'],['fs5','e5','d5','b4','gs4','b4','e5',null],['e5','a5','g5','e5','d5','c5','b4','c5'],['d5','f5','e5','d5','b4','g4','b4','d5'],['e5','g5','a5','g5','e5','d5','e5','c5'],['b4','d5','e5','gs5','b5','a5','gs5','e5'],['a5','g5','e5','c5','d5','e5','g5','e5'],['d5','b4','g4','b4','d5','f5','e5',null]];
const bass=[['f2','c3',null,'f2','a2','c3','e2','c3'],['e2','b2','d3','e3',null,'b2','g2','gs2'],['a2','e3',null,'a2','g2','e2','c3','b2'],['d2','a2','c3','d3','g2','d3','b2','g2']];
const chords=[['a3','c4','e4','g4'],['gs3','b3','d4','e4'],['g3','a3','c4','e4'],['a3','c4','d4','f4'],['a3','c4','e4','g4'],['gs3','b3','d4','e4'],['g3','a3','c4','e4'],['g3','b3','d4','f4']];
const guitar=[['f3','c4'],['e3','b3'],['a2','e3'],['g2','d3']];
let ctx,master,timer,next,index=0,playing=false;
const frame=document.querySelector('#music-frame'),btn=document.querySelector('#music-toggle');let art;
function animation(run,reset=false){const s=art?.contentDocument?.documentElement;if(s?.pauseAnimations){if(reset)s.setCurrentTime(0);run?s.unpauseAnimations():s.pauseAnimations()}}

function freq(n){const m=n.match(/^([a-g])(s?)(\d)$/),v={c:0,d:2,e:4,f:5,g:7,a:9,b:11}[m[1]]+(m[2]?1:0)+(Number(m[3])+1)*12;return 440*2**((v-69)/12)}
function tone(n,t,d,g,type='triangle'){if(!n)return;const o=ctx.createOscillator(),env=ctx.createGain(),f=ctx.createBiquadFilter();o.type=type;o.frequency.value=freq(n);f.type='lowpass';f.frequency.value=type==='square'?4200:6000;env.gain.setValueAtTime(0,t);env.gain.linearRampToValueAtTime(g,t+.006);env.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(f).connect(env).connect(master);o.start(t);o.stop(t+d+.02)}
function noise(t,d,g,hp){const buf=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*d),ctx.sampleRate),a=buf.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),e=ctx.createGain();s.buffer=buf;f.type='highpass';f.frequency.value=hp;e.gain.setValueAtTime(g,t);e.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f).connect(e).connect(master);s.start(t)}
function kick(t){const o=ctx.createOscillator(),e=ctx.createGain();o.frequency.setValueAtTime(145,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);e.gain.setValueAtTime(.6,t);e.gain.exponentialRampToValueAtTime(.0001,t+.22);o.connect(e).connect(master);o.start(t);o.stop(t+.23)}
function schedule(i,t){let p=i%24,j=p<4?p:p<12?p-4:p<16?p-12:p-16,full=p>=4&&p<12||p>=16,breakdown=p>=12&&p<16;
 if(!breakdown){[0,1.5,3].forEach(x=>kick(t+x*beat));[1,3].forEach(x=>{noise(t+x*beat,.14,.22,1000);tone('d3',t+x*beat,.1,.07)});for(let k=0;k<16;k++)noise(t+k*beat/4,.035,k%4===0?.075:.035,7000)}else [1,3].forEach(x=>noise(t+x*beat,.035,.07,2400));
 bass[j%4].forEach((n,k)=>tone(n,t+k*beat/2,.17,.23,'triangle'));
 [0,1.25,1.5,2.5,3.25].forEach(x=>chords[j%8].forEach(n=>tone(n,t+x*beat,.23,.055)));
 if(full){[0,.5,1.5,2,3.25,3.5].forEach(x=>guitar[j%4].forEach(n=>tone(n,t+x*beat,.13,.045,'sawtooth')));lead[j%8].forEach((n,k)=>{tone(n,t+k*beat/2,.17,.065,'square');tone(n,t+k*beat/2+.16,.12,.012,'square')})}
}
function tick(){while(next<ctx.currentTime+.18){schedule(index++,next);next+=bar}}

let optedOut=false,initialized=false,gameHeld=false;
function ui(text){btn.textContent=playing?'♫ Mute music':'♫ Enable music';btn.setAttribute('aria-pressed',playing);const gameBtn=document.querySelector('#game-music');if(gameBtn){gameBtn.textContent=playing?'♫ Music on':'♫ Music off';gameBtn.setAttribute('aria-pressed',playing);}const d=frame.contentDocument;if(d){const b=d.querySelector('#play'),s=d.querySelector('#status');if(b)b.textContent=playing?'♫ Mute music':'♫ Enable music';if(s)s.textContent=text;}}
function init(){if(initialized)return;ctx=new AudioContext();master=ctx.createGain();master.gain.value=.4;const limiter=ctx.createDynamicsCompressor();master.connect(limiter).connect(ctx.destination);initialized=true;}
function activate(){if(playing||optedOut||gameHeld)return;try{init();const resumed=ctx.resume();resumed.then(()=>{if(optedOut||gameHeld||document.hidden||ctx.state!=='running')return;if(!playing){index=0;next=ctx.currentTime+.08;playing=true;animation(true,true);tick();clearInterval(timer);timer=setInterval(tick,35);ui('Playing · 146 BPM · looping');}}).catch(()=>ui('Music starts after your first click or tap'));if(ctx.state!=='running')ui('Music starts after your first click or tap');}catch(e){ui('Audio unavailable in this browser');}}
function mute(){optedOut=true;playing=false;clearInterval(timer);if(ctx)ctx.suspend();animation(false);ui('Muted');}
function toggle(){if(playing){mute();return;}optedOut=false;gameHeld=false;activate();}
btn.onclick=toggle;
document.querySelector('#game-music').onclick=toggle;
document.addEventListener('game-soundtrack',e=>{gameHeld=!e.detail.active;if(!gameHeld){activate();return;}playing=false;clearInterval(timer);if(ctx){ctx.close();initialized=false;}animation(false);ui('Music paused with the game');});
function bind(){art=frame.contentDocument?.querySelector('#art');if(art){art.onload=()=>animation(playing);animation(playing);}const b=frame.contentDocument?.querySelector('#play');if(b)b.onclick=toggle;frame.contentDocument?.addEventListener('pointerdown',()=>activate());ui(playing?'Playing · 146 BPM · looping':'Music starts after your first click or tap');}
frame.addEventListener('load',bind);if(frame.contentDocument?.readyState==='complete')bind();
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#music-toggle, #game-music'))activate();});document.addEventListener('keydown',e=>{if(e.target!==btn&&e.target.id!=='game-music')activate();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(playing){playing=false;clearInterval(timer);ctx.suspend();animation(false);ui('Paused while away');}}else activate();});
activate();
})();
