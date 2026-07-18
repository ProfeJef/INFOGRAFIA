/* ===================================================
   MAPA DE RUTA PEDAGOGICA - ESTILO TERRARIA/STARDEW v2
   =================================================== */
:root{
  --sky1:#8fd6f0; --sky2:#bdeaf8;
  --grass1:#6cc24a; --grass2:#4a9e3a; --grass3:#2e6e2e; --grass-edge:#8fd35c;
  --dirt1:#d9a15c; --dirt2:#b8763a; --dirt-line:#8a5a2f;
  --wood:#a5713c; --wood-dark:#5d3a1a; --wood-light:#c98f56;
  --panel:#f6e3b4;
  --hp-red:#e53935; --hp-blue:#1565c0;
  --hp-yellow:#f9c74f; --hp-green:#43aa8b;
  --badge-ring:#e53935;
}
*{box-sizing:border-box; image-rendering:pixelated;}
body{
  margin:0; font-family:'VT323', monospace; color:#222;
  background:linear-gradient(to bottom,var(--sky1) 0%,var(--sky2) 42%,var(--grass-edge) 43%,var(--grass1) 46%,var(--grass3) 100%);
  min-height:100vh; overflow-x:hidden;
}

/* ============ STATUS BAR ============ */
#statusbar{
  position:sticky; top:0; z-index:200;
  background:linear-gradient(#4a2f16,#2b1a0a);
  border-bottom:4px solid #1a0f06;
  padding:10px 16px; display:flex; flex-wrap:wrap; gap:14px 22px; align-items:center;
  box-shadow:0 4px 10px rgba(0,0,0,.5);
}
.status-group{ display:flex; align-items:center; gap:8px; flex:1; min-width:200px; }
.status-icon{ font-size:20px; }
.status-label{ font-family:'Press Start 2P',monospace; font-size:9px; color:#ffe08a; text-shadow:1px 1px #000; white-space:nowrap; }
.bar-outer{
  flex:1; height:16px; background:#111; border:2px solid #000; border-radius:4px;
  overflow:hidden; box-shadow:inset 0 2px 3px rgba(0,0,0,.7); position:relative; min-width:80px;
}
.bar-inner{ height:100%; width:0%; transition:width .8s ease; position:relative; }
.bar-inner.red{ background:linear-gradient(90deg,var(--hp-red),#ff8a65); }
.bar-inner.yellow{ background:linear-gradient(90deg,var(--hp-yellow),#f3722c); }
.bar-inner.green{ background:linear-gradient(90deg,var(--hp-green),#90be6d); }
.bar-inner::after{
  content:""; position:absolute; inset:0;
  background:repeating-linear-gradient(45deg,rgba(255,255,255,.15) 0,rgba(255,255,255,.15) 5px,transparent 5px,transparent 10px);
}
.bar-pct{ font-size:12px; color:#fff; min-width:32px; text-align:right; }

/* ============ MAP TITLE ============ */
h1.mapTitle{
  text-align:center; font-family:'Press Start 2P',monospace; font-size:14px; color:#fff;
  text-shadow:3px 3px var(--grass3); margin:24px 10px 40px; letter-spacing:1px;
}

/* ============ TRACK ============ */
#trackScroll{ overflow-x:auto; padding-bottom:20px; }
#track{
  position:relative; display:flex; align-items:flex-end; gap:0;
  min-width:1300px; padding:0 40px 100px; margin:0 auto; max-width:1600px;
}

.ground-seg{
  position:relative; flex:1; height:64px; margin-top:auto;
  background:
    radial-gradient(circle at 20% 30%, rgba(255,255,255,.08) 2px, transparent 3px),
    radial-gradient(circle at 60% 60%, rgba(0,0,0,.08) 2px, transparent 3px),
    linear-gradient(180deg,var(--dirt1) 0%,var(--dirt2) 100%);
  border-top:4px solid var(--dirt-line);
  box-shadow:inset 0 -6px 8px rgba(0,0,0,.15);
}
.fence-post{
  position:absolute; top:-20px; width:8px; height:22px;
  background:linear-gradient(180deg,var(--wood-light),var(--wood-dark));
  border:1px solid #2b1a0a; border-radius:2px;
}
.fence-rail{
  position:absolute; top:-11px; height:5px; width:70px;
  background:var(--wood-dark); border-radius:2px;
}
.ground-seg .deco{ position:absolute; top:-28px; font-size:22px; filter:drop-shadow(1px 2px 1px rgba(0,0,0,.3)); }

.signpost{
  position:absolute; bottom:66px; left:50%; transform:translateX(-50%);
  background:var(--wood); color:#fff8e1; border:3px solid var(--wood-dark);
  border-radius:5px; padding:4px 10px; font-family:'Press Start 2P',monospace; font-size:8px;
  box-shadow:0 3px 0 var(--wood-dark); white-space:nowrap;
}
.signpost::after{
  content:""; position:absolute; bottom:-14px; left:50%; transform:translateX(-50%);
  width:6px; height:14px; background:var(--wood-dark);
}

/* ============ STATION PLATFORM ============ */
.station{
  position:relative; display:flex; flex-direction:column; align-items:center;
  width:190px; flex-shrink:0; cursor:pointer; transition:transform .25s;
  z-index:3;
}
.station:hover{ transform:translateY(-6px); }
.station:hover .scene{ box-shadow:0 0 0 4px #fff176, 0 9px 0 var(--wood-dark), 0 13px 14px rgba(0,0,0,.4); }
.station:hover .badge{ box-shadow:0 0 12px 4px #fff59d; }

.badge{
  width:40px; height:40px; border-radius:50%;
  background:#fff; border:4px solid var(--badge-ring);
  display:flex; align-items:center; justify-content:center;
  font-family:'Press Start 2P',monospace; font-size:16px; color:var(--badge-ring);
  margin-bottom:6px; box-shadow:0 3px 6px rgba(0,0,0,.35); animation:bounce 1.1s infinite;
  transition:box-shadow .2s;
}
@keyframes bounce{ 0%,100%{transform:translateY(0);} 50%{transform:translateY(-7px);} }
.station.done .badge{ border-color:#43a047; color:#43a047; }
.station.done .badge::before{ content:"✔"; }
.station.done .badge span{ display:none; }

.scene{
  width:160px; height:130px;
  background:linear-gradient(180deg,#eaf6ea 0%,#cfe8cf 70%, #b8dcb8 100%);
  border:4px solid var(--wood-dark); border-radius:8px;
  box-shadow:0 9px 0 var(--wood-dark), 0 13px 12px rgba(0,0,0,.35);
  position:relative; overflow:hidden; transition:box-shadow .2s;
  display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:6px;
  padding-top:8px;
}
.scene::before{
  content:""; position:absolute; top:0; left:0; right:0; height:30px;
  background:repeating-linear-gradient(90deg, var(--wood) 0 10px, var(--wood-light) 10px 20px);
  border-bottom:3px solid var(--wood-dark);
}
.scene::after{
  content:""; position:absolute; top:6px; left:50%; transform:translateX(-50%);
  width:14px; height:12px; background:#5d3a1a; border-radius:2px 2px 0 0; opacity:.5;
}
.scene .big-icon{ font-size:38px; z-index:2; filter:drop-shadow(1px 2px 1px rgba(0,0,0,.25)); }
.scene .mini-npc{ font-size:18px; z-index:2; filter:drop-shadow(1px 1px 1px rgba(0,0,0,.25)); }

.platform-base{
  width:170px; height:22px; position:relative; margin-top:-4px; z-index:1;
}
.platform-base::before{
  content:""; position:absolute; inset:0; background:var(--grass2); border-radius:50%;
  box-shadow:0 6px 8px rgba(0,0,0,.3);
}
.platform-base::after{
  content:""; position:absolute; top:-4px; left:8%; right:8%; height:10px;
  background:var(--grass-edge); border-radius:50%; opacity:.7;
}

.day-label{
  margin-top:12px; background:linear-gradient(180deg,var(--wood-light),var(--wood));
  color:#fff8e1; border:3px solid var(--wood-dark);
  border-radius:6px; padding:6px 14px; text-align:center;
  box-shadow:0 3px 0 var(--wood-dark); font-family:'Press Start 2P',monospace; font-size:10px;
}

.bubble{
  position:absolute; top:-40px; background:#fff; border:3px solid var(--wood-dark);
  border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center;
  font-size:16px; box-shadow:0 3px 5px rgba(0,0,0,.3);
}
.bubble::after{
  content:""; position:absolute; bottom:-8px; left:6px;
  width:10px; height:10px; background:#fff; border:2px solid var(--wood-dark);
  border-radius:50%;
}
.bubble::before{
  content:""; position:absolute; bottom:-16px; left:-2px;
  width:6px; height:6px; background:#fff; border:2px solid var(--wood-dark);
  border-radius:50%;
}

.play-marker{
  position:absolute; top:-64px; right:-24px; display:flex; flex-direction:column; align-items:center;
  z-index:5;
}
.play-marker .tag-text{
  font-size:11px; font-family:'Press Start 2P',monospace; color:#1565c0;
  background:#fff; border:2px solid var(--wood-dark); border-radius:5px; padding:2px 6px;
  box-shadow:0 2px 4px rgba(0,0,0,.3); white-space:nowrap;
}
.play-marker .arrow{ font-size:26px; transform:rotate(25deg); margin-top:2px; filter:drop-shadow(1px 2px 1px rgba(0,0,0,.4)); }

/* ============ AVATAR ============ */
#avatarWrap{
  position:absolute; bottom:2px; left:0; z-index:6;
  transition:left 1s cubic-bezier(.4,0,.2,1); text-align:center;
  animation:walk .5s infinite steps(2);
}
@keyframes walk{ 0%{transform:translateY(0);} 50%{transform:translateY(-5px);} 100%{transform:translateY(0);} }
#avatar{ width:40px; height:50px; margin:0 auto; }
#avatar .avatar-svg{ width:40px; height:50px; filter:drop-shadow(2px 3px 2px rgba(0,0,0,.5)); }
#avatarWrap .avatar-label{
  font-family:'Press Start 2P',monospace; font-size:8px; color:#fff; text-shadow:1px 1px #000;
  background:rgba(0,0,0,.4); padding:2px 6px; border-radius:4px; margin-top:4px; display:inline-block;
}
#avatarWrap .player-arrow{
  position:absolute; top:-26px; left:50%; transform:translateX(-50%) rotate(180deg);
  font-size:20px; color:#e53935; animation:bounce 1s infinite;
}

/* ============ CORNER BOOKS ============ */
.corner-book{
  position:fixed; bottom:14px; width:270px; max-width:40vw;
  background:var(--panel); border:4px solid var(--wood-dark); border-radius:8px;
  padding:12px 14px; font-size:14px; line-height:1.4; box-shadow:0 6px 14px rgba(0,0,0,.4);
  z-index:50;
}
.corner-book h3{ font-family:'Press Start 2P',monospace; font-size:10px; margin:0 0 6px; color:var(--grass3); }
#bookLeft{ left:14px; }
#bookRight{ right:14px; }

footer{ text-align:center; color:#fff; font-size:14px; padding:26px 10px 130px; text-shadow:1px 1px #000; }

/* ============ MODAL ============ */
#overlay{
  position:fixed; inset:0; background:rgba(0,0,0,.6); display:none;
  align-items:center; justify-content:center; z-index:300; padding:16px;
}
#overlay.active{ display:flex; }
.modal-box{
  background:var(--panel); border:6px solid var(--wood-dark); border-radius:12px;
  max-width:520px; width:100%; padding:22px; position:relative;
  box-shadow:0 0 0 4px #fff8e1 inset, 0 10px 30px rgba(0,0,0,.5);
  animation:popIn .3s ease;
}
@keyframes popIn{ from{transform:scale(.7);opacity:0;} to{transform:scale(1);opacity:1;} }
.modal-box h2{ font-family:'Press Start 2P',monospace; font-size:13px; color:var(--grass3); line-height:1.6; margin-top:0; }
.modal-box .tag{ display:inline-block; background:var(--wood); color:#fff; font-size:12px; padding:3px 8px; border-radius:5px; margin-bottom:10px; }
.modal-box p{ font-size:19px; line-height:1.5; }
.modal-box strong{ color:var(--hp-blue); }
.close-btn{
  display:block; margin:16px auto 0; font-family:'Press Start 2P',monospace; font-size:11px;
  background:var(--hp-red); color:#fff; border:none; padding:10px 20px; border-radius:6px;
  cursor:pointer; box-shadow:0 4px 0 #8e1f1a; transition:transform .15s;
}
.close-btn:hover{ transform:translateY(2px); box-shadow:0 2px 0 #8e1f1a; }

/* ============ SVG SPRITES ============ */
.sprite-svg{
  width:100%; height:100%; max-width:130px; max-height:100px;
  display:block; margin:0 auto;
}
.scene .sprite-svg{ position:relative; z-index:2; }

@media (max-width:800px){
  .corner-book{ position:static; width:auto; max-width:none; margin:10px 14px; }
  footer{ padding-bottom:20px; }
}
