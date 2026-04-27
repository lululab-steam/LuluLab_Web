// ==================== 初始化配置 ====================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let particles = [];
let allTextPoints = {};

const config = {
    fontSize: window.innerWidth < 768 ? 80 : 160, // 根據螢幕調整字體大小
    fontName: 'Arial Black',
    gap: 6,
    particleSize: 2.2,
    mouseRadius: 100, // 滑鼠影響範圍
    mouseStrength: 0.5, // 推開力度
    ease: 0.08 // 回彈速度
};

const mouse = { x: -999, y: -999 };

const textSequence = [
    // y: canvas.height * 0.4 表示放在畫面從上面算起 40% 的位置
    { text: 'LuluLab', sectionId: 'home', size: 250, y: 0.55 }, 
    { text: 'ABOUT', sectionId: 'about', size: 120, y: 0.4 },
    { text: 'MODULES', sectionId: 'curriculum', size: 120, y: 0.27 },
    { text: 'PROJECTS', sectionId: 'projects', size: 120, y: 0.31 },
    { text: 'RESOURCES', sectionId: 'resources', size: 120, y: 0.2 },
    { text: 'CONTACT US', sectionId: 'contact', size: 120, y: 0.38 }
];

// ==================== 初始化 ====================
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    textSequence.forEach(item => {
        // 根據 item.y 設定垂直位置，如果沒設定就預設置中 (0.5)
        const targetX = canvas.width / 2;
        const targetY = canvas.height * (item.y || 0.5);
        
        allTextPoints[item.text] = getPoints(
            item.text, 
            targetX, 
            targetY, 
            item.size
        );
    });

    createParticles();
}

function getPoints(text, x, y, specificSize) {
    const tempCanvas = document.createElement('canvas');
    const tCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    const fontSize = specificSize || config.fontSize; // 如果有傳入特定大小就用它，否則用預設

    tCtx.fillStyle = 'white';
    tCtx.textAlign = 'center';
    tCtx.textBaseline = 'middle'; // 這會確保 y 座標是文字的中心點
    tCtx.font = `bold ${fontSize}px ${config.fontName}`;
    
    // 使用傳入的 x, y
    tCtx.fillText(text, x, y);

    const data = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
    const points = [];
    
    for (let i = 0; i < tempCanvas.height; i += config.gap) {
        for (let j = 0; j < tempCanvas.width; j += config.gap) {
            const index = (i * tempCanvas.width + j) * 4;
            if (data[index + 3] > 128) {
                points.push({ x: j, y: i });
            }
        }
    }
    return points;
}

function createParticles() {
    particles = [];
    const basePoints = allTextPoints['LuluLab'] || [];
    
    // 找出所有單字中點位最多的數量，避免切換時粒子消失
    let maxCount = 0;
    textSequence.forEach(item => {
        maxCount = Math.max(maxCount, allTextPoints[item.text].length);
    });

    for (let i = 0; i < maxCount; i++) {
        // 初始位置設定
        const p1 = basePoints[i % basePoints.length];
        
        const particle = {
            x: p1.x, // 當前實際 X
            y: p1.y, // 當前實際 Y
            baseX: p1.x, // 動態目標 X
            baseY: p1.y, // 動態目標 Y
            vx: 0,
            vy: 0,
            targets: {},
            randomFactor: Math.random() * 500 - 250
        };
        
        textSequence.forEach(item => {
            const pts = allTextPoints[item.text];
            const target = pts[i % pts.length];
            particle.targets[item.text] = { x: target.x, y: target.y };
        });
        
        particles.push(particle);
    }
}

// ==================== 核心邏輯 ====================

function updatePhysics() {
    const { currentText, nextText, progress } = getCurrentTextAndProgress();

    particles.forEach(p => {
        const t1 = p.targets[currentText];
        const t2 = p.targets[nextText];

        // 1. 根據滾動計算「預定目標位置」
        let scatter = Math.sin(progress * Math.PI) * p.randomFactor;
        const targetX = t1.x + (t2.x - t1.x) * progress + scatter;
        const targetY = t1.y + (t2.y - t1.y) * progress + scatter;

        // 2. 滑鼠互動邏輯
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        let forceX = 0;
        let forceY = 0;

        if (distance < config.mouseRadius) {
            // 推開力：距離越近力量越大
            const angle = Math.atan2(dy, dx);
            const push = (config.mouseRadius - distance) / config.mouseRadius;
            forceX = -Math.cos(angle) * push * 15; 
            forceY = -Math.sin(angle) * push * 15;
        }

        // 3. 磁吸回彈物理 (Spring physics)
        // 粒子總是想回到 targetX, targetY
        p.vx += (targetX - p.x) * config.ease + forceX;
        p.vy += (targetY - p.y) * config.ease + forceY;
        
        // 摩擦力，防止無限震盪
        p.vx *= 0.7;
        p.vy *= 0.7;

        p.x += p.vx;
        p.y += p.vy;
    });
}

function getCurrentTextAndProgress() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    
    // 修正：首頁滾動進度從 0 開始
    // 找出目前在第幾個 section
    let index = Math.floor(scrollY / vh);
    index = Math.max(0, Math.min(index, textSequence.length - 1));
    
    let progress = (scrollY % vh) / vh;
    
    // 讓進度在 section 中間才觸發大幅度散開
    // 調整 progress 讓切換更平滑
    const currentText = textSequence[index].text;
    const nextText = textSequence[Math.min(index + 1, textSequence.length - 1)].text;

    return { currentText, nextText, progress };
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景色過渡
    if (window.scrollY > window.innerHeight * 0.4) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }

    updatePhysics();

    ctx.fillStyle = 'white';
    particles.forEach(p => {
        ctx.fillRect(p.x, p.y, config.particleSize, config.particleSize);
    });

    requestAnimationFrame(animate);
}

// ==================== 事件監聽 ====================

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
});

window.addEventListener('resize', init);

// 啟動
init();
animate();