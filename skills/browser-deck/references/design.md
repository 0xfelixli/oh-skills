# Design System

browser-deck 继承 kami 设计 token：暖羊皮背景、ink-blue 强调色、衬线字体层级。

---

## 颜色

```css
:root {
  --bg:          #e8e4da;   /* 页面背景（暖沙） */
  --parchment:   #f5f4ed;   /* 幻灯片卡片背景 */
  --ivory:       #faf9f5;   /* 卡片 / 浮起容器 */
  --brand:       #1B365D;   /* 强调色，覆盖面积 ≤ 5% */
  --near-black:  #141413;
  --dark-warm:   #3d3d3a;
  --olive:       #504e49;
  --stone:       #6b6a64;
  --border:      #e8e6dc;
  --border-soft: #e5e3d8;
}
```

---

## CSS 双模式架构

### 文档模式（默认）

```css
html, body { background: var(--bg); }

#toolbar {
  position: sticky; top: 0; z-index: 600;
  background: rgba(232,228,218,0.92); backdrop-filter: blur(8px);
  border-bottom: 1px solid #d4cfc3;
  display: flex; align-items: center; gap: 12px;
  padding: 0 28px; height: 46px;
}

.deck {
  max-width: 1100px; margin: 0 auto;
  padding: 28px 28px 0;
  display: flex; flex-direction: column; gap: 22px;
}

.slide {
  background: var(--parchment);
  aspect-ratio: 16 / 9;
  padding: 3.8% 5.5% 5%;
  border-radius: 8px; border: 1px solid #d4cfc3;
  box-shadow: 0 2px 6px rgba(0,0,0,0.07), 0 6px 20px rgba(0,0,0,0.06);
  container-type: inline-size;
  overflow: hidden; position: relative;
  display: flex; flex-direction: column;
}
```

### 放映模式（body.pres）

```css
body.pres { overflow: hidden; }
body.pres #toolbar { display: none; }
body.pres .deck { max-width: none; padding: 0; gap: 0; }
body.pres .slide {
  display: none;
  position: fixed; top: 0; left: 0;
  width: 100vw; height: 100vh;
  border-radius: 0; border: none; box-shadow: none; aspect-ratio: auto;
  padding: 5.5vh 7vw 9vh;
}
body.pres .slide.active { display: flex; animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
```

---

## 字体缩放：`cqw` 不用 `vw`

`cqw` 相对容器（slide 卡片）宽度缩放，两种模式都正确。`vw` 在文档模式下会过大。
每个 `.slide` 必须有 `container-type: inline-size`。

```css
h1    { font-size: clamp(21pt, 4.4cqw,  44pt); }
h2    { font-size: clamp(15pt, 2.55cqw, 26pt); }
h3    { font-size: clamp(10pt, 1.38cqw, 14pt); }
.lead { font-size: clamp(10.5pt, 1.44cqw, 14pt); }
.fi   { font-size: clamp(9pt,   1.15cqw, 11pt); }
.pg   { font-size: clamp(7pt,   0.92cqw, 9.5pt); }
```

Safari 15 及以下不支持 `cqw`，会降级到 `clamp` 最小值（仍可读）。

---

## Hover 播放按钮

```css
.slide-play {
  position: absolute; bottom: 3.5%; right: 5%;
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(27,54,93,0.82); color: white; border: none;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.18s; z-index: 10;
}
.slide:hover .slide-play { opacity: 1; }
.slide:hover .pg { opacity: 0; }   /* 页码让位给播放按钮 */
```

---

## JavaScript

```js
function startPres() {
  document.body.classList.add('pres');
  slides[cur].classList.add('active');
  updateUI();
  // 不在 startPres 里强制全屏；用户通过 #btn-fs 或 F 键自行触发
}

function exitPres() {
  if (document.fullscreenElement) document.exitFullscreen();
  document.body.classList.remove('pres');
  slides[cur].classList.remove('active');
  slides[cur].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function presFromSlide(btn) {
  cur = slides.indexOf(btn.closest('.slide'));
  startPres();
}

// 全屏 toggle（#btn-fs 和 F 键共用）
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

// 同步全屏按钮图标
const FS_EXPAND   = '<polyline points="5,1 1,1 1,5"/>...'; // 4 个角展开箭头
const FS_COMPRESS = '<polyline points="1,5 5,5 5,1"/>...'; // 4 个角收缩箭头
document.addEventListener('fullscreenchange', () => {
  document.getElementById('fs-icon').innerHTML =
    document.fullscreenElement ? FS_COMPRESS : FS_EXPAND;
});

// 点击翻页（放映模式），排除控件
document.addEventListener('click', e => {
  if (!document.body.classList.contains('pres')) return;
  if (e.target.closest('.nav') || e.target.closest('#btn-exit') ||
      e.target.closest('#btn-fs') || e.target.closest('.slide-play')) return;
  go(e.clientX >= window.innerWidth / 2 ? 1 : -1);
});
```

**键盘映射：** `→/↓/Space` 下一张 · `←/↑` 上一张 · `Esc` 退出 · `Home/End` 首/末张 · `F` 全屏切换

---

## 全屏按钮 CSS

`#btn-fs` 放在 `#btn-exit` 左侧，两者共享样式基础，仅 `right` 和尺寸不同：

```css
#btn-exit, #btn-fs {
  position:fixed; top:10px; z-index:900;
  background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.85);
  border:1px solid rgba(255,255,255,0.2); border-radius:5px;
  cursor:pointer; display:none; align-items:center; justify-content:center;
  backdrop-filter:blur(4px); transition:background 0.15s;
}
#btn-exit:hover, #btn-fs:hover { background:rgba(255,255,255,0.18); }
#btn-exit { right:16px; padding:7px 14px; font-size:12px; font-family:var(--serif); gap:5px; }
#btn-fs   { right:110px; width:34px; height:34px; }
body.pres #btn-exit { display:flex; }
body.pres #btn-fs   { display:flex; }
```

图标用两组 `<polyline>` SVG：展开（4 角向外）和压缩（4 角向内），通过 `fullscreenchange` 事件切换 `innerHTML`。

---

## 待实现功能

| 功能 | 说明 |
|---|---|
| 缩略图预览（G 键） | grid 叠层，点击跳页，适合 > 12 张 |
| `cqw` 旧浏览器降级 | `@supports (font-size:1cqw)` 覆盖 |
