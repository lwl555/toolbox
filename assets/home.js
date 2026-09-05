/* ============================================================
   home.js — 首页（分类导航 + 搜索 + 收藏 + 最近使用）
   ============================================================ */
var CATS = [
  { id: 'text', n: '文本处理', i: '<path d="M4 6h16M4 12h16M4 18h10"/>' },
  { id: 'text2', n: '文本进阶', i: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>' },
  { id: 'encode', n: '编码加密', i: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10l2 2-2 2M12 14h5"/>' },
  { id: 'number', n: '数字数学', i: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
  { id: 'time', n: '时间日期', i: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' },
  { id: 'random', n: '随机生成', i: '<path d="M4 4l6 6M14 4l6 6M4 20l6-6M14 20l6-6"/>' },
  { id: 'convert', n: '单位换算', i: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>' },
  { id: 'dev', n: '开发工具', i: '<path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/>' },
  { id: 'color', n: '设计配色', i: '<path d="M12 3a9 9 0 100 18c1 0 2-1 2-2 0-1-1-1-1-2 0-1 1-2 2-2h2a3 3 0 003-3 9 9 0 00-9-7z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/>' },
  { id: 'calc', n: '计算工具', i: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>' },
  { id: 'life', n: '生活日常', i: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>' },
  { id: 'learn', n: '学习教育', i: '<path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2z"/><path d="M8 7h7M8 11h7"/>' },
  { id: 'fun', n: '趣味娱乐', i: '<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M8.5 14a4.5 4.5 0 007 0"/>' },
  { id: 'image', n: '图片处理', i: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-6 6"/>' },
  { id: 'pdf', n: 'PDF工具', i: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>' },
  { id: 'office', n: '办公文档', i: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/>' },
  { id: 'media', n: '音视频', i: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M10 9l5 3-5 3z"/>' },
  { id: 'network', n: '网络信息', i: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/>' },
  { id: 'file', n: '文件工具', i: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/><path d="M8 13h8M8 17h8"/>' },
  { id: 'ai-text', n: 'AI文本', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
  { id: 'ai-write', n: 'AI写作', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
  { id: 'ai-code', n: 'AI代码', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
  { id: 'ai-data', n: 'AI数据', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
  { id: 'ai-life', n: 'AI生活', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
  { id: 'ai-media', n: 'AI影音', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
  { id: 'ai-chat', n: 'AI对话', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
  { id: 'ai-prompt', n: '提示词', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
  { id: 'ai-biz', n: 'AI商业', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
  { id: 'ai-design', n: 'AI设计', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
  { id: 'ai-legal', n: 'AI文书', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
  { id: 'ai-study', n: 'AI学习', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' },
  { id: 'ai-agent', n: 'AI智能体', i: '<rect x="5" y="7" width="14" height="12" rx="2"/><path d="M12 3v4M9 12h.01M15 12h.01M9 16h6"/>' }
];

var FAV_KEY = 'toolbox_fav_v2';
var USE_KEY = 'toolbox_used_v2';

function favs() { try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch (e) { return []; } }
function used() { try { return JSON.parse(localStorage.getItem(USE_KEY) || '[]'); } catch (e) { return []; } }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function catOf(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i]; return CATS[0]; }
function icon(cid) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + catOf(cid).i + '</svg>'; }

function cardHTML(t) {
  var isFav = favs().indexOf(t.id) >= 0;
  return '<a class="card" href="tools/' + t.id + '.html" data-id="' + t.id + '" data-n="' + esc(t.n) + '" data-c="' + t.c + '">' +
    '<button class="card-fav' + (isFav ? ' on' : '') + '" data-fav="' + t.id + '" title="收藏">★</button>' +
    '<div class="card-t"><span class="card-ico">' + icon(t.c) + '</span>' +
    '<span class="card-name">' + esc(t.n) + '</span></div>' +
    '<div class="card-desc">' + esc(t.d) + '</div></a>';
}

function sectionHTML(cid, list, title) {
  if (!list.length) return '';
  var c = catOf(cid);
  return '<section class="sec" id="sec-' + cid + '">' +
    '<div class="sec-head"><h2>' + esc(title || c.n) + '</h2><span class="n">' + list.length + '</span></div>' +
    '<div class="grid">' + list.map(cardHTML).join('') + '</div></section>';
}
/* 最近使用（历史记录）栏：用独立 id sec-recent，避免与分类 section id（如 sec-calc）冲突导致分类导航定位错乱 */
function recentSectionHTML(list) {
  return '<section class="sec recent-sec" id="sec-recent"><div class="sec-head"><h2>最近使用</h2><span class="n">' + list.length + '</span>' +
    '<span class="fav-hint">按使用时间排序 · 自动记录</span>' +
    '<button class="clear-hist" data-clear="used" title="清除历史记录">清除</button></div>' +
    '<div class="grid">' + list.map(cardHTML).join('') + '</div></section>';
}

/* hist 移到 renderHome 内每次调用时重算（与 favList 一致），确保清除历史后首页即时更新 */
function renderHome() {
  var favList = favs().map(function (id) { return TOOLS.filter(function (t) { return t.id === id; })[0]; }).filter(Boolean);
  var hist = used().map(function (id) { return TOOLS.filter(function (t) { return t.id === id; })[0]; }).filter(Boolean).slice(0, 12);
  var h = '';
  if (hist.length) h += recentSectionHTML(hist);
  if (favList.length) h += '<section class="sec fav-sec" id="sec-fav"><div class="sec-head"><h2>我的收藏</h2><span class="n">' + favList.length + '</span><span class="fav-hint">拖动卡片可排序 · 自动保存</span></div><div class="grid">' + favList.map(cardHTML).join('') + '</div></section>';
  CATS.forEach(function (c) {
    var list = TOOLS.filter(function (t) { return t.c === c.id; });
    if (list.length) h += sectionHTML(c.id, list);
  });
  document.getElementById('body').innerHTML = h;
  document.getElementById('tCount').textContent = TOOLS.length;
  document.getElementById('cCount').textContent = CATS.filter(function (c) { return TOOLS.some(function (t) { return t.c === c.id; }); }).length;
  bind();
  enableFavSort();
}

/* 收藏栏（快捷栏）拖拽排序：鼠标 + 触摸通用（Pointer Events），顺序持久化到 localStorage */
var _justDragged = false;
function enableFavSort() {
  var grid = document.querySelector('#sec-fav .grid');
  if (!grid) return;
  var dragEl = null, startX = 0, startY = 0, dragging = false;
  grid.addEventListener('pointerdown', function (e) {
    var card = e.target.closest ? e.target.closest('.card') : null;
    if (!card || (e.target.closest && e.target.closest('.card-fav'))) return;
    if (e.button != null && e.button !== 0) return;
    dragEl = card; startX = e.clientX; startY = e.clientY; dragging = false;
    if (card.setPointerCapture) { try { card.setPointerCapture(e.pointerId); } catch (err) {} }
  });
  grid.addEventListener('pointermove', function (e) {
    if (!dragEl) return;
    if (!dragging) {
      if (Math.abs(e.clientX - startX) < 6 && Math.abs(e.clientY - startY) < 6) return;
      dragging = true; grid.classList.add('sorting'); dragEl.classList.add('dragging');
    }
    if (e.cancelable) e.preventDefault();
    var el = document.elementFromPoint(e.clientX, e.clientY);
    var over = el && el.closest ? el.closest('.card') : null;
    if (over && over !== dragEl && over.parentNode === grid) {
      var r = over.getBoundingClientRect();
      var after = (e.clientY - r.top) > r.height / 2 || (e.clientX - r.left) > r.width / 2;
      if (after) grid.insertBefore(dragEl, over.nextSibling);
      else grid.insertBefore(dragEl, over);
    }
  });
  function end() {
    if (!dragEl) return;
    if (dragging) {
      dragEl.classList.remove('dragging'); grid.classList.remove('sorting');
      var ids = Array.prototype.slice.call(grid.children).map(function (c) { return c.getAttribute('data-id'); });
      localStorage.setItem(FAV_KEY, JSON.stringify(ids));
      _justDragged = true;
      setTimeout(function () { _justDragged = false; }, 250);
    }
    dragEl = null; dragging = false;
  }
  grid.addEventListener('pointerup', end);
  grid.addEventListener('pointercancel', end);
  grid.addEventListener('click', function (e) {
    if (_justDragged) { e.preventDefault(); e.stopPropagation(); _justDragged = false; }
  }, true);
}

var tabsHTML = CATS.filter(function (c) { return TOOLS.some(function (t) { return t.c === c.id; }); })
  .map(function (c) { return '<a class="cat-tab" href="#sec-' + c.id + '">' + esc(c.n) + '</a>'; }).join('');

function bind() {
  document.querySelectorAll('[data-fav]').forEach(function (b) {
    b.onclick = function (e) {
      e.preventDefault(); e.stopPropagation();
      var f = favs(), id = b.dataset.fav, i = f.indexOf(id);
      if (i >= 0) f.splice(i, 1); else f.push(id);
      localStorage.setItem(FAV_KEY, JSON.stringify(f));
      b.classList.toggle('on', f.indexOf(id) >= 0);
      if (document.getElementById('q').value === '') renderHome();
    };
  });
  document.querySelectorAll('[data-clear]').forEach(function (b) {
    b.onclick = function (e) {
      e.preventDefault(); e.stopPropagation();
      try { localStorage.removeItem(USE_KEY); } catch (e2) {}
      RT.toast('已清除最近使用记录');
      renderHome();
    };
  });
}

function search(q) {
  q = q.trim().toLowerCase();
  var box = document.getElementById('body');
  if (!q) { renderHome(); return; }
  var r = TOOLS.filter(function (t) {
    return (t.n + ' ' + t.d).toLowerCase().indexOf(q) >= 0 || t.id.indexOf(q) >= 0;
  });
  if (!r.length) {
    box.innerHTML = '<div class="empty"><b>没找到「' + esc(q) + '」</b>换个词试试，比如：PDF、压缩、换算、正则</div>';
    return;
  }
  box.innerHTML = '<section class="sec"><div class="sec-head"><h2>搜索结果</h2><span class="n">' + r.length + '</span></div>' +
    '<div class="grid">' + r.map(cardHTML).join('') + '</div></section>';
  bind();
}

/* 主页「AI 帮找工具」：用大白话描述需求，AI 从全部工具里挑最匹配的 */
function setupAIFind() {
  var wrap = document.querySelector('.wrap');
  if (!wrap) return;
  var box = document.createElement('div');
  box.className = 'aifind';
  box.innerHTML = '<div class="aifind-in">' +
    '<div class="aifind-h"><span class="aifind-ic">🤖</span><b>AI 帮找工具</b><span class="aifind-sub">用大白话描述你想做的事，AI 帮你挑最合适工具</span></div>' +
    '<div class="aifind-row">' +
    '<input id="aifind-q" class="aifind-input" type="text" placeholder="例如：帮我把 PDF 合并、写一封辞职信、算一下房贷月供…" />' +
    '<button id="aifind-go" class="aifind-btn">帮我找</button></div>' +
    '<div id="aifind-res"></div></div>';
  wrap.insertBefore(box, document.getElementById('body'));
  var q = box.querySelector('#aifind-q'), go = box.querySelector('#aifind-go'), res = box.querySelector('#aifind-res');
  function run() {
    var need = q.value.trim();
    if (!need) { RT.toast('先描述一下你想做什么'); return; }
    go.disabled = true; go.textContent = '思考中…';
    res.innerHTML = '<div class="aifind-loading">AI 正在为你匹配工具…</div>';
    RT.agnesFindTools(need, TOOLS, function (ids, err) {
      go.disabled = false; go.textContent = '帮我找';
      if (err || !ids || !ids.length) {
        res.innerHTML = '<div class="aifind-tip">AI 暂时没匹配到，已按关键词帮你找：</div>';
        var r = TOOLS.filter(function (t) { return (t.n + ' ' + t.d).toLowerCase().indexOf(need.toLowerCase()) >= 0; }).slice(0, 8);
        if (!r.length) { res.innerHTML += '<div class="empty">没找到相关工具，换个说法试试？</div>'; return; }
        res.innerHTML += '<div class="grid">' + r.map(cardHTML).join('') + '</div>';
        return;
      }
      var picks = ids.map(function (id) { return TOOLS.filter(function (t) { return t.id === id; })[0]; }).filter(Boolean).slice(0, 6);
      if (!picks.length) { res.innerHTML = '<div class="empty">AI 推荐的都是陌生工具，试试别的说法～</div>'; return; }
      res.innerHTML = '<div class="aifind-tip">AI 为你推荐 ' + picks.length + ' 个工具：</div><div class="grid">' + picks.map(cardHTML).join('') + '</div>';
    });
  }
  go.onclick = run;
  q.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('tabs').innerHTML = tabsHTML;
  renderHome();
  setupAIFind();
  var q = document.getElementById('q'), sw = document.querySelector('.search');
  var tm;
  q.oninput = function () {
    sw.classList.toggle('has', !!q.value);
    clearTimeout(tm); tm = setTimeout(function () { search(q.value); }, 120);
  };
  document.querySelector('.search .clr').onclick = function () {
    q.value = ''; sw.classList.remove('has'); renderHome(); q.focus();
  };
  document.getElementById('rnd').onclick = function () {
    var t = TOOLS[Math.floor(Math.random() * TOOLS.length)];
    location.href = 'tools/' + t.id + '.html';
  };

  /* 分类导航：点击平滑滚动到对应区块。
     移动端坑修复：原 sec.scrollIntoView({behavior:'smooth'}) 在 iOS Safari 上经常不滚动/定位漂移，
     且连点 tab.scrollIntoView 会与页面纵向滚动打架 → 手机端"点了没反应/跳错位置"。
     改为确定性 window.scrollTo(减去顶栏实际高度) + 仅在分类栏内部横向居中当前 tab（不触发页面纵向滚动）。 */
  var headerH = 108;
  function recalcHeaderH() {
    var t = document.querySelector('.top'), c = document.querySelector('.cats');
    headerH = (t ? t.offsetHeight : 52) + (c ? c.offsetHeight : 48) + 4;
  }
  recalcHeaderH();
  var _navLock = 0; /* 导航锁：点击分类后滚动途中，禁止 scroll-spy 把高亮算飞 */
  var tabEls = Array.prototype.slice.call(document.querySelectorAll('.cat-tab'));
  tabEls.forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      var id = tab.getAttribute('href');
      if (id && id.charAt(0) === '#') {
        e.preventDefault();
        /* 搜索态下：先退出搜索、回到全量首页，再定位分类，避免 #body 被搜索结果替换后区块丢失导致点击无反应 */
        var q = document.getElementById('q');
        if (q && q.value.trim()) {
          q.value = '';
          var sw = document.querySelector('.search');
          if (sw) sw.classList.remove('has');
          renderHome();
        }
        var sec = document.querySelector(id);
        if (sec) {
          recalcHeaderH();
          var y = sec.getBoundingClientRect().top + window.scrollY - headerH;
          if (y < 0) y = 0;
          /* 确定性滚动：直接算目标 Y，绕开 scrollIntoView 在移动端的不可靠行为 */
          try { window.scrollTo({ top: y, behavior: 'smooth' }); }
          catch (err) { window.scrollTo(0, y); }
          /* 把当前 tab 横向居中到分类栏：只动分类栏自身的横向滚动，绝不影响页面纵向滚动 */
          var catsIn = document.getElementById('tabs');
          if (catsIn && tab.parentNode === catsIn) {
            var target = tab.offsetLeft - catsIn.clientWidth / 2 + tab.offsetWidth / 2;
            try { catsIn.scrollTo({ left: Math.max(0, target), behavior: 'smooth' }); }
            catch (err) { catsIn.scrollLeft = Math.max(0, target); }
          }
        }
        /* 点击即时高亮，并锁住 scroll-spy 直到滚动结束，避免滚动途中高亮被算飞 */
        tabEls.forEach(function (t) { t.classList.remove('on'); });
        tab.classList.add('on');
        _navLock = Date.now() + 3000;
        setTimeout(spy, 3100); /* 兜底：不支持 scrollend 的浏览器，滚动结束后校准一次 */
      }
    });
  });
  var spy = function () {
    if (_navLock > Date.now()) return; /* 导航锁定期内不打断用户点击的高亮 */
    var cur = null, best = 1e9;
    var secs = document.querySelectorAll('.sec');
    secs.forEach(function (sec) {
      var r = sec.getBoundingClientRect();
      var top = r.top - headerH - 8;
      if (top <= 0 && -top < best) { best = -top; cur = sec.id; }
    });
    /* 顶部尚未滚到任何区块时，默认激活第一个分类，避免视觉上"无选中"的空白 */
    if (!cur && secs[0]) cur = secs[0].id;
    tabEls.forEach(function (t) {
      var href = t.getAttribute('href') || '';
      t.classList.toggle('on', cur && href === '#' + cur);
    });
  };
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', function () { recalcHeaderH(); spy(); });
  /* 滚动一停就按落点校准高亮（现代浏览器支持 scrollend，比固定定时器更准） */
  try { window.addEventListener('scrollend', function () { _navLock = 0; spy(); }, { passive: true }); } catch (e) {}
  spy();
  /* 顶栏滚动阴影：滚一点就浮起一层柔和阴影，强化"可交互"反馈 */
  var topEl = document.querySelector('.top');
  var onScrollTop = function () { if (topEl) topEl.classList.toggle('scrolled', window.scrollY > 4); };
  window.addEventListener('scroll', onScrollTop, { passive: true });
  onScrollTop();
});
