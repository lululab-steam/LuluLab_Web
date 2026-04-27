# LuluLab - 科技教育實驗室

> 點燃你的科技火花 🔥

一個專注於推廣前沿科技教育的實驗室，透過動手實作（Hands-on）來理解世界的工具。

## 🌟 特色

- **粒子動畫效果** - 創新的互動式粒子文字轉換
- **響應式設計** - 完美適配所有設備（桌面、平板、手機）
- **模組化課程** - 三大課程體系：火花、根基、鍛造
- **硬體 + 軟體** - 涵蓋 Arduino、機器人、AI 等全方位教學

## 📋 項目結構

```
LuluLabGithubWeb/
├── index.html          # 首頁（主入口）
├── css/
│   └── style.css       # 所有樣式
├── js/
│   └── script.js       # 粒子動畫邏輯
├── images/             # 圖片素材（待補充）
├── .gitignore          # Git 忽略規則
└── README.md           # 本檔案
```

## 🚀 快速開始

### 本地開發

1. **克隆或下載此項目**
   ```bash
   git clone https://github.com/yourusername/LuluLabWeb.git
   cd LuluLabWeb
   ```

2. **開啟本地服務器**
   
   **方法 1：使用 Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **方法 2：使用 Node.js**
   ```bash
   npx http-server
   ```
   
   **方法 3：使用 VS Code Live Server**
   - 安裝 "Live Server" 擴展
   - 右鍵點擊 index.html，選擇 "Open with Live Server"

3. **訪問網站**
   - 打開瀏覽器，進入 `http://localhost:8000`

### GitHub Pages 部署

1. **創建 GitHub 倉庫**
   - 在 GitHub 上創建新的公開倉庫
   - 命名建議：`LuluLabWeb` 或 `username.github.io`

2. **上傳代碼**
   ```bash
   git add .
   git commit -m "Initial commit: LuluLab website"
   git push origin main
   ```

3. **啟用 GitHub Pages**
   - 進入倉庫的 **Settings**
   - 左側找到 **Pages**
   - 在 "Source" 選擇 `main` 分支
   - 點擊 **Save**

4. **訪問線上網站**
   - 網址：`https://yourusername.github.io/LuluLabWeb`
   - 或 `https://yourusername.github.io`（如果使用 username.github.io）

## 🎨 技術棧

- **前端框架**：Vanilla JavaScript（無依賴）
- **樣式**：CSS3（自定義屬性、Grid、Flexbox）
- **動畫**：Canvas API + requestAnimationFrame
- **圖標**：Font Awesome 6.4.0
- **字體**：PingFang TC, Microsoft JhengHei

## 📱 響應式支持

- ✅ 桌面版（1200px+）
- ✅ 平板版（768px - 1200px）
- ✅ 手機版（480px - 768px）
- ✅ 超小屏（< 480px）

## ✨ 核心功能

### 粒子動畫

網站首頁使用 Canvas 技術實現粒子文字變形動畫：
- **階段 1**：顯示 "LuluLab" 文字
- **階段 2**：滾動時粒子散開
- **階段 3**：粒子聚集成 "ABOUT" 文字

### 互動效果

- 平滑滾動過渡
- 卡片懸停動畫
- 按鈕點擊反饋

## 🔧 自定義指南

### 修改配色

編輯 `css/style.css` 中的 CSS 變數：

```css
:root {
    --primary-orange: #FF7F24;  /* 主色（橙色） */
    --dark-bg: #1a1a1a;         /* 背景色（深灰） */
    --light-text: #ffffff;      /* 文字色（白色） */
    --card-bg: #2a2a2a;         /* 卡片背景 */
}
```

### 修改文字

1. **課程卡片**：編輯 `index.html` 中 `#curriculum` 區塊
2. **項目列表**：編輯 `index.html` 中 `#projects` 區塊
3. **簡介文本**：編輯 `index.html` 中 `#intro` 和 `#about` 區塊

### 修改粒子動畫參數

編輯 `js/script.js` 中的 `config` 對象：

```javascript
const config = {
    fontSize: 180,      // 文字大小
    fontName: 'Arial Black', // 字體名稱
    gap: 6,             // 採樣間距（越小越精細）
    particleSize: 2.5   // 粒子大小
};
```

## 📞 聯繫方式

- **郵箱**：contact@lululab.hk
- **地點**：香港科技大學
- **社交媒體**：Instagram, WeChat 等

## 📄 許可證

MIT License - 自由使用和修改

## 🙏 致謝

- 由 HKUST 計算機科學、電子工程、數學系及商科學生共同創立
- 感謝所有支持 STEAM 教育的朋友們

---

**最後更新**：2025 年 4 月
**版本**：1.0.0

> 科技是為了點燃每個人內心的火花 🔥
