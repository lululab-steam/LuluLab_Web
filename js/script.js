 // ==================== Intro Animation ====================
 const INTRO_TEXT = 'Think it.\nBuild it.\nBreak it.\nFix it.';
 let introActive = true;
 let introStartTime = 0;
 const INTRO_DURATION = 8000; // ms for full intro sequence
// Intro text rendering params (set in init, used by createParticles for line grouping)
let g_introFontSize = 80;
let g_introLineHeight = 96;
let g_introCenterY = 0;

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

   // Generate intro text points
   const introFontSize = isMobile ? 42 : 80;
   g_introFontSize = introFontSize;
   g_introLineHeight = introFontSize * 1.2;
   g_introCenterY = canvas.height * 0.48;
   allTextPoints[INTRO_TEXT] = getPoints(
       INTRO_TEXT,
       canvas.width * 0.5,
       canvas.height * 0.48,
       introFontSize
   );

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
    
    const lines = text.split('\n');
    const lineHeight = fontSize * 1.2;
    lines.forEach((line, i) => {
        const lineY = y + (i - (lines.length - 1) / 2) * lineHeight;
        tCtx.fillText(line, x, lineY);
    });

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
    // Set canvas to dark during intro so white particles are visible
    canvas.style.backgroundColor = '#000';
    
    let maxCount = 0;
     // Include intro text in max count calculation
     const allTexts = [...textSequence.map(t => t.text), INTRO_TEXT];
     allTexts.forEach(text => {
         if (allTextPoints[text]) {
             maxCount = Math.max(maxCount, allTextPoints[text].length);
         }
     });
 
     for (let i = 0; i < maxCount; i++) {
         const p1 = basePoints[i % basePoints.length];
         
        const particle = {
            // Start at random position across the full canvas
             x: 0,
             y: 0,
            baseX: p1.x, 
            baseY: p1.y, 
            vx: 0,
            vy: 0,
            targets: {},
            randomFactor: Math.random() * 500 - 250,
            scatterAngle: Math.random() * Math.PI * 2,
            scatterDist: 150 + Math.random() * 300,
            // Intro-specific: random start positions for phase 1 convergence
             introRandomX: 0,
             introRandomY: 0,
           // Per-particle alpha for intro fade effects
             introAlpha: 0,
             size: config.particleSize,
             lineIndex: 0
       };
         // Set the same random start position in both actual pos and intro ref
         const rx = Math.random() * canvas.width;
         const ry = Math.random() * canvas.height;
         particle.x = rx;
         particle.y = ry;
         particle.introRandomX = rx;
         particle.introRandomY = ry;
        
         textSequence.forEach(item => {
             const pts = allTextPoints[item.text];
             if (pts && pts.length > 0) {
                 const target = pts[i % pts.length];
                 particle.targets[item.text] = { x: target.x, y: target.y };
             }
         });
         
         // Add intro text targets
         const introPts = allTextPoints[INTRO_TEXT];
         if (introPts && introPts.length > 0) {
             const target = introPts[i % introPts.length];
            particle.targets[INTRO_TEXT] = { x: target.x, y: target.y };
             // Tag particle with its text line index (0-3) for per-line animations
             const relY = target.y - (g_introCenterY - 1.5 * g_introLineHeight);
             particle.lineIndex = Math.max(0, Math.min(3, Math.floor(relY / g_introLineHeight)));
        }
        
        particles.push(particle);
     }
 
     // Reset intro for a fresh playback on init
     introActive = true;
     introStartTime = performance.now();
 }

// ==================== 核心邏輯 ====================

 function updatePhysics() {
     // --- Intro Animation Phase ---
     if (introActive) {
         const elapsed = performance.now() - introStartTime;
         const progress = Math.min(elapsed / INTRO_DURATION, 1);
 
         // Phase mapping on 0-1 intro timeline:
         //   0.00-0.35: Converge from random to "think it..."
         //   0.35-0.45: Hold at "think it..."
         //   0.45-0.70: Scatter outward & fade out
         //   0.70-1.00: Converge to LuluLab

         particles.forEach(p => {
             const tThink = p.targets[INTRO_TEXT] || { x: canvas.width / 2, y: canvas.height / 2 };
             const tLulu = p.targets['LuluLab'] || { x: p.baseX, y: p.baseY };

             let targetX, targetY;

             if (progress < 0.35) {
                 // Phase 1: Converge from random -> "think it..." (staggered arrival)
                 const t = progress / 0.35;
                 const sweepX = p.introRandomX / canvas.width;
                 const delay = sweepX * 0.7;
                 const localT = Math.max(0, (t - delay) / (1 - delay));
                 const ease = 1 + 2.70158 * Math.pow(localT - 1, 3) + 1.70158 * Math.pow(localT - 1, 2);
                 targetX = p.introRandomX + (tThink.x - p.introRandomX) * ease;
                 targetY = p.introRandomY + (tThink.y - p.introRandomY) * ease;
                 p.introAlpha = ease;

             } else if (progress < 0.45) {
                 // Phase 2: Hold at "think it..."
                 targetX = tThink.x;
                 targetY = tThink.y;
                 p.introAlpha = 1;

             } else if (progress < 0.70) {
                 // Phase 3: Scatter outward & fade out
                 const t = (progress - 0.45) / 0.25;
                 const scatterX = tThink.x + Math.cos(p.scatterAngle) * (p.scatterDist + 200);
                 const scatterY = tThink.y + Math.sin(p.scatterAngle) * (p.scatterDist + 200);
                 targetX = tThink.x + (scatterX - tThink.x) * t;
                 targetY = tThink.y + (scatterY - tThink.y) * t;
                 p.introAlpha = 1 - t * t;

             } else {
                 // Phase 4: Converge to LuluLab
                 const t = (progress - 0.70) / 0.30;
                 const ease = t * t * (3 - 2 * t);
                 targetX = p.x + (tLulu.x - p.x) * ease;
                 targetY = p.y + (tLulu.y - p.y) * ease;
                 p.introAlpha = 0.4 + ease * 0.6;
             }

             p.x = targetX;
             p.y = targetY;
             p.vx = 0;
             p.vy = 0;
             p.size = config.particleSize;
         });

        if (progress >= 1) {
            introActive = false;
            // Restore CSS-controlled background (orange at top, dark when scrolled)
            canvas.style.backgroundColor = '';
            // Snap particles cleanly to LuluLab positions
            particles.forEach(p => {
                const tLulu = p.targets['LuluLab'];
                 if (tLulu) {
                     p.x = tLulu.x;
                     p.y = tLulu.y;
                 }
                 p.introAlpha = 1;
             });
         }
         return; // Skip scroll-based physics during intro
     }
 
     // --- Original Scroll-based Physics ---
     const { currentText, nextText, progress } = getCurrentTextAndProgress();
 
     particles.forEach(p => {
         const t1 = p.targets[currentText];
         const t2 = p.targets[nextText];
 
         let targetX, targetY;
 
         if (progress < 0.5) {
             // Phase 1: Dissolve — 從當前文字向外爆散
             const t = progress * 2;
             const ease = 1 - Math.pow(1 - t, 3);
             const dist = p.scatterDist * ease;
             targetX = t1.x + Math.cos(p.scatterAngle) * dist;
             targetY = t1.y + Math.sin(p.scatterAngle) * dist;
         } else {
             // Phase 2: Reform — 從散開位置收斂到下一組文字
             const t = (progress - 0.5) * 2;
             const ease = t * t * t;
             targetX = t2.x + Math.cos(p.scatterAngle) * p.scatterDist * (1 - ease);
             targetY = t2.y + Math.sin(p.scatterAngle) * p.scatterDist * (1 - ease);
         }
 
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
 
     if (!introActive) {
         // Only update body class from scroll after intro completes
         if (window.scrollY > window.innerHeight * 0.4) {
             document.body.classList.add('scrolled');
         } else {
             document.body.classList.remove('scrolled');
         }
     }
 
     updatePhysics();
 
     // Alpha calculation:
     //   During intro → per-particle introAlpha
     //   During scroll → dissolve/reform fade from scroll progress
     let scrollAlpha = 1;
     if (!introActive) {
         const { progress } = getCurrentTextAndProgress();
         if (progress > 0 && progress < 0.5) {
             scrollAlpha = 1 - progress * 2;      // 1 → 0
         } else if (progress >= 0.5 && progress < 1) {
             scrollAlpha = (progress - 0.5) * 2;  // 0 → 1
         }
     }
 
     ctx.fillStyle = 'white';
     particles.forEach(p => {
         if (introActive) {
             ctx.globalAlpha = Math.max(0, Math.min(1, p.introAlpha));
         } else {
             ctx.globalAlpha = scrollAlpha;
         }
         const ps = p.size || config.particleSize;
         ctx.fillRect(p.x, p.y, ps, ps);
     });
     ctx.globalAlpha = 1;
 
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
