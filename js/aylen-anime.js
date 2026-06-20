(function() {
  'use strict';

  var quoteList = [
    { text: '月色落在书页上，像一封迟来的温柔回信。', from: '今日古风摘抄' },
    { text: '愿你穿过薄雾，也能拥抱一整片粉紫色的清晨。', from: '烟柳手札' },
    { text: '把心事揉进樱花里，风一吹，就都变成了可爱的星星。', from: '二次元日常' },
    { text: '若梦会发光，那一定是淡粉与浅紫交叠的形状。', from: '梦境放映室' }
  ];

  var moods = [
    { time: '09:20', text: '整理了一束云朵色的灵感，准备写进新的随笔。' },
    { time: '13:14', text: '午后的风很软，适合给博客换上一层玻璃糖霜。' },
    { time: '18:06', text: '听见一小段旋律，像樱花落在键盘上。' },
    { time: '22:30', text: '今天也把温柔认真保存到了页面里。' }
  ];

  var tracks = [
    { name: '粉樱小夜曲', tone: 261.63, sub: 'Soft Sakura Loop' },
    { name: '云端物语', tone: 329.63, sub: 'Cloud Diary' },
    { name: '浅紫梦境', tone: 392.00, sub: 'Lavender Dream' }
  ];

  var musicState = {
    ctx: null,
    gain: null,
    osc: null,
    playing: false,
    index: 0,
    volume: 0.18,
    timer: null
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function isHome() {
    return /^\/?(index\.html)?$/.test(location.pathname.replace(/^\/+/, ''));
  }

  function isAbout() {
    return /\/about\/?(index\.html)?$/.test(location.pathname);
  }

  function createEl(tag, className, html) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (html) el.innerHTML = html;
    return el;
  }

  function injectHomeModules() {
    if (!isHome() || $('#ayHomeHero')) return;
    var content = $('.content');
    if (!content) return;

    var hero = createEl('section', 'ay-card ay-home-hero ay-reveal', [
      '<div>',
      '<div class="ay-hero-kicker">Anime Glass Blog</div>',
      '<h2 class="ay-title">欢迎来到柳卿烟的粉紫梦境</h2>',
      '<p>愿你推开这扇柔软的二次元玻璃窗时，能遇见樱花、云朵、星光和刚刚写好的温柔句子。</p>',
      '<div class="ay-hero-badges"><span>柳卿烟</span><span>清新梦幻</span><span>液态玻璃</span><span>星尘飘落</span></div>',
      '</div>',
      '<div class="ay-hero-portrait" aria-hidden="true"></div>'
    ].join(''));
    hero.id = 'ayHomeHero';

    var grid = createEl('section', 'ay-grid ay-home-grid', [
      '<div class="ay-card ay-reveal" id="ayQuoteCard"><h3>随机文案轮播</h3><div class="ay-quote-text"></div><div class="ay-quote-from"></div></div>',
      '<div class="ay-card ay-reveal"><h3>今日心情</h3><div class="ay-mood-list"></div></div>',
      '<div class="ay-card ay-feature-rail ay-reveal"><h3>归档时间轴</h3><div class="ay-mini-tags"><a href="/archives/">文章归档</a><span>樱系文字</span><span>生活碎片</span><span>梦境</span></div><div class="ay-timeline"><span>✧ 2026 · 博客初绽</span><span>✦ 06月 · 落樱启笔</span><span>✧ 今日 · 梦幻粉紫重排</span></div></div>',
      '<div class="ay-card ay-reveal"><h3>站点数据</h3><div class="ay-stats"><div class="ay-stat"><strong id="ayBuildDays">1</strong>天</div><div class="ay-stat"><strong id="ayArticleCount">2</strong>文章</div><div class="ay-stat"><strong id="ayVisitCount">1288</strong>访客</div><div class="ay-stat"><strong id="ayOnlineCount">7</strong>在线</div></div></div>',
      '<div class="ay-card ay-message-card ay-reveal"><h3>留言互动板</h3><p>写下一句粉紫色的心情，发送时会掉落一小阵花瓣。</p><textarea class="ay-message-input" placeholder="在这里写一条温柔留言"></textarea><button class="ay-message-send" type="button">发送留言</button><div class="ay-message-list"><div class="ay-bubble">欢迎来到柳卿烟的梦幻小站。</div></div></div>'
    ].join(''));

    content.insertBefore(grid, content.firstChild);
    content.insertBefore(hero, grid);
    fillQuote();
    fillMoods();
    updateStats();
  }

  function fixMenuLabels() {
    var archives = $('.menu-item-archives');
    if (archives) archives.remove();
    [
      ['.menu-item-publish a', '发表'],
      ['.menu-item-gallery a', '相册'],
      ['.menu-item-about a', '关于'],
      ['.menu-item-home a', '首页']
    ].forEach(function(item) {
      var link = $(item[0]);
      if (!link) return;
      var icon = link.querySelector('i');
      link.innerHTML = (icon ? icon.outerHTML : '') + item[1];
    });
  }

  function fillQuote() {
    var quote = quoteList[Math.floor(Math.random() * quoteList.length)];
    var text = $('.ay-quote-text');
    var from = $('.ay-quote-from');
    if (text) text.textContent = quote.text;
    if (from) from.textContent = '—— ' + quote.from;
    window.setInterval(function() {
      var item = quoteList[Math.floor(Math.random() * quoteList.length)];
      if (text) text.textContent = item.text;
      if (from) from.textContent = '—— ' + item.from;
    }, 30000);
  }

  function fillMoods() {
    var list = $('.ay-mood-list');
    if (!list) return;
    list.innerHTML = moods.map(function(item) {
      return '<div class="ay-mood-item"><span class="ay-mood-time">🌸 今天 ' + item.time + '</span>' + item.text + '</div>';
    }).join('');
  }

  function updateStats() {
    var start = new Date('2026-06-18T00:00:00+08:00').getTime();
    var days = Math.max(1, Math.ceil((Date.now() - start) / 86400000));
    var build = $('#ayBuildDays');
    var online = $('#ayOnlineCount');
    var visits = $('#ayVisitCount');
    var articles = $('#ayArticleCount');
    if (build) build.textContent = days;
    if (articles) articles.textContent = Math.max(2, $all('.post-block').length);
    if (visits) visits.textContent = 1200 + days * 37 + Math.floor(Math.random() * 36);
    if (online) {
      online.textContent = 5 + Math.floor(Math.random() * 9);
      window.setInterval(function() {
        online.textContent = 5 + Math.floor(Math.random() * 9);
      }, 5000);
    }
  }

  function enhancePosts() {
    if (!isHome()) return;
    $all('.post-block').forEach(function(post, index) {
      if (post.dataset.ayEnhanced === 'true') return;
      post.dataset.ayEnhanced = 'true';
      post.classList.add('ay-reveal');
      if (!post.querySelector('.ay-post-cover')) {
        var cover = createEl('div', 'ay-post-cover');
        cover.style.cssText = 'height:170px;margin-bottom:18px;background:linear-gradient(135deg,' + (index % 2 ? '#ffd4ec,#d9c7ff' : '#ffe6f3,#cfbdff') + ');';
        post.insertBefore(cover, post.firstChild);
      }
    });
  }

  function revealOnScroll() {
    var items = $all('.ay-reveal, .post-block, .ay-card');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function(item) { item.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function(item) {
      item.classList.add('ay-reveal');
      observer.observe(item);
    });
  }

  function initSakura() {
    var layer = $('#aylenSakuraLayer');
    if (!layer || layer.dataset.ready === 'true') return;
    layer.dataset.ready = 'true';
    var enabled = localStorage.getItem('aylenSakura') !== 'off';
    var button = createEl('button', 'ay-sakura-toggle', enabled ? '樱花开' : '樱花关');
    document.body.appendChild(button);
    button.addEventListener('click', function() {
      enabled = !enabled;
      localStorage.setItem('aylenSakura', enabled ? 'on' : 'off');
      button.textContent = enabled ? '樱花开' : '樱花关';
      var sideToggle = $('.ay-side-toggle');
      if (sideToggle) sideToggle.textContent = enabled ? '粒子开' : '粒子关';
    });
    window.setInterval(function() {
      if (!enabled) return;
      var petal = createEl('span', 'ay-sakura', '✦');
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.animationDuration = 5 + Math.random() * 5 + 's';
      petal.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');
      layer.appendChild(petal);
      window.setTimeout(function() { petal.remove(); }, 10000);
    }, 520);
  }

  function initSparkClick() {
    if (document.body.dataset.aySparkReady === 'true') return;
    document.body.dataset.aySparkReady = 'true';
    document.addEventListener('click', function(event) {
      for (var i = 0; i < 8; i++) {
        var spark = createEl('span', 'ay-spark');
        spark.style.left = event.clientX + 'px';
        spark.style.top = event.clientY + 'px';
        spark.style.setProperty('--sx', (Math.random() * 90 - 45) + 'px');
        spark.style.setProperty('--sy', (Math.random() * 90 - 45) + 'px');
        document.body.appendChild(spark);
        window.setTimeout(function(el) { el.remove(); }, 720, spark);
      }
    });
  }

  function initMusicPlayer() {
    if ($('#ayMusicPlayer')) return;
    var player = createEl('div', 'ay-music-player', [
      '<div class="ay-music-head"><div class="ay-music-disc"></div><div><div class="ay-music-name"></div><div class="ay-music-sub"></div></div></div>',
      '<div class="ay-music-controls"><button class="ay-music-btn" data-music="prev">‹</button><button class="ay-music-btn" data-music="play">♪</button><button class="ay-music-btn" data-music="next">›</button><input class="ay-music-volume" type="range" min="0" max="1" step="0.01" value="0.18" aria-label="音量"></div>'
    ].join(''));
    player.id = 'ayMusicPlayer';
    document.body.appendChild(player);
    restorePlayerPosition(player);
    bindPlayerDrag(player);
    renderTrack(player);

    player.addEventListener('click', function(event) {
      var action = event.target.getAttribute('data-music');
      if (!action) return;
      if (action === 'play') toggleMusic(player);
      if (action === 'prev') switchTrack(-1, player);
      if (action === 'next') switchTrack(1, player);
    });

    var volume = $('.ay-music-volume', player);
    if (volume) {
      volume.addEventListener('input', function() {
        musicState.volume = Number(volume.value);
        if (musicState.gain) musicState.gain.gain.value = musicState.volume;
      });
    }
  }

  function renderTrack(player) {
    var track = tracks[musicState.index];
    $('.ay-music-name', player).textContent = track.name;
    $('.ay-music-sub', player).textContent = track.sub + (musicState.playing ? ' · 播放中' : ' · 点击播放');
  }

  function ensureAudio() {
    if (!musicState.ctx) {
      musicState.ctx = new (window.AudioContext || window.webkitAudioContext)();
      musicState.gain = musicState.ctx.createGain();
      musicState.gain.gain.value = musicState.volume;
      musicState.gain.connect(musicState.ctx.destination);
    }
  }

  function playTone() {
    ensureAudio();
    stopTone();
    var track = tracks[musicState.index];
    var osc = musicState.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = track.tone;
    osc.connect(musicState.gain);
    osc.start();
    musicState.osc = osc;
    musicState.playing = true;
    window.clearInterval(musicState.timer);
    musicState.timer = window.setInterval(function() {
      var player = $('#ayMusicPlayer');
      if (player && musicState.playing) switchTrack(1, player);
    }, 45000);
  }

  function stopTone() {
    if (musicState.osc) {
      try { musicState.osc.stop(); } catch (error) {}
      musicState.osc.disconnect();
      musicState.osc = null;
    }
    musicState.playing = false;
    window.clearInterval(musicState.timer);
    musicState.timer = null;
  }

  function toggleMusic(player) {
    if (musicState.playing) stopTone();
    else playTone();
    renderTrack(player);
  }

  function switchTrack(step, player) {
    var wasPlaying = musicState.playing;
    stopTone();
    musicState.index = (musicState.index + step + tracks.length) % tracks.length;
    if (wasPlaying) playTone();
    renderTrack(player);
  }

  function bindPlayerDrag(player) {
    var head = $('.ay-music-head', player);
    var dragging = false;
    var startX = 0;
    var startY = 0;
    var rect = null;
    head.addEventListener('pointerdown', function(event) {
      dragging = true;
      rect = player.getBoundingClientRect();
      startX = event.clientX - rect.left;
      startY = event.clientY - rect.top;
      head.setPointerCapture(event.pointerId);
    });
    head.addEventListener('pointermove', function(event) {
      if (!dragging) return;
      player.style.left = Math.max(8, Math.min(window.innerWidth - player.offsetWidth - 8, event.clientX - startX)) + 'px';
      player.style.top = Math.max(8, Math.min(window.innerHeight - player.offsetHeight - 8, event.clientY - startY)) + 'px';
      player.style.bottom = 'auto';
    });
    head.addEventListener('pointerup', function() {
      dragging = false;
      localStorage.setItem('ayMusicPos', JSON.stringify({ left: player.style.left, top: player.style.top }));
    });
  }

  function restorePlayerPosition(player) {
    try {
      var pos = JSON.parse(localStorage.getItem('ayMusicPos') || '{}');
      if (pos.left && pos.top) {
        player.style.left = pos.left;
        player.style.top = pos.top;
        player.style.bottom = 'auto';
      }
    } catch (error) {}
  }

  function initCalculatorEgg() {
    var clickCount = 0;
    var resetTimer = null;
    var password = '柳卿烟';
    var adminPath = '/admin/';
    var modal = $('#aylenCalcModal');
    if (!modal || modal.dataset.ready === 'true') return;
    modal.dataset.ready = 'true';
    var input = $('.aylen-calc-display', modal);
    var closeBtn = $('.aylen-calc-close', modal);
    var keys = $all('.aylen-calc-key', modal);

    function openModal() {
      modal.classList.add('is-visible');
      modal.setAttribute('aria-hidden', 'false');
      if (input) {
        input.value = '';
        input.focus();
      }
    }

    function closeModal() {
      modal.classList.remove('is-visible');
      modal.setAttribute('aria-hidden', 'true');
    }

    function confirmPassword() {
      if (!input) return;
      if (input.value === password) {
        window.location.href = adminPath;
        return;
      }
      input.value = '';
      input.placeholder = '密码为柳卿烟，再试一次';
      input.focus();
    }

    function bindAvatar() {
      if (!isAbout()) return;
      var avatar = $('.aylen-about-avatar') || $('.site-author-image');
      if (!avatar || avatar.dataset.aylenEggReady === 'true') return;
      avatar.dataset.aylenEggReady = 'true';
      avatar.setAttribute('title', '连续点击 10 次试试看');
      avatar.addEventListener('click', function() {
        clickCount += 1;
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(function() { clickCount = 0; }, 1800);
        if (clickCount >= 10) {
          clickCount = 0;
          openModal();
        }
      });
    }

    keys.forEach(function(key) {
      key.addEventListener('click', function() {
        var value = key.getAttribute('data-value');
        var action = key.getAttribute('data-action');
        if (!input) return;
        if (value) input.value += value;
        if (action === 'clear') input.value = '';
        if (action === 'back') input.value = input.value.slice(0, -1);
        if (action === 'confirm') confirmPassword();
        input.focus();
      });
    });

    if (input) {
      input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') confirmPassword();
        if (event.key === 'Escape') closeModal();
      });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    bindAvatar();
    document.addEventListener('pjax:success', bindAvatar);
  }

  function initMessageBoard() {
    var card = $('.ay-message-card');
    if (!card || card.dataset.ready === 'true') return;
    card.dataset.ready = 'true';
    var input = $('.ay-message-input', card);
    var list = $('.ay-message-list', card);
    var button = $('.ay-message-send', card);
    if (!button || !input || !list) return;
    button.addEventListener('click', function(event) {
      var text = input.value.trim();
      if (!text) {
        input.placeholder = '先写下一句留言吧';
        return;
      }
      var bubble = createEl('div', 'ay-bubble', text);
      list.insertBefore(bubble, list.firstChild);
      input.value = '';
      burstPetals(event.clientX || window.innerWidth / 2, event.clientY || window.innerHeight / 2);
    });
  }

  function burstPetals(x, y) {
    for (var i = 0; i < 18; i++) {
      var petal = createEl('span', 'ay-spark ay-petal-burst');
      petal.style.left = x + 'px';
      petal.style.top = y + 'px';
      petal.style.setProperty('--sx', (Math.random() * 180 - 90) + 'px');
      petal.style.setProperty('--sy', (Math.random() * 160 - 90) + 'px');
      document.body.appendChild(petal);
      window.setTimeout(function(el) { el.remove(); }, 900, petal);
    }
  }

  function initGalleryPreview() {
    if (document.body.dataset.galleryPreviewReady === 'true') return;
    document.body.dataset.galleryPreviewReady = 'true';
    var preview = createEl('div', 'ay-gallery-preview', '<div class="ay-gallery-preview-inner"><button type="button" class="ay-gallery-close">×</button><div class="ay-gallery-preview-img"></div></div>');
    document.body.appendChild(preview);
    preview.addEventListener('click', function(event) {
      if (event.target === preview || event.target.classList.contains('ay-gallery-close')) preview.classList.remove('is-visible');
    });
    document.addEventListener('click', function(event) {
      var img = event.target.closest && event.target.closest('.ay-gallery-img');
      if (!img) return;
      var target = $('.ay-gallery-preview-img', preview);
      target.style.backgroundImage = getComputedStyle(img).backgroundImage;
      preview.classList.add('is-visible');
    });
  }

  function initDreamSidePanel() {
    if ($('#ayDreamSidePanel')) return;
    var panel = createEl('aside', 'ay-dream-side-panel ay-card', [
      '<div class="ay-side-avatar"></div>',
      '<h3>柳卿烟的小功能栏</h3>',
      '<a href="/archives/">✦ 文章时间轴</a>',
      '<a href="/gallery/">✧ 二次元相册</a>',
      '<a href="/publish/">✦ 发表手帐</a>',
      '<button class="ay-side-toggle" type="button">粒子开</button>',
      '<div class="ay-side-mini-stats"><span>访客 <b>1288+</b></span><span>在线 <b>7</b></span></div>'
    ].join(''));
    panel.id = 'ayDreamSidePanel';
    document.body.appendChild(panel);
    var toggle = $('.ay-side-toggle', panel);
    if (toggle) {
      toggle.addEventListener('click', function() {
        var fixedToggle = $('.ay-sakura-toggle');
        if (fixedToggle) fixedToggle.click();
        toggle.textContent = localStorage.getItem('aylenSakura') === 'off' ? '粒子关' : '粒子开';
      });
    }
  }

  function initLoader() {
    var loader = $('#ayDreamLoader');
    if (!loader) return;
    window.setTimeout(function() {
      loader.classList.add('is-hidden');
    }, 650);
  }

  function boot() {
    fixMenuLabels();
    injectHomeModules();
    enhancePosts();
    initSakura();
    initSparkClick();
    initMusicPlayer();
    initCalculatorEgg();
    initMessageBoard();
    initGalleryPreview();
    initDreamSidePanel();
    initLoader();
    window.setTimeout(revealOnScroll, 60);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('pjax:success', boot);
})();
