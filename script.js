document.addEventListener("DOMContentLoaded",()=>{
  // Cookie consent + retro sign-up prompt
  initSitePopups();

  // Mobile navigation
  const toggle=document.querySelector(".menu-toggle"), nav=document.querySelector(".nav");
  if(toggle && nav){
    toggle.setAttribute("aria-label","Open navigation");
    toggle.setAttribute("aria-expanded","false");
    toggle.addEventListener("click",()=>{
      const open=nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded",open?"true":"false");
      toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");
    });
    nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded","false");
      toggle.setAttribute("aria-label","Open navigation");
    }));
  }


  // Account system (front-end demo only; data is stored in this browser).
  const account=getAccount();
  document.querySelectorAll("#account-nav").forEach(a=>{if(account){a.href="profile.html";a.textContent="YOUR PROFILE"}});
  const signup=document.querySelector("#signup-form");
  if(signup)signup.addEventListener("submit",e=>{
    e.preventDefault();
    if(localStorage.getItem("arcadicAccount")) return alert("AN ACCOUNT ALREADY EXISTS IN THIS BROWSER. LOG IN INSTEAD.");
    const email=document.querySelector("#signup-email").value.trim().toLowerCase();
    const password=document.querySelector("#signup-password").value;
    const username=document.querySelector("#signup-username").value.trim();
    const display=document.querySelector("#signup-display").value.trim();
    localStorage.setItem("arcadicAccount",JSON.stringify({email,password,username,display,avatar:"👾",points:0}));
    localStorage.setItem("arcadicLoggedIn","true");
    location.href="profile.html";
  });
  const login=document.querySelector("#login-form");
  if(login)login.addEventListener("submit",e=>{
    e.preventDefault();
    const a=getAccount(),email=document.querySelector("#login-email").value.trim().toLowerCase(),password=document.querySelector("#login-password").value;
    if(a&&a.email===email&&a.password===password){localStorage.setItem("arcadicLoggedIn","true");location.href="profile.html"}else alert("LOGIN FAILED — CHECK YOUR EMAIL AND PASSWORD.");
  });
  const pf=document.querySelector("#profile-form");
  if(pf){
    const a=getAccount();
    if(!a||localStorage.getItem("arcadicLoggedIn")!=="true"){location.href="login.html";return}
    document.querySelector("#profile-username").value=a.username||"";
    document.querySelector("#profile-display-input").value=a.display||"";
    const avatar=a.avatar||"👾";
    document.querySelector("#profile-display").textContent=a.display||"PLAYER";
    document.querySelector("#profile-handle").textContent="@"+(a.username||"player");
    document.querySelector("#profile-points").textContent=a.points||0;
    document.querySelector("#profile-avatar").textContent=avatar;
    const avatarOptions=document.querySelectorAll(".avatar-option");
    avatarOptions.forEach(option=>{
      const selected=option.dataset.avatar===avatar;
      option.classList.toggle("selected",selected);
      option.setAttribute("aria-pressed",selected?"true":"false");
      option.onclick=()=>{avatarOptions.forEach(x=>{x.classList.remove("selected");x.setAttribute("aria-pressed","false")});option.classList.add("selected");option.setAttribute("aria-pressed","true");};
    });
    pf.addEventListener("submit",e=>{
      e.preventDefault();a.username=document.querySelector("#profile-username").value.trim();a.display=document.querySelector("#profile-display-input").value.trim();
      const selected=document.querySelector(".avatar-option.selected");
      a.avatar=selected?selected.dataset.avatar:"👾";
      delete a.picture;
      localStorage.setItem("arcadicAccount",JSON.stringify(a));location.reload();
    });
    document.querySelector("#logout").onclick=()=>{localStorage.removeItem("arcadicLoggedIn");location.href="index.html"};
  }

  // Blog data
  const defaults=[
    {user:"RetroRae",title:"Why CRT TVs Just Hit Different",body:"There was something special about sitting close to a chunky CRT with a controller in your hands. The scanlines, the startup sounds and the instant response made every session feel like an event.",date:"Sep 2, 2026"},
    {user:"8BitBen",title:"My Top 5 Arcade Memories",body:"Friday night, pocket full of coins, and one goal: beat the score on the machine before someone else did. Arcades were competitive, noisy and brilliant.",date:"Aug 29, 2026"},
    {user:"PixelPilot",title:"The Joy of Cartridge Games",body:"No installs. No updates. Just blow the dust off, push the cartridge in and play. Modern gaming is incredible, but physical cartridges still have a magic of their own.",date:"Aug 21, 2026"}
  ];
  const getPosts=()=>JSON.parse(localStorage.getItem("arcadicPosts")||"null")||defaults;
  const savePosts=p=>localStorage.setItem("arcadicPosts",JSON.stringify(p));
  const renderPosts=(target,posts)=>{
    if(!target)return;
    target.innerHTML=posts.map(p=>`<article class="post-card"><div class="meta">@${escapeHTML(p.user)} // ${escapeHTML(p.date)}</div><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.body)}</p></article>`).join("");
  };
  const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  renderPosts(document.querySelector("#home-posts"),getPosts().slice(0,3));
  renderPosts(document.querySelector("#blog-posts"),getPosts());

  const form=document.querySelector("#blog-form");
  if(form)form.addEventListener("submit",e=>{
    e.preventDefault();
    const posts=getPosts();
    posts.unshift({user:document.querySelector("#post-user").value.trim(),title:document.querySelector("#post-title").value.trim(),body:document.querySelector("#post-body").value.trim(),date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})});
    savePosts(posts); form.reset(); renderPosts(document.querySelector("#blog-posts"),posts); alert("POST PUBLISHED!"); 
  });

  // Shop
  const products=[
    {id:1,name:"Rainbow USB Arcade Stick",price:79.99,icon:"🕹️",desc:"PC-compatible arcade stick with chunky buttons and a retro shell.",details:"Bring the arcade cabinet feeling to your desk. This chunky USB stick is built for fighting games, beat 'em ups and high-score sessions, with colourful controls and a classic arcade layout.",specs:["USB wired connection","PC compatible","8 arcade-style buttons","2.0 m cable"]},
    {id:2,name:"Mini Pixel Controller",price:29.99,icon:"🎮",desc:"Compact USB controller for classic-style gaming.",details:"Small enough to keep beside your keyboard, but packed with old-school charm. A lightweight controller made for platformers, racers and retro collections.",specs:["USB wired connection","PC compatible","Dual analogue sticks","Turbo-style action buttons"]},
    {id:3,name:"Desktop Arcade Cabinet",price:349.99,icon:"👾",desc:"Tabletop cabinet for your desk, lounge or gaming room.",details:"A tiny arcade for your tiny empire. The Desktop Arcade Cabinet is designed as a statement piece for retro rooms, with a cabinet silhouette inspired by classic coin-op machines.",specs:["Tabletop design","Arcade-style controls","Built-in display","Retro cabinet finish"]},
    {id:4,name:"Retro Console Stand",price:24.99,icon:"📺",desc:"Pixel-style display stand for your favourite hardware.",details:"Give your console the pedestal it deserves. This chunky display stand turns your setup into a mini retro showroom while keeping hardware neatly raised.",specs:["Pixel-inspired design","Display/storage stand","Desk-friendly footprint","Retro arcade finish"]},
    {id:5,name:"Arcade Neon Sign",price:39.99,icon:"⚡",desc:"A colourful wall sign to finish your retro setup.",details:"Turn the lights down and let the arcade glow. A bright statement piece for bedrooms, gaming corners and anyone who thinks their wall needs more neon.",specs:["Wall display","USB powered","Arcade-inspired lettering","Low-power LED lighting"]},
    {id:6,name:"8-Bit Sticker Pack",price:8.99,icon:"⭐",desc:"Assorted arcade-inspired stickers for consoles and laptops.",details:"A pocket-sized power-up for your gear. Decorate laptops, controllers, notebooks and consoles with a set of colourful 8-bit inspired designs.",specs:["Assorted designs","8-bit inspired","Suitable for smooth surfaces","Collector-style pack"]}
  ];
  let cart=JSON.parse(localStorage.getItem("arcadicCart")||"[]");
  const updateCart=()=>{
    localStorage.setItem("arcadicCart",JSON.stringify(cart));
    document.querySelectorAll(".cart-count").forEach(x=>x.textContent=cart.reduce((a,b)=>a+b.qty,0));
    const box=document.querySelector("#cart-items"),total=document.querySelector("#cart-total");
    if(!box)return;
    box.innerHTML=cart.length?cart.map(i=>`<div class="cart-row"><span>${escapeHTML(i.name)} × ${i.qty}</span><span>£${(i.price*i.qty).toFixed(2)} <button class="text-link remove-item" data-id="${i.id}">REMOVE</button></span></div>`).join(""):"<p class='small'>Your cart is empty.</p>";
    total.textContent="£"+cart.reduce((a,b)=>a+b.price*b.qty,0).toFixed(2);
    box.querySelectorAll(".remove-item").forEach(b=>b.onclick=()=>{cart=cart.filter(i=>i.id!=b.dataset.id);updateCart()});
  };
  const shop=document.querySelector("#shop-grid");
  if(shop){
    shop.innerHTML=products.map(p=>`<article class="product" tabindex="0" role="button" aria-label="View details for ${p.name}" data-id="${p.id}"><div class="product-art">${p.icon}</div><div class="product-copy"><p class="product-label">ARCADIC PICK</p><h3>${p.name}</h3><p>${p.desc}</p><div class="price">£${p.price.toFixed(2)}</div><span class="view-product">VIEW PRODUCT →</span></div><button class="btn rainbow-btn add-cart" data-id="${p.id}">ADD TO CART</button></article>`).join("");
    const modal=document.querySelector("#product-modal"), detailName=document.querySelector("#detail-name"), detailArt=document.querySelector("#detail-art"), detailDesc=document.querySelector("#detail-description"), detailPrice=document.querySelector("#detail-price"), detailMeta=document.querySelector("#detail-meta"), detailAdd=document.querySelector("#detail-add");
    let selectedProduct=null;
    const openProduct=id=>{
      selectedProduct=products.find(x=>x.id==id); if(!selectedProduct)return;
      detailArt.textContent=selectedProduct.icon; detailName.textContent=selectedProduct.name; detailDesc.textContent=selectedProduct.details; detailPrice.textContent="£"+selectedProduct.price.toFixed(2);
      detailMeta.innerHTML=selectedProduct.specs.map(x=>`<span>✓ ${escapeHTML(x)}</span>`).join("");
      modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.classList.add("modal-open"); detailAdd.focus();
    };
    const closeProduct=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");selectedProduct=null;};
    shop.querySelectorAll(".product").forEach(card=>{
      card.addEventListener("click",e=>{if(!e.target.closest(".add-cart"))openProduct(card.dataset.id)});
      card.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&!e.target.closest(".add-cart")){e.preventDefault();openProduct(card.dataset.id)}});
    });
    shop.querySelectorAll(".add-cart").forEach(b=>b.onclick=e=>{e.stopPropagation();const p=products.find(x=>x.id==b.dataset.id),existing=cart.find(x=>x.id==p.id);existing?existing.qty++:cart.push({...p,qty:1});updateCart();});
    detailAdd.onclick=()=>{if(!selectedProduct)return;const existing=cart.find(x=>x.id===selectedProduct.id);existing?existing.qty++:cart.push({...selectedProduct,qty:1});updateCart();closeProduct();};
    document.querySelectorAll("[data-close-product]").forEach(x=>x.onclick=closeProduct);
    document.querySelector("#product-close").onclick=closeProduct;
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeProduct()});
    document.querySelector("#clear-cart").onclick=()=>{cart=[];updateCart()};
    document.querySelector("#checkout").onclick=()=>{if(!cart.length)return alert("YOUR CART IS EMPTY!");alert("DEMO CHECKOUT: No payment has been taken. Thanks for shopping at ARCADIC!");};
    updateCart();
  }else updateCart();

  // Mini arcade games
  const canvas=document.querySelector("#gameCanvas");
  if(canvas) initArcade(canvas);
});


function initSitePopups(){
  const path=location.pathname.split("/").pop()||"index.html";
  const authPage=["login.html","signup.html","profile.html"].includes(path);
  const loggedIn=localStorage.getItem("arcadicLoggedIn")==="true";
  const make=(html,cls)=>{const el=document.createElement("div");el.className=cls;el.innerHTML=html;document.body.appendChild(el);return el};

  if(!localStorage.getItem("arcadicCookieConsent")){
    const cookie=make(`<div class="site-popup-box cookie-box"><div class="popup-icon">🍪</div><p class="eyebrow">ARCADIC NOTICE</p><h2>DO YOU ALLOW COOKIES?</h2><p>ARCADIC uses a small cookie to remember your cookie preference. Your game scores, cart and account demo data are stored locally in your browser. We don't use tracking cookies.</p><div class="popup-actions"><button class="btn rainbow-btn" data-cookie="allow">ALLOW COOKIES</button><button class="btn ghost-btn" data-cookie="deny">NO THANKS</button></div></div>`,`site-popup cookie-popup`);
    cookie.querySelectorAll("[data-cookie]").forEach(b=>b.onclick=()=>{document.cookie=`arcadicCookieConsent=${b.dataset.cookie}; max-age=31536000; path=/; SameSite=Lax`;localStorage.setItem("arcadicCookieConsent",b.dataset.cookie);cookie.remove();showSignupPopup()});
  } else if(!authPage&&!loggedIn) setTimeout(showSignupPopup,3500);

  function showSignupPopup(){
    if(authPage||localStorage.getItem("arcadicLoggedIn")==="true"||localStorage.getItem("arcadicSignupDismissed"))return;
    if(document.querySelector(".signup-popup"))return;
    const hasAccount=!!localStorage.getItem("arcadicAccount");
    const pop=make(`<div class="site-popup-box signup-box"><button class="popup-close" aria-label="Close">×</button><div class="popup-icon">👾</div><p class="eyebrow">PLAYER 1</p><h2>${hasAccount?"WELCOME BACK":"JOIN THE ARCADIC"}</h2><p>${hasAccount?"Your arcade account is already saved in this browser. Log in to keep your points and high scores together.":"Create your free player profile to save arcade points, choose your avatar and get your scores on the leaderboard."}</p><div class="popup-actions"><a class="btn rainbow-btn" href="${hasAccount?"login.html":"signup.html"}">${hasAccount?"LOG IN":"SIGN UP"}</a><button class="btn ghost-btn popup-dismiss">NO THANKS</button></div></div>`,`site-popup signup-popup`);
    pop.querySelector(".popup-close").onclick=()=>{localStorage.setItem("arcadicSignupDismissed","true");pop.remove()};
    pop.querySelector(".popup-dismiss").onclick=()=>{localStorage.setItem("arcadicSignupDismissed","true");pop.remove()};
  }
}

function awardPoints(amount){const a=getAccount();if(!a||localStorage.getItem("arcadicLoggedIn")!=="true")return;a.points=(a.points||0)+amount;localStorage.setItem("arcadicAccount",JSON.stringify(a))}
function getAccount(){try{return JSON.parse(localStorage.getItem("arcadicAccount")||"null")}catch(e){return null}}

function initArcade(canvas){
  const ctx=canvas.getContext("2d"), touchControls=document.querySelector("#touch-controls"), scoreEl=document.querySelector("#score"),status=document.querySelector("#game-status"),title=document.querySelector("#game-title"),help=document.querySelector("#game-help"),start=document.querySelector("#start-game");
  const boardTitle=document.querySelector("#scoreboard-title"),boardList=document.querySelector("#scoreboard-list");
  const scoreBoardKey="arcadicHighScores";
  const gameNames={space:"SPACE INVADERS",pacman:"PAC-MAN",pingpong:"PING PONG"};
  const demoScores={
    space:[{display:"PixelPilot",date:"02 Sep 2026",score:420},{display:"8BitBen",date:"31 Aug 2026",score:350},{display:"RetroRae",date:"28 Aug 2026",score:290},{display:"CoinOpKid",date:"24 Aug 2026",score:210},{display:"ArcadeAce",date:"20 Aug 2026",score:170}],
    pacman:[{display:"RetroRae",date:"03 Sep 2026",score:620},{display:"PixelPilot",date:"30 Aug 2026",score:540},{display:"8BitBen",date:"27 Aug 2026",score:460},{display:"MazeMaster",date:"22 Aug 2026",score:390},{display:"CoinOpKid",date:"18 Aug 2026",score:310}],
    pingpong:[{display:"PongMaster",date:"03 Sep 2026",score:500},{display:"PixelPilot",date:"30 Aug 2026",score:400},{display:"RetroRae",date:"27 Aug 2026",score:300},{display:"8BitBen",date:"22 Aug 2026",score:200},{display:"ArcadeAce",date:"18 Aug 2026",score:100}]
  };
  const boardEscape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  function getHighScores(){try{return JSON.parse(localStorage.getItem(scoreBoardKey)||"null")||{}}catch(e){return {}}}
  function renderScoreboard(){
    if(!boardList)return;
    const boards=getHighScores();
    const saved=Array.isArray(boards[type])?boards[type]:[];
    const entries=demoScores[type].concat(saved).slice().sort((a,b)=>Number(b.score)-Number(a.score)).slice(0,10);
    boardTitle.textContent=gameNames[type];
    boardList.innerHTML=entries.map((e,i)=>`<div class="scoreboard-row"><span class="rank">${i+1}</span><strong>${boardEscape(e.display||"PLAYER")}</strong><span>${boardEscape(e.date||"—")}</span><b>${Number(e.score)||0}</b></div>`).join("");
  }
  function saveHighScore(points){
    const a=getAccount();
    if(!a||localStorage.getItem("arcadicLoggedIn")!=="true")return;
    const boards=getHighScores();
    boards[type]=Array.isArray(boards[type])?boards[type]:[];
    boards[type].push({display:a.display||a.username||"PLAYER",date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),score:points});
    boards[type].sort((x,y)=>Number(y.score)-Number(x.score));
    boards[type]=boards[type].slice(0,10);
    localStorage.setItem(scoreBoardKey,JSON.stringify(boards));
    renderScoreboard();
  }
  let type="space",running=false,score=0,keys={},raf;
  function buildTouchControls(){
    if(!touchControls)return;
    const layouts={
      space:[['left','◀'],['fire','●'],['right','▶']],
      pacman:[['up','▲'],['left','◀'],['down','▼'],['right','▶']],
      pingpong:[['up','▲'],['down','▼']]
    };
    touchControls.innerHTML=layouts[type].map(([key,label])=>`<button type="button" class="touch-btn touch-${key}" data-key="${key}" aria-label="${key}">${label}</button>`).join("");
    touchControls.querySelectorAll(".touch-btn").forEach(btn=>{
      const key=btn.dataset.key;
      const press=e=>{e.preventDefault();keys[key==="fire"?" ":key==="left"?"ArrowLeft":key==="right"?"ArrowRight":key==="up"?"ArrowUp":"ArrowDown"]=true;btn.classList.add("pressed");if(e.pointerId!=null)btn.setPointerCapture?.(e.pointerId)};
      const release=e=>{e.preventDefault();keys[key==="fire"?" ":key==="left"?"ArrowLeft":key==="right"?"ArrowRight":key==="up"?"ArrowUp":"ArrowDown"]=false;btn.classList.remove("pressed")};
      btn.addEventListener("pointerdown",press);btn.addEventListener("pointerup",release);btn.addEventListener("pointercancel",release);btn.addEventListener("pointerleave",e=>{if(e.buttons===0)release(e)});
    });
  }
  const tabs=document.querySelectorAll(".game-tab");
  tabs.forEach(t=>t.onclick=()=>{tabs.forEach(x=>x.classList.remove("active"));t.classList.add("active");type=t.dataset.game;setInfo();reset();draw();renderScoreboard();buildTouchControls()});
  function setInfo(){title.textContent=gameNames[type];help.textContent=type==="space"?"← → move • SPACE fire • ENTER restart":type==="pacman"?"Arrow keys move • collect dots • avoid ghosts":"↑ ↓ move paddle • first to 5 wins";}
  function reset(){running=false;cancelAnimationFrame(raf);score=0;scoreEl.textContent=0;status.textContent="READY";}
  function draw(){
    ctx.fillStyle="#020205";ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.font="16px monospace";ctx.fillStyle="#5c4b68";for(let x=20;x<canvas.width;x+=40)for(let y=20;y<canvas.height;y+=40)ctx.fillText(".",x,y);
    if(type==="space") drawSpace(false); else if(type==="pacman") drawPac(false); else drawPingPong(false);
  }
  function startGame(){running=true;score=0;status.textContent="PLAYING";scoreEl.textContent=0;let state=type==="space"?spaceState():type==="pacman"?pacState():pingPongState();loop(state)}
  function loop(s){if(!running)return;update(s);render(s);raf=requestAnimationFrame(()=>loop(s))}
  function update(s){if(type==="space")updateSpace(s);if(type==="pacman")updatePac(s);if(type==="pingpong")updatePingPong(s)}
  function render(s){ctx.fillStyle="#020205";ctx.fillRect(0,0,canvas.width,canvas.height);type==="space"?drawSpace(true,s):type==="pacman"?drawPac(true,s):drawPingPong(true,s)}
  function spaceState(){return {px:canvas.width/2,shots:[],aliens:Array.from({length:5},(_,r)=>Array.from({length:9},(_,c)=>({x:110+c*55,y:55+r*35,alive:true}))).flat(),dir:1,cool:0}}
  function updateSpace(s){if(keys.ArrowLeft)s.px-=5;if(keys.ArrowRight)s.px+=5;s.px=Math.max(25,Math.min(canvas.width-25,s.px));if(keys[" "]&&s.cool<=0){s.shots.push({x:s.px,y:380});s.cool=12}s.cool--;s.shots.forEach(a=>a.y-=7);s.shots=s.shots.filter(a=>a.y>0);s.shots.forEach(a=>s.aliens.forEach(v=>{if(v.alive&&Math.abs(a.x-v.x)<18&&Math.abs(a.y-v.y)<15){v.alive=false;a.y=-20;score+=10;scoreEl.textContent=score}}));s.aliens.forEach(v=>v.x+=s.dir*.35);if(s.aliens.some(v=>v.alive&&(v.x>690||v.x<30)))s.dir*=-1;if(s.aliens.every(v=>!v.alive)){status.textContent="YOU WIN!";awardPoints(score);saveHighScore(score);running=false}}
  function drawSpace(active,s){ctx.fillStyle="#18e6ff";ctx.font="22px monospace";ctx.fillText("▲",s?s.px:360,395);if(s)s.shots.forEach(a=>{ctx.fillStyle="#ffe34d";ctx.fillRect(a.x-2,a.y,4,10)});const arr=s?s.aliens:spaceState().aliens;arr.forEach(v=>{if(v.alive){ctx.fillStyle="#8dff2f";ctx.fillText("👾",v.x-11,v.y+8)}})}
  function pacState(){return {x:55,y:55,dx:0,dy:0,dots:Array.from({length:10},(_,i)=>({x:90+i*60,y:210,got:false})),ghost:{x:600,y:210}}}
  function updatePac(s){if(keys.ArrowLeft)s.dx=-2.8;if(keys.ArrowRight)s.dx=2.8;if(keys.ArrowUp)s.dy=-2.8;if(keys.ArrowDown)s.dy=2.8;s.x=Math.max(15,Math.min(705,s.x+s.dx));s.y=Math.max(25,Math.min(395,s.y+s.dy));s.dots.forEach(d=>{if(!d.got&&Math.hypot(s.x-d.x,s.y-d.y)<18){d.got=true;score+=10;scoreEl.textContent=score}});s.ghost.x+=(s.x>s.ghost.x?1:-1);s.ghost.y+=(s.y>s.ghost.y?1:-1);if(Math.hypot(s.x-s.ghost.x,s.y-s.ghost.y)<22){status.textContent="GAME OVER";running=false}if(s.dots.every(d=>d.got)){status.textContent="YOU WIN!";awardPoints(score);saveHighScore(score);running=false}}
  function drawPac(active,s){const p=s||pacState();ctx.fillStyle="#ffe34d";ctx.beginPath();ctx.arc(p.x,p.y,15,.25*Math.PI,1.75*Math.PI);ctx.lineTo(p.x,p.y);ctx.fill();p.dots.forEach(d=>{if(!d.got){ctx.fillStyle="#fff";ctx.fillRect(d.x-3,d.y-3,6,6)}});ctx.font="25px monospace";ctx.fillText("👻",p.ghost.x-12,p.ghost.y+8)}
  function pingPongState(){return {py:210,aiY:210,bx:360,by:210,vx:4,vy:2.4,player:0,ai:0,serve:0,done:false}}
  function resetPongBall(s,direction){s.bx=360;s.by=210;s.vx=4*direction;s.vy=(Math.random()>.5?1:-1)*(2+Math.random()*1.5)}
  function updatePingPong(s){
    if(keys.ArrowUp)s.py-=5;if(keys.ArrowDown)s.py+=5;s.py=Math.max(45,Math.min(375,s.py));
    s.aiY+=(s.by-s.aiY)*.055;s.aiY=Math.max(45,Math.min(375,s.aiY));s.bx+=s.vx;s.by+=s.vy;
    if(s.by<28||s.by>392)s.vy*=-1;
    if(s.bx<48&&Math.abs(s.by-s.py)<48){s.bx=48;s.vx=Math.abs(s.vx)+.15;s.vy+=(s.by-s.py)*.035}
    if(s.bx>672&&Math.abs(s.by-s.aiY)<48){s.bx=672;s.vx=-(Math.abs(s.vx)+.15);s.vy+=(s.by-s.aiY)*.035}
    if(s.bx<0){s.ai++;resetPongBall(s,1)}
    if(s.bx>720){s.player++;score=s.player*100;scoreEl.textContent=score;resetPongBall(s,-1)}
    if(s.player>=5||s.ai>=5){score=s.player*100;scoreEl.textContent=score;status.textContent=s.player>=5?"YOU WIN!":"GAME OVER";if(s.player>=5){awardPoints(score);saveHighScore(score)}running=false}
  }
  function drawPingPong(active,s){const p=s||pingPongState();ctx.strokeStyle="#3b2949";ctx.setLineDash([8,10]);ctx.beginPath();ctx.moveTo(360,20);ctx.lineTo(360,400);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#18e6ff";ctx.fillRect(28,p.py-48,12,96);ctx.fillStyle="#ff3cac";ctx.fillRect(680,p.aiY-48,12,96);ctx.fillStyle="#ffe34d";ctx.beginPath();ctx.arc(p.bx,p.by,9,0,Math.PI*2);ctx.fill();ctx.font="14px 'Press Start 2P'";ctx.fillStyle="#8dff2f";ctx.fillText(String(p.player),330,48);ctx.fillStyle="#ff3cac";ctx.fillText(String(p.ai),380,48);if(!active){ctx.font="12px 'Press Start 2P'";ctx.fillStyle="#b7a9c8";ctx.fillText("FIRST TO 5",300,385)}}
  document.addEventListener("keydown",e=>{keys[e.key]=true;if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," "].includes(e.key))e.preventDefault();if(e.key==="Enter"&&!running)startGame()});
  document.addEventListener("keyup",e=>keys[e.key]=false);start.onclick=startGame;setInfo();draw();renderScoreboard();buildTouchControls();
}