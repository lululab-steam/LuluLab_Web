 # LuluLab | 點燃你的科技火花

 LuluLab 是由香港科技大學（HKUST）學生創立的 STEAM 教育實驗室，透過專案導向的動手實作，帶領學生從零開始打造真正的科技作品。

 網站展示課程體系、硬體/軟體專案以及教學資源，並提供聯絡預約功能。

 ---

 ## 特色

 - **粒子動畫開場** — 首次載入時，粒子隨機散佈畫布，匯聚形成 "think it. build it. break it. fix it."，再向外消散後重組成 LuluLab 標誌，之後可隨滾輪在不同文字間流暢過渡
 - **三層課程體系** — Spark 火花（入門工作坊）、Root 根基（系統學習）、Forge 鍛造（駭客松實戰）
 - **硬體 + 軟體全覆蓋** — 從 Arduino/ESP32 物聯網、TinyML、電腦視覺到 Agentic AI
 - **無限滾動文字列** — 品牌口號 "Dreamit Buildit Breakit Fixit" 以五列交錯方向循環滾動
 - **全響應式設計** — 桌面／平板／手機完整適配

 ---

 ## 技術棧

 | 層級 | 技術 |
 |---|---|
 | **結構** | HTML5（語意化標籤） |
 | **樣式** | CSS3（自訂屬性、Grid、Flexbox） |
 | **動畫** | Canvas API + requestAnimationFrame（粒子系統）、GSAP（無限滾動） |
 | **圖示** | Font Awesome 6.4 |
 | **字型** | PingFang TC, Microsoft JhengHei |
 | **部署** | 靜態 HTML，相容 GitHub Pages / Netlify / Vercel |

 ---

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

 ---

 ## 快速開始

 ### 本地開發

 此專案為純靜態網站，不需建置流程，只需一個靜態伺服器：

 ```bash
# Python 3
python -m http.server 8000

# 或 Node.js
npx http-server
```

 開啟瀏覽器前往 `http://localhost:8000`。

 ### 部署

 支援 GitHub Pages、Netlify、Vercel 等平台，指向根目錄即可。

 ```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-org/LuluLabWeb.git
git push -u origin main
```

 在 GitHub 倉庫 Settings → Pages 設定 `main` 分支 `/ (root)` 即可上線。

 ---

 ## 自訂指南

 ### 修改主色調

 編輯 `css/style.css` 中的 CSS 變數：

 ```css
:root {
    --primary-orange: #FF7F24;   /* 品牌主色 */
    --dark-bg: rgba(3, 3, 3, 0.8);   /* 深色背景 */
}
```

 ### 調整粒子動畫參數

 編輯 `js/script.js` 中的 `config` 物件：

 ```javascript
const config = {
    fontSize: 160,        // 文字大小
    gap: 6,               // 取樣間距（越小越精細）
    particleSize: 2.2,    // 粒子半徑
    mouseRadius: 100,     // 滑鼠影響範圍（px）
    ease: 0.08            // 回彈速度
};
```

 開場動畫時長與階段比例可在檔案頂部的 `INTRO_DURATION` 和 `updatePhysics()` 中的 phase 邊界調整。

 ### 修改課程／專案內容

 直接編輯 `index.html` 中對應的 `<section>`：
 - 課程卡片 → `#curriculum`
 - 專案清單 → `#projects`
 - 教學資源 → `#resources`

 ---

 ## 頁面結構

 | Section | ID | 說明 |
 |---|---|---|
 | 首頁 | `#home` | 粒子動畫與向下滾動提示 |
 | 關於 | `#about` | 品牌故事與理念 |
 | 課程 | `#curriculum` | Spark / Root / Forge 三模組 |
 | 專案 | `#projects` | 硬體與軟體/AI 類專案 |
 | 資源 | `#resources` | 教材、影片、程式碼庫等 |
 | 聯絡 | `#contact` | CTA 按鈕導向預約頁 |

 粒子系統會根據各區塊標題的實際 DOM 位置自動計算顯示位置，不需手動設定 Y 軸偏移。

 ---

 ## 貢獻

 歡迎提交 Issue 或 Pull Request。目前無自動化測試，請手動在 Chrome／Safari／Firefox 最新版驗證。

 ---

 ## 授權

 MIT License

 ---
