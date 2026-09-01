/* ============================================================
   runtime.js — 工具页运行时
   声明式：TOOL = { id, name, cat, desc, fields, auto, run }
   ============================================================ */
(function () {
  'use strict';

  var RT = {};

  /* ---------- 基础 ---------- */
  RT.$ = function (s, r) { return (r || document).querySelector(s); };
  RT.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  RT.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  RT.toast = function (msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.classList.remove('on'); }, 1900);
  };

  RT.copy = function (text, tip) {
    if (text == null || text === '') { RT.toast('没有可复制的内容'); return; }
    var done = function () { RT.toast(tip || '已复制'); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(String(text)).then(done, function () { RT.fallbackCopy(text, done); });
    } else RT.fallbackCopy(text, done);
  };
  RT.fallbackCopy = function (text, done) {
    var ta = document.createElement('textarea');
    ta.value = String(text);
    ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { RT.toast('复制失败，请手动选中'); }
    document.body.removeChild(ta);
  };

  RT.fmtSize = function (n) {
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
    if (n < 1073741824) return (n / 1048576).toFixed(2) + ' MB';
    return (n / 1073741824).toFixed(2) + ' GB';
  };

  RT.dl = function (name, blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  };
  RT.dlText = function (name, text, mime) {
    RT.dl(name, new Blob([text], { type: (mime || 'text/plain') + ';charset=utf-8' }));
  };
  RT.dlDataURL = function (name, dataurl) {
    var a = document.createElement('a');
    a.href = dataurl; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  /* ---------- 图片 ---------- */
  RT.loadImg = function (src) {
    return new Promise(function (res, rej) {
      var img = new Image();
      if (typeof src !== 'string') img.src = URL.createObjectURL(src);
      else img.src = src;
      img.onload = function () { res(img); };
      img.onerror = function () { rej(new Error('图片加载失败')); };
    });
  };
  RT.mkCanvas = function (w, h) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h));
    return c;
  };
  RT.fitCanvas = function (img, maxW) {
    maxW = maxW || 1600;
    var s = Math.min(1, maxW / img.naturalWidth);
    var c = RT.mkCanvas(img.naturalWidth * s, img.naturalHeight * s);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c;
  };
  RT.dlCanvas = function (canvas, name, type, q) {
    canvas.toBlob(function (b) { RT.dl(name, b); }, type || 'image/png', q == null ? 0.92 : q);
  };
  RT.fileToText = function (file) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(r.result); };
      r.onerror = function () { rej(new Error('读取失败')); };
      r.readAsText(file, 'utf-8');
    });
  };
  RT.fileToBuf = function (file) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(r.result); };
      r.onerror = function () { rej(new Error('读取失败')); };
      r.readAsArrayBuffer(file);
    });
  };
  /* 拖放 + 选择文件 */
  RT.bindDrop = function (zone, input, cb, multi) {
    if (!zone) return;
    zone.addEventListener('click', function (e) { if (e.target !== input) input && input.click(); });
    if (input) input.addEventListener('change', function () {
      if (input.files && input.files.length) cb(multi ? Array.prototype.slice.call(input.files) : input.files[0]);
    });
    ['dragenter', 'dragover'].forEach(function (ev) {
      zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('over'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('over'); });
    });
    zone.addEventListener('drop', function (e) {
      var fs = e.dataTransfer.files;
      if (fs && fs.length) cb(multi ? Array.prototype.slice.call(fs) : fs[0]);
    });
  };

  /* ---------- 库按需加载 ---------- */
  var libCache = {};
  RT.lib = function (urls) {
    if (!Array.isArray(urls)) urls = [urls];
    var key = urls.join(',');
    if (libCache[key]) return libCache[key];
    libCache[key] = Promise.all(urls.map(function (u) {
      return new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = u; s.onload = res; s.onerror = function () { rej(new Error('库加载失败: ' + u)); };
        document.head.appendChild(s);
      });
    }));
    return libCache[key];
  };
  var CDN = {
    qrcode: ['https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js',
      'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode_UTF8.js'],
    JsBarcode: ['https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js'],
    pdfLib: ['https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js'],
    JSZip: ['https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'],
    XLSX: ['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'],
    marked: ['https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js'],
    Chart: ['https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js']
  };
  RT.CDN = CDN;

  /* ---------- 收藏 ---------- */
  var FAV_KEY = 'toolbox_fav_v2';
  RT.favs = function () {
    try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch (e) { return []; }
  };
  RT.toggleFav = function (id) {
    var f = RT.favs(), i = f.indexOf(id);
    if (i >= 0) { f.splice(i, 1); RT.toast('已取消收藏'); }
    else { f.push(id); RT.toast('已收藏'); }
    localStorage.setItem(FAV_KEY, JSON.stringify(f));
    return f.indexOf(id) >= 0;
  };

  /* ---------- 字段渲染 ---------- */
  function fieldHTML(f) {
    var id = 'f_' + f.k, h = '';
    var req = f.req ? ' <span style="color:#9b1c1c">*</span>' : '';
    if (f.type === 'out') {
      return '<div class="pane-box"><div class="pane-hd"><h3>' + RT.esc(f.t || '结果') + '</h3>' +
        '<div class="act"><button class="btn btn-sec btn-sm" data-copy="' + f.k + '">复制</button>' +
        (f.dl ? '<button class="btn btn-sec btn-sm" data-dl="' + f.k + '">下载</button>' : '') +
        '</div></div><div class="pane-bd">' +
        '<div class="out-box' + (f.mono ? ' mono' : '') + '" id="' + id + '"><span class="out-empty">' + RT.esc(f.ph || '结果会显示在这里') + '</span></div>' +
        (f.metrics ? '<div class="metrics" id="m_' + f.k + '" style="display:none"></div>' : '') +
        '</div></div>';
    }
    if (f.type === 'outhtml') {
      return '<div class="pane-box"><div class="pane-hd"><h3>' + RT.esc(f.t || '预览') + '</h3></div>' +
        '<div class="pane-bd"><div class="out-html" id="' + id + '"><span class="out-empty">—</span></div></div></div>';
    }
    if (f.type === 'outimg') {
      return '<div class="pane-box"><div class="pane-hd"><h3>' + RT.esc(f.t || '预览') + '</h3>' +
        '<div class="act"><button class="btn btn-sec btn-sm" data-saveimg="' + f.k + '" style="display:none">保存图片</button></div></div>' +
        '<div class="pane-bd"><div class="cv-wrap" id="' + id + '"><span class="out-empty">—</span></div></div></div>';
    }
    if (f.type === 'outfile') {
      return '<div class="pane-box"><div class="pane-hd"><h3>' + RT.esc(f.t || '输出文件') + '</h3></div>' +
        '<div class="pane-bd"><div class="res" id="' + id + '"><span class="out-empty">—</span></div></div></div>';
    }
    if (f.type === 'custom') {
      return '<div class="pane-box"><div class="pane-hd"><h3>' + RT.esc(f.t || '') + '</h3><div class="act" id="act_' + f.k + '"></div></div>' +
        '<div class="pane-bd" id="' + id + '">' + (f.html || '') + '</div></div>';
    }

    h += '<div class="f"' + (f.wide ? ' style="grid-column:1/-1"' : '') + '>';
    if (f.type !== 'checkbox' && f.t) {
      h += '<label class="f-l" for="' + id + '">' + RT.esc(f.t) + (f.hint ? '<span class="hint">' + RT.esc(f.hint) + '</span>' : '') + req + '</label>';
    }
    var ph = f.ph ? ' placeholder="' + RT.esc(f.ph) + '"' : '';
    if (f.type === 'textarea') {
      h += '<textarea class="ta' + (f.mono ? ' mono' : '') + '" id="' + id + '"' + ph +
        (f.rows ? ' rows="' + f.rows + '"' : '') + '>' + RT.esc(f.v || '') + '</textarea>';
    } else if (f.type === 'number') {
      h += '<input class="ipt" type="number" id="' + id + '" value="' + RT.esc(f.v == null ? '' : f.v) + '"' + ph +
        (f.step ? ' step="' + f.step + '"' : '') + (f.min != null ? ' min="' + f.min + '"' : '') + (f.max != null ? ' max="' + f.max + '"' : '') + '>';
    } else if (f.type === 'select') {
      h += '<select class="sel" id="' + id + '">' + f.opts.map(function (o) {
        var val = typeof o === 'string' ? o : o.v, lb = typeof o === 'string' ? o : o.t;
        return '<option value="' + RT.esc(val) + '"' + (String(f.v) === String(val) ? ' selected' : '') + '>' + RT.esc(lb) + '</option>';
      }).join('') + '</select>';
    } else if (f.type === 'seg') {
      h += '<div class="seg" id="' + id + '" data-seg="1">' + f.opts.map(function (o) {
        var val = typeof o === 'string' ? o : o.v, lb = typeof o === 'string' ? o : o.t;
        return '<button type="button" data-v="' + RT.esc(val) + '"' + (String(f.v) === String(val) ? ' class="on"' : '') + '>' + RT.esc(lb) + '</button>';
      }).join('') + '</div>';
    } else if (f.type === 'checkbox') {
      h += '<label class="chk"><input type="checkbox" id="' + id + '"' + (f.v ? ' checked' : '') + '> ' + RT.esc(f.t) + '</label>';
    } else if (f.type === 'color') {
      h += '<input class="ipt" type="color" id="' + id + '" value="' + (f.v || '#1a6b55') + '">';
    } else if (f.type === 'range') {
      h += '<div class="rng-row"><input type="range" id="' + id + '" min="' + (f.min || 0) + '" max="' + (f.max || 100) +
        '" step="' + (f.step || 1) + '" value="' + (f.v == null ? (f.min || 0) : f.v) + '">' +
        '<span class="rng-val" id="v_' + f.k + '">' + (f.v == null ? (f.min || 0) : f.v) + (f.unit || '') + '</span></div>';
    } else if (f.type === 'file') {
      h += '<div class="drop" id="' + id + '"><div class="dt">' + RT.esc(f.dt || '点击选择或拖入文件') + '</div>' +
        '<div class="ds">' + RT.esc(f.ds || '') + '</div>' +
        '<input type="file" id="i_' + f.k + '" style="display:none"' + (f.multi ? ' multiple' : '') + (f.accept ? ' accept="' + f.accept + '"' : '') + '>' +
        '</div><div class="file-list" id="l_' + f.k + '"></div>';
    } else {
      h += '<input class="ipt" type="' + (f.type || 'text') + '" id="' + id + '" value="' + RT.esc(f.v == null ? '' : f.v) + '"' + ph + '>';
    }
    if (f.note) h += '<div style="font-size:12px;color:var(--ink-4);margin-top:4px">' + f.note + '</div>';
    h += '</div>';
    return h;
  }

  /* ---------- 收集值 ---------- */
  function collect(fields) {
    var v = {};
    fields.forEach(function (f) {
      var el = document.getElementById('f_' + f.k);
      if (!el) return;
      if (f.type === 'seg') { var on = el.querySelector('.on'); v[f.k] = on ? on.dataset.v : f.opts[0]; }
      else if (f.type === 'checkbox') v[f.k] = el.checked;
      else if (f.type === 'number') v[f.k] = el.value === '' ? '' : parseFloat(el.value);
      else if (f.type === 'file') v[f.k] = el._files || (f.multi ? [] : null);
      else v[f.k] = el.value;
    });
    return v;
  }

  /* ---------- 输出渲染 ---------- */
  function render(res, fields) {
    if (!res) return;
    fields.forEach(function (f) {
      var el = document.getElementById('f_' + f.k);
      if (!el) return;
      if (f.type === 'out') {
        var val = res[f.k];
        if (val == null || val === '') { el.innerHTML = '<span class="out-empty">' + RT.esc(f.ph || '结果会显示在这里') + '</span>'; }
        else el.textContent = String(val);
        if (f.metrics && res.metrics) {
          var m = document.getElementById('m_' + f.k);
          if (m) {
            if (res.metrics.length) {
              m.style.display = 'flex';
              m.innerHTML = res.metrics.map(function (x) {
                return '<div class="metric"><b>' + RT.esc(x.v) + '</b><span>' + RT.esc(x.t) + '</span></div>';
              }).join('');
            } else m.style.display = 'none';
          }
        }
      } else if (f.type === 'outhtml') {
        el.innerHTML = res[f.k] == null ? '<span class="out-empty">—</span>' : res[f.k];
      } else if (f.type === 'outimg') {
        var c = res[f.k];
        var btn = document.querySelector('[data-saveimg="' + f.k + '"]');
        if (c && c.tagName === 'CANVAS') {
          el.innerHTML = ''; el.appendChild(c);
          if (btn) {
            btn.style.display = '';
            btn.onclick = function () { RT.dlCanvas(c, (document.title || 'image') + '.png'); };
          }
        } else { el.innerHTML = '<span class="out-empty">—</span>'; if (btn) btn.style.display = 'none'; }
      } else if (f.type === 'outfile') {
        var files = res[f.k];
        if (!files || !files.length) { el.innerHTML = '<span class="out-empty">—</span>'; return; }
        el.innerHTML = files.map(function (fi, i) {
          return '<div class="res-item"><span class="rn">' + RT.esc(fi.name) + '</span>' +
            (fi.size ? '<span class="rs">' + RT.fmtSize(fi.size) + '</span>' : '') +
            '<button class="btn btn-sec btn-sm" data-g="' + i + '">下载</button></div>';
        }).join('');
        RT.$$('[data-g]', el).forEach(function (b) {
          b.onclick = function () {
            var fi = files[+b.dataset.g];
            if (fi.blob) RT.dl(fi.name, fi.blob); else if (fi.url) RT.dlDataURL(fi.name, fi.url);
          };
        });
      }
    });
    var nb = document.getElementById('noteBox');
    if (nb) {
      if (res.note) { nb.style.display = ''; nb.className = 'note' + (res.warn ? ' warn' : ''); nb.innerHTML = res.note; }
      else nb.style.display = 'none';
    }
  }

  /* ---------- 启动 ---------- */
  RT.boot = function (TOOL) {
    document.title = TOOL.name + ' - 超有用的工具箱';
    var host = document.getElementById('app');
    if (!host) return;

    var html = '';
    if (TOOL.custom) {
      html = TOOL.custom.html || '';
    } else {
      var ins = TOOL.fields.filter(function (f) { return !/^out/.test(f.type) && f.type !== 'custom'; });
      var outs = TOOL.fields.filter(function (f) { return /^out/.test(f.type) || f.type === 'custom'; });
      html = '<div class="panes">';
      html += '<div class="pane-box"><div class="pane-hd"><h3>输入</h3>' +
        '<div class="act">' + (TOOL.auto === false ? '<button class="btn btn-pri btn-sm" id="go">执行</button>' : '') +
        (TOOL.fields.some(function (f) { return f.type === 'file'; }) ? '' : '<button class="btn btn-sec btn-sm" id="clr">清空</button>') +
        '</div></div><div class="pane-bd">' + ins.map(fieldHTML).join('') + '</div></div>';
      html += outs.map(fieldHTML).join('');
      html += '</div>';
      html += '<div class="note" id="noteBox" style="display:none"></div>';
    }
    host.innerHTML = html;

    // 绑定 seg
    RT.$$('[data-seg]').forEach(function (g) {
      RT.$$('button', g).forEach(function (b) {
        b.onclick = function () {
          RT.$$('button', g).forEach(function (x) { x.classList.remove('on'); });
          b.classList.add('on');
          schedule();
        };
      });
    });
    // 绑定 range 显示
    TOOL.fields.forEach(function (f) {
      if (f.type === 'range') {
        var el = document.getElementById('f_' + f.k), lb = document.getElementById('v_' + f.k);
        if (el && lb) el.oninput = function () { lb.textContent = el.value + (f.unit || ''); };
      }
      if (f.type === 'file') {
        var zone = document.getElementById('f_' + f.k);
        var input = document.getElementById('i_' + f.k);
        var list = document.getElementById('l_' + f.k);
        RT.bindDrop(zone, input, function (files) {
          var arr = Array.isArray(files) ? files : [files];
          zone._files = Array.isArray(files) ? files : files;
          if (list) {
            list.innerHTML = arr.map(function (x, i) {
              return '<div class="file-item"><span class="fn">' + RT.esc(x.name) + '</span>' +
                '<span class="fs">' + RT.fmtSize(x.size) + '</span>' +
                '<button class="fx" data-rm="' + i + '">×</button></div>';
            }).join('');
            RT.$$('[data-rm]', list).forEach(function (b) {
              b.onclick = function (e) {
                e.stopPropagation();
                arr.splice(+b.dataset.rm, 1);
                zone._files = f.multi ? arr : arr[0];
                if (input) input.value = '';
                b.parentNode.remove();
                schedule();
              };
            });
          }
          schedule();
        }, !!f.multi);
      }
    });

    // 复制 / 下载
    RT.$$('[data-copy]').forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.copy, el = document.getElementById('f_' + k);
        var raw = el ? el.dataset.raw : null;
        RT.copy(raw != null ? raw : (el ? el.textContent : ''));
      };
    });
    RT.$$('[data-dl]').forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.dl, el = document.getElementById('f_' + k);
        var f = TOOL.fields.filter(function (x) { return x.k === k; })[0];
        RT.dlText((f && f.dlName) || (document.title + '.txt'), el ? el.textContent : '');
      };
    });

    function run() {
      var v = collect(TOOL.fields);
      var res;
      try {
        res = TOOL.run(v, RT);
      } catch (e) {
        render({ note: '出错了：' + (e && e.message ? e.message : e) , warn: true }, TOOL.fields.filter(function (f) { return /^out/.test(f.type); }));
        TOOL.fields.forEach(function (f) {
          if (/^out/.test(f.type)) {
            var el = document.getElementById('f_' + f.k);
            if (el && el.classList.contains('out-box')) el.innerHTML = '<span class="out-empty">处理失败</span>';
          }
        });
        return;
      }
      if (res && typeof res.then === 'function') {
        res.then(function (r) { render(r, TOOL.fields); })
          .catch(function (e) { RT.toast('处理失败：' + (e && e.message ? e.message : e)); });
      } else render(res, TOOL.fields);
    }

    var tm;
    function schedule() {
      if (TOOL.auto === false) return;
      clearTimeout(tm);
      tm = setTimeout(run, 90);
    }

    // 输入监听
    TOOL.fields.forEach(function (f) {
      if (/^out/.test(f.type) || f.type === 'custom') return;
      var el = document.getElementById('f_' + f.k);
      if (!el) return;
      if (f.type === 'file') return;
      el.addEventListener('input', schedule);
      el.addEventListener('change', schedule);
    });

    var go = document.getElementById('go');
    if (go) go.onclick = run;
    var clr = document.getElementById('clr');
    if (clr) clr.onclick = function () {
      TOOL.fields.forEach(function (f) {
        if (/^out/.test(f.type)) return;
        var el = document.getElementById('f_' + f.k);
        if (!el) return;
        if (f.type === 'checkbox') el.checked = false;
        else if (f.type === 'file') return;
        else if (f.type === 'seg') { RT.$$('button', el).forEach(function (b, i) { b.classList.toggle('on', i === 0); }); }
        else el.value = f.v == null ? '' : f.v;
      });
      run();
    };

    if (TOOL.init) TOOL.init(RT, document.getElementById('app'));
    if (TOOL.auto !== false) run();
    else if (TOOL.first !== false) run();
  };

  window.RT = RT;
})();
