/**
 * Egyptian State Land Regularization Executive Dashboard Script
 * 12-Slide Engine + Dual-Theme Synchronization + Chart.js Auto-Resize
 */

// Slide State
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const tabButtons = document.querySelectorAll('.tab-btn');
const progressBar = document.getElementById('progressBar');
const currentSlideNumEl = document.getElementById('currentSlideNum');
const totalSlidesNumEl = document.getElementById('totalSlidesNum');
let autoplayInterval = null;

// Chart Instances Store
let chartInstances = {};

// Theme Controls
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

document.addEventListener('DOMContentLoaded', () => {
    totalSlidesNumEl.textContent = totalSlides;
    initTheme();
    updateSlideView(0);
    initAllCharts();
    initCounters();
    setupEventListeners();
});

// ----------------------------------------------------
// Theme Switcher Logic (Light / Dark Mode)
// ----------------------------------------------------
function initTheme() {
    const savedTheme = localStorage.getItem('land_reg_theme') || 'dark';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('land_reg_theme', theme);

    if (theme === 'light') {
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        if (themeText) themeText.textContent = 'الوضع الليلي';
        themeToggleBtn?.setAttribute('title', 'التبديل إلى الوضع الليلي');
    } else {
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        if (themeText) themeText.textContent = 'الوضع النهاري';
        themeToggleBtn?.setAttribute('title', 'التبديل إلى الوضع النهاري');
    }

    updateChartsTheme(theme);
}

function updateChartsTheme(theme) {
    const isLight = theme === 'light';
    const textColor = isLight ? '#1e293b' : '#cbd5e1';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    const tooltipBg = isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 38, 0.95)';
    const tooltipTitleColor = isLight ? '#090d16' : '#ffffff';
    const tooltipBodyColor = isLight ? '#1e293b' : '#cbd5e1';
    const tooltipBorder = isLight ? 'rgba(15, 118, 110, 0.4)' : 'rgba(45, 212, 191, 0.4)';

    Chart.defaults.color = textColor;
    Chart.defaults.plugins.tooltip.backgroundColor = tooltipBg;
    Chart.defaults.plugins.tooltip.titleColor = tooltipTitleColor;
    Chart.defaults.plugins.tooltip.bodyColor = tooltipBodyColor;
    Chart.defaults.plugins.tooltip.borderColor = tooltipBorder;

    Object.values(chartInstances).forEach(chart => {
        if (!chart) return;
        if (chart.options.scales) {
            if (chart.options.scales.x && chart.options.scales.x.grid) {
                chart.options.scales.x.grid.color = gridColor;
            }
            if (chart.options.scales.y && chart.options.scales.y.grid) {
                chart.options.scales.y.grid.color = gridColor;
            }
        }
        chart.update();
    });
}

// ----------------------------------------------------
// Navigation & Controls
// ----------------------------------------------------
function setupEventListeners() {
    document.getElementById('btnNext').addEventListener('click', nextSlide);
    document.getElementById('btnPrev').addEventListener('click', prevSlide);
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const slideIndex = parseInt(btn.getAttribute('data-slide'));
            goToSlide(slideIndex);
        });
    });

    // Keyboard navigation (RTL aware)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === ' ' || e.key === 'PageDown') {
            nextSlide();
        } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
            prevSlide();
        } else if (e.key === 'Home') {
            goToSlide(0);
        } else if (e.key === 'End') {
            goToSlide(totalSlides - 1);
        }
    });

    // Fullscreen Toggle
    document.getElementById('btnFullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.log(err));
        } else {
            document.exitFullscreen();
        }
    });

    // Autoplay toggle
    const autoplayBtn = document.getElementById('btnAutoplay');
    autoplayBtn.addEventListener('click', () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
            autoplayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            autoplayBtn.classList.remove('active');
        } else {
            autoplayInterval = setInterval(nextSlide, 8000);
            autoplayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            autoplayBtn.classList.add('active');
        }
    });
}

function updateSlideView(index) {
    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === index);
    });

    tabButtons.forEach((tab, idx) => {
        tab.classList.toggle('active', idx === index);
        if (idx === index) {
            tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });

    currentSlide = index;
    currentSlideNumEl.textContent = index + 1;
    
    const progress = ((index + 1) / totalSlides) * 100;
    progressBar.style.width = `${progress}%`;

    if (index === 0) {
        initCounters();
    }
}

function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    goToSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prev);
}

function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
        updateSlideView(index);
    }
}

function triggerMilestoneCelebration() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
        });
    }
    alert('✅ تم اعتماد حزمة التكليفات العاجلة رسمياً وتعميمها على الإدارات المركزية والأقاليم الستة لبدء التنفيذ الفوري.');
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const speed = target / 25;
        
        const updateCount = () => {
            count += speed;
            if (count < target) {
                counter.innerText = Math.ceil(count).toLocaleString('en-US');
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target.toLocaleString('en-US');
            }
        };
        updateCount();
    });
}

// ----------------------------------------------------
// Chart.js Visualizations (Large & High Legibility)
// ----------------------------------------------------
function initAllCharts() {
    Chart.defaults.font.family = "'Cairo', 'Tajawal', sans-serif";
    Chart.defaults.font.size = 14;
    Chart.defaults.font.weight = 'bold';
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.titleFont = { size: 14, weight: 'bold' };
    Chart.defaults.plugins.tooltip.bodyFont = { size: 13 };

    // 1. Donut Chart - General Breakdown (2241)
    const ctxGeneral = document.getElementById('chartGeneralBreakdown')?.getContext('2d');
    if (ctxGeneral) {
        chartInstances.general = new Chart(ctxGeneral, {
            type: 'doughnut',
            data: {
                labels: ['صالحة للتقنين والتعاقد (1,264)', 'غير صالحة للتعاقد (977)'],
                datasets: [{
                    data: [1264, 977],
                    backgroundColor: ['#10b981', '#f43f5e'],
                    borderColor: 'transparent',
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '62%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 16, padding: 18, font: { size: 14, weight: 'bold' } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const val = context.raw;
                                const pct = ((val / 2241) * 100).toFixed(1);
                                return ` ${val.toLocaleString()} حالة (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 2. Column Chart - Valid Breakdown (1264)
    const ctxValid = document.getElementById('chartValidBreakdown')?.getContext('2d');
    if (ctxValid) {
        chartInstances.valid = new Chart(ctxValid, {
            type: 'bar',
            data: {
                labels: ['عقود تم إبرامها بالفعل', 'ممتنعون مستهدفون بالإرشاد'],
                datasets: [{
                    label: 'عدد الحالات',
                    data: [342, 922],
                    backgroundColor: ['#06b6d4', '#f59e0b'],
                    borderRadius: 10,
                    barThickness: 55
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const val = context.raw;
                                const pct = ((val / 1264) * 100).toFixed(1);
                                return ` ${val} حالة (${pct}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 14, weight: 'bold' } } },
                    y: { beginAtZero: true, ticks: { font: { size: 13 } } }
                }
            }
        });
    }

    // 3. Horizontal Bar Chart - Invalid Actions (977)
    const ctxInvalid = document.getElementById('chartInvalidActions')?.getContext('2d');
    if (ctxInvalid) {
        chartInstances.invalid = new Chart(ctxInvalid, {
            type: 'bar',
            data: {
                labels: ['محاضر وقرارات إزالة', 'تمت الإزالة الفعلية', 'إعادة نظر (أصبحت صالحة)'],
                datasets: [{
                    label: 'عدد الحالات',
                    data: [764, 185, 28],
                    backgroundColor: ['#a855f7', '#f43f5e', '#10b981'],
                    borderRadius: 10,
                    barThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const val = context.raw;
                                const pct = ((val / 977) * 100).toFixed(1);
                                return ` ${val} حالة (${pct}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: { beginAtZero: true, ticks: { font: { size: 13 } } },
                    y: { grid: { display: false }, ticks: { font: { size: 14, weight: 'bold' } } }
                }
            }
        });
    }

    // 4. Pie Chart - Platform 168/2025
    const ctxPlatform = document.getElementById('chartPlatformBreakdown')?.getContext('2d');
    if (ctxPlatform) {
        chartInstances.platform = new Chart(ctxPlatform, {
            type: 'pie',
            data: {
                labels: ['موافقة مساحة عسكرية (1)', 'في انتظار الموافقة (2)', 'تمت الإزالة فوراً (1)'],
                datasets: [{
                    data: [1, 2, 1],
                    backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
                    borderColor: 'transparent',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 14, padding: 16, font: { size: 13, weight: 'bold' } }
                    }
                }
            }
        });
    }

    // 5. Clustered Column Chart - Regional Guidance (922)
    const ctxGuidance = document.getElementById('chartGuidanceRegions')?.getContext('2d');
    if (ctxGuidance) {
        chartInstances.guidance = new Chart(ctxGuidance, {
            type: 'bar',
            data: {
                labels: ['القناة وسيناء', 'مصر الوسطى (الجيزة)', 'شرق الدلتا', 'مصر العليا (قنا)', 'وسط الدلتا', 'غرب الدلتا (بحيرة)'],
                datasets: [
                    {
                        label: 'المستهدفون بالاجتماعات',
                        data: [2, 30, 20, 17, 15, 12],
                        backgroundColor: 'rgba(148, 163, 184, 0.35)',
                        borderRadius: 6
                    },
                    {
                        label: 'تم التوقيع / موافقة مشروطة',
                        data: [1, 5, 20, 0, 0, 8],
                        backgroundColor: '#10b981',
                        borderRadius: 6
                    },
                    {
                        label: 'رفض تام / امتناع',
                        data: [0, 20, 0, 17, 0, 0],
                        backgroundColor: '#f43f5e',
                        borderRadius: 6
                    },
                    {
                        label: 'مهلة تفكير وتفاوض',
                        data: [1, 5, 0, 0, 15, 4],
                        backgroundColor: '#f59e0b',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 14, padding: 12, font: { size: 12, weight: 'bold' } }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 12, weight: 'bold' } } },
                    y: { beginAtZero: true, ticks: { font: { size: 12 } } }
                }
            }
        });
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateChartsTheme(currentTheme);
}
