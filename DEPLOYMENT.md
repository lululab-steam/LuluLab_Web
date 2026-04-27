# GitHub Pages 部署指南

## 📝 預準備

確保您已經：
1. 安裝了 Git
2. 擁有 GitHub 帳號
3. 本地測試過網站（使用本地服務器）

## 🚀 部署步驟

### 步驟 1：創建 GitHub 倉庫

#### 選項 A：創建新倉庫（推薦）

1. 登錄 GitHub（https://github.com）
2. 點擊右上角的 **+** 圖標，選擇 **New repository**
3. 填寫倉庫信息：
   - **Repository name**：`LuluLabWeb`
   - **Description**：LuluLab - 科技教育實驗室官網
   - **Public**：選中公開
   - 其他選項保持默認
4. 點擊 **Create repository**

#### 選項 B：使用 GitHub Pages 專用倉庫（高級）

如果想讓網站在 `https://yourusername.github.io` 上：
- **Repository name**：`yourusername.github.io`（替換為您的用戶名）
- 其他步驟相同

### 步驟 2：初始化 Git 倉庫

打開終端/命令提示符，進入項目文件夾：

```bash
cd /path/to/LuluLabGithubWeb

# 初始化 Git 倉庫
git init

# 添加所有文件
git add .

# 創建第一個提交
git commit -m "Initial commit: LuluLab website"

# 添加遠程倉庫
git remote add origin https://github.com/yourusername/LuluLabWeb.git

# 推送到 GitHub（main 分支）
git branch -M main
git push -u origin main
```

**注意**：把 `yourusername` 替換為您的 GitHub 用戶名。

### 步驟 3：啟用 GitHub Pages

1. 在 GitHub 上進入您的倉庫
2. 點擊 **Settings**（設置）
3. 在左側菜單找到 **Pages**
4. 在 "Source" 部分：
   - **Branch**：選擇 `main`
   - **Folder**：選擇 `/ (root)`
5. 點擊 **Save**

系統會顯示您的網站 URL：
- 如果倉庫是 `LuluLabWeb`：`https://yourusername.github.io/LuluLabWeb`
- 如果倉庫是 `yourusername.github.io`：`https://yourusername.github.io`

### 步驟 4：驗證部署

1. 等待 1-2 分鐘讓 GitHub Pages 編譯
2. 訪問上面提供的 URL
3. 如果看到您的網站，恭喜部署成功！🎉

## 🔄 後續更新

每次修改代碼後，推送到 GitHub：

```bash
# 添加所有修改
git add .

# 提交修改
git commit -m "修改描述，例如：Update course content"

# 推送到 GitHub
git push
```

GitHub Pages 會自動部署最新版本（通常 1-2 分鐘）。

## 🐛 常見問題

### Q1：網站顯示 404 錯誤

**原因**：GitHub Pages 可能還在構建中
**解決**：
1. 刷新頁面
2. 等待 2-3 分鐘
3. 檢查 Repository Settings 中的 Pages 設置

### Q2：樣式或腳本沒有載入

**原因**：路徑不正確
**解決**：檢查 `index.html` 中的文件路徑：
```html
<!-- 正確 -->
<link rel="stylesheet" href="css/style.css">
<script src="js/script.js"></script>

<!-- 錯誤 -->
<link rel="stylesheet" href="/css/style.css">  <!-- 不要用絕對路徑 -->
```

### Q3：自定義域名

如果您有自己的域名，可以在 Pages 設置中添加：
1. 進入 **Settings** → **Pages**
2. 在 "Custom domain" 輸入您的域名
3. 按照 GitHub 提示配置 DNS 記錄

### Q4：HTTPS 不工作

GitHub Pages 自動提供 HTTPS：
1. 確保在 Pages 設置中勾選 "Enforce HTTPS"
2. 等待證書部署（通常 5-10 分鐘）

## 📚 有用的命令

```bash
# 查看 Git 狀態
git status

# 查看 commit 歷史
git log

# 撤銷最後一次提交（未推送）
git reset --soft HEAD~1

# 強制推送（使用謹慎！）
git push -f origin main

# 克隆倉庫
git clone https://github.com/yourusername/LuluLabWeb.git
```

## 🎯 下一步

部署成功後，可以：

1. **優化 SEO**
   - 添加 `<meta>` 標籤
   - 提交 sitemap 到 Google Search Console

2. **添加分析**
   - 使用 Google Analytics
   - 追蹤網站訪問量

3. **增加功能**
   - 添加聯繫表單（使用第三方服務）
   - 集成預約系統
   - 添加部落格

4. **推廣**
   - 分享到社交媒體
   - 提交到目錄站點
   - SEO 優化

## 📞 需要幫助？

- 查看 [GitHub Pages 官方文檔](https://docs.github.com/en/pages)
- 查看 [Git 文檔](https://git-scm.com/doc)

---

**祝您部署順利！** 🚀
