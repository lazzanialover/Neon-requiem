/* NEON REQUIEM 2.4 — Mac visual/combat pass */
(()=>{
const sectorName=(x)=>x<760?'A // BIOSECURITY':x<1510?'B // RESEARCH':'C // HELIX CORE';
let steps=[],lastStep=0,threatPulse=0;
const baseUpdate=update;
update=function(dt){
 baseUpdate(dt);
 if(!active||paused||!p)return;
 if(p.moving&&now-lastStep>.115){lastStep=now;steps.push({x:p.x+Math.sin(p.angle)*5,y:p.y+13,t:now});}
 steps=steps.filter(s=>now-s.t<2.2);
 if(boss&&boss.hp>0)threatPulse+=dt;
};
const baseLab=illustratedLab;
illustratedLab=function(){
 baseLab();
 ctx.save();
 // Animated reactor containment rings and directional path lighting.
 for(const [cx,cy,r,c] of [[280,420,84,'#28ead1'],[1130,640,98,'#edaa64'],[1830,1120,140,'#ff5876']]){
   const a=now*.45;
   ctx.strokeStyle=c+'66';ctx.lineWidth=3;ctx.setLineDash([22,12,5,16]);
   ctx.beginPath();ctx.ellipse(cx,cy,r,r*.62,a,0,Math.PI*2);ctx.stroke();
   ctx.setLineDash([]);ctx.strokeStyle=c+'33';ctx.lineWidth=1;
   ctx.beginPath();ctx.ellipse(cx,cy,r+19,(r+19)*.62,-a*.4,0,Math.PI*2);ctx.stroke();
   for(let i=0;i<6;i++){let ang=a+i*Math.PI/3;let x=cx+Math.cos(ang)*r,y=cy+Math.sin(ang)*r*.62;glow(x,y,17,c+'33');}
 }
 // Suspended light shafts and glass chambers, with moving holographic telemetry.
 for(const [x,y,w,h,c] of [[360,360,145,220,'#35bfc4'],[960,290,155,200,'#f5a65b'],[1670,840,160,220,'#ff6179']]){
   ctx.fillStyle=c+'0c';ctx.fillRect(x,y,w,h);
   ctx.strokeStyle=c+'55';ctx.lineWidth=3;ctx.strokeRect(x,y,w,h);
   ctx.strokeStyle=c+'33';ctx.lineWidth=1;
   for(let i=0;i<6;i++){let yy=y+22+i*29;ctx.beginPath();ctx.moveTo(x+10,yy);ctx.lineTo(x+w-10,yy);ctx.stroke();}
   let scan=y+((now*57+x)%h);rect(x+4,scan,w-8,3,c+'99');
   rect(x+8,y+9,38,5,c);rect(x+w-42,y+h-14,30,4,c);
 }
 // Security barriers: physical-looking laser banks along sector edges.
 for(const [x,y,h,c] of [[785,390,350,'#ef9d57'],[1505,800,380,'#f55b71']]){
   rect(x-12,y,24,h,'#12232c');
   rect(x-7,y+5,14,h-10,'#233944');
   for(let k=0;k<6;k++){let yy=y+18+k*(h-36)/5;glow(x,yy,22,c+'55');rect(x-11,yy-3,22,6,c);}
   ctx.save();ctx.globalAlpha=.18+.11*Math.sin(now*4);ctx.fillStyle=c;ctx.fillRect(x-2,y+12,4,h-24);ctx.restore();
 }
 for(const s of steps){let alpha=Math.max(0,1-(now-s.t)/2.2);ctx.fillStyle='rgba(86,246,188,'+(alpha*.26)+')';ctx.beginPath();ctx.ellipse(s.x,s.y,5,2,0,0,Math.PI*2);ctx.fill();}
 // Boss arena warning rings.
 if(boss&&boss.hp>0){
   const x=boss.x,y=boss.y,phase=(now*1.8)%1;
   ctx.strokeStyle='rgba(255,71,102,'+(.2+.22*Math.sin(now*4)**2)+')';ctx.lineWidth=4;
   ctx.beginPath();ctx.ellipse(x,y,94+phase*28,53+phase*17,0,0,Math.PI*2);ctx.stroke();
   ctx.strokeStyle='#ff637e88';ctx.lineWidth=2;ctx.setLineDash([12,9]);
   ctx.beginPath();ctx.ellipse(x,y,150,88,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
   ctx.font='bold 15px monospace';ctx.textAlign='center';ctx.fillStyle='#ff8593';ctx.fillText('ARCHON // THREAT LEVEL OMEGA',x,y-115);
 }
 ctx.restore();
};
const baseDraw=draw;
draw=function(){
 baseDraw();
 if(!active)return;
 ctx.save();ctx.setTransform(dpr,0,0,dpr,0,0);
 const desktop=innerWidth>=760;
 const x=desktop?22:12,y=desktop?H-99:H-68;
 ctx.fillStyle='#030d17e6';ctx.fillRect(x,y,desktop?315:202,desktop?76:48);
 ctx.strokeStyle='#45ddbb88';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,desktop?314:201,desktop?75:47);
 ctx.font='bold 12px monospace';ctx.fillStyle='#78f6cb';ctx.fillText('HELIX // '+sectorName(p.x),x+12,y+20);
 ctx.font='11px monospace';ctx.fillStyle='#a2b9c3';
 ctx.fillText(desktop?'WASD MOVE  •  MOUSE AIM  •  SPACE DASH':'REQUIEM // BUILD 2.4',x+12,y+40);
 if(desktop){ctx.fillText('LMB ATTACK  •  P PAUSE',x+12,y+57);}
 if(boss&&boss.hp>0){
   const bw=Math.min(W*.48,460),bx=(W-bw)/2,by=H>600?H-52:H-29;
   ctx.fillStyle='#070a10e8';ctx.fillRect(bx-8,by-24,bw+16,44);
   ctx.fillStyle='#ff9ca9';ctx.textAlign='center';ctx.font='bold 12px monospace';ctx.fillText('АРХОНТ // HELIX ENFORCER',W/2,by-9);
   ctx.fillStyle='#351a28';ctx.fillRect(bx,by,bw,8);
   ctx.fillStyle='#ff4d69';ctx.fillRect(bx,by,bw*Math.max(0,boss.hp/boss.max),8);
   ctx.strokeStyle='#ff9ca955';ctx.strokeRect(bx,by,bw,8);
 }
 ctx.restore();
};
const title=document.getElementById('sub');if(title)title.textContent='REQUIEM // РОЙ // BUILD 2.4 // MAC PREVIEW';
const mark=document.createElement('div');mark.textContent='BUILD 2.4 • MAC TEST';Object.assign(mark.style,{position:'fixed',right:'12px',bottom:'8px',color:'#6af6c0',font:'10px monospace',opacity:'.8',pointerEvents:'none',zIndex:999});document.body.appendChild(mark);
})();