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
  { id: 'ai-study', n: 'AI学习', i: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>' }
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

var hist = used().map(function (id) { return TOOLS.filter(function (t) { return t.id === id; })[0]; }).filter(Boolean).slice(0, 12);

function renderHome() {
  var favList = favs().map(function (id) { return TOOLS.filter(function (t) { return t.id === id; })[0]; }).filter(Boolean);
  var h = '';
  if (hist.length) h += sectionHTML(hist[0].c, hist, '最近使用');
  if (favList.length) h += sectionHTML('text', favList, '我的收藏');
  CATS.forEach(function (c) {
    var list = TOOLS.filter(function (t) { return t.c === c.id; });
    if (list.length) h += sectionHTML(c.id, list);
  });
  document.getElementById('body').innerHTML = h;
  document.getElementById('tCount').textContent = TOOLS.length;
  document.getElementById('cCount').textContent = CATS.filter(function (c) { return TOOLS.some(function (t) { return t.c === c.id; }); }).length;
  bind();
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

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('tabs').innerHTML = tabsHTML;
  renderHome();
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
});
