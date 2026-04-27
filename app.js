

// ══════════════════════════════════════
// HOME PAGE — WAVE + STATS + LIVE FEED
// ══════════════════════════════════════

function initHomePage() {
  drawHomeWave();
  initCounterStats();
  initLiveFeed();

// ══════════════════════════════════════
// HOME PAGE — WAVE + STATS + LIVE FEED
// ══════════════════════════════════════

function initHomePage() {
  drawHomeWave();
  initCounterStats();
  initLiveFeed();
}

// ── Ambient wave canvas ──
function drawHomeWave() {
  var canvas = document.getElementById('fm-waveCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = 200;
  var t = 0;
  function frame() {
    var homePage = document.getElementById('page-home');
    if (!homePage || !homePage.classList.contains('active')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, '#E91E8C');
    grad.addColorStop(0.5, '#7B2FFF');
    grad.addColorStop(1, '#00E676');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    for (var w = 0; w < 3; w++) {
      ctx.beginPath();
      ctx.globalAlpha = 0.3 - w * 0.08;
      for (var x = 0; x <= canvas.width; x += 3) {
        var y = canvas.height / 2
          + Math.sin((x / canvas.width) * Math.PI * 4 + t + w * 1.2) * (30 - w * 8)
          + Math.sin((x / canvas.width) * Math.PI * 7 + t * 1.3 + w) * (12 - w * 3);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    t += 0.012;
    requestAnimationFrame(frame);
  }
  frame();
}

// ── Animated counter stats ──
function initCounterStats() {
  var observed = false;
  var els = document.querySelectorAll('.fm-stat-num');
  if (!els.length) return;

  function runCounters() {
    if (observed) return;
    observed = true;
    els.forEach(function(el) {
      var target = parseInt(el.getAttribute('data-target')) || 0;
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      // Reset to 0 to start animation (layout already sized from initial value)
      el.textContent = prefix + '0' + suffix;
      var duration = 1800;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var val = Math.floor(eased * target);
        var formatted = val.toLocaleString();
        el.textContent = prefix + formatted + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target.toLocaleString() + suffix;
      }
      requestAnimationFrame(step);
    });
  }

  var statsBar = document.querySelector('.fm-stats-bar');
  if (!statsBar) return;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) runCounters();
    }, { threshold: 0.3 }).observe(statsBar);
  } else {
    setTimeout(runCounters, 1000);
  }
}

// ── Live feed rotation ──
function initLiveFeed() {
  var feedItems = [
    { color: '#00E676', text: 'Luna Rivera just protected <strong>Midnight Bloom</strong>', time: 'just now' },
    { color: '#E91E8C', text: 'Alex M. tipped <strong>€12</strong> to DJ Nexus', time: '18s ago' },
    { color: '#A06EFF', text: 'EXIT Festival · <strong>1,240 tickets</strong> registered on Fortis', time: '1m ago' },
    { color: '#00E676', text: 'Zara Pulse certificate <strong>FM-2026-441</strong> issued', time: '3m ago' },
    { color: '#FFD700', text: 'Marcus Wave earned <strong>€340</strong> from fan support', time: '4m ago' },
    { color: '#E91E8C', text: 'Kira Tanaka unlocked <strong>exclusive content</strong> for 84 fans', time: '5m ago' },
    { color: '#A06EFF', text: 'DJ Nexus upcoming giveaway — <strong>2 VIP tickets</strong>', time: '7m ago' },
    { color: '#00E676', text: 'The Void just joined Fortis — <strong>340K streams</strong>', time: '9m ago' },
  ];
  var currentIdx = 0;
  var feed = document.getElementById('fm-feed');
  if (!feed) return;

  setInterval(function() {
    if (!document.getElementById('page-home').classList.contains('active')) return;
    currentIdx = (currentIdx + 1) % feedItems.length;
    var item = feedItems[currentIdx];
    var newEl = document.createElement('div');
    newEl.className = 'fm-feed-item fm-feed-active';
    newEl.style.cssText = 'animation: fmReveal 0.4s ease forwards;';
    newEl.innerHTML = '<span class="fm-feed-dot" style="background:' + item.color + '"></span>'
      + '<span class="fm-feed-text">' + item.text + '</span>'
      + '<span class="fm-feed-time">' + item.time + '</span>';

    // Deactivate current active
    var active = feed.querySelector('.fm-feed-active');
    if (active) active.classList.remove('fm-feed-active');

    // Insert at top, remove last if more than 5
    feed.insertBefore(newEl, feed.firstChild);
    var items = feed.querySelectorAll('.fm-feed-item');
    if (items.length > 5) feed.removeChild(items[items.length - 1]);
  }, 3500);
}


// ── NAVIGATION ──
function closeAllSubs() {
  // Close all now-sub overlays
  document.querySelectorAll('.now-sub, .lr-player-page').forEach(function(el) {
    el.classList.remove('open');
  });
  // Close gear store profile
  var gsp = document.getElementById('gssProfile');
  if (gsp) gsp.classList.remove('open');
  // Stop jukebox timers if running
  if (typeof jbProgInt !== 'undefined' && jbProgInt) { clearInterval(jbProgInt); jbProgInt = null; }
  if (typeof jbVoteInterval !== 'undefined') clearInterval(jbVoteInterval);
  if (typeof jbAutoVoteInterval !== 'undefined') clearInterval(jbAutoVoteInterval);
  // Stop drop stage timers if running
  if (typeof drStageInt !== 'undefined' && drStageInt) clearInterval(drStageInt);
  if (typeof drPlayerInt !== 'undefined' && drPlayerInt) clearInterval(drPlayerInt);
  if (typeof drLiveFansInt !== 'undefined' && drLiveFansInt) clearInterval(drLiveFansInt);
}

function showPage(id) {
  closeAllSubs();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  var target = document.getElementById('page-' + id);
  if (target) { target.classList.add('active'); localStorage.setItem('fm_last_page', id); }
  // Update desktop nav active state
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.remove('active');
    var fn = a.getAttribute('onclick') || '';
    if (fn.indexOf("'" + id + "'") !== -1 || fn.indexOf('"' + id + '"') !== -1) {
      a.classList.add('active');
    }
  });
  window.scrollTo(0, 0);
  if (id === 'home')     loadHomeTrendingArtists();
  if (id === 'discover') loadDiscoverProfiles(filterArtists);
  if (id === 'artist') { if (typeof window.fmPopulateArtistPage === 'function') window.fmPopulateArtistPage(window._fmProfile); }
  if (id === 'edit-profile') { if (typeof window.epOpen === 'function') window.epOpen(); }
  if (id === 'gear') setTimeout(function(){ renderGearCards(); }, 50);
  if (id === 'studio') setTimeout(renderStudioCards, 50);
  if (id === 'dance') setTimeout(renderDanceCards, 50);
  if (id === 'clubs') setTimeout(filterClubs, 50);
  if (id === 'events') setTimeout(filterEvents, 50);
}

// ── FILE HANDLING ──
let selectedFile = null;
function handleFileSelect(event) {
  selectedFile = event.target.files[0];
  if (selectedFile) {
    document.getElementById('fileName').textContent = selectedFile.name;
    document.getElementById('fileInfo').style.display = 'block';
    document.getElementById('dropZone').classList.add('file-selected');
  }
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

// ── PROTECTION FLOW ──
let activeCert = {};
function triggerBiometric() {
  var trackTitle = document.getElementById('trackTitle') ? document.getElementById('trackTitle').value : '';
  if (!trackTitle) { showToast('Please enter a track title first'); return; }
  biometricPassed = false;
  // Show Step 1 — method selection
  var modal = document.getElementById('bioModal');
  var step1 = document.getElementById('bioStep1');
  var step2 = document.getElementById('bioStep2');
  if (step1) step1.style.display = 'block';
  if (step2) step2.style.display = 'none';
  if (modal) modal.classList.add('show');
}

function showArtistTab(tab) {
  var profile = document.getElementById('artist-tab-profile');
  var dashboard = document.getElementById('artist-tab-dashboard');
  var btnProfile = document.getElementById('tab-btn-profile');
  var btnDashboard = document.getElementById('tab-btn-dashboard');
  if (!profile || !dashboard) return;

  if (tab === 'dashboard') {
    profile.style.display = 'none';
    dashboard.style.display = 'block';
    if (btnProfile) { btnProfile.style.borderBottomColor = 'transparent'; btnProfile.style.color = 'rgba(255,255,255,0.35)'; }
    if (btnDashboard) { btnDashboard.style.borderBottomColor = '#C8A97E'; btnDashboard.style.color = '#fff'; }
  } else {
    profile.style.display = 'block';
    dashboard.style.display = 'none';
    if (btnProfile) { btnProfile.style.borderBottomColor = '#C8A97E'; btnProfile.style.color = '#fff'; }
    if (btnDashboard) { btnDashboard.style.borderBottomColor = 'transparent'; btnDashboard.style.color = 'rgba(255,255,255,0.35)'; }
  }
}

function closeBioModal() {
  var m = document.getElementById('bioModal');
  if (m) m.classList.remove('show');
}

// Called from "Authenticate Now" button in Step 1
async function startBiometricAuth() {
  // Transition to Step 2 — scanning animation
  var step1 = document.getElementById('bioStep1');
  var step2 = document.getElementById('bioStep2');
  if (step1) step1.style.display = 'none';
  if (step2) step2.style.display = 'block';

  var iconEl = document.getElementById('bioIcon');
  var titleEl = document.getElementById('bioTitle');
  var subtitleEl = document.getElementById('bioSubtitle');
  var progressEl = document.getElementById('bioProgress');
  var logEl = document.getElementById('bioLog');

  if (iconEl) iconEl.textContent = '🔐';
  if (titleEl) titleEl.textContent = 'Scanning Biometrics...';
  if (subtitleEl) subtitleEl.textContent = 'Hold still — reading fingerprint data';
  if (progressEl) progressEl.style.width = '0%';
  if (logEl) logEl.innerHTML = '';

  var steps = [
    [10,  '> Connecting to Fortis Auth API...'],
    [22,  '> Device authenticator detected...'],
    [38,  '> Fingerprint sensor activated...'],
    [52,  '> Reading biometric data...'],
    [65,  '> Cross-referencing Fortis registry...'],
    [78,  '> Generating cryptographic auth token...'],
    [90,  '> Binding token to artist identity...'],
    [100, '> ✓ Identity confirmed — session active'],
  ];

  for (var si = 0; si < steps.length; si++) {
    await delay(380 + Math.random() * 280);
    if (progressEl) progressEl.style.width = steps[si][0] + '%';
    if (logEl) {
      logEl.innerHTML += '<span style="color:' + (steps[si][0] === 100 ? '#00E676' : '#A06EFF') + ';">' + steps[si][1] + '</span><br>';
      logEl.scrollTop = logEl.scrollHeight;
    }
  }

  // Success state
  if (iconEl) iconEl.textContent = '✅';
  if (titleEl) titleEl.textContent = 'Identity Verified!';
  if (subtitleEl) { subtitleEl.textContent = 'Biometric token issued — valid for this session'; subtitleEl.style.color = '#00E676'; }
  biometricPassed = true;

  await delay(1100);
  closeBioModal();
  await startProtection();
}

var biometricPassed = false;

async function startProtection() {
  const artistName = document.getElementById('artistName').value || 'Demo Artist';
  const trackTitle = document.getElementById('trackTitle').value;
  if (!trackTitle) { showToast('Please enter a track title'); return; }

  const box = document.getElementById('statusBox');
  box.classList.add('show');
  const steps = ['step1icon','step2icon','step3icon','step4icon'];
  for (let i = 0; i < steps.length; i++) {
    document.getElementById(steps[i]).className = 'step-icon step-active';
    document.getElementById(steps[i]).textContent = 'Loading';
  }

  async function setStep(n, done) {
    await delay(900);
    document.getElementById('step' + n + 'icon').className = 'step-icon ' + (done ? 'step-done' : 'step-active');
    document.getElementById('step' + n + 'icon').textContent = done ? '✓' : (n+1);
  }

  await setStep(1, true);
  await setStep(2, true);

  let hash = '';
  if (selectedFile && window.crypto && window.crypto.subtle) {
    try {
      const buf = await selectedFile.arrayBuffer();
      const hashBuf = await crypto.subtle.digest('SHA-256', buf);
      hash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2,'0')).join('');
    } catch(e) {}
  }
  if (!hash) {
    for (let i = 0; i < 64; i++) hash += Math.floor(Math.random()*16).toString(16);
  }

  await setStep(3, true);
  await setStep(4, true);

  const certId = 'FM-2026-' + Math.floor(100 + Math.random()*900);
  const date = new Date().toLocaleDateString('en-US', {year:'numeric',month:'short',day:'numeric'});

  activeCert = { artist: artistName, track: trackTitle + ' — ' + artistName, certId, date, hash };

  document.getElementById('certArtist').textContent = artistName;
  if (document.getElementById('certTrack')) document.getElementById('certTrack').textContent = trackTitle;
  if (document.getElementById('certTrackTitle')) document.getElementById('certTrackTitle').textContent = trackTitle;
  document.getElementById('certId').textContent = certId;
  document.getElementById('certDate').textContent = date;
  document.getElementById('certHash').textContent = hash.substring(0,32) + '...';
  document.getElementById('certModal').classList.add('show');

  const dashList = document.getElementById('protected-tracks-list');
  if (dashList) {
    const item = document.createElement('div');
    item.className = 'track-item';
    item.innerHTML = '<div class="track-info"><div class="track-name">' + trackTitle + '</div><div class="track-meta">' + artistName + ' · Just protected · ' + certId + '</div></div><div style="color:var(--green);font-size:0.85rem;">✓ Protected</div>';
    dashList.insertBefore(item, dashList.firstChild);
  }
}

function closeCertModal() { document.getElementById('certModal').classList.remove('show'); }

// ── PDF CERTIFICATE ──
function downloadCertPDF() {
  const LOGO_B64 = document.getElementById('fortis-logo-hidden').src;
  const cert = activeCert;
  const canvas = document.createElement('canvas');
  canvas.width = 794; canvas.height = 1123;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0d0818'; ctx.fillRect(0,0,794,1123);
  const grad = ctx.createLinearGradient(0,0,794,0);
  grad.addColorStop(0,'#E91E8C'); grad.addColorStop(1,'#7B2FFF');
  ctx.fillStyle = grad; ctx.fillRect(0,0,794,90);

  const logoImg = new Image();
  logoImg.onload = function() {
    ctx.drawImage(logoImg,40,15,60,60);
    ctx.fillStyle='#fff'; ctx.font='bold 28px Arial'; ctx.fillText('FORTIS MUSIC',115,48);
    ctx.font='13px Arial'; ctx.fillStyle='rgba(255,255,255,0.75)'; ctx.fillText('The Shield of Creative Rights',115,70);
    ctx.font='11px monospace'; ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.textAlign='right';
    ctx.fillText('CERT: ' + cert.certId,754,45);
    ctx.fillStyle='#00E676'; ctx.fillText('BLOCKCHAIN VERIFIED',754,65);
    ctx.textAlign='left';

    ctx.fillStyle='#fff'; ctx.font='bold 32px Arial'; ctx.textAlign='center';
    ctx.fillText('CERTIFICATE OF',397,155);
    const tg = ctx.createLinearGradient(200,0,600,0);
    tg.addColorStop(0,'#E91E8C'); tg.addColorStop(1,'#7B2FFF');
    ctx.fillStyle=tg; ctx.font='bold 28px Arial'; ctx.fillText('CREATIVE RIGHTS PROTECTION',397,190);
    ctx.fillStyle='#888899'; ctx.font='13px Arial';
    ctx.fillText('Official registration on the Fortis blockchain',397,215);
    ctx.textAlign='left';

    ctx.fillStyle='#1a0a3a'; ctx.strokeStyle='#7B2FFF'; ctx.lineWidth=2;
    roundRect(ctx,347,230,100,90,10); ctx.fill(); ctx.stroke();
    ctx.font='44px serif'; ctx.textAlign='center'; ctx.fillStyle='#A06EFF'; ctx.fillText('🛡',397,295);
    ctx.font='bold 11px Arial'; ctx.fillStyle='#00E676'; ctx.fillText('VERIFIED',397,315);

    ctx.fillStyle='#fff'; ctx.font='bold 26px Arial'; ctx.fillText(cert.track,397,370);
    ctx.font='14px Arial'; ctx.fillStyle='#888899'; ctx.fillText('Protected Work',397,395);
    ctx.textAlign='left';

    const rows=[['Artist / Rights Holder',cert.artist],['Certificate ID',cert.certId],['Registration Date',cert.date],['Blockchain Status','Anchored · Fortis Chain'],['Block Reference','#1,847,234'],['Protection Level','Full Copyright · All Rights Reserved']];
    let rowY=430;
    rows.forEach(function(row){
      ctx.fillStyle='#1a1428'; roundRect(ctx,40,rowY,714,44,6); ctx.fill();
      ctx.fillStyle='#888899'; ctx.font='12px Arial'; ctx.fillText(row[0],60,rowY+27);
      ctx.fillStyle='#fff'; ctx.font='bold 13px Arial'; ctx.textAlign='right'; ctx.fillText(row[1],734,rowY+27);
      ctx.textAlign='left'; rowY+=52;
    });

    const hashY=rowY+10;
    ctx.fillStyle='#0f0a1e'; ctx.strokeStyle='#00E676'; ctx.lineWidth=1.5;
    roundRect(ctx,40,hashY,714,70,8); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#888899'; ctx.font='11px Arial'; ctx.fillText('SHA-256 Cryptographic Fingerprint',60,hashY+22);
    ctx.fillStyle='#00E676'; ctx.font='11px monospace';
    const h=cert.hash||'a3f8c2d1e9b74f6a0c2e5d8b1f3a7c9e2d4f6b8a0c2e5d8b1f';
    ctx.fillText(h.substring(0,56),60,hashY+42); ctx.fillText(h.substring(56),60,hashY+58);

    ctx.fillStyle='#1a1428'; ctx.fillRect(0,1083,794,40);
    ctx.fillStyle='#555566'; ctx.font='10px Arial'; ctx.textAlign='center';
    ctx.fillText('2026 Fortis Music · fortismusic.com · The Shield of Creative Rights',397,1108);
    ctx.fillStyle='#00E676'; ctx.textAlign='right'; ctx.fillText('BLOCKCHAIN VERIFIED',754,1108);

    const a=document.createElement('a');
    a.href=canvas.toDataURL('image/png');
    a.download='Fortis-Certificate-'+cert.certId+'.png';
    a.click();
    showToast('Certificate downloaded!');
    closeCertModal();
  };
  logoImg.src = LOGO_B64;
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}

function wrapText(ctx,text,x,y,maxWidth,lineHeight){
  const words=text.split(' '); let line='',cy=y;
  words.forEach(function(word){
    const test=line+word+' ';
    if(ctx.measureText(test).width>maxWidth&&line!==''){ctx.fillText(line,x,cy);line=word+' ';cy+=lineHeight;}
    else{line=test;}
  });
  ctx.fillText(line,x,cy);
}

// ── AUDIO FINGERPRINT ──
async function analyzeFingerprintFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  document.getElementById('fpFileName').textContent = file.name;
  await drawFingerprint(file);
}

async function drawFingerprint(fileOrNull) {
  const canvas = document.getElementById('fpCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=canvas.width, H=canvas.height;
  ctx.fillStyle='#0d0818'; ctx.fillRect(0,0,W,H);

  let audioData = null;
  if (fileOrNull) {
    try {
      const ab = await fileOrNull.arrayBuffer();
      const ac = new (window.AudioContext||window.webkitAudioContext)();
      const decoded = await ac.decodeAudioData(ab);
      audioData = decoded.getChannelData(0);
    } catch(e) {}
  }

  const bands=120;
  const grad=ctx.createLinearGradient(0,0,W,0);
  grad.addColorStop(0,'#E91E8C'); grad.addColorStop(0.5,'#7B2FFF'); grad.addColorStop(1,'#00E676');
  for (let i=0;i<bands;i++) {
    let amplitude;
    if (audioData) {
      const start=Math.floor((i/bands)*audioData.length);
      const slice=audioData.slice(start,start+Math.floor(audioData.length/bands));
      amplitude=Math.min(1,Math.sqrt(slice.reduce(function(s,v){return s+v*v;},0)/slice.length)*8);
    } else {
      amplitude=Math.min(1,(0.2+0.6*Math.abs(Math.sin(i*0.3)*Math.cos(i*0.17)+Math.sin(i*0.05)))*(0.5+0.5*Math.random()));
    }
    const barH=Math.max(4,amplitude*(H-20));
    ctx.fillStyle=grad;
    ctx.fillRect((i/bands)*W,(H-barH)/2,(W/bands)-2,barH);
  }
  ctx.strokeStyle='rgba(200,180,255,0.07)'; ctx.lineWidth=1;
  for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(0,(i/5)*H);ctx.lineTo(W,(i/5)*H);ctx.stroke();}

  let hash='';
  for(let i=0;i<64;i++) hash+=Math.floor(Math.random()*16).toString(16);
  document.getElementById('fpHashDisplay').style.display='block';
  document.getElementById('fpHashValue').textContent='AQADtJm2'+hash.toUpperCase();
}

function generateDemoFingerprint() {
  document.getElementById('fpFileName').textContent='demo_track.mp3';
  drawFingerprint(null);
}

// ── DETECTION SIMULATOR ──
let selectedPlatform = 'youtube';
const platformNames = {youtube:'YouTube',spotify:'Spotify',tiktok:'TikTok',soundcloud:'SoundCloud'};

function selectPlatform(btn, platform) {
  document.querySelectorAll('.platform-btn').forEach(function(b){b.classList.remove('active-platform');});
  btn.classList.add('active-platform');
  selectedPlatform = platform;
}

async function runDetectionSim() {
  const result = document.getElementById('simResult');
  const track = document.getElementById('simTrack').value;
  const uploader = document.getElementById('simUploader').value;
  const platform = platformNames[selectedPlatform];
  result.style.display = 'block';
  result.innerHTML = '<div style="padding:16px;background:#0d0818;border-radius:12px;font-family:monospace;font-size:0.8rem;color:#a090b8;"><div>> Sending audio to Fortis API...</div></div>';

  const steps = [
    '> POST /v1/fingerprint/match — ' + platform,
    '> Analyzing audio stream...',
    '> Running acoustic fingerprint comparison...',
    '> Checking Fortis blockchain registry...',
    uploader==='unauthorized' ? '> Match confidence: 98.7% — PROTECTED TRACK DETECTED' : '> Match confidence: 99.1% — Checking biometric auth...',
    uploader==='unauthorized' ? '> Uploader biometric: NOT VERIFIED' : '> Biometric token: VALID',
  ];
  const container = result.querySelector('div');
  for (const step of steps) { await delay(500); container.innerHTML += '<div>'+step+'</div>'; }
  await delay(600);

  if (uploader==='unauthorized') {
    result.innerHTML = '<div class="sim-result-blocked"><div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;"><span style="font-size:2.2rem;">🚫</span><div><div style="font-family:\'Inter\',sans-serif;font-weight:800;font-size:1.1rem;color:#E91E8C;">UPLOAD BLOCKED</div><div style="font-size:0.8rem;color:#a090b8;">' + platform + ' — ' + new Date().toLocaleTimeString() + '</div></div></div><div style="display:flex;flex-direction:column;gap:6px;font-size:0.82rem;"><div style="display:flex;justify-content:space-between;"><span style="color:#a090b8;">Track</span><span>' + track.split('—')[0].trim() + '</span></div><div style="display:flex;justify-content:space-between;"><span style="color:#a090b8;">Match</span><span style="color:#E91E8C;">98.7%</span></div><div style="display:flex;justify-content:space-between;"><span style="color:#a090b8;">Biometric</span><span style="color:#E91E8C;">Not verified</span></div></div></div>';
    addAlertFeedItem(platform, track, false);
  } else {
    result.innerHTML = '<div class="sim-result-allowed"><div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;"><span style="font-size:2.2rem;">✅</span><div><div style="font-family:\'Inter\',sans-serif;font-weight:800;font-size:1.1rem;color:#00E676;">UPLOAD APPROVED</div><div style="font-size:0.8rem;color:#a090b8;">' + platform + ' — ' + new Date().toLocaleTimeString() + '</div></div></div><div style="display:flex;flex-direction:column;gap:6px;font-size:0.82rem;"><div style="display:flex;justify-content:space-between;"><span style="color:#a090b8;">Biometric</span><span style="color:#00E676;">Verified</span></div></div></div>';
    addAlertFeedItem(platform, track, true);
  }
}

function addAlertFeedItem(platform, track, allowed) {
  const feed = document.getElementById('alertFeed');
  if (!feed) return;
  const item = document.createElement('div');
  item.className = 'alert-item ' + (allowed ? 'alert-allowed' : 'alert-blocked');
  item.innerHTML = '<div style="display:flex;justify-content:space-between;"><strong>' + platform + '</strong> — ' + track.split('—')[0].trim() + '<span style="font-size:0.7rem;color:#a090b8;">now</span></div><div style="font-size:0.78rem;color:' + (allowed?'#00E676':'#E91E8C') + ';margin-top:2px;">' + (allowed?'ALLOWED — Verified':'BLOCKED — Unauthorized') + '</div>';
  feed.insertBefore(item, feed.firstChild);
}

// ── VIDEO & PLAYER TOGGLE ──
function togglePlayer(id) {
  const player = document.getElementById(id);
  const icon = document.getElementById(id+'-icon');
  if (!player) return;
  const isOpen = player.style.display !== 'none';
  ['player1','player2','player3'].forEach(function(pid){
    const p=document.getElementById(pid); const ico=document.getElementById(pid+'-icon');
    if(p) p.style.display='none'; if(ico) ico.textContent='▶';
  });
  if (!isOpen) { player.style.display='block'; if(icon) icon.textContent='⏸'; }
}

var _pendingVideoId = null;

function addYouTubeVideo() {
  const url = document.getElementById('ytUrlInput').value.trim();
  if (!url) { showToast('Please paste a YouTube URL'); return; }
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  if (!match) { showToast('Invalid YouTube URL'); return; }
  _pendingVideoId = match[1];
  var overlay = document.getElementById('ytConfirmOverlay');
  var check   = document.getElementById('ytConfirmCheck');
  var addBtn  = document.getElementById('ytConfirmAddBtn');
  if (check)  { check.checked = false; }
  if (addBtn) { addBtn.disabled = true; addBtn.style.opacity = '0.4'; addBtn.style.cursor = 'not-allowed'; }
  if (overlay) { overlay.style.display = 'flex'; }
}

function ytConfirmToggle(checked) {
  var btn = document.getElementById('ytConfirmAddBtn');
  if (!btn) return;
  btn.disabled     = !checked;
  btn.style.opacity = checked ? '1' : '0.4';
  btn.style.cursor  = checked ? 'pointer' : 'not-allowed';
}

function ytConfirmAdd() {
  if (!_pendingVideoId) return;
  var videoId = _pendingVideoId;
  _pendingVideoId = null;
  ytConfirmCancel();
  if (typeof window.fmSaveVideoToProfile === 'function') window.fmSaveVideoToProfile(videoId);
  document.getElementById('ytUrlInput').value = '';
  document.getElementById('add-video-form').style.display = 'none';
  showToast('Video added!');
}

function ytConfirmCancel() {
  var overlay = document.getElementById('ytConfirmOverlay');
  if (overlay) { overlay.style.display = 'none'; }
  _pendingVideoId = null;
}

// ── FAN PAGE ──
let selectedTipAmount = 5;

function showFanDonateModal() { document.getElementById('donateModal').classList.add('show'); }
function closeDonateModal() { document.getElementById('donateModal').classList.remove('show'); }
function showFanUnlockModal() { document.getElementById('unlockModal').classList.add('show'); }
function closeUnlockModal() { document.getElementById('unlockModal').classList.remove('show'); }

function setTipAmount(amount) {
  selectedTipAmount = amount;
  document.querySelectorAll('.tip-amt-btn').forEach(function(b){b.classList.remove('active-tip');});
  event.target.classList.add('active-tip');
  document.getElementById('tipCustom').value = '';
}

function sendTip() {
  const custom = document.getElementById('tipCustom').value;
  const amount = custom ? parseFloat(custom) : selectedTipAmount;
  const msg = document.getElementById('tipMessage').value;
  closeDonateModal();
  showToast('Tip of €' + amount.toFixed(2) + ' sent!');
  const list = document.getElementById('fan-tx-list');
  if (list) {
    const item = document.createElement('div');
    item.className = 'tx-row';
    item.innerHTML = '<div style="width:34px;height:34px;background:rgba(233,30,140,0.12);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">❤️</div><div style="flex:1;"><div style="font-size:0.85rem;font-weight:600;">Tip — Luna Rivera</div><div style="font-size:0.72rem;color:#a090b8;">Just now' + (msg?' · '+msg:'') + '</div></div><div style="color:#E91E8C;font-weight:700;font-size:0.88rem;">-€'+amount.toFixed(2)+'</div>';
    list.insertBefore(item, list.firstChild);
  }
  addFanActivity('❤️', 'Tipped an artist €' + amount.toFixed(2), 'Just now');
}

function confirmUnlock() {
  closeUnlockModal();
  showToast('Unlocked! Content added to your library.');
  addFanActivity('🔓', 'Unlocked exclusive content', 'Just now');
}

function addFanActivity(icon, text, time) {
  const feed = document.getElementById('fan-activity-feed');
  if (!feed) return;
  const item = document.createElement('div');
  item.style.cssText = 'display:flex;gap:10px;align-items:flex-start;padding-bottom:8px;border-bottom:1px solid rgba(200,180,255,0.07);';
  item.innerHTML = '<div style="font-size:1.1rem;flex-shrink:0;margin-top:2px;">'+icon+'</div><div><div style="font-size:0.82rem;font-weight:600;">'+text+'</div><div style="font-size:0.72rem;color:#a090b8;">'+time+'</div></div>';
  feed.insertBefore(item, feed.firstChild);
}

// ── HERO SEARCH ──
function heroSearch(val) {
  const q = val || (document.getElementById('heroSearchInput') ? document.getElementById('heroSearchInput').value : '') || '';
  const country = document.getElementById('heroCountry') ? document.getElementById('heroCountry').value : '';
  const genre = document.getElementById('heroGenre') ? document.getElementById('heroGenre').value : '';
  const type = document.getElementById('heroType') ? document.getElementById('heroType').value : '';
  if (q.length > 1 || country || genre || type) {
    if (document.getElementById('discoverSearch')) document.getElementById('discoverSearch').value = q;
    if (document.getElementById('filterCountry') && country) document.getElementById('filterCountry').value = country;
    if (document.getElementById('filterGenre') && genre) document.getElementById('filterGenre').value = genre;
    if (document.getElementById('filterType') && type) document.getElementById('filterType').value = type;
    showPage('discover');
  }
}

// ── DISCOVER PAGE ──
const ARTISTS_DB = [
  {name:'Luna Rivera',type:'Artist',genre:'Electronic',country:'UAE',city:'Dubai',followers:'12.3K',streams:'298K',verified:true,protected:true,emoji:'🎵'},
  {name:'Zara Pulse',type:'Artist',genre:'Synthwave',country:'Serbia',city:'Belgrade',followers:'8.1K',streams:'124K',verified:true,protected:true,emoji:'⚡'},
  {name:'Aria Voss',type:'Artist',genre:'Ambient',country:'Germany',city:'Berlin',followers:'5.4K',streams:'87K',verified:true,protected:false,emoji:'✨'},
  {name:'DJ Nexus',type:'DJ',genre:'House / Techno',country:'UAE',city:'Dubai',followers:'28.7K',streams:'412K',verified:true,protected:false,emoji:'🎧'},
  {name:'Marcus Wave',type:'Producer',genre:'Hip-Hop',country:'USA',city:'Atlanta',followers:'19.2K',streams:'560K',verified:true,protected:true,emoji:'🎤'},
  {name:'Nadia Sol',type:'Artist',genre:'R&B',country:'South Africa',city:'Cape Town',followers:'6.8K',streams:'201K',verified:false,protected:true,emoji:'🌟'},
  {name:'DJ Pharaoh',type:'DJ',genre:'Afrobeats',country:'Nigeria',city:'Lagos',followers:'41K',streams:'890K',verified:true,protected:false,emoji:'🔥'},
  {name:'Kira Tanaka',type:'Artist',genre:'Classical',country:'Japan',city:'Tokyo',followers:'3.2K',streams:'44K',verified:true,protected:true,emoji:'🎻'},
  {name:'The Void',type:'Band',genre:'Rock',country:'UK',city:'Manchester',followers:'15.6K',streams:'340K',verified:true,protected:true,emoji:'🎸'},
  {name:'Celeste M.',type:'Artist',genre:'Pop',country:'France',city:'Paris',followers:'22.1K',streams:'670K',verified:true,protected:false,emoji:'🎹'},
  {name:'Kai Santos',type:'Producer',genre:'Electronic',country:'Brazil',city:'Sao Paulo',followers:'9.7K',streams:'183K',verified:false,protected:true,emoji:'🎛️'},
  {name:'DJ Echo',type:'DJ',genre:'DJ / Club',country:'UAE',city:'Abu Dhabi',followers:'7.3K',streams:'156K',verified:true,protected:false,emoji:'🎧'},
];

let currentDiscoverView = 'grid';
var LIVE_PROFILES = [];

function loadDiscoverProfiles(cb) {
  var sb = window._sb;
  if (!sb) { if (cb) cb(); return; }
  LIVE_PROFILES = [];
  sb.from('profiles')
    .select('id,full_name,display_name,role,country,city,meta,avatar_url,username')
    .neq('role', 'Fan')
    .then(function(r) {
      if (r.data && r.data.length) {
        LIVE_PROFILES = r.data
          .filter(function(p) { return !!(p.full_name || p.display_name); })
          .map(function(p) {
            var genres = (p.meta && p.meta.genres && p.meta.genres.length) ? p.meta.genres.join(', ') : '';
            return {
              id:         p.id,
              name:       p.display_name || p.full_name,
              type:       p.role,
              genre:      genres,
              country:    p.country || '',
              city:       p.city || '',
              followers:  '—',
              streams:    '—',
              verified:   false,
              protected:  false,
              emoji:      '🎵',
              username:   p.username,
              isLive:     true,
              avatar_url: p.avatar_url,
              meta:       p.meta || {}
            };
          });
      }
      if (cb) cb();
    }).catch(function() { if (cb) cb(); });
}

function renderDiscoverCards(data) {
  const grid = document.getElementById('discoverGrid');
  const list = document.getElementById('discoverList');
  const countEl = document.getElementById('discoverCount');
  if (!grid) return;
  if (countEl) countEl.textContent = data.length;
  if (currentDiscoverView === 'grid') {
    grid.style.display = 'grid'; list.style.display = 'none';
    grid.innerHTML = data.map(function(a) { return fmRenderProfileCard(a, 'grid'); }).join('');
  } else {
    grid.style.display = 'none'; list.style.display = 'flex';
    list.innerHTML = data.map(function(a) { return fmRenderProfileCard(a, 'list'); }).join('');
  }
}

function filterArtists() {
  const q = (document.getElementById('discoverSearch') ? document.getElementById('discoverSearch').value : '').toLowerCase();
  const country = document.getElementById('filterCountry') ? document.getElementById('filterCountry').value.replace(/^[^ ]+ /,'') : '';
  const genre = document.getElementById('filterGenre') ? document.getElementById('filterGenre').value : '';
  const type = document.getElementById('filterType') ? document.getElementById('filterType').value : '';
  const verified = document.getElementById('filterVerified') ? document.getElementById('filterVerified').value : '';
  var source = LIVE_PROFILES.length ? LIVE_PROFILES : ARTISTS_DB;
  let results = source.filter(function(a) {
    if (q && !a.name.toLowerCase().includes(q) && !a.genre.toLowerCase().includes(q) && !a.city.toLowerCase().includes(q)) return false;
    if (country && a.country !== country) return false;
    if (genre && a.genre.indexOf(genre) === -1) return false;
    if (type && a.type !== type) return false;
    if (verified === 'verified' && !a.verified) return false;
    if (verified === 'protected' && !a.protected) return false;
    return true;
  });
  renderDiscoverCards(fmShuffle(results));
}

function clearDiscoverFilters() {
  ['discoverSearch','filterCountry','filterGenre','filterType','filterVerified'].forEach(function(id){
    const el = document.getElementById(id); if(el) el.value='';
  });
  filterArtists();
}

function fmShuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function fmCardClick(id) {
  if (!id) return;
  if (window._fmUser && window._fmUser.id === id) {
    showPage('artist');
  } else if (window.fmShowPublicProfile) {
    window.fmShowPublicProfile(id);
  }
}

function fmRenderProfileCard(a, mode) {
  var name      = a.name || 'Artist';
  var initials  = name.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase() || '?';
  var colors    = ['#7B2FFF','#C8A97E','#00E676','#E91E8C','#3B82F6'];
  var col       = colors[Math.abs((name.charCodeAt(0)||0) + (name.charCodeAt(1)||0)) % colors.length];
  var cardBg    = a.meta && a.meta.card_bg ? a.meta.card_bg : null;
  var avu       = a.avatar_url || null;
  var id        = a.id || '';
  var click     = id ? 'fmCardClick(\'' + id + '\')' : 'void 0';
  var type      = a.type  || '';
  var city      = a.city  || '';
  var genre     = a.genre || '';
  var streams   = a.streams || '—';
  var followers = a.followers || '—';

  // Background layer — image if card_bg, otherwise dark purple gradient
  var bgCss = cardBg
    ? 'url(' + cardBg + ') center/cover no-repeat'
    : 'linear-gradient(135deg,#1a0533 0%,#2d0a5e 50%,#0d0020 100%)';

  // Overlay — only when there is a photo background
  var overlay = cardBg
    ? '<div style="position:absolute;inset:0;z-index:1;background:linear-gradient(to top right,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.45) 40%,rgba(0,0,0,0.0) 100%);pointer-events:none;"></div>'
    : '';

  // Avatar — 60px circle with 2.5px white border
  var avatar = avu
    ? '<div style="width:60px;height:60px;border-radius:50%;background:url(' + avu + ') center/cover no-repeat;border:2.5px solid #fff;flex-shrink:0;"></div>'
    : '<div style="width:60px;height:60px;border-radius:50%;background:' + col + ';border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;color:#fff;flex-shrink:0;">' + initials + '</div>';

  // Genre badge — only render if genre text exists
  var genreBadge = genre
    ? '<div style="display:inline-block;background:rgba(123,47,255,0.35);color:#C8B4FF;padding:2px 8px;border-radius:6px;font-size:0.65rem;font-weight:600;letter-spacing:0.04em;margin-bottom:8px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + genre + '</div>'
    : '';

  return '<div style="position:relative;width:220px;height:280px;border-radius:16px;overflow:hidden;cursor:pointer;flex-shrink:0;background:' + bgCss + ';" onclick="' + click + '">'
    + overlay
    // Support button — top right, glass style
    + '<button onclick="event.stopPropagation();showFanDonateModal()" style="position:absolute;top:10px;right:10px;z-index:3;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.4);color:#fff;padding:4px 10px;border-radius:8px;font-size:0.68rem;font-weight:600;cursor:pointer;font-family:inherit;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">Support</button>'
    // Bottom content block
    + '<div style="position:absolute;bottom:0;left:0;right:0;padding:14px;z-index:2;">'
    + avatar
    + '<div style="font-size:16px;font-weight:600;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,0.6);margin-top:8px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + name + '</div>'
    + '<div style="font-size:12px;color:rgba(255,255,255,0.75);margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + type + (city ? ' · ' + city : '') + '</div>'
    + genreBadge
    + '<div style="display:flex;gap:14px;">'
    + '<div><div style="font-size:13px;font-weight:700;color:#fff;line-height:1.2;">' + followers + '</div><div style="font-size:10px;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.06em;">Followers</div></div>'
    + '<div><div style="font-size:13px;font-weight:700;color:#fff;line-height:1.2;">' + streams + '</div><div style="font-size:10px;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.06em;">Streams</div></div>'
    + '</div>'
    + '</div>'
    + '</div>';
}

function loadHomeTrendingArtists() {
  var sb   = window._sb;
  var grid = document.getElementById('fmHomeTrendingGrid');
  if (!sb || !grid) return;
  sb.from('profiles')
    .select('id,full_name,display_name,role,country,city,meta,avatar_url')
    .neq('role', 'Fan')
    .limit(20)
    .then(function(r) {
      if (!r.data || !r.data.length) return;
      var profiles = r.data
        .filter(function(p) { return !!(p.full_name || p.display_name); })
        .map(function(p) {
          return {
            id:        p.id,
            name:      p.display_name || p.full_name,
            type:      p.role || 'Artist',
            genre:     (p.meta && p.meta.genres && p.meta.genres.length) ? p.meta.genres[0] : '',
            city:      p.city || '',
            country:   p.country || '',
            followers: '—',
            streams:   '—',
            verified:  false,
            isLive:    true,
            avatar_url:p.avatar_url,
            meta:      p.meta || {}
          };
        });
      grid.innerHTML = fmShuffle(profiles).slice(0, 5).map(function(a) {
        return fmRenderProfileCard(a, 'compact');
      }).join('');
    }).catch(function(){});
}

function setDiscoverView(v) {
  currentDiscoverView = v;
  ['viewGrid','viewList'].forEach(function(id){
    const el=document.getElementById(id);
    if(!el) return;
    const active = (id==='viewGrid' && v==='grid') || (id==='viewList' && v==='list');
    el.style.background = active ? 'rgba(123,47,255,0.15)' : 'transparent';
    el.style.color = active ? '#A06EFF' : '#888899';
  });
  filterArtists();
}

// ── GEAR PAGE ──
// ── GEAR STORE DATA ──
const GEAR_STORES = [
  {
    id: 'gs1',
    name: 'ProSound Dubai',
    emoji: '🎧',
    gradient: 'linear-gradient(135deg,#100e22,#1a2840,#0a1020)',
    country: 'UAE', city: 'Dubai', address: 'Al Quoz Industrial Area, Dubai',
    phone: '+971 4 321 0000', website: 'prosounddubai.com', email: 'info@prosounddubai.com',
    verified: true, rating: 4.9, reviews: 284, founded: '2011',
    tags: ['DJ Equipment','Controllers','Speakers & PA','Studio Gear'],
    desc: 'Dubai\'s leading DJ and pro audio equipment retailer. Official distributor for Pioneer DJ, Denon DJ, and Allen & Heath in the UAE. Our showroom carries the full range of professional DJ gear, studio monitors, and live sound equipment — all available for demo before you buy.',
    hours: 'Mon–Sat 10:00–21:00, Sun 12:00–19:00',
    gallery: ['🎧','🎛️','🔊','💡','🎵','📻'],
    stats: {items: '400+', brands: '30+', years: '14'},
    products: [
      {name:'Pioneer CDJ-3000',cat:'DJ Equipment',emoji:'🎧',price:2299,condition:'New',cta:'call'},
      {name:'Pioneer DJM-A9',cat:'DJ Mixer',emoji:'🎛️',price:3199,condition:'New',cta:'call'},
      {name:'Denon SC6000M',cat:'DJ Player',emoji:'📀',price:1799,condition:'New',cta:'website'},
      {name:'Pioneer DDJ-FLX10',cat:'Controller',emoji:'🎮',price:1299,condition:'New',cta:'website'},
      {name:'RCF EVOX 12',cat:'PA System',emoji:'🔊',price:2499,condition:'New',cta:'call'},
      {name:'Allen & Heath Xone:96',cat:'Mixer',emoji:'🎚️',price:2199,condition:'New',cta:'call'},
    ],
    reviews: [
      {name:'DJ Nexus',color:'#7B2FFF',stars:'★★★★★',text:'Best gear shop in the UAE. Staff actually know what they\'re talking about and let you test everything properly before buying.'},
      {name:'Khalid M.',color:'#E91E8C',stars:'★★★★★',text:'Bought my full Pioneer setup here. Price matched online and got free delivery. Couldn\'t ask for more.'},
      {name:'Aiden K.',color:'#00E676',stars:'★★★★☆',text:'Great selection, slightly expensive but you get proper warranty and local support which is worth it.'},
    ]
  },
  {
    id: 'gs2',
    name: 'Music Zone UAE',
    emoji: '🎹',
    gradient: 'linear-gradient(135deg,#1a0830,#2d1050,#100520)',
    country: 'UAE', city: 'Dubai', address: 'Mall of the Emirates, Dubai',
    phone: '+971 4 409 8888', website: 'musiczoneae.com', email: 'sales@musiczoneae.com',
    verified: true, rating: 4.8, reviews: 196, founded: '2007',
    tags: ['Keyboards & Synths','Guitars & Bass','Orchestral','Recording & DAW'],
    desc: 'The UAE\'s most comprehensive music instrument store with over 600 instruments on display. From student beginner packages to professional concert grand pianos — our expert staff guide every musician at every level. Offering lessons, repair services, and instrument rental programs.',
    hours: 'Daily 10:00–22:00',
    gallery: ['🎹','🎸','🎻','🪗','🎷','🎺'],
    stats: {items: '600+', brands: '50+', years: '18'},
    products: [
      {name:'Roland JUNO-X',cat:'Synthesizer',emoji:'🎹',price:1699,condition:'New',cta:'website'},
      {name:'Fender Stratocaster Std.',cat:'Guitar',emoji:'🎸',price:1199,condition:'New',cta:'website'},
      {name:'Yamaha P-515',cat:'Digital Piano',emoji:'🎹',price:1899,condition:'New',cta:'call'},
      {name:'Korg Minilogue XD',cat:'Synth',emoji:'🎛️',price:699,condition:'New',cta:'website'},
      {name:'Gibson Les Paul Std.',cat:'Guitar',emoji:'🎸',price:2999,condition:'New',cta:'call'},
      {name:'Arturia MiniFreak',cat:'Synthesizer',emoji:'🎛️',price:599,condition:'New',cta:'website'},
    ],
    reviews: [
      {name:'Sara B.',color:'#C8A97E',stars:'★★★★★',text:'Incredible selection. The staff helped me find the perfect digital piano for my home studio within budget.'},
      {name:'Omar R.',color:'#7B2FFF',stars:'★★★★★',text:'Bought my first guitar here 5 years ago and still come back for strings, accessories, everything.'},
      {name:'Priya T.',color:'#E91E8C',stars:'★★★★☆',text:'Good store but can get crowded on weekends. Worth calling ahead if you want proper demo time.'},
    ]
  },
  {
    id: 'gs3',
    name: 'Beat Store UAE',
    emoji: '🥁',
    gradient: 'linear-gradient(135deg,#1a0a00,#2e1500,#100800)',
    country: 'UAE', city: 'Sharjah', address: 'Industrial Area 7, Sharjah',
    phone: '+971 6 530 2200', website: 'beatstoreuae.com', email: 'hello@beatstoreuae.com',
    verified: true, rating: 4.9, reviews: 143, founded: '2015',
    tags: ['Drums & Percussion','Studio Gear','Microphones'],
    desc: 'Sharjah\'s specialist drum and percussion store. We carry acoustic kits, electronic drum systems, hand percussion, and the full range of studio recording gear. Known for fair pricing, honest advice, and the best acoustic drum room in the region for proper testing.',
    hours: 'Sat–Thu 09:00–20:00, Fri 14:00–20:00',
    gallery: ['🥁','🪘','🎵','🎤','🎚️','🎶'],
    stats: {items: '250+', brands: '20+', years: '9'},
    products: [
      {name:'Roland TD-27KV',cat:'E-Drums',emoji:'🥁',price:3499,condition:'New',cta:'call'},
      {name:'Pearl Export Series',cat:'Acoustic Kit',emoji:'🥁',price:999,condition:'New',cta:'website'},
      {name:'Shure SM7B',cat:'Microphone',emoji:'🎤',price:399,condition:'New',cta:'website'},
      {name:'Focusrite Scarlett 4i4',cat:'Audio Interface',emoji:'🎚️',price:249,condition:'New',cta:'website'},
      {name:'Rode NT-USB Mini',cat:'USB Mic',emoji:'🎙️',price:129,condition:'New',cta:'website'},
      {name:'Meinl 16" Trash Crash',cat:'Cymbal',emoji:'🎵',price:189,condition:'New',cta:'call'},
    ],
    reviews: [
      {name:'Rami D.',color:'#FF9800',stars:'★★★★★',text:'Best drum shop in the UAE, no competition. They let me play every kit for as long as I needed and never rushed me.'},
      {name:'Jake S.',color:'#00E676',stars:'★★★★★',text:'Drove from Dubai because of the reviews — absolutely worth it. Got a great deal on a Pearl kit.'},
      {name:'Nadia H.',color:'#7B2FFF',stars:'★★★★☆',text:'Nice shop, good prices. Would love to see more electronic pad accessories but overall great experience.'},
    ]
  },
  {
    id: 'gs4',
    name: 'Studio Gear Serbia',
    emoji: '🎚️',
    gradient: 'linear-gradient(135deg,#0a1a10,#0d2a18,#050d08)',
    country: 'Serbia', city: 'Belgrade', address: 'Savski Venac, Belgrade',
    phone: '+381 11 265 0000', website: 'studiogear.rs', email: 'prodaja@studiogear.rs',
    verified: false, rating: 4.7, reviews: 89, founded: '2018',
    tags: ['Recording & DAW','Studio Gear','Microphones','Speakers & PA'],
    desc: 'Belgrade\'s go-to destination for home studio and professional recording gear. We specialise in acoustic treatment, studio monitors, audio interfaces, and DAW software. Our in-store demo room lets you hear monitors in a properly treated space before committing.',
    hours: 'Mon–Fri 10:00–19:00, Sat 10:00–16:00',
    gallery: ['🎚️','💻','🎤','🔊','🎛️','📀'],
    stats: {items: '180+', brands: '25+', years: '6'},
    products: [
      {name:'Yamaha HS8',cat:'Studio Monitor',emoji:'🔊',price:699,condition:'New',cta:'website'},
      {name:'Ableton Live 12 Suite',cat:'DAW',emoji:'💻',price:749,condition:'New',cta:'website'},
      {name:'Universal Audio Apollo Twin X',cat:'Interface',emoji:'🎚️',price:899,condition:'New',cta:'call'},
      {name:'Neumann TLM 103',cat:'Microphone',emoji:'🎤',price:999,condition:'New',cta:'call'},
      {name:'Genelec 8030C',cat:'Monitor',emoji:'🔊',price:499,condition:'Refurbished',cta:'call'},
      {name:'Native Instruments Maschine+',cat:'Production',emoji:'🎛️',price:999,condition:'New',cta:'website'},
    ],
    reviews: [
      {name:'Marko P.',color:'#00E676',stars:'★★★★★',text:'Jedina prodavnica u Beogradu gde možeš stvarno testirati monitore u ozvučenoj sobi. Preporučujem svima.'},
      {name:'Stefan L.',color:'#7B2FFF',stars:'★★★★★',text:'Kupio sam čitav home studio setup ovde. Odlična usluga, dobri saveti, i cene su realne.'},
      {name:'Ivan C.',color:'#C8A97E',stars:'★★★★☆',text:'Solidan izbor. Volim što nude i polovnu/refurb opremu uz garanciju — retko to viđaš kod nas.'},
    ]
  },
  {
    id: 'gs5',
    name: 'Thomann UK',
    emoji: '🎸',
    gradient: 'linear-gradient(135deg,#1a0010,#2d0020,#100008)',
    country: 'UK', city: 'London', address: 'Online · Ships Worldwide',
    phone: '+44 20 3318 9999', website: 'thomann.de/gb', email: 'support@thomann.de',
    verified: true, rating: 5.0, reviews: 1420, founded: '1954',
    tags: ['Guitars & Bass','Keyboards & Synths','Microphones','All Categories'],
    desc: 'Europe\'s largest online music retailer with UK operations. Over 80,000 products from all leading brands, fast delivery across Europe and the UAE. Known for competitive pricing, transparent reviews, and excellent customer service. 30-day money-back guarantee on all items.',
    hours: 'Online 24/7 · Support Mon–Fri 09:00–18:00',
    gallery: ['🎸','🎹','🎧','🥁','🎻','🎺'],
    stats: {items: '80,000+', brands: '1,000+', years: '70'},
    products: [
      {name:'Harley Benton SC-450Plus',cat:'Guitar',emoji:'🎸',price:219,condition:'New',cta:'website'},
      {name:'Behringer TD-3',cat:'Synth',emoji:'🎛️',price:149,condition:'New',cta:'website'},
      {name:'t.bone SC 400',cat:'Microphone',emoji:'🎤',price:79,condition:'New',cta:'website'},
      {name:'the t.amp E-400',cat:'Amplifier',emoji:'🔊',price:199,condition:'New',cta:'website'},
      {name:'Millenium MPS-750X',cat:'E-Drums',emoji:'🥁',price:449,condition:'New',cta:'website'},
      {name:'Arturia KeyStep 37',cat:'Controller',emoji:'🎹',price:179,condition:'New',cta:'website'},
    ],
    reviews: [
      {name:'Liam H.',color:'#E91E8C',stars:'★★★★★',text:'Been buying from Thomann for 15 years. Unbeatable prices and the return process is hassle-free.'},
      {name:'Emma W.',color:'#00E676',stars:'★★★★★',text:'Ordered to UAE — arrived in 4 days! Packaging was excellent and the guitar came perfectly set up.'},
      {name:'Jack D.',color:'#7B2FFF',stars:'★★★★★',text:'Best online music store in Europe. The customer reviews on their site are genuinely helpful too.'},
    ]
  },
  {
    id: 'gs6',
    name: 'Plugin Boutique',
    emoji: '💻',
    gradient: 'linear-gradient(135deg,#080818,#10102a,#050510)',
    country: 'Germany', city: 'Berlin', address: 'Online · Digital Downloads',
    phone: '+49 30 9999 0000', website: 'pluginboutique.com', email: 'support@pluginboutique.com',
    verified: true, rating: 4.9, reviews: 532, founded: '2012',
    tags: ['Recording & DAW','Studio Gear'],
    desc: 'The world\'s leading marketplace for music production software, VST plugins, and sample packs. Over 10,000 plugins from every major developer, instant digital delivery, and regular sales of up to 90% off. Trusted by producers and engineers worldwide.',
    hours: 'Online 24/7 · Instant delivery',
    gallery: ['💻','🎛️','🎵','🎚️','🎶','📀'],
    stats: {items: '10,000+', brands: '500+', years: '12'},
    products: [
      {name:'Ableton Live 12 Suite',cat:'DAW',emoji:'💻',price:749,condition:'New',cta:'website'},
      {name:'Serum by Xfer Records',cat:'VST Synth',emoji:'🎛️',price:189,condition:'New',cta:'website'},
      {name:'Splice Sounds 1 Month',cat:'Sample Pack',emoji:'🎵',price:9,condition:'New',cta:'website'},
      {name:'Fabfilter Pro-Q 4',cat:'EQ Plugin',emoji:'🎚️',price:149,condition:'New',cta:'website'},
      {name:'iZotope Ozone 11',cat:'Mastering',emoji:'📀',price:249,condition:'New',cta:'website'},
      {name:'Native Instruments Komplete 14',cat:'Bundle',emoji:'🎹',price:599,condition:'New',cta:'website'},
    ],
    reviews: [
      {name:'Max R.',color:'#C8A97E',stars:'★★★★★',text:'Best place for plugin deals. Their loyalty points system actually saves real money over time.'},
      {name:'Leila S.',color:'#E91E8C',stars:'★★★★★',text:'Instant download, great bundles, and they have every developer you can think of. My go-to for software.'},
      {name:'Tom K.',color:'#7B2FFF',stars:'★★★★☆',text:'Solid platform. Occasional glitches with license delivery but support always sorts it out quickly.'},
    ]
  },
];

var gsActivePillCat = '';

function renderGearCards(data) {
  var grid = document.getElementById('gearGrid');
  var countEl = document.getElementById('gearCount');
  if (!grid) return;
  var stores = data || GEAR_STORES;
  if (countEl) countEl.textContent = stores.length;
  grid.innerHTML = stores.map(function(s) {
    var tagsHtml = s.tags.slice(0,3).map(function(t){ return '<span class="gs-store-tag">'+t+'</span>'; }).join('');
    return '<div class="gs-store-card" onclick="gsOpenStore(\''+s.id+'\')">'+
      '<div class="gs-store-cover" style="background:'+s.gradient+';">'+
        '<span>'+s.emoji+'</span>'+
        (s.verified ? '<span class="gs-store-cover-verified">✓ Verified</span>' : '')+
        '<span class="gs-store-cover-badge">'+s.city+', '+s.country+'</span>'+
      '</div>'+
      '<div class="gs-store-body">'+
        '<div class="gs-store-name">'+s.name+'</div>'+
        '<div class="gs-store-loc">'+s.address+'</div>'+
        '<div class="gs-store-tags">'+tagsHtml+'</div>'+
        '<div class="gs-store-footer">'+
          '<div>'+
            '<div class="gs-store-rating"><strong>'+s.rating+'</strong> ★ <span style="font-size:0.68rem;">('+s.reviews+')</span></div>'+
            '<div class="gs-store-items">'+s.stats.items+' items · '+s.stats.brands+' brands</div>'+
          '</div>'+
          '<button class="gs-store-enter" onclick="event.stopPropagation();gsOpenStore(\''+s.id+'\')">Visit Store →</button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }).join('');
}

function gsOpenStore(id) {
  var s = GEAR_STORES.find(function(x){ return x.id === id; });
  if (!s) return;
  var el = document.getElementById('gssProfile');
  var content = document.getElementById('gssProfileContent');
  if (!el || !content) return;

  // Gallery items
  var galleryItems = s.gallery.map(function(em, i) {
    var cls = i === 0 ? 'gs-gallery-item main' : (i === 2 ? 'gs-gallery-item video' : 'gs-gallery-item');
    var extra = (i === 5 && s.gallery.length > 5) ? '<div class="gs-gallery-more">+' + (s.gallery.length - 5) + '</div>' : '';
    return '<div class="'+cls+'" style="background:rgba(200,180,255,0.07);">'+em+extra+'</div>';
  }).join('');

  // Products
  var productsHtml = s.products.map(function(p) {
    var ctaCls = p.cta === 'call' ? 'gs-product-cta call' : 'gs-product-cta';
    var ctaTxt = p.cta === 'call' ? '📞 Call' : '🌐 Website';
    var ctaAct = p.cta === 'call'
      ? 'onclick="showToast(\'Calling '+s.name+'... '+s.phone+'\')"'
      : 'onclick="showToast(\'Opening '+s.website+'...\')"';
    return '<div class="gs-product-item">'+
      '<div class="gs-product-icon">'+p.emoji+'</div>'+
      '<div class="gs-product-info">'+
        '<div class="gs-product-cat">'+p.cat+'</div>'+
        '<div class="gs-product-name">'+p.name+'</div>'+
        '<div class="gs-product-meta">'+p.condition+'</div>'+
      '</div>'+
      '<div class="gs-product-right">'+
        '<div class="gs-product-price">€'+p.price.toLocaleString()+'</div>'+
        '<button class="'+ctaCls+'" '+ctaAct+'>'+ctaTxt+'</button>'+
      '</div>'+
    '</div>';
  }).join('');

  // Reviews
  var reviewsHtml = s.reviews.map(function(r) {
    return '<div class="gs-review-item">'+
      '<div class="gs-review-head">'+
        '<div class="gs-review-av" style="background:'+r.color+'22;color:'+r.color+';">'+r.name[0]+'</div>'+
        '<div class="gs-review-name">'+r.name+'</div>'+
        '<div class="gs-review-stars">'+r.stars+'</div>'+
      '</div>'+
      '<div class="gs-review-text">'+r.text+'</div>'+
    '</div>';
  }).join('');

  content.innerHTML =
    '<div class="gs-profile-hero" style="background:'+s.gradient+';">'+
      '<div class="gs-profile-hero-bg">'+s.emoji+'</div>'+
      '<div class="gs-profile-hero-overlay"></div>'+
      '<div class="gs-profile-hero-info">'+
        '<div class="gs-profile-hero-name">'+s.name+'</div>'+
        '<div class="gs-profile-hero-sub">'+s.address+' · Since '+s.founded+'</div>'+
        '<div class="gs-profile-hero-badges">'+
          (s.verified ? '<span class="gs-profile-badge verified">✓ Verified Store</span>' : '')+
          s.tags.slice(0,2).map(function(t){ return '<span class="gs-profile-badge cat">'+t+'</span>'; }).join('')+
          '<span class="gs-profile-badge country">'+s.city+', '+s.country+'</span>'+
        '</div>'+
      '</div>'+
    '</div>'+

    '<div class="gs-profile-actions">'+
      '<button class="gs-action-btn gs-action-call" onclick="showToast(\'Calling '+s.name+'...\')">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>'+
        'Call Store'+
      '</button>'+
      '<button class="gs-action-btn gs-action-primary" onclick="showToast(\'Opening '+s.website+'...\')">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>'+
        'Visit Website'+
      '</button>'+
      '<button class="gs-action-btn gs-action-secondary" onclick="showToast(\'Message sent to '+s.name+'!\')">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'+
        'Message'+
      '</button>'+
    '</div>'+

    '<div class="gs-profile-about">'+
      '<div class="gs-profile-section-title">About this store</div>'+
      '<div class="gs-profile-desc">'+s.desc+'</div>'+
      '<div class="gs-profile-stats">'+
        '<div class="gs-profile-stat"><strong>'+s.stats.items+'</strong><span>Products</span></div>'+
        '<div class="gs-profile-stat"><strong>'+s.stats.brands+'</strong><span>Brands</span></div>'+
        '<div class="gs-profile-stat"><strong>'+s.rating+'★</strong><span>('+s.reviews+' reviews)</span></div>'+
      '</div>'+
      '<div style="margin-top:14px;display:flex;align-items:center;gap:8px;font-size:0.78rem;color:rgba(255,255,255,0.4);">'+
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'+
        s.hours+
      '</div>'+
    '</div>'+

    '<div class="gs-gallery">'+
      '<div class="gs-gallery-title">Photos & Video</div>'+
      '<div class="gs-gallery-grid">'+galleryItems+'</div>'+
    '</div>'+

    '<div class="gs-products">'+
      '<div class="gs-products-head">'+
        '<div class="gs-products-title">Featured Products & Pricing</div>'+
      '</div>'+
      '<div class="gs-product-list">'+productsHtml+'</div>'+
      '<p style="font-size:0.72rem;color:rgba(200,180,255,0.52);margin-top:12px;text-align:center;">Prices are indicative. Contact store or visit website for current availability and pricing.</p>'+
    '</div>'+

    '<div class="gs-reviews">'+
      '<div class="gs-profile-section-title">Customer Reviews · '+s.rating+' ★ ('+s.reviews+')</div>'+
      reviewsHtml+
    '</div>';

  el.classList.add('open');
  el.scrollTop = 0;
}

function gsCloseProfile() {
  var el = document.getElementById('gssProfile');
  if (el) el.classList.remove('open');
}

function filterGear() {
  var q = (document.getElementById('gearSearch') || {value:''}).value.toLowerCase();
  var cat = (document.getElementById('gearCategory') || {value:''}).value;
  var country = (document.getElementById('gearCountry') || {value:''}).value;
  var budget = (document.getElementById('gearBudget') || {value:''}).value;
  var results = GEAR_STORES.filter(function(s) {
    if (q && !s.name.toLowerCase().includes(q) && !s.city.toLowerCase().includes(q) && !s.tags.join(' ').toLowerCase().includes(q)) return false;
    if (cat && !s.tags.some(function(t){ return t.includes(cat); })) return false;
    if (country && s.country !== country) return false;
    if (gsActivePillCat && !s.tags.some(function(t){ return t.includes(gsActivePillCat); })) return false;
    return true;
  });
  renderGearCards(results);
}

function gsPillFilter(el, cat) {
  document.querySelectorAll('.gs-pill').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  gsActivePillCat = cat;
  filterGear();
}

// Keep old quickGearFilter alias for compatibility
function quickGearFilter(cat) { gsPillFilter(event.target, cat); }

// ── CLUBS PAGE ──
const CLUBS_DB = [
  {id:'c1',name:'Warehouse 14',emoji:'🏭',type:'Nightclub',genre:'Techno',country:'UAE',city:'Dubai',address:'Al Quoz Industrial Area, Dubai',rating:4.8,reviews:342,followers:8400,desc:'Dubai\'s premier underground techno club. Industrial setting, world-class sound system, resident and international DJs every weekend.',tags:['Techno','House','Underground'],hours:'Thu-Sat 22:00-06:00',giveaway:true,giveaway_text:'Win 2 VIP tickets + bottle service for Mar 15',giveaway_ends:'Mar 13, 2026',entries:247,photos:['🏭','🎧','💡','🎵'],upcoming:[{date:'Mar 15',event:'DJ Nexus Live',genre:'Techno'},{date:'Mar 22',event:'Berlin Underground Night',genre:'Techno'}],gradient:'linear-gradient(135deg,#1a1a2e,#16213e)'},
  {id:'c2',name:'Club Celsius',emoji:'🌡️',type:'Nightclub',genre:'House',country:'UAE',city:'Dubai',address:'DIFC Gate Village, Dubai',rating:4.7,reviews:218,followers:6100,desc:'Upscale house music destination in the heart of DIFC. Known for impeccable sound and intimate atmosphere.',tags:['House','Deep House','Minimal'],hours:'Wed-Sat 21:00-05:00',giveaway:true,giveaway_text:'Free Drinks Package for 2 — this Friday',giveaway_ends:'Mar 12, 2026',entries:189,photos:['🌡️','🍸','🎶','✨'],upcoming:[{date:'Mar 14',event:'Deep House Friday',genre:'Deep House'}],gradient:'linear-gradient(135deg,#0d1b2a,#1b2838)'},
  {id:'c3',name:'Amber Lounge',emoji:'🔶',type:'Bar & Lounge',genre:'R&B',country:'UAE',city:'Abu Dhabi',address:'Yas Marina Circuit, Abu Dhabi',rating:4.9,reviews:504,followers:12200,desc:'Luxury lounge at Yas Marina. Famous for F1 afterparties and exclusive live R&B and jazz performances.',tags:['R&B','Jazz','Luxury'],hours:'Daily 19:00-03:00',giveaway:true,giveaway_text:'Meet & Greet with DJ Nexus — Apr 2',giveaway_ends:'Mar 30, 2026',entries:412,photos:['🔶','🥂','🎷','🏎️'],upcoming:[{date:'Apr 2',event:'DJ Nexus x Amber',genre:'R&B'}],gradient:'linear-gradient(135deg,#2d1b00,#3d2800)'},
  {id:'c4',name:'Tresor Berlin',emoji:'🔐',type:'Nightclub',genre:'Techno',country:'Germany',city:'Berlin',address:'Kopenicker Str. 70, Berlin',rating:5.0,reviews:1840,followers:94000,desc:'Legendary Berlin techno institution. The vault and main floor are iconic. No photos, total immersion in the music.',tags:['Techno','Industrial','Dark'],hours:'Fri-Sun 00:00-open',giveaway:false,giveaway_text:'',giveaway_ends:'',entries:0,photos:['🔐','🖤','💿','🔊'],upcoming:[{date:'Mar 15',event:'Tresor Regular',genre:'Techno'}],gradient:'linear-gradient(135deg,#0a0a0a,#1a0a0a)'},
  {id:'c5',name:'Fabric London',emoji:'🎪',type:'Nightclub',genre:'Electronic',country:'UK',city:'London',address:'77A Charterhouse St, London',rating:4.9,reviews:2100,followers:78000,desc:'Three rooms, three sounds. One of the most influential clubs in the world. Bodysonik floors and legendary lineups.',tags:['Electronic','Drum & Bass','House'],hours:'Fri-Sat 22:00-08:00',giveaway:true,giveaway_text:'Win a pair of tickets to the next Fabric Friday',giveaway_ends:'Mar 20, 2026',entries:631,photos:['🎪','🔊','💃','🎛️'],upcoming:[{date:'Mar 14',event:'Fabric Friday',genre:'D&B'}],gradient:'linear-gradient(135deg,#0e0a1c,#1a0a2a)'},
  {id:'c6',name:'Pacha Ibiza',emoji:'🍒',type:'Beach Club',genre:'House',country:'Spain',city:'Ibiza',address:'Av. 8 d\'Agost, Ibiza',rating:4.8,reviews:3200,followers:210000,desc:'The iconic cherry logo. The birthplace of the Ibiza sound. Resident legends and the biggest house nights on earth.',tags:['House','Commercial House','Pop'],hours:'Daily 23:00-06:00 (summer)',giveaway:true,giveaway_text:'2 tickets to opening night 2026',giveaway_ends:'Apr 1, 2026',entries:1840,photos:['🍒','🌅','💃','🎶'],upcoming:[{date:'May 28',event:'Opening Night 2026',genre:'House'}],gradient:'linear-gradient(135deg,#1a0505,#2d0a0a)'},
  {id:'c7',name:'Plastic Belgrade',emoji:'⚫',type:'Nightclub',genre:'Techno',country:'Serbia',city:'Belgrade',address:'Kej oslobodjenja, Beograd',rating:4.7,reviews:892,followers:31000,desc:'Belgrade\'s most celebrated techno club on the Sava river. Raw industrial sound and 24-hour party culture.',tags:['Techno','Progressive','Minimal'],hours:'Fri-Sun 00:00-open',giveaway:false,giveaway_text:'',giveaway_ends:'',entries:0,photos:['⚫','🌊','🔊','🎧'],upcoming:[{date:'Mar 15',event:'Resistance Belgrade',genre:'Techno'}],gradient:'linear-gradient(135deg,#0a0a0a,#0e0a1c)'},
  {id:'c8',name:'Womb Tokyo',emoji:'🏯',type:'Nightclub',genre:'Electronic',country:'Japan',city:'Tokyo',address:'2-16 Maruyamacho, Shibuya, Tokyo',rating:4.8,reviews:1120,followers:42000,desc:'Five floors of electronic music in Shibuya. Japan\'s finest sound system with an eclectic mix from techno to drum & bass.',tags:['Electronic','Techno','D&B'],hours:'Fri-Sat 23:00-05:00',giveaway:true,giveaway_text:'Win 2 tickets to Womb Anniversary Night',giveaway_ends:'Mar 25, 2026',entries:388,photos:['🏯','🎌','💡','🎵'],upcoming:[{date:'Mar 22',event:'Womb Anniversary',genre:'Electronic'}],gradient:'linear-gradient(135deg,#0e0a1c,#1a0a0a)'},
];

let activeClubId = null;

function renderClubCards(data) {
  var grid = document.getElementById('clubsGrid');
  var detail = document.getElementById('clubDetail');
  if (!grid) return;
  var countEl = document.getElementById('clubCount');
  if (countEl) countEl.textContent = data.length;
  if (detail) detail.style.display = 'none';
  grid.style.display = 'grid';
  var html = '';
  for (var i = 0; i < data.length; i++) {
    var c = data[i];
    var tags = '';
    for (var j = 0; j < c.tags.length; j++) {
      tags += '<span style="background:rgba(200,180,255,0.07);color:rgba(200,180,255,0.62);padding:2px 8px;border-radius:2px;font-size:0.62rem;letter-spacing:0.08em;text-transform:uppercase;">' + c.tags[j] + '</span>';
    }
    var badge = c.giveaway ? '<div style="position:absolute;top:10px;right:10px;background:rgba(200,169,126,0.15);border:1px solid rgba(200,169,126,0.3);color:#C8A97E;padding:3px 8px;border-radius:2px;font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Giveaway</div>' : '';
    var gbox = '';
    if (c.giveaway) {
      gbox = '<div style="background:rgba(200,169,126,0.05);border:1px solid rgba(200,169,126,0.15);border-radius:16px;padding:10px;margin-bottom:12px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
           + '<div style="font-size:0.66rem;font-weight:700;color:#C8A97E;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:3px;">Active Giveaway</div>'
           + '<div style="font-size:0.76rem;color:rgba(200,180,255,0.68);">' + c.giveaway_text + '</div>'
           + '<div style="font-size:0.68rem;color:rgba(200,180,255,0.52);margin-top:3px;">Ends ' + c.giveaway_ends + ' · ' + c.entries + ' entered</div>'
           + '</div>';
    }
    var gbtn = c.giveaway
      ? '<button class="club-enter-btn" data-cid="' + c.id + '" style="padding:8px 12px;background:rgba(200,169,126,0.08);border:1px solid rgba(200,169,126,0.2);color:#C8A97E;border-radius:16px;font-size:0.76rem;font-weight:600;cursor:pointer;letter-spacing:0.04em;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">Enter</button>'
      : '';
    html += '<div class="club-card club-open-btn" data-cid="' + c.id + '">'
          + '<div style="height:100px;display:flex;align-items:center;justify-content:center;position:relative;background:' + c.gradient + ';border-bottom:1px solid rgba(200,180,255,0.07);">'
          + badge + '</div>'
          + '<div style="padding:16px;">'
          + '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px;">'
          + '<div><div style="font-family:Inter,sans-serif;font-weight:700;font-size:0.92rem;letter-spacing:-0.01em;">' + c.name + '</div>'
          + '<div style="font-size:0.72rem;color:rgba(200,180,255,0.55);margin-top:2px;">' + c.type + ' · ' + c.city + '</div></div>'
          + '<div style="text-align:right;"><div style="font-size:0.82rem;font-weight:600;color:#C8A97E;">' + c.rating + '</div>'
          + '<div style="font-size:0.62rem;color:rgba(255,255,255,0.2);">' + c.reviews + ' reviews</div></div></div>'
          + '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;">' + tags + '</div>'
          + '<div style="font-size:0.76rem;color:rgba(200,180,255,0.55);margin-bottom:12px;line-height:1.5;">' + c.desc.substring(0,90) + '…</div>'
          + gbox
          + '<div style="display:flex;gap:8px;">'
          + '<button class="club-open-btn" data-cid="' + c.id + '" style="flex:1;padding:8px;background:#f0f0f5;border:none;color:#0d0818;border-radius:16px;font-size:0.76rem;font-weight:700;cursor:pointer;letter-spacing:0.02em;">View Venue</button>'
          + gbtn + '</div></div></div>';
  }
  grid.innerHTML = html;
  // Attach event listeners after rendering
  grid.querySelectorAll('.club-open-btn').forEach(function(el) {
    el.addEventListener('click', function(e) {
      var cid = this.getAttribute('data-cid');
      if (cid) { e.stopPropagation(); openClub(cid); }
    });
  });
  grid.querySelectorAll('.club-enter-btn').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      enterGiveaway(this.getAttribute('data-cid'));
    });
  });
}


function filterClubs() {
  var q = (document.getElementById('clubSearch') ? document.getElementById('clubSearch').value : '').toLowerCase();
  var country = document.getElementById('clubCountry') ? document.getElementById('clubCountry').value.replace(/^[^ ]+ /,'') : '';
  var city = document.getElementById('clubCity') ? document.getElementById('clubCity').value : '';
  var genre = document.getElementById('clubGenre') ? document.getElementById('clubGenre').value : '';
  var type = document.getElementById('clubType') ? document.getElementById('clubType').value : '';
  var sort = document.getElementById('clubSort') ? document.getElementById('clubSort').value : 'rating';

  var results = CLUBS_DB.filter(function(c) {
    if (q && !c.name.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q) && !c.desc.toLowerCase().includes(q)) return false;
    if (country && !c.country.includes(country)) return false;
    if (city && c.city !== city) return false;
    if (genre && c.genre !== genre && !c.tags.includes(genre)) return false;
    if (type && c.type !== type) return false;
    return true;
  });
  if (sort==='rating') results.sort(function(a,b){return b.rating-a.rating;});
  else if (sort==='giveaway') results.sort(function(a,b){return (b.giveaway?1:0)-(a.giveaway?1:0);});
  else if (sort==='popular') results.sort(function(a,b){return b.followers-a.followers;});
  renderClubCards(results);
}

function clearClubFilters() {
  ['clubSearch','clubCountry','clubCity','clubGenre','clubType'].forEach(function(id){
    var el=document.getElementById(id); if(el) el.value='';
  });
  filterClubs();
}

function quickCityFilter(city) {
  document.querySelectorAll('.gear-cat-pill').forEach(function(b){b.classList.remove('active');});
  event.target.classList.add('active');
  var el = document.getElementById('clubCity');
  if (el) el.value = city;
  filterClubs();
}

// ── TOAST ──
function showToast(msg) {
  var t = document.getElementById('toast');
  var tm = document.getElementById('toastMsg');
  if (!t || !tm) return;
  tm.textContent = msg;
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 3200);
}

// ── DRAG & DROP ──
var dropZone = document.getElementById('dropZone');
if (dropZone) {
  dropZone.addEventListener('dragover', function(e){ e.preventDefault(); dropZone.style.borderColor='var(--purple)'; });
  dropZone.addEventListener('dragleave', function(){ dropZone.style.borderColor=''; });
  dropZone.addEventListener('drop', function(e){
    e.preventDefault(); dropZone.style.borderColor='';
    var file=e.dataTransfer.files[0];
    if(file){selectedFile=file;document.getElementById('fileName').textContent=file.name;document.getElementById('fileInfo').style.display='block';dropZone.classList.add('file-selected');}
  });
}

// ── CERT MODAL OUTSIDE CLICK ──
var certModalEl = document.getElementById('certModal');
if (certModalEl) certModalEl.addEventListener('click', function(e){ if(e.target===this) closeCertModal(); });

// ── INIT ──
// ── HERO WAVEFORM ──
function initHeroWave() {
  var svg = document.getElementById('waveform-bars');
  if (!svg) return;
  var totalWidth = 1440;
  var bars = 120;
  var barW = 2;
  var gap = totalWidth / bars;
  var centerY = 90;
  var maxH = 60; // cap so y never goes negative
  var heights = [];
  for (var i = 0; i < bars; i++) {
    var base = Math.abs(Math.sin(i * 0.18) * 22 + Math.sin(i * 0.07) * 14) + Math.random() * 16 + 6;
    heights.push(Math.min(base, maxH));
  }
  var html = '';
  for (var j = 0; j < bars; j++) {
    var h = heights[j];
    var hMin = Math.max(h * 0.4, 2);
    var hMax = Math.min(h * 1.15, maxH);
    var x = j * gap + gap / 2 - barW / 2;
    var y = centerY - h / 2;
    var yMin = centerY - hMin / 2;
    var yMax = centerY - hMax / 2;
    var opacity = 0.3 + (h / 80) * 0.5;
    var col = (j % 7 === 0) ? '#C8A97E' : (j % 13 === 0) ? '#7B2FFF' : 'rgba(255,255,255,0.5)';
    html += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW + '" height="' + h.toFixed(1) + '" rx="1" fill="' + col + '" opacity="' + opacity.toFixed(2) + '">';
    html += '<animate attributeName="height" values="' + h.toFixed(1) + ';' + hMin.toFixed(1) + ';' + hMax.toFixed(1) + ';' + h.toFixed(1) + '" dur="' + (1.8 + Math.random() * 2.4).toFixed(2) + 's" repeatCount="indefinite"/>';
    html += '<animate attributeName="y" values="' + y.toFixed(1) + ';' + yMin.toFixed(1) + ';' + yMax.toFixed(1) + ';' + y.toFixed(1) + '" dur="' + (1.8 + Math.random() * 2.4).toFixed(2) + 's" repeatCount="indefinite"/>';
    html += '</rect>';
  }
  svg.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  // Hero waveform
  initHeroWave();

  // Set hero logo from hidden img
  var hidden = document.getElementById('fortis-logo-hidden');
  var heroLogo = document.getElementById('hero-logo');
  if (hidden && heroLogo) heroLogo.src = hidden.src;

  // Init pages
  renderDiscoverCards(ARTISTS_DB);
  renderGearCards();
  renderDanceCards();
  renderStudioCards();
  renderClubCards(CLUBS_DB);
  renderEventCards(EVENTS_DB.filter(function(e){ return !e.featured; }));
  renderEventFeatured(EVENTS_DB);
  initHomePage();
  loadHomeTrendingArtists();

  // Restore last visited page
  var _lastPage = localStorage.getItem('fm_last_page');
  if (_lastPage && document.getElementById('page-' + _lastPage)) { showPage(_lastPage); }

  // Modal outside click handlers
  ['donateModal','unlockModal','bioModal','certModal'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', function(e){ if(e.target===this) this.classList.remove('show'); });
  });
});

function openClub(id) {
  var c = CLUBS_DB.find(function(x){ return x.id === id; });
  if (!c) return;
  activeClubId = id;
  var grid = document.getElementById('clubsGrid');
  var detail = document.getElementById('clubDetail');
  if (grid) grid.style.display = 'none';
  if (!detail) return;
  detail.style.display = 'block';

  var upcoming = '';
  for (var i = 0; i < c.upcoming.length; i++) {
    var ev = c.upcoming[i];
    var parts = ev.date.split(' ');
    upcoming += '<div style="display:flex;gap:12px;align-items:center;background:#0d0818;border-radius:10px;padding:12px;">'
      + '<div style="background:linear-gradient(135deg,#E91E8C,#7B2FFF);border-radius:8px;padding:6px 10px;text-align:center;min-width:46px;flex-shrink:0;">'
      + '<div style="font-size:0.65rem;color:rgba(255,255,255,0.7);">' + parts[0] + '</div>'
      + '<div style="font-size:1.1rem;font-weight:800;color:#fff;line-height:1;">' + (parts[1]||'') + '</div></div>'
      + '<div style="flex:1;"><div style="font-size:0.85rem;font-weight:600;">' + ev.event + '</div>'
      + '<div style="font-size:0.72rem;color:#a090b8;">' + ev.genre + '</div></div>'
      + '<button class="ticket-btn" data-ev="' + ev.event + '" style="padding:5px 10px;background:rgba(123,47,255,0.12);border:1px solid rgba(123,47,255,0.3);color:#A06EFF;border-radius:7px;font-size:0.72rem;cursor:pointer;">Tickets</button>'
      + '</div>';
  }

  var photos = '';
  for (var p = 0; p < c.photos.length; p++) {
    photos += '<div style="aspect-ratio:16/9;background:' + c.gradient + ';border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;">' + c.photos[p] + '</div>';
  }

  var giveawaySection = '';
  if (c.giveaway) {
    giveawaySection = '<div style="background:linear-gradient(135deg,rgba(255,215,0,0.08),rgba(233,30,140,0.08));border:1px solid rgba(255,215,0,0.25);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
      + '<div style="font-family:Inter,sans-serif;font-weight:800;font-size:1rem;margin-bottom:8px;">&#127922; Active Giveaway</div>'
      + '<div style="font-size:0.88rem;font-weight:600;margin-bottom:6px;">' + c.giveaway_text + '</div>'
      + '<div style="color:#a090b8;font-size:0.78rem;margin-bottom:14px;">Ends ' + c.giveaway_ends + ' - ' + c.entries + ' entered</div>'
      + '<button id="detail-enter-btn" data-cid="' + c.id + '" style="width:100%;padding:12px;background:linear-gradient(135deg,#FFD700,#E91E8C);border:none;color:#fff;border-radius:10px;font-size:0.92rem;font-weight:800;cursor:pointer;">Enter Giveaway - Free</button>'
      + '<div style="font-size:0.7rem;color:#a090b8;text-align:center;margin-top:6px;">Winners picked randomly - Fortis verified</div></div>';
  }

  detail.innerHTML = '<button id="club-back-btn" style="display:flex;align-items:center;gap:8px;padding:8px 16px;background:rgba(200,180,255,0.09);border:1px solid rgba(123,47,255,0.28);color:#a090b8;border-radius:10px;cursor:pointer;font-size:0.85rem;margin-bottom:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">← Back</button>'
    + '<div style="background:' + c.gradient + ';border-radius:20px;padding:28px;margin-bottom:24px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;">'
    + '<div style="font-size:4rem;">' + c.emoji + '</div>'
    + '<div style="flex:1;min-width:200px;">'
    + '<h2 style="font-family:Inter,sans-serif;font-weight:800;font-size:1.6rem;margin-bottom:6px;">' + c.name + '</h2>'
    + '<div style="color:rgba(200,180,255,0.72);font-size:0.85rem;margin-bottom:8px;">&#128205; ' + c.address + '</div>'
    + '<div style="display:flex;gap:16px;flex-wrap:wrap;">'
    + '<span style="color:rgba(200,180,255,0.72);font-size:0.82rem;">&#9200; ' + c.hours + '</span>'
    + '<span style="color:#FFD700;font-size:0.82rem;">&#9733; ' + c.rating + ' (' + c.reviews + ' reviews)</span>'
    + '</div></div>'
    + '<div style="display:flex;flex-direction:column;gap:8px;">'
    + '<button id="club-directions-btn" style="padding:10px 18px;background:rgba(255,255,255,0.15);border:1px solid rgba(123,47,255,0.28);color:#fff;border-radius:12px;font-size:0.85rem;cursor:pointer;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">&#128205; Directions</button>'
    + '<button id="club-follow-btn" data-name="' + c.name + '" style="padding:10px 18px;background:linear-gradient(135deg,#E91E8C,#7B2FFF);border:none;color:#fff;border-radius:12px;font-size:0.85rem;font-weight:700;cursor:pointer;">+ Follow</button>'
    + '</div></div>'
    + '<div class="detail-grid-2col" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">'
    + '<div style="display:flex;flex-direction:column;gap:16px;">'
    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:10px;">About</div>'
    + '<p style="color:#a090b8;font-size:0.85rem;line-height:1.6;">' + c.desc + '</p></div>'
    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:12px;">&#128247; Gallery</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' + photos + '</div></div>'
    + '<div style="background:#1a1428;border:1px solid rgba(200,180,255,0.13);border-radius:14px;overflow:hidden;">'
    + '<div style="padding:14px 16px;font-family:Inter,sans-serif;font-weight:700;font-size:0.9rem;">&#9654;&#65039; Highlights</div>'
    + '<div style="position:relative;padding-bottom:56.25%;height:0;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" allowfullscreen loading="lazy"></iframe></div>'
    + '</div></div>'
    + '<div style="display:flex;flex-direction:column;gap:16px;">'
    + giveawaySection
    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:12px;">&#128197; Upcoming Events</div>'
    + '<div style="display:flex;flex-direction:column;gap:10px;">' + upcoming + '</div></div>'
    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;">Fan Reviews</div>'
    + '<button id="add-review-btn" style="padding:5px 12px;background:rgba(123,47,255,0.12);border:1px solid rgba(123,47,255,0.3);color:#A06EFF;border-radius:8px;font-size:0.75rem;cursor:pointer;">+ Write Review</button>'
    + '</div>'
    + '<div id="club-reviews-list" style="display:flex;flex-direction:column;gap:10px;">'
    + '<div class="review-item"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:0.82rem;font-weight:600;">Alex M.</span><span style="color:#FFD700;font-size:0.78rem;">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div><div style="font-size:0.78rem;color:#a090b8;">Absolutely incredible night. Won VIP tickets through Fortis - best night ever!</div></div>'
    + '<div class="review-item"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:0.82rem;font-weight:600;">Sarah K.</span><span style="color:#FFD700;font-size:0.78rem;">&#9733;&#9733;&#9733;&#9733;&#9734;</span></div><div style="font-size:0.78rem;color:#a090b8;">Great atmosphere, love finding events on Fortis and entering giveaways.</div></div>'
    + '</div></div>'
    + '</div></div>';

  // Attach events after render
  var backBtn = document.getElementById('club-back-btn');
  if (backBtn) backBtn.addEventListener('click', closeClubDetail);

  var dirBtn = document.getElementById('club-directions-btn');
  if (dirBtn) dirBtn.addEventListener('click', function(){ showToast('Opening maps...'); });

  var followBtn = document.getElementById('club-follow-btn');
  if (followBtn) followBtn.addEventListener('click', function(){
    showToast('Following ' + this.getAttribute('data-name') + '!');
  });

  var enterBtn = document.getElementById('detail-enter-btn');
  if (enterBtn) enterBtn.addEventListener('click', function(){
    enterGiveaway(this.getAttribute('data-cid'));
  });

  detail.querySelectorAll('.ticket-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      showToast('Tickets for ' + this.getAttribute('data-ev') + '!');
    });
  });

  var reviewBtn = document.getElementById('add-review-btn');
  if (reviewBtn) reviewBtn.addEventListener('click', addClubReview);
}

function closeClubDetail() {
  var detail = document.getElementById('clubDetail');
  var grid = document.getElementById('clubsGrid');
  if (detail) detail.style.display = 'none';
  if (grid) grid.style.display = 'grid';
}

function enterGiveaway(clubId) {
  var c = CLUBS_DB.find(function(x){ return x.id === clubId; });
  if (!c) return;
  c.entries++;
  showToast('Entered giveaway at ' + c.name + '! Good luck!');
  addFanActivity('🎰', 'Entered giveaway at ' + c.name, 'Just now');
  var prizesList = document.getElementById('fan-club-prizes');
  if (prizesList) {
    var item = document.createElement('div');
    item.style.cssText = 'background:#0d0818;border:1px solid rgba(123,47,255,0.15);border-radius:10px;padding:12px;display:flex;align-items:center;gap:10px;';
    item.innerHTML = '<div style="font-size:1.6rem;flex-shrink:0;">&#127922;</div>'
      + '<div style="flex:1;"><div style="font-size:0.85rem;font-weight:600;">Giveaway - ' + c.name + '</div>'
      + '<div style="font-size:0.72rem;color:#a090b8;">Ends ' + c.giveaway_ends + '</div></div>'
      + '<span style="background:rgba(123,47,255,0.12);color:#A06EFF;padding:3px 10px;border-radius:8px;font-size:0.7rem;font-weight:700;">Entered</span>';
    prizesList.insertBefore(item, prizesList.firstChild);
  }
}

function addClubReview() {
  var text = prompt('Write your review:');
  if (!text || !text.trim()) return;
  var list = document.getElementById('club-reviews-list');
  if (!list) return;
  var item = document.createElement('div');
  item.className = 'review-item';
  item.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:5px;">'
    + '<span style="font-size:0.82rem;font-weight:600;">You <span style="color:#a090b8;">- Just now</span></span>'
    + '<span style="color:#FFD700;font-size:0.78rem;">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>'
    + '<div style="font-size:0.78rem;color:#a090b8;">' + text + '</div>';
  list.insertBefore(item, list.firstChild);
  showToast('Review posted!');
  addFanActivity('💬', 'Left a club review', 'Just now');
}

// ══════════════════════════════════════
// EVENTS PAGE
// ══════════════════════════════════════
var evtActiveTab = '';

var EVENTS_DB = [
  {id:'e1', name:'Ultra Music Festival', cat:'Festival', genre:'Electronic', country:'USA', city:'Miami',
   date:'2026-03-27', month:3, venue:'Bayfront Park', price:299, currency:'USD',
   emoji:'🎡', gradient:'linear-gradient(135deg,#0d0d2b,#1a0a3a)',
   headliners:['Martin Garrix','Hardwell','Alesso'], capacity:165000, attending:142000,
   desc:'The world\'s premier electronic music festival returns to Miami for its 25th edition. Three days of non-stop music across multiple stages.',
   tags:['Electronic','EDM','Trance','House'], website:'ultramusicfestival.com', featured:true},

  {id:'e2', name:'EXIT Festival', cat:'Festival', genre:'Multi-Genre', country:'Serbia', city:'Novi Sad',
   date:'2026-07-09', month:7, venue:'Petrovaradin Fortress', price:89, currency:'EUR',
   emoji:'🏰', gradient:'linear-gradient(135deg,#1a0520,#2d0a3a)',
   headliners:['Gorillaz','Massive Attack','Carl Cox'], capacity:55000, attending:41000,
   desc:'One of Europe\'s most beloved festivals set inside a 18th-century fortress. EXIT delivers rock, electronic and urban music across 40 stages.',
   tags:['Multi-Genre','Electronic','Rock'], website:'exitfest.org', featured:true},

  {id:'e3', name:'Fortis Music Showcase', cat:'Showcase', genre:'Multi-Genre', country:'UAE', city:'Dubai',
   date:'2026-03-15', month:3, venue:'Warehouse 14, Al Quoz', price:0, currency:'EUR',
   emoji:'🛡️', gradient:'linear-gradient(135deg,#1a0a2e,#2d0a4a)',
   headliners:['Luna Rivera','DJ Nexus','Zara Pulse'], capacity:800, attending:620,
   desc:'The official Fortis Music platform launch showcase. Meet Fortis-verified artists, see live demos of blockchain rights protection and support music directly.',
   tags:['Electronic','House','Showcase'], website:'fortismusic.com', featured:true},

  {id:'e4', name:'Musikmesse Frankfurt', cat:'Gear Expo', genre:'Multi-Genre', country:'Germany', city:'Frankfurt',
   date:'2026-04-08', month:4, venue:'Messe Frankfurt', price:35, currency:'EUR',
   emoji:'🎸', gradient:'linear-gradient(135deg,#0a1a0a,#0a2a1a)',
   headliners:['Roland','Yamaha','Native Instruments','Pioneer DJ'], capacity:80000, attending:71000,
   desc:'The world\'s leading music industry trade fair. Discover the latest instruments, pro audio gear, DJ equipment, and music tech from 1,800+ exhibitors across 12 halls.',
   tags:['Gear Expo','Pro Audio','DJ Gear','Instruments'], website:'musikmesse.com', featured:false},

  {id:'e5', name:'Awakenings Festival', cat:'Festival', genre:'Techno', country:'Netherlands', city:'Amsterdam',
   date:'2026-06-27', month:6, venue:'Spaarnwoude', price:115, currency:'EUR',
   emoji:'⚡', gradient:'linear-gradient(135deg,#0e0a1c,#1a0a2a)',
   headliners:['Adam Beyer','Charlotte de Witte','Amelie Lens'], capacity:35000, attending:29000,
   desc:'The world\'s biggest techno festival returns to Amsterdam. Two days of pure underground techno in an iconic outdoor setting with a legendary lineup.',
   tags:['Techno','Industrial','Underground'], website:'awakenings.com', featured:false},

  {id:'e6', name:'NAMM Show 2026', cat:'Gear Expo', genre:'Multi-Genre', country:'USA', city:'Las Vegas',
   date:'2026-04-24', month:4, venue:'Las Vegas Convention Center', price:25, currency:'USD',
   emoji:'🎛️', gradient:'linear-gradient(135deg,#1a0a00,#2a1500)',
   headliners:['Gibson','Fender','Steinberg','Ableton'], capacity:95000, attending:87000,
   desc:'The global crossroads of the music products industry. NAMM brings together professionals from 139 countries to discover what\'s next in music technology and innovation.',
   tags:['Gear Expo','Music Tech','Instruments','Recording'], website:'namm.org', featured:false},

  {id:'e7', name:'Sonar Festival', cat:'Festival', genre:'Electronic', country:'Spain', city:'Barcelona',
   date:'2026-06-18', month:6, venue:'Fira de Barcelona', price:135, currency:'EUR',
   emoji:'🔊', gradient:'linear-gradient(135deg,#0a1a0a,#0a0a2a)',
   headliners:['Aphex Twin','Four Tet','Floating Points'], capacity:30000, attending:24000,
   desc:'Where creativity and technology meet. Sonar merges advanced music with multimedia art. Three days of day and night stages with the most forward-thinking electronic artists.',
   tags:['Electronic','Experimental','Art'], website:'sonar.es', featured:false},

  {id:'e8', name:'Fortis DJ Championship UAE', cat:'Showcase', genre:'Electronic', country:'UAE', city:'Dubai',
   date:'2026-04-05', month:4, venue:'Coca-Cola Arena, Dubai', price:45, currency:'AED',
   emoji:'🏆', gradient:'linear-gradient(135deg,#1a1000,#2a2000)',
   headliners:['DJ Nexus','DJ Echo','Guest Judges'], capacity:5000, attending:3200,
   desc:'The first official Fortis DJ Championship. Compete or watch as DJs from across the UAE battle for the title. Prize: Fortis platform partnership + €5,000.',
   tags:['House','Techno','DJ Battle'], website:'fortismusic.com', featured:false},

  {id:'e9', name:'Primavera Sound', cat:'Festival', genre:'Multi-Genre', country:'Spain', city:'Barcelona',
   date:'2026-05-28', month:5, venue:'Parc del Forum', price:175, currency:'EUR',
   emoji:'🌸', gradient:'linear-gradient(135deg,#1a0010,#2a0020)',
   headliners:['Radiohead','Lorde','Bicep'], capacity:60000, attending:55000,
   desc:'Barcelona\'s beloved festival blending indie, electronic and alternative music. One of the most critically acclaimed music events in the world.',
   tags:['Indie','Electronic','Alternative','Rock'], website:'primaverasound.com', featured:false},

  {id:'e10', name:'DJ Mag Headquarters', cat:'Conference', genre:'Electronic', country:'UK', city:'London',
   date:'2026-03-20', month:3, venue:'Magazine London', price:65, currency:'GBP',
   emoji:'🎙️', gradient:'linear-gradient(135deg,#0a0a0a,#1a0a1a)',
   headliners:['Various Industry Speakers'], capacity:1200, attending:980,
   desc:'The annual DJ Mag conference bringing together DJs, producers, label heads and music tech innovators for keynotes, panels and networking sessions.',
   tags:['Conference','Industry','Networking'], website:'djmag.com', featured:false},

  {id:'e11', name:'Afro Nation Portugal', cat:'Festival', genre:'Afrobeats', country:'Spain', city:'Barcelona',
   date:'2026-07-02', month:7, venue:'Praia de Vagueira', price:149, currency:'EUR',
   emoji:'🌍', gradient:'linear-gradient(135deg,#1a0a00,#2a1500)',
   headliners:['Burna Boy','Wizkid','Davido'], capacity:40000, attending:36000,
   desc:'The world\'s biggest Afrobeats festival returns to Europe. Three days of Afrobeats, amapiano and dancehall on a stunning beach location.',
   tags:['Afrobeats','Amapiano','Dancehall'], website:'astronation.co', featured:false},

  {id:'e12', name:'Abu Dhabi Jazz Festival', cat:'Concert', genre:'Jazz', country:'UAE', city:'Abu Dhabi',
   date:'2026-04-17', month:4, venue:'Emirates Palace', price:120, currency:'AED',
   emoji:'🎷', gradient:'linear-gradient(135deg,#0e0a1c,#1a0a0a)',
   headliners:['Norah Jones','Gregory Porter','Ibrahim Maalouf'], capacity:3000, attending:2600,
   desc:'The UAE\'s most prestigious jazz festival set against the stunning backdrop of Emirates Palace. Four nights of world-class jazz from international legends.',
   tags:['Jazz','Blues','Soul'], website:'abudhabilazz.ae', featured:false},
];

function setEvtTab(btn, cat) {
  document.querySelectorAll('.evt-tab').forEach(function(b){ b.classList.remove('active-tab'); });
  btn.classList.add('active-tab');
  evtActiveTab = cat;
  filterEvents();
}

function renderEventFeatured(data) {
  var featured = data.filter(function(e){ return e.featured; });
  var el = document.getElementById('evtFeatured');
  if (!el || featured.length === 0) return;
  el.innerHTML = '<div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:12px;">Featured Events</div>'
    + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:10px;">'
    + featured.map(function(e){
        var tags = e.tags.slice(0,2).map(function(t){ return '<span style="background:rgba(200,180,255,0.09);color:rgba(200,180,255,0.62);padding:2px 8px;border-radius:2px;font-size:0.62rem;letter-spacing:0.08em;text-transform:uppercase;">' + t + '</span>'; }).join('');
        var priceStr = e.price === 0 ? 'Free' : e.currency + ' ' + e.price;
        return '<div class="evt-card-featured evt-open-btn" data-eid="' + e.id + '" style="background:' + e.gradient + ';border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:18px;cursor:pointer;">'
          + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'
          + '<div><div style="font-weight:700;font-family:Inter,sans-serif;font-size:0.94rem;letter-spacing:-0.01em;">' + e.name + '</div>'
          + '<div style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin-top:2px;">' + e.city + ' · ' + formatEvtDate(e.date) + '</div></div>'
          + '<div style="font-size:0.9rem;font-weight:700;color:#C8A97E;">' + priceStr + '</div></div>'
          + '<div style="display:flex;gap:4px;flex-wrap:wrap;">' + tags + '</div></div>';
      }).join('')
    + '</div>';
  el.querySelectorAll('.evt-open-btn').forEach(function(el){
    el.addEventListener('click', function(){ openEvent(this.getAttribute('data-eid')); });
  });
}

function formatEvtDate(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
}

function renderEventCards(data) {
  var grid = document.getElementById('eventsGrid');
  var detail = document.getElementById('eventDetail');
  var countEl = document.getElementById('evtCount');
  if (!grid) return;
  if (detail) detail.style.display = 'none';
  grid.style.display = 'grid';
  if (countEl) countEl.textContent = data.length;
  if (data.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:rgba(200,180,255,0.52);font-size:0.88rem;">No events found. Try different filters.</div>';
    return;
  }
  var html = '';
  for (var i = 0; i < data.length; i++) {
    var e = data[i];
    var priceStr = e.price === 0 ? 'Free' : e.currency + ' ' + e.price;
    var pctFull = Math.round((e.attending / e.capacity) * 100);
    var tags = e.tags.slice(0,3).map(function(t){ return '<span style="background:rgba(200,180,255,0.07);color:rgba(200,180,255,0.58);padding:2px 8px;border-radius:2px;font-size:0.62rem;letter-spacing:0.08em;text-transform:uppercase;">' + t + '</span>'; }).join('');
    html += '<div class="evt-card evt-open-btn" data-eid="' + e.id + '" style="background:rgba(255,255,255,0.025);border:1px solid rgba(200,180,255,0.11);border-radius:16px;overflow:hidden;cursor:pointer;transition:border-color 0.15s;" onmouseover="this.style.borderColor=\'rgba(200,169,126,0.2)\'" onmouseout="this.style.borderColor=\'rgba(200,180,255,0.11)\'">'
          + '<div style="height:90px;background:' + e.gradient + ';display:flex;align-items:flex-end;justify-content:space-between;padding:12px 16px;">'
          + '<div style="font-size:0.66rem;background:rgba(0,0,0,0.3);color:rgba(255,255,255,0.6);padding:2px 8px;border-radius:2px;letter-spacing:0.08em;text-transform:uppercase;">' + e.cat + '</div>'
          + '<div style="font-size:0.9rem;font-weight:700;color:#C8A97E;">' + priceStr + '</div>'
          + '</div>'
          + '<div style="padding:14px 16px;">'
          + '<div style="font-family:Inter,sans-serif;font-weight:700;font-size:0.9rem;margin-bottom:4px;letter-spacing:-0.01em;">' + e.name + '</div>'
          + '<div style="font-size:0.72rem;color:rgba(200,180,255,0.55);margin-bottom:4px;">' + e.venue + ' · ' + e.city + '</div>'
          + '<div style="font-size:0.72rem;color:rgba(200,169,126,0.7);margin-bottom:10px;">' + formatEvtDate(e.date) + '</div>'
          + '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;">' + tags + '</div>'
          + '<div style="margin-bottom:12px;">'
          + '<div style="display:flex;justify-content:space-between;font-size:0.68rem;color:rgba(200,180,255,0.55);margin-bottom:4px;"><span>Attendance</span><span>' + e.attending.toLocaleString() + ' / ' + e.capacity.toLocaleString() + '</span></div>'
          + '<div style="height:2px;background:rgba(200,180,255,0.11);border-radius:1px;">'
          + '<div style="height:100%;width:' + pctFull + '%;background:#C8A97E;border-radius:1px;"></div></div></div>'
          + '<button class="evt-open-btn" data-eid="' + e.id + '" style="width:100%;padding:9px;background:#f0f0f5;border:none;color:#0d0818;border-radius:16px;font-size:0.78rem;font-weight:700;cursor:pointer;letter-spacing:0.02em;">View Event</button>'
          + '</div></div>';
  }
  grid.innerHTML = html;
  grid.querySelectorAll('.evt-open-btn').forEach(function(el){
    el.addEventListener('click', function(){ openEvent(this.getAttribute('data-eid')); });
  });
}

function filterEvents() {
  var q = (document.getElementById('evtSearch') ? document.getElementById('evtSearch').value : '').toLowerCase();
  var country = document.getElementById('evtCountry') ? document.getElementById('evtCountry').value : '';
  var city = document.getElementById('evtCity') ? document.getElementById('evtCity').value : '';
  var genre = document.getElementById('evtGenre') ? document.getElementById('evtGenre').value : '';
  var month = document.getElementById('evtMonth') ? document.getElementById('evtMonth').value : '';
  var sort = document.getElementById('evtSort') ? document.getElementById('evtSort').value : 'date';

  var results = EVENTS_DB.filter(function(e) {
    if (evtActiveTab && e.cat !== evtActiveTab) return false;
    if (q && !e.name.toLowerCase().includes(q) && !e.city.toLowerCase().includes(q) && !e.venue.toLowerCase().includes(q)) return false;
    if (country && e.country !== country) return false;
    if (city && e.city !== city) return false;
    if (genre && e.genre !== genre && !e.tags.includes(genre)) return false;
    if (month && e.month !== parseInt(month)) return false;
    return true;
  });

  if (sort === 'date') results.sort(function(a,b){ return new Date(a.date) - new Date(b.date); });
  else if (sort === 'popular') results.sort(function(a,b){ return b.attending - a.attending; });
  else if (sort === 'price') results.sort(function(a,b){ return a.price - b.price; });

  renderEventFeatured(results);
  renderEventCards(results.filter(function(e){ return !e.featured; }));
  document.getElementById('evtCount').textContent = results.length;
}

function clearEvtFilters() {
  ['evtSearch','evtCountry','evtCity','evtGenre','evtMonth'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.value = '';
  });
  evtActiveTab = '';
  document.querySelectorAll('.evt-tab').forEach(function(b){ b.classList.remove('active-tab'); });
  var all = document.querySelector('.evt-tab[data-cat=""]');
  if (all) all.classList.add('active-tab');
  filterEvents();
}

function openEvent(id) {
  var e = EVENTS_DB.find(function(x){ return x.id === id; });
  if (!e) return;
  var grid = document.getElementById('eventsGrid');
  var feat = document.getElementById('evtFeatured');
  var detail = document.getElementById('eventDetail');
  if (grid) grid.style.display = 'none';
  if (feat) feat.style.display = 'none';
  if (!detail) return;
  detail.style.display = 'block';

  var priceStr = e.price === 0 ? 'FREE ENTRY' : e.currency + ' ' + e.price;
  var pctFull = Math.round((e.attending / e.capacity) * 100);
  var headliners = e.headliners.map(function(h){
    return '<div style="background:#0d0818;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;">'
      + '<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#7B2FFF);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;">&#127908;</div>'
      + '<div style="font-size:0.88rem;font-weight:600;">' + h + '</div></div>';
  }).join('');
  var tags = e.tags.map(function(t){
    return '<span style="background:rgba(123,47,255,0.12);color:#A06EFF;padding:3px 10px;border-radius:10px;font-size:0.78rem;">' + t + '</span>';
  }).join('');

  detail.innerHTML = '<button id="evt-back-btn" style="display:flex;align-items:center;gap:8px;padding:8px 16px;background:rgba(200,180,255,0.09);border:1px solid rgba(123,47,255,0.28);color:#a090b8;border-radius:10px;cursor:pointer;font-size:0.85rem;margin-bottom:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">← Back to Events</button>'

    + '<div style="background:' + e.gradient + ';border-radius:20px;padding:32px;margin-bottom:24px;display:flex;align-items:center;gap:24px;flex-wrap:wrap;">'
    + '<div style="font-size:5rem;">' + e.emoji + '</div>'
    + '<div style="flex:1;min-width:200px;">'
    + '<div style="font-size:0.75rem;color:rgba(200,180,255,0.72);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">' + e.cat + '</div>'
    + '<h2 style="font-family:Inter,sans-serif;font-weight:800;font-size:1.8rem;margin-bottom:8px;">' + e.name + '</h2>'
    + '<div style="color:rgba(255,255,255,0.7);font-size:0.88rem;margin-bottom:4px;">&#128205; ' + e.venue + ' - ' + e.city + ', ' + e.country + '</div>'
    + '<div style="color:rgba(255,255,255,0.7);font-size:0.88rem;">&#128197; ' + formatEvtDate(e.date) + '</div>'
    + '</div>'
    + '<div style="display:flex;flex-direction:column;gap:8px;min-width:160px;">'
    + '<div style="text-align:center;background:rgba(0,0,0,0.3);border-radius:14px;padding:14px 20px;">'
    + '<div style="font-size:1.6rem;font-weight:800;color:#00E676;">' + priceStr + '</div>'
    + '<div style="font-size:0.72rem;color:rgba(200,180,255,0.72);margin-top:2px;">per ticket</div></div>'
    + '<button id="evt-ticket-btn" style="padding:12px 20px;background:linear-gradient(135deg,#E91E8C,#7B2FFF);border:none;color:#fff;border-radius:12px;font-size:0.9rem;font-weight:800;cursor:pointer;">&#127915; Get Tickets</button>'
    + '<button id="evt-save-btn" style="padding:10px 20px;background:rgba(255,255,255,0.1);border:1px solid rgba(123,47,255,0.28);color:#fff;border-radius:12px;font-size:0.85rem;cursor:pointer;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">&#9825; Save Event</button>'
    + '</div></div>'

    + '<div class="detail-grid-2col" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">'

    + '<div style="display:flex;flex-direction:column;gap:16px;">'

    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:10px;">About</div>'
    + '<p style="color:#a090b8;font-size:0.85rem;line-height:1.6;">' + e.desc + '</p>'
    + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px;">' + tags + '</div></div>'

    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:14px;">&#127908; Lineup / Headliners</div>'
    + '<div style="display:flex;flex-direction:column;gap:8px;">' + headliners + '</div></div>'

    + '<div style="background:#1a1428;border:1px solid rgba(200,180,255,0.13);border-radius:14px;overflow:hidden;">'
    + '<div style="padding:14px 16px;font-family:Inter,sans-serif;font-weight:700;font-size:0.9rem;">&#9654;&#65039; Event Highlights</div>'
    + '<div style="position:relative;padding-bottom:56.25%;height:0;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" allowfullscreen loading="lazy"></iframe></div>'
    + '</div></div>'

    + '<div style="display:flex;flex-direction:column;gap:16px;">'

    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:14px;">&#128202; Event Stats</div>'
    + '<div style="display:flex;flex-direction:column;gap:12px;">'
    + '<div><div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:5px;"><span style="color:#a090b8;">Attendance</span><span style="font-weight:600;">' + e.attending.toLocaleString() + ' / ' + e.capacity.toLocaleString() + '</span></div>'
    + '<div style="height:8px;background:rgba(200,180,255,0.09);border-radius:4px;"><div style="height:100%;width:' + pctFull + '%;background:linear-gradient(90deg,#E91E8C,#7B2FFF);border-radius:4px;"></div></div>'
    + '<div style="font-size:0.72rem;color:#E91E8C;margin-top:3px;">' + pctFull + '% capacity</div></div>'
    + '<div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid rgba(200,180,255,0.09);"><span style="color:#a090b8;font-size:0.82rem;">Genre</span><span style="font-size:0.82rem;font-weight:600;">' + e.genre + '</span></div>'
    + '<div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid rgba(200,180,255,0.09);"><span style="color:#a090b8;font-size:0.82rem;">Venue Capacity</span><span style="font-size:0.82rem;font-weight:600;">' + e.capacity.toLocaleString() + '</span></div>'
    + '<div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid rgba(200,180,255,0.09);"><span style="color:#a090b8;font-size:0.82rem;">Website</span><span style="font-size:0.82rem;color:#A06EFF;">' + e.website + '</span></div>'
    + '</div></div>'

    + '<div style="background:linear-gradient(135deg,rgba(233,30,140,0.08),rgba(123,47,255,0.08));border:1px solid rgba(123,47,255,0.2);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:8px;">&#127918; Fortis Giveaway</div>'
    + '<div style="font-size:0.85rem;color:#a090b8;margin-bottom:14px;">Win 2 tickets + backstage pass to ' + e.name + '. Fortis fans only — enter with your Fortis account.</div>'
    + '<button id="evt-giveaway-btn" style="width:100%;padding:11px;background:linear-gradient(135deg,#FFD700,#E91E8C);border:none;color:#fff;border-radius:10px;font-size:0.88rem;font-weight:800;cursor:pointer;">&#127922; Enter Giveaway</button>'
    + '<div style="font-size:0.7rem;color:#a090b8;text-align:center;margin-top:6px;">437 people entered - ends 3 days before event</div></div>'

    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;">&#128172; Fan Reviews</div>'
    + '<button id="evt-review-btn" style="padding:5px 12px;background:rgba(123,47,255,0.12);border:1px solid rgba(123,47,255,0.3);color:#A06EFF;border-radius:8px;font-size:0.75rem;cursor:pointer;">+ Write Review</button>'
    + '</div>'
    + '<div id="evt-reviews-list" style="display:flex;flex-direction:column;gap:10px;">'
    + '<div class="review-item"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:0.82rem;font-weight:600;">Marco B. <span style="color:#a090b8;">- Gold Fan</span></span><span style="color:#FFD700;font-size:0.78rem;">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div><div style="font-size:0.78rem;color:#a090b8;">Absolutely life-changing experience. Sound quality and production were insane. Cannot wait for next year!</div></div>'
    + '<div class="review-item"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:0.82rem;font-weight:600;">Lena V.</span><span style="color:#FFD700;font-size:0.78rem;">&#9733;&#9733;&#9733;&#9733;&#9734;</span></div><div style="font-size:0.78rem;color:#a090b8;">Great lineup but queue management could be improved. Music itself was phenomenal.</div></div>'
    + '</div></div>'

    + '</div></div>';

  var backBtn = document.getElementById('evt-back-btn');
  if (backBtn) backBtn.addEventListener('click', closeEventDetail);

  var ticketBtn = document.getElementById('evt-ticket-btn');
  if (ticketBtn) ticketBtn.addEventListener('click', function(){ showToast('Opening ticket page for ' + e.name + '...'); });

  var saveBtn = document.getElementById('evt-save-btn');
  if (saveBtn) saveBtn.addEventListener('click', function(){
    showToast('Event saved to your profile!');
    addFanActivity('📅', 'Saved event: ' + e.name, 'Just now');
  });

  var giveawayBtn = document.getElementById('evt-giveaway-btn');
  if (giveawayBtn) giveawayBtn.addEventListener('click', function(){
    showToast('Entered giveaway for ' + e.name + '! Good luck!');
    addFanActivity('🎰', 'Entered event giveaway: ' + e.name, 'Just now');
  });

  var reviewBtn = document.getElementById('evt-review-btn');
  if (reviewBtn) reviewBtn.addEventListener('click', function(){
    var text = prompt('Write your review:');
    if (!text || !text.trim()) return;
    var list = document.getElementById('evt-reviews-list');
    if (!list) return;
    var item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:0.82rem;font-weight:600;">You</span><span style="color:#FFD700;font-size:0.78rem;">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div><div style="font-size:0.78rem;color:#a090b8;">' + text.trim() + '</div>';
    list.insertBefore(item, list.firstChild);
    showToast('Review posted!');
  });
}
function closeEventDetail() {
  var grid = document.getElementById('eventsGrid');
  var feat = document.getElementById('evtFeatured');
  var detail = document.getElementById('eventDetail');
  if (grid) grid.style.display = '';
  if (feat) feat.style.display = '';
  if (detail) detail.style.display = 'none';
}
window.addEventListener('DOMContentLoaded', function() {
  renderGearCards();
  renderDanceCards();
  renderStudioCards();
  filterArtists();
  filterClubs();
  filterEvents();
});

var nowDropSecs = 47*60+33;
var nowDropRegistered = false;
var nowDropCount = 1203;
var NOW_FEED = [
  {bg:'rgba(123,47,255,0.15)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',text:'<b>Luna Rivera</b> started a live collab session',sub:'Session: Neon Pulse',time:'just now'},
  {bg:'rgba(0,230,118,0.12)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',text:'<b>Marco B.</b> tipped <b>DJ Nexus</b> 5.00',sub:'on track: Voltage',time:'1m ago'},
  {bg:'rgba(255,215,0,0.1)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',text:'<b>Sofia M.</b> registered for the drop',sub:'Midnight Echo',time:'3m ago'},
  {bg:'rgba(123,47,255,0.15)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',text:'<b>Yuki T.</b> earned Early Listener badge #47',sub:'Voltage by DJ Nexus',time:'4m ago'},
  {bg:'rgba(200,180,255,0.09)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',text:'<b>Carlos R.</b> posted in Luna Rivera Fan Room',sub:'"This collab is incredible"',time:'5m ago'},
  {bg:'rgba(0,230,118,0.1)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',text:'<b>312 fans</b> entered Luna Rivera Fan Room',sub:'Listening together now',time:'6m ago'},
  {bg:'rgba(123,47,255,0.12)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',text:'<b>Zara Moon</b> protected a new track',sub:'Solstice blockchain certified',time:'8m ago'},
];
function initNowFeed() {
  var list = document.getElementById('nowFeedList');
  if (!list) return;
  list.innerHTML = '';
  NOW_FEED.forEach(function(e) {
    var d = document.createElement('div');
    d.className = 'now-feed-item';
    d.innerHTML = '<div class="now-feed-icon" style="background:' + e.bg + ';">' + e.ico + '</div><div class="now-feed-body">' + e.text + '<span>' + e.sub + '</span></div><div class="now-feed-time">' + e.time + '</div>';
    list.appendChild(d);
  });
}
function startNowCountdown() {
  setInterval(function() {
    if (nowDropSecs > 0) nowDropSecs--;
    var h = Math.floor(nowDropSecs/3600), m = Math.floor((nowDropSecs%3600)/60), s = nowDropSecs%60;
    var eh = document.getElementById('cdH'), em = document.getElementById('cdM'), es = document.getElementById('cdS');
    if (eh) eh.textContent = String(h).padStart(2,'0');
    if (em) em.textContent = String(m).padStart(2,'0');
    if (es) es.textContent = String(s).padStart(2,'0');
  }, 1000);
}
function nowRegisterDrop() {
  if (nowDropRegistered) { showToast('Already registered!'); return; }
  nowDropRegistered = true; nowDropCount++;
  var el = document.getElementById('dropRegCount');
  if (el) el.textContent = nowDropCount.toLocaleString() + ' fans registered';
  showToast('Registered! You will be notified when Midnight Echo drops.');
}
var CS_SEED = [
  {n:'Luna Rivera',c:'var(--pink)',m:'Bass almost done, adding texture'},
  {n:'DJ Nexus',c:'#00E676',m:'Drums locked, ready for the drop'},
  {n:'Aiden K.',c:'#FFD700',m:'Working on melody, give me 10 min'},
  {n:'Luna Rivera',c:'var(--pink)',m:'Sounds great, try going higher on the bridge'},
  {n:'DJ Nexus',c:'#00E676',m:'Vocals slot open if anyone wants in'},
];
var CS_COLORS = [['#7B2FFF','#E91E8C'],['#00E676','#009688'],['#FFD700','#FF8C00'],['#E91E8C','#FF6B6B']];
function csInitWaves() {
  ['csb1','csb2','csb3','csb4'].forEach(function(id,ti) {
    var el = document.getElementById(id); if (!el) return;
    el.innerHTML = '';
    var n = ti === 3 ? 6 : 18;
    for (var i = 0; i < n; i++) {
      var b = document.createElement('div'); b.className = 'cs-bar';
      b.style.cssText = 'width:3px;height:' + (Math.floor(Math.abs(Math.random())*16)+4) + 'px;background:' + CS_COLORS[ti][i%2] + ';opacity:0.8;animation-delay:' + (i*0.05) + 's;';
      el.appendChild(b);
    }
  });
}
function csInitChat() {
  var el = document.getElementById('csMsgs'); if (!el) return;
  el.innerHTML = '';
  CS_SEED.forEach(function(m) {
    var d = document.createElement('div'); d.className = 'cs-msg';
    d.innerHTML = '<span class="n" style="color:' + m.c + ';">' + m.n + '</span>' + m.m;
    el.appendChild(d);
  });
  el.scrollTop = el.scrollHeight;
}
// ── COLLAB TIPS ──
var csSelectedTip = 1;
var csTipsTotal = 0;

function csSelectTip(el, amount) {
  document.querySelectorAll('.cs-tip-btn').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  csSelectedTip = amount;
  var inp = document.getElementById('csTipCustomInput');
  if (inp) inp.style.display = 'none';
}

function csSelectTipCustom(el) {
  document.querySelectorAll('.cs-tip-btn').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  csSelectedTip = 'custom';
  var inp = document.getElementById('csTipCustomInput');
  if (inp) { inp.style.display = 'block'; inp.focus(); }
}

function csSendTip() {
  var amount = csSelectedTip;
  if (amount === 'custom') {
    var inp = document.getElementById('csTipCustomInput');
    amount = inp ? parseFloat(inp.value) : 0;
    if (!amount || amount <= 0) { showToast('Please enter a valid amount.'); return; }
    if (inp) inp.value = '';
  }
  csTipsTotal += amount;
  var el = document.getElementById('csTipsTotal');
  if (el) el.textContent = '€' + csTipsTotal.toFixed(2);
  showToast('€' + parseFloat(amount).toFixed(2) + ' tip sent! Split between all collaborators.');
  var msgs = document.getElementById('csMsgs');
  if (msgs) {
    var d = document.createElement('div');
    d.style.cssText = 'font-size:0.78rem;padding:4px 0;';
    d.innerHTML = '<span style="font-weight:600;color:#00E676;">You</span> sent a €' + parseFloat(amount).toFixed(2) + ' tip 💚';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
}

function csSend() {
  var inp = document.getElementById('csInput'); if (!inp || !inp.value.trim()) return;
  var el = document.getElementById('csMsgs');
  var d = document.createElement('div'); d.className = 'cs-msg';
  d.innerHTML = '<span class="n" style="color:var(--pink);">You</span>' + inp.value.trim();
  el.appendChild(d); el.scrollTop = el.scrollHeight; inp.value = '';
}
function nowJoinCollab() {
  csInitWaves(); csInitChat();
  document.getElementById('now-sub-collab').classList.add('open');
  showToast('Opening collab session...');
}
function gateIsOpen() { try { return localStorage.getItem('fm_access') === '1'; } catch(e) { return false; } }
function gateOpen() {
  if (gateIsOpen()) return;
  // Check URL token (e.g. ?fm=abc123)
  try {
    var urlEmail = new URLSearchParams(window.location.search).get('fm_email');
    if (urlEmail && urlEmail.includes('@')) {
      localStorage.setItem('fm_access','1');
      localStorage.setItem('fm_email', urlEmail);
      return;
    }
  } catch(e){}
  document.getElementById('gateOverlay').classList.add('show');
  // Show returning user view if on a new device
  gateShowCorrectView();
  gateDetectCountry();
}
function gateShowCorrectView() {
  // Always show full registration — returning user can switch to email-only view
  document.getElementById('gateFullForm').style.display = 'block';
  document.getElementById('gateReturnForm').style.display = 'none';
}
function openRegModal() { gateOpen(); }
function gRole(el, val) {
  document.querySelectorAll('.gate-role-opt').forEach(function(e){ e.classList.remove('sel'); });
  el.classList.add('sel');
  document.getElementById('gROLE').value = val;
  var artisticRow = document.getElementById('gArtisticNameRow');
  var businessRow = document.getElementById('gBusinessNameRow');
  var artisticLabel = document.getElementById('gArtisticNameLabel');
  var artisticArtists = ['Artist', 'DJ'];
  var businessRoles = ['Gear Store', 'Event', 'Dance Club', 'Music Studio', 'Bar/Club'];
  if (artisticArtists.indexOf(val) !== -1) {
    artisticLabel.textContent = val === 'DJ' ? 'Artistic Name' : 'Artistic Name / Band Name';
    artisticRow.style.display = 'block';
    businessRow.style.display = 'none';
    document.getElementById('gBusinessName').value = '';
  } else if (businessRoles.indexOf(val) !== -1) {
    businessRow.style.display = 'block';
    artisticRow.style.display = 'none';
    document.getElementById('gArtisticName').value = '';
  } else {
    artisticRow.style.display = 'none';
    businessRow.style.display = 'none';
    document.getElementById('gArtisticName').value = '';
    document.getElementById('gBusinessName').value = '';
  }
}
function gateSubmit(e) {
  e.preventDefault();
  var fn = document.getElementById('gFN').value.trim();
  var ln = document.getElementById('gLN').value.trim();
  var em = document.getElementById('gEM').value.trim();
  var co = document.getElementById('gCO').value;
  var err = document.getElementById('gErr');
  if (!fn || !ln || !em || !co) { err.style.display = 'block'; return; }
  err.style.display = 'none';
  var data = new FormData(e.target);
  fetch('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams(data).toString()})
    .then(function() { gateSuccess(fn, em); })
    .catch(function() { gateSuccess(fn, em); });
}
function gateReturnSubmit(e) {
  e.preventDefault();
  var em = document.getElementById('gReturnEmail').value.trim();
  var err = document.getElementById('gReturnErr');
  if (!em || !em.includes('@')) { err.style.display = 'block'; return; }
  err.style.display = 'none';
  // Save and grant access — no new Netlify submission
  localStorage.setItem('fm_access','1');
  localStorage.setItem('fm_email', em);
  document.getElementById('gateOverlay').classList.remove('show');
  showToast('Welcome back to Fortis Music!');
}
function gateSuccess(fn, em) {
  try { localStorage.setItem('fm_access','1'); localStorage.setItem('fm_email', em || ''); } catch(er) {}
  document.getElementById('gateOverlay').classList.remove('show');
  showToast('Welcome to Fortis Music, ' + fn + '!');
}
function gateDetectCountry() {
  fetch('https://ipapi.co/json/')
    .then(function(r){ return r.json(); })
    .then(function(d) {
      var sel = document.getElementById('gCO'); if (!sel || !d.country_name) return;
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].text === d.country_name) { sel.selectedIndex = i; return; }
      }
    }).catch(function(){});
}

window.addEventListener('DOMContentLoaded', function() {
  initNowFeed();
  startNowCountdown();
});

var JB_DATA={electronic:{label:'Electronic / Dance',listeners:'1,240',prize:47.50,todVotes:847,tracks:[{t:'Voltage',a:'DJ Nexus',c:'UAE',g:'Techno',dur:'3:42',v:124},{t:'Midnight Echo',a:'Luna Rivera',c:'UAE',g:'Deep House',dur:'4:15',v:89},{t:'Iron Circuit',a:'The Void',c:'UK',g:'Industrial',dur:'5:01',v:67},{t:'Solstice',a:'Zara Moon',c:'Serbia',g:'Ambient',dur:'3:28',v:41},{t:'Celestial Drift',a:'Aria Voss',c:'Germany',g:'Electronic',dur:'4:55',v:28}],chat:[{n:'Marco B.',m:'this track is absolute fire'},{n:'Sofia L.',m:'voting for Midnight Echo next'},{n:'Yuki T.',m:'Luna Rivera every time'},{n:'Carlos P.',m:'who proposed Iron Circuit?'},{n:'Priya S.',m:'been here 2 hours, no regrets'}]},hiphop:{label:'Hip-Hop / R&B',listeners:'890',prize:31.00,todVotes:612,tracks:[{t:'Street Psalms',a:'Marcus Wave',c:'USA',g:'Hip-Hop',dur:'3:18',v:98},{t:'Golden Hour',a:'Celeste M.',c:'France',g:'R&B',dur:'3:55',v:74},{t:'Lagos Nights',a:'DJ Pharaoh',c:'Nigeria',g:'Afrobeats',dur:'4:02',v:55}],chat:[{n:'Aiden K.',m:'Marcus Wave is insane'},{n:'Zara M.',m:'Golden Hour after this'}]},pop:{label:'Pop',listeners:'654',prize:22.50,todVotes:445,tracks:[{t:'Neon Dreams',a:'Nadia Sol',c:'South Africa',g:'Pop',dur:'3:22',v:112},{t:'Heartlines',a:'Celeste M.',c:'France',g:'Indie Pop',dur:'3:48',v:76}],chat:[{n:'Sofia L.',m:'Neon Dreams is so good'},{n:'Marco B.',m:'Celeste deserves more plays'}]},rock:{label:'Rock / Alternative',listeners:'412',prize:18.00,todVotes:334,tracks:[{t:'Static Pulse',a:'The Void',c:'UK',g:'Alternative',dur:'4:10',v:88},{t:'Broken Signal',a:'Kai Santos',c:'Brazil',g:'Rock',dur:'3:55',v:61}],chat:[{n:'Yuki T.',m:'The Void is underrated'},{n:'Carlos P.',m:'Static Pulse goes hard'}]},afro:{label:'Afrobeats / World',listeners:'378',prize:15.50,todVotes:298,tracks:[{t:'Lagos Nights',a:'DJ Pharaoh',c:'Nigeria',g:'Afrobeats',dur:'4:02',v:134},{t:'Savanna',a:'Nadia Sol',c:'South Africa',g:'World',dur:'3:37',v:79}],chat:[{n:'Priya S.',m:'Lagos Nights always wins'},{n:'Aiden K.',m:'DJ Pharaoh is a legend'}]}};
var jbActiveGenre='electronic',jbProgVal=38,jbProgInt=null,jbTodVoted=false,jbVotedTracks={};

// ── JUKEBOX VOTING SYSTEM ──
var JB_VOTE_TRACKS = {
  electronic:[
    {t:'Voltage',a:'DJ Nexus',c:'UAE',g:'Techno',dur:'3:42',votes:124,proposed:'Marco B.'},
    {t:'Midnight Echo',a:'Luna Rivera',c:'UAE',g:'Deep House',dur:'4:15',votes:89,proposed:'Sofia L.'},
    {t:'Iron Circuit',a:'The Void',c:'UK',g:'Industrial',dur:'5:01',votes:67,proposed:'Yuki T.'},
    {t:'Solstice',a:'Zara Moon',c:'Serbia',g:'Ambient',dur:'3:28',votes:41,proposed:'Carlos P.'},
    {t:'Celestial Drift',a:'Aria Voss',c:'Germany',g:'Electronic',dur:'4:55',votes:28,proposed:'Priya S.'},
    {t:'Neon Grid',a:'Devika R.',c:'India',g:'Synthwave',dur:'3:55',votes:22,proposed:'Ali B.'},
    {t:'Pulse',a:'Marcus D.',c:'USA',g:'Techno',dur:'4:10',votes:18,proposed:'Ana S.'},
    {t:'Dark Matter',a:'Yelena V.',c:'France',g:'Electro',dur:'5:22',votes:15,proposed:'Jonas P.'},
    {t:'Signal Loss',a:'Kofi A.',c:'Nigeria',g:'Electronic',dur:'3:38',votes:12,proposed:'Fatima O.'},
    {t:'Binary Rain',a:'Siya K.',c:'South Africa',g:'Electronic',dur:'4:02',votes:9,proposed:'Keanu R.'},
  ],
  hiphop:[
    {t:'Street Psalms',a:'Marcus Wave',c:'USA',g:'Hip-Hop',dur:'3:18',votes:98,proposed:'Aiden K.'},
    {t:'Golden Hour',a:'Celeste M.',c:'France',g:'R&B',dur:'3:55',votes:74,proposed:'Zara M.'},
    {t:'Lagos Nights',a:'DJ Pharaoh',c:'Nigeria',g:'Afrobeats',dur:'4:02',votes:55,proposed:'Sofia L.'},
    {t:'Midnight Run',a:'Kai Santos',c:'Brazil',g:'Trap',dur:'3:30',votes:38,proposed:'Marco B.'},
    {t:'Soul Serenade',a:'Nadia Sol',c:'South Africa',g:'Neo-Soul',dur:'4:15',votes:27,proposed:'Priya S.'},
  ],
  pop:[
    {t:'Neon Dreams',a:'Nadia Sol',c:'South Africa',g:'Pop',dur:'3:22',votes:112,proposed:'Sofia L.'},
    {t:'Heartlines',a:'Celeste M.',c:'France',g:'Indie Pop',dur:'3:48',votes:76,proposed:'Marco B.'},
    {t:'Summer Static',a:'Luna Rivera',c:'UAE',g:'Synth-Pop',dur:'3:10',votes:54,proposed:'Yuki T.'},
    {t:'Glass',a:'Aria Voss',c:'Germany',g:'Alt-Pop',dur:'4:00',votes:33,proposed:'Carlos P.'},
  ],
  rock:[
    {t:'Static Pulse',a:'The Void',c:'UK',g:'Alternative',dur:'4:10',votes:88,proposed:'Yuki T.'},
    {t:'Broken Signal',a:'Kai Santos',c:'Brazil',g:'Rock',dur:'3:55',votes:61,proposed:'Carlos P.'},
    {t:'Ironclad',a:'Marcus D.',c:'USA',g:'Hard Rock',dur:'4:30',votes:44,proposed:'Jonas P.'},
  ],
  afro:[
    {t:'Lagos Nights',a:'DJ Pharaoh',c:'Nigeria',g:'Afrobeats',dur:'4:02',votes:134,proposed:'Priya S.'},
    {t:'Savanna',a:'Nadia Sol',c:'South Africa',g:'World',dur:'3:37',votes:79,proposed:'Aiden K.'},
    {t:'Rhythm of Kente',a:'Kofi A.',c:'Ghana',g:'Afrobeats',dur:'3:50',votes:52,proposed:'Ana S.'},
  ]
};

var jbUserVotes={},jbUserTokens=2,jbPrizeAmount={},jbVoteTimerSec={},jbVoteInterval=null,jbAutoVoteInterval=null;

var jbUserPrediction = {}; // genre -> track title predicted

function jbRenderVoting(genre){
  var tracks = JB_VOTE_TRACKS[genre] || [];
  var list = document.getElementById('jbVoteList');
  if(!list) return;

  // Sort alphabetically, never by votes
  var sorted = tracks.slice().sort(function(a,b){ return a.t.localeCompare(b.t); });

  list.innerHTML = '';
  sorted.forEach(function(track, i){
    var isVoted = jbUserVotes[genre] !== undefined &&
                  JB_VOTE_TRACKS[genre][jbUserVotes[genre]] &&
                  JB_VOTE_TRACKS[genre][jbUserVotes[genre]].t === track.t;
    var row = document.createElement('div');
    row.className = 'jb-vote-item' + (isVoted ? ' voted' : '');
    row.id = 'jbVoteRow' + i;
    var checkSvg = '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6L9 17l-5-5"/></svg>';
    var upSvg = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
    var playSvg = '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    row.innerHTML =
      '<div class="jb-vote-info" style="flex:1;min-width:0;">'
      + '<div class="jb-vote-track">' + track.t + '</div>'
      + '<div class="jb-vote-meta">' + track.a + ' · ' + track.g + ' · ' + track.c + '</div>'
      + '</div>'
      + '<button class="jb-play-btn" id="jbPlay'+i+'" title="Preview">' + playSvg + '</button>'
      + '<button class="jb-vote-btn' + (isVoted ? ' voted' : '') + '" id="jbVBtn'+i+'" title="Vote">' + (isVoted ? checkSvg : upSvg) + '</button>';

    var trackRef = track;
    row.querySelector('.jb-play-btn').addEventListener('click', function(e){
      e.stopPropagation();
      jbPreviewTrack(trackRef);
    });
    row.querySelector('.jb-vote-btn').addEventListener('click', function(e){
      e.stopPropagation();
      jbCastVote(genre, trackRef);
    });
    row.addEventListener('click', function(){ jbPreviewTrack(trackRef); });
    list.appendChild(row);
  });

  // Tokens
  var dots = document.getElementById('jbTokenDots');
  if(dots){
    dots.innerHTML = '';
    for(var k=0; k<3; k++){
      var d = document.createElement('div');
      d.className = 'jb-token-dot' + (k >= jbUserTokens ? ' used' : '');
      dots.appendChild(d);
    }
  }
  var tl = document.getElementById('jbTokensLbl');
  if(tl) tl.textContent = jbUserTokens + ' of 3 predictions left this week';

  if(!jbPrizeAmount[genre]) jbPrizeAmount[genre] = JB_DATA[genre] ? JB_DATA[genre].prize : 10;
  var pe = document.getElementById('jbPrizeDisplay');
  if(pe) pe.textContent = '€' + jbPrizeAmount[genre].toFixed(2);
  if(!jbVoteTimerSec[genre]) jbVoteTimerSec[genre] = 14*60+32;
  jbUpdateTimer(genre);
}

function jbPreviewTrack(track){
  // Update Now Playing to previewed track
  var el = document.getElementById('jbTrackName');
  if(el) el.textContent = track.t;
  var ea = document.getElementById('jbTrackArtist');
  if(ea) ea.textContent = track.a + ' · ' + track.c;
  var eg = document.getElementById('jbTagGenre');
  if(eg) eg.textContent = track.g;
  var ec = document.getElementById('jbTagCountry');
  if(ec) ec.textContent = track.c;
  // Reset progress for preview feel
  jbProgVal = Math.random() * 30;
  showToast('Previewing: ' + track.t + ' by ' + track.a);
}

function jbCastVote(genre, track){
  if(jbUserVotes[genre] !== undefined){ showToast('You already voted in this room today!'); return; }
  var tracks = JB_VOTE_TRACKS[genre];
  var idx = tracks.findIndex(function(t){ return t.t === track.t; });
  if(idx === -1) return;
  jbUserVotes[genre] = idx;
  tracks[idx].votes++;
  jbRenderVoting(genre);
  showToast('Voted for "' + track.t + '"! Winner announced at end of round.');
}

function jbPredict(){
  if(jbUserTokens <= 0){ showToast('No predictions left this week! Resets Monday.'); return; }
  var genre = jbActiveGenre || 'electronic';
  var tracks = JB_VOTE_TRACKS[genre] || [];
  if(!tracks.length) return;

  // Show simple prompt via modal-like overlay using showToast, 
  // For now pick currently playing track as prediction
  var currentTrack = document.getElementById('jbTrackName');
  var trackName = currentTrack ? currentTrack.textContent : tracks[0].t;
  jbUserPrediction[genre] = trackName;
  jbUserTokens--;

  var dots = document.getElementById('jbTokenDots');
  if(dots){ var all = dots.querySelectorAll('.jb-token-dot'); if(all[jbUserTokens]) all[jbUserTokens].classList.add('used'); }
  var tl = document.getElementById('jbTokensLbl');
  if(tl) tl.textContent = jbUserTokens + ' of 3 predictions left this week';

  showToast('Prediction locked: "' + trackName + '" — revealed at end of round!');
}

function jbStartVoteTimer(genre){
  clearInterval(jbVoteInterval);
  if(!jbVoteTimerSec[genre]) jbVoteTimerSec[genre] = 14*60+32;
  jbVoteInterval = setInterval(function(){
    if(!jbVoteTimerSec[genre]) return;
    jbVoteTimerSec[genre]--;
    jbUpdateTimer(genre);
    if(jbVoteTimerSec[genre] <= 0){ clearInterval(jbVoteInterval); jbRoundEnd(genre); }
  }, 1000);
}

function jbUpdateTimer(genre){
  var el = document.getElementById('jbVoteTimer');
  if(!el) return;
  var s = jbVoteTimerSec[genre] || 0, m = Math.floor(s/60), sec = s%60;
  el.textContent = m + ':' + (sec<10?'0':'') + sec;
  if(s < 120) el.classList.add('urgent'); else el.classList.remove('urgent');
}

function jbRoundEnd(genre){
  var tracks = JB_VOTE_TRACKS[genre];
  if(!tracks || !tracks.length) return;
  // Determine winner by votes (internal, not shown during voting)
  var winner = tracks.slice().sort(function(a,b){ return b.votes - a.votes; })[0];
  var prize = jbPrizeAmount[genre] || 0;

  // Show winner banner
  var banner = document.getElementById('jbWinnerBanner');
  var wt = document.getElementById('jbWinnerTrack');
  var ws = document.getElementById('jbWinnerSub');
  if(banner) banner.classList.add('show');
  if(wt) wt.textContent = winner.t;
  if(ws) ws.textContent = winner.a + ' · Artist receives €' + prize.toFixed(2);

  // Show prediction card with correct predictors
  var predictCard = document.getElementById('jbPredictCard');
  var predictCorrect = document.getElementById('jbPredictCorrect');
  if(predictCard) predictCard.style.display = 'block';
  var ttn = document.getElementById('jbTodTrackName');
  var tts = document.getElementById('jbTodTrackSub');
  if(ttn) ttn.textContent = winner.t;
  if(tts) tts.textContent = winner.a;

  // Check if user predicted correctly
  var userPredicted = jbUserPrediction[genre] === winner.t;
  if(predictCorrect){
    if(userPredicted){
      predictCorrect.textContent = 'Your prediction was correct!';
      predictCorrect.style.color = '#00E676';
    } else if(jbUserPrediction[genre]) {
      predictCorrect.textContent = 'You predicted: ' + jbUserPrediction[genre];
      predictCorrect.style.color = 'var(--muted)';
    } else {
      predictCorrect.textContent = '3 fans predicted correctly this round';
      predictCorrect.style.color = 'var(--muted)';
    }
  }

  showToast('"' + winner.t + '" wins the round! ' + winner.a + ' receives €' + prize.toFixed(2));

  // New round after 8s
  setTimeout(function(){
    if(banner) banner.classList.remove('show');
    if(predictCard) predictCard.style.display = 'none';
    jbUserVotes[genre] = undefined;
    jbUserPrediction[genre] = undefined;
    jbPrizeAmount[genre] = 10;
    jbVoteTimerSec[genre] = 15*60;
    tracks.forEach(function(t){ t.votes = Math.floor(Math.random()*30) + 5; });
    jbRenderVoting(genre);
    jbStartVoteTimer(genre);
  }, 8000);
}

// Auto votes run in background (invisible to user — just internal tracking)
function jbStartAutoVotes(genre){
  clearInterval(jbAutoVoteInterval);
  jbAutoVoteInterval = setInterval(function(){
    var tracks = JB_VOTE_TRACKS[genre];
    if(!tracks) return;
    var ridx = Math.floor(Math.random() * tracks.length);
    tracks[ridx].votes += Math.floor(Math.random()*2) + 1;
  }, 2500);
}
function jbOpen(){document.getElementById('now-sub-jukebox').classList.add('open');document.getElementById('jbBrowse').classList.remove('hidden');document.getElementById('jbRoom').classList.remove('open');}
function jbClose(){document.getElementById('now-sub-jukebox').classList.remove('open');if(jbProgInt){clearInterval(jbProgInt);jbProgInt=null;}clearInterval(jbVoteInterval);clearInterval(jbAutoVoteInterval);}









var DR_DROPS = [
  {id:'drop1',title:'Midnight Echo',sub:'Acoustic Version',artist:'Luna Rivera',country:'UAE',genre:'Indie Pop',fans:1203,earlyLeft:53,secs:47*60+33,status:'active',col:'linear-gradient(135deg,#300010,#660033)'},
  {id:'drop2',title:'Voltage',sub:'Club Edit',artist:'DJ Nexus',country:'UAE',genre:'Techno',fans:847,earlyLeft:72,secs:2*3600+15*60,status:'upcoming',col:'linear-gradient(135deg,#001030,#002060)'},
  {id:'drop3',title:'Street Psalms',sub:'Extended Mix',artist:'Marcus Wave',country:'USA',genre:'Hip-Hop',fans:612,earlyLeft:88,secs:5*3600+30*60,status:'upcoming',col:'linear-gradient(135deg,#101000,#302000)'},
  {id:'drop4',title:'Neon Dreams',sub:'Radio Edit',artist:'Nadia Sol',country:'South Africa',genre:'Pop',fans:445,earlyLeft:95,secs:8*3600,status:'upcoming',col:'linear-gradient(135deg,#001a10,#003020)'},
  {id:'drop5',title:'Lagos Nights',sub:'Festival Mix',artist:'DJ Pharaoh',country:'Nigeria',genre:'Afrobeats',fans:389,earlyLeft:61,secs:12*3600+45*60,status:'upcoming',col:'linear-gradient(135deg,#1a1000,#302000)'},
  {id:'drop6',title:'Static Pulse',sub:'Directors Cut',artist:'The Void',country:'UK',genre:'Rock',fans:278,earlyLeft:84,secs:24*3600,status:'upcoming',col:'linear-gradient(135deg,#0a0a0a,#1a1a1a)'},
];
var drActiveDrop=null,drReg=false,drRegCount=1203,drStageInt=null,drPlayerInt=null,drPlayerSecs=0,drLocked=true;
var DR_CHAT=[
  {n:'Marco B.',m:'Cannot wait for this acoustic version'},
  {n:'Sofia L.',m:'Luna Rivera never misses'},
  {n:'Yuki T.',m:'Already have my Early Listener spot'},
  {n:'Carlos P.',m:'This drop format is genius'},
  {n:'Priya S.',m:'47 minutes feels like forever'},
  {n:'Aiden K.',m:'The original is my most played this year'},
];
function drOpen(){drRenderVinyl(DR_DROPS);drInitFeaturedCD();document.getElementById('now-sub-droproom').classList.add('open');}
function drClose(){document.getElementById('now-sub-droproom').classList.remove('open');}
function drFilter(el,type){document.querySelectorAll('.dr-filter-btn').forEach(function(b){b.classList.remove('active');});el.classList.add('active');var f=type==='all'?DR_DROPS:DR_DROPS.filter(function(d){if(type==='live')return d.status==='active';if(type==='upcoming')return d.status==='upcoming';return d.genre.toLowerCase().indexOf(type)!==-1;});drRenderVinyl(f);}
function drRenderVinyl(drops){var s=document.getElementById('drVinylScroll');s.innerHTML='';drops.slice(1).forEach(function(d){var h=Math.floor(d.secs/3600),m=Math.floor((d.secs%3600)/60);var cd=d.status==='active'?'LIVE NOW':(h>0?h+'h '+m+'m':m+'m');var card=document.createElement('div');card.className='dr-vinyl-card';card.onclick=(function(id){return function(){drEnterDrop(id);};})(d.id);card.innerHTML='<div class="dr-vinyl-cover" style="background:'+d.col+';"><div class="dr-vinyl-disc"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div><div class="dr-vinyl-badge '+(d.status==='active'?'dr-badge-live':'dr-badge-upcoming')+'">'+(d.status==='active'?'LIVE':'SOON')+'</div></div><div class="dr-vinyl-body"><div class="dr-vinyl-name">'+d.title+'</div><div class="dr-vinyl-artist">'+d.artist+' · '+d.genre+'</div><div class="dr-vinyl-bottom"><div class="dr-vinyl-cd">'+cd+'</div><div class="dr-vinyl-fans">'+d.fans.toLocaleString()+' waiting</div></div></div>';s.appendChild(card);});}
function drInitFeaturedCD(){var secs=DR_DROPS[0].secs;var iv=setInterval(function(){if(secs>0)secs--;var h=Math.floor(secs/3600),m=Math.floor((secs%3600)/60),s=secs%60;var eh=document.getElementById('drFH'),em=document.getElementById('drFM'),es=document.getElementById('drFS');if(eh)eh.textContent=String(h).padStart(2,'0');if(em)em.textContent=String(m).padStart(2,'0');if(es)es.textContent=String(s).padStart(2,'0');},1000);}
function drEnterDrop(id){var d=DR_DROPS.find(function(x){return x.id===id;});if(!d)return;drActiveDrop=d;drReg=false;drLocked=true;drPlayerSecs=0;document.getElementById('drStageTitle').textContent=d.title;document.getElementById('drStageArtist').textContent=d.artist+' · '+d.country;document.getElementById('drStageGenre').textContent=d.genre;document.getElementById('drRegCount').textContent=d.fans.toLocaleString()+' registered';document.getElementById('drEarlyLeft').textContent=d.earlyLeft+' spots left';document.getElementById('drStageStatus').textContent=d.fans.toLocaleString()+' fans waiting for this drop';var btn=document.getElementById('drRegBtn');btn.className='dr-stage-reg-btn';btn.textContent='Register for Drop';document.getElementById('drPlayerWrap').classList.remove('show');document.getElementById('drStageCountdown').style.display='flex';document.getElementById('drBtnPrev').classList.add('locked');document.getElementById('drBtnNext').classList.add('locked');var lb=document.getElementById('drLockBar');if(lb)lb.style.display='block';drInitBubbles(d.fans);drInitChat();drStartCD(d.secs);document.getElementById('now-sub-dropstage').classList.add('open');drInitWaitRoom(id);}
function drInitBubbles(fans){var c=document.getElementById('drBubbles');c.innerHTML='';var cols=['var(--grad)','linear-gradient(135deg,#00E676,#009688)','linear-gradient(135deg,#FFD700,#FF8C00)','linear-gradient(135deg,#E91E8C,#FF4081)','linear-gradient(135deg,#00BCD4,#0097A7)'];var ns=['MR','SL','YT','CP','AK','ZM','PR'];var show=Math.min(7,fans);for(var i=0;i<show;i++){var b=document.createElement('div');b.className='dr-fan-bubble';b.style.cssText='background:'+cols[i%cols.length]+';left:'+(i*22)+'px;z-index:'+(10-i)+';';b.textContent=ns[i]||'?';c.appendChild(b);}var more=document.createElement('div');more.className='dr-fan-bubble';more.style.cssText='background:rgba(200,180,255,0.13);color:var(--muted);font-size:0.58rem;left:'+(show*22)+'px;';more.textContent='+'+(fans-show).toLocaleString();c.appendChild(more);c.style.width=((show+1)*22+32)+'px';}
function drInitChat(){var msgs=document.getElementById('drChatMsgs');msgs.innerHTML='';DR_CHAT.forEach(function(m){var d=document.createElement('div');d.className='dr-chat-msg';d.innerHTML='<span class="n">'+m.n+'</span>'+m.m;msgs.appendChild(d);});msgs.scrollTop=msgs.scrollHeight;}
function drChat(){var inp=document.getElementById('drChatIn');if(!inp||!inp.value.trim())return;var msgs=document.getElementById('drChatMsgs');var d=document.createElement('div');d.className='dr-chat-msg';d.innerHTML='<span class="n" style="color:var(--pink);">You</span>'+inp.value.trim();msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;inp.value='';}
function drStartCD(secs){if(drStageInt)clearInterval(drStageInt);var s=secs;function tick(){var h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;var eh=document.getElementById('drSH'),em=document.getElementById('drSM'),es=document.getElementById('drSS');if(eh)eh.textContent=String(h).padStart(2,'0');if(em)em.textContent=String(m).padStart(2,'0');if(es)es.textContent=String(sec).padStart(2,'0');}tick();drStageInt=setInterval(function(){if(s>0)s--;tick();if(s===0){clearInterval(drStageInt);drTriggerDrop();}},1000);}
function drTriggerDrop(){document.getElementById('drStageCountdown').style.display='none';document.getElementById('drStageStatus').textContent='LIVE — First 60 seconds radio mode';document.getElementById('drPlayerWrap').classList.add('show');showToast('Drop is LIVE!');if(drPlayerInt)clearInterval(drPlayerInt);drPlayerSecs=0;drPlayerInt=setInterval(function(){drPlayerSecs++;var pct=(drPlayerSecs/222)*100;var f=document.getElementById('drPlayerFill');var n=document.getElementById('drPlayerNow');if(f)f.style.width=Math.min(pct,100)+'%';if(n)n.textContent=Math.floor(drPlayerSecs/60)+':'+String(drPlayerSecs%60).padStart(2,'0');if(drPlayerSecs===60&&drLocked){drLocked=false;var lb=document.getElementById('drLockBar');if(lb)lb.textContent='Controls unlocked — enjoy the full track!';setTimeout(function(){if(lb)lb.style.display='none';},3000);document.getElementById('drBtnPrev').classList.remove('locked');document.getElementById('drBtnNext').classList.remove('locked');showToast('Controls unlocked!');}if(drPlayerSecs>=222)clearInterval(drPlayerInt);},1000);}
function drRegister(){if(drReg){showToast('Already registered!');return;}drReg=true;drRegCount++;var btn=document.getElementById('drRegBtn');btn.className='dr-stage-reg-btn registered';btn.textContent='Registered!';var el=document.getElementById('drRegCount');if(el)el.textContent=drRegCount.toLocaleString()+' registered';showToast('You are in! Drop notification incoming.');}
function drStageBack(){if(drStageInt)clearInterval(drStageInt);if(drPlayerInt)clearInterval(drPlayerInt);if(drLiveFansInt)clearInterval(drLiveFansInt);document.getElementById('now-sub-dropstage').classList.remove('open');}


var DR_ARTISTS = {
  drop1: { av:'LR', name:'Luna Rivera', genre:'Indie Pop', country:'UAE', streams:'2.4M', fans:'12.3K', tracks:8,
    discog:[
      {name:'Midnight Echo',meta:'2024 · 1.2M streams',col:'linear-gradient(135deg,#300010,#660033)'},
      {name:'Starfall',meta:'2023 · 840K streams',col:'linear-gradient(135deg,#100030,#300060)'},
      {name:'Golden Silence',meta:'2023 · 620K streams',col:'linear-gradient(135deg,#001030,#002060)'},
      {name:'Ember Coast',meta:'2022 · 410K streams',col:'linear-gradient(135deg,#001a10,#003020)'},
    ],
    ambient:['Midnight Echo','Starfall','Golden Silence']
  },
  drop2: { av:'DN', name:'DJ Nexus', genre:'Techno', country:'UAE', streams:'8.7M', fans:'28.7K', tracks:24,
    discog:[
      {name:'Voltage',meta:'2024 · 3.1M streams',col:'linear-gradient(135deg,#001030,#002060)'},
      {name:'Iron Circuit',meta:'2023 · 2.4M streams',col:'linear-gradient(135deg,#100010,#200020)'},
      {name:'Afterburn',meta:'2023 · 1.8M streams',col:'linear-gradient(135deg,#0d0818,#1a0030)'},
    ],
    ambient:['Voltage','Iron Circuit','Afterburn']
  },
  drop3: { av:'MW', name:'Marcus Wave', genre:'Hip-Hop', country:'USA', streams:'5.2M', fans:'19.2K', tracks:15,
    discog:[
      {name:'Street Psalms',meta:'2024 · 1.9M streams',col:'linear-gradient(135deg,#101000,#302000)'},
      {name:'Concrete Sun',meta:'2023 · 1.4M streams',col:'linear-gradient(135deg,#1a0a00,#2a1500)'},
    ],
    ambient:['Street Psalms','Concrete Sun']
  },
};
var drAmbientPlaying = true;
var drAmbientIdx = 0;
var drLiveFansCount = 1203;
var drLiveFansInt = null;

function drInitWaitRoom(dropId) {
  var artist = DR_ARTISTS[dropId] || DR_ARTISTS['drop1'];
  document.getElementById('drArtistAv').textContent = artist.av;
  document.getElementById('drArtistName').textContent = artist.name;
  document.getElementById('drArtistGenre').textContent = artist.genre + ' · ' + artist.country;
  document.getElementById('drArtistStreams').textContent = artist.streams;
  document.getElementById('drArtistFans').textContent = artist.fans;
  document.getElementById('drArtistTracks').textContent = artist.tracks;
  drAmbientIdx = 0;
  drUpdateAmbient(artist);
  drRenderDiscog(artist);
  drStartLiveFans();
}
function drUpdateAmbient(artist) {
  var tracks = artist.ambient || [];
  var name = tracks[drAmbientIdx % tracks.length] || 'Ambient Track';
  document.getElementById('drAmbientName').textContent = name;
  document.getElementById('drAmbientArtist').textContent = artist.name;
}
function drAmbientToggle() {
  drAmbientPlaying = !drAmbientPlaying;
  var btn = document.getElementById('drAmbientPlayBtn');
  if (btn) btn.textContent = drAmbientPlaying ? '⏸⏸' : '▶';
  showToast(drAmbientPlaying ? 'Playing ambient track' : 'Paused');
}
function drAmbientPrev() {
  drAmbientIdx = Math.max(0, drAmbientIdx - 1);
  var artist = DR_ARTISTS[drActiveDrop ? drActiveDrop.id : 'drop1'] || DR_ARTISTS['drop1'];
  drUpdateAmbient(artist);
  showToast('Previous track');
}
function drAmbientNext() {
  drAmbientIdx++;
  var artist = DR_ARTISTS[drActiveDrop ? drActiveDrop.id : 'drop1'] || DR_ARTISTS['drop1'];
  drUpdateAmbient(artist);
  showToast('Next track');
}
function drRenderDiscog(artist) {
  var list = document.getElementById('drDiscogList');
  if (!list) return;
  list.innerHTML = '';
  artist.discog.forEach(function(t, i) {
    var d = document.createElement('div');
    d.className = 'dr-discog-item';
    d.onclick = (function(name){ return function(){ showToast('Playing: ' + name); }; })(t.name);
    d.innerHTML = '<div class="dr-discog-num">' + (i+1) + '</div>'
      + '<div class="dr-discog-cover" style="background:' + t.col + ';">'
      + '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>'
      + '<div class="dr-discog-info"><div class="dr-discog-name">' + t.name + '</div>'
      + '<div class="dr-discog-meta">' + t.meta + '</div></div>';
    list.appendChild(d);
  });
}
function drStartLiveFans() {
  if (drLiveFansInt) clearInterval(drLiveFansInt);
  drLiveFansCount = drActiveDrop ? drActiveDrop.fans : 1203;
  var newInLast5 = 12;
  drLiveFansInt = setInterval(function() {
    if (Math.random() < 0.3) {
      drLiveFansCount++;
      newInLast5++;
      var el = document.getElementById('drLiveFans');
      var el2 = document.getElementById('drNewFans');
      if (el) el.textContent = drLiveFansCount.toLocaleString();
      if (el2) el2.textContent = '+' + newInLast5 + ' joined in last 5 min';
    }
  }, 3000);
}


function showArtistProfile(name) {
  var searchEl = document.getElementById('discoverSearch');
  if (searchEl) { searchEl.value = name; }
  showPage('discover');
  setTimeout(function() { filterArtists(); }, 150);
}

function drViewArtistProfile() {
  if (drStageInt) clearInterval(drStageInt);
  if (drPlayerInt) clearInterval(drPlayerInt);
  if (drLiveFansInt) clearInterval(drLiveFansInt);
  document.getElementById('now-sub-dropstage').classList.remove('open');
  document.getElementById('now-sub-droproom').classList.remove('open');
  showPage('artist');
}


function drDiscoverClick(el) {
  var name = el ? el.getAttribute('data-aname') : '';
  if (name) {
    showArtistProfile(name);
  } else {
    showPage('discover');
  }
}


document.addEventListener('click', function(e) {
  var t = e.target;
  while (t && t !== document.body) {
    if (t.classList && t.classList.contains('discover-card')) {
      var n = t.getAttribute('data-aname');
      if (n) { showArtistProfile(n); return; }
    }
    t = t.parentNode;
  }
});


var LR_EVENTS = [
  {id:'ev1', type:'concert', genre:'electronic', title:'EXIT Festival - Main Stage', sub:'Novi Sad, Serbia', artist:'DJ Nexus + Luna Rivera', viewers:4240, thumb:'linear-gradient(135deg,#0a0030,#1a0060)', city:'Novi Sad', country:'Serbia', free:false, price:'\u20ac5', desc:'Europe biggest exit festival streams live exclusively on Fortis. Watch the main stage acts in real time.', chat:[{n:'Marco B.',m:'EXIT is insane this year'},{n:'Sofia L.',m:'DJ Nexus opening set'},{n:'Yuki T.',m:'Watching from Tokyo right now'},{n:'Carlos P.',m:'Stream quality is perfect'},{n:'Priya S.',m:'Wish I was there in person'}]},
  {id:'ev2', type:'concert', genre:'hiphop', title:'Marcus Wave - Live in Atlanta', sub:'Atlanta, USA', artist:'Marcus Wave', viewers:2180, thumb:'linear-gradient(135deg,#101000,#302000)', city:'Atlanta', country:'USA', free:true, price:'Free', desc:'Marcus Wave performs his debut album Street Psalms live for the first time. Full show, no cuts.', chat:[{n:'Aiden K.',m:'Street Psalms live omg'},{n:'Zara M.',m:'He is incredible live'},{n:'DJ P.',m:'Support real artists'}]},
  {id:'ev3', type:'festival', genre:'electronic', title:'Fabric London - Friday Night', sub:'London, UK', artist:'Various DJs', viewers:3120, thumb:'linear-gradient(135deg,#001030,#002060)', city:'London', country:'UK', free:false, price:'\u00a33', desc:'Fabric London streams their Friday night lineup exclusively on Fortis Music. 4 rooms, all live.', chat:[{n:'Sarah T.',m:'Fabric never disappoints'},{n:'Marco B.',m:'Room 2 is incredible right now'},{n:'Yuki T.',m:'That bass drop!!!'}]},
  {id:'ev4', type:'concert', genre:'rock', title:'The Void - Manchester Arena', sub:'Manchester, UK', artist:'The Void', viewers:5600, thumb:'linear-gradient(135deg,#0a0a0a,#1a1a1a)', city:'Manchester', country:'UK', free:false, price:'\u00a34', desc:'The Void plays their biggest headline show to date at Manchester Arena. Stream live on Fortis.', chat:[{n:'Carlos P.',m:'The Void are UNREAL live'},{n:'Sofia L.',m:'Static Pulse just dropped'},{n:'Priya S.',m:'This crowd energy'}]},
  {id:'ev5', type:'festival', genre:'electronic', title:'Pacha Ibiza - Summer Opener', sub:'Ibiza, Spain', artist:'DJ Pharaoh + Guest', viewers:8900, thumb:'linear-gradient(135deg,#1a0010,#330020)', city:'Ibiza', country:'Spain', free:false, price:'\u20ac6', desc:'Pacha Ibiza kicks off the summer season with an exclusive Fortis livestream. First time ever.', chat:[{n:'Marco B.',m:'Pacha on Fortis is historic'},{n:'Aiden K.',m:'That DJ Pharaoh set'},{n:'Zara M.',m:'Ibiza energy through the screen'}]},
  {id:'ev6', type:'concert', genre:'electronic', title:'Womb Tokyo - Saturday Live', sub:'Tokyo, Japan', artist:'Kira Tanaka', viewers:1840, thumb:'linear-gradient(135deg,#001a10,#003020)', city:'Tokyo', country:'Japan', free:true, price:'Free', desc:'Womb Tokyo streams their Saturday night showcase. Featuring Kira Tanaka and the best of Tokyo.', chat:[{n:'Yuki T.',m:'Womb Tokyo represent!'},{n:'Carlos P.',m:'Tokyo scene is insane'}]},
];

var LR_CLUBS = [
  {id:'cl1', type:'techno', genre:'techno', title:'Warehouse 14 - Dubai', sub:'Dubai, UAE', artist:'DJ Echo live', viewers:892, thumb:'linear-gradient(135deg,#0a0015,#1a0030)', city:'Dubai', country:'UAE', free:true, price:'Free', desc:'Warehouse 14 in Dubai streams their Friday night techno session live. Walk-ins welcome after midnight.', chat:[{n:'Priya S.',m:'Warehouse 14 always goes hard'},{n:'Marco B.',m:'Going there tonight after watching this'},{n:'Sofia L.',m:'That DJ Echo set'}]},
  {id:'cl2', type:'house', genre:'house', title:'Club Celsius - Dubai', sub:'Dubai, UAE', artist:'House Night', viewers:445, thumb:'linear-gradient(135deg,#001030,#002050)', city:'Dubai', country:'UAE', free:true, price:'Free', desc:'Club Celsius streams their weekly house night. Check the vibe before you head out tonight.', chat:[{n:'Aiden K.',m:'Celsius vibe is different'},{n:'Carlos P.',m:'Might head there after 1am'}]},
  {id:'cl3', type:'techno', genre:'techno', title:'Plastic Belgrade - Saturday', sub:'Belgrade, Serbia', artist:'Techno Night', viewers:1240, thumb:'linear-gradient(135deg,#0d0818,#1a0020)', city:'Belgrade', country:'Serbia', free:true, price:'Free', desc:'Plastic Belgrade streams live on Fortis every Saturday. One of Europe best techno clubs.', chat:[{n:'Marco B.',m:'Belgrade techno scene is next level'},{n:'Yuki T.',m:'Watching from Japan, need to visit Serbia'},{n:'Sofia L.',m:'Plastic is legendary'}]},
  {id:'cl4', type:'rnb', genre:'rnb', title:'Amber Lounge - Abu Dhabi', sub:'Abu Dhabi, UAE', artist:'R&B Night', viewers:320, thumb:'linear-gradient(135deg,#1a0500,#2a1000)', city:'Abu Dhabi', country:'UAE', free:true, price:'Free', desc:'Amber Lounge Abu Dhabi streams their R&B and soul nights exclusively on Fortis Music.', chat:[{n:'Priya S.',m:'Amber Lounge is so elegant'},{n:'Carlos P.',m:'R&B vibes are perfect tonight'}]},
  {id:'cl5', type:'house', genre:'house', title:'Tresor Berlin - Underground', sub:'Berlin, Germany', artist:'Various Artists', viewers:2100, thumb:'linear-gradient(135deg,#050505,#101010)', city:'Berlin', country:'Germany', free:true, price:'Free', desc:'Tresor Berlin streams a curated window of their legendary underground nights. Only on Fortis.', chat:[{n:'Marco B.',m:'Tresor on Fortis is a moment in history'},{n:'Aiden K.',m:'Berlin techno forever'},{n:'Yuki T.',m:'This is why Fortis is different'}]},
  {id:'cl6', type:'house', genre:'house', title:'Pacha Ibiza Bar - Chill', sub:'Ibiza, Spain', artist:'Sunset Sessions', viewers:670, thumb:'linear-gradient(135deg,#1a0010,#2a0020)', city:'Ibiza', country:'Spain', free:true, price:'Free', desc:'Pacha bar area streams the relaxed sunset sessions. Perfect if you are deciding whether to come tonight.', chat:[{n:'Sofia L.',m:'This is the dream vibe'},{n:'Carlos P.',m:'Booking flights to Ibiza rn'}]},
];

var lrActiveType = null;
var lrActiveChatInt = null;

function lrOpen(type) {
  lrActiveType = type;
  if (type === 'events') {
    lrRenderGrid('events', LR_EVENTS);
    document.getElementById('now-sub-lrevents').classList.add('open');
  } else {
    lrRenderGrid('clubs', LR_CLUBS);
    document.getElementById('now-sub-lrclubs').classList.add('open');
  }
}
function lrClose(type) {
  if (type === 'events') document.getElementById('now-sub-lrevents').classList.remove('open');
  else document.getElementById('now-sub-lrclubs').classList.remove('open');
}
function lrFilter(type, genre, el) {
  var parent = type === 'events' ? document.getElementById('lrEventsFilters') : document.getElementById('lrClubsFilters');
  parent.querySelectorAll('.lr-filter-btn').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  var data = type === 'events' ? LR_EVENTS : LR_CLUBS;
  var filtered = genre === 'all' ? data : data.filter(function(d){
    return d.type === genre || d.genre === genre || d.city.toLowerCase() === genre || (genre === 'europe' && ['Serbia','UK','Germany','Spain'].indexOf(d.country) !== -1);
  });
  lrRenderGrid(type, filtered);
}
function lrRenderGrid(type, data) {
  var gridId = type === 'events' ? 'lrEventsGrid' : 'lrClubsGrid';
  var grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  data.forEach(function(item) {
    var card = document.createElement('div');
    card.className = 'lr-card' + (type === 'clubs' ? ' clubs' : '');
    card.onclick = (function(id, t){ return function(){ lrOpenStream(id, t); }; })(item.id, type);
    var priceTag = item.free ? '<span class="lr-tag free">Free</span>' : '<span class="lr-tag ticket">' + item.price + '</span>';
    card.innerHTML = '<div class="lr-card-thumb" style="background:' + item.thumb + ';">'
      + '<div class="lr-card-live-badge"><span class="now-live-dot" style="width:5px;height:5px;"></span> LIVE</div>'
      + '<div class="lr-card-viewers">' + item.viewers.toLocaleString() + ' watching</div>'
      + '<div class="lr-card-play"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>'
      + '</div><div class="lr-card-body">'
      + '<div class="lr-card-title">' + item.title + '</div>'
      + '<div class="lr-card-sub">' + item.artist + '</div>'
      + '<div class="lr-card-tags"><span class="lr-tag genre">' + item.genre + '</span><span class="lr-tag city">' + item.city + '</span>' + priceTag + '</div>'
      + '</div>';
    grid.appendChild(card);
  });
}
function lrOpenStream(id, type) {
  var data = type === 'events' ? LR_EVENTS : LR_CLUBS;
  var item = data.find(function(d){ return d.id === id; });
  if (!item) return;
  document.getElementById('lrStreamTitle').textContent = item.title;
  document.getElementById('lrStreamSub').textContent = item.sub;
  document.getElementById('lrStreamName').textContent = item.title;
  document.getElementById('lrStreamDesc').textContent = item.desc;
  var backBtn = document.getElementById('lrStreamBack');
  backBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg> Back to ' + (type === 'events' ? 'Live Events' : 'Clubs Live');
  backBtn.onclick = function(){ lrStreamClose(); };
  var meta = document.getElementById('lrStreamMeta');
  meta.innerHTML = '<span class="lr-tag genre">' + item.genre + '</span>'
    + '<span class="lr-tag city">' + item.city + ' - ' + item.country + '</span>'
    + (item.free ? '<span class="lr-tag free">Free</span>' : '<span class="lr-tag ticket">' + item.price + '</span>')
    + '<span class="lr-tag" style="background:rgba(200,180,255,0.11);color:var(--muted);">' + item.viewers.toLocaleString() + ' watching</span>';
  var actions = document.getElementById('lrStreamActions');
  actions.innerHTML = '';
  if (!item.free) {
    var b1 = document.createElement('button'); b1.className = 'lr-player-btn primary';
    b1.textContent = 'Watch for ' + item.price;
    b1.onclick = function(){ showToast('Payment coming in full release!'); };
    actions.appendChild(b1);
  }
  if (type === 'clubs') {
    var b2 = document.createElement('button'); b2.className = 'lr-player-btn ghost';
    b2.textContent = 'Get directions';
    b2.onclick = function(){ showToast('Opening maps for ' + item.city + '...'); };
    actions.appendChild(b2);
  }
  var b3 = document.createElement('button'); b3.className = 'lr-player-btn ghost';
  b3.textContent = 'Share stream';
  b3.onclick = function(){ showToast('Link copied!'); };
  actions.appendChild(b3);
  lrInitChat(item.chat);
  document.getElementById('now-sub-lrstream').classList.add('open');
}
function lrStreamClose() {
  document.getElementById('now-sub-lrstream').classList.remove('open');
  if (lrActiveChatInt) { clearInterval(lrActiveChatInt); lrActiveChatInt = null; }
}
function lrInitChat(seed) {
  var msgs = document.getElementById('lrChatMsgs');
  msgs.innerHTML = '';
  seed.forEach(function(m) {
    var d = document.createElement('div'); d.className = 'lr-chat-msg';
    d.innerHTML = '<span class="n">' + m.n + '</span>' + m.m;
    msgs.appendChild(d);
  });
  msgs.scrollTop = msgs.scrollHeight;
  if (lrActiveChatInt) clearInterval(lrActiveChatInt);
  lrActiveChatInt = setInterval(function() {
    if (Math.random() < 0.35) {
      var extras = ['Just joined!','This is fire','Fortis is the future','Watching from far away','Amazing stream quality'];
      var names = ['Fan_42','MusicLover','NightOwl','GlobalFan','StreamFan'];
      var d = document.createElement('div'); d.className = 'lr-chat-msg';
      d.innerHTML = '<span class="n">' + names[Math.floor(Math.random()*names.length)] + '</span>' + extras[Math.floor(Math.random()*extras.length)];
      msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
    }
  }, 4000);
}
function lrChatSend() {
  var inp = document.getElementById('lrChatIn');
  if (!inp || !inp.value.trim()) return;
  var msgs = document.getElementById('lrChatMsgs');
  var d = document.createElement('div'); d.className = 'lr-chat-msg';
  d.innerHTML = '<span class="n" style="color:var(--pink);">You</span>' + inp.value.trim();
  msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; inp.value = '';
}


var LR_EVENTS = [
  {id:'ev1',type:'concert',genre:'electronic',title:'EXIT Festival - Main Stage',sub:'Novi Sad, Serbia',artist:'DJ Nexus + Luna Rivera',viewers:4240,thumb:'linear-gradient(135deg,#0a0030,#1a0060)',city:'Novi Sad',country:'Serbia',free:false,price:'€5',desc:'Europe biggest exit festival streams live exclusively on Fortis. Watch the main stage acts in real time.',chat:[{n:'Marco B.',m:'EXIT is insane this year'},{n:'Sofia L.',m:'DJ Nexus opening set'},{n:'Yuki T.',m:'Watching from Tokyo right now'},{n:'Carlos P.',m:'Stream quality is perfect'}]},
  {id:'ev2',type:'concert',genre:'hiphop',title:'Marcus Wave - Live in Atlanta',sub:'Atlanta, USA',artist:'Marcus Wave',viewers:2180,thumb:'linear-gradient(135deg,#101000,#302000)',city:'Atlanta',country:'USA',free:true,price:'Free',desc:'Marcus Wave performs his debut album Street Psalms live for the first time. Full show, no cuts.',chat:[{n:'Aiden K.',m:'Street Psalms live omg'},{n:'Zara M.',m:'He is incredible live'},{n:'DJ P.',m:'Support real artists'}]},
  {id:'ev3',type:'festival',genre:'electronic',title:'Fabric London - Friday Night',sub:'London, UK',artist:'Various DJs',viewers:3120,thumb:'linear-gradient(135deg,#001030,#002060)',city:'London',country:'UK',free:false,price:'£3',desc:'Fabric London streams their Friday night lineup exclusively on Fortis Music. 4 rooms, all live.',chat:[{n:'Sarah T.',m:'Fabric never disappoints'},{n:'Marco B.',m:'Room 2 is incredible right now'},{n:'Yuki T.',m:'That bass drop!!!'}]},
  {id:'ev4',type:'concert',genre:'rock',title:'The Void - Manchester Arena',sub:'Manchester, UK',artist:'The Void',viewers:5600,thumb:'linear-gradient(135deg,#0a0a0a,#1a1a1a)',city:'Manchester',country:'UK',free:false,price:'£4',desc:'The Void plays their biggest headline show to date at Manchester Arena. Stream live on Fortis.',chat:[{n:'Carlos P.',m:'The Void are UNREAL live'},{n:'Sofia L.',m:'Static Pulse just dropped'},{n:'Priya S.',m:'This crowd energy'}]},
  {id:'ev5',type:'festival',genre:'electronic',title:'Pacha Ibiza - Summer Opener',sub:'Ibiza, Spain',artist:'DJ Pharaoh + Guest',viewers:8900,thumb:'linear-gradient(135deg,#1a0010,#330020)',city:'Ibiza',country:'Spain',free:false,price:'€6',desc:'Pacha Ibiza kicks off the summer season with an exclusive Fortis livestream. First time ever.',chat:[{n:'Marco B.',m:'Pacha on Fortis is historic'},{n:'Aiden K.',m:'That DJ Pharaoh set'},{n:'Zara M.',m:'Ibiza energy through the screen'}]},
  {id:'ev6',type:'concert',genre:'electronic',title:'Womb Tokyo - Saturday Live',sub:'Tokyo, Japan',artist:'Kira Tanaka',viewers:1840,thumb:'linear-gradient(135deg,#001a10,#003020)',city:'Tokyo',country:'Japan',free:true,price:'Free',desc:'Womb Tokyo streams their Saturday night showcase. Featuring Kira Tanaka and the best of Tokyo.',chat:[{n:'Yuki T.',m:'Womb Tokyo represent!'},{n:'Carlos P.',m:'Tokyo scene is insane'}]},
];
var LR_CLUBS = [
  {id:'cl1',type:'techno',genre:'techno',title:'Warehouse 14 - Dubai',sub:'Dubai, UAE',artist:'DJ Echo live',viewers:892,thumb:'linear-gradient(135deg,#0a0015,#1a0030)',city:'Dubai',country:'UAE',free:true,price:'Free',desc:'Warehouse 14 in Dubai streams their Friday night techno session live. Walk-ins welcome after midnight.',chat:[{n:'Priya S.',m:'Warehouse 14 always goes hard'},{n:'Marco B.',m:'Going there tonight after watching this'},{n:'Sofia L.',m:'That DJ Echo set'}]},
  {id:'cl2',type:'house',genre:'house',title:'Club Celsius - Dubai',sub:'Dubai, UAE',artist:'House Night',viewers:445,thumb:'linear-gradient(135deg,#001030,#002050)',city:'Dubai',country:'UAE',free:true,price:'Free',desc:'Club Celsius streams their weekly house night. Check the vibe before you head out tonight.',chat:[{n:'Aiden K.',m:'Celsius vibe is different'},{n:'Carlos P.',m:'Might head there after 1am'}]},
  {id:'cl3',type:'techno',genre:'techno',title:'Plastic Belgrade - Saturday',sub:'Belgrade, Serbia',artist:'Techno Night',viewers:1240,thumb:'linear-gradient(135deg,#0d0818,#1a0020)',city:'Belgrade',country:'Serbia',free:true,price:'Free',desc:'Plastic Belgrade streams live on Fortis every Saturday. One of Europe best techno clubs.',chat:[{n:'Marco B.',m:'Belgrade techno scene is next level'},{n:'Yuki T.',m:'Watching from Japan, need to visit Serbia'},{n:'Sofia L.',m:'Plastic is legendary'}]},
  {id:'cl4',type:'rnb',genre:'rnb',title:'Amber Lounge - Abu Dhabi',sub:'Abu Dhabi, UAE',artist:'R&B Night',viewers:320,thumb:'linear-gradient(135deg,#1a0500,#2a1000)',city:'Abu Dhabi',country:'UAE',free:true,price:'Free',desc:'Amber Lounge Abu Dhabi streams their R&B and soul nights exclusively on Fortis Music.',chat:[{n:'Priya S.',m:'Amber Lounge is so elegant'},{n:'Carlos P.',m:'R&B vibes are perfect tonight'}]},
  {id:'cl5',type:'house',genre:'house',title:'Tresor Berlin - Underground',sub:'Berlin, Germany',artist:'Various Artists',viewers:2100,thumb:'linear-gradient(135deg,#050505,#101010)',city:'Berlin',country:'Germany',free:true,price:'Free',desc:'Tresor Berlin streams a curated window of their legendary underground nights. Only on Fortis.',chat:[{n:'Marco B.',m:'Tresor on Fortis is history'},{n:'Aiden K.',m:'Berlin techno forever'},{n:'Yuki T.',m:'This is why Fortis is different'}]},
  {id:'cl6',type:'house',genre:'house',title:'Pacha Ibiza Bar - Chill',sub:'Ibiza, Spain',artist:'Sunset Sessions',viewers:670,thumb:'linear-gradient(135deg,#1a0010,#2a0020)',city:'Ibiza',country:'Spain',free:true,price:'Free',desc:'Pacha bar area streams the relaxed sunset sessions. Perfect if you are deciding whether to come tonight.',chat:[{n:'Sofia L.',m:'This is the dream vibe'},{n:'Carlos P.',m:'Booking flights to Ibiza rn'}]},
];
var lrActiveType=null,lrActiveChatInt=null;
function lrOpen(type){lrActiveType=type;if(type==='events'){lrRenderGrid('events',LR_EVENTS);document.getElementById('now-sub-lrevents').classList.add('open');}else{lrRenderGrid('clubs',LR_CLUBS);document.getElementById('now-sub-lrclubs').classList.add('open');}}
function lrClose(type){if(type==='events')document.getElementById('now-sub-lrevents').classList.remove('open');else document.getElementById('now-sub-lrclubs').classList.remove('open');}
function lrFilter(type,genre,el){var parent=type==='events'?document.getElementById('lrEventsFilters'):document.getElementById('lrClubsFilters');parent.querySelectorAll('.lr-filter-btn').forEach(function(b){b.classList.remove('active');});el.classList.add('active');var data=type==='events'?LR_EVENTS:LR_CLUBS;var filtered=genre==='all'?data:data.filter(function(d){return d.type===genre||d.genre===genre||d.city.toLowerCase()===genre||(genre==='europe'&&['Serbia','UK','Germany','Spain'].indexOf(d.country)!==-1);});lrRenderGrid(type,filtered);}
function lrRenderGrid(type,data){var gridId=type==='events'?'lrEventsGrid':'lrClubsGrid';var grid=document.getElementById(gridId);if(!grid)return;grid.innerHTML='';data.forEach(function(item){var card=document.createElement('div');card.className='lr-card'+(type==='clubs'?' clubs':'');card.onclick=(function(id,t){return function(){lrOpenStream(id,t);};})(item.id,type);var priceTag=item.free?'<span class="lr-tag free">Free</span>':'<span class="lr-tag ticket">'+item.price+'</span>';card.innerHTML='<div class="lr-card-thumb" style="background:'+item.thumb+';"><div class="lr-card-live-badge"><span class="now-live-dot" style="width:5px;height:5px;"></span> LIVE</div><div class="lr-card-viewers">'+item.viewers.toLocaleString()+' watching</div><div class="lr-card-play"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg></div></div><div class="lr-card-body"><div class="lr-card-title">'+item.title+'</div><div class="lr-card-sub">'+item.artist+'</div><div class="lr-card-tags"><span class="lr-tag genre">'+item.genre+'</span><span class="lr-tag city">'+item.city+'</span>'+priceTag+'</div></div>';grid.appendChild(card);});}
function lrOpenStream(id,type){var data=type==='events'?LR_EVENTS:LR_CLUBS;var item=data.find(function(d){return d.id===id;});if(!item)return;document.getElementById('lrStreamTitle').textContent=item.title;document.getElementById('lrStreamSub').textContent=item.sub;document.getElementById('lrStreamName').textContent=item.title;document.getElementById('lrStreamDesc').textContent=item.desc;var backBtn=document.getElementById('lrStreamBack');backBtn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg> Back to '+(type==='events'?'Live Events':'Clubs Live');backBtn.onclick=function(){lrStreamClose();};var meta=document.getElementById('lrStreamMeta');meta.innerHTML='<span class="lr-tag genre">'+item.genre+'</span><span class="lr-tag city">'+item.city+' - '+item.country+'</span>'+(item.free?'<span class="lr-tag free">Free</span>':'<span class="lr-tag ticket">'+item.price+'</span>')+'<span class="lr-tag" style="background:rgba(200,180,255,0.11);color:var(--muted);">'+item.viewers.toLocaleString()+' watching</span>';var actions=document.getElementById('lrStreamActions');actions.innerHTML='';if(!item.free){var b1=document.createElement('button');b1.className='lr-player-btn primary';b1.textContent='Watch for '+item.price;b1.onclick=function(){showToast('Payment coming in full release!');};actions.appendChild(b1);}if(type==='clubs'){var b2=document.createElement('button');b2.className='lr-player-btn ghost';b2.textContent='Get directions';b2.onclick=function(){showToast('Opening maps for '+item.city+'...');};actions.appendChild(b2);}var b3=document.createElement('button');b3.className='lr-player-btn ghost';b3.textContent='Share stream';b3.onclick=function(){showToast('Link copied!');};actions.appendChild(b3);lrInitChat(item.chat);document.getElementById('now-sub-lrstream').classList.add('open');}
function lrStreamClose(){document.getElementById('now-sub-lrstream').classList.remove('open');if(lrActiveChatInt){clearInterval(lrActiveChatInt);lrActiveChatInt=null;}}
function lrInitChat(seed){var msgs=document.getElementById('lrChatMsgs');msgs.innerHTML='';seed.forEach(function(m){var d=document.createElement('div');d.className='lr-chat-msg';d.innerHTML='<span class="n">'+m.n+'</span>'+m.m;msgs.appendChild(d);});msgs.scrollTop=msgs.scrollHeight;if(lrActiveChatInt)clearInterval(lrActiveChatInt);lrActiveChatInt=setInterval(function(){if(Math.random()<0.35){var ex=['Just joined!','This is fire','Fortis is the future','Watching from far away','Amazing stream quality'];var ns=['Fan_42','MusicLover','NightOwl','GlobalFan','StreamFan'];var d=document.createElement('div');d.className='lr-chat-msg';d.innerHTML='<span class="n">'+ns[Math.floor(Math.random()*ns.length)]+'</span>'+ex[Math.floor(Math.random()*ex.length)];msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}},4000);}
function lrChatSend(){var inp=document.getElementById('lrChatIn');if(!inp||!inp.value.trim())return;var msgs=document.getElementById('lrChatMsgs');var d=document.createElement('div');d.className='lr-chat-msg';d.innerHTML='<span class="n" style="color:var(--pink);">You</span>'+inp.value.trim();msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;inp.value='';}




// Auto-detect country/city
(function() {
  fetch('https://ipapi.co/json/')
    .then(function(r){ return r.json(); })
    .then(function(d) {
      var c = document.getElementById('fpCountry');
      var ci = document.getElementById('fpCity');
      if (c && d.country_name) c.value = d.country_name;
      if (ci && d.city) ci.value = d.city;
    }).catch(function(){});
})();

// ══ CONTACT ROLE TABS ══
var _contactRole = 'investor';
var _contactRoleConfig = {
  investor: { hint: '<strong style="color:#C8A97E;">Investors:</strong> Tell us about your thesis and we\'ll share our deck &amp; traction data.', extraLabel: 'Fund / Organization', extraPlaceholder: 'e.g. Sequoia Capital, Angel', accentColor: '#C8A97E', bgColor: 'rgba(200,169,126,0.06)', borderColor: 'rgba(200,169,126,0.18)' },
  artist:   { hint: '<strong style="color:#E91E8C;">Artists:</strong> Tell us about your music and we\'ll show you how Fortis can protect your rights.', extraLabel: 'Genre / Stage Name', extraPlaceholder: 'e.g. Electronic, Luna Rivera', accentColor: '#E91E8C', bgColor: 'rgba(233,30,140,0.06)', borderColor: 'rgba(233,30,140,0.18)' },
  partner:  { hint: '<strong style="color:#A06EFF;">Partners:</strong> Interested in integrating Fortis detection into your platform? Let\'s talk API.', extraLabel: 'Company / Platform', extraPlaceholder: 'e.g. SoundCloud, Spotify', accentColor: '#A06EFF', bgColor: 'rgba(123,47,255,0.06)', borderColor: 'rgba(123,47,255,0.18)' },
  press:    { hint: '<strong style="color:#00E676;">Press:</strong> Working on a story about music rights or Web3? We\'d love to connect.', extraLabel: 'Publication / Media', extraPlaceholder: 'e.g. TechCrunch, Rolling Stone', accentColor: '#00E676', bgColor: 'rgba(0,230,118,0.06)', borderColor: 'rgba(0,230,118,0.18)' },
  other:    { hint: '<strong style="color:rgba(200,180,255,0.8);">Hey there:</strong> Doesn\'t matter what brings you — just say hello.', extraLabel: 'Subject', extraPlaceholder: 'What\'s this about?', accentColor: 'rgba(200,180,255,0.6)', bgColor: 'rgba(200,180,255,0.04)', borderColor: 'rgba(200,180,255,0.15)' }
};

function setContactRole(role) {
  _contactRole = role;
  var cfg = _contactRoleConfig[role];
  var hint = document.getElementById('contact-hint');
  if (hint) { hint.innerHTML = cfg.hint; hint.style.background = cfg.bgColor; hint.style.borderColor = cfg.borderColor; }
  var extraLabel = document.querySelector('#contact-extra label');
  var extraInput = document.getElementById('contact-extra-input');
  if (extraLabel) extraLabel.textContent = cfg.extraLabel;
  if (extraInput) extraInput.placeholder = cfg.extraPlaceholder;
  var rh = document.getElementById('contact-role-hidden');
  if (rh) rh.value = role;
  ['investor','artist','partner','press','other'].forEach(function(r) {
    var b = document.getElementById('crb-' + r);
    if (!b) return;
    b.style.cssText = r === role
      ? 'padding:8px 18px;border-radius:16px;border:1px solid ' + cfg.accentColor + ';background:' + cfg.bgColor + ';color:' + cfg.accentColor + ';font-size:0.82rem;font-weight:600;cursor:pointer;'
      : 'padding:8px 18px;border-radius:16px;border:1px solid rgba(200,180,255,0.12);background:transparent;color:rgba(200,180,255,0.55);font-size:0.82rem;font-weight:600;cursor:pointer;';
  });
}

function handleNetlifySubmit(e) {
  e.preventDefault();
  var form = document.getElementById('netlify-contact-form');
  var email = (document.getElementById('contact-email') || {}).value || '';
  var btn = document.getElementById('contact-submit-btn');
  if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
  var rh = document.getElementById('contact-role-hidden');
  if (rh) rh.value = _contactRole;
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(new FormData(form)).toString()
  }).then(function() {
    var s = document.getElementById('contact-sent-email');
    if (s) s.textContent = email;
    var ok = document.getElementById('contact-success');
    if (ok) ok.style.display = 'block';
    form.reset();
    if (btn) { btn.textContent = 'Send Message →'; btn.disabled = false; }
  }).catch(function() {
    showToast('Could not send. Try emailing us directly at info@fortismusic.co');
    if (btn) { btn.textContent = 'Send Message →'; btn.disabled = false; }
  });
}




/* ================================================================
   SECTION BREAK
   ================================================================ */

!function(){var e=document.getElementById('fortis-email-link'),m=['info','@','fortismusic','.','co'].join('');if(e){e.textContent=m;e.onclick=function(){window.location.href='mailto:'+m;};}}();

/* ================================================================
   SECTION BREAK
   ================================================================ */


// FLOATING PANEL - runs after full DOM is loaded
window.addEventListener('load', function() {
  var p = document.getElementById('floatPanel');
  var t = document.getElementById('floatTab');
  if (!p) { console.log('floatPanel not found'); return; }
  console.log('floatPanel found, showing in 3s');
  setTimeout(function() {
    p.classList.add('visible');
    p.classList.remove('hidden');
    if (t) t.style.display = 'none';
    console.log('floatPanel shown');
  }, 3000);
});

function floatShow() {
  var p = document.getElementById('floatPanel');
  var t = document.getElementById('floatTab');
  if (!p) return;
  p.classList.add('visible');
  p.classList.remove('hidden');
  if (t) t.style.display = 'none';
}

function floatHide() {
  var p = document.getElementById('floatPanel');
  var t = document.getElementById('floatTab');
  if (!p) return;
  p.classList.add('hidden');
  p.classList.remove('visible');
  setTimeout(function() {
    if (t && !localStorage.getItem('fm_access')) t.style.display = 'block';
  }, 400);
}

var STUDIO_DB = [
  { id:'s1', name:'Warehouse Sound Dubai', city:'Dubai', country:'UAE', type:'Recording Studio', rate:120, rating:4.9, reviews:84, img:'🎙️', tags:['Pro Tools','SSL Console','Live Room','Vocal Booth'], desc:'Top-tier recording facility in Dubai with Neve 8078 console, live room for full bands, and world-class acoustics.', gear:['Neve 8078','Pro Tools HDX','Neumann U87','SSL G Bus Compressor','Yamaha C7 Grand Piano'], genres:['Electronic','Hip-Hop','Pop','R&B'], video:'https://www.youtube.com/embed/dQw4w9WgXcQ', booked:312, verified:true },
  { id:'s2', name:'Studio 44 Belgrade', city:'Belgrade', country:'Serbia', type:'Recording Studio', rate:45, rating:4.8, reviews:127, img:'🎚️', tags:['Analog','Vintage Gear','Live Room','Mixing'], desc:'Belgrade iconic studio. Founded in 1994, home to hundreds of regional hits. Full analog signal chain available.', gear:['SSL 4000E','Studer A80 Tape Machine','AKG C414','Eventide H3000','Moog Minimoog'], genres:['Rock','Electronic','Folk','Jazz'], video:'https://www.youtube.com/embed/9bZkp7q19f0', booked:489, verified:true },
  { id:'s3', name:'Crystal Clear LA', city:'Los Angeles', country:'USA', type:'Mix & Master', rate:250, rating:5.0, reviews:56, img:'🔊', tags:['Mastering','Atmos','Remote Sessions','Grammy Engineers'], desc:'Grammy-winning mastering studio specialising in Dolby Atmos and spatial audio. Remote sessions available worldwide.', gear:['Studer A800','Manley Vari-Mu','Prism Dream ADA-128','Neve 33609','API 2500'], genres:['All Genres','Spatial Audio','Film','Pop'], video:null, booked:201, verified:true },
  { id:'s4', name:'Abu Dhabi Media Hub', city:'Abu Dhabi', country:'UAE', type:'Film Scoring', rate:90, rating:4.7, reviews:43, img:'🎤', tags:['Film Scoring','Orchestra','Podcast','TV'], desc:'State-of-the-art facility for film and TV scoring. Full orchestral recording with 60-piece capacity.', gear:['Pro Tools S6','Vienna Symphonic Library','Neve 8078','AVID S6L','Yamaha Disklavier'], genres:['Film','Classical','Electronic','World'], video:'https://www.youtube.com/embed/dQw4w9WgXcQ', booked:98, verified:true },
  { id:'s5', name:'Pulse Studio Berlin', city:'Berlin', country:'Germany', type:'Rehearsal Space', rate:30, rating:4.6, reviews:215, img:'🥁', tags:['Band Rehearsal','24hr Access','Backline','Storage'], desc:'Berlin favourite rehearsal complex with 12 fully equipped rooms, 24-hour access, and full backline available.', gear:['Pearl Drums','Marshall JCM900','Fender Twin Reverb','DW Kit','Roland SPD'], genres:['Rock','Metal','Electronic','Jazz'], video:null, booked:1240, verified:false },
  { id:'s6', name:'Sonic Temple London', city:'London', country:'UK', type:'Recording Studio', rate:180, rating:4.9, reviews:91, img:'🎹', tags:['SSL','Pro Tools','Neve','Vintage Synths'], desc:'Central London recording studio with an unmatched vintage synth collection. Favoured by UK electronic and indie artists.', gear:['SSL 9000XL','Moog Modular','ARP 2600','Buchla 200','Steinway Model D'], genres:['Electronic','Indie','Pop','Ambient'], video:'https://www.youtube.com/embed/9bZkp7q19f0', booked:374, verified:true },
  { id:'s7', name:'Tokyo Sound Lab', city:'Tokyo', country:'Japan', type:'Mix & Master', rate:160, rating:4.8, reviews:67, img:'🎵', tags:['Japanese Mastering','Hi-Fi','Vinyl Cutting','J-Pop'], desc:'Precision mastering studio in Tokyo, renowned for immaculate detail and finest vinyl cutting in Asia.', gear:['Westrex Lathe','Sontec MEP-250C','GML 8200','Ampex ATR-102','Crane Song Hedd'], genres:['J-Pop','Electronic','Classical','Jazz'], video:null, booked:156, verified:true },
  { id:'s8', name:'Studio Mixx Paris', city:'Paris', country:'France', type:'Recording Studio', rate:140, rating:4.7, reviews:38, img:'🎸', tags:['Neve','Grand Piano','Vocal Booth','Live Room'], desc:'Parisian studio known for exceptional acoustic design and warm analogue sound. Preferred by classical and jazz artists.', gear:['Neve 8078','Fazioli F308','Neumann M149','Pultec EQP-1A','Universal Audio 1176'], genres:['Jazz','Classical','French Pop','World'], video:null, booked:89, verified:true }
];

var studioFilters = { search:'', country:'', city:'', type:'', budget:'', sort:'Best Rated' };

function renderStudioCards() {
  var grid = document.getElementById('studioGrid');
  var count = document.getElementById('studioCount');
  if (!grid) return;
  var db = STUDIO_DB;
  var filtered = db.filter(function(s) {
    if (studioFilters.search && !(s.name+s.city+s.tags.join(' ')).toLowerCase().includes(studioFilters.search.toLowerCase())) return false;
    if (studioFilters.country && s.country !== studioFilters.country) return false;
    if (studioFilters.city && s.city !== studioFilters.city) return false;
    if (studioFilters.type && s.type !== studioFilters.type) return false;
    if (studioFilters.budget) {
      var p = studioFilters.budget;
      if (p==='0-50' && s.rate>=50) return false;
      if (p==='50-150' && (s.rate<50||s.rate>=150)) return false;
      if (p==='150-500' && (s.rate<150||s.rate>=500)) return false;
      if (p==='500+' && s.rate<500) return false;
    }
    return true;
  });
  if (studioFilters.sort==='Price: Low to High') filtered.sort(function(a,b){return a.rate-b.rate;});
  else if (studioFilters.sort==='Price: High to Low') filtered.sort(function(a,b){return b.rate-a.rate;});
  else if (studioFilters.sort==='Most Booked') filtered.sort(function(a,b){return b.booked-a.booked;});
  else filtered.sort(function(a,b){return b.rating-a.rating;});
  if (count) count.textContent = filtered.length;
  grid.innerHTML = '';
  filtered.forEach(function(s) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;overflow:hidden;cursor:pointer;transition:border-color 0.2s;';
    var tags = s.tags.slice(0,3).map(function(t){
      return '<span style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.15);color:rgba(200,180,255,0.72);padding:2px 8px;border-radius:2px;font-size:0.68rem;">'+t+'</span>';
    }).join('');
    var badge = s.verified ? '<span style="background:rgba(0,230,118,0.08);border:1px solid rgba(0,230,118,0.2);color:#00E676;padding:2px 7px;border-radius:2px;font-size:0.6rem;font-weight:700;">OK</span>' : '';
    card.innerHTML = '<div style="background:rgba(233,30,140,0.06);padding:28px;text-align:center;font-size:2.5rem;">'+s.img+'</div>'
      + '<div style="padding:16px;">'
      + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px;"><div style="font-weight:700;font-size:0.92rem;">'+s.name+'</div>'+badge+'</div>'
      + '<div style="font-size:0.75rem;color:rgba(200,180,255,0.58);margin-bottom:10px;">'+s.city+', '+s.country+' | '+s.type+'</div>'
      + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">'+tags+'</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;">'
      + '<div style="font-size:0.78rem;color:rgba(200,180,255,0.58);">'+s.rating+' ('+s.reviews+')</div>'
      + '<div style="font-size:0.88rem;font-weight:700;color:#E91E8C;">EUR '+s.rate+'/hr</div>'
      + '</div></div>';
    card.addEventListener('mouseover', function(){ this.style.borderColor='rgba(233,30,140,0.3)'; });
    card.addEventListener('mouseout', function(){ this.style.borderColor='rgba(200,180,255,0.13)'; });
    (function(sid){ card.addEventListener('click', function(){ openStudio(sid); }); })(s.id);
    grid.appendChild(card);
  });
}

function filterStudios() {
  studioFilters.search = (document.getElementById('studioSearch')||{value:''}).value;
  studioFilters.country = (document.getElementById('studioCountry')||{value:''}).value;
  studioFilters.city = (document.getElementById('studioCity')||{value:''}).value;
  studioFilters.type = (document.getElementById('studioType')||{value:''}).value;
  studioFilters.budget = (document.getElementById('studioBudget')||{value:''}).value;
  studioFilters.sort = (document.getElementById('studioSort')||{value:'Best Rated'}).value;
  renderStudioCards();
}

function clearStudioFilters() {
  studioFilters = { search:'', country:'', city:'', type:'', budget:'', sort:'Best Rated' };
  ['studioSearch','studioCountry','studioCity','studioType','studioBudget','studioSort'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.value = '';
  });
  renderStudioCards();
}

function quickStudioFilter(type) {
  studioFilters.type = type;
  var sel = document.getElementById('studioType'); if (sel) sel.value = type;
  renderStudioCards();
}

function openStudio(id) {
  var s = STUDIO_DB.find(function(x){ return x.id===id; });
  if (!s) return;
  var detail = document.getElementById('studioDetail');
  var grid = document.getElementById('studioGrid');
  if (!detail || !grid) return;
  grid.style.display = 'none';
  detail.style.display = 'block';
  // Scroll to top of detail
  detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  var gearTags = s.gear.map(function(g){ return '<span style="background:rgba(200,180,255,0.07);border:1px solid rgba(255,255,255,0.08);padding:5px 12px;border-radius:2px;font-size:0.78rem;color:rgba(200,180,255,0.72);">'+g+'</span>'; }).join('');
  var genreTags = s.genres.map(function(g){ return '<span style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.15);padding:4px 12px;border-radius:2px;font-size:0.78rem;color:rgba(200,180,255,0.72);">'+g+'</span>'; }).join('');
  var tagPills = s.tags.map(function(t){ return '<span style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.15);color:rgba(200,180,255,0.72);padding:3px 10px;border-radius:2px;font-size:0.7rem;">'+t+'</span>'; }).join('');
  var videoHtml = s.video ? '<div style="position:relative;padding-bottom:56.25%;height:0;margin-bottom:16px;border-radius:4px;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="'+s.video+'?rel=0&modestbranding=1" allowfullscreen loading="lazy"></iframe></div>' : '';
  detail.innerHTML =
    '<button id="studioBackBtn" style="display:flex;align-items:center;gap:6px;margin-bottom:24px;padding:8px 16px;background:transparent;border:1px solid rgba(123,47,255,0.28);color:rgba(200,180,255,0.72);border-radius:16px;cursor:pointer;font-size:0.82rem;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>'
    + 'Back to Studios</button>'
    + '<div style="display:grid;grid-template-columns:1fr 320px;gap:24px;" class="studio-detail-grid">'
    + '<div>'
    + '<div style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.1);border-radius:16px;padding:40px;text-align:center;font-size:4rem;margin-bottom:16px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'+s.img+'</div>'
    + videoHtml
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;margin-bottom:16px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:12px;">About</div><p style="font-size:0.88rem;color:rgba(255,255,255,0.6);line-height:1.75;">'+s.desc+'</p></div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;margin-bottom:16px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:14px;">Equipment</div><div style="display:flex;flex-wrap:wrap;gap:8px;">'+gearTags+'</div></div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:14px;">Genres</div><div style="display:flex;flex-wrap:wrap;gap:8px;">'+genreTags+'</div></div>'
    + '</div>'
    + '<div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;margin-bottom:14px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<h2 style="font-size:1.3rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:4px;">'+s.name+'</h2>'
    + '<div style="font-size:0.78rem;color:rgba(200,180,255,0.58);margin-bottom:16px;">'+s.city+', '+s.country+'</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(200,180,255,0.11);border-radius:4px;overflow:hidden;margin-bottom:16px;">'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#E91E8C;">EUR '+s.rate+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Per Hour</div></div>'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#fff;">'+s.rating+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Rating</div></div>'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#fff;">'+s.reviews+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Reviews</div></div>'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#00E676;">'+s.booked+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Booked</div></div>'
    + '</div>'
    + '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">'+tagPills+'</div>'
    + '<button id="studioBookBtn" style="width:100%;padding:12px;background:linear-gradient(135deg,#E91E8C,#7B2FFF);border:none;color:#fff;border-radius:16px;font-size:0.88rem;font-weight:700;cursor:pointer;margin-bottom:8px;">Book a Session</button>'
    + '<button id="studioEnqBtn" style="width:100%;padding:10px;background:transparent;border:1px solid rgba(123,47,255,0.28);color:rgba(200,180,255,0.62);border-radius:16px;font-size:0.82rem;cursor:pointer;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">Send Enquiry</button>'
    + '</div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:18px;margin-top:14px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:12px;">Opening Hours</div><div style="font-size:0.82rem;color:rgba(255,255,255,0.4);line-height:1.8;">Mon - Fri: 9:00 - 22:00<br>Saturday: 10:00 - 20:00<br>Sunday: By appointment</div></div>'
    + '</div></div>';
  document.getElementById('studioBackBtn').onclick = closeStudio;
  document.getElementById('studioBookBtn').onclick = function(){ showToast('Booking request sent to ' + s.name + '!'); };
  document.getElementById('studioEnqBtn').onclick = function(){ showToast('Enquiry sent!'); };
}

function closeStudio() {
  document.getElementById('studioDetail').style.display = 'none';
  var grid = document.getElementById('studioGrid');
  grid.style.display = '';
  window.scrollTo(0, 0);
}


var DANCE_DB = [
  { id:'d1', name:'Struktura Dance Company', city:'Belgrade', country:'Serbia', type:'Contemporary', members:24, founded:2008, rating:4.9, reviews:112, img:'💃', tags:['Contemporary','Breakdance','Hip-Hop'], desc:'One of the most celebrated contemporary dance companies in the Balkans. Known for powerful storytelling through movement, merging classical technique with urban street styles.', styles:['Contemporary','Breakdance','Hip-Hop','Jazz'], achievements:['National Dance Award 2022','EXIT Festival Residency','European Tour 2023'], video:'https://www.youtube.com/embed/dQw4w9WgXcQ', booked:89, verified:true, contact:'info@struktura.rs' },
  { id:'d2', name:'Dubai Move Studio', city:'Dubai', country:'UAE', type:'Dance Club', members:180, founded:2015, rating:4.8, reviews:204, img:'🕺', tags:['Hip-Hop','Salsa','Bachata','Kizomba'], desc:'Dubai top urban dance club with world-class instructors and weekly social dance nights. Open to all levels from beginners to professionals.', styles:['Hip-Hop','Salsa','Bachata','Kizomba','Dancehall'], achievements:['Best Dance Club UAE 2023','World Salsa Championship Qualifiers','10,000+ Students Trained'], video:'https://www.youtube.com/embed/9bZkp7q19f0', booked:340, verified:true, contact:'hello@dubaimove.ae' },
  { id:'d3', name:'Red Bull Dance Academy', city:'London', country:'UK', type:'Street Dance', members:60, founded:2010, rating:5.0, reviews:87, img:'🔥', tags:['Breakdance','Popping','Locking','Waacking'], desc:'Elite street dance academy producing world-class breakers and freestyle artists. Home to multiple UK and European b-boy champions.', styles:['Breakdance','Popping','Locking','Waacking','House'], achievements:['UK B-Boy Championships x4','Battle of the Year Finalists','Red Bull BC One Participants'], video:'https://www.youtube.com/embed/dQw4w9WgXcQ', booked:156, verified:true, contact:'academy@redbulldance.co.uk' },
  { id:'d4', name:'Kompania Koreografska Novi Sad', city:'Novi Sad', country:'Serbia', type:'Ballet & Contemporary', members:18, founded:1998, rating:4.7, reviews:63, img:'🩰', tags:['Ballet','Contemporary','Modern'], desc:'Prestigious dance company based in Novi Sad with over 25 years of performance history. Blending classical ballet with modern European contemporary dance.', styles:['Ballet','Contemporary','Modern','Neo-Classical'], achievements:['Sterijino Pozorje Award','International Festival Ljubljana','Co-production with Vienna Opera'], video:null, booked:44, verified:true, contact:'kompanija@kcns.org' },
  { id:'d5', name:'Tokyo Urban Crew', city:'Tokyo', country:'Japan', type:'Street Dance', members:35, founded:2012, rating:4.9, reviews:143, img:'⚡', tags:['Hip-Hop','Popping','Locking','Waacking'], desc:'Tokyo leading street dance collective, merging Japanese precision with American hip-hop culture. Regular performers at major music festivals and brand campaigns.', styles:['Hip-Hop','Popping','Locking','Waacking','Krump'], achievements:['World Hip-Hop Dance Championship Finalists','Fuji Rock Performance','Nike Campaign 2024'], video:'https://www.youtube.com/embed/9bZkp7q19f0', booked:211, verified:true, contact:'crew@tokyourban.jp' },
  { id:'d6', name:'Flamenco Vivo Madrid', city:'Madrid', country:'Spain', type:'Flamenco', members:12, founded:2003, rating:4.9, reviews:78, img:'🌹', tags:['Flamenco','Spanish Dance','Traditional'], desc:'Authentic flamenco company founded in the heart of Madrid. Preserving traditional Andalusian flamenco while bringing it to international stages.', styles:['Flamenco','Spanish Dance','Sevillanas','Bulerias'], achievements:['Premio Nacional de Danza','Sadlers Wells London Residency','Cervantes Institute Tour'], video:null, booked:67, verified:true, contact:'tablao@flamencovivo.es' },
  { id:'d7', name:'Afrobeat Dance Collective', city:'Lagos', country:'Nigeria', type:'Afrobeats', members:22, founded:2017, rating:4.8, reviews:95, img:'🎵', tags:['Afrobeats','Afrohouse','Amapiano'], desc:'West Africa leading dance collective specialising in Afrobeats, Afrohouse and Amapiano movement. Available for workshops, performances and international collaborations.', styles:['Afrobeats','Afrohouse','Amapiano','Azonto'], achievements:['Afronation Festival Performers','Nike Africa Campaign','European Workshop Tour 2024'], video:'https://www.youtube.com/embed/dQw4w9WgXcQ', booked:128, verified:false, contact:'collective@afrobeatdance.ng' },
  { id:'d8', name:'Breakin Berlin', city:'Berlin', country:'Germany', type:'Breakdance', members:40, founded:2006, rating:4.7, reviews:119, img:'🎤', tags:['Breakdance','Freestyle','Battle'], desc:'Berlin underground b-boy culture collective. Organising weekly battles, workshops and international events. One of the oldest active breakdance communities in Germany.', styles:['Breakdance','Toprock','Footwork','Power Moves'], achievements:['Battle of the Year Organisers','Red Bull BC One Qualifier','Breakin Berlin Annual Event'], video:'https://www.youtube.com/embed/9bZkp7q19f0', booked:178, verified:true, contact:'info@breakinberlin.de' }
];

var danceFilters = { search:'', country:'', city:'', type:'', sort:'Best Rated' };

function renderDanceCards() {
  var grid = document.getElementById('danceGrid');
  var count = document.getElementById('danceCount');
  if (!grid) return;
  var filtered = DANCE_DB.filter(function(s) {
    if (danceFilters.search && !(s.name+s.city+s.tags.join(' ')).toLowerCase().includes(danceFilters.search.toLowerCase())) return false;
    if (danceFilters.country && s.country !== danceFilters.country) return false;
    if (danceFilters.city && s.city !== danceFilters.city) return false;
    if (danceFilters.type && s.type !== danceFilters.type) return false;
    return true;
  });
  if (danceFilters.sort==='Most Members') filtered.sort(function(a,b){return b.members-a.members;});
  else if (danceFilters.sort==='Newest') filtered.sort(function(a,b){return b.founded-a.founded;});
  else if (danceFilters.sort==='Most Booked') filtered.sort(function(a,b){return b.booked-a.booked;});
  else filtered.sort(function(a,b){return b.rating-a.rating;});
  if (count) count.textContent = filtered.length;
  grid.innerHTML = '';
  filtered.forEach(function(s) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;overflow:hidden;cursor:pointer;transition:border-color 0.2s;';
    var tags = s.tags.slice(0,3).map(function(t){
      return '<span style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.15);color:rgba(200,180,255,0.72);padding:2px 8px;border-radius:2px;font-size:0.68rem;">'+t+'</span>';
    }).join('');
    var badge = s.verified ? '<span style="background:rgba(0,230,118,0.08);border:1px solid rgba(0,230,118,0.2);color:#00E676;padding:2px 7px;border-radius:2px;font-size:0.6rem;font-weight:700;">OK</span>' : '';
    card.innerHTML = '<div style="background:rgba(233,30,140,0.06);padding:28px;text-align:center;font-size:2.5rem;">'+s.img+'</div>'
      + '<div style="padding:16px;">'
      + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px;"><div style="font-weight:700;font-size:0.92rem;">'+s.name+'</div>'+badge+'</div>'
      + '<div style="font-size:0.75rem;color:rgba(200,180,255,0.58);margin-bottom:10px;">'+s.city+', '+s.country+' | '+s.type+'</div>'
      + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">'+tags+'</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;">'
      + '<div style="font-size:0.78rem;color:rgba(200,180,255,0.58);">'+s.rating+' ('+s.reviews+') | '+s.members+' members</div>'
      + '</div></div>';
    card.addEventListener('mouseover', function(){ this.style.borderColor='rgba(233,30,140,0.3)'; });
    card.addEventListener('mouseout', function(){ this.style.borderColor='rgba(200,180,255,0.13)'; });
    (function(sid){ card.addEventListener('click', function(){ openDance(sid); }); })(s.id);
    grid.appendChild(card);
  });
}

// ── VIDEO COLLAB WAVE BARS ──
(function initCvWaves() {
  function buildWave(id, count) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var b = document.createElement('div');
      b.className = 'cv-wave-bar';
      var h = Math.floor(Math.random() * 20) + 6;
      b.style.cssText = '--h:' + h + 'px; animation-delay:' + (i * 0.07) + 's; animation-duration:' + (0.4 + Math.random() * 0.4) + 's;';
      el.appendChild(b);
    }
  }
  function init() {
    ['cvWave1','cvWave2','cvWave3','cvWave1b','cvWave2b','cvWave3b'].forEach(function(id) {
      buildWave(id, 18);
    });
    // re-randomize heights every 2s for liveness
    setInterval(function() {
      ['cvWave1','cvWave2','cvWave3','cvWave1b','cvWave2b','cvWave3b'].forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.querySelectorAll('.cv-wave-bar').forEach(function(b) {
          var h = Math.floor(Math.random() * 22) + 4;
          b.style.setProperty('--h', h + 'px');
        });
      });
    }, 2000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// ── ARTIST LIVE ROOM ──
var LR_ROOMS = [
  { id:'luna', artist:'Luna Rivera', av:'LR', avColor:'linear-gradient(135deg,#E91E8C,#7B2FFF)', bg:'linear-gradient(135deg,#300010,#660033)', genre:'Indie Pop', type:'talk', tags:['Indie Pop','Singer-Songwriter','New Tracks'], desc:'Luna talking about her creative process and sharing new Fortis finds. Guest: DJ Nexus tonight!', viewers:312, live:true, guest:'DJ Nexus', location:'Dubai', country:'UAE' },
  { id:'djnexus', artist:'DJ Nexus', av:'DN', avColor:'linear-gradient(135deg,#00E676,#009688)', bg:'linear-gradient(135deg,#001a30,#003366)', genre:'House', type:'music', tags:['House','Electronic','Live Set'], desc:'Live DJ set with commentary — playing tracks he discovered on Fortis this week.', viewers:445, live:true, guest:null, location:'London', country:'UK' },
  { id:'aidenk', artist:'Aiden K.', av:'AK', avColor:'linear-gradient(135deg,#FFD700,#FF8C00)', bg:'linear-gradient(135deg,#0d1a0d,#1a2e0a)', genre:'Ambient', type:'music', tags:['Ambient','Piano','Instrumental'], desc:'Sharing ambient tracks that inspire his composing sessions. Chill vibes only.', viewers:88, live:true, guest:null, location:'Berlin', country:'Germany' },
  { id:'mariasol', artist:'Maria Sol', av:'MS', avColor:'linear-gradient(135deg,#FF6B9D,#C44569)', bg:'linear-gradient(135deg,#1a0030,#3d0066)', genre:'R&B', type:'talk', tags:['R&B','Soul','Vocals'], desc:'Q&A session with fans + playing unreleased demos. Raise your hand to chat live!', viewers:201, live:true, guest:'Aiden K.', location:'Madrid', country:'Spain' },
  { id:'kofi', artist:'Kofi A.', av:'KA', avColor:'linear-gradient(135deg,#FFD700,#FF6B00)', bg:'linear-gradient(135deg,#1a1000,#332200)', genre:'Afrobeats', type:'guest', tags:['Afrobeats','Percussion','World'], desc:'Kofi and special guest talking about the African music scene and upcoming collabs on Fortis.', viewers:176, live:true, guest:'Luna Rivera', location:'Lagos', country:'Nigeria' },
  { id:'yelena', artist:'Yelena V.', av:'YV', avColor:'linear-gradient(135deg,#7B2FFF,#4B0082)', bg:'linear-gradient(135deg,#0a0020,#200040)', genre:'Jazz', type:'talk', tags:['Jazz','Neo-Soul','Live'], desc:'Jazz improvisation meets storytelling. Yelena shares stories behind each track she plays.', viewers:134, live:false, guest:null, location:'Paris', country:'France' },
  { id:'marcus', artist:'Marcus D.', av:'MD', avColor:'linear-gradient(135deg,#00BCD4,#0097A7)', bg:'linear-gradient(135deg,#001a1a,#003333)', genre:'Hip-Hop', type:'music', tags:['Hip-Hop','Trap','Producer'], desc:'Beat showcase — Marcus plays beats he made this week and takes requests from chat.', viewers:289, live:true, guest:null, location:'Atlanta', country:'USA' },
  { id:'siya', artist:'Siya K.', av:'SK', avColor:'linear-gradient(135deg,#E91E8C,#FF5722)', bg:'linear-gradient(135deg,#1a0010,#330020)', genre:'Indie Pop', type:'guest', tags:['Indie','Folk','Acoustic'], desc:'Acoustic session with a surprise guest drop-in. Very intimate, very real.', viewers:97, live:false, guest:'Marcus D.', location:'Cape Town', country:'South Africa' },
  { id:'devika', artist:'Devika R.', av:'DR', avColor:'linear-gradient(135deg,#9C27B0,#673AB7)', bg:'linear-gradient(135deg,#0d000d,#1a0033)', genre:'Electronic', type:'music', tags:['Electronic','Fusion','Experimental'], desc:'Devika mixing Eastern classical elements with electronic production — live demo.', viewers:223, live:true, guest:null, location:'Mumbai', country:'India' },
];

var lrActiveType = 'all';
var lrSelectedDonate = 1;
var lrActiveRoom = null;

var LR_CHATS = [
  { user:'Ana S.', msg:'This is so good!!', tip:null },
  { user:'Jonas P.', msg:'Luna your voice is 🔥', tip:null },
  { user:'Fatima O.', msg:'Sent a tip! Love this session', tip:'€3' },
  { user:'Marko K.', msg:'DJ Nexus on the guest slot yesss', tip:null },
  { user:'Priya M.', msg:'How did you two meet?', tip:null },
  { user:'Ali B.', msg:'Playing this track rn', tip:'€1' },
];

function lrFilter(val) {
  var search = (val || document.getElementById('lrSearch').value || '').toLowerCase();
  var genre = (document.getElementById('lrGenreFilter').value || '').toLowerCase();
  var country = (document.getElementById('lrCountryFilter').value || '').toLowerCase();
  var sort = (document.getElementById('lrSortFilter').value || 'viewers');
  renderLrGrid(search, genre, country, sort, lrActiveType);
}

function lrSetType(type, el) {
  lrActiveType = type;
  document.querySelectorAll('.lr-filter-tag').forEach(function(b){ b.classList.remove('active'); });
  if (el) el.classList.add('active');
  lrFilter();
}

function renderLrGrid(search, genre, country, sort, type) {
  var grid = document.getElementById('lrGrid');
  if (!grid) return;
  var rooms = LR_ROOMS.filter(function(r) {
    if (search && !(r.artist + r.genre + r.tags.join(' ') + r.location + r.country).toLowerCase().includes(search)) return false;
    if (genre && r.genre.toLowerCase() !== genre) return false;
    if (country && r.country.toLowerCase() !== country) return false;
    if (type === 'live' && !r.live) return false;
    if (type === 'talk' && r.type !== 'talk') return false;
    if (type === 'music' && r.type !== 'music') return false;
    if (type === 'guest' && !r.guest) return false;
    return true;
  });
  if (sort === 'viewers') rooms.sort(function(a,b){ return b.viewers - a.viewers; });
  else if (sort === 'new') rooms.sort(function(a,b){ return (b.live?1:0)-(a.live?1:0); });

  grid.innerHTML = '';
  rooms.forEach(function(r) {
    var tags = r.tags.map(function(t){ return '<span class="lr-card-tag">'+t+'</span>'; }).join('');
    var guestBadge = r.guest ? '<span style="font-size:0.62rem;background:rgba(123,47,255,0.1);border:1px solid rgba(123,47,255,0.25);color:#9B6FFF;padding:2px 7px;border-radius:4px;margin-left:6px;">+ Guest</span>' : '';
    var liveBadge = r.live ? '<div class="lr-card-live-badge"><span class="lr-card-live-dot"></span>LIVE</div>' : '<div style="position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.5);color:rgba(200,180,255,0.62);font-size:0.6rem;font-weight:700;padding:3px 8px;border-radius:4px;letter-spacing:0.1em;">OFFLINE</div>';
    var card = document.createElement('div');
    card.className = 'lr-card';
    card.innerHTML =
      '<div class="lr-card-banner" style="background:'+r.bg+';">'+
        '<div style="width:64px;height:64px;border-radius:50%;background:'+r.avColor+';display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.5rem;color:#fff;box-shadow:0 0 24px rgba(0,0,0,0.4);">'+r.av+'</div>'+
        liveBadge+
        '<div class="lr-card-viewers"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> '+r.viewers+'</div>'+
        '<div class="lr-card-type">'+r.type.charAt(0).toUpperCase()+r.type.slice(1)+'</div>'+
      '</div>'+
      '<div class="lr-card-body">'+
        '<div class="lr-card-artist">'+
          '<div class="lr-card-av" style="background:'+r.avColor+';">'+r.av+'</div>'+
          '<div><div class="lr-card-name">'+r.artist+guestBadge+'</div><div class="lr-card-sub">'+r.genre+' · '+r.location+', '+r.country+'</div></div>'+
        '</div>'+
        '<div class="lr-card-desc">'+r.desc+'</div>'+
        '<div class="lr-card-tags">'+tags+'</div>'+
        '<div class="lr-card-footer">'+
          '<div class="lr-card-stats"><span><strong>'+r.viewers+'</strong> watching</span></div>'+
          '<button class="lr-enter-btn">'+(r.live?'<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#fff;margin-right:5px;animation:cvBlink 1s infinite;vertical-align:middle;"></span>Enter':'Enter')+'</button>'+
        '</div>'+
      '</div>';
    card.addEventListener('click', function(){ enterLiveRoom(r.id); });
    grid.appendChild(card);
  });
  if (!rooms.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--muted);font-size:0.88rem;">No rooms match your filters.</div>';
  }
}

function enterLiveRoom(id) {
  var room = LR_ROOMS.find(function(r){ return r.id === id; });
  if (!room) { showPage('liveroom'); return; }
  lrActiveRoom = room;

  // Switch to room view
  document.getElementById('lrBrowse').classList.add('hidden');
  document.getElementById('lrRoom').classList.add('open');

  // Populate host
  document.getElementById('lrHostAv').textContent = room.av;
  document.getElementById('lrHostAv').style.background = room.avColor;
  document.getElementById('lrHostFeed').style.background = room.bg;
  document.getElementById('lrHostName').textContent = room.artist;
  document.getElementById('lrHostGenre').textContent = room.genre + ' · Session Host';
  document.getElementById('lrViewers').textContent = room.viewers;

  // Guest slot
  var guestSlot = document.getElementById('lrGuestSlot');
  var guestInfoName = document.getElementById('lrGuestInfoName');
  var guestAv = document.getElementById('lrGuestAv');
  var guestName = document.getElementById('lrGuestName');
  if (room.guest) {
    guestSlot.style.display = 'flex';
    var gRoom = LR_ROOMS.find(function(r){ return r.artist === room.guest; });
    if (gRoom) {
      guestAv.textContent = gRoom.av;
      guestAv.style.background = gRoom.avColor;
      guestName.textContent = gRoom.artist;
      if (guestInfoName) guestInfoName.textContent = gRoom.artist;
    } else {
      guestName.textContent = room.guest;
      if (guestInfoName) guestInfoName.textContent = room.guest;
    }
  } else {
    guestSlot.style.display = 'none';
  }

  // Now playing track
  document.getElementById('lrNpArtist').textContent = room.artist + ' · Fortis Music';

  // Init chat
  lrInitChat();

  // Start fan timer countdown
  lrStartFanTimer(262);

  if (!document.getElementById('page-liveroom').classList.contains('active')) {
    showPage('liveroom');
  }
}

function lrBack() {
  document.getElementById('lrBrowse').classList.remove('hidden');
  document.getElementById('lrRoom').classList.remove('open');
}

function lrInitChat() {
  var msgs = document.getElementById('lrChatMsgs');
  if (!msgs) return;
  msgs.innerHTML = '';
  LR_CHATS.forEach(function(m) {
    var div = document.createElement('div');
    div.className = 'lr-chat-msg';
    div.innerHTML = '<span class="lr-chat-user">'+m.user+'</span>'+m.msg+(m.tip?'<span class="lr-chat-tip">'+m.tip+'</span>':'');
    msgs.appendChild(div);
  });
  msgs.scrollTop = msgs.scrollHeight;

  // Simulate live chat messages
  var autoMsgs = [
    {user:'Keanu R.', msg:'just joined 🔥', tip:null},
    {user:'Sofia M.', msg:'this track is incredible', tip:null},
    {user:'Bashir A.', msg:'raise my hand!', tip:null},
    {user:'Nina V.', msg:'love this collab', tip:'€5'},
  ];
  var i = 0;
  clearInterval(window._lrChatInterval);
  window._lrChatInterval = setInterval(function() {
    if (!document.getElementById('lrRoom').classList.contains('open')) { clearInterval(window._lrChatInterval); return; }
    var m = autoMsgs[i % autoMsgs.length]; i++;
    var div = document.createElement('div');
    div.className = 'lr-chat-msg';
    div.innerHTML = '<span class="lr-chat-user">'+m.user+'</span>'+m.msg+(m.tip?'<span class="lr-chat-tip">'+m.tip+'</span>':'');
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }, 4000);
}

function lrSendChat() {
  var input = document.getElementById('lrChatIn');
  var val = input.value.trim();
  if (!val) return;
  var msgs = document.getElementById('lrChatMsgs');
  var div = document.createElement('div');
  div.className = 'lr-chat-msg';
  div.innerHTML = '<span class="lr-chat-user" style="color:#FFD700;">You</span>'+val;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  input.value = '';
}

function lrRaiseHand() {
  var count = document.getElementById('lrQueueCount');
  var list = document.getElementById('lrQueueList');
  var num = list.querySelectorAll('.lr-queue-item').length + 1;
  var item = document.createElement('div');
  item.className = 'lr-queue-item';
  item.innerHTML = '<div class="lr-queue-av" style="background:var(--grad);color:#fff;">'+num+'</div><div class="lr-queue-name" style="color:#FFD700;">You</div><div class="lr-queue-wait">~'+(num*5)+' min</div>';
  list.appendChild(item);
  if (count) count.textContent = num + ' waiting';
  showToast('✋ You\'re in the queue! Wait for ' + (lrActiveRoom ? lrActiveRoom.artist : 'the artist') + ' to call you.');
}

function lrSelectDonate(el, val) {
  document.querySelectorAll('.lr-donate-amt').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  lrSelectedDonate = val;
}

function lrDonate() {
  var amount = lrSelectedDonate === 'custom' ? 2 : lrSelectedDonate;
  var artist = lrActiveRoom ? lrActiveRoom.artist : 'the artist';
  showToast('💚 €' + amount + ' sent to ' + artist + '! Thank you!');
  var msgs = document.getElementById('lrChatMsgs');
  if (msgs) {
    var div = document.createElement('div');
    div.className = 'lr-chat-msg';
    div.innerHTML = '<span class="lr-chat-user" style="color:#00E676;">You</span>sent a donation <span class="lr-chat-tip">€'+amount+'</span>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }
}

var _lrFanTimerInterval = null;
function lrStartFanTimer(seconds) {
  clearInterval(_lrFanTimerInterval);
  var s = seconds;
  function update() {
    var el = document.getElementById('lrFanTimer');
    if (!el) { clearInterval(_lrFanTimerInterval); return; }
    var m = Math.floor(s/60), sec = s%60;
    el.textContent = m + ':' + (sec<10?'0':'')+sec;
    if (s <= 0) {
      clearInterval(_lrFanTimerInterval);
      el.textContent = '0:00';
      showToast('Fan cam slot ended. Next fan coming up!');
    }
    s--;
  }
  update();
  _lrFanTimerInterval = setInterval(update, 1000);
}

// Init on page show
(function() {
  var orig = window.showPage;
  if (orig) {
    window.showPage = function(id) {
      orig(id);
      if (id === 'liveroom') {
        renderLrGrid('','','','viewers','all');
        if (!lrActiveRoom) {
          document.getElementById('lrBrowse').classList.remove('hidden');
          document.getElementById('lrRoom').classList.remove('open');
        }
      }
      if (id === 'now') {
        lrActiveRoom = null;
      }
    };
  }
  document.addEventListener('DOMContentLoaded', function(){
    renderLrGrid('','','','viewers','all');
  });
})();

function jbRenderQ(genre){jbRenderVoting(genre);}
function jbVote(i){jbCastVote(jbActiveGenre||'electronic',i);}
function jbRenderChat(genre){var msgs=document.getElementById('jbMsgs');if(!msgs)return;msgs.innerHTML='';(JB_DATA[genre]&&JB_DATA[genre].chat||[]).forEach(function(m){var d=document.createElement('div');d.className='jb-chat-msg';d.innerHTML='<span class="jbn">'+m.n+'</span>'+m.m;msgs.appendChild(d);});msgs.scrollTop=msgs.scrollHeight;}
function jbSend(){var inp=document.getElementById('jbInput');if(!inp||!inp.value.trim())return;var msgs=document.getElementById('jbMsgs');var d=document.createElement('div');d.className='jb-chat-msg';d.innerHTML='<span class="jbn" style="color:var(--pink);">You</span>'+inp.value.trim();msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;inp.value='';}
function jbStartProg(){if(jbProgInt)clearInterval(jbProgInt);jbProgVal=38;jbProgInt=setInterval(function(){jbProgVal+=0.025;if(jbProgVal>=100){jbProgVal=0;}var fill=document.getElementById('jbFill');if(fill)fill.style.width=Math.min(jbProgVal,100)+'%';var data=JB_DATA[jbActiveGenre];if(data&&data.tracks[0]){var parts=data.tracks[0].dur.split(':');var totalSecs=parseInt(parts[0])*60+parseInt(parts[1]);var secs=Math.floor((jbProgVal/100)*totalSecs);var el=document.getElementById('jbNow');if(el)el.textContent=Math.floor(secs/60)+':'+String(secs%60).padStart(2,'0');}},1000);}
function jbVoteTod(){if(jbTodVoted){showToast('Already voted for Track of the Day today!');return;}jbTodVoted=true;var data=JB_DATA[jbActiveGenre];if(data){data.todVotes++;var el=document.getElementById('jbTodVotes');if(el)el.textContent=data.todVotes.toLocaleString();}showToast('Vote counted! Winner announced at midnight.');}
function jbEnterRoom(genre){
  var data=JB_DATA[genre];
  if(!data){showToast('Coming soon!');return;}
  jbActiveGenre=genre;
  document.getElementById('jbBrowse').classList.add('hidden');
  document.getElementById('jbRoom').classList.add('open');
  var labels={electronic:'Electronic / Dance',hiphop:'Hip-Hop / R&B',pop:'Pop',rock:'Rock / Alternative',afro:'Afrobeats / World'};
  var listeners={electronic:'1,240',hiphop:'890',pop:'654',rock:'412',afro:'378'};
  var el=document.getElementById('jbRoomTitle');
  if(el)el.textContent=labels[genre]||genre;
  var rl=document.getElementById('jbRoomListeners');
  if(rl)rl.textContent=(listeners[genre]||'0')+' listening';

  // Use JB_VOTE_TRACKS for now playing (richer data)
  var voteTracks=JB_VOTE_TRACKS[genre]||[];
  var t=voteTracks.length?voteTracks[0]:data.tracks[0];
  var tn=document.getElementById('jbTrackName');if(tn)tn.textContent=t.t;
  var ta=document.getElementById('jbTrackArtist');if(ta)ta.textContent=t.a+' · '+t.c;
  var tg=document.getElementById('jbTagGenre');if(tg)tg.textContent=t.g;
  var tc=document.getElementById('jbTagCountry');if(tc)tc.textContent=t.c;
  var tl=document.getElementById('jbTagListeners');if(tl)tl.textContent=(listeners[genre]||'0')+' listening';
  var tt=document.getElementById('jbTotal');if(tt)tt.textContent=t.dur||'3:42';

  // Init chat with seed messages then simulate live
  jbRenderChat(genre);
  jbStartLiveChat(genre);

  jbRenderVoting(genre);
  jbStartProg();
  jbStartVoteTimer(genre);
  jbStartAutoVotes(genre);
  var banner=document.getElementById('jbWinnerBanner');
  if(banner)banner.classList.remove('show');
}

function jbStartLiveChat(genre){
  clearInterval(window._jbChatInterval);
  var chatMessages={
    electronic:[
      {n:'Marco B.',m:'this bassline is insane'},
      {n:'Sofia L.',m:'voted already, fingers crossed'},
      {n:'Yuki T.',m:'been waiting for this room to open'},
      {n:'Carlos P.',m:'anyone else previewing all 50?'},
      {n:'Priya S.',m:'2 hours in, no regrets'},
      {n:'Ali B.',m:'that last track was something else'},
      {n:'Nina V.',m:'love that there\'s no ranking visible'},
    ],
    hiphop:[
      {n:'Aiden K.',m:'Marcus Wave every time'},
      {n:'Zara M.',m:'Golden Hour is underrated'},
      {n:'Bashir A.',m:'just joined, previewing now'},
      {n:'Sofia L.',m:'the R&B section hits different tonight'},
    ],
    pop:[
      {n:'Sofia L.',m:'Neon Dreams should win every round'},
      {n:'Marco B.',m:'Celeste deserves so much more'},
      {n:'Keanu R.',m:'just added to the prize pool!'},
    ],
    rock:[
      {n:'Yuki T.',m:'The Void is criminally underrated'},
      {n:'Carlos P.',m:'Static Pulse goes hard'},
      {n:'Jonas P.',m:'finally a room for us'},
    ],
    afro:[
      {n:'Priya S.',m:'Lagos Nights hits every time'},
      {n:'Aiden K.',m:'DJ Pharaoh is a legend'},
      {n:'Kofi B.',m:'Savanna is slept on'},
    ]
  };
  var msgs=chatMessages[genre]||chatMessages.electronic;
  var chatEl=document.getElementById('jbMsgs');
  if(!chatEl)return;
  // Seed 4 initial messages
  chatEl.innerHTML='';
  msgs.slice(0,4).forEach(function(m){
    var d=document.createElement('div');
    d.className='jb-chat-msg';
    d.innerHTML='<span class="jbn">'+m.n+'</span>'+m.m;
    chatEl.appendChild(d);
  });
  chatEl.scrollTop=chatEl.scrollHeight;
  // Simulate new messages every 5-8s
  var i=4;
  window._jbChatInterval=setInterval(function(){
    if(!document.getElementById('jbRoom').classList.contains('open')){clearInterval(window._jbChatInterval);return;}
    var m=msgs[i%msgs.length]; i++;
    var d=document.createElement('div');
    d.className='jb-chat-msg';
    d.innerHTML='<span class="jbn">'+m.n+'</span>'+m.m;
    chatEl.appendChild(d);
    chatEl.scrollTop=chatEl.scrollHeight;
  },5000+Math.random()*3000);
}
function jbBackToBrowse(){document.getElementById('jbBrowse').classList.remove('hidden');document.getElementById('jbRoom').classList.remove('open');clearInterval(jbVoteInterval);clearInterval(jbAutoVoteInterval);if(jbProgInt){clearInterval(jbProgInt);jbProgInt=null;}}
function jbRoom(genre,el){jbEnterRoom(genre);}
var jbSelectedDonate=0.50;
var jbSelectedBoost=0.50;
function jbBoostSelect(el,val){
  document.querySelectorAll('.jb-prize-boost-btns .jb-boost-btn').forEach(function(b){b.classList.remove('active');});
  el.classList.add('active');
  jbSelectedBoost=val;
  var inp=document.getElementById('jbBoostCustom');
  if(inp){inp.style.display='none';}
}
function jbBoostOther(el){
  document.querySelectorAll('.jb-prize-boost-btns .jb-boost-btn').forEach(function(b){b.classList.remove('active');});
  el.classList.add('active');
  jbSelectedBoost='custom';
  var inp=document.getElementById('jbBoostCustom');
  if(inp){inp.style.display='block';inp.focus();}
}
function jbBoostContribute(){
  var amount=jbSelectedBoost;
  if(amount==='custom'){
    var inp=document.getElementById('jbBoostCustom');
    amount=inp?parseFloat(inp.value)||0:0;
    if(amount<=0){showToast('Please enter a valid amount.');return;}
  }
  var genre=jbActiveGenre||'electronic';
  if(!jbPrizeAmount[genre])jbPrizeAmount[genre]=10;
  jbPrizeAmount[genre]+=amount;
  var el=document.getElementById('jbPrizeDisplay');
  if(el)el.textContent='€'+jbPrizeAmount[genre].toFixed(2);
  showToast('€'+amount.toFixed(2)+' added to prize pool! Goes to winning artist.');
  var msgs=document.getElementById('jbMsgs');
  if(msgs){var d=document.createElement('div');d.className='jb-chat-msg';d.innerHTML='<span class="jbn" style="color:#00E676;">You</span> added €'+amount.toFixed(2)+' to the prize pool';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
  var inp2=document.getElementById('jbBoostCustom');
  if(inp2){inp2.style.display='none';inp2.value='';}
}
function jbSelectDonate(el,val){document.querySelectorAll('.jb-donate-amt').forEach(function(b){b.classList.remove('active');});el.classList.add('active');jbSelectedDonate=val;}
function jbDonate(){var amount=jbSelectedDonate==='custom'?1:jbSelectedDonate;var genre=jbActiveGenre||'electronic';if(!jbPrizeAmount[genre])jbPrizeAmount[genre]=10;jbPrizeAmount[genre]+=amount;var el=document.getElementById('jbPrizeDisplay');if(el)el.textContent='€'+jbPrizeAmount[genre].toFixed(2);showToast('€'+amount.toFixed(2)+' added to prize pool! Goes to winning artist.');var msgs=document.getElementById('jbMsgs');if(msgs){var d=document.createElement('div');d.className='jb-chat-msg';d.innerHTML='<span class="jbn" style="color:#00E676;">You</span> added €'+amount.toFixed(2)+' to the prize pool';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}}
function filterDance() {
  danceFilters.search = (document.getElementById('danceSearch')||{value:''}).value;
  danceFilters.country = (document.getElementById('danceCountry')||{value:''}).value;
  danceFilters.city = (document.getElementById('danceCity')||{value:''}).value;
  danceFilters.type = (document.getElementById('danceType')||{value:''}).value;
  danceFilters.sort = (document.getElementById('danceSort')||{value:'Best Rated'}).value;
  renderDanceCards();
}

function clearDanceFilters() {
  danceFilters = { search:'', country:'', city:'', type:'', sort:'Best Rated' };
  ['danceSearch','danceCountry','danceCity','danceType','danceSort'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.value = '';
  });
  renderDanceCards();
}

function quickDanceFilter(type) {
  danceFilters.type = type;
  var sel = document.getElementById('danceType'); if (sel) sel.value = type;
  renderDanceCards();
}

function openDance(id) {
  var s = DANCE_DB.find(function(x){ return x.id===id; });
  if (!s) return;
  var detail = document.getElementById('danceDetail');
  var grid = document.getElementById('danceGrid');
  if (!detail || !grid) return;
  grid.style.display = 'none';
  detail.style.display = 'block';
  var styleTags = s.styles.map(function(g){ return '<span style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.15);padding:4px 12px;border-radius:2px;font-size:0.78rem;color:rgba(200,180,255,0.72);">'+g+'</span>'; }).join('');
  var achItems = s.achievements.map(function(a){ return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(200,180,255,0.07);"><span style="color:#C8A97E;font-size:0.8rem;">&#9733;</span><span style="font-size:0.82rem;color:rgba(255,255,255,0.6);">'+a+'</span></div>'; }).join('');
  var tagPills = s.tags.map(function(t){ return '<span style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.15);color:rgba(200,180,255,0.72);padding:3px 10px;border-radius:2px;font-size:0.7rem;">'+t+'</span>'; }).join('');
  var videoHtml = s.video ? '<div style="position:relative;padding-bottom:56.25%;height:0;margin-bottom:16px;border-radius:4px;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="'+s.video+'?rel=0&modestbranding=1" allowfullscreen loading="lazy"></iframe></div>' : '';
  detail.innerHTML =
    '<button id="danceBackBtn" style="display:flex;align-items:center;gap:6px;margin-bottom:24px;padding:8px 16px;background:transparent;border:1px solid rgba(123,47,255,0.28);color:rgba(200,180,255,0.72);border-radius:16px;cursor:pointer;font-size:0.82rem;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">Back to Dance</button>'
    + '<div class="detail-grid-2col" style="display:grid;grid-template-columns:1fr 300px;gap:24px;">'
    + '<div>'
    + '<div style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.1);border-radius:16px;padding:40px;text-align:center;font-size:4rem;margin-bottom:16px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'+s.img+'</div>'
    + videoHtml
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;margin-bottom:16px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:12px;">About</div><p style="font-size:0.88rem;color:rgba(255,255,255,0.6);line-height:1.75;">'+s.desc+'</p></div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;margin-bottom:16px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:14px;">Dance Styles</div><div style="display:flex;flex-wrap:wrap;gap:8px;">'+styleTags+'</div></div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:14px;">Achievements</div>'+achItems+'</div>'
    + '</div>'
    + '<div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;margin-bottom:14px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<h2 style="font-size:1.3rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:4px;">'+s.name+'</h2>'
    + '<div style="font-size:0.78rem;color:rgba(200,180,255,0.58);margin-bottom:16px;">'+s.city+', '+s.country+' | '+s.type+'</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(200,180,255,0.11);border-radius:4px;overflow:hidden;margin-bottom:16px;">'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#E91E8C;">'+s.members+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Members</div></div>'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#fff;">'+s.rating+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Rating</div></div>'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#fff;">'+s.founded+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Founded</div></div>'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#00E676;">'+s.booked+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Bookings</div></div>'
    + '</div>'
    + '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">'+tagPills+'</div>'
    + '<button id="danceBookBtn" style="width:100%;padding:12px;background:linear-gradient(135deg,#E91E8C,#7B2FFF);border:none;color:#fff;border-radius:16px;font-size:0.88rem;font-weight:700;cursor:pointer;margin-bottom:8px;">Book for Event</button>'
    + '<button id="danceContactBtn" style="width:100%;padding:10px;background:transparent;border:1px solid rgba(123,47,255,0.28);color:rgba(200,180,255,0.62);border-radius:16px;font-size:0.82rem;cursor:pointer;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">Send Message</button>'
    + '</div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:18px;margin-top:14px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:10px;">Contact</div><div style="font-size:0.82rem;color:rgba(255,255,255,0.4);">'+s.contact+'</div></div>'
    + '</div></div>';
  document.getElementById('danceBackBtn').onclick = closeDance;
  document.getElementById('danceBookBtn').onclick = function(){ showToast('Booking request sent to ' + s.name + '!'); };
  document.getElementById('danceContactBtn').onclick = function(){ showToast('Message sent to ' + s.name + '!'); };
}

function closeDance() {
  document.getElementById('danceDetail').style.display = 'none';
  document.getElementById('danceGrid').style.display = 'grid';
}



/* ================================================================
   SECTION BREAK
   ================================================================ */


/* ══ PROTECT/DETECT TAB SWITCHER ══ */
function switchProtectTab(tab) {
  var isProtect = tab === 'protect';
  document.getElementById('tab-panel-protect').style.display = isProtect ? '' : 'none';
  document.getElementById('tab-panel-detect').style.display = isProtect ? 'none' : '';

  var hP = document.getElementById('tab-heading-protect');
  var hD = document.getElementById('tab-heading-detect');
  if (hP && hD) {
    hP.style.color = isProtect ? '#C8A97E' : 'rgba(200,180,255,0.25)';
    hD.style.color = isProtect ? 'rgba(200,180,255,0.25)' : '#E91E8C';
  }
}

/* ══ MOBILE NAV LOGIC v3 ══ */

var _mobActivePage = 'home';

// Which bottom bar button maps to which page
var _mobNavMap = {
  'home':     'mob-btn-home',
  'now':      'mob-btn-now',
  'upload':   'mob-btn-upload',
  'discover': 'mob-btn-discover'
  // all others → highlight "All" button (mob-btn-more)
};

/* Core navigation — bypasses all showPage patches by
   directly manipulating the DOM the same way showPage does,
   then calling whatever window.showPage is at call time    */
function _mobGoTo(pageId) {
  // 1. Close all sub-panels first
  if (typeof closeAllSubs === 'function') closeAllSubs();

  // 2. Try via window.showPage (handles liveroom grid init etc.)
  try { window.showPage(pageId); } catch(e) {
    // Fallback: manual page switch
    document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
    var target = document.getElementById('page-' + pageId);
    if (target) target.classList.add('active');
  }

  // 3. Update active state tracking
  _mobActivePage = pageId;
  _updateMobNavActive(pageId);
  _updateDrawerActive(pageId);

  // 4. Scroll to top
  window.scrollTo(0, 0);
}

function mobNav(pageId) {
  _mobGoTo(pageId);
}

function mobNavDrawer(pageId) {
  mobDrawerClose();
  // Small delay so drawer closes before page animates in
  setTimeout(function(){ _mobGoTo(pageId); }, 60);
}

function _updateMobNavActive(pageId) {
  document.querySelectorAll('.mob-nav-item').forEach(function(el){
    el.classList.remove('active');
  });
  var btnId = _mobNavMap[pageId];
  var btn = document.getElementById(btnId || 'mob-btn-more');
  if (btn) btn.classList.add('active');
}

function _updateDrawerActive(pageId) {
  document.querySelectorAll('.mob-drawer-btn').forEach(function(el){
    el.classList.remove('active-page');
  });
  var db = document.getElementById('mdb-' + pageId);
  if (db) db.classList.add('active-page');
}

function mobDrawerOpen() {
  document.getElementById('mob-drawer-overlay').classList.add('open');
  document.getElementById('mob-drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
  _updateDrawerActive(_mobActivePage);
}

function mobDrawerClose() {
  document.getElementById('mob-drawer-overlay').classList.remove('open');
  document.getElementById('mob-drawer').classList.remove('open');
  document.body.style.overflow = '';
}

// Swipe-down on drawer to close
(function(){
  var startY = 0, drawer = document.getElementById('mob-drawer');
  if (!drawer) return;
  drawer.addEventListener('touchstart', function(e){ startY = e.touches[0].clientY; }, {passive:true});
  drawer.addEventListener('touchend',   function(e){ if (e.changedTouches[0].clientY - startY > 55) mobDrawerClose(); }, {passive:true});
})();

// Keep mobile nav in sync when other parts of the app call showPage()
(function(){
  var _prev = window.showPage;
  if (typeof _prev !== 'function') return;
  window.showPage = function(id) {
    _prev(id);
    _mobActivePage = id;
    _updateMobNavActive(id);
    _updateDrawerActive(id);
  };
})();

}

// ── Ambient wave canvas ──
function drawHomeWave() {
  var canvas = document.getElementById('fm-waveCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = 200;
  var t = 0;
  function frame() {
    var homePage = document.getElementById('page-home');
    if (!homePage || !homePage.classList.contains('active')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, '#E91E8C');
    grad.addColorStop(0.5, '#7B2FFF');
    grad.addColorStop(1, '#00E676');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    for (var w = 0; w < 3; w++) {
      ctx.beginPath();
      ctx.globalAlpha = 0.3 - w * 0.08;
      for (var x = 0; x <= canvas.width; x += 3) {
        var y = canvas.height / 2
          + Math.sin((x / canvas.width) * Math.PI * 4 + t + w * 1.2) * (30 - w * 8)
          + Math.sin((x / canvas.width) * Math.PI * 7 + t * 1.3 + w) * (12 - w * 3);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    t += 0.012;
    requestAnimationFrame(frame);
  }
  frame();
}

// ── Animated counter stats ──
function initCounterStats() {
  var observed = false;
  var els = document.querySelectorAll('.fm-stat-num');
  if (!els.length) return;

  function runCounters() {
    if (observed) return;
    observed = true;
    els.forEach(function(el) {
      var target = parseInt(el.getAttribute('data-target')) || 0;
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      // Reset to 0 to start animation (layout already sized from initial value)
      el.textContent = prefix + '0' + suffix;
      var duration = 1800;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var val = Math.floor(eased * target);
        var formatted = val.toLocaleString();
        el.textContent = prefix + formatted + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target.toLocaleString() + suffix;
      }
      requestAnimationFrame(step);
    });
  }

  var statsBar = document.querySelector('.fm-stats-bar');
  if (!statsBar) return;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) runCounters();
    }, { threshold: 0.3 }).observe(statsBar);
  } else {
    setTimeout(runCounters, 1000);
  }
}

// ── Live feed rotation ──
function initLiveFeed() {
  var feedItems = [
    { color: '#00E676', text: 'Luna Rivera just protected <strong>Midnight Bloom</strong>', time: 'just now' },
    { color: '#E91E8C', text: 'Alex M. tipped <strong>€12</strong> to DJ Nexus', time: '18s ago' },
    { color: '#A06EFF', text: 'EXIT Festival · <strong>1,240 tickets</strong> registered on Fortis', time: '1m ago' },
    { color: '#00E676', text: 'Zara Pulse certificate <strong>FM-2026-441</strong> issued', time: '3m ago' },
    { color: '#FFD700', text: 'Marcus Wave earned <strong>€340</strong> from fan support', time: '4m ago' },
    { color: '#E91E8C', text: 'Kira Tanaka unlocked <strong>exclusive content</strong> for 84 fans', time: '5m ago' },
    { color: '#A06EFF', text: 'DJ Nexus upcoming giveaway — <strong>2 VIP tickets</strong>', time: '7m ago' },
    { color: '#00E676', text: 'The Void just joined Fortis — <strong>340K streams</strong>', time: '9m ago' },
  ];
  var currentIdx = 0;
  var feed = document.getElementById('fm-feed');
  if (!feed) return;

  setInterval(function() {
    if (!document.getElementById('page-home').classList.contains('active')) return;
    currentIdx = (currentIdx + 1) % feedItems.length;
    var item = feedItems[currentIdx];
    var newEl = document.createElement('div');
    newEl.className = 'fm-feed-item fm-feed-active';
    newEl.style.cssText = 'animation: fmReveal 0.4s ease forwards;';
    newEl.innerHTML = '<span class="fm-feed-dot" style="background:' + item.color + '"></span>'
      + '<span class="fm-feed-text">' + item.text + '</span>'
      + '<span class="fm-feed-time">' + item.time + '</span>';

    // Deactivate current active
    var active = feed.querySelector('.fm-feed-active');
    if (active) active.classList.remove('fm-feed-active');

    // Insert at top, remove last if more than 5
    feed.insertBefore(newEl, feed.firstChild);
    var items = feed.querySelectorAll('.fm-feed-item');
    if (items.length > 5) feed.removeChild(items[items.length - 1]);
  }, 3500);
}


// ── NAVIGATION ──
function closeAllSubs() {
  // Close all now-sub overlays
  document.querySelectorAll('.now-sub, .lr-player-page').forEach(function(el) {
    el.classList.remove('open');
  });
  // Close gear store profile
  var gsp = document.getElementById('gssProfile');
  if (gsp) gsp.classList.remove('open');
  // Stop jukebox timers if running
  if (typeof jbProgInt !== 'undefined' && jbProgInt) { clearInterval(jbProgInt); jbProgInt = null; }
  if (typeof jbVoteInterval !== 'undefined') clearInterval(jbVoteInterval);
  if (typeof jbAutoVoteInterval !== 'undefined') clearInterval(jbAutoVoteInterval);
  // Stop drop stage timers if running
  if (typeof drStageInt !== 'undefined' && drStageInt) clearInterval(drStageInt);
  if (typeof drPlayerInt !== 'undefined' && drPlayerInt) clearInterval(drPlayerInt);
  if (typeof drLiveFansInt !== 'undefined' && drLiveFansInt) clearInterval(drLiveFansInt);
}

function showPage(id) {
  closeAllSubs();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  var target = document.getElementById('page-' + id);
  if (target) { target.classList.add('active'); localStorage.setItem('fm_last_page', id); }
  // Update desktop nav active state
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.remove('active');
    var fn = a.getAttribute('onclick') || '';
    if (fn.indexOf("'" + id + "'") !== -1 || fn.indexOf('"' + id + '"') !== -1) {
      a.classList.add('active');
    }
  });
  window.scrollTo(0, 0);
  if (id === 'home')     loadHomeTrendingArtists();
  if (id === 'discover') loadDiscoverProfiles(filterArtists);
  if (id === 'artist') { if (typeof window.fmPopulateArtistPage === 'function') window.fmPopulateArtistPage(window._fmProfile); }
  if (id === 'edit-profile') { if (typeof window.epOpen === 'function') window.epOpen(); }
  if (id === 'gear') setTimeout(function(){ renderGearCards(); }, 50);
  if (id === 'studio') setTimeout(renderStudioCards, 50);
  if (id === 'dance') setTimeout(renderDanceCards, 50);
  if (id === 'clubs') setTimeout(filterClubs, 50);
  if (id === 'events') setTimeout(filterEvents, 50);
}

// ── FILE HANDLING ──
let selectedFile = null;
function handleFileSelect(event) {
  selectedFile = event.target.files[0];
  if (selectedFile) {
    document.getElementById('fileName').textContent = selectedFile.name;
    document.getElementById('fileInfo').style.display = 'block';
    document.getElementById('dropZone').classList.add('file-selected');
  }
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

// ── PROTECTION FLOW ──
let activeCert = {};
function triggerBiometric() {
  var trackTitle = document.getElementById('trackTitle') ? document.getElementById('trackTitle').value : '';
  if (!trackTitle) { showToast('Please enter a track title first'); return; }
  biometricPassed = false;
  // Show Step 1 — method selection
  var modal = document.getElementById('bioModal');
  var step1 = document.getElementById('bioStep1');
  var step2 = document.getElementById('bioStep2');
  if (step1) step1.style.display = 'block';
  if (step2) step2.style.display = 'none';
  if (modal) modal.classList.add('show');
}

function showArtistTab(tab) {
  var profile = document.getElementById('artist-tab-profile');
  var dashboard = document.getElementById('artist-tab-dashboard');
  var btnProfile = document.getElementById('tab-btn-profile');
  var btnDashboard = document.getElementById('tab-btn-dashboard');
  if (!profile || !dashboard) return;

  if (tab === 'dashboard') {
    profile.style.display = 'none';
    dashboard.style.display = 'block';
    if (btnProfile) { btnProfile.style.borderBottomColor = 'transparent'; btnProfile.style.color = 'rgba(255,255,255,0.35)'; }
    if (btnDashboard) { btnDashboard.style.borderBottomColor = '#C8A97E'; btnDashboard.style.color = '#fff'; }
  } else {
    profile.style.display = 'block';
    dashboard.style.display = 'none';
    if (btnProfile) { btnProfile.style.borderBottomColor = '#C8A97E'; btnProfile.style.color = '#fff'; }
    if (btnDashboard) { btnDashboard.style.borderBottomColor = 'transparent'; btnDashboard.style.color = 'rgba(255,255,255,0.35)'; }
  }
}

function closeBioModal() {
  var m = document.getElementById('bioModal');
  if (m) m.classList.remove('show');
}

// Called from "Authenticate Now" button in Step 1
async function startBiometricAuth() {
  // Transition to Step 2 — scanning animation
  var step1 = document.getElementById('bioStep1');
  var step2 = document.getElementById('bioStep2');
  if (step1) step1.style.display = 'none';
  if (step2) step2.style.display = 'block';

  var iconEl = document.getElementById('bioIcon');
  var titleEl = document.getElementById('bioTitle');
  var subtitleEl = document.getElementById('bioSubtitle');
  var progressEl = document.getElementById('bioProgress');
  var logEl = document.getElementById('bioLog');

  if (iconEl) iconEl.textContent = '🔐';
  if (titleEl) titleEl.textContent = 'Scanning Biometrics...';
  if (subtitleEl) subtitleEl.textContent = 'Hold still — reading fingerprint data';
  if (progressEl) progressEl.style.width = '0%';
  if (logEl) logEl.innerHTML = '';

  var steps = [
    [10,  '> Connecting to Fortis Auth API...'],
    [22,  '> Device authenticator detected...'],
    [38,  '> Fingerprint sensor activated...'],
    [52,  '> Reading biometric data...'],
    [65,  '> Cross-referencing Fortis registry...'],
    [78,  '> Generating cryptographic auth token...'],
    [90,  '> Binding token to artist identity...'],
    [100, '> ✓ Identity confirmed — session active'],
  ];

  for (var si = 0; si < steps.length; si++) {
    await delay(380 + Math.random() * 280);
    if (progressEl) progressEl.style.width = steps[si][0] + '%';
    if (logEl) {
      logEl.innerHTML += '<span style="color:' + (steps[si][0] === 100 ? '#00E676' : '#A06EFF') + ';">' + steps[si][1] + '</span><br>';
      logEl.scrollTop = logEl.scrollHeight;
    }
  }

  // Success state
  if (iconEl) iconEl.textContent = '✅';
  if (titleEl) titleEl.textContent = 'Identity Verified!';
  if (subtitleEl) { subtitleEl.textContent = 'Biometric token issued — valid for this session'; subtitleEl.style.color = '#00E676'; }
  biometricPassed = true;

  await delay(1100);
  closeBioModal();
  await startProtection();
}

var biometricPassed = false;

async function startProtection() {
  const artistName = document.getElementById('artistName').value || 'Demo Artist';
  const trackTitle = document.getElementById('trackTitle').value;
  if (!trackTitle) { showToast('Please enter a track title'); return; }

  const box = document.getElementById('statusBox');
  box.classList.add('show');
  const steps = ['step1icon','step2icon','step3icon','step4icon'];
  for (let i = 0; i < steps.length; i++) {
    document.getElementById(steps[i]).className = 'step-icon step-active';
    document.getElementById(steps[i]).textContent = 'Loading';
  }

  async function setStep(n, done) {
    await delay(900);
    document.getElementById('step' + n + 'icon').className = 'step-icon ' + (done ? 'step-done' : 'step-active');
    document.getElementById('step' + n + 'icon').textContent = done ? '✓' : (n+1);
  }

  await setStep(1, true);
  await setStep(2, true);

  let hash = '';
  if (selectedFile && window.crypto && window.crypto.subtle) {
    try {
      const buf = await selectedFile.arrayBuffer();
      const hashBuf = await crypto.subtle.digest('SHA-256', buf);
      hash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2,'0')).join('');
    } catch(e) {}
  }
  if (!hash) {
    for (let i = 0; i < 64; i++) hash += Math.floor(Math.random()*16).toString(16);
  }

  await setStep(3, true);
  await setStep(4, true);

  const certId = 'FM-2026-' + Math.floor(100 + Math.random()*900);
  const date = new Date().toLocaleDateString('en-US', {year:'numeric',month:'short',day:'numeric'});

  activeCert = { artist: artistName, track: trackTitle + ' — ' + artistName, certId, date, hash };

  document.getElementById('certArtist').textContent = artistName;
  if (document.getElementById('certTrack')) document.getElementById('certTrack').textContent = trackTitle;
  if (document.getElementById('certTrackTitle')) document.getElementById('certTrackTitle').textContent = trackTitle;
  document.getElementById('certId').textContent = certId;
  document.getElementById('certDate').textContent = date;
  document.getElementById('certHash').textContent = hash.substring(0,32) + '...';
  document.getElementById('certModal').classList.add('show');

  const dashList = document.getElementById('protected-tracks-list');
  if (dashList) {
    const item = document.createElement('div');
    item.className = 'track-item';
    item.innerHTML = '<div class="track-info"><div class="track-name">' + trackTitle + '</div><div class="track-meta">' + artistName + ' · Just protected · ' + certId + '</div></div><div style="color:var(--green);font-size:0.85rem;">✓ Protected</div>';
    dashList.insertBefore(item, dashList.firstChild);
  }
}

function closeCertModal() { document.getElementById('certModal').classList.remove('show'); }

// ── PDF CERTIFICATE ──
function downloadCertPDF() {
  const LOGO_B64 = document.getElementById('fortis-logo-hidden').src;
  const cert = activeCert;
  const canvas = document.createElement('canvas');
  canvas.width = 794; canvas.height = 1123;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0d0818'; ctx.fillRect(0,0,794,1123);
  const grad = ctx.createLinearGradient(0,0,794,0);
  grad.addColorStop(0,'#E91E8C'); grad.addColorStop(1,'#7B2FFF');
  ctx.fillStyle = grad; ctx.fillRect(0,0,794,90);

  const logoImg = new Image();
  logoImg.onload = function() {
    ctx.drawImage(logoImg,40,15,60,60);
    ctx.fillStyle='#fff'; ctx.font='bold 28px Arial'; ctx.fillText('FORTIS MUSIC',115,48);
    ctx.font='13px Arial'; ctx.fillStyle='rgba(255,255,255,0.75)'; ctx.fillText('The Shield of Creative Rights',115,70);
    ctx.font='11px monospace'; ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.textAlign='right';
    ctx.fillText('CERT: ' + cert.certId,754,45);
    ctx.fillStyle='#00E676'; ctx.fillText('BLOCKCHAIN VERIFIED',754,65);
    ctx.textAlign='left';

    ctx.fillStyle='#fff'; ctx.font='bold 32px Arial'; ctx.textAlign='center';
    ctx.fillText('CERTIFICATE OF',397,155);
    const tg = ctx.createLinearGradient(200,0,600,0);
    tg.addColorStop(0,'#E91E8C'); tg.addColorStop(1,'#7B2FFF');
    ctx.fillStyle=tg; ctx.font='bold 28px Arial'; ctx.fillText('CREATIVE RIGHTS PROTECTION',397,190);
    ctx.fillStyle='#888899'; ctx.font='13px Arial';
    ctx.fillText('Official registration on the Fortis blockchain',397,215);
    ctx.textAlign='left';

    ctx.fillStyle='#1a0a3a'; ctx.strokeStyle='#7B2FFF'; ctx.lineWidth=2;
    roundRect(ctx,347,230,100,90,10); ctx.fill(); ctx.stroke();
    ctx.font='44px serif'; ctx.textAlign='center'; ctx.fillStyle='#A06EFF'; ctx.fillText('🛡',397,295);
    ctx.font='bold 11px Arial'; ctx.fillStyle='#00E676'; ctx.fillText('VERIFIED',397,315);

    ctx.fillStyle='#fff'; ctx.font='bold 26px Arial'; ctx.fillText(cert.track,397,370);
    ctx.font='14px Arial'; ctx.fillStyle='#888899'; ctx.fillText('Protected Work',397,395);
    ctx.textAlign='left';

    const rows=[['Artist / Rights Holder',cert.artist],['Certificate ID',cert.certId],['Registration Date',cert.date],['Blockchain Status','Anchored · Fortis Chain'],['Block Reference','#1,847,234'],['Protection Level','Full Copyright · All Rights Reserved']];
    let rowY=430;
    rows.forEach(function(row){
      ctx.fillStyle='#1a1428'; roundRect(ctx,40,rowY,714,44,6); ctx.fill();
      ctx.fillStyle='#888899'; ctx.font='12px Arial'; ctx.fillText(row[0],60,rowY+27);
      ctx.fillStyle='#fff'; ctx.font='bold 13px Arial'; ctx.textAlign='right'; ctx.fillText(row[1],734,rowY+27);
      ctx.textAlign='left'; rowY+=52;
    });

    const hashY=rowY+10;
    ctx.fillStyle='#0f0a1e'; ctx.strokeStyle='#00E676'; ctx.lineWidth=1.5;
    roundRect(ctx,40,hashY,714,70,8); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#888899'; ctx.font='11px Arial'; ctx.fillText('SHA-256 Cryptographic Fingerprint',60,hashY+22);
    ctx.fillStyle='#00E676'; ctx.font='11px monospace';
    const h=cert.hash||'a3f8c2d1e9b74f6a0c2e5d8b1f3a7c9e2d4f6b8a0c2e5d8b1f';
    ctx.fillText(h.substring(0,56),60,hashY+42); ctx.fillText(h.substring(56),60,hashY+58);

    ctx.fillStyle='#1a1428'; ctx.fillRect(0,1083,794,40);
    ctx.fillStyle='#555566'; ctx.font='10px Arial'; ctx.textAlign='center';
    ctx.fillText('2026 Fortis Music · fortismusic.com · The Shield of Creative Rights',397,1108);
    ctx.fillStyle='#00E676'; ctx.textAlign='right'; ctx.fillText('BLOCKCHAIN VERIFIED',754,1108);

    const a=document.createElement('a');
    a.href=canvas.toDataURL('image/png');
    a.download='Fortis-Certificate-'+cert.certId+'.png';
    a.click();
    showToast('Certificate downloaded!');
    closeCertModal();
  };
  logoImg.src = LOGO_B64;
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}

function wrapText(ctx,text,x,y,maxWidth,lineHeight){
  const words=text.split(' '); let line='',cy=y;
  words.forEach(function(word){
    const test=line+word+' ';
    if(ctx.measureText(test).width>maxWidth&&line!==''){ctx.fillText(line,x,cy);line=word+' ';cy+=lineHeight;}
    else{line=test;}
  });
  ctx.fillText(line,x,cy);
}

// ── AUDIO FINGERPRINT ──
async function analyzeFingerprintFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  document.getElementById('fpFileName').textContent = file.name;
  await drawFingerprint(file);
}

async function drawFingerprint(fileOrNull) {
  const canvas = document.getElementById('fpCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=canvas.width, H=canvas.height;
  ctx.fillStyle='#0d0818'; ctx.fillRect(0,0,W,H);

  let audioData = null;
  if (fileOrNull) {
    try {
      const ab = await fileOrNull.arrayBuffer();
      const ac = new (window.AudioContext||window.webkitAudioContext)();
      const decoded = await ac.decodeAudioData(ab);
      audioData = decoded.getChannelData(0);
    } catch(e) {}
  }

  const bands=120;
  const grad=ctx.createLinearGradient(0,0,W,0);
  grad.addColorStop(0,'#E91E8C'); grad.addColorStop(0.5,'#7B2FFF'); grad.addColorStop(1,'#00E676');
  for (let i=0;i<bands;i++) {
    let amplitude;
    if (audioData) {
      const start=Math.floor((i/bands)*audioData.length);
      const slice=audioData.slice(start,start+Math.floor(audioData.length/bands));
      amplitude=Math.min(1,Math.sqrt(slice.reduce(function(s,v){return s+v*v;},0)/slice.length)*8);
    } else {
      amplitude=Math.min(1,(0.2+0.6*Math.abs(Math.sin(i*0.3)*Math.cos(i*0.17)+Math.sin(i*0.05)))*(0.5+0.5*Math.random()));
    }
    const barH=Math.max(4,amplitude*(H-20));
    ctx.fillStyle=grad;
    ctx.fillRect((i/bands)*W,(H-barH)/2,(W/bands)-2,barH);
  }
  ctx.strokeStyle='rgba(200,180,255,0.07)'; ctx.lineWidth=1;
  for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(0,(i/5)*H);ctx.lineTo(W,(i/5)*H);ctx.stroke();}

  let hash='';
  for(let i=0;i<64;i++) hash+=Math.floor(Math.random()*16).toString(16);
  document.getElementById('fpHashDisplay').style.display='block';
  document.getElementById('fpHashValue').textContent='AQADtJm2'+hash.toUpperCase();
}

function generateDemoFingerprint() {
  document.getElementById('fpFileName').textContent='demo_track.mp3';
  drawFingerprint(null);
}

// ── DETECTION SIMULATOR ──
let selectedPlatform = 'youtube';
const platformNames = {youtube:'YouTube',spotify:'Spotify',tiktok:'TikTok',soundcloud:'SoundCloud'};

function selectPlatform(btn, platform) {
  document.querySelectorAll('.platform-btn').forEach(function(b){b.classList.remove('active-platform');});
  btn.classList.add('active-platform');
  selectedPlatform = platform;
}

async function runDetectionSim() {
  const result = document.getElementById('simResult');
  const track = document.getElementById('simTrack').value;
  const uploader = document.getElementById('simUploader').value;
  const platform = platformNames[selectedPlatform];
  result.style.display = 'block';
  result.innerHTML = '<div style="padding:16px;background:#0d0818;border-radius:12px;font-family:monospace;font-size:0.8rem;color:#a090b8;"><div>> Sending audio to Fortis API...</div></div>';

  const steps = [
    '> POST /v1/fingerprint/match — ' + platform,
    '> Analyzing audio stream...',
    '> Running acoustic fingerprint comparison...',
    '> Checking Fortis blockchain registry...',
    uploader==='unauthorized' ? '> Match confidence: 98.7% — PROTECTED TRACK DETECTED' : '> Match confidence: 99.1% — Checking biometric auth...',
    uploader==='unauthorized' ? '> Uploader biometric: NOT VERIFIED' : '> Biometric token: VALID',
  ];
  const container = result.querySelector('div');
  for (const step of steps) { await delay(500); container.innerHTML += '<div>'+step+'</div>'; }
  await delay(600);

  if (uploader==='unauthorized') {
    result.innerHTML = '<div class="sim-result-blocked"><div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;"><span style="font-size:2.2rem;">🚫</span><div><div style="font-family:\'Inter\',sans-serif;font-weight:800;font-size:1.1rem;color:#E91E8C;">UPLOAD BLOCKED</div><div style="font-size:0.8rem;color:#a090b8;">' + platform + ' — ' + new Date().toLocaleTimeString() + '</div></div></div><div style="display:flex;flex-direction:column;gap:6px;font-size:0.82rem;"><div style="display:flex;justify-content:space-between;"><span style="color:#a090b8;">Track</span><span>' + track.split('—')[0].trim() + '</span></div><div style="display:flex;justify-content:space-between;"><span style="color:#a090b8;">Match</span><span style="color:#E91E8C;">98.7%</span></div><div style="display:flex;justify-content:space-between;"><span style="color:#a090b8;">Biometric</span><span style="color:#E91E8C;">Not verified</span></div></div></div>';
    addAlertFeedItem(platform, track, false);
  } else {
    result.innerHTML = '<div class="sim-result-allowed"><div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;"><span style="font-size:2.2rem;">✅</span><div><div style="font-family:\'Inter\',sans-serif;font-weight:800;font-size:1.1rem;color:#00E676;">UPLOAD APPROVED</div><div style="font-size:0.8rem;color:#a090b8;">' + platform + ' — ' + new Date().toLocaleTimeString() + '</div></div></div><div style="display:flex;flex-direction:column;gap:6px;font-size:0.82rem;"><div style="display:flex;justify-content:space-between;"><span style="color:#a090b8;">Biometric</span><span style="color:#00E676;">Verified</span></div></div></div>';
    addAlertFeedItem(platform, track, true);
  }
}

function addAlertFeedItem(platform, track, allowed) {
  const feed = document.getElementById('alertFeed');
  if (!feed) return;
  const item = document.createElement('div');
  item.className = 'alert-item ' + (allowed ? 'alert-allowed' : 'alert-blocked');
  item.innerHTML = '<div style="display:flex;justify-content:space-between;"><strong>' + platform + '</strong> — ' + track.split('—')[0].trim() + '<span style="font-size:0.7rem;color:#a090b8;">now</span></div><div style="font-size:0.78rem;color:' + (allowed?'#00E676':'#E91E8C') + ';margin-top:2px;">' + (allowed?'ALLOWED — Verified':'BLOCKED — Unauthorized') + '</div>';
  feed.insertBefore(item, feed.firstChild);
}

// ── VIDEO & PLAYER TOGGLE ──
function togglePlayer(id) {
  const player = document.getElementById(id);
  const icon = document.getElementById(id+'-icon');
  if (!player) return;
  const isOpen = player.style.display !== 'none';
  ['player1','player2','player3'].forEach(function(pid){
    const p=document.getElementById(pid); const ico=document.getElementById(pid+'-icon');
    if(p) p.style.display='none'; if(ico) ico.textContent='▶';
  });
  if (!isOpen) { player.style.display='block'; if(icon) icon.textContent='⏸'; }
}

var _pendingVideoId = null;

function addYouTubeVideo() {
  const url = document.getElementById('ytUrlInput').value.trim();
  if (!url) { showToast('Please paste a YouTube URL'); return; }
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  if (!match) { showToast('Invalid YouTube URL'); return; }
  _pendingVideoId = match[1];
  var overlay = document.getElementById('ytConfirmOverlay');
  var check   = document.getElementById('ytConfirmCheck');
  var addBtn  = document.getElementById('ytConfirmAddBtn');
  if (check)  { check.checked = false; }
  if (addBtn) { addBtn.disabled = true; addBtn.style.opacity = '0.4'; addBtn.style.cursor = 'not-allowed'; }
  if (overlay) { overlay.style.display = 'flex'; }
}

function ytConfirmToggle(checked) {
  var btn = document.getElementById('ytConfirmAddBtn');
  if (!btn) return;
  btn.disabled     = !checked;
  btn.style.opacity = checked ? '1' : '0.4';
  btn.style.cursor  = checked ? 'pointer' : 'not-allowed';
}

function ytConfirmAdd() {
  if (!_pendingVideoId) return;
  var videoId = _pendingVideoId;
  _pendingVideoId = null;
  ytConfirmCancel();
  if (typeof window.fmSaveVideoToProfile === 'function') window.fmSaveVideoToProfile(videoId);
  document.getElementById('ytUrlInput').value = '';
  document.getElementById('add-video-form').style.display = 'none';
  showToast('Video added!');
}

function ytConfirmCancel() {
  var overlay = document.getElementById('ytConfirmOverlay');
  if (overlay) { overlay.style.display = 'none'; }
  _pendingVideoId = null;
}

// ── FAN PAGE ──
let selectedTipAmount = 5;

function showFanDonateModal() { document.getElementById('donateModal').classList.add('show'); }
function closeDonateModal() { document.getElementById('donateModal').classList.remove('show'); }
function showFanUnlockModal() { document.getElementById('unlockModal').classList.add('show'); }
function closeUnlockModal() { document.getElementById('unlockModal').classList.remove('show'); }

function setTipAmount(amount) {
  selectedTipAmount = amount;
  document.querySelectorAll('.tip-amt-btn').forEach(function(b){b.classList.remove('active-tip');});
  event.target.classList.add('active-tip');
  document.getElementById('tipCustom').value = '';
}

function sendTip() {
  const custom = document.getElementById('tipCustom').value;
  const amount = custom ? parseFloat(custom) : selectedTipAmount;
  const msg = document.getElementById('tipMessage').value;
  closeDonateModal();
  showToast('Tip of €' + amount.toFixed(2) + ' sent!');
  const list = document.getElementById('fan-tx-list');
  if (list) {
    const item = document.createElement('div');
    item.className = 'tx-row';
    item.innerHTML = '<div style="width:34px;height:34px;background:rgba(233,30,140,0.12);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">❤️</div><div style="flex:1;"><div style="font-size:0.85rem;font-weight:600;">Tip — Luna Rivera</div><div style="font-size:0.72rem;color:#a090b8;">Just now' + (msg?' · '+msg:'') + '</div></div><div style="color:#E91E8C;font-weight:700;font-size:0.88rem;">-€'+amount.toFixed(2)+'</div>';
    list.insertBefore(item, list.firstChild);
  }
  addFanActivity('❤️', 'Tipped an artist €' + amount.toFixed(2), 'Just now');
}

function confirmUnlock() {
  closeUnlockModal();
  showToast('Unlocked! Content added to your library.');
  addFanActivity('🔓', 'Unlocked exclusive content', 'Just now');
}

function addFanActivity(icon, text, time) {
  const feed = document.getElementById('fan-activity-feed');
  if (!feed) return;
  const item = document.createElement('div');
  item.style.cssText = 'display:flex;gap:10px;align-items:flex-start;padding-bottom:8px;border-bottom:1px solid rgba(200,180,255,0.07);';
  item.innerHTML = '<div style="font-size:1.1rem;flex-shrink:0;margin-top:2px;">'+icon+'</div><div><div style="font-size:0.82rem;font-weight:600;">'+text+'</div><div style="font-size:0.72rem;color:#a090b8;">'+time+'</div></div>';
  feed.insertBefore(item, feed.firstChild);
}

// ── HERO SEARCH ──
function heroSearch(val) {
  const q = val || (document.getElementById('heroSearchInput') ? document.getElementById('heroSearchInput').value : '') || '';
  const country = document.getElementById('heroCountry') ? document.getElementById('heroCountry').value : '';
  const genre = document.getElementById('heroGenre') ? document.getElementById('heroGenre').value : '';
  const type = document.getElementById('heroType') ? document.getElementById('heroType').value : '';
  if (q.length > 1 || country || genre || type) {
    if (document.getElementById('discoverSearch')) document.getElementById('discoverSearch').value = q;
    if (document.getElementById('filterCountry') && country) document.getElementById('filterCountry').value = country;
    if (document.getElementById('filterGenre') && genre) document.getElementById('filterGenre').value = genre;
    if (document.getElementById('filterType') && type) document.getElementById('filterType').value = type;
    showPage('discover');
  }
}

// ── DISCOVER PAGE ──
const ARTISTS_DB = [
  {name:'Luna Rivera',type:'Artist',genre:'Electronic',country:'UAE',city:'Dubai',followers:'12.3K',streams:'298K',verified:true,protected:true,emoji:'🎵'},
  {name:'Zara Pulse',type:'Artist',genre:'Synthwave',country:'Serbia',city:'Belgrade',followers:'8.1K',streams:'124K',verified:true,protected:true,emoji:'⚡'},
  {name:'Aria Voss',type:'Artist',genre:'Ambient',country:'Germany',city:'Berlin',followers:'5.4K',streams:'87K',verified:true,protected:false,emoji:'✨'},
  {name:'DJ Nexus',type:'DJ',genre:'House / Techno',country:'UAE',city:'Dubai',followers:'28.7K',streams:'412K',verified:true,protected:false,emoji:'🎧'},
  {name:'Marcus Wave',type:'Producer',genre:'Hip-Hop',country:'USA',city:'Atlanta',followers:'19.2K',streams:'560K',verified:true,protected:true,emoji:'🎤'},
  {name:'Nadia Sol',type:'Artist',genre:'R&B',country:'South Africa',city:'Cape Town',followers:'6.8K',streams:'201K',verified:false,protected:true,emoji:'🌟'},
  {name:'DJ Pharaoh',type:'DJ',genre:'Afrobeats',country:'Nigeria',city:'Lagos',followers:'41K',streams:'890K',verified:true,protected:false,emoji:'🔥'},
  {name:'Kira Tanaka',type:'Artist',genre:'Classical',country:'Japan',city:'Tokyo',followers:'3.2K',streams:'44K',verified:true,protected:true,emoji:'🎻'},
  {name:'The Void',type:'Band',genre:'Rock',country:'UK',city:'Manchester',followers:'15.6K',streams:'340K',verified:true,protected:true,emoji:'🎸'},
  {name:'Celeste M.',type:'Artist',genre:'Pop',country:'France',city:'Paris',followers:'22.1K',streams:'670K',verified:true,protected:false,emoji:'🎹'},
  {name:'Kai Santos',type:'Producer',genre:'Electronic',country:'Brazil',city:'Sao Paulo',followers:'9.7K',streams:'183K',verified:false,protected:true,emoji:'🎛️'},
  {name:'DJ Echo',type:'DJ',genre:'DJ / Club',country:'UAE',city:'Abu Dhabi',followers:'7.3K',streams:'156K',verified:true,protected:false,emoji:'🎧'},
];

let currentDiscoverView = 'grid';
var LIVE_PROFILES = [];

function loadDiscoverProfiles(cb) {
  var sb = window._sb;
  if (!sb) { if (cb) cb(); return; }
  LIVE_PROFILES = [];
  sb.from('profiles')
    .select('id,full_name,display_name,role,country,city,meta,avatar_url,username')
    .neq('role', 'Fan')
    .then(function(r) {
      if (r.data && r.data.length) {
        LIVE_PROFILES = r.data
          .filter(function(p) { return !!(p.full_name || p.display_name); })
          .map(function(p) {
            var genres = (p.meta && p.meta.genres && p.meta.genres.length) ? p.meta.genres.join(', ') : '';
            return {
              id:         p.id,
              name:       p.display_name || p.full_name,
              type:       p.role,
              genre:      genres,
              country:    p.country || '',
              city:       p.city || '',
              followers:  '—',
              streams:    '—',
              verified:   false,
              protected:  false,
              emoji:      '🎵',
              username:   p.username,
              isLive:     true,
              avatar_url: p.avatar_url,
              meta:       p.meta || {}
            };
          });
      }
      if (cb) cb();
    }).catch(function() { if (cb) cb(); });
}

function renderDiscoverCards(data) {
  const grid = document.getElementById('discoverGrid');
  const list = document.getElementById('discoverList');
  const countEl = document.getElementById('discoverCount');
  if (!grid) return;
  if (countEl) countEl.textContent = data.length;
  if (currentDiscoverView === 'grid') {
    grid.style.display = 'grid'; list.style.display = 'none';
    grid.innerHTML = data.map(function(a) { return fmRenderProfileCard(a, 'grid'); }).join('');
  } else {
    grid.style.display = 'none'; list.style.display = 'flex';
    list.innerHTML = data.map(function(a) { return fmRenderProfileCard(a, 'list'); }).join('');
  }
}

function filterArtists() {
  const q = (document.getElementById('discoverSearch') ? document.getElementById('discoverSearch').value : '').toLowerCase();
  const country = document.getElementById('filterCountry') ? document.getElementById('filterCountry').value.replace(/^[^ ]+ /,'') : '';
  const genre = document.getElementById('filterGenre') ? document.getElementById('filterGenre').value : '';
  const type = document.getElementById('filterType') ? document.getElementById('filterType').value : '';
  const verified = document.getElementById('filterVerified') ? document.getElementById('filterVerified').value : '';
  var source = LIVE_PROFILES.length ? LIVE_PROFILES : ARTISTS_DB;
  let results = source.filter(function(a) {
    if (q && !a.name.toLowerCase().includes(q) && !a.genre.toLowerCase().includes(q) && !a.city.toLowerCase().includes(q)) return false;
    if (country && a.country !== country) return false;
    if (genre && a.genre.indexOf(genre) === -1) return false;
    if (type && a.type !== type) return false;
    if (verified === 'verified' && !a.verified) return false;
    if (verified === 'protected' && !a.protected) return false;
    return true;
  });
  renderDiscoverCards(fmShuffle(results));
}

function clearDiscoverFilters() {
  ['discoverSearch','filterCountry','filterGenre','filterType','filterVerified'].forEach(function(id){
    const el = document.getElementById(id); if(el) el.value='';
  });
  filterArtists();
}

function fmShuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function fmCardClick(id) {
  if (!id) return;
  if (window._fmUser && window._fmUser.id === id) {
    showPage('artist');
  } else if (window.fmShowPublicProfile) {
    window.fmShowPublicProfile(id);
  }
}

function fmRenderProfileCard(a, mode) {
  var name      = a.name || 'Artist';
  var initials  = name.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase() || '?';
  var colors    = ['#7B2FFF','#C8A97E','#00E676','#E91E8C','#3B82F6'];
  var col       = colors[Math.abs((name.charCodeAt(0)||0) + (name.charCodeAt(1)||0)) % colors.length];
  var cardBg    = a.meta && a.meta.card_bg ? a.meta.card_bg : null;
  var avu       = a.avatar_url || null;
  var id        = a.id || '';
  var click     = id ? 'fmCardClick(\'' + id + '\')' : 'void 0';
  var type      = a.type  || '';
  var city      = a.city  || '';
  var genre     = a.genre || '';
  var streams   = a.streams || '—';
  var followers = a.followers || '—';

  // Background layer — image if card_bg, otherwise dark purple gradient
  var bgCss = cardBg
    ? 'url(' + cardBg + ') center/cover no-repeat'
    : 'linear-gradient(135deg,#1a0533 0%,#2d0a5e 50%,#0d0020 100%)';

  // Overlay — only when there is a photo background
  var overlay = cardBg
    ? '<div style="position:absolute;inset:0;background:linear-gradient(to top right,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.45) 40%,rgba(0,0,0,0.0) 100%);pointer-events:none;"></div>'
    : '';

  // Avatar — 60px circle with 2.5px white border
  var avatar = avu
    ? '<div style="width:60px;height:60px;border-radius:50%;background:url(' + avu + ') center/cover no-repeat;border:2.5px solid #fff;flex-shrink:0;"></div>'
    : '<div style="width:60px;height:60px;border-radius:50%;background:' + col + ';border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;color:#fff;flex-shrink:0;">' + initials + '</div>';

  // Genre badge — only render if genre text exists
  var genreBadge = genre
    ? '<div style="display:inline-block;background:rgba(123,47,255,0.35);color:#C8B4FF;padding:2px 8px;border-radius:6px;font-size:0.65rem;font-weight:600;letter-spacing:0.04em;margin-bottom:8px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + genre + '</div>'
    : '';

  return '<div style="position:relative;width:220px;height:280px;border-radius:16px;overflow:hidden;cursor:pointer;flex-shrink:0;background:' + bgCss + ';" onclick="' + click + '">'
    + overlay
    // Support button — top right, glass style
    + '<button onclick="event.stopPropagation();showFanDonateModal()" style="position:absolute;top:10px;right:10px;z-index:2;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.4);color:#fff;padding:4px 10px;border-radius:8px;font-size:0.68rem;font-weight:600;cursor:pointer;font-family:inherit;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">Support</button>'
    // Bottom content block
    + '<div style="position:absolute;bottom:0;left:0;right:0;padding:14px;z-index:1;">'
    + avatar
    + '<div style="font-size:16px;font-weight:600;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,0.6);margin-top:8px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + name + '</div>'
    + '<div style="font-size:12px;color:rgba(255,255,255,0.75);margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + type + (city ? ' · ' + city : '') + '</div>'
    + genreBadge
    + '<div style="display:flex;gap:14px;">'
    + '<div><div style="font-size:13px;font-weight:700;color:#fff;line-height:1.2;">' + followers + '</div><div style="font-size:10px;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.06em;">Followers</div></div>'
    + '<div><div style="font-size:13px;font-weight:700;color:#fff;line-height:1.2;">' + streams + '</div><div style="font-size:10px;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.06em;">Streams</div></div>'
    + '</div>'
    + '</div>'
    + '</div>';
}

function loadHomeTrendingArtists() {
  var sb   = window._sb;
  var grid = document.getElementById('fmHomeTrendingGrid');
  if (!sb || !grid) return;
  sb.from('profiles')
    .select('id,full_name,display_name,role,country,city,meta,avatar_url')
    .neq('role', 'Fan')
    .limit(20)
    .then(function(r) {
      if (!r.data || !r.data.length) return;
      var profiles = r.data
        .filter(function(p) { return !!(p.full_name || p.display_name); })
        .map(function(p) {
          return {
            id:        p.id,
            name:      p.display_name || p.full_name,
            type:      p.role || 'Artist',
            genre:     (p.meta && p.meta.genres && p.meta.genres.length) ? p.meta.genres[0] : '',
            city:      p.city || '',
            country:   p.country || '',
            followers: '—',
            streams:   '—',
            verified:  false,
            isLive:    true,
            avatar_url:p.avatar_url,
            meta:      p.meta || {}
          };
        });
      grid.innerHTML = fmShuffle(profiles).slice(0, 5).map(function(a) {
        return fmRenderProfileCard(a, 'compact');
      }).join('');
    }).catch(function(){});
}

function setDiscoverView(v) {
  currentDiscoverView = v;
  ['viewGrid','viewList'].forEach(function(id){
    const el=document.getElementById(id);
    if(!el) return;
    const active = (id==='viewGrid' && v==='grid') || (id==='viewList' && v==='list');
    el.style.background = active ? 'rgba(123,47,255,0.15)' : 'transparent';
    el.style.color = active ? '#A06EFF' : '#888899';
  });
  filterArtists();
}

// ── GEAR PAGE ──
// ── GEAR STORE DATA ──
const GEAR_STORES = [
  {
    id: 'gs1',
    name: 'ProSound Dubai',
    emoji: '🎧',
    gradient: 'linear-gradient(135deg,#100e22,#1a2840,#0a1020)',
    country: 'UAE', city: 'Dubai', address: 'Al Quoz Industrial Area, Dubai',
    phone: '+971 4 321 0000', website: 'prosounddubai.com', email: 'info@prosounddubai.com',
    verified: true, rating: 4.9, reviews: 284, founded: '2011',
    tags: ['DJ Equipment','Controllers','Speakers & PA','Studio Gear'],
    desc: 'Dubai\'s leading DJ and pro audio equipment retailer. Official distributor for Pioneer DJ, Denon DJ, and Allen & Heath in the UAE. Our showroom carries the full range of professional DJ gear, studio monitors, and live sound equipment — all available for demo before you buy.',
    hours: 'Mon–Sat 10:00–21:00, Sun 12:00–19:00',
    gallery: ['🎧','🎛️','🔊','💡','🎵','📻'],
    stats: {items: '400+', brands: '30+', years: '14'},
    products: [
      {name:'Pioneer CDJ-3000',cat:'DJ Equipment',emoji:'🎧',price:2299,condition:'New',cta:'call'},
      {name:'Pioneer DJM-A9',cat:'DJ Mixer',emoji:'🎛️',price:3199,condition:'New',cta:'call'},
      {name:'Denon SC6000M',cat:'DJ Player',emoji:'📀',price:1799,condition:'New',cta:'website'},
      {name:'Pioneer DDJ-FLX10',cat:'Controller',emoji:'🎮',price:1299,condition:'New',cta:'website'},
      {name:'RCF EVOX 12',cat:'PA System',emoji:'🔊',price:2499,condition:'New',cta:'call'},
      {name:'Allen & Heath Xone:96',cat:'Mixer',emoji:'🎚️',price:2199,condition:'New',cta:'call'},
    ],
    reviews: [
      {name:'DJ Nexus',color:'#7B2FFF',stars:'★★★★★',text:'Best gear shop in the UAE. Staff actually know what they\'re talking about and let you test everything properly before buying.'},
      {name:'Khalid M.',color:'#E91E8C',stars:'★★★★★',text:'Bought my full Pioneer setup here. Price matched online and got free delivery. Couldn\'t ask for more.'},
      {name:'Aiden K.',color:'#00E676',stars:'★★★★☆',text:'Great selection, slightly expensive but you get proper warranty and local support which is worth it.'},
    ]
  },
  {
    id: 'gs2',
    name: 'Music Zone UAE',
    emoji: '🎹',
    gradient: 'linear-gradient(135deg,#1a0830,#2d1050,#100520)',
    country: 'UAE', city: 'Dubai', address: 'Mall of the Emirates, Dubai',
    phone: '+971 4 409 8888', website: 'musiczoneae.com', email: 'sales@musiczoneae.com',
    verified: true, rating: 4.8, reviews: 196, founded: '2007',
    tags: ['Keyboards & Synths','Guitars & Bass','Orchestral','Recording & DAW'],
    desc: 'The UAE\'s most comprehensive music instrument store with over 600 instruments on display. From student beginner packages to professional concert grand pianos — our expert staff guide every musician at every level. Offering lessons, repair services, and instrument rental programs.',
    hours: 'Daily 10:00–22:00',
    gallery: ['🎹','🎸','🎻','🪗','🎷','🎺'],
    stats: {items: '600+', brands: '50+', years: '18'},
    products: [
      {name:'Roland JUNO-X',cat:'Synthesizer',emoji:'🎹',price:1699,condition:'New',cta:'website'},
      {name:'Fender Stratocaster Std.',cat:'Guitar',emoji:'🎸',price:1199,condition:'New',cta:'website'},
      {name:'Yamaha P-515',cat:'Digital Piano',emoji:'🎹',price:1899,condition:'New',cta:'call'},
      {name:'Korg Minilogue XD',cat:'Synth',emoji:'🎛️',price:699,condition:'New',cta:'website'},
      {name:'Gibson Les Paul Std.',cat:'Guitar',emoji:'🎸',price:2999,condition:'New',cta:'call'},
      {name:'Arturia MiniFreak',cat:'Synthesizer',emoji:'🎛️',price:599,condition:'New',cta:'website'},
    ],
    reviews: [
      {name:'Sara B.',color:'#C8A97E',stars:'★★★★★',text:'Incredible selection. The staff helped me find the perfect digital piano for my home studio within budget.'},
      {name:'Omar R.',color:'#7B2FFF',stars:'★★★★★',text:'Bought my first guitar here 5 years ago and still come back for strings, accessories, everything.'},
      {name:'Priya T.',color:'#E91E8C',stars:'★★★★☆',text:'Good store but can get crowded on weekends. Worth calling ahead if you want proper demo time.'},
    ]
  },
  {
    id: 'gs3',
    name: 'Beat Store UAE',
    emoji: '🥁',
    gradient: 'linear-gradient(135deg,#1a0a00,#2e1500,#100800)',
    country: 'UAE', city: 'Sharjah', address: 'Industrial Area 7, Sharjah',
    phone: '+971 6 530 2200', website: 'beatstoreuae.com', email: 'hello@beatstoreuae.com',
    verified: true, rating: 4.9, reviews: 143, founded: '2015',
    tags: ['Drums & Percussion','Studio Gear','Microphones'],
    desc: 'Sharjah\'s specialist drum and percussion store. We carry acoustic kits, electronic drum systems, hand percussion, and the full range of studio recording gear. Known for fair pricing, honest advice, and the best acoustic drum room in the region for proper testing.',
    hours: 'Sat–Thu 09:00–20:00, Fri 14:00–20:00',
    gallery: ['🥁','🪘','🎵','🎤','🎚️','🎶'],
    stats: {items: '250+', brands: '20+', years: '9'},
    products: [
      {name:'Roland TD-27KV',cat:'E-Drums',emoji:'🥁',price:3499,condition:'New',cta:'call'},
      {name:'Pearl Export Series',cat:'Acoustic Kit',emoji:'🥁',price:999,condition:'New',cta:'website'},
      {name:'Shure SM7B',cat:'Microphone',emoji:'🎤',price:399,condition:'New',cta:'website'},
      {name:'Focusrite Scarlett 4i4',cat:'Audio Interface',emoji:'🎚️',price:249,condition:'New',cta:'website'},
      {name:'Rode NT-USB Mini',cat:'USB Mic',emoji:'🎙️',price:129,condition:'New',cta:'website'},
      {name:'Meinl 16" Trash Crash',cat:'Cymbal',emoji:'🎵',price:189,condition:'New',cta:'call'},
    ],
    reviews: [
      {name:'Rami D.',color:'#FF9800',stars:'★★★★★',text:'Best drum shop in the UAE, no competition. They let me play every kit for as long as I needed and never rushed me.'},
      {name:'Jake S.',color:'#00E676',stars:'★★★★★',text:'Drove from Dubai because of the reviews — absolutely worth it. Got a great deal on a Pearl kit.'},
      {name:'Nadia H.',color:'#7B2FFF',stars:'★★★★☆',text:'Nice shop, good prices. Would love to see more electronic pad accessories but overall great experience.'},
    ]
  },
  {
    id: 'gs4',
    name: 'Studio Gear Serbia',
    emoji: '🎚️',
    gradient: 'linear-gradient(135deg,#0a1a10,#0d2a18,#050d08)',
    country: 'Serbia', city: 'Belgrade', address: 'Savski Venac, Belgrade',
    phone: '+381 11 265 0000', website: 'studiogear.rs', email: 'prodaja@studiogear.rs',
    verified: false, rating: 4.7, reviews: 89, founded: '2018',
    tags: ['Recording & DAW','Studio Gear','Microphones','Speakers & PA'],
    desc: 'Belgrade\'s go-to destination for home studio and professional recording gear. We specialise in acoustic treatment, studio monitors, audio interfaces, and DAW software. Our in-store demo room lets you hear monitors in a properly treated space before committing.',
    hours: 'Mon–Fri 10:00–19:00, Sat 10:00–16:00',
    gallery: ['🎚️','💻','🎤','🔊','🎛️','📀'],
    stats: {items: '180+', brands: '25+', years: '6'},
    products: [
      {name:'Yamaha HS8',cat:'Studio Monitor',emoji:'🔊',price:699,condition:'New',cta:'website'},
      {name:'Ableton Live 12 Suite',cat:'DAW',emoji:'💻',price:749,condition:'New',cta:'website'},
      {name:'Universal Audio Apollo Twin X',cat:'Interface',emoji:'🎚️',price:899,condition:'New',cta:'call'},
      {name:'Neumann TLM 103',cat:'Microphone',emoji:'🎤',price:999,condition:'New',cta:'call'},
      {name:'Genelec 8030C',cat:'Monitor',emoji:'🔊',price:499,condition:'Refurbished',cta:'call'},
      {name:'Native Instruments Maschine+',cat:'Production',emoji:'🎛️',price:999,condition:'New',cta:'website'},
    ],
    reviews: [
      {name:'Marko P.',color:'#00E676',stars:'★★★★★',text:'Jedina prodavnica u Beogradu gde možeš stvarno testirati monitore u ozvučenoj sobi. Preporučujem svima.'},
      {name:'Stefan L.',color:'#7B2FFF',stars:'★★★★★',text:'Kupio sam čitav home studio setup ovde. Odlična usluga, dobri saveti, i cene su realne.'},
      {name:'Ivan C.',color:'#C8A97E',stars:'★★★★☆',text:'Solidan izbor. Volim što nude i polovnu/refurb opremu uz garanciju — retko to viđaš kod nas.'},
    ]
  },
  {
    id: 'gs5',
    name: 'Thomann UK',
    emoji: '🎸',
    gradient: 'linear-gradient(135deg,#1a0010,#2d0020,#100008)',
    country: 'UK', city: 'London', address: 'Online · Ships Worldwide',
    phone: '+44 20 3318 9999', website: 'thomann.de/gb', email: 'support@thomann.de',
    verified: true, rating: 5.0, reviews: 1420, founded: '1954',
    tags: ['Guitars & Bass','Keyboards & Synths','Microphones','All Categories'],
    desc: 'Europe\'s largest online music retailer with UK operations. Over 80,000 products from all leading brands, fast delivery across Europe and the UAE. Known for competitive pricing, transparent reviews, and excellent customer service. 30-day money-back guarantee on all items.',
    hours: 'Online 24/7 · Support Mon–Fri 09:00–18:00',
    gallery: ['🎸','🎹','🎧','🥁','🎻','🎺'],
    stats: {items: '80,000+', brands: '1,000+', years: '70'},
    products: [
      {name:'Harley Benton SC-450Plus',cat:'Guitar',emoji:'🎸',price:219,condition:'New',cta:'website'},
      {name:'Behringer TD-3',cat:'Synth',emoji:'🎛️',price:149,condition:'New',cta:'website'},
      {name:'t.bone SC 400',cat:'Microphone',emoji:'🎤',price:79,condition:'New',cta:'website'},
      {name:'the t.amp E-400',cat:'Amplifier',emoji:'🔊',price:199,condition:'New',cta:'website'},
      {name:'Millenium MPS-750X',cat:'E-Drums',emoji:'🥁',price:449,condition:'New',cta:'website'},
      {name:'Arturia KeyStep 37',cat:'Controller',emoji:'🎹',price:179,condition:'New',cta:'website'},
    ],
    reviews: [
      {name:'Liam H.',color:'#E91E8C',stars:'★★★★★',text:'Been buying from Thomann for 15 years. Unbeatable prices and the return process is hassle-free.'},
      {name:'Emma W.',color:'#00E676',stars:'★★★★★',text:'Ordered to UAE — arrived in 4 days! Packaging was excellent and the guitar came perfectly set up.'},
      {name:'Jack D.',color:'#7B2FFF',stars:'★★★★★',text:'Best online music store in Europe. The customer reviews on their site are genuinely helpful too.'},
    ]
  },
  {
    id: 'gs6',
    name: 'Plugin Boutique',
    emoji: '💻',
    gradient: 'linear-gradient(135deg,#080818,#10102a,#050510)',
    country: 'Germany', city: 'Berlin', address: 'Online · Digital Downloads',
    phone: '+49 30 9999 0000', website: 'pluginboutique.com', email: 'support@pluginboutique.com',
    verified: true, rating: 4.9, reviews: 532, founded: '2012',
    tags: ['Recording & DAW','Studio Gear'],
    desc: 'The world\'s leading marketplace for music production software, VST plugins, and sample packs. Over 10,000 plugins from every major developer, instant digital delivery, and regular sales of up to 90% off. Trusted by producers and engineers worldwide.',
    hours: 'Online 24/7 · Instant delivery',
    gallery: ['💻','🎛️','🎵','🎚️','🎶','📀'],
    stats: {items: '10,000+', brands: '500+', years: '12'},
    products: [
      {name:'Ableton Live 12 Suite',cat:'DAW',emoji:'💻',price:749,condition:'New',cta:'website'},
      {name:'Serum by Xfer Records',cat:'VST Synth',emoji:'🎛️',price:189,condition:'New',cta:'website'},
      {name:'Splice Sounds 1 Month',cat:'Sample Pack',emoji:'🎵',price:9,condition:'New',cta:'website'},
      {name:'Fabfilter Pro-Q 4',cat:'EQ Plugin',emoji:'🎚️',price:149,condition:'New',cta:'website'},
      {name:'iZotope Ozone 11',cat:'Mastering',emoji:'📀',price:249,condition:'New',cta:'website'},
      {name:'Native Instruments Komplete 14',cat:'Bundle',emoji:'🎹',price:599,condition:'New',cta:'website'},
    ],
    reviews: [
      {name:'Max R.',color:'#C8A97E',stars:'★★★★★',text:'Best place for plugin deals. Their loyalty points system actually saves real money over time.'},
      {name:'Leila S.',color:'#E91E8C',stars:'★★★★★',text:'Instant download, great bundles, and they have every developer you can think of. My go-to for software.'},
      {name:'Tom K.',color:'#7B2FFF',stars:'★★★★☆',text:'Solid platform. Occasional glitches with license delivery but support always sorts it out quickly.'},
    ]
  },
];

var gsActivePillCat = '';

function renderGearCards(data) {
  var grid = document.getElementById('gearGrid');
  var countEl = document.getElementById('gearCount');
  if (!grid) return;
  var stores = data || GEAR_STORES;
  if (countEl) countEl.textContent = stores.length;
  grid.innerHTML = stores.map(function(s) {
    var tagsHtml = s.tags.slice(0,3).map(function(t){ return '<span class="gs-store-tag">'+t+'</span>'; }).join('');
    return '<div class="gs-store-card" onclick="gsOpenStore(\''+s.id+'\')">'+
      '<div class="gs-store-cover" style="background:'+s.gradient+';">'+
        '<span>'+s.emoji+'</span>'+
        (s.verified ? '<span class="gs-store-cover-verified">✓ Verified</span>' : '')+
        '<span class="gs-store-cover-badge">'+s.city+', '+s.country+'</span>'+
      '</div>'+
      '<div class="gs-store-body">'+
        '<div class="gs-store-name">'+s.name+'</div>'+
        '<div class="gs-store-loc">'+s.address+'</div>'+
        '<div class="gs-store-tags">'+tagsHtml+'</div>'+
        '<div class="gs-store-footer">'+
          '<div>'+
            '<div class="gs-store-rating"><strong>'+s.rating+'</strong> ★ <span style="font-size:0.68rem;">('+s.reviews+')</span></div>'+
            '<div class="gs-store-items">'+s.stats.items+' items · '+s.stats.brands+' brands</div>'+
          '</div>'+
          '<button class="gs-store-enter" onclick="event.stopPropagation();gsOpenStore(\''+s.id+'\')">Visit Store →</button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }).join('');
}

function gsOpenStore(id) {
  var s = GEAR_STORES.find(function(x){ return x.id === id; });
  if (!s) return;
  var el = document.getElementById('gssProfile');
  var content = document.getElementById('gssProfileContent');
  if (!el || !content) return;

  // Gallery items
  var galleryItems = s.gallery.map(function(em, i) {
    var cls = i === 0 ? 'gs-gallery-item main' : (i === 2 ? 'gs-gallery-item video' : 'gs-gallery-item');
    var extra = (i === 5 && s.gallery.length > 5) ? '<div class="gs-gallery-more">+' + (s.gallery.length - 5) + '</div>' : '';
    return '<div class="'+cls+'" style="background:rgba(200,180,255,0.07);">'+em+extra+'</div>';
  }).join('');

  // Products
  var productsHtml = s.products.map(function(p) {
    var ctaCls = p.cta === 'call' ? 'gs-product-cta call' : 'gs-product-cta';
    var ctaTxt = p.cta === 'call' ? '📞 Call' : '🌐 Website';
    var ctaAct = p.cta === 'call'
      ? 'onclick="showToast(\'Calling '+s.name+'... '+s.phone+'\')"'
      : 'onclick="showToast(\'Opening '+s.website+'...\')"';
    return '<div class="gs-product-item">'+
      '<div class="gs-product-icon">'+p.emoji+'</div>'+
      '<div class="gs-product-info">'+
        '<div class="gs-product-cat">'+p.cat+'</div>'+
        '<div class="gs-product-name">'+p.name+'</div>'+
        '<div class="gs-product-meta">'+p.condition+'</div>'+
      '</div>'+
      '<div class="gs-product-right">'+
        '<div class="gs-product-price">€'+p.price.toLocaleString()+'</div>'+
        '<button class="'+ctaCls+'" '+ctaAct+'>'+ctaTxt+'</button>'+
      '</div>'+
    '</div>';
  }).join('');

  // Reviews
  var reviewsHtml = s.reviews.map(function(r) {
    return '<div class="gs-review-item">'+
      '<div class="gs-review-head">'+
        '<div class="gs-review-av" style="background:'+r.color+'22;color:'+r.color+';">'+r.name[0]+'</div>'+
        '<div class="gs-review-name">'+r.name+'</div>'+
        '<div class="gs-review-stars">'+r.stars+'</div>'+
      '</div>'+
      '<div class="gs-review-text">'+r.text+'</div>'+
    '</div>';
  }).join('');

  content.innerHTML =
    '<div class="gs-profile-hero" style="background:'+s.gradient+';">'+
      '<div class="gs-profile-hero-bg">'+s.emoji+'</div>'+
      '<div class="gs-profile-hero-overlay"></div>'+
      '<div class="gs-profile-hero-info">'+
        '<div class="gs-profile-hero-name">'+s.name+'</div>'+
        '<div class="gs-profile-hero-sub">'+s.address+' · Since '+s.founded+'</div>'+
        '<div class="gs-profile-hero-badges">'+
          (s.verified ? '<span class="gs-profile-badge verified">✓ Verified Store</span>' : '')+
          s.tags.slice(0,2).map(function(t){ return '<span class="gs-profile-badge cat">'+t+'</span>'; }).join('')+
          '<span class="gs-profile-badge country">'+s.city+', '+s.country+'</span>'+
        '</div>'+
      '</div>'+
    '</div>'+

    '<div class="gs-profile-actions">'+
      '<button class="gs-action-btn gs-action-call" onclick="showToast(\'Calling '+s.name+'...\')">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>'+
        'Call Store'+
      '</button>'+
      '<button class="gs-action-btn gs-action-primary" onclick="showToast(\'Opening '+s.website+'...\')">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>'+
        'Visit Website'+
      '</button>'+
      '<button class="gs-action-btn gs-action-secondary" onclick="showToast(\'Message sent to '+s.name+'!\')">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'+
        'Message'+
      '</button>'+
    '</div>'+

    '<div class="gs-profile-about">'+
      '<div class="gs-profile-section-title">About this store</div>'+
      '<div class="gs-profile-desc">'+s.desc+'</div>'+
      '<div class="gs-profile-stats">'+
        '<div class="gs-profile-stat"><strong>'+s.stats.items+'</strong><span>Products</span></div>'+
        '<div class="gs-profile-stat"><strong>'+s.stats.brands+'</strong><span>Brands</span></div>'+
        '<div class="gs-profile-stat"><strong>'+s.rating+'★</strong><span>('+s.reviews+' reviews)</span></div>'+
      '</div>'+
      '<div style="margin-top:14px;display:flex;align-items:center;gap:8px;font-size:0.78rem;color:rgba(255,255,255,0.4);">'+
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'+
        s.hours+
      '</div>'+
    '</div>'+

    '<div class="gs-gallery">'+
      '<div class="gs-gallery-title">Photos & Video</div>'+
      '<div class="gs-gallery-grid">'+galleryItems+'</div>'+
    '</div>'+

    '<div class="gs-products">'+
      '<div class="gs-products-head">'+
        '<div class="gs-products-title">Featured Products & Pricing</div>'+
      '</div>'+
      '<div class="gs-product-list">'+productsHtml+'</div>'+
      '<p style="font-size:0.72rem;color:rgba(200,180,255,0.52);margin-top:12px;text-align:center;">Prices are indicative. Contact store or visit website for current availability and pricing.</p>'+
    '</div>'+

    '<div class="gs-reviews">'+
      '<div class="gs-profile-section-title">Customer Reviews · '+s.rating+' ★ ('+s.reviews+')</div>'+
      reviewsHtml+
    '</div>';

  el.classList.add('open');
  el.scrollTop = 0;
}

function gsCloseProfile() {
  var el = document.getElementById('gssProfile');
  if (el) el.classList.remove('open');
}

function filterGear() {
  var q = (document.getElementById('gearSearch') || {value:''}).value.toLowerCase();
  var cat = (document.getElementById('gearCategory') || {value:''}).value;
  var country = (document.getElementById('gearCountry') || {value:''}).value;
  var budget = (document.getElementById('gearBudget') || {value:''}).value;
  var results = GEAR_STORES.filter(function(s) {
    if (q && !s.name.toLowerCase().includes(q) && !s.city.toLowerCase().includes(q) && !s.tags.join(' ').toLowerCase().includes(q)) return false;
    if (cat && !s.tags.some(function(t){ return t.includes(cat); })) return false;
    if (country && s.country !== country) return false;
    if (gsActivePillCat && !s.tags.some(function(t){ return t.includes(gsActivePillCat); })) return false;
    return true;
  });
  renderGearCards(results);
}

function gsPillFilter(el, cat) {
  document.querySelectorAll('.gs-pill').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  gsActivePillCat = cat;
  filterGear();
}

// Keep old quickGearFilter alias for compatibility
function quickGearFilter(cat) { gsPillFilter(event.target, cat); }

// ── CLUBS PAGE ──
const CLUBS_DB = [
  {id:'c1',name:'Warehouse 14',emoji:'🏭',type:'Nightclub',genre:'Techno',country:'UAE',city:'Dubai',address:'Al Quoz Industrial Area, Dubai',rating:4.8,reviews:342,followers:8400,desc:'Dubai\'s premier underground techno club. Industrial setting, world-class sound system, resident and international DJs every weekend.',tags:['Techno','House','Underground'],hours:'Thu-Sat 22:00-06:00',giveaway:true,giveaway_text:'Win 2 VIP tickets + bottle service for Mar 15',giveaway_ends:'Mar 13, 2026',entries:247,photos:['🏭','🎧','💡','🎵'],upcoming:[{date:'Mar 15',event:'DJ Nexus Live',genre:'Techno'},{date:'Mar 22',event:'Berlin Underground Night',genre:'Techno'}],gradient:'linear-gradient(135deg,#1a1a2e,#16213e)'},
  {id:'c2',name:'Club Celsius',emoji:'🌡️',type:'Nightclub',genre:'House',country:'UAE',city:'Dubai',address:'DIFC Gate Village, Dubai',rating:4.7,reviews:218,followers:6100,desc:'Upscale house music destination in the heart of DIFC. Known for impeccable sound and intimate atmosphere.',tags:['House','Deep House','Minimal'],hours:'Wed-Sat 21:00-05:00',giveaway:true,giveaway_text:'Free Drinks Package for 2 — this Friday',giveaway_ends:'Mar 12, 2026',entries:189,photos:['🌡️','🍸','🎶','✨'],upcoming:[{date:'Mar 14',event:'Deep House Friday',genre:'Deep House'}],gradient:'linear-gradient(135deg,#0d1b2a,#1b2838)'},
  {id:'c3',name:'Amber Lounge',emoji:'🔶',type:'Bar & Lounge',genre:'R&B',country:'UAE',city:'Abu Dhabi',address:'Yas Marina Circuit, Abu Dhabi',rating:4.9,reviews:504,followers:12200,desc:'Luxury lounge at Yas Marina. Famous for F1 afterparties and exclusive live R&B and jazz performances.',tags:['R&B','Jazz','Luxury'],hours:'Daily 19:00-03:00',giveaway:true,giveaway_text:'Meet & Greet with DJ Nexus — Apr 2',giveaway_ends:'Mar 30, 2026',entries:412,photos:['🔶','🥂','🎷','🏎️'],upcoming:[{date:'Apr 2',event:'DJ Nexus x Amber',genre:'R&B'}],gradient:'linear-gradient(135deg,#2d1b00,#3d2800)'},
  {id:'c4',name:'Tresor Berlin',emoji:'🔐',type:'Nightclub',genre:'Techno',country:'Germany',city:'Berlin',address:'Kopenicker Str. 70, Berlin',rating:5.0,reviews:1840,followers:94000,desc:'Legendary Berlin techno institution. The vault and main floor are iconic. No photos, total immersion in the music.',tags:['Techno','Industrial','Dark'],hours:'Fri-Sun 00:00-open',giveaway:false,giveaway_text:'',giveaway_ends:'',entries:0,photos:['🔐','🖤','💿','🔊'],upcoming:[{date:'Mar 15',event:'Tresor Regular',genre:'Techno'}],gradient:'linear-gradient(135deg,#0a0a0a,#1a0a0a)'},
  {id:'c5',name:'Fabric London',emoji:'🎪',type:'Nightclub',genre:'Electronic',country:'UK',city:'London',address:'77A Charterhouse St, London',rating:4.9,reviews:2100,followers:78000,desc:'Three rooms, three sounds. One of the most influential clubs in the world. Bodysonik floors and legendary lineups.',tags:['Electronic','Drum & Bass','House'],hours:'Fri-Sat 22:00-08:00',giveaway:true,giveaway_text:'Win a pair of tickets to the next Fabric Friday',giveaway_ends:'Mar 20, 2026',entries:631,photos:['🎪','🔊','💃','🎛️'],upcoming:[{date:'Mar 14',event:'Fabric Friday',genre:'D&B'}],gradient:'linear-gradient(135deg,#0e0a1c,#1a0a2a)'},
  {id:'c6',name:'Pacha Ibiza',emoji:'🍒',type:'Beach Club',genre:'House',country:'Spain',city:'Ibiza',address:'Av. 8 d\'Agost, Ibiza',rating:4.8,reviews:3200,followers:210000,desc:'The iconic cherry logo. The birthplace of the Ibiza sound. Resident legends and the biggest house nights on earth.',tags:['House','Commercial House','Pop'],hours:'Daily 23:00-06:00 (summer)',giveaway:true,giveaway_text:'2 tickets to opening night 2026',giveaway_ends:'Apr 1, 2026',entries:1840,photos:['🍒','🌅','💃','🎶'],upcoming:[{date:'May 28',event:'Opening Night 2026',genre:'House'}],gradient:'linear-gradient(135deg,#1a0505,#2d0a0a)'},
  {id:'c7',name:'Plastic Belgrade',emoji:'⚫',type:'Nightclub',genre:'Techno',country:'Serbia',city:'Belgrade',address:'Kej oslobodjenja, Beograd',rating:4.7,reviews:892,followers:31000,desc:'Belgrade\'s most celebrated techno club on the Sava river. Raw industrial sound and 24-hour party culture.',tags:['Techno','Progressive','Minimal'],hours:'Fri-Sun 00:00-open',giveaway:false,giveaway_text:'',giveaway_ends:'',entries:0,photos:['⚫','🌊','🔊','🎧'],upcoming:[{date:'Mar 15',event:'Resistance Belgrade',genre:'Techno'}],gradient:'linear-gradient(135deg,#0a0a0a,#0e0a1c)'},
  {id:'c8',name:'Womb Tokyo',emoji:'🏯',type:'Nightclub',genre:'Electronic',country:'Japan',city:'Tokyo',address:'2-16 Maruyamacho, Shibuya, Tokyo',rating:4.8,reviews:1120,followers:42000,desc:'Five floors of electronic music in Shibuya. Japan\'s finest sound system with an eclectic mix from techno to drum & bass.',tags:['Electronic','Techno','D&B'],hours:'Fri-Sat 23:00-05:00',giveaway:true,giveaway_text:'Win 2 tickets to Womb Anniversary Night',giveaway_ends:'Mar 25, 2026',entries:388,photos:['🏯','🎌','💡','🎵'],upcoming:[{date:'Mar 22',event:'Womb Anniversary',genre:'Electronic'}],gradient:'linear-gradient(135deg,#0e0a1c,#1a0a0a)'},
];

let activeClubId = null;

function renderClubCards(data) {
  var grid = document.getElementById('clubsGrid');
  var detail = document.getElementById('clubDetail');
  if (!grid) return;
  var countEl = document.getElementById('clubCount');
  if (countEl) countEl.textContent = data.length;
  if (detail) detail.style.display = 'none';
  grid.style.display = 'grid';
  var html = '';
  for (var i = 0; i < data.length; i++) {
    var c = data[i];
    var tags = '';
    for (var j = 0; j < c.tags.length; j++) {
      tags += '<span style="background:rgba(200,180,255,0.07);color:rgba(200,180,255,0.62);padding:2px 8px;border-radius:2px;font-size:0.62rem;letter-spacing:0.08em;text-transform:uppercase;">' + c.tags[j] + '</span>';
    }
    var badge = c.giveaway ? '<div style="position:absolute;top:10px;right:10px;background:rgba(200,169,126,0.15);border:1px solid rgba(200,169,126,0.3);color:#C8A97E;padding:3px 8px;border-radius:2px;font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Giveaway</div>' : '';
    var gbox = '';
    if (c.giveaway) {
      gbox = '<div style="background:rgba(200,169,126,0.05);border:1px solid rgba(200,169,126,0.15);border-radius:16px;padding:10px;margin-bottom:12px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
           + '<div style="font-size:0.66rem;font-weight:700;color:#C8A97E;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:3px;">Active Giveaway</div>'
           + '<div style="font-size:0.76rem;color:rgba(200,180,255,0.68);">' + c.giveaway_text + '</div>'
           + '<div style="font-size:0.68rem;color:rgba(200,180,255,0.52);margin-top:3px;">Ends ' + c.giveaway_ends + ' · ' + c.entries + ' entered</div>'
           + '</div>';
    }
    var gbtn = c.giveaway
      ? '<button class="club-enter-btn" data-cid="' + c.id + '" style="padding:8px 12px;background:rgba(200,169,126,0.08);border:1px solid rgba(200,169,126,0.2);color:#C8A97E;border-radius:16px;font-size:0.76rem;font-weight:600;cursor:pointer;letter-spacing:0.04em;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">Enter</button>'
      : '';
    html += '<div class="club-card club-open-btn" data-cid="' + c.id + '">'
          + '<div style="height:100px;display:flex;align-items:center;justify-content:center;position:relative;background:' + c.gradient + ';border-bottom:1px solid rgba(200,180,255,0.07);">'
          + badge + '</div>'
          + '<div style="padding:16px;">'
          + '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px;">'
          + '<div><div style="font-family:Inter,sans-serif;font-weight:700;font-size:0.92rem;letter-spacing:-0.01em;">' + c.name + '</div>'
          + '<div style="font-size:0.72rem;color:rgba(200,180,255,0.55);margin-top:2px;">' + c.type + ' · ' + c.city + '</div></div>'
          + '<div style="text-align:right;"><div style="font-size:0.82rem;font-weight:600;color:#C8A97E;">' + c.rating + '</div>'
          + '<div style="font-size:0.62rem;color:rgba(255,255,255,0.2);">' + c.reviews + ' reviews</div></div></div>'
          + '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;">' + tags + '</div>'
          + '<div style="font-size:0.76rem;color:rgba(200,180,255,0.55);margin-bottom:12px;line-height:1.5;">' + c.desc.substring(0,90) + '…</div>'
          + gbox
          + '<div style="display:flex;gap:8px;">'
          + '<button class="club-open-btn" data-cid="' + c.id + '" style="flex:1;padding:8px;background:#f0f0f5;border:none;color:#0d0818;border-radius:16px;font-size:0.76rem;font-weight:700;cursor:pointer;letter-spacing:0.02em;">View Venue</button>'
          + gbtn + '</div></div></div>';
  }
  grid.innerHTML = html;
  // Attach event listeners after rendering
  grid.querySelectorAll('.club-open-btn').forEach(function(el) {
    el.addEventListener('click', function(e) {
      var cid = this.getAttribute('data-cid');
      if (cid) { e.stopPropagation(); openClub(cid); }
    });
  });
  grid.querySelectorAll('.club-enter-btn').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      enterGiveaway(this.getAttribute('data-cid'));
    });
  });
}


function filterClubs() {
  var q = (document.getElementById('clubSearch') ? document.getElementById('clubSearch').value : '').toLowerCase();
  var country = document.getElementById('clubCountry') ? document.getElementById('clubCountry').value.replace(/^[^ ]+ /,'') : '';
  var city = document.getElementById('clubCity') ? document.getElementById('clubCity').value : '';
  var genre = document.getElementById('clubGenre') ? document.getElementById('clubGenre').value : '';
  var type = document.getElementById('clubType') ? document.getElementById('clubType').value : '';
  var sort = document.getElementById('clubSort') ? document.getElementById('clubSort').value : 'rating';

  var results = CLUBS_DB.filter(function(c) {
    if (q && !c.name.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q) && !c.desc.toLowerCase().includes(q)) return false;
    if (country && !c.country.includes(country)) return false;
    if (city && c.city !== city) return false;
    if (genre && c.genre !== genre && !c.tags.includes(genre)) return false;
    if (type && c.type !== type) return false;
    return true;
  });
  if (sort==='rating') results.sort(function(a,b){return b.rating-a.rating;});
  else if (sort==='giveaway') results.sort(function(a,b){return (b.giveaway?1:0)-(a.giveaway?1:0);});
  else if (sort==='popular') results.sort(function(a,b){return b.followers-a.followers;});
  renderClubCards(results);
}

function clearClubFilters() {
  ['clubSearch','clubCountry','clubCity','clubGenre','clubType'].forEach(function(id){
    var el=document.getElementById(id); if(el) el.value='';
  });
  filterClubs();
}

function quickCityFilter(city) {
  document.querySelectorAll('.gear-cat-pill').forEach(function(b){b.classList.remove('active');});
  event.target.classList.add('active');
  var el = document.getElementById('clubCity');
  if (el) el.value = city;
  filterClubs();
}

// ── TOAST ──
function showToast(msg) {
  var t = document.getElementById('toast');
  var tm = document.getElementById('toastMsg');
  if (!t || !tm) return;
  tm.textContent = msg;
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 3200);
}

// ── DRAG & DROP ──
var dropZone = document.getElementById('dropZone');
if (dropZone) {
  dropZone.addEventListener('dragover', function(e){ e.preventDefault(); dropZone.style.borderColor='var(--purple)'; });
  dropZone.addEventListener('dragleave', function(){ dropZone.style.borderColor=''; });
  dropZone.addEventListener('drop', function(e){
    e.preventDefault(); dropZone.style.borderColor='';
    var file=e.dataTransfer.files[0];
    if(file){selectedFile=file;document.getElementById('fileName').textContent=file.name;document.getElementById('fileInfo').style.display='block';dropZone.classList.add('file-selected');}
  });
}

// ── CERT MODAL OUTSIDE CLICK ──
var certModalEl = document.getElementById('certModal');
if (certModalEl) certModalEl.addEventListener('click', function(e){ if(e.target===this) closeCertModal(); });

// ── INIT ──
// ── HERO WAVEFORM ──
function initHeroWave() {
  var svg = document.getElementById('waveform-bars');
  if (!svg) return;
  var totalWidth = 1440;
  var bars = 120;
  var barW = 2;
  var gap = totalWidth / bars;
  var centerY = 90;
  var maxH = 60; // cap so y never goes negative
  var heights = [];
  for (var i = 0; i < bars; i++) {
    var base = Math.abs(Math.sin(i * 0.18) * 22 + Math.sin(i * 0.07) * 14) + Math.random() * 16 + 6;
    heights.push(Math.min(base, maxH));
  }
  var html = '';
  for (var j = 0; j < bars; j++) {
    var h = heights[j];
    var hMin = Math.max(h * 0.4, 2);
    var hMax = Math.min(h * 1.15, maxH);
    var x = j * gap + gap / 2 - barW / 2;
    var y = centerY - h / 2;
    var yMin = centerY - hMin / 2;
    var yMax = centerY - hMax / 2;
    var opacity = 0.3 + (h / 80) * 0.5;
    var col = (j % 7 === 0) ? '#C8A97E' : (j % 13 === 0) ? '#7B2FFF' : 'rgba(255,255,255,0.5)';
    html += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW + '" height="' + h.toFixed(1) + '" rx="1" fill="' + col + '" opacity="' + opacity.toFixed(2) + '">';
    html += '<animate attributeName="height" values="' + h.toFixed(1) + ';' + hMin.toFixed(1) + ';' + hMax.toFixed(1) + ';' + h.toFixed(1) + '" dur="' + (1.8 + Math.random() * 2.4).toFixed(2) + 's" repeatCount="indefinite"/>';
    html += '<animate attributeName="y" values="' + y.toFixed(1) + ';' + yMin.toFixed(1) + ';' + yMax.toFixed(1) + ';' + y.toFixed(1) + '" dur="' + (1.8 + Math.random() * 2.4).toFixed(2) + 's" repeatCount="indefinite"/>';
    html += '</rect>';
  }
  svg.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  // Hero waveform
  initHeroWave();

  // Set hero logo from hidden img
  var hidden = document.getElementById('fortis-logo-hidden');
  var heroLogo = document.getElementById('hero-logo');
  if (hidden && heroLogo) heroLogo.src = hidden.src;

  // Init pages
  renderDiscoverCards(ARTISTS_DB);
  renderGearCards();
  renderDanceCards();
  renderStudioCards();
  renderClubCards(CLUBS_DB);
  renderEventCards(EVENTS_DB.filter(function(e){ return !e.featured; }));
  renderEventFeatured(EVENTS_DB);
  initHomePage();
  loadHomeTrendingArtists();

  // Restore last visited page
  var _lastPage = localStorage.getItem('fm_last_page');
  if (_lastPage && document.getElementById('page-' + _lastPage)) { showPage(_lastPage); }

  // Modal outside click handlers
  ['donateModal','unlockModal','bioModal','certModal'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', function(e){ if(e.target===this) this.classList.remove('show'); });
  });
});

function openClub(id) {
  var c = CLUBS_DB.find(function(x){ return x.id === id; });
  if (!c) return;
  activeClubId = id;
  var grid = document.getElementById('clubsGrid');
  var detail = document.getElementById('clubDetail');
  if (grid) grid.style.display = 'none';
  if (!detail) return;
  detail.style.display = 'block';

  var upcoming = '';
  for (var i = 0; i < c.upcoming.length; i++) {
    var ev = c.upcoming[i];
    var parts = ev.date.split(' ');
    upcoming += '<div style="display:flex;gap:12px;align-items:center;background:#0d0818;border-radius:10px;padding:12px;">'
      + '<div style="background:linear-gradient(135deg,#E91E8C,#7B2FFF);border-radius:8px;padding:6px 10px;text-align:center;min-width:46px;flex-shrink:0;">'
      + '<div style="font-size:0.65rem;color:rgba(255,255,255,0.7);">' + parts[0] + '</div>'
      + '<div style="font-size:1.1rem;font-weight:800;color:#fff;line-height:1;">' + (parts[1]||'') + '</div></div>'
      + '<div style="flex:1;"><div style="font-size:0.85rem;font-weight:600;">' + ev.event + '</div>'
      + '<div style="font-size:0.72rem;color:#a090b8;">' + ev.genre + '</div></div>'
      + '<button class="ticket-btn" data-ev="' + ev.event + '" style="padding:5px 10px;background:rgba(123,47,255,0.12);border:1px solid rgba(123,47,255,0.3);color:#A06EFF;border-radius:7px;font-size:0.72rem;cursor:pointer;">Tickets</button>'
      + '</div>';
  }

  var photos = '';
  for (var p = 0; p < c.photos.length; p++) {
    photos += '<div style="aspect-ratio:16/9;background:' + c.gradient + ';border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;">' + c.photos[p] + '</div>';
  }

  var giveawaySection = '';
  if (c.giveaway) {
    giveawaySection = '<div style="background:linear-gradient(135deg,rgba(255,215,0,0.08),rgba(233,30,140,0.08));border:1px solid rgba(255,215,0,0.25);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
      + '<div style="font-family:Inter,sans-serif;font-weight:800;font-size:1rem;margin-bottom:8px;">&#127922; Active Giveaway</div>'
      + '<div style="font-size:0.88rem;font-weight:600;margin-bottom:6px;">' + c.giveaway_text + '</div>'
      + '<div style="color:#a090b8;font-size:0.78rem;margin-bottom:14px;">Ends ' + c.giveaway_ends + ' - ' + c.entries + ' entered</div>'
      + '<button id="detail-enter-btn" data-cid="' + c.id + '" style="width:100%;padding:12px;background:linear-gradient(135deg,#FFD700,#E91E8C);border:none;color:#fff;border-radius:10px;font-size:0.92rem;font-weight:800;cursor:pointer;">Enter Giveaway - Free</button>'
      + '<div style="font-size:0.7rem;color:#a090b8;text-align:center;margin-top:6px;">Winners picked randomly - Fortis verified</div></div>';
  }

  detail.innerHTML = '<button id="club-back-btn" style="display:flex;align-items:center;gap:8px;padding:8px 16px;background:rgba(200,180,255,0.09);border:1px solid rgba(123,47,255,0.28);color:#a090b8;border-radius:10px;cursor:pointer;font-size:0.85rem;margin-bottom:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">← Back</button>'
    + '<div style="background:' + c.gradient + ';border-radius:20px;padding:28px;margin-bottom:24px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;">'
    + '<div style="font-size:4rem;">' + c.emoji + '</div>'
    + '<div style="flex:1;min-width:200px;">'
    + '<h2 style="font-family:Inter,sans-serif;font-weight:800;font-size:1.6rem;margin-bottom:6px;">' + c.name + '</h2>'
    + '<div style="color:rgba(200,180,255,0.72);font-size:0.85rem;margin-bottom:8px;">&#128205; ' + c.address + '</div>'
    + '<div style="display:flex;gap:16px;flex-wrap:wrap;">'
    + '<span style="color:rgba(200,180,255,0.72);font-size:0.82rem;">&#9200; ' + c.hours + '</span>'
    + '<span style="color:#FFD700;font-size:0.82rem;">&#9733; ' + c.rating + ' (' + c.reviews + ' reviews)</span>'
    + '</div></div>'
    + '<div style="display:flex;flex-direction:column;gap:8px;">'
    + '<button id="club-directions-btn" style="padding:10px 18px;background:rgba(255,255,255,0.15);border:1px solid rgba(123,47,255,0.28);color:#fff;border-radius:12px;font-size:0.85rem;cursor:pointer;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">&#128205; Directions</button>'
    + '<button id="club-follow-btn" data-name="' + c.name + '" style="padding:10px 18px;background:linear-gradient(135deg,#E91E8C,#7B2FFF);border:none;color:#fff;border-radius:12px;font-size:0.85rem;font-weight:700;cursor:pointer;">+ Follow</button>'
    + '</div></div>'
    + '<div class="detail-grid-2col" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">'
    + '<div style="display:flex;flex-direction:column;gap:16px;">'
    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:10px;">About</div>'
    + '<p style="color:#a090b8;font-size:0.85rem;line-height:1.6;">' + c.desc + '</p></div>'
    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:12px;">&#128247; Gallery</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' + photos + '</div></div>'
    + '<div style="background:#1a1428;border:1px solid rgba(200,180,255,0.13);border-radius:14px;overflow:hidden;">'
    + '<div style="padding:14px 16px;font-family:Inter,sans-serif;font-weight:700;font-size:0.9rem;">&#9654;&#65039; Highlights</div>'
    + '<div style="position:relative;padding-bottom:56.25%;height:0;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" allowfullscreen loading="lazy"></iframe></div>'
    + '</div></div>'
    + '<div style="display:flex;flex-direction:column;gap:16px;">'
    + giveawaySection
    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:12px;">&#128197; Upcoming Events</div>'
    + '<div style="display:flex;flex-direction:column;gap:10px;">' + upcoming + '</div></div>'
    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;">Fan Reviews</div>'
    + '<button id="add-review-btn" style="padding:5px 12px;background:rgba(123,47,255,0.12);border:1px solid rgba(123,47,255,0.3);color:#A06EFF;border-radius:8px;font-size:0.75rem;cursor:pointer;">+ Write Review</button>'
    + '</div>'
    + '<div id="club-reviews-list" style="display:flex;flex-direction:column;gap:10px;">'
    + '<div class="review-item"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:0.82rem;font-weight:600;">Alex M.</span><span style="color:#FFD700;font-size:0.78rem;">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div><div style="font-size:0.78rem;color:#a090b8;">Absolutely incredible night. Won VIP tickets through Fortis - best night ever!</div></div>'
    + '<div class="review-item"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:0.82rem;font-weight:600;">Sarah K.</span><span style="color:#FFD700;font-size:0.78rem;">&#9733;&#9733;&#9733;&#9733;&#9734;</span></div><div style="font-size:0.78rem;color:#a090b8;">Great atmosphere, love finding events on Fortis and entering giveaways.</div></div>'
    + '</div></div>'
    + '</div></div>';

  // Attach events after render
  var backBtn = document.getElementById('club-back-btn');
  if (backBtn) backBtn.addEventListener('click', closeClubDetail);

  var dirBtn = document.getElementById('club-directions-btn');
  if (dirBtn) dirBtn.addEventListener('click', function(){ showToast('Opening maps...'); });

  var followBtn = document.getElementById('club-follow-btn');
  if (followBtn) followBtn.addEventListener('click', function(){
    showToast('Following ' + this.getAttribute('data-name') + '!');
  });

  var enterBtn = document.getElementById('detail-enter-btn');
  if (enterBtn) enterBtn.addEventListener('click', function(){
    enterGiveaway(this.getAttribute('data-cid'));
  });

  detail.querySelectorAll('.ticket-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      showToast('Tickets for ' + this.getAttribute('data-ev') + '!');
    });
  });

  var reviewBtn = document.getElementById('add-review-btn');
  if (reviewBtn) reviewBtn.addEventListener('click', addClubReview);
}

function closeClubDetail() {
  var detail = document.getElementById('clubDetail');
  var grid = document.getElementById('clubsGrid');
  if (detail) detail.style.display = 'none';
  if (grid) grid.style.display = 'grid';
}

function enterGiveaway(clubId) {
  var c = CLUBS_DB.find(function(x){ return x.id === clubId; });
  if (!c) return;
  c.entries++;
  showToast('Entered giveaway at ' + c.name + '! Good luck!');
  addFanActivity('🎰', 'Entered giveaway at ' + c.name, 'Just now');
  var prizesList = document.getElementById('fan-club-prizes');
  if (prizesList) {
    var item = document.createElement('div');
    item.style.cssText = 'background:#0d0818;border:1px solid rgba(123,47,255,0.15);border-radius:10px;padding:12px;display:flex;align-items:center;gap:10px;';
    item.innerHTML = '<div style="font-size:1.6rem;flex-shrink:0;">&#127922;</div>'
      + '<div style="flex:1;"><div style="font-size:0.85rem;font-weight:600;">Giveaway - ' + c.name + '</div>'
      + '<div style="font-size:0.72rem;color:#a090b8;">Ends ' + c.giveaway_ends + '</div></div>'
      + '<span style="background:rgba(123,47,255,0.12);color:#A06EFF;padding:3px 10px;border-radius:8px;font-size:0.7rem;font-weight:700;">Entered</span>';
    prizesList.insertBefore(item, prizesList.firstChild);
  }
}

function addClubReview() {
  var text = prompt('Write your review:');
  if (!text || !text.trim()) return;
  var list = document.getElementById('club-reviews-list');
  if (!list) return;
  var item = document.createElement('div');
  item.className = 'review-item';
  item.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:5px;">'
    + '<span style="font-size:0.82rem;font-weight:600;">You <span style="color:#a090b8;">- Just now</span></span>'
    + '<span style="color:#FFD700;font-size:0.78rem;">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>'
    + '<div style="font-size:0.78rem;color:#a090b8;">' + text + '</div>';
  list.insertBefore(item, list.firstChild);
  showToast('Review posted!');
  addFanActivity('💬', 'Left a club review', 'Just now');
}

// ══════════════════════════════════════
// EVENTS PAGE
// ══════════════════════════════════════
var evtActiveTab = '';

var EVENTS_DB = [
  {id:'e1', name:'Ultra Music Festival', cat:'Festival', genre:'Electronic', country:'USA', city:'Miami',
   date:'2026-03-27', month:3, venue:'Bayfront Park', price:299, currency:'USD',
   emoji:'🎡', gradient:'linear-gradient(135deg,#0d0d2b,#1a0a3a)',
   headliners:['Martin Garrix','Hardwell','Alesso'], capacity:165000, attending:142000,
   desc:'The world\'s premier electronic music festival returns to Miami for its 25th edition. Three days of non-stop music across multiple stages.',
   tags:['Electronic','EDM','Trance','House'], website:'ultramusicfestival.com', featured:true},

  {id:'e2', name:'EXIT Festival', cat:'Festival', genre:'Multi-Genre', country:'Serbia', city:'Novi Sad',
   date:'2026-07-09', month:7, venue:'Petrovaradin Fortress', price:89, currency:'EUR',
   emoji:'🏰', gradient:'linear-gradient(135deg,#1a0520,#2d0a3a)',
   headliners:['Gorillaz','Massive Attack','Carl Cox'], capacity:55000, attending:41000,
   desc:'One of Europe\'s most beloved festivals set inside a 18th-century fortress. EXIT delivers rock, electronic and urban music across 40 stages.',
   tags:['Multi-Genre','Electronic','Rock'], website:'exitfest.org', featured:true},

  {id:'e3', name:'Fortis Music Showcase', cat:'Showcase', genre:'Multi-Genre', country:'UAE', city:'Dubai',
   date:'2026-03-15', month:3, venue:'Warehouse 14, Al Quoz', price:0, currency:'EUR',
   emoji:'🛡️', gradient:'linear-gradient(135deg,#1a0a2e,#2d0a4a)',
   headliners:['Luna Rivera','DJ Nexus','Zara Pulse'], capacity:800, attending:620,
   desc:'The official Fortis Music platform launch showcase. Meet Fortis-verified artists, see live demos of blockchain rights protection and support music directly.',
   tags:['Electronic','House','Showcase'], website:'fortismusic.com', featured:true},

  {id:'e4', name:'Musikmesse Frankfurt', cat:'Gear Expo', genre:'Multi-Genre', country:'Germany', city:'Frankfurt',
   date:'2026-04-08', month:4, venue:'Messe Frankfurt', price:35, currency:'EUR',
   emoji:'🎸', gradient:'linear-gradient(135deg,#0a1a0a,#0a2a1a)',
   headliners:['Roland','Yamaha','Native Instruments','Pioneer DJ'], capacity:80000, attending:71000,
   desc:'The world\'s leading music industry trade fair. Discover the latest instruments, pro audio gear, DJ equipment, and music tech from 1,800+ exhibitors across 12 halls.',
   tags:['Gear Expo','Pro Audio','DJ Gear','Instruments'], website:'musikmesse.com', featured:false},

  {id:'e5', name:'Awakenings Festival', cat:'Festival', genre:'Techno', country:'Netherlands', city:'Amsterdam',
   date:'2026-06-27', month:6, venue:'Spaarnwoude', price:115, currency:'EUR',
   emoji:'⚡', gradient:'linear-gradient(135deg,#0e0a1c,#1a0a2a)',
   headliners:['Adam Beyer','Charlotte de Witte','Amelie Lens'], capacity:35000, attending:29000,
   desc:'The world\'s biggest techno festival returns to Amsterdam. Two days of pure underground techno in an iconic outdoor setting with a legendary lineup.',
   tags:['Techno','Industrial','Underground'], website:'awakenings.com', featured:false},

  {id:'e6', name:'NAMM Show 2026', cat:'Gear Expo', genre:'Multi-Genre', country:'USA', city:'Las Vegas',
   date:'2026-04-24', month:4, venue:'Las Vegas Convention Center', price:25, currency:'USD',
   emoji:'🎛️', gradient:'linear-gradient(135deg,#1a0a00,#2a1500)',
   headliners:['Gibson','Fender','Steinberg','Ableton'], capacity:95000, attending:87000,
   desc:'The global crossroads of the music products industry. NAMM brings together professionals from 139 countries to discover what\'s next in music technology and innovation.',
   tags:['Gear Expo','Music Tech','Instruments','Recording'], website:'namm.org', featured:false},

  {id:'e7', name:'Sonar Festival', cat:'Festival', genre:'Electronic', country:'Spain', city:'Barcelona',
   date:'2026-06-18', month:6, venue:'Fira de Barcelona', price:135, currency:'EUR',
   emoji:'🔊', gradient:'linear-gradient(135deg,#0a1a0a,#0a0a2a)',
   headliners:['Aphex Twin','Four Tet','Floating Points'], capacity:30000, attending:24000,
   desc:'Where creativity and technology meet. Sonar merges advanced music with multimedia art. Three days of day and night stages with the most forward-thinking electronic artists.',
   tags:['Electronic','Experimental','Art'], website:'sonar.es', featured:false},

  {id:'e8', name:'Fortis DJ Championship UAE', cat:'Showcase', genre:'Electronic', country:'UAE', city:'Dubai',
   date:'2026-04-05', month:4, venue:'Coca-Cola Arena, Dubai', price:45, currency:'AED',
   emoji:'🏆', gradient:'linear-gradient(135deg,#1a1000,#2a2000)',
   headliners:['DJ Nexus','DJ Echo','Guest Judges'], capacity:5000, attending:3200,
   desc:'The first official Fortis DJ Championship. Compete or watch as DJs from across the UAE battle for the title. Prize: Fortis platform partnership + €5,000.',
   tags:['House','Techno','DJ Battle'], website:'fortismusic.com', featured:false},

  {id:'e9', name:'Primavera Sound', cat:'Festival', genre:'Multi-Genre', country:'Spain', city:'Barcelona',
   date:'2026-05-28', month:5, venue:'Parc del Forum', price:175, currency:'EUR',
   emoji:'🌸', gradient:'linear-gradient(135deg,#1a0010,#2a0020)',
   headliners:['Radiohead','Lorde','Bicep'], capacity:60000, attending:55000,
   desc:'Barcelona\'s beloved festival blending indie, electronic and alternative music. One of the most critically acclaimed music events in the world.',
   tags:['Indie','Electronic','Alternative','Rock'], website:'primaverasound.com', featured:false},

  {id:'e10', name:'DJ Mag Headquarters', cat:'Conference', genre:'Electronic', country:'UK', city:'London',
   date:'2026-03-20', month:3, venue:'Magazine London', price:65, currency:'GBP',
   emoji:'🎙️', gradient:'linear-gradient(135deg,#0a0a0a,#1a0a1a)',
   headliners:['Various Industry Speakers'], capacity:1200, attending:980,
   desc:'The annual DJ Mag conference bringing together DJs, producers, label heads and music tech innovators for keynotes, panels and networking sessions.',
   tags:['Conference','Industry','Networking'], website:'djmag.com', featured:false},

  {id:'e11', name:'Afro Nation Portugal', cat:'Festival', genre:'Afrobeats', country:'Spain', city:'Barcelona',
   date:'2026-07-02', month:7, venue:'Praia de Vagueira', price:149, currency:'EUR',
   emoji:'🌍', gradient:'linear-gradient(135deg,#1a0a00,#2a1500)',
   headliners:['Burna Boy','Wizkid','Davido'], capacity:40000, attending:36000,
   desc:'The world\'s biggest Afrobeats festival returns to Europe. Three days of Afrobeats, amapiano and dancehall on a stunning beach location.',
   tags:['Afrobeats','Amapiano','Dancehall'], website:'astronation.co', featured:false},

  {id:'e12', name:'Abu Dhabi Jazz Festival', cat:'Concert', genre:'Jazz', country:'UAE', city:'Abu Dhabi',
   date:'2026-04-17', month:4, venue:'Emirates Palace', price:120, currency:'AED',
   emoji:'🎷', gradient:'linear-gradient(135deg,#0e0a1c,#1a0a0a)',
   headliners:['Norah Jones','Gregory Porter','Ibrahim Maalouf'], capacity:3000, attending:2600,
   desc:'The UAE\'s most prestigious jazz festival set against the stunning backdrop of Emirates Palace. Four nights of world-class jazz from international legends.',
   tags:['Jazz','Blues','Soul'], website:'abudhabilazz.ae', featured:false},
];

function setEvtTab(btn, cat) {
  document.querySelectorAll('.evt-tab').forEach(function(b){ b.classList.remove('active-tab'); });
  btn.classList.add('active-tab');
  evtActiveTab = cat;
  filterEvents();
}

function renderEventFeatured(data) {
  var featured = data.filter(function(e){ return e.featured; });
  var el = document.getElementById('evtFeatured');
  if (!el || featured.length === 0) return;
  el.innerHTML = '<div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:12px;">Featured Events</div>'
    + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:10px;">'
    + featured.map(function(e){
        var tags = e.tags.slice(0,2).map(function(t){ return '<span style="background:rgba(200,180,255,0.09);color:rgba(200,180,255,0.62);padding:2px 8px;border-radius:2px;font-size:0.62rem;letter-spacing:0.08em;text-transform:uppercase;">' + t + '</span>'; }).join('');
        var priceStr = e.price === 0 ? 'Free' : e.currency + ' ' + e.price;
        return '<div class="evt-card-featured evt-open-btn" data-eid="' + e.id + '" style="background:' + e.gradient + ';border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:18px;cursor:pointer;">'
          + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'
          + '<div><div style="font-weight:700;font-family:Inter,sans-serif;font-size:0.94rem;letter-spacing:-0.01em;">' + e.name + '</div>'
          + '<div style="font-size:0.72rem;color:rgba(255,255,255,0.4);margin-top:2px;">' + e.city + ' · ' + formatEvtDate(e.date) + '</div></div>'
          + '<div style="font-size:0.9rem;font-weight:700;color:#C8A97E;">' + priceStr + '</div></div>'
          + '<div style="display:flex;gap:4px;flex-wrap:wrap;">' + tags + '</div></div>';
      }).join('')
    + '</div>';
  el.querySelectorAll('.evt-open-btn').forEach(function(el){
    el.addEventListener('click', function(){ openEvent(this.getAttribute('data-eid')); });
  });
}

function formatEvtDate(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
}

function renderEventCards(data) {
  var grid = document.getElementById('eventsGrid');
  var detail = document.getElementById('eventDetail');
  var countEl = document.getElementById('evtCount');
  if (!grid) return;
  if (detail) detail.style.display = 'none';
  grid.style.display = 'grid';
  if (countEl) countEl.textContent = data.length;
  if (data.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:rgba(200,180,255,0.52);font-size:0.88rem;">No events found. Try different filters.</div>';
    return;
  }
  var html = '';
  for (var i = 0; i < data.length; i++) {
    var e = data[i];
    var priceStr = e.price === 0 ? 'Free' : e.currency + ' ' + e.price;
    var pctFull = Math.round((e.attending / e.capacity) * 100);
    var tags = e.tags.slice(0,3).map(function(t){ return '<span style="background:rgba(200,180,255,0.07);color:rgba(200,180,255,0.58);padding:2px 8px;border-radius:2px;font-size:0.62rem;letter-spacing:0.08em;text-transform:uppercase;">' + t + '</span>'; }).join('');
    html += '<div class="evt-card evt-open-btn" data-eid="' + e.id + '" style="background:rgba(255,255,255,0.025);border:1px solid rgba(200,180,255,0.11);border-radius:16px;overflow:hidden;cursor:pointer;transition:border-color 0.15s;" onmouseover="this.style.borderColor=\'rgba(200,169,126,0.2)\'" onmouseout="this.style.borderColor=\'rgba(200,180,255,0.11)\'">'
          + '<div style="height:90px;background:' + e.gradient + ';display:flex;align-items:flex-end;justify-content:space-between;padding:12px 16px;">'
          + '<div style="font-size:0.66rem;background:rgba(0,0,0,0.3);color:rgba(255,255,255,0.6);padding:2px 8px;border-radius:2px;letter-spacing:0.08em;text-transform:uppercase;">' + e.cat + '</div>'
          + '<div style="font-size:0.9rem;font-weight:700;color:#C8A97E;">' + priceStr + '</div>'
          + '</div>'
          + '<div style="padding:14px 16px;">'
          + '<div style="font-family:Inter,sans-serif;font-weight:700;font-size:0.9rem;margin-bottom:4px;letter-spacing:-0.01em;">' + e.name + '</div>'
          + '<div style="font-size:0.72rem;color:rgba(200,180,255,0.55);margin-bottom:4px;">' + e.venue + ' · ' + e.city + '</div>'
          + '<div style="font-size:0.72rem;color:rgba(200,169,126,0.7);margin-bottom:10px;">' + formatEvtDate(e.date) + '</div>'
          + '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;">' + tags + '</div>'
          + '<div style="margin-bottom:12px;">'
          + '<div style="display:flex;justify-content:space-between;font-size:0.68rem;color:rgba(200,180,255,0.55);margin-bottom:4px;"><span>Attendance</span><span>' + e.attending.toLocaleString() + ' / ' + e.capacity.toLocaleString() + '</span></div>'
          + '<div style="height:2px;background:rgba(200,180,255,0.11);border-radius:1px;">'
          + '<div style="height:100%;width:' + pctFull + '%;background:#C8A97E;border-radius:1px;"></div></div></div>'
          + '<button class="evt-open-btn" data-eid="' + e.id + '" style="width:100%;padding:9px;background:#f0f0f5;border:none;color:#0d0818;border-radius:16px;font-size:0.78rem;font-weight:700;cursor:pointer;letter-spacing:0.02em;">View Event</button>'
          + '</div></div>';
  }
  grid.innerHTML = html;
  grid.querySelectorAll('.evt-open-btn').forEach(function(el){
    el.addEventListener('click', function(){ openEvent(this.getAttribute('data-eid')); });
  });
}

function filterEvents() {
  var q = (document.getElementById('evtSearch') ? document.getElementById('evtSearch').value : '').toLowerCase();
  var country = document.getElementById('evtCountry') ? document.getElementById('evtCountry').value : '';
  var city = document.getElementById('evtCity') ? document.getElementById('evtCity').value : '';
  var genre = document.getElementById('evtGenre') ? document.getElementById('evtGenre').value : '';
  var month = document.getElementById('evtMonth') ? document.getElementById('evtMonth').value : '';
  var sort = document.getElementById('evtSort') ? document.getElementById('evtSort').value : 'date';

  var results = EVENTS_DB.filter(function(e) {
    if (evtActiveTab && e.cat !== evtActiveTab) return false;
    if (q && !e.name.toLowerCase().includes(q) && !e.city.toLowerCase().includes(q) && !e.venue.toLowerCase().includes(q)) return false;
    if (country && e.country !== country) return false;
    if (city && e.city !== city) return false;
    if (genre && e.genre !== genre && !e.tags.includes(genre)) return false;
    if (month && e.month !== parseInt(month)) return false;
    return true;
  });

  if (sort === 'date') results.sort(function(a,b){ return new Date(a.date) - new Date(b.date); });
  else if (sort === 'popular') results.sort(function(a,b){ return b.attending - a.attending; });
  else if (sort === 'price') results.sort(function(a,b){ return a.price - b.price; });

  renderEventFeatured(results);
  renderEventCards(results.filter(function(e){ return !e.featured; }));
  document.getElementById('evtCount').textContent = results.length;
}

function clearEvtFilters() {
  ['evtSearch','evtCountry','evtCity','evtGenre','evtMonth'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.value = '';
  });
  evtActiveTab = '';
  document.querySelectorAll('.evt-tab').forEach(function(b){ b.classList.remove('active-tab'); });
  var all = document.querySelector('.evt-tab[data-cat=""]');
  if (all) all.classList.add('active-tab');
  filterEvents();
}

function openEvent(id) {
  var e = EVENTS_DB.find(function(x){ return x.id === id; });
  if (!e) return;
  var grid = document.getElementById('eventsGrid');
  var feat = document.getElementById('evtFeatured');
  var detail = document.getElementById('eventDetail');
  if (grid) grid.style.display = 'none';
  if (feat) feat.style.display = 'none';
  if (!detail) return;
  detail.style.display = 'block';

  var priceStr = e.price === 0 ? 'FREE ENTRY' : e.currency + ' ' + e.price;
  var pctFull = Math.round((e.attending / e.capacity) * 100);
  var headliners = e.headliners.map(function(h){
    return '<div style="background:#0d0818;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;">'
      + '<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#E91E8C,#7B2FFF);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;">&#127908;</div>'
      + '<div style="font-size:0.88rem;font-weight:600;">' + h + '</div></div>';
  }).join('');
  var tags = e.tags.map(function(t){
    return '<span style="background:rgba(123,47,255,0.12);color:#A06EFF;padding:3px 10px;border-radius:10px;font-size:0.78rem;">' + t + '</span>';
  }).join('');

  detail.innerHTML = '<button id="evt-back-btn" style="display:flex;align-items:center;gap:8px;padding:8px 16px;background:rgba(200,180,255,0.09);border:1px solid rgba(123,47,255,0.28);color:#a090b8;border-radius:10px;cursor:pointer;font-size:0.85rem;margin-bottom:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">← Back to Events</button>'

    + '<div style="background:' + e.gradient + ';border-radius:20px;padding:32px;margin-bottom:24px;display:flex;align-items:center;gap:24px;flex-wrap:wrap;">'
    + '<div style="font-size:5rem;">' + e.emoji + '</div>'
    + '<div style="flex:1;min-width:200px;">'
    + '<div style="font-size:0.75rem;color:rgba(200,180,255,0.72);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">' + e.cat + '</div>'
    + '<h2 style="font-family:Inter,sans-serif;font-weight:800;font-size:1.8rem;margin-bottom:8px;">' + e.name + '</h2>'
    + '<div style="color:rgba(255,255,255,0.7);font-size:0.88rem;margin-bottom:4px;">&#128205; ' + e.venue + ' - ' + e.city + ', ' + e.country + '</div>'
    + '<div style="color:rgba(255,255,255,0.7);font-size:0.88rem;">&#128197; ' + formatEvtDate(e.date) + '</div>'
    + '</div>'
    + '<div style="display:flex;flex-direction:column;gap:8px;min-width:160px;">'
    + '<div style="text-align:center;background:rgba(0,0,0,0.3);border-radius:14px;padding:14px 20px;">'
    + '<div style="font-size:1.6rem;font-weight:800;color:#00E676;">' + priceStr + '</div>'
    + '<div style="font-size:0.72rem;color:rgba(200,180,255,0.72);margin-top:2px;">per ticket</div></div>'
    + '<button id="evt-ticket-btn" style="padding:12px 20px;background:linear-gradient(135deg,#E91E8C,#7B2FFF);border:none;color:#fff;border-radius:12px;font-size:0.9rem;font-weight:800;cursor:pointer;">&#127915; Get Tickets</button>'
    + '<button id="evt-save-btn" style="padding:10px 20px;background:rgba(255,255,255,0.1);border:1px solid rgba(123,47,255,0.28);color:#fff;border-radius:12px;font-size:0.85rem;cursor:pointer;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">&#9825; Save Event</button>'
    + '</div></div>'

    + '<div class="detail-grid-2col" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">'

    + '<div style="display:flex;flex-direction:column;gap:16px;">'

    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:10px;">About</div>'
    + '<p style="color:#a090b8;font-size:0.85rem;line-height:1.6;">' + e.desc + '</p>'
    + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px;">' + tags + '</div></div>'

    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:14px;">&#127908; Lineup / Headliners</div>'
    + '<div style="display:flex;flex-direction:column;gap:8px;">' + headliners + '</div></div>'

    + '<div style="background:#1a1428;border:1px solid rgba(200,180,255,0.13);border-radius:14px;overflow:hidden;">'
    + '<div style="padding:14px 16px;font-family:Inter,sans-serif;font-weight:700;font-size:0.9rem;">&#9654;&#65039; Event Highlights</div>'
    + '<div style="position:relative;padding-bottom:56.25%;height:0;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" allowfullscreen loading="lazy"></iframe></div>'
    + '</div></div>'

    + '<div style="display:flex;flex-direction:column;gap:16px;">'

    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:14px;">&#128202; Event Stats</div>'
    + '<div style="display:flex;flex-direction:column;gap:12px;">'
    + '<div><div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:5px;"><span style="color:#a090b8;">Attendance</span><span style="font-weight:600;">' + e.attending.toLocaleString() + ' / ' + e.capacity.toLocaleString() + '</span></div>'
    + '<div style="height:8px;background:rgba(200,180,255,0.09);border-radius:4px;"><div style="height:100%;width:' + pctFull + '%;background:linear-gradient(90deg,#E91E8C,#7B2FFF);border-radius:4px;"></div></div>'
    + '<div style="font-size:0.72rem;color:#E91E8C;margin-top:3px;">' + pctFull + '% capacity</div></div>'
    + '<div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid rgba(200,180,255,0.09);"><span style="color:#a090b8;font-size:0.82rem;">Genre</span><span style="font-size:0.82rem;font-weight:600;">' + e.genre + '</span></div>'
    + '<div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid rgba(200,180,255,0.09);"><span style="color:#a090b8;font-size:0.82rem;">Venue Capacity</span><span style="font-size:0.82rem;font-weight:600;">' + e.capacity.toLocaleString() + '</span></div>'
    + '<div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid rgba(200,180,255,0.09);"><span style="color:#a090b8;font-size:0.82rem;">Website</span><span style="font-size:0.82rem;color:#A06EFF;">' + e.website + '</span></div>'
    + '</div></div>'

    + '<div style="background:linear-gradient(135deg,rgba(233,30,140,0.08),rgba(123,47,255,0.08));border:1px solid rgba(123,47,255,0.2);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;margin-bottom:8px;">&#127918; Fortis Giveaway</div>'
    + '<div style="font-size:0.85rem;color:#a090b8;margin-bottom:14px;">Win 2 tickets + backstage pass to ' + e.name + '. Fortis fans only — enter with your Fortis account.</div>'
    + '<button id="evt-giveaway-btn" style="width:100%;padding:11px;background:linear-gradient(135deg,#FFD700,#E91E8C);border:none;color:#fff;border-radius:10px;font-size:0.88rem;font-weight:800;cursor:pointer;">&#127922; Enter Giveaway</button>'
    + '<div style="font-size:0.7rem;color:#a090b8;text-align:center;margin-top:6px;">437 people entered - ends 3 days before event</div></div>'

    + '<div style="background:#1a1428;border:1px solid rgba(123,47,255,0.28);border-radius:14px;padding:20px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
    + '<div style="font-family:Inter,sans-serif;font-weight:700;">&#128172; Fan Reviews</div>'
    + '<button id="evt-review-btn" style="padding:5px 12px;background:rgba(123,47,255,0.12);border:1px solid rgba(123,47,255,0.3);color:#A06EFF;border-radius:8px;font-size:0.75rem;cursor:pointer;">+ Write Review</button>'
    + '</div>'
    + '<div id="evt-reviews-list" style="display:flex;flex-direction:column;gap:10px;">'
    + '<div class="review-item"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:0.82rem;font-weight:600;">Marco B. <span style="color:#a090b8;">- Gold Fan</span></span><span style="color:#FFD700;font-size:0.78rem;">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div><div style="font-size:0.78rem;color:#a090b8;">Absolutely life-changing experience. Sound quality and production were insane. Cannot wait for next year!</div></div>'
    + '<div class="review-item"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:0.82rem;font-weight:600;">Lena V.</span><span style="color:#FFD700;font-size:0.78rem;">&#9733;&#9733;&#9733;&#9733;&#9734;</span></div><div style="font-size:0.78rem;color:#a090b8;">Great lineup but queue management could be improved. Music itself was phenomenal.</div></div>'
    + '</div></div>'

    + '</div></div>';

  var backBtn = document.getElementById('evt-back-btn');
  if (backBtn) backBtn.addEventListener('click', closeEventDetail);

  var ticketBtn = document.getElementById('evt-ticket-btn');
  if (ticketBtn) ticketBtn.addEventListener('click', function(){ showToast('Opening ticket page for ' + e.name + '...'); });

  var saveBtn = document.getElementById('evt-save-btn');
  if (saveBtn) saveBtn.addEventListener('click', function(){
    showToast('Event saved to your profile!');
    addFanActivity('📅', 'Saved event: ' + e.name, 'Just now');
  });

  var giveawayBtn = document.getElementById('evt-giveaway-btn');
  if (giveawayBtn) giveawayBtn.addEventListener('click', function(){
    showToast('Entered giveaway for ' + e.name + '! Good luck!');
    addFanActivity('🎰', 'Entered event giveaway: ' + e.name, 'Just now');
  });

  var reviewBtn = document.getElementById('evt-review-btn');
  if (reviewBtn) reviewBtn.addEventListener('click', function(){
    var text = prompt('Write your review:');
    if (!text || !text.trim()) return;
    var list = document.getElementById('evt-reviews-list');
    if (!list) return;
    var item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:0.82rem;font-weight:600;">You</span><span style="color:#FFD700;font-size:0.78rem;">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div><div style="font-size:0.78rem;color:#a090b8;">' + text.trim() + '</div>';
    list.insertBefore(item, list.firstChild);
    showToast('Review posted!');
  });
}
function closeEventDetail() {
  var grid = document.getElementById('eventsGrid');
  var feat = document.getElementById('evtFeatured');
  var detail = document.getElementById('eventDetail');
  if (grid) grid.style.display = '';
  if (feat) feat.style.display = '';
  if (detail) detail.style.display = 'none';
}
window.addEventListener('DOMContentLoaded', function() {
  renderGearCards();
  renderDanceCards();
  renderStudioCards();
  filterArtists();
  filterClubs();
  filterEvents();
});

var nowDropSecs = 47*60+33;
var nowDropRegistered = false;
var nowDropCount = 1203;
var NOW_FEED = [
  {bg:'rgba(123,47,255,0.15)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',text:'<b>Luna Rivera</b> started a live collab session',sub:'Session: Neon Pulse',time:'just now'},
  {bg:'rgba(0,230,118,0.12)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',text:'<b>Marco B.</b> tipped <b>DJ Nexus</b> 5.00',sub:'on track: Voltage',time:'1m ago'},
  {bg:'rgba(255,215,0,0.1)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',text:'<b>Sofia M.</b> registered for the drop',sub:'Midnight Echo',time:'3m ago'},
  {bg:'rgba(123,47,255,0.15)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',text:'<b>Yuki T.</b> earned Early Listener badge #47',sub:'Voltage by DJ Nexus',time:'4m ago'},
  {bg:'rgba(200,180,255,0.09)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',text:'<b>Carlos R.</b> posted in Luna Rivera Fan Room',sub:'"This collab is incredible"',time:'5m ago'},
  {bg:'rgba(0,230,118,0.1)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',text:'<b>312 fans</b> entered Luna Rivera Fan Room',sub:'Listening together now',time:'6m ago'},
  {bg:'rgba(123,47,255,0.12)',ico:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',text:'<b>Zara Moon</b> protected a new track',sub:'Solstice blockchain certified',time:'8m ago'},
];
function initNowFeed() {
  var list = document.getElementById('nowFeedList');
  if (!list) return;
  list.innerHTML = '';
  NOW_FEED.forEach(function(e) {
    var d = document.createElement('div');
    d.className = 'now-feed-item';
    d.innerHTML = '<div class="now-feed-icon" style="background:' + e.bg + ';">' + e.ico + '</div><div class="now-feed-body">' + e.text + '<span>' + e.sub + '</span></div><div class="now-feed-time">' + e.time + '</div>';
    list.appendChild(d);
  });
}
function startNowCountdown() {
  setInterval(function() {
    if (nowDropSecs > 0) nowDropSecs--;
    var h = Math.floor(nowDropSecs/3600), m = Math.floor((nowDropSecs%3600)/60), s = nowDropSecs%60;
    var eh = document.getElementById('cdH'), em = document.getElementById('cdM'), es = document.getElementById('cdS');
    if (eh) eh.textContent = String(h).padStart(2,'0');
    if (em) em.textContent = String(m).padStart(2,'0');
    if (es) es.textContent = String(s).padStart(2,'0');
  }, 1000);
}
function nowRegisterDrop() {
  if (nowDropRegistered) { showToast('Already registered!'); return; }
  nowDropRegistered = true; nowDropCount++;
  var el = document.getElementById('dropRegCount');
  if (el) el.textContent = nowDropCount.toLocaleString() + ' fans registered';
  showToast('Registered! You will be notified when Midnight Echo drops.');
}
var CS_SEED = [
  {n:'Luna Rivera',c:'var(--pink)',m:'Bass almost done, adding texture'},
  {n:'DJ Nexus',c:'#00E676',m:'Drums locked, ready for the drop'},
  {n:'Aiden K.',c:'#FFD700',m:'Working on melody, give me 10 min'},
  {n:'Luna Rivera',c:'var(--pink)',m:'Sounds great, try going higher on the bridge'},
  {n:'DJ Nexus',c:'#00E676',m:'Vocals slot open if anyone wants in'},
];
var CS_COLORS = [['#7B2FFF','#E91E8C'],['#00E676','#009688'],['#FFD700','#FF8C00'],['#E91E8C','#FF6B6B']];
function csInitWaves() {
  ['csb1','csb2','csb3','csb4'].forEach(function(id,ti) {
    var el = document.getElementById(id); if (!el) return;
    el.innerHTML = '';
    var n = ti === 3 ? 6 : 18;
    for (var i = 0; i < n; i++) {
      var b = document.createElement('div'); b.className = 'cs-bar';
      b.style.cssText = 'width:3px;height:' + (Math.floor(Math.abs(Math.random())*16)+4) + 'px;background:' + CS_COLORS[ti][i%2] + ';opacity:0.8;animation-delay:' + (i*0.05) + 's;';
      el.appendChild(b);
    }
  });
}
function csInitChat() {
  var el = document.getElementById('csMsgs'); if (!el) return;
  el.innerHTML = '';
  CS_SEED.forEach(function(m) {
    var d = document.createElement('div'); d.className = 'cs-msg';
    d.innerHTML = '<span class="n" style="color:' + m.c + ';">' + m.n + '</span>' + m.m;
    el.appendChild(d);
  });
  el.scrollTop = el.scrollHeight;
}
// ── COLLAB TIPS ──
var csSelectedTip = 1;
var csTipsTotal = 0;

function csSelectTip(el, amount) {
  document.querySelectorAll('.cs-tip-btn').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  csSelectedTip = amount;
  var inp = document.getElementById('csTipCustomInput');
  if (inp) inp.style.display = 'none';
}

function csSelectTipCustom(el) {
  document.querySelectorAll('.cs-tip-btn').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  csSelectedTip = 'custom';
  var inp = document.getElementById('csTipCustomInput');
  if (inp) { inp.style.display = 'block'; inp.focus(); }
}

function csSendTip() {
  var amount = csSelectedTip;
  if (amount === 'custom') {
    var inp = document.getElementById('csTipCustomInput');
    amount = inp ? parseFloat(inp.value) : 0;
    if (!amount || amount <= 0) { showToast('Please enter a valid amount.'); return; }
    if (inp) inp.value = '';
  }
  csTipsTotal += amount;
  var el = document.getElementById('csTipsTotal');
  if (el) el.textContent = '€' + csTipsTotal.toFixed(2);
  showToast('€' + parseFloat(amount).toFixed(2) + ' tip sent! Split between all collaborators.');
  var msgs = document.getElementById('csMsgs');
  if (msgs) {
    var d = document.createElement('div');
    d.style.cssText = 'font-size:0.78rem;padding:4px 0;';
    d.innerHTML = '<span style="font-weight:600;color:#00E676;">You</span> sent a €' + parseFloat(amount).toFixed(2) + ' tip 💚';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
}

function csSend() {
  var inp = document.getElementById('csInput'); if (!inp || !inp.value.trim()) return;
  var el = document.getElementById('csMsgs');
  var d = document.createElement('div'); d.className = 'cs-msg';
  d.innerHTML = '<span class="n" style="color:var(--pink);">You</span>' + inp.value.trim();
  el.appendChild(d); el.scrollTop = el.scrollHeight; inp.value = '';
}
function nowJoinCollab() {
  csInitWaves(); csInitChat();
  document.getElementById('now-sub-collab').classList.add('open');
  showToast('Opening collab session...');
}
function gateIsOpen() { try { return localStorage.getItem('fm_access') === '1'; } catch(e) { return false; } }
function gateOpen() {
  if (gateIsOpen()) return;
  // Check URL token (e.g. ?fm=abc123)
  try {
    var urlEmail = new URLSearchParams(window.location.search).get('fm_email');
    if (urlEmail && urlEmail.includes('@')) {
      localStorage.setItem('fm_access','1');
      localStorage.setItem('fm_email', urlEmail);
      return;
    }
  } catch(e){}
  document.getElementById('gateOverlay').classList.add('show');
  // Show returning user view if on a new device
  gateShowCorrectView();
  gateDetectCountry();
}
function gateShowCorrectView() {
  // Always show full registration — returning user can switch to email-only view
  document.getElementById('gateFullForm').style.display = 'block';
  document.getElementById('gateReturnForm').style.display = 'none';
}
function openRegModal() { gateOpen(); }
function gRole(el, val) {
  document.querySelectorAll('.gate-role-opt').forEach(function(e){ e.classList.remove('sel'); });
  el.classList.add('sel');
  document.getElementById('gROLE').value = val;
  var artisticRow = document.getElementById('gArtisticNameRow');
  var businessRow = document.getElementById('gBusinessNameRow');
  var artisticLabel = document.getElementById('gArtisticNameLabel');
  var artisticArtists = ['Artist', 'DJ'];
  var businessRoles = ['Gear Store', 'Event', 'Dance Club', 'Music Studio', 'Bar/Club'];
  if (artisticArtists.indexOf(val) !== -1) {
    artisticLabel.textContent = val === 'DJ' ? 'Artistic Name' : 'Artistic Name / Band Name';
    artisticRow.style.display = 'block';
    businessRow.style.display = 'none';
    document.getElementById('gBusinessName').value = '';
  } else if (businessRoles.indexOf(val) !== -1) {
    businessRow.style.display = 'block';
    artisticRow.style.display = 'none';
    document.getElementById('gArtisticName').value = '';
  } else {
    artisticRow.style.display = 'none';
    businessRow.style.display = 'none';
    document.getElementById('gArtisticName').value = '';
    document.getElementById('gBusinessName').value = '';
  }
}
function gateSubmit(e) {
  e.preventDefault();
  var fn = document.getElementById('gFN').value.trim();
  var ln = document.getElementById('gLN').value.trim();
  var em = document.getElementById('gEM').value.trim();
  var co = document.getElementById('gCO').value;
  var err = document.getElementById('gErr');
  if (!fn || !ln || !em || !co) { err.style.display = 'block'; return; }
  err.style.display = 'none';
  var data = new FormData(e.target);
  fetch('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams(data).toString()})
    .then(function() { gateSuccess(fn, em); })
    .catch(function() { gateSuccess(fn, em); });
}
function gateReturnSubmit(e) {
  e.preventDefault();
  var em = document.getElementById('gReturnEmail').value.trim();
  var err = document.getElementById('gReturnErr');
  if (!em || !em.includes('@')) { err.style.display = 'block'; return; }
  err.style.display = 'none';
  // Save and grant access — no new Netlify submission
  localStorage.setItem('fm_access','1');
  localStorage.setItem('fm_email', em);
  document.getElementById('gateOverlay').classList.remove('show');
  showToast('Welcome back to Fortis Music!');
}
function gateSuccess(fn, em) {
  try { localStorage.setItem('fm_access','1'); localStorage.setItem('fm_email', em || ''); } catch(er) {}
  document.getElementById('gateOverlay').classList.remove('show');
  showToast('Welcome to Fortis Music, ' + fn + '!');
}
function gateDetectCountry() {
  fetch('https://ipapi.co/json/')
    .then(function(r){ return r.json(); })
    .then(function(d) {
      var sel = document.getElementById('gCO'); if (!sel || !d.country_name) return;
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].text === d.country_name) { sel.selectedIndex = i; return; }
      }
    }).catch(function(){});
}

window.addEventListener('DOMContentLoaded', function() {
  initNowFeed();
  startNowCountdown();
});

var JB_DATA={electronic:{label:'Electronic / Dance',listeners:'1,240',prize:47.50,todVotes:847,tracks:[{t:'Voltage',a:'DJ Nexus',c:'UAE',g:'Techno',dur:'3:42',v:124},{t:'Midnight Echo',a:'Luna Rivera',c:'UAE',g:'Deep House',dur:'4:15',v:89},{t:'Iron Circuit',a:'The Void',c:'UK',g:'Industrial',dur:'5:01',v:67},{t:'Solstice',a:'Zara Moon',c:'Serbia',g:'Ambient',dur:'3:28',v:41},{t:'Celestial Drift',a:'Aria Voss',c:'Germany',g:'Electronic',dur:'4:55',v:28}],chat:[{n:'Marco B.',m:'this track is absolute fire'},{n:'Sofia L.',m:'voting for Midnight Echo next'},{n:'Yuki T.',m:'Luna Rivera every time'},{n:'Carlos P.',m:'who proposed Iron Circuit?'},{n:'Priya S.',m:'been here 2 hours, no regrets'}]},hiphop:{label:'Hip-Hop / R&B',listeners:'890',prize:31.00,todVotes:612,tracks:[{t:'Street Psalms',a:'Marcus Wave',c:'USA',g:'Hip-Hop',dur:'3:18',v:98},{t:'Golden Hour',a:'Celeste M.',c:'France',g:'R&B',dur:'3:55',v:74},{t:'Lagos Nights',a:'DJ Pharaoh',c:'Nigeria',g:'Afrobeats',dur:'4:02',v:55}],chat:[{n:'Aiden K.',m:'Marcus Wave is insane'},{n:'Zara M.',m:'Golden Hour after this'}]},pop:{label:'Pop',listeners:'654',prize:22.50,todVotes:445,tracks:[{t:'Neon Dreams',a:'Nadia Sol',c:'South Africa',g:'Pop',dur:'3:22',v:112},{t:'Heartlines',a:'Celeste M.',c:'France',g:'Indie Pop',dur:'3:48',v:76}],chat:[{n:'Sofia L.',m:'Neon Dreams is so good'},{n:'Marco B.',m:'Celeste deserves more plays'}]},rock:{label:'Rock / Alternative',listeners:'412',prize:18.00,todVotes:334,tracks:[{t:'Static Pulse',a:'The Void',c:'UK',g:'Alternative',dur:'4:10',v:88},{t:'Broken Signal',a:'Kai Santos',c:'Brazil',g:'Rock',dur:'3:55',v:61}],chat:[{n:'Yuki T.',m:'The Void is underrated'},{n:'Carlos P.',m:'Static Pulse goes hard'}]},afro:{label:'Afrobeats / World',listeners:'378',prize:15.50,todVotes:298,tracks:[{t:'Lagos Nights',a:'DJ Pharaoh',c:'Nigeria',g:'Afrobeats',dur:'4:02',v:134},{t:'Savanna',a:'Nadia Sol',c:'South Africa',g:'World',dur:'3:37',v:79}],chat:[{n:'Priya S.',m:'Lagos Nights always wins'},{n:'Aiden K.',m:'DJ Pharaoh is a legend'}]}};
var jbActiveGenre='electronic',jbProgVal=38,jbProgInt=null,jbTodVoted=false,jbVotedTracks={};

// ── JUKEBOX VOTING SYSTEM ──
var JB_VOTE_TRACKS = {
  electronic:[
    {t:'Voltage',a:'DJ Nexus',c:'UAE',g:'Techno',dur:'3:42',votes:124,proposed:'Marco B.'},
    {t:'Midnight Echo',a:'Luna Rivera',c:'UAE',g:'Deep House',dur:'4:15',votes:89,proposed:'Sofia L.'},
    {t:'Iron Circuit',a:'The Void',c:'UK',g:'Industrial',dur:'5:01',votes:67,proposed:'Yuki T.'},
    {t:'Solstice',a:'Zara Moon',c:'Serbia',g:'Ambient',dur:'3:28',votes:41,proposed:'Carlos P.'},
    {t:'Celestial Drift',a:'Aria Voss',c:'Germany',g:'Electronic',dur:'4:55',votes:28,proposed:'Priya S.'},
    {t:'Neon Grid',a:'Devika R.',c:'India',g:'Synthwave',dur:'3:55',votes:22,proposed:'Ali B.'},
    {t:'Pulse',a:'Marcus D.',c:'USA',g:'Techno',dur:'4:10',votes:18,proposed:'Ana S.'},
    {t:'Dark Matter',a:'Yelena V.',c:'France',g:'Electro',dur:'5:22',votes:15,proposed:'Jonas P.'},
    {t:'Signal Loss',a:'Kofi A.',c:'Nigeria',g:'Electronic',dur:'3:38',votes:12,proposed:'Fatima O.'},
    {t:'Binary Rain',a:'Siya K.',c:'South Africa',g:'Electronic',dur:'4:02',votes:9,proposed:'Keanu R.'},
  ],
  hiphop:[
    {t:'Street Psalms',a:'Marcus Wave',c:'USA',g:'Hip-Hop',dur:'3:18',votes:98,proposed:'Aiden K.'},
    {t:'Golden Hour',a:'Celeste M.',c:'France',g:'R&B',dur:'3:55',votes:74,proposed:'Zara M.'},
    {t:'Lagos Nights',a:'DJ Pharaoh',c:'Nigeria',g:'Afrobeats',dur:'4:02',votes:55,proposed:'Sofia L.'},
    {t:'Midnight Run',a:'Kai Santos',c:'Brazil',g:'Trap',dur:'3:30',votes:38,proposed:'Marco B.'},
    {t:'Soul Serenade',a:'Nadia Sol',c:'South Africa',g:'Neo-Soul',dur:'4:15',votes:27,proposed:'Priya S.'},
  ],
  pop:[
    {t:'Neon Dreams',a:'Nadia Sol',c:'South Africa',g:'Pop',dur:'3:22',votes:112,proposed:'Sofia L.'},
    {t:'Heartlines',a:'Celeste M.',c:'France',g:'Indie Pop',dur:'3:48',votes:76,proposed:'Marco B.'},
    {t:'Summer Static',a:'Luna Rivera',c:'UAE',g:'Synth-Pop',dur:'3:10',votes:54,proposed:'Yuki T.'},
    {t:'Glass',a:'Aria Voss',c:'Germany',g:'Alt-Pop',dur:'4:00',votes:33,proposed:'Carlos P.'},
  ],
  rock:[
    {t:'Static Pulse',a:'The Void',c:'UK',g:'Alternative',dur:'4:10',votes:88,proposed:'Yuki T.'},
    {t:'Broken Signal',a:'Kai Santos',c:'Brazil',g:'Rock',dur:'3:55',votes:61,proposed:'Carlos P.'},
    {t:'Ironclad',a:'Marcus D.',c:'USA',g:'Hard Rock',dur:'4:30',votes:44,proposed:'Jonas P.'},
  ],
  afro:[
    {t:'Lagos Nights',a:'DJ Pharaoh',c:'Nigeria',g:'Afrobeats',dur:'4:02',votes:134,proposed:'Priya S.'},
    {t:'Savanna',a:'Nadia Sol',c:'South Africa',g:'World',dur:'3:37',votes:79,proposed:'Aiden K.'},
    {t:'Rhythm of Kente',a:'Kofi A.',c:'Ghana',g:'Afrobeats',dur:'3:50',votes:52,proposed:'Ana S.'},
  ]
};

var jbUserVotes={},jbUserTokens=2,jbPrizeAmount={},jbVoteTimerSec={},jbVoteInterval=null,jbAutoVoteInterval=null;

var jbUserPrediction = {}; // genre -> track title predicted

function jbRenderVoting(genre){
  var tracks = JB_VOTE_TRACKS[genre] || [];
  var list = document.getElementById('jbVoteList');
  if(!list) return;

  // Sort alphabetically, never by votes
  var sorted = tracks.slice().sort(function(a,b){ return a.t.localeCompare(b.t); });

  list.innerHTML = '';
  sorted.forEach(function(track, i){
    var isVoted = jbUserVotes[genre] !== undefined &&
                  JB_VOTE_TRACKS[genre][jbUserVotes[genre]] &&
                  JB_VOTE_TRACKS[genre][jbUserVotes[genre]].t === track.t;
    var row = document.createElement('div');
    row.className = 'jb-vote-item' + (isVoted ? ' voted' : '');
    row.id = 'jbVoteRow' + i;
    var checkSvg = '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6L9 17l-5-5"/></svg>';
    var upSvg = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
    var playSvg = '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    row.innerHTML =
      '<div class="jb-vote-info" style="flex:1;min-width:0;">'
      + '<div class="jb-vote-track">' + track.t + '</div>'
      + '<div class="jb-vote-meta">' + track.a + ' · ' + track.g + ' · ' + track.c + '</div>'
      + '</div>'
      + '<button class="jb-play-btn" id="jbPlay'+i+'" title="Preview">' + playSvg + '</button>'
      + '<button class="jb-vote-btn' + (isVoted ? ' voted' : '') + '" id="jbVBtn'+i+'" title="Vote">' + (isVoted ? checkSvg : upSvg) + '</button>';

    var trackRef = track;
    row.querySelector('.jb-play-btn').addEventListener('click', function(e){
      e.stopPropagation();
      jbPreviewTrack(trackRef);
    });
    row.querySelector('.jb-vote-btn').addEventListener('click', function(e){
      e.stopPropagation();
      jbCastVote(genre, trackRef);
    });
    row.addEventListener('click', function(){ jbPreviewTrack(trackRef); });
    list.appendChild(row);
  });

  // Tokens
  var dots = document.getElementById('jbTokenDots');
  if(dots){
    dots.innerHTML = '';
    for(var k=0; k<3; k++){
      var d = document.createElement('div');
      d.className = 'jb-token-dot' + (k >= jbUserTokens ? ' used' : '');
      dots.appendChild(d);
    }
  }
  var tl = document.getElementById('jbTokensLbl');
  if(tl) tl.textContent = jbUserTokens + ' of 3 predictions left this week';

  if(!jbPrizeAmount[genre]) jbPrizeAmount[genre] = JB_DATA[genre] ? JB_DATA[genre].prize : 10;
  var pe = document.getElementById('jbPrizeDisplay');
  if(pe) pe.textContent = '€' + jbPrizeAmount[genre].toFixed(2);
  if(!jbVoteTimerSec[genre]) jbVoteTimerSec[genre] = 14*60+32;
  jbUpdateTimer(genre);
}

function jbPreviewTrack(track){
  // Update Now Playing to previewed track
  var el = document.getElementById('jbTrackName');
  if(el) el.textContent = track.t;
  var ea = document.getElementById('jbTrackArtist');
  if(ea) ea.textContent = track.a + ' · ' + track.c;
  var eg = document.getElementById('jbTagGenre');
  if(eg) eg.textContent = track.g;
  var ec = document.getElementById('jbTagCountry');
  if(ec) ec.textContent = track.c;
  // Reset progress for preview feel
  jbProgVal = Math.random() * 30;
  showToast('Previewing: ' + track.t + ' by ' + track.a);
}

function jbCastVote(genre, track){
  if(jbUserVotes[genre] !== undefined){ showToast('You already voted in this room today!'); return; }
  var tracks = JB_VOTE_TRACKS[genre];
  var idx = tracks.findIndex(function(t){ return t.t === track.t; });
  if(idx === -1) return;
  jbUserVotes[genre] = idx;
  tracks[idx].votes++;
  jbRenderVoting(genre);
  showToast('Voted for "' + track.t + '"! Winner announced at end of round.');
}

function jbPredict(){
  if(jbUserTokens <= 0){ showToast('No predictions left this week! Resets Monday.'); return; }
  var genre = jbActiveGenre || 'electronic';
  var tracks = JB_VOTE_TRACKS[genre] || [];
  if(!tracks.length) return;

  // Show simple prompt via modal-like overlay using showToast, 
  // For now pick currently playing track as prediction
  var currentTrack = document.getElementById('jbTrackName');
  var trackName = currentTrack ? currentTrack.textContent : tracks[0].t;
  jbUserPrediction[genre] = trackName;
  jbUserTokens--;

  var dots = document.getElementById('jbTokenDots');
  if(dots){ var all = dots.querySelectorAll('.jb-token-dot'); if(all[jbUserTokens]) all[jbUserTokens].classList.add('used'); }
  var tl = document.getElementById('jbTokensLbl');
  if(tl) tl.textContent = jbUserTokens + ' of 3 predictions left this week';

  showToast('Prediction locked: "' + trackName + '" — revealed at end of round!');
}

function jbStartVoteTimer(genre){
  clearInterval(jbVoteInterval);
  if(!jbVoteTimerSec[genre]) jbVoteTimerSec[genre] = 14*60+32;
  jbVoteInterval = setInterval(function(){
    if(!jbVoteTimerSec[genre]) return;
    jbVoteTimerSec[genre]--;
    jbUpdateTimer(genre);
    if(jbVoteTimerSec[genre] <= 0){ clearInterval(jbVoteInterval); jbRoundEnd(genre); }
  }, 1000);
}

function jbUpdateTimer(genre){
  var el = document.getElementById('jbVoteTimer');
  if(!el) return;
  var s = jbVoteTimerSec[genre] || 0, m = Math.floor(s/60), sec = s%60;
  el.textContent = m + ':' + (sec<10?'0':'') + sec;
  if(s < 120) el.classList.add('urgent'); else el.classList.remove('urgent');
}

function jbRoundEnd(genre){
  var tracks = JB_VOTE_TRACKS[genre];
  if(!tracks || !tracks.length) return;
  // Determine winner by votes (internal, not shown during voting)
  var winner = tracks.slice().sort(function(a,b){ return b.votes - a.votes; })[0];
  var prize = jbPrizeAmount[genre] || 0;

  // Show winner banner
  var banner = document.getElementById('jbWinnerBanner');
  var wt = document.getElementById('jbWinnerTrack');
  var ws = document.getElementById('jbWinnerSub');
  if(banner) banner.classList.add('show');
  if(wt) wt.textContent = winner.t;
  if(ws) ws.textContent = winner.a + ' · Artist receives €' + prize.toFixed(2);

  // Show prediction card with correct predictors
  var predictCard = document.getElementById('jbPredictCard');
  var predictCorrect = document.getElementById('jbPredictCorrect');
  if(predictCard) predictCard.style.display = 'block';
  var ttn = document.getElementById('jbTodTrackName');
  var tts = document.getElementById('jbTodTrackSub');
  if(ttn) ttn.textContent = winner.t;
  if(tts) tts.textContent = winner.a;

  // Check if user predicted correctly
  var userPredicted = jbUserPrediction[genre] === winner.t;
  if(predictCorrect){
    if(userPredicted){
      predictCorrect.textContent = 'Your prediction was correct!';
      predictCorrect.style.color = '#00E676';
    } else if(jbUserPrediction[genre]) {
      predictCorrect.textContent = 'You predicted: ' + jbUserPrediction[genre];
      predictCorrect.style.color = 'var(--muted)';
    } else {
      predictCorrect.textContent = '3 fans predicted correctly this round';
      predictCorrect.style.color = 'var(--muted)';
    }
  }

  showToast('"' + winner.t + '" wins the round! ' + winner.a + ' receives €' + prize.toFixed(2));

  // New round after 8s
  setTimeout(function(){
    if(banner) banner.classList.remove('show');
    if(predictCard) predictCard.style.display = 'none';
    jbUserVotes[genre] = undefined;
    jbUserPrediction[genre] = undefined;
    jbPrizeAmount[genre] = 10;
    jbVoteTimerSec[genre] = 15*60;
    tracks.forEach(function(t){ t.votes = Math.floor(Math.random()*30) + 5; });
    jbRenderVoting(genre);
    jbStartVoteTimer(genre);
  }, 8000);
}

// Auto votes run in background (invisible to user — just internal tracking)
function jbStartAutoVotes(genre){
  clearInterval(jbAutoVoteInterval);
  jbAutoVoteInterval = setInterval(function(){
    var tracks = JB_VOTE_TRACKS[genre];
    if(!tracks) return;
    var ridx = Math.floor(Math.random() * tracks.length);
    tracks[ridx].votes += Math.floor(Math.random()*2) + 1;
  }, 2500);
}
function jbOpen(){document.getElementById('now-sub-jukebox').classList.add('open');document.getElementById('jbBrowse').classList.remove('hidden');document.getElementById('jbRoom').classList.remove('open');}
function jbClose(){document.getElementById('now-sub-jukebox').classList.remove('open');if(jbProgInt){clearInterval(jbProgInt);jbProgInt=null;}clearInterval(jbVoteInterval);clearInterval(jbAutoVoteInterval);}









var DR_DROPS = [
  {id:'drop1',title:'Midnight Echo',sub:'Acoustic Version',artist:'Luna Rivera',country:'UAE',genre:'Indie Pop',fans:1203,earlyLeft:53,secs:47*60+33,status:'active',col:'linear-gradient(135deg,#300010,#660033)'},
  {id:'drop2',title:'Voltage',sub:'Club Edit',artist:'DJ Nexus',country:'UAE',genre:'Techno',fans:847,earlyLeft:72,secs:2*3600+15*60,status:'upcoming',col:'linear-gradient(135deg,#001030,#002060)'},
  {id:'drop3',title:'Street Psalms',sub:'Extended Mix',artist:'Marcus Wave',country:'USA',genre:'Hip-Hop',fans:612,earlyLeft:88,secs:5*3600+30*60,status:'upcoming',col:'linear-gradient(135deg,#101000,#302000)'},
  {id:'drop4',title:'Neon Dreams',sub:'Radio Edit',artist:'Nadia Sol',country:'South Africa',genre:'Pop',fans:445,earlyLeft:95,secs:8*3600,status:'upcoming',col:'linear-gradient(135deg,#001a10,#003020)'},
  {id:'drop5',title:'Lagos Nights',sub:'Festival Mix',artist:'DJ Pharaoh',country:'Nigeria',genre:'Afrobeats',fans:389,earlyLeft:61,secs:12*3600+45*60,status:'upcoming',col:'linear-gradient(135deg,#1a1000,#302000)'},
  {id:'drop6',title:'Static Pulse',sub:'Directors Cut',artist:'The Void',country:'UK',genre:'Rock',fans:278,earlyLeft:84,secs:24*3600,status:'upcoming',col:'linear-gradient(135deg,#0a0a0a,#1a1a1a)'},
];
var drActiveDrop=null,drReg=false,drRegCount=1203,drStageInt=null,drPlayerInt=null,drPlayerSecs=0,drLocked=true;
var DR_CHAT=[
  {n:'Marco B.',m:'Cannot wait for this acoustic version'},
  {n:'Sofia L.',m:'Luna Rivera never misses'},
  {n:'Yuki T.',m:'Already have my Early Listener spot'},
  {n:'Carlos P.',m:'This drop format is genius'},
  {n:'Priya S.',m:'47 minutes feels like forever'},
  {n:'Aiden K.',m:'The original is my most played this year'},
];
function drOpen(){drRenderVinyl(DR_DROPS);drInitFeaturedCD();document.getElementById('now-sub-droproom').classList.add('open');}
function drClose(){document.getElementById('now-sub-droproom').classList.remove('open');}
function drFilter(el,type){document.querySelectorAll('.dr-filter-btn').forEach(function(b){b.classList.remove('active');});el.classList.add('active');var f=type==='all'?DR_DROPS:DR_DROPS.filter(function(d){if(type==='live')return d.status==='active';if(type==='upcoming')return d.status==='upcoming';return d.genre.toLowerCase().indexOf(type)!==-1;});drRenderVinyl(f);}
function drRenderVinyl(drops){var s=document.getElementById('drVinylScroll');s.innerHTML='';drops.slice(1).forEach(function(d){var h=Math.floor(d.secs/3600),m=Math.floor((d.secs%3600)/60);var cd=d.status==='active'?'LIVE NOW':(h>0?h+'h '+m+'m':m+'m');var card=document.createElement('div');card.className='dr-vinyl-card';card.onclick=(function(id){return function(){drEnterDrop(id);};})(d.id);card.innerHTML='<div class="dr-vinyl-cover" style="background:'+d.col+';"><div class="dr-vinyl-disc"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div><div class="dr-vinyl-badge '+(d.status==='active'?'dr-badge-live':'dr-badge-upcoming')+'">'+(d.status==='active'?'LIVE':'SOON')+'</div></div><div class="dr-vinyl-body"><div class="dr-vinyl-name">'+d.title+'</div><div class="dr-vinyl-artist">'+d.artist+' · '+d.genre+'</div><div class="dr-vinyl-bottom"><div class="dr-vinyl-cd">'+cd+'</div><div class="dr-vinyl-fans">'+d.fans.toLocaleString()+' waiting</div></div></div>';s.appendChild(card);});}
function drInitFeaturedCD(){var secs=DR_DROPS[0].secs;var iv=setInterval(function(){if(secs>0)secs--;var h=Math.floor(secs/3600),m=Math.floor((secs%3600)/60),s=secs%60;var eh=document.getElementById('drFH'),em=document.getElementById('drFM'),es=document.getElementById('drFS');if(eh)eh.textContent=String(h).padStart(2,'0');if(em)em.textContent=String(m).padStart(2,'0');if(es)es.textContent=String(s).padStart(2,'0');},1000);}
function drEnterDrop(id){var d=DR_DROPS.find(function(x){return x.id===id;});if(!d)return;drActiveDrop=d;drReg=false;drLocked=true;drPlayerSecs=0;document.getElementById('drStageTitle').textContent=d.title;document.getElementById('drStageArtist').textContent=d.artist+' · '+d.country;document.getElementById('drStageGenre').textContent=d.genre;document.getElementById('drRegCount').textContent=d.fans.toLocaleString()+' registered';document.getElementById('drEarlyLeft').textContent=d.earlyLeft+' spots left';document.getElementById('drStageStatus').textContent=d.fans.toLocaleString()+' fans waiting for this drop';var btn=document.getElementById('drRegBtn');btn.className='dr-stage-reg-btn';btn.textContent='Register for Drop';document.getElementById('drPlayerWrap').classList.remove('show');document.getElementById('drStageCountdown').style.display='flex';document.getElementById('drBtnPrev').classList.add('locked');document.getElementById('drBtnNext').classList.add('locked');var lb=document.getElementById('drLockBar');if(lb)lb.style.display='block';drInitBubbles(d.fans);drInitChat();drStartCD(d.secs);document.getElementById('now-sub-dropstage').classList.add('open');drInitWaitRoom(id);}
function drInitBubbles(fans){var c=document.getElementById('drBubbles');c.innerHTML='';var cols=['var(--grad)','linear-gradient(135deg,#00E676,#009688)','linear-gradient(135deg,#FFD700,#FF8C00)','linear-gradient(135deg,#E91E8C,#FF4081)','linear-gradient(135deg,#00BCD4,#0097A7)'];var ns=['MR','SL','YT','CP','AK','ZM','PR'];var show=Math.min(7,fans);for(var i=0;i<show;i++){var b=document.createElement('div');b.className='dr-fan-bubble';b.style.cssText='background:'+cols[i%cols.length]+';left:'+(i*22)+'px;z-index:'+(10-i)+';';b.textContent=ns[i]||'?';c.appendChild(b);}var more=document.createElement('div');more.className='dr-fan-bubble';more.style.cssText='background:rgba(200,180,255,0.13);color:var(--muted);font-size:0.58rem;left:'+(show*22)+'px;';more.textContent='+'+(fans-show).toLocaleString();c.appendChild(more);c.style.width=((show+1)*22+32)+'px';}
function drInitChat(){var msgs=document.getElementById('drChatMsgs');msgs.innerHTML='';DR_CHAT.forEach(function(m){var d=document.createElement('div');d.className='dr-chat-msg';d.innerHTML='<span class="n">'+m.n+'</span>'+m.m;msgs.appendChild(d);});msgs.scrollTop=msgs.scrollHeight;}
function drChat(){var inp=document.getElementById('drChatIn');if(!inp||!inp.value.trim())return;var msgs=document.getElementById('drChatMsgs');var d=document.createElement('div');d.className='dr-chat-msg';d.innerHTML='<span class="n" style="color:var(--pink);">You</span>'+inp.value.trim();msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;inp.value='';}
function drStartCD(secs){if(drStageInt)clearInterval(drStageInt);var s=secs;function tick(){var h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;var eh=document.getElementById('drSH'),em=document.getElementById('drSM'),es=document.getElementById('drSS');if(eh)eh.textContent=String(h).padStart(2,'0');if(em)em.textContent=String(m).padStart(2,'0');if(es)es.textContent=String(sec).padStart(2,'0');}tick();drStageInt=setInterval(function(){if(s>0)s--;tick();if(s===0){clearInterval(drStageInt);drTriggerDrop();}},1000);}
function drTriggerDrop(){document.getElementById('drStageCountdown').style.display='none';document.getElementById('drStageStatus').textContent='LIVE — First 60 seconds radio mode';document.getElementById('drPlayerWrap').classList.add('show');showToast('Drop is LIVE!');if(drPlayerInt)clearInterval(drPlayerInt);drPlayerSecs=0;drPlayerInt=setInterval(function(){drPlayerSecs++;var pct=(drPlayerSecs/222)*100;var f=document.getElementById('drPlayerFill');var n=document.getElementById('drPlayerNow');if(f)f.style.width=Math.min(pct,100)+'%';if(n)n.textContent=Math.floor(drPlayerSecs/60)+':'+String(drPlayerSecs%60).padStart(2,'0');if(drPlayerSecs===60&&drLocked){drLocked=false;var lb=document.getElementById('drLockBar');if(lb)lb.textContent='Controls unlocked — enjoy the full track!';setTimeout(function(){if(lb)lb.style.display='none';},3000);document.getElementById('drBtnPrev').classList.remove('locked');document.getElementById('drBtnNext').classList.remove('locked');showToast('Controls unlocked!');}if(drPlayerSecs>=222)clearInterval(drPlayerInt);},1000);}
function drRegister(){if(drReg){showToast('Already registered!');return;}drReg=true;drRegCount++;var btn=document.getElementById('drRegBtn');btn.className='dr-stage-reg-btn registered';btn.textContent='Registered!';var el=document.getElementById('drRegCount');if(el)el.textContent=drRegCount.toLocaleString()+' registered';showToast('You are in! Drop notification incoming.');}
function drStageBack(){if(drStageInt)clearInterval(drStageInt);if(drPlayerInt)clearInterval(drPlayerInt);if(drLiveFansInt)clearInterval(drLiveFansInt);document.getElementById('now-sub-dropstage').classList.remove('open');}


var DR_ARTISTS = {
  drop1: { av:'LR', name:'Luna Rivera', genre:'Indie Pop', country:'UAE', streams:'2.4M', fans:'12.3K', tracks:8,
    discog:[
      {name:'Midnight Echo',meta:'2024 · 1.2M streams',col:'linear-gradient(135deg,#300010,#660033)'},
      {name:'Starfall',meta:'2023 · 840K streams',col:'linear-gradient(135deg,#100030,#300060)'},
      {name:'Golden Silence',meta:'2023 · 620K streams',col:'linear-gradient(135deg,#001030,#002060)'},
      {name:'Ember Coast',meta:'2022 · 410K streams',col:'linear-gradient(135deg,#001a10,#003020)'},
    ],
    ambient:['Midnight Echo','Starfall','Golden Silence']
  },
  drop2: { av:'DN', name:'DJ Nexus', genre:'Techno', country:'UAE', streams:'8.7M', fans:'28.7K', tracks:24,
    discog:[
      {name:'Voltage',meta:'2024 · 3.1M streams',col:'linear-gradient(135deg,#001030,#002060)'},
      {name:'Iron Circuit',meta:'2023 · 2.4M streams',col:'linear-gradient(135deg,#100010,#200020)'},
      {name:'Afterburn',meta:'2023 · 1.8M streams',col:'linear-gradient(135deg,#0d0818,#1a0030)'},
    ],
    ambient:['Voltage','Iron Circuit','Afterburn']
  },
  drop3: { av:'MW', name:'Marcus Wave', genre:'Hip-Hop', country:'USA', streams:'5.2M', fans:'19.2K', tracks:15,
    discog:[
      {name:'Street Psalms',meta:'2024 · 1.9M streams',col:'linear-gradient(135deg,#101000,#302000)'},
      {name:'Concrete Sun',meta:'2023 · 1.4M streams',col:'linear-gradient(135deg,#1a0a00,#2a1500)'},
    ],
    ambient:['Street Psalms','Concrete Sun']
  },
};
var drAmbientPlaying = true;
var drAmbientIdx = 0;
var drLiveFansCount = 1203;
var drLiveFansInt = null;

function drInitWaitRoom(dropId) {
  var artist = DR_ARTISTS[dropId] || DR_ARTISTS['drop1'];
  document.getElementById('drArtistAv').textContent = artist.av;
  document.getElementById('drArtistName').textContent = artist.name;
  document.getElementById('drArtistGenre').textContent = artist.genre + ' · ' + artist.country;
  document.getElementById('drArtistStreams').textContent = artist.streams;
  document.getElementById('drArtistFans').textContent = artist.fans;
  document.getElementById('drArtistTracks').textContent = artist.tracks;
  drAmbientIdx = 0;
  drUpdateAmbient(artist);
  drRenderDiscog(artist);
  drStartLiveFans();
}
function drUpdateAmbient(artist) {
  var tracks = artist.ambient || [];
  var name = tracks[drAmbientIdx % tracks.length] || 'Ambient Track';
  document.getElementById('drAmbientName').textContent = name;
  document.getElementById('drAmbientArtist').textContent = artist.name;
}
function drAmbientToggle() {
  drAmbientPlaying = !drAmbientPlaying;
  var btn = document.getElementById('drAmbientPlayBtn');
  if (btn) btn.textContent = drAmbientPlaying ? '⏸⏸' : '▶';
  showToast(drAmbientPlaying ? 'Playing ambient track' : 'Paused');
}
function drAmbientPrev() {
  drAmbientIdx = Math.max(0, drAmbientIdx - 1);
  var artist = DR_ARTISTS[drActiveDrop ? drActiveDrop.id : 'drop1'] || DR_ARTISTS['drop1'];
  drUpdateAmbient(artist);
  showToast('Previous track');
}
function drAmbientNext() {
  drAmbientIdx++;
  var artist = DR_ARTISTS[drActiveDrop ? drActiveDrop.id : 'drop1'] || DR_ARTISTS['drop1'];
  drUpdateAmbient(artist);
  showToast('Next track');
}
function drRenderDiscog(artist) {
  var list = document.getElementById('drDiscogList');
  if (!list) return;
  list.innerHTML = '';
  artist.discog.forEach(function(t, i) {
    var d = document.createElement('div');
    d.className = 'dr-discog-item';
    d.onclick = (function(name){ return function(){ showToast('Playing: ' + name); }; })(t.name);
    d.innerHTML = '<div class="dr-discog-num">' + (i+1) + '</div>'
      + '<div class="dr-discog-cover" style="background:' + t.col + ';">'
      + '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>'
      + '<div class="dr-discog-info"><div class="dr-discog-name">' + t.name + '</div>'
      + '<div class="dr-discog-meta">' + t.meta + '</div></div>';
    list.appendChild(d);
  });
}
function drStartLiveFans() {
  if (drLiveFansInt) clearInterval(drLiveFansInt);
  drLiveFansCount = drActiveDrop ? drActiveDrop.fans : 1203;
  var newInLast5 = 12;
  drLiveFansInt = setInterval(function() {
    if (Math.random() < 0.3) {
      drLiveFansCount++;
      newInLast5++;
      var el = document.getElementById('drLiveFans');
      var el2 = document.getElementById('drNewFans');
      if (el) el.textContent = drLiveFansCount.toLocaleString();
      if (el2) el2.textContent = '+' + newInLast5 + ' joined in last 5 min';
    }
  }, 3000);
}


function showArtistProfile(name) {
  var searchEl = document.getElementById('discoverSearch');
  if (searchEl) { searchEl.value = name; }
  showPage('discover');
  setTimeout(function() { filterArtists(); }, 150);
}

function drViewArtistProfile() {
  if (drStageInt) clearInterval(drStageInt);
  if (drPlayerInt) clearInterval(drPlayerInt);
  if (drLiveFansInt) clearInterval(drLiveFansInt);
  document.getElementById('now-sub-dropstage').classList.remove('open');
  document.getElementById('now-sub-droproom').classList.remove('open');
  showPage('artist');
}


function drDiscoverClick(el) {
  var name = el ? el.getAttribute('data-aname') : '';
  if (name) {
    showArtistProfile(name);
  } else {
    showPage('discover');
  }
}


document.addEventListener('click', function(e) {
  var t = e.target;
  while (t && t !== document.body) {
    if (t.classList && t.classList.contains('discover-card')) {
      var n = t.getAttribute('data-aname');
      if (n) { showArtistProfile(n); return; }
    }
    t = t.parentNode;
  }
});


var LR_EVENTS = [
  {id:'ev1', type:'concert', genre:'electronic', title:'EXIT Festival - Main Stage', sub:'Novi Sad, Serbia', artist:'DJ Nexus + Luna Rivera', viewers:4240, thumb:'linear-gradient(135deg,#0a0030,#1a0060)', city:'Novi Sad', country:'Serbia', free:false, price:'\u20ac5', desc:'Europe biggest exit festival streams live exclusively on Fortis. Watch the main stage acts in real time.', chat:[{n:'Marco B.',m:'EXIT is insane this year'},{n:'Sofia L.',m:'DJ Nexus opening set'},{n:'Yuki T.',m:'Watching from Tokyo right now'},{n:'Carlos P.',m:'Stream quality is perfect'},{n:'Priya S.',m:'Wish I was there in person'}]},
  {id:'ev2', type:'concert', genre:'hiphop', title:'Marcus Wave - Live in Atlanta', sub:'Atlanta, USA', artist:'Marcus Wave', viewers:2180, thumb:'linear-gradient(135deg,#101000,#302000)', city:'Atlanta', country:'USA', free:true, price:'Free', desc:'Marcus Wave performs his debut album Street Psalms live for the first time. Full show, no cuts.', chat:[{n:'Aiden K.',m:'Street Psalms live omg'},{n:'Zara M.',m:'He is incredible live'},{n:'DJ P.',m:'Support real artists'}]},
  {id:'ev3', type:'festival', genre:'electronic', title:'Fabric London - Friday Night', sub:'London, UK', artist:'Various DJs', viewers:3120, thumb:'linear-gradient(135deg,#001030,#002060)', city:'London', country:'UK', free:false, price:'\u00a33', desc:'Fabric London streams their Friday night lineup exclusively on Fortis Music. 4 rooms, all live.', chat:[{n:'Sarah T.',m:'Fabric never disappoints'},{n:'Marco B.',m:'Room 2 is incredible right now'},{n:'Yuki T.',m:'That bass drop!!!'}]},
  {id:'ev4', type:'concert', genre:'rock', title:'The Void - Manchester Arena', sub:'Manchester, UK', artist:'The Void', viewers:5600, thumb:'linear-gradient(135deg,#0a0a0a,#1a1a1a)', city:'Manchester', country:'UK', free:false, price:'\u00a34', desc:'The Void plays their biggest headline show to date at Manchester Arena. Stream live on Fortis.', chat:[{n:'Carlos P.',m:'The Void are UNREAL live'},{n:'Sofia L.',m:'Static Pulse just dropped'},{n:'Priya S.',m:'This crowd energy'}]},
  {id:'ev5', type:'festival', genre:'electronic', title:'Pacha Ibiza - Summer Opener', sub:'Ibiza, Spain', artist:'DJ Pharaoh + Guest', viewers:8900, thumb:'linear-gradient(135deg,#1a0010,#330020)', city:'Ibiza', country:'Spain', free:false, price:'\u20ac6', desc:'Pacha Ibiza kicks off the summer season with an exclusive Fortis livestream. First time ever.', chat:[{n:'Marco B.',m:'Pacha on Fortis is historic'},{n:'Aiden K.',m:'That DJ Pharaoh set'},{n:'Zara M.',m:'Ibiza energy through the screen'}]},
  {id:'ev6', type:'concert', genre:'electronic', title:'Womb Tokyo - Saturday Live', sub:'Tokyo, Japan', artist:'Kira Tanaka', viewers:1840, thumb:'linear-gradient(135deg,#001a10,#003020)', city:'Tokyo', country:'Japan', free:true, price:'Free', desc:'Womb Tokyo streams their Saturday night showcase. Featuring Kira Tanaka and the best of Tokyo.', chat:[{n:'Yuki T.',m:'Womb Tokyo represent!'},{n:'Carlos P.',m:'Tokyo scene is insane'}]},
];

var LR_CLUBS = [
  {id:'cl1', type:'techno', genre:'techno', title:'Warehouse 14 - Dubai', sub:'Dubai, UAE', artist:'DJ Echo live', viewers:892, thumb:'linear-gradient(135deg,#0a0015,#1a0030)', city:'Dubai', country:'UAE', free:true, price:'Free', desc:'Warehouse 14 in Dubai streams their Friday night techno session live. Walk-ins welcome after midnight.', chat:[{n:'Priya S.',m:'Warehouse 14 always goes hard'},{n:'Marco B.',m:'Going there tonight after watching this'},{n:'Sofia L.',m:'That DJ Echo set'}]},
  {id:'cl2', type:'house', genre:'house', title:'Club Celsius - Dubai', sub:'Dubai, UAE', artist:'House Night', viewers:445, thumb:'linear-gradient(135deg,#001030,#002050)', city:'Dubai', country:'UAE', free:true, price:'Free', desc:'Club Celsius streams their weekly house night. Check the vibe before you head out tonight.', chat:[{n:'Aiden K.',m:'Celsius vibe is different'},{n:'Carlos P.',m:'Might head there after 1am'}]},
  {id:'cl3', type:'techno', genre:'techno', title:'Plastic Belgrade - Saturday', sub:'Belgrade, Serbia', artist:'Techno Night', viewers:1240, thumb:'linear-gradient(135deg,#0d0818,#1a0020)', city:'Belgrade', country:'Serbia', free:true, price:'Free', desc:'Plastic Belgrade streams live on Fortis every Saturday. One of Europe best techno clubs.', chat:[{n:'Marco B.',m:'Belgrade techno scene is next level'},{n:'Yuki T.',m:'Watching from Japan, need to visit Serbia'},{n:'Sofia L.',m:'Plastic is legendary'}]},
  {id:'cl4', type:'rnb', genre:'rnb', title:'Amber Lounge - Abu Dhabi', sub:'Abu Dhabi, UAE', artist:'R&B Night', viewers:320, thumb:'linear-gradient(135deg,#1a0500,#2a1000)', city:'Abu Dhabi', country:'UAE', free:true, price:'Free', desc:'Amber Lounge Abu Dhabi streams their R&B and soul nights exclusively on Fortis Music.', chat:[{n:'Priya S.',m:'Amber Lounge is so elegant'},{n:'Carlos P.',m:'R&B vibes are perfect tonight'}]},
  {id:'cl5', type:'house', genre:'house', title:'Tresor Berlin - Underground', sub:'Berlin, Germany', artist:'Various Artists', viewers:2100, thumb:'linear-gradient(135deg,#050505,#101010)', city:'Berlin', country:'Germany', free:true, price:'Free', desc:'Tresor Berlin streams a curated window of their legendary underground nights. Only on Fortis.', chat:[{n:'Marco B.',m:'Tresor on Fortis is a moment in history'},{n:'Aiden K.',m:'Berlin techno forever'},{n:'Yuki T.',m:'This is why Fortis is different'}]},
  {id:'cl6', type:'house', genre:'house', title:'Pacha Ibiza Bar - Chill', sub:'Ibiza, Spain', artist:'Sunset Sessions', viewers:670, thumb:'linear-gradient(135deg,#1a0010,#2a0020)', city:'Ibiza', country:'Spain', free:true, price:'Free', desc:'Pacha bar area streams the relaxed sunset sessions. Perfect if you are deciding whether to come tonight.', chat:[{n:'Sofia L.',m:'This is the dream vibe'},{n:'Carlos P.',m:'Booking flights to Ibiza rn'}]},
];

var lrActiveType = null;
var lrActiveChatInt = null;

function lrOpen(type) {
  lrActiveType = type;
  if (type === 'events') {
    lrRenderGrid('events', LR_EVENTS);
    document.getElementById('now-sub-lrevents').classList.add('open');
  } else {
    lrRenderGrid('clubs', LR_CLUBS);
    document.getElementById('now-sub-lrclubs').classList.add('open');
  }
}
function lrClose(type) {
  if (type === 'events') document.getElementById('now-sub-lrevents').classList.remove('open');
  else document.getElementById('now-sub-lrclubs').classList.remove('open');
}
function lrFilter(type, genre, el) {
  var parent = type === 'events' ? document.getElementById('lrEventsFilters') : document.getElementById('lrClubsFilters');
  parent.querySelectorAll('.lr-filter-btn').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  var data = type === 'events' ? LR_EVENTS : LR_CLUBS;
  var filtered = genre === 'all' ? data : data.filter(function(d){
    return d.type === genre || d.genre === genre || d.city.toLowerCase() === genre || (genre === 'europe' && ['Serbia','UK','Germany','Spain'].indexOf(d.country) !== -1);
  });
  lrRenderGrid(type, filtered);
}
function lrRenderGrid(type, data) {
  var gridId = type === 'events' ? 'lrEventsGrid' : 'lrClubsGrid';
  var grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  data.forEach(function(item) {
    var card = document.createElement('div');
    card.className = 'lr-card' + (type === 'clubs' ? ' clubs' : '');
    card.onclick = (function(id, t){ return function(){ lrOpenStream(id, t); }; })(item.id, type);
    var priceTag = item.free ? '<span class="lr-tag free">Free</span>' : '<span class="lr-tag ticket">' + item.price + '</span>';
    card.innerHTML = '<div class="lr-card-thumb" style="background:' + item.thumb + ';">'
      + '<div class="lr-card-live-badge"><span class="now-live-dot" style="width:5px;height:5px;"></span> LIVE</div>'
      + '<div class="lr-card-viewers">' + item.viewers.toLocaleString() + ' watching</div>'
      + '<div class="lr-card-play"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>'
      + '</div><div class="lr-card-body">'
      + '<div class="lr-card-title">' + item.title + '</div>'
      + '<div class="lr-card-sub">' + item.artist + '</div>'
      + '<div class="lr-card-tags"><span class="lr-tag genre">' + item.genre + '</span><span class="lr-tag city">' + item.city + '</span>' + priceTag + '</div>'
      + '</div>';
    grid.appendChild(card);
  });
}
function lrOpenStream(id, type) {
  var data = type === 'events' ? LR_EVENTS : LR_CLUBS;
  var item = data.find(function(d){ return d.id === id; });
  if (!item) return;
  document.getElementById('lrStreamTitle').textContent = item.title;
  document.getElementById('lrStreamSub').textContent = item.sub;
  document.getElementById('lrStreamName').textContent = item.title;
  document.getElementById('lrStreamDesc').textContent = item.desc;
  var backBtn = document.getElementById('lrStreamBack');
  backBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg> Back to ' + (type === 'events' ? 'Live Events' : 'Clubs Live');
  backBtn.onclick = function(){ lrStreamClose(); };
  var meta = document.getElementById('lrStreamMeta');
  meta.innerHTML = '<span class="lr-tag genre">' + item.genre + '</span>'
    + '<span class="lr-tag city">' + item.city + ' - ' + item.country + '</span>'
    + (item.free ? '<span class="lr-tag free">Free</span>' : '<span class="lr-tag ticket">' + item.price + '</span>')
    + '<span class="lr-tag" style="background:rgba(200,180,255,0.11);color:var(--muted);">' + item.viewers.toLocaleString() + ' watching</span>';
  var actions = document.getElementById('lrStreamActions');
  actions.innerHTML = '';
  if (!item.free) {
    var b1 = document.createElement('button'); b1.className = 'lr-player-btn primary';
    b1.textContent = 'Watch for ' + item.price;
    b1.onclick = function(){ showToast('Payment coming in full release!'); };
    actions.appendChild(b1);
  }
  if (type === 'clubs') {
    var b2 = document.createElement('button'); b2.className = 'lr-player-btn ghost';
    b2.textContent = 'Get directions';
    b2.onclick = function(){ showToast('Opening maps for ' + item.city + '...'); };
    actions.appendChild(b2);
  }
  var b3 = document.createElement('button'); b3.className = 'lr-player-btn ghost';
  b3.textContent = 'Share stream';
  b3.onclick = function(){ showToast('Link copied!'); };
  actions.appendChild(b3);
  lrInitChat(item.chat);
  document.getElementById('now-sub-lrstream').classList.add('open');
}
function lrStreamClose() {
  document.getElementById('now-sub-lrstream').classList.remove('open');
  if (lrActiveChatInt) { clearInterval(lrActiveChatInt); lrActiveChatInt = null; }
}
function lrInitChat(seed) {
  var msgs = document.getElementById('lrChatMsgs');
  msgs.innerHTML = '';
  seed.forEach(function(m) {
    var d = document.createElement('div'); d.className = 'lr-chat-msg';
    d.innerHTML = '<span class="n">' + m.n + '</span>' + m.m;
    msgs.appendChild(d);
  });
  msgs.scrollTop = msgs.scrollHeight;
  if (lrActiveChatInt) clearInterval(lrActiveChatInt);
  lrActiveChatInt = setInterval(function() {
    if (Math.random() < 0.35) {
      var extras = ['Just joined!','This is fire','Fortis is the future','Watching from far away','Amazing stream quality'];
      var names = ['Fan_42','MusicLover','NightOwl','GlobalFan','StreamFan'];
      var d = document.createElement('div'); d.className = 'lr-chat-msg';
      d.innerHTML = '<span class="n">' + names[Math.floor(Math.random()*names.length)] + '</span>' + extras[Math.floor(Math.random()*extras.length)];
      msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
    }
  }, 4000);
}
function lrChatSend() {
  var inp = document.getElementById('lrChatIn');
  if (!inp || !inp.value.trim()) return;
  var msgs = document.getElementById('lrChatMsgs');
  var d = document.createElement('div'); d.className = 'lr-chat-msg';
  d.innerHTML = '<span class="n" style="color:var(--pink);">You</span>' + inp.value.trim();
  msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; inp.value = '';
}


var LR_EVENTS = [
  {id:'ev1',type:'concert',genre:'electronic',title:'EXIT Festival - Main Stage',sub:'Novi Sad, Serbia',artist:'DJ Nexus + Luna Rivera',viewers:4240,thumb:'linear-gradient(135deg,#0a0030,#1a0060)',city:'Novi Sad',country:'Serbia',free:false,price:'€5',desc:'Europe biggest exit festival streams live exclusively on Fortis. Watch the main stage acts in real time.',chat:[{n:'Marco B.',m:'EXIT is insane this year'},{n:'Sofia L.',m:'DJ Nexus opening set'},{n:'Yuki T.',m:'Watching from Tokyo right now'},{n:'Carlos P.',m:'Stream quality is perfect'}]},
  {id:'ev2',type:'concert',genre:'hiphop',title:'Marcus Wave - Live in Atlanta',sub:'Atlanta, USA',artist:'Marcus Wave',viewers:2180,thumb:'linear-gradient(135deg,#101000,#302000)',city:'Atlanta',country:'USA',free:true,price:'Free',desc:'Marcus Wave performs his debut album Street Psalms live for the first time. Full show, no cuts.',chat:[{n:'Aiden K.',m:'Street Psalms live omg'},{n:'Zara M.',m:'He is incredible live'},{n:'DJ P.',m:'Support real artists'}]},
  {id:'ev3',type:'festival',genre:'electronic',title:'Fabric London - Friday Night',sub:'London, UK',artist:'Various DJs',viewers:3120,thumb:'linear-gradient(135deg,#001030,#002060)',city:'London',country:'UK',free:false,price:'£3',desc:'Fabric London streams their Friday night lineup exclusively on Fortis Music. 4 rooms, all live.',chat:[{n:'Sarah T.',m:'Fabric never disappoints'},{n:'Marco B.',m:'Room 2 is incredible right now'},{n:'Yuki T.',m:'That bass drop!!!'}]},
  {id:'ev4',type:'concert',genre:'rock',title:'The Void - Manchester Arena',sub:'Manchester, UK',artist:'The Void',viewers:5600,thumb:'linear-gradient(135deg,#0a0a0a,#1a1a1a)',city:'Manchester',country:'UK',free:false,price:'£4',desc:'The Void plays their biggest headline show to date at Manchester Arena. Stream live on Fortis.',chat:[{n:'Carlos P.',m:'The Void are UNREAL live'},{n:'Sofia L.',m:'Static Pulse just dropped'},{n:'Priya S.',m:'This crowd energy'}]},
  {id:'ev5',type:'festival',genre:'electronic',title:'Pacha Ibiza - Summer Opener',sub:'Ibiza, Spain',artist:'DJ Pharaoh + Guest',viewers:8900,thumb:'linear-gradient(135deg,#1a0010,#330020)',city:'Ibiza',country:'Spain',free:false,price:'€6',desc:'Pacha Ibiza kicks off the summer season with an exclusive Fortis livestream. First time ever.',chat:[{n:'Marco B.',m:'Pacha on Fortis is historic'},{n:'Aiden K.',m:'That DJ Pharaoh set'},{n:'Zara M.',m:'Ibiza energy through the screen'}]},
  {id:'ev6',type:'concert',genre:'electronic',title:'Womb Tokyo - Saturday Live',sub:'Tokyo, Japan',artist:'Kira Tanaka',viewers:1840,thumb:'linear-gradient(135deg,#001a10,#003020)',city:'Tokyo',country:'Japan',free:true,price:'Free',desc:'Womb Tokyo streams their Saturday night showcase. Featuring Kira Tanaka and the best of Tokyo.',chat:[{n:'Yuki T.',m:'Womb Tokyo represent!'},{n:'Carlos P.',m:'Tokyo scene is insane'}]},
];
var LR_CLUBS = [
  {id:'cl1',type:'techno',genre:'techno',title:'Warehouse 14 - Dubai',sub:'Dubai, UAE',artist:'DJ Echo live',viewers:892,thumb:'linear-gradient(135deg,#0a0015,#1a0030)',city:'Dubai',country:'UAE',free:true,price:'Free',desc:'Warehouse 14 in Dubai streams their Friday night techno session live. Walk-ins welcome after midnight.',chat:[{n:'Priya S.',m:'Warehouse 14 always goes hard'},{n:'Marco B.',m:'Going there tonight after watching this'},{n:'Sofia L.',m:'That DJ Echo set'}]},
  {id:'cl2',type:'house',genre:'house',title:'Club Celsius - Dubai',sub:'Dubai, UAE',artist:'House Night',viewers:445,thumb:'linear-gradient(135deg,#001030,#002050)',city:'Dubai',country:'UAE',free:true,price:'Free',desc:'Club Celsius streams their weekly house night. Check the vibe before you head out tonight.',chat:[{n:'Aiden K.',m:'Celsius vibe is different'},{n:'Carlos P.',m:'Might head there after 1am'}]},
  {id:'cl3',type:'techno',genre:'techno',title:'Plastic Belgrade - Saturday',sub:'Belgrade, Serbia',artist:'Techno Night',viewers:1240,thumb:'linear-gradient(135deg,#0d0818,#1a0020)',city:'Belgrade',country:'Serbia',free:true,price:'Free',desc:'Plastic Belgrade streams live on Fortis every Saturday. One of Europe best techno clubs.',chat:[{n:'Marco B.',m:'Belgrade techno scene is next level'},{n:'Yuki T.',m:'Watching from Japan, need to visit Serbia'},{n:'Sofia L.',m:'Plastic is legendary'}]},
  {id:'cl4',type:'rnb',genre:'rnb',title:'Amber Lounge - Abu Dhabi',sub:'Abu Dhabi, UAE',artist:'R&B Night',viewers:320,thumb:'linear-gradient(135deg,#1a0500,#2a1000)',city:'Abu Dhabi',country:'UAE',free:true,price:'Free',desc:'Amber Lounge Abu Dhabi streams their R&B and soul nights exclusively on Fortis Music.',chat:[{n:'Priya S.',m:'Amber Lounge is so elegant'},{n:'Carlos P.',m:'R&B vibes are perfect tonight'}]},
  {id:'cl5',type:'house',genre:'house',title:'Tresor Berlin - Underground',sub:'Berlin, Germany',artist:'Various Artists',viewers:2100,thumb:'linear-gradient(135deg,#050505,#101010)',city:'Berlin',country:'Germany',free:true,price:'Free',desc:'Tresor Berlin streams a curated window of their legendary underground nights. Only on Fortis.',chat:[{n:'Marco B.',m:'Tresor on Fortis is history'},{n:'Aiden K.',m:'Berlin techno forever'},{n:'Yuki T.',m:'This is why Fortis is different'}]},
  {id:'cl6',type:'house',genre:'house',title:'Pacha Ibiza Bar - Chill',sub:'Ibiza, Spain',artist:'Sunset Sessions',viewers:670,thumb:'linear-gradient(135deg,#1a0010,#2a0020)',city:'Ibiza',country:'Spain',free:true,price:'Free',desc:'Pacha bar area streams the relaxed sunset sessions. Perfect if you are deciding whether to come tonight.',chat:[{n:'Sofia L.',m:'This is the dream vibe'},{n:'Carlos P.',m:'Booking flights to Ibiza rn'}]},
];
var lrActiveType=null,lrActiveChatInt=null;
function lrOpen(type){lrActiveType=type;if(type==='events'){lrRenderGrid('events',LR_EVENTS);document.getElementById('now-sub-lrevents').classList.add('open');}else{lrRenderGrid('clubs',LR_CLUBS);document.getElementById('now-sub-lrclubs').classList.add('open');}}
function lrClose(type){if(type==='events')document.getElementById('now-sub-lrevents').classList.remove('open');else document.getElementById('now-sub-lrclubs').classList.remove('open');}
function lrFilter(type,genre,el){var parent=type==='events'?document.getElementById('lrEventsFilters'):document.getElementById('lrClubsFilters');parent.querySelectorAll('.lr-filter-btn').forEach(function(b){b.classList.remove('active');});el.classList.add('active');var data=type==='events'?LR_EVENTS:LR_CLUBS;var filtered=genre==='all'?data:data.filter(function(d){return d.type===genre||d.genre===genre||d.city.toLowerCase()===genre||(genre==='europe'&&['Serbia','UK','Germany','Spain'].indexOf(d.country)!==-1);});lrRenderGrid(type,filtered);}
function lrRenderGrid(type,data){var gridId=type==='events'?'lrEventsGrid':'lrClubsGrid';var grid=document.getElementById(gridId);if(!grid)return;grid.innerHTML='';data.forEach(function(item){var card=document.createElement('div');card.className='lr-card'+(type==='clubs'?' clubs':'');card.onclick=(function(id,t){return function(){lrOpenStream(id,t);};})(item.id,type);var priceTag=item.free?'<span class="lr-tag free">Free</span>':'<span class="lr-tag ticket">'+item.price+'</span>';card.innerHTML='<div class="lr-card-thumb" style="background:'+item.thumb+';"><div class="lr-card-live-badge"><span class="now-live-dot" style="width:5px;height:5px;"></span> LIVE</div><div class="lr-card-viewers">'+item.viewers.toLocaleString()+' watching</div><div class="lr-card-play"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg></div></div><div class="lr-card-body"><div class="lr-card-title">'+item.title+'</div><div class="lr-card-sub">'+item.artist+'</div><div class="lr-card-tags"><span class="lr-tag genre">'+item.genre+'</span><span class="lr-tag city">'+item.city+'</span>'+priceTag+'</div></div>';grid.appendChild(card);});}
function lrOpenStream(id,type){var data=type==='events'?LR_EVENTS:LR_CLUBS;var item=data.find(function(d){return d.id===id;});if(!item)return;document.getElementById('lrStreamTitle').textContent=item.title;document.getElementById('lrStreamSub').textContent=item.sub;document.getElementById('lrStreamName').textContent=item.title;document.getElementById('lrStreamDesc').textContent=item.desc;var backBtn=document.getElementById('lrStreamBack');backBtn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg> Back to '+(type==='events'?'Live Events':'Clubs Live');backBtn.onclick=function(){lrStreamClose();};var meta=document.getElementById('lrStreamMeta');meta.innerHTML='<span class="lr-tag genre">'+item.genre+'</span><span class="lr-tag city">'+item.city+' - '+item.country+'</span>'+(item.free?'<span class="lr-tag free">Free</span>':'<span class="lr-tag ticket">'+item.price+'</span>')+'<span class="lr-tag" style="background:rgba(200,180,255,0.11);color:var(--muted);">'+item.viewers.toLocaleString()+' watching</span>';var actions=document.getElementById('lrStreamActions');actions.innerHTML='';if(!item.free){var b1=document.createElement('button');b1.className='lr-player-btn primary';b1.textContent='Watch for '+item.price;b1.onclick=function(){showToast('Payment coming in full release!');};actions.appendChild(b1);}if(type==='clubs'){var b2=document.createElement('button');b2.className='lr-player-btn ghost';b2.textContent='Get directions';b2.onclick=function(){showToast('Opening maps for '+item.city+'...');};actions.appendChild(b2);}var b3=document.createElement('button');b3.className='lr-player-btn ghost';b3.textContent='Share stream';b3.onclick=function(){showToast('Link copied!');};actions.appendChild(b3);lrInitChat(item.chat);document.getElementById('now-sub-lrstream').classList.add('open');}
function lrStreamClose(){document.getElementById('now-sub-lrstream').classList.remove('open');if(lrActiveChatInt){clearInterval(lrActiveChatInt);lrActiveChatInt=null;}}
function lrInitChat(seed){var msgs=document.getElementById('lrChatMsgs');msgs.innerHTML='';seed.forEach(function(m){var d=document.createElement('div');d.className='lr-chat-msg';d.innerHTML='<span class="n">'+m.n+'</span>'+m.m;msgs.appendChild(d);});msgs.scrollTop=msgs.scrollHeight;if(lrActiveChatInt)clearInterval(lrActiveChatInt);lrActiveChatInt=setInterval(function(){if(Math.random()<0.35){var ex=['Just joined!','This is fire','Fortis is the future','Watching from far away','Amazing stream quality'];var ns=['Fan_42','MusicLover','NightOwl','GlobalFan','StreamFan'];var d=document.createElement('div');d.className='lr-chat-msg';d.innerHTML='<span class="n">'+ns[Math.floor(Math.random()*ns.length)]+'</span>'+ex[Math.floor(Math.random()*ex.length)];msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}},4000);}
function lrChatSend(){var inp=document.getElementById('lrChatIn');if(!inp||!inp.value.trim())return;var msgs=document.getElementById('lrChatMsgs');var d=document.createElement('div');d.className='lr-chat-msg';d.innerHTML='<span class="n" style="color:var(--pink);">You</span>'+inp.value.trim();msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;inp.value='';}




// Auto-detect country/city
(function() {
  fetch('https://ipapi.co/json/')
    .then(function(r){ return r.json(); })
    .then(function(d) {
      var c = document.getElementById('fpCountry');
      var ci = document.getElementById('fpCity');
      if (c && d.country_name) c.value = d.country_name;
      if (ci && d.city) ci.value = d.city;
    }).catch(function(){});
})();

// ══ CONTACT ROLE TABS ══
var _contactRole = 'investor';
var _contactRoleConfig = {
  investor: { hint: '<strong style="color:#C8A97E;">Investors:</strong> Tell us about your thesis and we\'ll share our deck &amp; traction data.', extraLabel: 'Fund / Organization', extraPlaceholder: 'e.g. Sequoia Capital, Angel', accentColor: '#C8A97E', bgColor: 'rgba(200,169,126,0.06)', borderColor: 'rgba(200,169,126,0.18)' },
  artist:   { hint: '<strong style="color:#E91E8C;">Artists:</strong> Tell us about your music and we\'ll show you how Fortis can protect your rights.', extraLabel: 'Genre / Stage Name', extraPlaceholder: 'e.g. Electronic, Luna Rivera', accentColor: '#E91E8C', bgColor: 'rgba(233,30,140,0.06)', borderColor: 'rgba(233,30,140,0.18)' },
  partner:  { hint: '<strong style="color:#A06EFF;">Partners:</strong> Interested in integrating Fortis detection into your platform? Let\'s talk API.', extraLabel: 'Company / Platform', extraPlaceholder: 'e.g. SoundCloud, Spotify', accentColor: '#A06EFF', bgColor: 'rgba(123,47,255,0.06)', borderColor: 'rgba(123,47,255,0.18)' },
  press:    { hint: '<strong style="color:#00E676;">Press:</strong> Working on a story about music rights or Web3? We\'d love to connect.', extraLabel: 'Publication / Media', extraPlaceholder: 'e.g. TechCrunch, Rolling Stone', accentColor: '#00E676', bgColor: 'rgba(0,230,118,0.06)', borderColor: 'rgba(0,230,118,0.18)' },
  other:    { hint: '<strong style="color:rgba(200,180,255,0.8);">Hey there:</strong> Doesn\'t matter what brings you — just say hello.', extraLabel: 'Subject', extraPlaceholder: 'What\'s this about?', accentColor: 'rgba(200,180,255,0.6)', bgColor: 'rgba(200,180,255,0.04)', borderColor: 'rgba(200,180,255,0.15)' }
};

function setContactRole(role) {
  _contactRole = role;
  var cfg = _contactRoleConfig[role];
  var hint = document.getElementById('contact-hint');
  if (hint) { hint.innerHTML = cfg.hint; hint.style.background = cfg.bgColor; hint.style.borderColor = cfg.borderColor; }
  var extraLabel = document.querySelector('#contact-extra label');
  var extraInput = document.getElementById('contact-extra-input');
  if (extraLabel) extraLabel.textContent = cfg.extraLabel;
  if (extraInput) extraInput.placeholder = cfg.extraPlaceholder;
  var rh = document.getElementById('contact-role-hidden');
  if (rh) rh.value = role;
  ['investor','artist','partner','press','other'].forEach(function(r) {
    var b = document.getElementById('crb-' + r);
    if (!b) return;
    b.style.cssText = r === role
      ? 'padding:8px 18px;border-radius:16px;border:1px solid ' + cfg.accentColor + ';background:' + cfg.bgColor + ';color:' + cfg.accentColor + ';font-size:0.82rem;font-weight:600;cursor:pointer;'
      : 'padding:8px 18px;border-radius:16px;border:1px solid rgba(200,180,255,0.12);background:transparent;color:rgba(200,180,255,0.55);font-size:0.82rem;font-weight:600;cursor:pointer;';
  });
}

function handleNetlifySubmit(e) {
  e.preventDefault();
  var form = document.getElementById('netlify-contact-form');
  var email = (document.getElementById('contact-email') || {}).value || '';
  var btn = document.getElementById('contact-submit-btn');
  if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
  var rh = document.getElementById('contact-role-hidden');
  if (rh) rh.value = _contactRole;
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(new FormData(form)).toString()
  }).then(function() {
    var s = document.getElementById('contact-sent-email');
    if (s) s.textContent = email;
    var ok = document.getElementById('contact-success');
    if (ok) ok.style.display = 'block';
    form.reset();
    if (btn) { btn.textContent = 'Send Message →'; btn.disabled = false; }
  }).catch(function() {
    showToast('Could not send. Try emailing us directly at info@fortismusic.co');
    if (btn) { btn.textContent = 'Send Message →'; btn.disabled = false; }
  });
}




/* ================================================================
   SECTION BREAK
   ================================================================ */

!function(){var e=document.getElementById('fortis-email-link'),m=['info','@','fortismusic','.','co'].join('');if(e){e.textContent=m;e.onclick=function(){window.location.href='mailto:'+m;};}}();

/* ================================================================
   SECTION BREAK
   ================================================================ */


// FLOATING PANEL - runs after full DOM is loaded
window.addEventListener('load', function() {
  var p = document.getElementById('floatPanel');
  var t = document.getElementById('floatTab');
  if (!p) { console.log('floatPanel not found'); return; }
  console.log('floatPanel found, showing in 3s');
  setTimeout(function() {
    p.classList.add('visible');
    p.classList.remove('hidden');
    if (t) t.style.display = 'none';
    console.log('floatPanel shown');
  }, 3000);
});

function floatShow() {
  var p = document.getElementById('floatPanel');
  var t = document.getElementById('floatTab');
  if (!p) return;
  p.classList.add('visible');
  p.classList.remove('hidden');
  if (t) t.style.display = 'none';
}

function floatHide() {
  var p = document.getElementById('floatPanel');
  var t = document.getElementById('floatTab');
  if (!p) return;
  p.classList.add('hidden');
  p.classList.remove('visible');
  setTimeout(function() {
    if (t && !localStorage.getItem('fm_access')) t.style.display = 'block';
  }, 400);
}

var STUDIO_DB = [
  { id:'s1', name:'Warehouse Sound Dubai', city:'Dubai', country:'UAE', type:'Recording Studio', rate:120, rating:4.9, reviews:84, img:'🎙️', tags:['Pro Tools','SSL Console','Live Room','Vocal Booth'], desc:'Top-tier recording facility in Dubai with Neve 8078 console, live room for full bands, and world-class acoustics.', gear:['Neve 8078','Pro Tools HDX','Neumann U87','SSL G Bus Compressor','Yamaha C7 Grand Piano'], genres:['Electronic','Hip-Hop','Pop','R&B'], video:'https://www.youtube.com/embed/dQw4w9WgXcQ', booked:312, verified:true },
  { id:'s2', name:'Studio 44 Belgrade', city:'Belgrade', country:'Serbia', type:'Recording Studio', rate:45, rating:4.8, reviews:127, img:'🎚️', tags:['Analog','Vintage Gear','Live Room','Mixing'], desc:'Belgrade iconic studio. Founded in 1994, home to hundreds of regional hits. Full analog signal chain available.', gear:['SSL 4000E','Studer A80 Tape Machine','AKG C414','Eventide H3000','Moog Minimoog'], genres:['Rock','Electronic','Folk','Jazz'], video:'https://www.youtube.com/embed/9bZkp7q19f0', booked:489, verified:true },
  { id:'s3', name:'Crystal Clear LA', city:'Los Angeles', country:'USA', type:'Mix & Master', rate:250, rating:5.0, reviews:56, img:'🔊', tags:['Mastering','Atmos','Remote Sessions','Grammy Engineers'], desc:'Grammy-winning mastering studio specialising in Dolby Atmos and spatial audio. Remote sessions available worldwide.', gear:['Studer A800','Manley Vari-Mu','Prism Dream ADA-128','Neve 33609','API 2500'], genres:['All Genres','Spatial Audio','Film','Pop'], video:null, booked:201, verified:true },
  { id:'s4', name:'Abu Dhabi Media Hub', city:'Abu Dhabi', country:'UAE', type:'Film Scoring', rate:90, rating:4.7, reviews:43, img:'🎤', tags:['Film Scoring','Orchestra','Podcast','TV'], desc:'State-of-the-art facility for film and TV scoring. Full orchestral recording with 60-piece capacity.', gear:['Pro Tools S6','Vienna Symphonic Library','Neve 8078','AVID S6L','Yamaha Disklavier'], genres:['Film','Classical','Electronic','World'], video:'https://www.youtube.com/embed/dQw4w9WgXcQ', booked:98, verified:true },
  { id:'s5', name:'Pulse Studio Berlin', city:'Berlin', country:'Germany', type:'Rehearsal Space', rate:30, rating:4.6, reviews:215, img:'🥁', tags:['Band Rehearsal','24hr Access','Backline','Storage'], desc:'Berlin favourite rehearsal complex with 12 fully equipped rooms, 24-hour access, and full backline available.', gear:['Pearl Drums','Marshall JCM900','Fender Twin Reverb','DW Kit','Roland SPD'], genres:['Rock','Metal','Electronic','Jazz'], video:null, booked:1240, verified:false },
  { id:'s6', name:'Sonic Temple London', city:'London', country:'UK', type:'Recording Studio', rate:180, rating:4.9, reviews:91, img:'🎹', tags:['SSL','Pro Tools','Neve','Vintage Synths'], desc:'Central London recording studio with an unmatched vintage synth collection. Favoured by UK electronic and indie artists.', gear:['SSL 9000XL','Moog Modular','ARP 2600','Buchla 200','Steinway Model D'], genres:['Electronic','Indie','Pop','Ambient'], video:'https://www.youtube.com/embed/9bZkp7q19f0', booked:374, verified:true },
  { id:'s7', name:'Tokyo Sound Lab', city:'Tokyo', country:'Japan', type:'Mix & Master', rate:160, rating:4.8, reviews:67, img:'🎵', tags:['Japanese Mastering','Hi-Fi','Vinyl Cutting','J-Pop'], desc:'Precision mastering studio in Tokyo, renowned for immaculate detail and finest vinyl cutting in Asia.', gear:['Westrex Lathe','Sontec MEP-250C','GML 8200','Ampex ATR-102','Crane Song Hedd'], genres:['J-Pop','Electronic','Classical','Jazz'], video:null, booked:156, verified:true },
  { id:'s8', name:'Studio Mixx Paris', city:'Paris', country:'France', type:'Recording Studio', rate:140, rating:4.7, reviews:38, img:'🎸', tags:['Neve','Grand Piano','Vocal Booth','Live Room'], desc:'Parisian studio known for exceptional acoustic design and warm analogue sound. Preferred by classical and jazz artists.', gear:['Neve 8078','Fazioli F308','Neumann M149','Pultec EQP-1A','Universal Audio 1176'], genres:['Jazz','Classical','French Pop','World'], video:null, booked:89, verified:true }
];

var studioFilters = { search:'', country:'', city:'', type:'', budget:'', sort:'Best Rated' };

function renderStudioCards() {
  var grid = document.getElementById('studioGrid');
  var count = document.getElementById('studioCount');
  if (!grid) return;
  var db = STUDIO_DB;
  var filtered = db.filter(function(s) {
    if (studioFilters.search && !(s.name+s.city+s.tags.join(' ')).toLowerCase().includes(studioFilters.search.toLowerCase())) return false;
    if (studioFilters.country && s.country !== studioFilters.country) return false;
    if (studioFilters.city && s.city !== studioFilters.city) return false;
    if (studioFilters.type && s.type !== studioFilters.type) return false;
    if (studioFilters.budget) {
      var p = studioFilters.budget;
      if (p==='0-50' && s.rate>=50) return false;
      if (p==='50-150' && (s.rate<50||s.rate>=150)) return false;
      if (p==='150-500' && (s.rate<150||s.rate>=500)) return false;
      if (p==='500+' && s.rate<500) return false;
    }
    return true;
  });
  if (studioFilters.sort==='Price: Low to High') filtered.sort(function(a,b){return a.rate-b.rate;});
  else if (studioFilters.sort==='Price: High to Low') filtered.sort(function(a,b){return b.rate-a.rate;});
  else if (studioFilters.sort==='Most Booked') filtered.sort(function(a,b){return b.booked-a.booked;});
  else filtered.sort(function(a,b){return b.rating-a.rating;});
  if (count) count.textContent = filtered.length;
  grid.innerHTML = '';
  filtered.forEach(function(s) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;overflow:hidden;cursor:pointer;transition:border-color 0.2s;';
    var tags = s.tags.slice(0,3).map(function(t){
      return '<span style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.15);color:rgba(200,180,255,0.72);padding:2px 8px;border-radius:2px;font-size:0.68rem;">'+t+'</span>';
    }).join('');
    var badge = s.verified ? '<span style="background:rgba(0,230,118,0.08);border:1px solid rgba(0,230,118,0.2);color:#00E676;padding:2px 7px;border-radius:2px;font-size:0.6rem;font-weight:700;">OK</span>' : '';
    card.innerHTML = '<div style="background:rgba(233,30,140,0.06);padding:28px;text-align:center;font-size:2.5rem;">'+s.img+'</div>'
      + '<div style="padding:16px;">'
      + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px;"><div style="font-weight:700;font-size:0.92rem;">'+s.name+'</div>'+badge+'</div>'
      + '<div style="font-size:0.75rem;color:rgba(200,180,255,0.58);margin-bottom:10px;">'+s.city+', '+s.country+' | '+s.type+'</div>'
      + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">'+tags+'</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;">'
      + '<div style="font-size:0.78rem;color:rgba(200,180,255,0.58);">'+s.rating+' ('+s.reviews+')</div>'
      + '<div style="font-size:0.88rem;font-weight:700;color:#E91E8C;">EUR '+s.rate+'/hr</div>'
      + '</div></div>';
    card.addEventListener('mouseover', function(){ this.style.borderColor='rgba(233,30,140,0.3)'; });
    card.addEventListener('mouseout', function(){ this.style.borderColor='rgba(200,180,255,0.13)'; });
    (function(sid){ card.addEventListener('click', function(){ openStudio(sid); }); })(s.id);
    grid.appendChild(card);
  });
}

function filterStudios() {
  studioFilters.search = (document.getElementById('studioSearch')||{value:''}).value;
  studioFilters.country = (document.getElementById('studioCountry')||{value:''}).value;
  studioFilters.city = (document.getElementById('studioCity')||{value:''}).value;
  studioFilters.type = (document.getElementById('studioType')||{value:''}).value;
  studioFilters.budget = (document.getElementById('studioBudget')||{value:''}).value;
  studioFilters.sort = (document.getElementById('studioSort')||{value:'Best Rated'}).value;
  renderStudioCards();
}

function clearStudioFilters() {
  studioFilters = { search:'', country:'', city:'', type:'', budget:'', sort:'Best Rated' };
  ['studioSearch','studioCountry','studioCity','studioType','studioBudget','studioSort'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.value = '';
  });
  renderStudioCards();
}

function quickStudioFilter(type) {
  studioFilters.type = type;
  var sel = document.getElementById('studioType'); if (sel) sel.value = type;
  renderStudioCards();
}

function openStudio(id) {
  var s = STUDIO_DB.find(function(x){ return x.id===id; });
  if (!s) return;
  var detail = document.getElementById('studioDetail');
  var grid = document.getElementById('studioGrid');
  if (!detail || !grid) return;
  grid.style.display = 'none';
  detail.style.display = 'block';
  // Scroll to top of detail
  detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  var gearTags = s.gear.map(function(g){ return '<span style="background:rgba(200,180,255,0.07);border:1px solid rgba(255,255,255,0.08);padding:5px 12px;border-radius:2px;font-size:0.78rem;color:rgba(200,180,255,0.72);">'+g+'</span>'; }).join('');
  var genreTags = s.genres.map(function(g){ return '<span style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.15);padding:4px 12px;border-radius:2px;font-size:0.78rem;color:rgba(200,180,255,0.72);">'+g+'</span>'; }).join('');
  var tagPills = s.tags.map(function(t){ return '<span style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.15);color:rgba(200,180,255,0.72);padding:3px 10px;border-radius:2px;font-size:0.7rem;">'+t+'</span>'; }).join('');
  var videoHtml = s.video ? '<div style="position:relative;padding-bottom:56.25%;height:0;margin-bottom:16px;border-radius:4px;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="'+s.video+'?rel=0&modestbranding=1" allowfullscreen loading="lazy"></iframe></div>' : '';
  detail.innerHTML =
    '<button id="studioBackBtn" style="display:flex;align-items:center;gap:6px;margin-bottom:24px;padding:8px 16px;background:transparent;border:1px solid rgba(123,47,255,0.28);color:rgba(200,180,255,0.72);border-radius:16px;cursor:pointer;font-size:0.82rem;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>'
    + 'Back to Studios</button>'
    + '<div style="display:grid;grid-template-columns:1fr 320px;gap:24px;" class="studio-detail-grid">'
    + '<div>'
    + '<div style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.1);border-radius:16px;padding:40px;text-align:center;font-size:4rem;margin-bottom:16px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'+s.img+'</div>'
    + videoHtml
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;margin-bottom:16px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:12px;">About</div><p style="font-size:0.88rem;color:rgba(255,255,255,0.6);line-height:1.75;">'+s.desc+'</p></div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;margin-bottom:16px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:14px;">Equipment</div><div style="display:flex;flex-wrap:wrap;gap:8px;">'+gearTags+'</div></div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:14px;">Genres</div><div style="display:flex;flex-wrap:wrap;gap:8px;">'+genreTags+'</div></div>'
    + '</div>'
    + '<div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;margin-bottom:14px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<h2 style="font-size:1.3rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:4px;">'+s.name+'</h2>'
    + '<div style="font-size:0.78rem;color:rgba(200,180,255,0.58);margin-bottom:16px;">'+s.city+', '+s.country+'</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(200,180,255,0.11);border-radius:4px;overflow:hidden;margin-bottom:16px;">'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#E91E8C;">EUR '+s.rate+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Per Hour</div></div>'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#fff;">'+s.rating+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Rating</div></div>'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#fff;">'+s.reviews+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Reviews</div></div>'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#00E676;">'+s.booked+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Booked</div></div>'
    + '</div>'
    + '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">'+tagPills+'</div>'
    + '<button id="studioBookBtn" style="width:100%;padding:12px;background:linear-gradient(135deg,#E91E8C,#7B2FFF);border:none;color:#fff;border-radius:16px;font-size:0.88rem;font-weight:700;cursor:pointer;margin-bottom:8px;">Book a Session</button>'
    + '<button id="studioEnqBtn" style="width:100%;padding:10px;background:transparent;border:1px solid rgba(123,47,255,0.28);color:rgba(200,180,255,0.62);border-radius:16px;font-size:0.82rem;cursor:pointer;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">Send Enquiry</button>'
    + '</div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:18px;margin-top:14px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:12px;">Opening Hours</div><div style="font-size:0.82rem;color:rgba(255,255,255,0.4);line-height:1.8;">Mon - Fri: 9:00 - 22:00<br>Saturday: 10:00 - 20:00<br>Sunday: By appointment</div></div>'
    + '</div></div>';
  document.getElementById('studioBackBtn').onclick = closeStudio;
  document.getElementById('studioBookBtn').onclick = function(){ showToast('Booking request sent to ' + s.name + '!'); };
  document.getElementById('studioEnqBtn').onclick = function(){ showToast('Enquiry sent!'); };
}

function closeStudio() {
  document.getElementById('studioDetail').style.display = 'none';
  var grid = document.getElementById('studioGrid');
  grid.style.display = '';
  window.scrollTo(0, 0);
}


var DANCE_DB = [
  { id:'d1', name:'Struktura Dance Company', city:'Belgrade', country:'Serbia', type:'Contemporary', members:24, founded:2008, rating:4.9, reviews:112, img:'💃', tags:['Contemporary','Breakdance','Hip-Hop'], desc:'One of the most celebrated contemporary dance companies in the Balkans. Known for powerful storytelling through movement, merging classical technique with urban street styles.', styles:['Contemporary','Breakdance','Hip-Hop','Jazz'], achievements:['National Dance Award 2022','EXIT Festival Residency','European Tour 2023'], video:'https://www.youtube.com/embed/dQw4w9WgXcQ', booked:89, verified:true, contact:'info@struktura.rs' },
  { id:'d2', name:'Dubai Move Studio', city:'Dubai', country:'UAE', type:'Dance Club', members:180, founded:2015, rating:4.8, reviews:204, img:'🕺', tags:['Hip-Hop','Salsa','Bachata','Kizomba'], desc:'Dubai top urban dance club with world-class instructors and weekly social dance nights. Open to all levels from beginners to professionals.', styles:['Hip-Hop','Salsa','Bachata','Kizomba','Dancehall'], achievements:['Best Dance Club UAE 2023','World Salsa Championship Qualifiers','10,000+ Students Trained'], video:'https://www.youtube.com/embed/9bZkp7q19f0', booked:340, verified:true, contact:'hello@dubaimove.ae' },
  { id:'d3', name:'Red Bull Dance Academy', city:'London', country:'UK', type:'Street Dance', members:60, founded:2010, rating:5.0, reviews:87, img:'🔥', tags:['Breakdance','Popping','Locking','Waacking'], desc:'Elite street dance academy producing world-class breakers and freestyle artists. Home to multiple UK and European b-boy champions.', styles:['Breakdance','Popping','Locking','Waacking','House'], achievements:['UK B-Boy Championships x4','Battle of the Year Finalists','Red Bull BC One Participants'], video:'https://www.youtube.com/embed/dQw4w9WgXcQ', booked:156, verified:true, contact:'academy@redbulldance.co.uk' },
  { id:'d4', name:'Kompania Koreografska Novi Sad', city:'Novi Sad', country:'Serbia', type:'Ballet & Contemporary', members:18, founded:1998, rating:4.7, reviews:63, img:'🩰', tags:['Ballet','Contemporary','Modern'], desc:'Prestigious dance company based in Novi Sad with over 25 years of performance history. Blending classical ballet with modern European contemporary dance.', styles:['Ballet','Contemporary','Modern','Neo-Classical'], achievements:['Sterijino Pozorje Award','International Festival Ljubljana','Co-production with Vienna Opera'], video:null, booked:44, verified:true, contact:'kompanija@kcns.org' },
  { id:'d5', name:'Tokyo Urban Crew', city:'Tokyo', country:'Japan', type:'Street Dance', members:35, founded:2012, rating:4.9, reviews:143, img:'⚡', tags:['Hip-Hop','Popping','Locking','Waacking'], desc:'Tokyo leading street dance collective, merging Japanese precision with American hip-hop culture. Regular performers at major music festivals and brand campaigns.', styles:['Hip-Hop','Popping','Locking','Waacking','Krump'], achievements:['World Hip-Hop Dance Championship Finalists','Fuji Rock Performance','Nike Campaign 2024'], video:'https://www.youtube.com/embed/9bZkp7q19f0', booked:211, verified:true, contact:'crew@tokyourban.jp' },
  { id:'d6', name:'Flamenco Vivo Madrid', city:'Madrid', country:'Spain', type:'Flamenco', members:12, founded:2003, rating:4.9, reviews:78, img:'🌹', tags:['Flamenco','Spanish Dance','Traditional'], desc:'Authentic flamenco company founded in the heart of Madrid. Preserving traditional Andalusian flamenco while bringing it to international stages.', styles:['Flamenco','Spanish Dance','Sevillanas','Bulerias'], achievements:['Premio Nacional de Danza','Sadlers Wells London Residency','Cervantes Institute Tour'], video:null, booked:67, verified:true, contact:'tablao@flamencovivo.es' },
  { id:'d7', name:'Afrobeat Dance Collective', city:'Lagos', country:'Nigeria', type:'Afrobeats', members:22, founded:2017, rating:4.8, reviews:95, img:'🎵', tags:['Afrobeats','Afrohouse','Amapiano'], desc:'West Africa leading dance collective specialising in Afrobeats, Afrohouse and Amapiano movement. Available for workshops, performances and international collaborations.', styles:['Afrobeats','Afrohouse','Amapiano','Azonto'], achievements:['Afronation Festival Performers','Nike Africa Campaign','European Workshop Tour 2024'], video:'https://www.youtube.com/embed/dQw4w9WgXcQ', booked:128, verified:false, contact:'collective@afrobeatdance.ng' },
  { id:'d8', name:'Breakin Berlin', city:'Berlin', country:'Germany', type:'Breakdance', members:40, founded:2006, rating:4.7, reviews:119, img:'🎤', tags:['Breakdance','Freestyle','Battle'], desc:'Berlin underground b-boy culture collective. Organising weekly battles, workshops and international events. One of the oldest active breakdance communities in Germany.', styles:['Breakdance','Toprock','Footwork','Power Moves'], achievements:['Battle of the Year Organisers','Red Bull BC One Qualifier','Breakin Berlin Annual Event'], video:'https://www.youtube.com/embed/9bZkp7q19f0', booked:178, verified:true, contact:'info@breakinberlin.de' }
];

var danceFilters = { search:'', country:'', city:'', type:'', sort:'Best Rated' };

function renderDanceCards() {
  var grid = document.getElementById('danceGrid');
  var count = document.getElementById('danceCount');
  if (!grid) return;
  var filtered = DANCE_DB.filter(function(s) {
    if (danceFilters.search && !(s.name+s.city+s.tags.join(' ')).toLowerCase().includes(danceFilters.search.toLowerCase())) return false;
    if (danceFilters.country && s.country !== danceFilters.country) return false;
    if (danceFilters.city && s.city !== danceFilters.city) return false;
    if (danceFilters.type && s.type !== danceFilters.type) return false;
    return true;
  });
  if (danceFilters.sort==='Most Members') filtered.sort(function(a,b){return b.members-a.members;});
  else if (danceFilters.sort==='Newest') filtered.sort(function(a,b){return b.founded-a.founded;});
  else if (danceFilters.sort==='Most Booked') filtered.sort(function(a,b){return b.booked-a.booked;});
  else filtered.sort(function(a,b){return b.rating-a.rating;});
  if (count) count.textContent = filtered.length;
  grid.innerHTML = '';
  filtered.forEach(function(s) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;overflow:hidden;cursor:pointer;transition:border-color 0.2s;';
    var tags = s.tags.slice(0,3).map(function(t){
      return '<span style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.15);color:rgba(200,180,255,0.72);padding:2px 8px;border-radius:2px;font-size:0.68rem;">'+t+'</span>';
    }).join('');
    var badge = s.verified ? '<span style="background:rgba(0,230,118,0.08);border:1px solid rgba(0,230,118,0.2);color:#00E676;padding:2px 7px;border-radius:2px;font-size:0.6rem;font-weight:700;">OK</span>' : '';
    card.innerHTML = '<div style="background:rgba(233,30,140,0.06);padding:28px;text-align:center;font-size:2.5rem;">'+s.img+'</div>'
      + '<div style="padding:16px;">'
      + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px;"><div style="font-weight:700;font-size:0.92rem;">'+s.name+'</div>'+badge+'</div>'
      + '<div style="font-size:0.75rem;color:rgba(200,180,255,0.58);margin-bottom:10px;">'+s.city+', '+s.country+' | '+s.type+'</div>'
      + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">'+tags+'</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;">'
      + '<div style="font-size:0.78rem;color:rgba(200,180,255,0.58);">'+s.rating+' ('+s.reviews+') | '+s.members+' members</div>'
      + '</div></div>';
    card.addEventListener('mouseover', function(){ this.style.borderColor='rgba(233,30,140,0.3)'; });
    card.addEventListener('mouseout', function(){ this.style.borderColor='rgba(200,180,255,0.13)'; });
    (function(sid){ card.addEventListener('click', function(){ openDance(sid); }); })(s.id);
    grid.appendChild(card);
  });
}

// ── VIDEO COLLAB WAVE BARS ──
(function initCvWaves() {
  function buildWave(id, count) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var b = document.createElement('div');
      b.className = 'cv-wave-bar';
      var h = Math.floor(Math.random() * 20) + 6;
      b.style.cssText = '--h:' + h + 'px; animation-delay:' + (i * 0.07) + 's; animation-duration:' + (0.4 + Math.random() * 0.4) + 's;';
      el.appendChild(b);
    }
  }
  function init() {
    ['cvWave1','cvWave2','cvWave3','cvWave1b','cvWave2b','cvWave3b'].forEach(function(id) {
      buildWave(id, 18);
    });
    // re-randomize heights every 2s for liveness
    setInterval(function() {
      ['cvWave1','cvWave2','cvWave3','cvWave1b','cvWave2b','cvWave3b'].forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.querySelectorAll('.cv-wave-bar').forEach(function(b) {
          var h = Math.floor(Math.random() * 22) + 4;
          b.style.setProperty('--h', h + 'px');
        });
      });
    }, 2000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// ── ARTIST LIVE ROOM ──
var LR_ROOMS = [
  { id:'luna', artist:'Luna Rivera', av:'LR', avColor:'linear-gradient(135deg,#E91E8C,#7B2FFF)', bg:'linear-gradient(135deg,#300010,#660033)', genre:'Indie Pop', type:'talk', tags:['Indie Pop','Singer-Songwriter','New Tracks'], desc:'Luna talking about her creative process and sharing new Fortis finds. Guest: DJ Nexus tonight!', viewers:312, live:true, guest:'DJ Nexus', location:'Dubai', country:'UAE' },
  { id:'djnexus', artist:'DJ Nexus', av:'DN', avColor:'linear-gradient(135deg,#00E676,#009688)', bg:'linear-gradient(135deg,#001a30,#003366)', genre:'House', type:'music', tags:['House','Electronic','Live Set'], desc:'Live DJ set with commentary — playing tracks he discovered on Fortis this week.', viewers:445, live:true, guest:null, location:'London', country:'UK' },
  { id:'aidenk', artist:'Aiden K.', av:'AK', avColor:'linear-gradient(135deg,#FFD700,#FF8C00)', bg:'linear-gradient(135deg,#0d1a0d,#1a2e0a)', genre:'Ambient', type:'music', tags:['Ambient','Piano','Instrumental'], desc:'Sharing ambient tracks that inspire his composing sessions. Chill vibes only.', viewers:88, live:true, guest:null, location:'Berlin', country:'Germany' },
  { id:'mariasol', artist:'Maria Sol', av:'MS', avColor:'linear-gradient(135deg,#FF6B9D,#C44569)', bg:'linear-gradient(135deg,#1a0030,#3d0066)', genre:'R&B', type:'talk', tags:['R&B','Soul','Vocals'], desc:'Q&A session with fans + playing unreleased demos. Raise your hand to chat live!', viewers:201, live:true, guest:'Aiden K.', location:'Madrid', country:'Spain' },
  { id:'kofi', artist:'Kofi A.', av:'KA', avColor:'linear-gradient(135deg,#FFD700,#FF6B00)', bg:'linear-gradient(135deg,#1a1000,#332200)', genre:'Afrobeats', type:'guest', tags:['Afrobeats','Percussion','World'], desc:'Kofi and special guest talking about the African music scene and upcoming collabs on Fortis.', viewers:176, live:true, guest:'Luna Rivera', location:'Lagos', country:'Nigeria' },
  { id:'yelena', artist:'Yelena V.', av:'YV', avColor:'linear-gradient(135deg,#7B2FFF,#4B0082)', bg:'linear-gradient(135deg,#0a0020,#200040)', genre:'Jazz', type:'talk', tags:['Jazz','Neo-Soul','Live'], desc:'Jazz improvisation meets storytelling. Yelena shares stories behind each track she plays.', viewers:134, live:false, guest:null, location:'Paris', country:'France' },
  { id:'marcus', artist:'Marcus D.', av:'MD', avColor:'linear-gradient(135deg,#00BCD4,#0097A7)', bg:'linear-gradient(135deg,#001a1a,#003333)', genre:'Hip-Hop', type:'music', tags:['Hip-Hop','Trap','Producer'], desc:'Beat showcase — Marcus plays beats he made this week and takes requests from chat.', viewers:289, live:true, guest:null, location:'Atlanta', country:'USA' },
  { id:'siya', artist:'Siya K.', av:'SK', avColor:'linear-gradient(135deg,#E91E8C,#FF5722)', bg:'linear-gradient(135deg,#1a0010,#330020)', genre:'Indie Pop', type:'guest', tags:['Indie','Folk','Acoustic'], desc:'Acoustic session with a surprise guest drop-in. Very intimate, very real.', viewers:97, live:false, guest:'Marcus D.', location:'Cape Town', country:'South Africa' },
  { id:'devika', artist:'Devika R.', av:'DR', avColor:'linear-gradient(135deg,#9C27B0,#673AB7)', bg:'linear-gradient(135deg,#0d000d,#1a0033)', genre:'Electronic', type:'music', tags:['Electronic','Fusion','Experimental'], desc:'Devika mixing Eastern classical elements with electronic production — live demo.', viewers:223, live:true, guest:null, location:'Mumbai', country:'India' },
];

var lrActiveType = 'all';
var lrSelectedDonate = 1;
var lrActiveRoom = null;

var LR_CHATS = [
  { user:'Ana S.', msg:'This is so good!!', tip:null },
  { user:'Jonas P.', msg:'Luna your voice is 🔥', tip:null },
  { user:'Fatima O.', msg:'Sent a tip! Love this session', tip:'€3' },
  { user:'Marko K.', msg:'DJ Nexus on the guest slot yesss', tip:null },
  { user:'Priya M.', msg:'How did you two meet?', tip:null },
  { user:'Ali B.', msg:'Playing this track rn', tip:'€1' },
];

function lrFilter(val) {
  var search = (val || document.getElementById('lrSearch').value || '').toLowerCase();
  var genre = (document.getElementById('lrGenreFilter').value || '').toLowerCase();
  var country = (document.getElementById('lrCountryFilter').value || '').toLowerCase();
  var sort = (document.getElementById('lrSortFilter').value || 'viewers');
  renderLrGrid(search, genre, country, sort, lrActiveType);
}

function lrSetType(type, el) {
  lrActiveType = type;
  document.querySelectorAll('.lr-filter-tag').forEach(function(b){ b.classList.remove('active'); });
  if (el) el.classList.add('active');
  lrFilter();
}

function renderLrGrid(search, genre, country, sort, type) {
  var grid = document.getElementById('lrGrid');
  if (!grid) return;
  var rooms = LR_ROOMS.filter(function(r) {
    if (search && !(r.artist + r.genre + r.tags.join(' ') + r.location + r.country).toLowerCase().includes(search)) return false;
    if (genre && r.genre.toLowerCase() !== genre) return false;
    if (country && r.country.toLowerCase() !== country) return false;
    if (type === 'live' && !r.live) return false;
    if (type === 'talk' && r.type !== 'talk') return false;
    if (type === 'music' && r.type !== 'music') return false;
    if (type === 'guest' && !r.guest) return false;
    return true;
  });
  if (sort === 'viewers') rooms.sort(function(a,b){ return b.viewers - a.viewers; });
  else if (sort === 'new') rooms.sort(function(a,b){ return (b.live?1:0)-(a.live?1:0); });

  grid.innerHTML = '';
  rooms.forEach(function(r) {
    var tags = r.tags.map(function(t){ return '<span class="lr-card-tag">'+t+'</span>'; }).join('');
    var guestBadge = r.guest ? '<span style="font-size:0.62rem;background:rgba(123,47,255,0.1);border:1px solid rgba(123,47,255,0.25);color:#9B6FFF;padding:2px 7px;border-radius:4px;margin-left:6px;">+ Guest</span>' : '';
    var liveBadge = r.live ? '<div class="lr-card-live-badge"><span class="lr-card-live-dot"></span>LIVE</div>' : '<div style="position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.5);color:rgba(200,180,255,0.62);font-size:0.6rem;font-weight:700;padding:3px 8px;border-radius:4px;letter-spacing:0.1em;">OFFLINE</div>';
    var card = document.createElement('div');
    card.className = 'lr-card';
    card.innerHTML =
      '<div class="lr-card-banner" style="background:'+r.bg+';">'+
        '<div style="width:64px;height:64px;border-radius:50%;background:'+r.avColor+';display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.5rem;color:#fff;box-shadow:0 0 24px rgba(0,0,0,0.4);">'+r.av+'</div>'+
        liveBadge+
        '<div class="lr-card-viewers"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> '+r.viewers+'</div>'+
        '<div class="lr-card-type">'+r.type.charAt(0).toUpperCase()+r.type.slice(1)+'</div>'+
      '</div>'+
      '<div class="lr-card-body">'+
        '<div class="lr-card-artist">'+
          '<div class="lr-card-av" style="background:'+r.avColor+';">'+r.av+'</div>'+
          '<div><div class="lr-card-name">'+r.artist+guestBadge+'</div><div class="lr-card-sub">'+r.genre+' · '+r.location+', '+r.country+'</div></div>'+
        '</div>'+
        '<div class="lr-card-desc">'+r.desc+'</div>'+
        '<div class="lr-card-tags">'+tags+'</div>'+
        '<div class="lr-card-footer">'+
          '<div class="lr-card-stats"><span><strong>'+r.viewers+'</strong> watching</span></div>'+
          '<button class="lr-enter-btn">'+(r.live?'<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#fff;margin-right:5px;animation:cvBlink 1s infinite;vertical-align:middle;"></span>Enter':'Enter')+'</button>'+
        '</div>'+
      '</div>';
    card.addEventListener('click', function(){ enterLiveRoom(r.id); });
    grid.appendChild(card);
  });
  if (!rooms.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--muted);font-size:0.88rem;">No rooms match your filters.</div>';
  }
}

function enterLiveRoom(id) {
  var room = LR_ROOMS.find(function(r){ return r.id === id; });
  if (!room) { showPage('liveroom'); return; }
  lrActiveRoom = room;

  // Switch to room view
  document.getElementById('lrBrowse').classList.add('hidden');
  document.getElementById('lrRoom').classList.add('open');

  // Populate host
  document.getElementById('lrHostAv').textContent = room.av;
  document.getElementById('lrHostAv').style.background = room.avColor;
  document.getElementById('lrHostFeed').style.background = room.bg;
  document.getElementById('lrHostName').textContent = room.artist;
  document.getElementById('lrHostGenre').textContent = room.genre + ' · Session Host';
  document.getElementById('lrViewers').textContent = room.viewers;

  // Guest slot
  var guestSlot = document.getElementById('lrGuestSlot');
  var guestInfoName = document.getElementById('lrGuestInfoName');
  var guestAv = document.getElementById('lrGuestAv');
  var guestName = document.getElementById('lrGuestName');
  if (room.guest) {
    guestSlot.style.display = 'flex';
    var gRoom = LR_ROOMS.find(function(r){ return r.artist === room.guest; });
    if (gRoom) {
      guestAv.textContent = gRoom.av;
      guestAv.style.background = gRoom.avColor;
      guestName.textContent = gRoom.artist;
      if (guestInfoName) guestInfoName.textContent = gRoom.artist;
    } else {
      guestName.textContent = room.guest;
      if (guestInfoName) guestInfoName.textContent = room.guest;
    }
  } else {
    guestSlot.style.display = 'none';
  }

  // Now playing track
  document.getElementById('lrNpArtist').textContent = room.artist + ' · Fortis Music';

  // Init chat
  lrInitChat();

  // Start fan timer countdown
  lrStartFanTimer(262);

  if (!document.getElementById('page-liveroom').classList.contains('active')) {
    showPage('liveroom');
  }
}

function lrBack() {
  document.getElementById('lrBrowse').classList.remove('hidden');
  document.getElementById('lrRoom').classList.remove('open');
}

function lrInitChat() {
  var msgs = document.getElementById('lrChatMsgs');
  if (!msgs) return;
  msgs.innerHTML = '';
  LR_CHATS.forEach(function(m) {
    var div = document.createElement('div');
    div.className = 'lr-chat-msg';
    div.innerHTML = '<span class="lr-chat-user">'+m.user+'</span>'+m.msg+(m.tip?'<span class="lr-chat-tip">'+m.tip+'</span>':'');
    msgs.appendChild(div);
  });
  msgs.scrollTop = msgs.scrollHeight;

  // Simulate live chat messages
  var autoMsgs = [
    {user:'Keanu R.', msg:'just joined 🔥', tip:null},
    {user:'Sofia M.', msg:'this track is incredible', tip:null},
    {user:'Bashir A.', msg:'raise my hand!', tip:null},
    {user:'Nina V.', msg:'love this collab', tip:'€5'},
  ];
  var i = 0;
  clearInterval(window._lrChatInterval);
  window._lrChatInterval = setInterval(function() {
    if (!document.getElementById('lrRoom').classList.contains('open')) { clearInterval(window._lrChatInterval); return; }
    var m = autoMsgs[i % autoMsgs.length]; i++;
    var div = document.createElement('div');
    div.className = 'lr-chat-msg';
    div.innerHTML = '<span class="lr-chat-user">'+m.user+'</span>'+m.msg+(m.tip?'<span class="lr-chat-tip">'+m.tip+'</span>':'');
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }, 4000);
}

function lrSendChat() {
  var input = document.getElementById('lrChatIn');
  var val = input.value.trim();
  if (!val) return;
  var msgs = document.getElementById('lrChatMsgs');
  var div = document.createElement('div');
  div.className = 'lr-chat-msg';
  div.innerHTML = '<span class="lr-chat-user" style="color:#FFD700;">You</span>'+val;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  input.value = '';
}

function lrRaiseHand() {
  var count = document.getElementById('lrQueueCount');
  var list = document.getElementById('lrQueueList');
  var num = list.querySelectorAll('.lr-queue-item').length + 1;
  var item = document.createElement('div');
  item.className = 'lr-queue-item';
  item.innerHTML = '<div class="lr-queue-av" style="background:var(--grad);color:#fff;">'+num+'</div><div class="lr-queue-name" style="color:#FFD700;">You</div><div class="lr-queue-wait">~'+(num*5)+' min</div>';
  list.appendChild(item);
  if (count) count.textContent = num + ' waiting';
  showToast('✋ You\'re in the queue! Wait for ' + (lrActiveRoom ? lrActiveRoom.artist : 'the artist') + ' to call you.');
}

function lrSelectDonate(el, val) {
  document.querySelectorAll('.lr-donate-amt').forEach(function(b){ b.classList.remove('active'); });
  el.classList.add('active');
  lrSelectedDonate = val;
}

function lrDonate() {
  var amount = lrSelectedDonate === 'custom' ? 2 : lrSelectedDonate;
  var artist = lrActiveRoom ? lrActiveRoom.artist : 'the artist';
  showToast('💚 €' + amount + ' sent to ' + artist + '! Thank you!');
  var msgs = document.getElementById('lrChatMsgs');
  if (msgs) {
    var div = document.createElement('div');
    div.className = 'lr-chat-msg';
    div.innerHTML = '<span class="lr-chat-user" style="color:#00E676;">You</span>sent a donation <span class="lr-chat-tip">€'+amount+'</span>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }
}

var _lrFanTimerInterval = null;
function lrStartFanTimer(seconds) {
  clearInterval(_lrFanTimerInterval);
  var s = seconds;
  function update() {
    var el = document.getElementById('lrFanTimer');
    if (!el) { clearInterval(_lrFanTimerInterval); return; }
    var m = Math.floor(s/60), sec = s%60;
    el.textContent = m + ':' + (sec<10?'0':'')+sec;
    if (s <= 0) {
      clearInterval(_lrFanTimerInterval);
      el.textContent = '0:00';
      showToast('Fan cam slot ended. Next fan coming up!');
    }
    s--;
  }
  update();
  _lrFanTimerInterval = setInterval(update, 1000);
}

// Init on page show
(function() {
  var orig = window.showPage;
  if (orig) {
    window.showPage = function(id) {
      orig(id);
      if (id === 'liveroom') {
        renderLrGrid('','','','viewers','all');
        if (!lrActiveRoom) {
          document.getElementById('lrBrowse').classList.remove('hidden');
          document.getElementById('lrRoom').classList.remove('open');
        }
      }
      if (id === 'now') {
        lrActiveRoom = null;
      }
    };
  }
  document.addEventListener('DOMContentLoaded', function(){
    renderLrGrid('','','','viewers','all');
  });
})();

function jbRenderQ(genre){jbRenderVoting(genre);}
function jbVote(i){jbCastVote(jbActiveGenre||'electronic',i);}
function jbRenderChat(genre){var msgs=document.getElementById('jbMsgs');if(!msgs)return;msgs.innerHTML='';(JB_DATA[genre]&&JB_DATA[genre].chat||[]).forEach(function(m){var d=document.createElement('div');d.className='jb-chat-msg';d.innerHTML='<span class="jbn">'+m.n+'</span>'+m.m;msgs.appendChild(d);});msgs.scrollTop=msgs.scrollHeight;}
function jbSend(){var inp=document.getElementById('jbInput');if(!inp||!inp.value.trim())return;var msgs=document.getElementById('jbMsgs');var d=document.createElement('div');d.className='jb-chat-msg';d.innerHTML='<span class="jbn" style="color:var(--pink);">You</span>'+inp.value.trim();msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;inp.value='';}
function jbStartProg(){if(jbProgInt)clearInterval(jbProgInt);jbProgVal=38;jbProgInt=setInterval(function(){jbProgVal+=0.025;if(jbProgVal>=100){jbProgVal=0;}var fill=document.getElementById('jbFill');if(fill)fill.style.width=Math.min(jbProgVal,100)+'%';var data=JB_DATA[jbActiveGenre];if(data&&data.tracks[0]){var parts=data.tracks[0].dur.split(':');var totalSecs=parseInt(parts[0])*60+parseInt(parts[1]);var secs=Math.floor((jbProgVal/100)*totalSecs);var el=document.getElementById('jbNow');if(el)el.textContent=Math.floor(secs/60)+':'+String(secs%60).padStart(2,'0');}},1000);}
function jbVoteTod(){if(jbTodVoted){showToast('Already voted for Track of the Day today!');return;}jbTodVoted=true;var data=JB_DATA[jbActiveGenre];if(data){data.todVotes++;var el=document.getElementById('jbTodVotes');if(el)el.textContent=data.todVotes.toLocaleString();}showToast('Vote counted! Winner announced at midnight.');}
function jbEnterRoom(genre){
  var data=JB_DATA[genre];
  if(!data){showToast('Coming soon!');return;}
  jbActiveGenre=genre;
  document.getElementById('jbBrowse').classList.add('hidden');
  document.getElementById('jbRoom').classList.add('open');
  var labels={electronic:'Electronic / Dance',hiphop:'Hip-Hop / R&B',pop:'Pop',rock:'Rock / Alternative',afro:'Afrobeats / World'};
  var listeners={electronic:'1,240',hiphop:'890',pop:'654',rock:'412',afro:'378'};
  var el=document.getElementById('jbRoomTitle');
  if(el)el.textContent=labels[genre]||genre;
  var rl=document.getElementById('jbRoomListeners');
  if(rl)rl.textContent=(listeners[genre]||'0')+' listening';

  // Use JB_VOTE_TRACKS for now playing (richer data)
  var voteTracks=JB_VOTE_TRACKS[genre]||[];
  var t=voteTracks.length?voteTracks[0]:data.tracks[0];
  var tn=document.getElementById('jbTrackName');if(tn)tn.textContent=t.t;
  var ta=document.getElementById('jbTrackArtist');if(ta)ta.textContent=t.a+' · '+t.c;
  var tg=document.getElementById('jbTagGenre');if(tg)tg.textContent=t.g;
  var tc=document.getElementById('jbTagCountry');if(tc)tc.textContent=t.c;
  var tl=document.getElementById('jbTagListeners');if(tl)tl.textContent=(listeners[genre]||'0')+' listening';
  var tt=document.getElementById('jbTotal');if(tt)tt.textContent=t.dur||'3:42';

  // Init chat with seed messages then simulate live
  jbRenderChat(genre);
  jbStartLiveChat(genre);

  jbRenderVoting(genre);
  jbStartProg();
  jbStartVoteTimer(genre);
  jbStartAutoVotes(genre);
  var banner=document.getElementById('jbWinnerBanner');
  if(banner)banner.classList.remove('show');
}

function jbStartLiveChat(genre){
  clearInterval(window._jbChatInterval);
  var chatMessages={
    electronic:[
      {n:'Marco B.',m:'this bassline is insane'},
      {n:'Sofia L.',m:'voted already, fingers crossed'},
      {n:'Yuki T.',m:'been waiting for this room to open'},
      {n:'Carlos P.',m:'anyone else previewing all 50?'},
      {n:'Priya S.',m:'2 hours in, no regrets'},
      {n:'Ali B.',m:'that last track was something else'},
      {n:'Nina V.',m:'love that there\'s no ranking visible'},
    ],
    hiphop:[
      {n:'Aiden K.',m:'Marcus Wave every time'},
      {n:'Zara M.',m:'Golden Hour is underrated'},
      {n:'Bashir A.',m:'just joined, previewing now'},
      {n:'Sofia L.',m:'the R&B section hits different tonight'},
    ],
    pop:[
      {n:'Sofia L.',m:'Neon Dreams should win every round'},
      {n:'Marco B.',m:'Celeste deserves so much more'},
      {n:'Keanu R.',m:'just added to the prize pool!'},
    ],
    rock:[
      {n:'Yuki T.',m:'The Void is criminally underrated'},
      {n:'Carlos P.',m:'Static Pulse goes hard'},
      {n:'Jonas P.',m:'finally a room for us'},
    ],
    afro:[
      {n:'Priya S.',m:'Lagos Nights hits every time'},
      {n:'Aiden K.',m:'DJ Pharaoh is a legend'},
      {n:'Kofi B.',m:'Savanna is slept on'},
    ]
  };
  var msgs=chatMessages[genre]||chatMessages.electronic;
  var chatEl=document.getElementById('jbMsgs');
  if(!chatEl)return;
  // Seed 4 initial messages
  chatEl.innerHTML='';
  msgs.slice(0,4).forEach(function(m){
    var d=document.createElement('div');
    d.className='jb-chat-msg';
    d.innerHTML='<span class="jbn">'+m.n+'</span>'+m.m;
    chatEl.appendChild(d);
  });
  chatEl.scrollTop=chatEl.scrollHeight;
  // Simulate new messages every 5-8s
  var i=4;
  window._jbChatInterval=setInterval(function(){
    if(!document.getElementById('jbRoom').classList.contains('open')){clearInterval(window._jbChatInterval);return;}
    var m=msgs[i%msgs.length]; i++;
    var d=document.createElement('div');
    d.className='jb-chat-msg';
    d.innerHTML='<span class="jbn">'+m.n+'</span>'+m.m;
    chatEl.appendChild(d);
    chatEl.scrollTop=chatEl.scrollHeight;
  },5000+Math.random()*3000);
}
function jbBackToBrowse(){document.getElementById('jbBrowse').classList.remove('hidden');document.getElementById('jbRoom').classList.remove('open');clearInterval(jbVoteInterval);clearInterval(jbAutoVoteInterval);if(jbProgInt){clearInterval(jbProgInt);jbProgInt=null;}}
function jbRoom(genre,el){jbEnterRoom(genre);}
var jbSelectedDonate=0.50;
var jbSelectedBoost=0.50;
function jbBoostSelect(el,val){
  document.querySelectorAll('.jb-prize-boost-btns .jb-boost-btn').forEach(function(b){b.classList.remove('active');});
  el.classList.add('active');
  jbSelectedBoost=val;
  var inp=document.getElementById('jbBoostCustom');
  if(inp){inp.style.display='none';}
}
function jbBoostOther(el){
  document.querySelectorAll('.jb-prize-boost-btns .jb-boost-btn').forEach(function(b){b.classList.remove('active');});
  el.classList.add('active');
  jbSelectedBoost='custom';
  var inp=document.getElementById('jbBoostCustom');
  if(inp){inp.style.display='block';inp.focus();}
}
function jbBoostContribute(){
  var amount=jbSelectedBoost;
  if(amount==='custom'){
    var inp=document.getElementById('jbBoostCustom');
    amount=inp?parseFloat(inp.value)||0:0;
    if(amount<=0){showToast('Please enter a valid amount.');return;}
  }
  var genre=jbActiveGenre||'electronic';
  if(!jbPrizeAmount[genre])jbPrizeAmount[genre]=10;
  jbPrizeAmount[genre]+=amount;
  var el=document.getElementById('jbPrizeDisplay');
  if(el)el.textContent='€'+jbPrizeAmount[genre].toFixed(2);
  showToast('€'+amount.toFixed(2)+' added to prize pool! Goes to winning artist.');
  var msgs=document.getElementById('jbMsgs');
  if(msgs){var d=document.createElement('div');d.className='jb-chat-msg';d.innerHTML='<span class="jbn" style="color:#00E676;">You</span> added €'+amount.toFixed(2)+' to the prize pool';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
  var inp2=document.getElementById('jbBoostCustom');
  if(inp2){inp2.style.display='none';inp2.value='';}
}
function jbSelectDonate(el,val){document.querySelectorAll('.jb-donate-amt').forEach(function(b){b.classList.remove('active');});el.classList.add('active');jbSelectedDonate=val;}
function jbDonate(){var amount=jbSelectedDonate==='custom'?1:jbSelectedDonate;var genre=jbActiveGenre||'electronic';if(!jbPrizeAmount[genre])jbPrizeAmount[genre]=10;jbPrizeAmount[genre]+=amount;var el=document.getElementById('jbPrizeDisplay');if(el)el.textContent='€'+jbPrizeAmount[genre].toFixed(2);showToast('€'+amount.toFixed(2)+' added to prize pool! Goes to winning artist.');var msgs=document.getElementById('jbMsgs');if(msgs){var d=document.createElement('div');d.className='jb-chat-msg';d.innerHTML='<span class="jbn" style="color:#00E676;">You</span> added €'+amount.toFixed(2)+' to the prize pool';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}}
function filterDance() {
  danceFilters.search = (document.getElementById('danceSearch')||{value:''}).value;
  danceFilters.country = (document.getElementById('danceCountry')||{value:''}).value;
  danceFilters.city = (document.getElementById('danceCity')||{value:''}).value;
  danceFilters.type = (document.getElementById('danceType')||{value:''}).value;
  danceFilters.sort = (document.getElementById('danceSort')||{value:'Best Rated'}).value;
  renderDanceCards();
}

function clearDanceFilters() {
  danceFilters = { search:'', country:'', city:'', type:'', sort:'Best Rated' };
  ['danceSearch','danceCountry','danceCity','danceType','danceSort'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.value = '';
  });
  renderDanceCards();
}

function quickDanceFilter(type) {
  danceFilters.type = type;
  var sel = document.getElementById('danceType'); if (sel) sel.value = type;
  renderDanceCards();
}

function openDance(id) {
  var s = DANCE_DB.find(function(x){ return x.id===id; });
  if (!s) return;
  var detail = document.getElementById('danceDetail');
  var grid = document.getElementById('danceGrid');
  if (!detail || !grid) return;
  grid.style.display = 'none';
  detail.style.display = 'block';
  var styleTags = s.styles.map(function(g){ return '<span style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.15);padding:4px 12px;border-radius:2px;font-size:0.78rem;color:rgba(200,180,255,0.72);">'+g+'</span>'; }).join('');
  var achItems = s.achievements.map(function(a){ return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(200,180,255,0.07);"><span style="color:#C8A97E;font-size:0.8rem;">&#9733;</span><span style="font-size:0.82rem;color:rgba(255,255,255,0.6);">'+a+'</span></div>'; }).join('');
  var tagPills = s.tags.map(function(t){ return '<span style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.15);color:rgba(200,180,255,0.72);padding:3px 10px;border-radius:2px;font-size:0.7rem;">'+t+'</span>'; }).join('');
  var videoHtml = s.video ? '<div style="position:relative;padding-bottom:56.25%;height:0;margin-bottom:16px;border-radius:4px;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="'+s.video+'?rel=0&modestbranding=1" allowfullscreen loading="lazy"></iframe></div>' : '';
  detail.innerHTML =
    '<button id="danceBackBtn" style="display:flex;align-items:center;gap:6px;margin-bottom:24px;padding:8px 16px;background:transparent;border:1px solid rgba(123,47,255,0.28);color:rgba(200,180,255,0.72);border-radius:16px;cursor:pointer;font-size:0.82rem;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">Back to Dance</button>'
    + '<div class="detail-grid-2col" style="display:grid;grid-template-columns:1fr 300px;gap:24px;">'
    + '<div>'
    + '<div style="background:rgba(233,30,140,0.06);border:1px solid rgba(233,30,140,0.1);border-radius:16px;padding:40px;text-align:center;font-size:4rem;margin-bottom:16px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'+s.img+'</div>'
    + videoHtml
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;margin-bottom:16px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:12px;">About</div><p style="font-size:0.88rem;color:rgba(255,255,255,0.6);line-height:1.75;">'+s.desc+'</p></div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;margin-bottom:16px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:14px;">Dance Styles</div><div style="display:flex;flex-wrap:wrap;gap:8px;">'+styleTags+'</div></div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:14px;">Achievements</div>'+achItems+'</div>'
    + '</div>'
    + '<div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:22px;margin-bottom:14px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">'
    + '<h2 style="font-size:1.3rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:4px;">'+s.name+'</h2>'
    + '<div style="font-size:0.78rem;color:rgba(200,180,255,0.58);margin-bottom:16px;">'+s.city+', '+s.country+' | '+s.type+'</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(200,180,255,0.11);border-radius:4px;overflow:hidden;margin-bottom:16px;">'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#E91E8C;">'+s.members+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Members</div></div>'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#fff;">'+s.rating+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Rating</div></div>'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#fff;">'+s.founded+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Founded</div></div>'
    + '<div style="background:#0d0818;padding:14px;text-align:center;"><div style="font-size:1.3rem;font-weight:800;color:#00E676;">'+s.booked+'</div><div style="font-size:0.62rem;color:rgba(200,180,255,0.52);margin-top:3px;text-transform:uppercase;letter-spacing:0.08em;">Bookings</div></div>'
    + '</div>'
    + '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">'+tagPills+'</div>'
    + '<button id="danceBookBtn" style="width:100%;padding:12px;background:linear-gradient(135deg,#E91E8C,#7B2FFF);border:none;color:#fff;border-radius:16px;font-size:0.88rem;font-weight:700;cursor:pointer;margin-bottom:8px;">Book for Event</button>'
    + '<button id="danceContactBtn" style="width:100%;padding:10px;background:transparent;border:1px solid rgba(123,47,255,0.28);color:rgba(200,180,255,0.62);border-radius:16px;font-size:0.82rem;cursor:pointer;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset">Send Message</button>'
    + '</div>'
    + '<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(123,47,255,0.28);border-radius:16px;padding:18px;margin-top:14px;;box-shadow:0 0 0 1px rgba(123,47,255,0.18),0 4px 24px rgba(80,20,180,0.22),0 1px 0 rgba(200,160,255,0.12) inset"><div style="font-size:0.66rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(200,180,255,0.52);margin-bottom:10px;">Contact</div><div style="font-size:0.82rem;color:rgba(255,255,255,0.4);">'+s.contact+'</div></div>'
    + '</div></div>';
  document.getElementById('danceBackBtn').onclick = closeDance;
  document.getElementById('danceBookBtn').onclick = function(){ showToast('Booking request sent to ' + s.name + '!'); };
  document.getElementById('danceContactBtn').onclick = function(){ showToast('Message sent to ' + s.name + '!'); };
}

function closeDance() {
  document.getElementById('danceDetail').style.display = 'none';
  document.getElementById('danceGrid').style.display = 'grid';
}



/* ================================================================
   SECTION BREAK
   ================================================================ */


/* ══ PROTECT/DETECT TAB SWITCHER ══ */
function switchProtectTab(tab) {
  var isProtect = tab === 'protect';
  document.getElementById('tab-panel-protect').style.display = isProtect ? '' : 'none';
  document.getElementById('tab-panel-detect').style.display = isProtect ? 'none' : '';

  var hP = document.getElementById('tab-heading-protect');
  var hD = document.getElementById('tab-heading-detect');
  if (hP && hD) {
    hP.style.color = isProtect ? '#C8A97E' : 'rgba(200,180,255,0.25)';
    hD.style.color = isProtect ? 'rgba(200,180,255,0.25)' : '#E91E8C';
  }
}

/* ══ MOBILE NAV LOGIC v3 ══ */

var _mobActivePage = 'home';

// Which bottom bar button maps to which page
var _mobNavMap = {
  'home':     'mob-btn-home',
  'now':      'mob-btn-now',
  'upload':   'mob-btn-upload',
  'discover': 'mob-btn-discover'
  // all others → highlight "All" button (mob-btn-more)
};

/* Core navigation — bypasses all showPage patches by
   directly manipulating the DOM the same way showPage does,
   then calling whatever window.showPage is at call time    */
function _mobGoTo(pageId) {
  // 1. Close all sub-panels first
  if (typeof closeAllSubs === 'function') closeAllSubs();

  // 2. Try via window.showPage (handles liveroom grid init etc.)
  try { window.showPage(pageId); } catch(e) {
    // Fallback: manual page switch
    document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
    var target = document.getElementById('page-' + pageId);
    if (target) target.classList.add('active');
  }

  // 3. Update active state tracking
  _mobActivePage = pageId;
  _updateMobNavActive(pageId);
  _updateDrawerActive(pageId);

  // 4. Scroll to top
  window.scrollTo(0, 0);
}

function mobNav(pageId) {
  _mobGoTo(pageId);
}

function mobNavDrawer(pageId) {
  mobDrawerClose();
  // Small delay so drawer closes before page animates in
  setTimeout(function(){ _mobGoTo(pageId); }, 60);
}

function _updateMobNavActive(pageId) {
  document.querySelectorAll('.mob-nav-item').forEach(function(el){
    el.classList.remove('active');
  });
  var btnId = _mobNavMap[pageId];
  var btn = document.getElementById(btnId || 'mob-btn-more');
  if (btn) btn.classList.add('active');
}

function _updateDrawerActive(pageId) {
  document.querySelectorAll('.mob-drawer-btn').forEach(function(el){
    el.classList.remove('active-page');
  });
  var db = document.getElementById('mdb-' + pageId);
  if (db) db.classList.add('active-page');
}

function mobDrawerOpen() {
  document.getElementById('mob-drawer-overlay').classList.add('open');
  document.getElementById('mob-drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
  _updateDrawerActive(_mobActivePage);
}

function mobDrawerClose() {
  document.getElementById('mob-drawer-overlay').classList.remove('open');
  document.getElementById('mob-drawer').classList.remove('open');
  document.body.style.overflow = '';
}

// Swipe-down on drawer to close
(function(){
  var startY = 0, drawer = document.getElementById('mob-drawer');
  if (!drawer) return;
  drawer.addEventListener('touchstart', function(e){ startY = e.touches[0].clientY; }, {passive:true});
  drawer.addEventListener('touchend',   function(e){ if (e.changedTouches[0].clientY - startY > 55) mobDrawerClose(); }, {passive:true});
})();

// Keep mobile nav in sync when other parts of the app call showPage()
(function(){
  var _prev = window.showPage;
  if (typeof _prev !== 'function') return;
  window.showPage = function(id) {
    _prev(id);
    _mobActivePage = id;
    _updateMobNavActive(id);
    _updateDrawerActive(id);
  };
})();
