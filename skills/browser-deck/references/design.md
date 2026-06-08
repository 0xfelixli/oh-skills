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
  --slide-pad-bottom: 6.8%;
  --slide-pres-pad-bottom: 11vh;
  --control-bottom: 5%;
  --meta-bottom: 6%;
  --meta-right-safe: 12%;
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
  padding: 3.8% 5.5% var(--slide-pad-bottom);
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
  padding: 5.5vh 7vw var(--slide-pres-pad-bottom);
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
.lead { font-size: clamp(12pt, 1.7cqw, 17pt); }
.fi   { font-size: clamp(11pt, 1.4cqw, 14pt); }
.pg   { font-size: clamp(7pt,   0.92cqw, 9.5pt); }
```

Safari 15 及以下不支持 `cqw`，会降级到 `clamp` 最小值（仍可读）。

---

## Hover 播放按钮

```css
.slide-play {
  position: absolute; bottom: var(--control-bottom); right: 5%;
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(27,54,93,0.82); color: white; border: none;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none; transition: opacity 0.18s; z-index: 10;
}
.slide:hover .slide-play { opacity: 1; pointer-events: auto; }
.slide:hover .pg { opacity: 0; }   /* 页码让位给播放按钮 */
```

底部安全区：`.pg` 和 `.slide-play` 固定在右下角，封面/结尾页的 `.c-meta` 不要铺满到同一个角落。使用 `--control-bottom`、`--meta-bottom`、`--meta-right-safe` 统一控制底部留白，给页码和播放按钮留出独立区域。

---

## JavaScript

```js
function startPres() {
  document.body.classList.add('pres');
  slides[cur].classList.add('active');
  updateUI();
  // 不在 startPres 里强制全屏；用户通过 F 键自行触发
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

// 全屏 toggle（保留给 F 键）
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

function updateUI() {
  navP.disabled = cur === 0;
  navN.disabled = cur === total - 1;
  prog.style.width = ((cur + 1) / total * 100) + '%';
  const cover = slides[cur].classList.contains('s-cover');
  prog.style.background = cover ? 'rgba(255,255,255,0.35)' : 'var(--brand)';
  const btnExit = document.getElementById('btn-exit');
  if (cover) {
    btnExit.style.background = 'rgba(255,255,255,0.1)';
    btnExit.style.color = 'rgba(255,255,255,0.82)';
    btnExit.style.borderColor = 'rgba(255,255,255,0.2)';
  } else {
    btnExit.style.background = 'rgba(0,0,0,0.08)';
    btnExit.style.color = 'rgba(60,58,52,0.7)';
    btnExit.style.borderColor = 'rgba(0,0,0,0.12)';
  }
}

// 点击翻页（放映模式），排除控件
document.addEventListener('click', e => {
  if (!document.body.classList.contains('pres')) return;
  if (e.target.closest('.nav') || e.target.closest('#btn-exit') ||
      e.target.closest('.slide-play')) return;
  go(e.clientX >= window.innerWidth / 2 ? 1 : -1);
});
```

**键盘映射：** `→/↓/Space` 下一张 · `←/↑` 上一张 · `Esc` 退出 · `Home/End` 首/末张 · `F` 全屏切换

---

## 放映退出按钮 CSS

放映模式只显示右上角退出图标按钮；全屏切换不提供可见按钮，仅保留 `F` 快捷键。
退出按钮颜色由 `updateUI()` 按封面/内容页动态调整：

```css
#btn-exit {
  position:fixed; top:12px; z-index:900;
  background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.82);
  border:1px solid rgba(255,255,255,0.2); border-radius:5px;
  cursor:pointer; display:none; align-items:center; justify-content:center;
  backdrop-filter:blur(4px); transition:background 0.15s;
}
#btn-exit:hover { background:rgba(255,255,255,0.2); }
#btn-exit { right:16px; width:34px; height:34px; padding:0; }
body.pres #btn-exit { display:flex; }
```

纯图标按钮必须带 `title` 和 `aria-label`：

```html
<button id="btn-exit" onclick="exitPres()" title="退出放映" aria-label="退出放映">...</button>
<button class="nav" id="nav-p" onclick="go(-1)" title="上一张" aria-label="上一张">&#8592;</button>
<button class="nav" id="nav-n" onclick="go(1)" title="下一张" aria-label="下一张">&#8594;</button>
<button class="slide-play" onclick="presFromSlide(this)" title="从本页开始放映" aria-label="从本页开始放映">...</button>
```

---

## 待实现功能

| 功能 | 说明 |
|---|---|
| 缩略图预览（G 键） | grid 叠层，点击跳页，适合 > 12 张 |
| `cqw` 旧浏览器降级 | `@supports (font-size:1cqw)` 覆盖 |
