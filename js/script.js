// ==================== 初始化配置 ====================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let particles = [];
let allTextPoints = {};

const config = {
    fontSize: window.innerWidth < 768 ? 80 : 160, 
    fontName: 'Arial Black',
    gap: 6,
    particleSize: 2.2,
    mouseRadius: 100, // 滑鼠影響範圍
    mouseStrength: 0.5, // 推開力度
    ease: 0.08 // 回彈速度
};

const mouse = { x: -999, y: -999 };

const textSequence = [
    // 移除硬編碼的固定比例，改由 DOM 動態計算真實標題 Y 軸
    { text: 'LuluLab', sectionId: 'home', size: 250, defaultY: 0.55 }, 
    { text: 'ABOUT', sectionId: 'about', size: 120 },
    { text: 'MODULES', sectionId: 'curriculum', size: 120 },
    { text: 'PROJECTS', sectionId: 'projects', size: 120 },
    { text: 'RESOURCES', sectionId: 'resources', size: 120 },
    { text: 'CONTACT US', sectionId: 'contact', size: 120 }
];

// ==================== 初始化 ====================
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 0.55 : 1; // 自動縮小手機版的粒子文字，防止水平溢出

    textSequence.forEach(item => {
        const targetX = canvas.width / 2;
        let targetY = canvas.height * (item.defaultY || 0.5); // 預設居中備用點
        
        // 【優化點 1】：動態獲取實體 DOM 標題的相對高度
        const section = document.getElementById(item.sectionId);
        if (section) {
            const titleEl = section.querySelector('.section-title');
            if (titleEl) {
                const sectionRect = section.getBoundingClientRect();
                const titleRect = titleEl.getBoundingClientRect();
                
                // 計算標題相對於該 Section 頂部的絕對差值，並加上標題自身高度的一半（實現居中對齊）
                // 這種減法計算方式不受當前網頁滾動到哪裡的影響，非常精確
                targetY = (titleRect.top - sectionRect.top) + (titleRect.height / 2) - 11; // -11 是微調值，讓粒子文字更貼合標題位置
            }
        }
        
        allTextPoints[item.text] = getPoints(
            item.text, 
            targetX, 
            targetY, 
            item.size * scale
        );
    });

    createParticles();
}

function getPoints(text, x, y, specificSize) {
    const tempCanvas = document.createElement('canvas');
    const tCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    const fontSize = specificSize || config.fontSize;

    tCtx.fillStyle = 'white';
    tCtx.textAlign = 'center';
    tCtx.textBaseline = 'middle'; 
    tCtx.font = `bold ${fontSize}px ${config.fontName}`;
    
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
    
    let maxCount = 0;
    textSequence.forEach(item => {
        maxCount = Math.max(maxCount, allTextPoints[item.text].length);
    });

    for (let i = 0; i < maxCount; i++) {
        const p1 = basePoints[i % basePoints.length];
        
        const particle = {
            x: p1.x, 
            y: p1.y, 
            baseX: p1.x, 
            baseY: p1.y, 
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

        let scatter = Math.sin(progress * Math.PI) * p.randomFactor;
        const targetX = t1.x + (t2.x - t1.x) * progress + scatter;
        const targetY = t1.y + (t2.y - t1.y) * progress + scatter;

        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        let forceX = 0;
        let forceY = 0;

        if (distance < config.mouseRadius) {
            const angle = Math.atan2(dy, dx);
            const push = (config.mouseRadius - distance) / config.mouseRadius;
            forceX = -Math.cos(angle) * push * 15; 
            forceY = -Math.sin(angle) * push * 15;
        }

        p.vx += (targetX - p.x) * config.ease + forceX;
        p.vy += (targetY - p.y) * config.ease + forceY;
        
        p.vx *= 0.7;
        p.vy *= 0.7;

        p.x += p.vx;
        p.y += p.vy;
    });
}

// 【優化點 2】：基於每個 Section 的真實 offsetTop 進行動態範圍判定
function getCurrentTextAndProgress() {
    const scrollY = window.scrollY;
    let index = 0;
    
    // 遍歷所有節點，判斷當前滾動位置落在哪兩個 Section 的區間內
    for (let i = 0; i < textSequence.length; i++) {
        const currentSection = document.getElementById(textSequence[i].sectionId);
        if (!currentSection) continue;
        
        const top = currentSection.offsetTop;
        const nextSection = textSequence[i + 1] ? document.getElementById(textSequence[i + 1].sectionId) : null;
        // 如果沒有下一個 Section，就以當前 Section 的底部作為邊界
        const bottom = nextSection ? nextSection.offsetTop : top + currentSection.offsetHeight;
        
        if (scrollY >= top && scrollY < bottom) {
            index = i;
            break;
        }
        
        // 觸底極端情況處理
        if (i === textSequence.length - 1 && scrollY >= top) {
            index = i;
        }
    }
    
    const currentText = textSequence[index].text;
    const nextIndex = Math.min(index + 1, textSequence.length - 1);
    const nextText = textSequence[nextIndex].text;

    let progress = 0;
    if (index < textSequence.length - 1) {
        const currentSection = document.getElementById(textSequence[index].sectionId);
        const nextSection = document.getElementById(textSequence[nextIndex].sectionId);
        
        if (currentSection && nextSection) {
            // 進度依據「落入當前 Section 到下一 Section 頂部之間」的比例動態計算
            const startScroll = currentSection.offsetTop;
            const endScroll = nextSection.offsetTop;
            progress = (scrollY - startScroll) / (endScroll - startScroll);
        }
    }
    
    progress = Math.max(0, Math.min(progress, 1)); // 確保數值在 0~1 之間

    return { currentText, nextText, progress };
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

// ==================== 無限滾動文字組件 ====================

function initInfiniteScroll() {
    const textItems = ['Dreamit', 'Buildit', 'Breakit', 'Fixit'];
    const colors = ['orange', 'white'];
    
    const lines = document.querySelectorAll('.scroll-line');

    lines.forEach((line, lineIndex) => {
        const content = line.querySelector('.scroll-line-content');
        const direction = line.getAttribute('data-direction');

        for (let clone = 0; clone < 6; clone++) {
            textItems.forEach((text, textIndex) => {
                const textGroup = document.createElement('div');
                textGroup.className = 'text-group';

                const textItem = document.createElement('div');
                textItem.className = `text-item ${colors[textIndex % colors.length]}`;
                textItem.textContent = text;

                textGroup.appendChild(textItem);
                content.appendChild(textGroup);
            });
        }

        requestAnimationFrame(() => {
            const singleSetWidth = content.querySelector('.text-group').offsetWidth * textItems.length;
            
            if (direction === 'left') {
                gsap.to(content, {
                    x: -singleSetWidth,
                    duration: 80,
                    ease: 'none',
                    repeat: -1,
                    repeatDelay: 0,
                    onRepeat: () => {
                        gsap.set(content, { x: 0 });
                    }
                });
            } else {
                gsap.set(content, { x: -singleSetWidth });
                gsap.to(content, {
                    x: 0,
                    duration: 80,
                    ease: 'none',
                    repeat: -1,
                    repeatDelay: 0,
                    onRepeat: () => {
                        gsap.set(content, { x: -singleSetWidth });
                    }
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initInfiniteScroll);

window.addEventListener('resize', () => {
    gsap.killTweensOf('.scroll-line-content');
    initInfiniteScroll();
});