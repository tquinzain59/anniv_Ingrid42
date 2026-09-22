/* ==========================================================================
   INGRID 42.0 — APPLICATION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientBackground();
  initVideoManager();
  initSoundModule();
  initCountdown();
  initRSVP();
});

/* --------------------------------------------------------------------------
   1. AMBIENT BACKGROUND & CANVAS ENGINE
   -------------------------------------------------------------------------- */
function initAmbientBackground() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Floating ambient titanium orbs
  const orbs = [
    { x: 0.2, y: 0.3, r: 280, color: 'rgba(212, 175, 55, 0.12)', vx: 0.0003, vy: 0.0002 },
    { x: 0.8, y: 0.6, r: 350, color: 'rgba(41, 151, 255, 0.10)', vx: -0.0002, vy: 0.0003 },
    { x: 0.5, y: 0.8, r: 320, color: 'rgba(191, 90, 242, 0.08)', vx: 0.0002, vy: -0.0002 },
    { x: 0.3, y: 0.7, r: 240, color: 'rgba(255, 94, 58, 0.09)', vx: -0.0003, vy: -0.0001 }
  ];

  let time = 0;
  function render() {
    time += 0.008;
    ctx.fillStyle = '#050507';
    ctx.fillRect(0, 0, width, height);

    orbs.forEach((orb, i) => {
      const currentX = (orb.x + Math.sin(time + i * 1.5) * 0.15) * width;
      const currentY = (orb.y + Math.cos(time + i * 1.2) * 0.15) * height;
      
      const grad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, orb.r);
      grad.addColorStop(0, orb.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(currentX, currentY, orb.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(render);
  }
  render();
}

/* --------------------------------------------------------------------------
   2. VIDEO CONTROLLER & PLAYLIST SUPPORT
   -------------------------------------------------------------------------- */
function initVideoManager() {
  const video = document.getElementById('bg-video');
  const fileInput = document.getElementById('video-file-input');
  const uploadBtn = document.getElementById('btn-upload-video');
  const playToggleBtn = document.getElementById('btn-toggle-video');
  const clipButtons = document.querySelectorAll('.clip-btn');

  if (!video) return;

  const playlist = [
    'assets/videos/clip2.mp4',
    'assets/videos/clip3.mp4',
    'assets/videos/background.mp4'
  ];
  let currentClipIndex = 0;
  let autoLoopPlaylist = true;

  // Ensure muted and playsinline for mobile and desktop autoplay
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');

  function attemptPlay() {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        video.style.opacity = '1';
        if (playToggleBtn) playToggleBtn.innerHTML = `<span>⏸ Pause</span>`;
      }).catch(err => {
        console.log('Autoplay restriction, unlocking on gesture:', err);
      });
    }
  }

  // Initial load
  video.src = playlist[0];
  video.load();
  attemptPlay();

  // Unlock autoplay on first interaction if blocked by browser policy
  const unlockAutoplay = () => {
    if (video.paused) {
      attemptPlay();
    }
    window.removeEventListener('click', unlockAutoplay);
    window.removeEventListener('scroll', unlockAutoplay);
    window.removeEventListener('touchstart', unlockAutoplay);
  };
  window.addEventListener('click', unlockAutoplay, { once: true });
  window.addEventListener('scroll', unlockAutoplay, { once: true });
  window.addEventListener('touchstart', unlockAutoplay, { once: true });

  video.addEventListener('playing', () => {
    video.style.opacity = '1';
  });

  // When a clip ends, automatically cycle to the next clip
  video.addEventListener('ended', () => {
    if (autoLoopPlaylist && playlist.length > 1) {
      currentClipIndex = (currentClipIndex + 1) % playlist.length;
      switchClip(currentClipIndex);
    } else {
      video.play();
    }
  });

  // Clip switcher buttons
  clipButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.clip, 10);
      if (!isNaN(idx) && idx >= 0 && idx < playlist.length) {
        currentClipIndex = idx;
        switchClip(currentClipIndex);
      }
    });
  });

  function switchClip(idx) {
    clipButtons.forEach((b, i) => {
      if (i === idx) b.classList.add('active');
      else b.classList.remove('active');
    });

    video.style.opacity = '0.3';
    setTimeout(() => {
      video.src = playlist[idx];
      video.load();
      video.muted = true;
      video.play().then(() => {
        video.style.opacity = '1';
      }).catch(() => {});
    }, 200);
  }

  // Toggle Play / Pause
  if (playToggleBtn) {
    playToggleBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playToggleBtn.innerHTML = `<span>⏸ Pause</span>`;
      } else {
        video.pause();
        playToggleBtn.innerHTML = `<span>▶ Lecture</span>`;
      }
    });
  }

  // File Upload trigger
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        loadVideoFile(file);
      }
    });
  }

  // Drag & Drop on page
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        loadVideoFile(file);
      }
    }
  });

  function loadVideoFile(file) {
    const url = URL.createObjectURL(file);
    playlist.push(url);
    currentClipIndex = playlist.length - 1;
    video.src = url;
    video.load();
    video.play().then(() => {
      video.style.opacity = '0.85';
      if (playToggleBtn) playToggleBtn.innerHTML = `<span>⏸ Pause vidéo</span>`;
    }).catch(err => console.log('Autoplay handled:', err));
  }
}

/* --------------------------------------------------------------------------
   3. SOUND MODULE SYNTHESIZER (ROTS EN RAFALE X2)
   -------------------------------------------------------------------------- */
function initSoundModule() {
  const testBtn = document.getElementById('btn-test-sound');
  const soundBars = document.querySelectorAll('.sound-bar');
  if (!testBtn) return;

  let audioCtx = null;

  testBtn.addEventListener('click', () => {
    // Initialize Web Audio Context on user gesture
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Trigger visualizer
    soundBars.forEach(bar => bar.classList.add('active'));
    testBtn.disabled = true;
    testBtn.innerHTML = `<span>⚡ Rafale sonore en cours...</span>`;

    // Play synthesized comic burst (3 rapid low guttural vibrations + Apple chime)
    playBurstSound(audioCtx, 0);
    playBurstSound(audioCtx, 0.18);
    playBurstSound(audioCtx, 0.36);
    setTimeout(() => playAppleChime(audioCtx), 600);

    setTimeout(() => {
      soundBars.forEach(bar => bar.classList.remove('active'));
      testBtn.disabled = false;
      testBtn.innerHTML = `<span>▶ Tester le module sonore (Rafale x2)</span>`;
    }, 1800);
  });

  function playBurstSound(ctx, delay) {
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.linearRampToValueAtTime(150, now + 0.15);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  function playAppleChime(ctx) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.4); // A6

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.8);
  }
}

/* --------------------------------------------------------------------------
   4. COUNTDOWN ENGINE (VENDREDI 25/09 - 19H30)
   -------------------------------------------------------------------------- */
function initCountdown() {
  // Target: Vendredi 25 Septembre à 19:30
  // Year: dynamic current/upcoming year
  const now = new Date();
  let targetYear = now.getFullYear();
  let targetDate = new Date(targetYear, 8, 25, 19, 30, 0); // Month 8 is September (0-indexed)

  if (now > targetDate && now.getMonth() > 8) {
    targetDate = new Date(targetYear + 1, 8, 25, 19, 30, 0);
  }

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  if (!daysEl) return;

  function update() {
    const current = new Date();
    const diff = targetDate - current;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   5. RSVP & APPLE STORE CHECKOUT MODAL
   -------------------------------------------------------------------------- */
function initRSVP() {
  const modalBackdrop = document.getElementById('rsvp-modal-backdrop');
  const openButtons = document.querySelectorAll('.trigger-rsvp');
  const closeBtn = document.getElementById('btn-close-rsvp');
  const form = document.getElementById('rsvp-form');
  const successView = document.getElementById('rsvp-success');
  const passGuestName = document.getElementById('pass-guest-name');
  const passOption = document.getElementById('pass-option');

  const btnWhatsapp = document.getElementById('btn-send-whatsapp');
  const btnSms = document.getElementById('btn-send-sms');
  const btnCalendar = document.getElementById('btn-download-ics');

  function openModal() {
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Handle Confirmation
  if (form) {
    const btnSubmit = document.getElementById('btn-submit-rsvp');
    const loadingEl = document.getElementById('rsvp-status-loading');
    const btnEmailDirect = document.getElementById('btn-send-email-direct');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value.trim() || 'Ami VIP';
      const count = document.getElementById('rsvp-guests').value;
      const drinkEl = document.getElementById('rsvp-drink');
      const drink = drinkEl ? drinkEl.value : 'Spritz';
      const contactEl = document.getElementById('rsvp-contact');
      const contact = contactEl ? contactEl.value.trim() : '';
      const note = document.getElementById('rsvp-note').value.trim();

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<span>⏳ Envoi en cours...</span>`;
      }
      if (loadingEl) loadingEl.style.display = 'block';

      // Build payload for email transmission
      const payload = {
        "Nom de l'invité": name,
        "Formule de présence": count,
        "Boisson de charge": drink,
        "Contact (Tel/Email)": contact || 'Non renseigné',
        "Message pour Ingrid": note || 'Aucun message particulier',
        "_subject": `🎉 Réservation Ingrid 42.0 : ${name} (${count})`,
        "_template": "table",
        "_captcha": "false"
      };

      // Save locally as backup
      try {
        const history = JSON.parse(localStorage.getItem('ingrid42_guest_reservations') || '[]');
        history.push({ ...payload, timestamp: new Date().toISOString() });
        localStorage.setItem('ingrid42_guest_reservations', JSON.stringify(history));
      } catch (err) {
        console.warn('localStorage error', err);
      }

      // Automated AJAX transmission to tquinzain@gmail.com
      fetch('https://formsubmit.co/ajax/tquinzain@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        console.log('FormSubmit response:', data);
      })
      .catch(err => {
        console.warn('FormSubmit fetch notice (fallback ready):', err);
      })
      .finally(() => {
        // Show ticket view
        form.style.display = 'none';
        successView.classList.add('show');
        if (passGuestName) passGuestName.textContent = name;
        if (passOption) passOption.textContent = `${count} • Prêt pour Ingrid 42.0`;

        // Launch Apple Confetti
        if (window.confetti) {
          window.confetti.fire();
        }

        // Configure Direct Mailto Fallback
        const emailBody = `Bonjour Thibaut,\n\nJe confirme ma présence pour la sortie officielle d'Ingrid 42.0 !\n\n👤 Invité(e) : ${name}\n👥 Présence : ${count}\n🍹 Boisson de charge : ${drink}\n📞 Contact : ${contact || 'N/A'}\n💬 Mon mot pour Ingrid : ${note || 'Hâte de fêter ça !'}\n\nÀ vendredi au Giallo ! 🥂`;
        if (btnEmailDirect) {
          btnEmailDirect.href = `mailto:tquinzain@gmail.com?subject=${encodeURIComponent(`🎉 Réservation Ingrid 42.0 : ${name}`)}&body=${encodeURIComponent(emailBody)}`;
        }

        // Build personalized WhatsApp & SMS confirmation text
        const msg = `🎉 Bonjour ! Je confirme ma présence pour la sortie officielle d'Ingrid 42.0 au Giallo à Sainghin ce vendredi 25/09 à 19h30 !\n\n👤 Invité : ${name}\n👥 Présence : ${count}\n🍹 Boisson : ${drink}\n💬 Note pour Ingrid : ${note || "Je viens voir la Puce S et le bug du verre !"}\n\nÀ vendredi ! 🥂`;
        const encodedMsg = encodeURIComponent(msg);

        if (btnWhatsapp) {
          btnWhatsapp.href = `https://api.whatsapp.com/send?text=${encodedMsg}`;
        }

        if (btnSms) {
          btnSms.href = `sms:?&body=${encodedMsg}`;
        }
      });
    });
  }

  // Calendar .ics download
  if (btnCalendar) {
    btnCalendar.addEventListener('click', (e) => {
      e.preventDefault();
      generateCalendarFile();
    });
  }

  function generateCalendarFile() {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Apple Inc//Ingrid 42.0 Launch//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:🎉 Keynote Anniversaire : Lancement Ingrid 42.0',
      'DESCRIPTION:Sortie officielle d\'Ingrid 42.0. Notre meilleure Ingrid à ce jour. Autonomie 6h, Puce S Spontanée et Rots en rafale !',
      'LOCATION:Restaurant Le Giallo, Sainghin-en-Mélantois',
      'DTSTART:20260925T173000Z',
      'DTEND:20260925T233000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Lancement_Ingrid_42.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
