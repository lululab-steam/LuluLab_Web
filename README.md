# LuluLab | 點燃你的科技火花

LuluLab 是由香港科技大學（HKUST）學生創立的 STEAM 教育實驗室，透過專案導向的動手實作，帶領學生從零開始打造真正的科技作品。

網站展示課程體系、硬體/軟體專案以及教學資源，並提供聯絡預約功能。

## 特色

- **粒子動畫開場** — 首次載入時，粒子隨機散佈畫布，從左到右依序飛向中心，匯聚成四行 "think it. / build it. / break it. / fix it."，停留後向外爆散淡出，再重組成 LuluLab 標誌。之後可隨滾輪在不同文字間流暢過渡
- **三層課程體系** — Spark 火花、Root 根基、Forge 鍛造
- **硬體 + 軟體全覆蓋** — 從 Arduino/ESP32 物聯網、TinyML、電腦視覺到 Agentic AI
- **全響應式設計** — 桌面／平板／手機完整適配
- **無限滾動文字列** — 品牌口號 "Dreamit Buildit Breakit Fixit" 以五列交錯方向循環滾動

## 技術棧

| 層級 | 技術 |
|---|---|
| 結構 | HTML5（語意化標籤） |
| 樣式 | CSS3（自訂屬性、Grid、Flexbox） |
| 動畫 | Canvas API + requestAnimationFrame（粒子系統）、GSAP（無限滾動） |
| 圖示 | Font Awesome 6.4 |
| 字型 | PingFang TC, Microsoft JhengHei |
| 部署 | 靜態 HTML，相容 GitHub Pages / Netlify / Vercel |

## 專案結構

```
LuluLabWeb/
├── index.html            # 入口頁面
├── AGENTS.md             # AI 開發者指引
├── README.md             # 本文件
├── css/
│   └── style.css         # 樣式定義（含響應式斷點）
├── js/
│   └── script.js         # 粒子系統與無限滾動邏輯
├── pages/
│   └── booking.html      # 聯絡預約頁
└── images/
    └── .gitkeep
```

## 快速開始

此專案為純靜態網站，不需建置流程，只需一個靜態伺服器：

```bash
python -m http.server 8000
# 或
npx http-server
```

開啟瀏覽器前往 `http://localhost:8000`。支援 GitHub Pages、Netlify、Vercel 等靜態托管平台。

## 自訂指南

### 修改主色調

編輯 `css/style.css` 中的 CSS 變數：

```css
:root {
    --primary-orange: #FF7F24;
    --dark-bg: rgba(3, 3, 3, 0.8);
}
```

### 調整粒子動畫參數

編輯 `js/script.js` 中的 `config` 物件：

```javascript
const config = {
    fontSize: 160,
    gap: 6,
    particleSize: 2.2,
    mouseRadius: 100,
    ease: 0.08
};
```

開場動畫時長與階段比例在 `INTRO_DURATION` 與 `updatePhysics()` 的 phase 邊界常數中調整。

## 頁面結構

| Section | ID | 說明 |
|---|---|---|
| 首頁 | #home | 粒子動畫與向下滾動提示 |
| 關於 | #about | 品牌故事與理念 |
| 課程 | #curriculum | Spark / Root / Forge 三模組 |
| 專案 | #projects | 硬體與軟體/AI 類專案 |
| 資源 | #resources | 教材、影片、程式碼庫等 |
| 聯絡 | #contact | CTA 按鈕導向預約頁 |

粒子系統會根據各區塊標題的實際 DOM 位置自動計算顯示位置。

## 授權

MIT License

*由 HKUST 學生團隊創立。*
