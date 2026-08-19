/**
 * Egyptian State Land Regularization Executive Dashboard Script
 * 16-Slide Modular Architecture + Dual-Theme Synchronization
 */

// Slide State Management
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
    if (totalSlidesNumEl) totalSlidesNumEl.textContent = totalSlides;
    initTheme();
    updateSlideView(0);
    initAllCharts();
    initCounters();
    setupEventListeners();
    initRegionalMethodology();
    initDailyMethodology();
    initLicensesMethodology();
    initContractsMethodology();
});

// ----------------------------------------------------
// Theme Switcher Logic (Light / Dark Mode)
// ----------------------------------------------------
function initTheme() {
    const savedTheme = localStorage.getItem('land_reg_theme') || 'light';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
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
    document.getElementById('btnNext')?.addEventListener('click', nextSlide);
    document.getElementById('btnPrev')?.addEventListener('click', prevSlide);

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
    document.getElementById('btnFullscreen')?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.log(err));
        } else {
            document.exitFullscreen();
        }
    });

    // Autoplay toggle
    const autoplayBtn = document.getElementById('btnAutoplay');
    autoplayBtn?.addEventListener('click', () => {
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
    if (currentSlideNumEl) currentSlideNumEl.textContent = index + 1;

    const progress = ((index + 1) / totalSlides) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

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

// ----------------------------------------------------
// Executive PDF Print Management
// ----------------------------------------------------
function prepareAllChartsForPrint() {
    // 1. Temporarily switch to light theme for clean, ink-friendly high-contrast print
    document.documentElement.setAttribute('data-theme', 'light');
    updateChartsTheme('light');

    // 2. Make all slides visible in print layout
    slides.forEach(slide => {
        slide.style.display = 'block';
    });

    // 3. Immediately fill all counter targets
    document.querySelectorAll('.counter').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        if (target) counter.innerText = target.toLocaleString('en-US');
    });

    // 4. Force Chart.js instances to resize and paint
    Object.values(chartInstances).forEach(chart => {
        if (chart) {
            chart.resize();
            chart.update('none');
        }
    });

    // 5. Generate high-resolution static PNG for each chart
    Object.values(chartInstances).forEach(chart => {
        if (chart && chart.canvas) {
            try {
                const canvas = chart.canvas;
                const parent = canvas.parentElement;
                if (parent) {
                    let printImg = parent.querySelector('.print-chart-img');
                    if (!printImg) {
                        printImg = document.createElement('img');
                        printImg.className = 'print-chart-img';
                        printImg.alt = 'مخطط بياني إحصائي';
                        parent.insertBefore(printImg, canvas);
                    }
                    const dataUrl = chart.toBase64Image('image/png', 1);
                    if (dataUrl && dataUrl.length > 50) {
                        printImg.src = dataUrl;
                        canvas.style.display = 'none';
                    }
                }
            } catch (err) {
                console.warn('Could not generate chart image for print:', err);
            }
        }
    });
}

function prepareForPrinting() {
    prepareAllChartsForPrint();
    setTimeout(() => {
        window.print();
    }, 450);
}

window.addEventListener('beforeprint', () => {
    prepareAllChartsForPrint();
});

window.addEventListener('afterprint', () => {
    const savedTheme = localStorage.getItem('land_reg_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateChartsTheme(savedTheme);

    slides.forEach(slide => {
        slide.style.display = '';
    });
    document.querySelectorAll('.chart-container canvas').forEach(c => {
        c.style.display = '';
    });
    updateSlideView(currentSlide);
});

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
// Chart.js Visualizations Engine
// ----------------------------------------------------
function initAllCharts() {
    Chart.defaults.font.family = "'Cairo', 'Tajawal', sans-serif";
    Chart.defaults.font.size = 13;
    Chart.defaults.font.weight = 'bold';
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.titleFont = { size: 14, weight: 'bold' };
    Chart.defaults.plugins.tooltip.bodyFont = { size: 13 };

    // 1. Donut Chart - General Breakdown (2241 Cases)
    const ctxGeneral = document.getElementById('chartGeneralBreakdown')?.getContext('2d');
    if (ctxGeneral) {
        chartInstances.general = new Chart(ctxGeneral, {
            type: 'doughnut',
            data: {
                labels: ['صالحة للتقنين (1,264)', 'غير صالحة للتقنين (977)'],
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
                            label: function (context) {
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

    // 2. Clustered Column Chart - Regional Valid Breakdown (342 Contracts vs 922 Refusing)
    const ctxValid = document.getElementById('chartValidRegional')?.getContext('2d');
    if (ctxValid) {
        chartInstances.valid = new Chart(ctxValid, {
            type: 'bar',
            data: {
                labels: ['مصر الوسطى', 'شرق الدلتا', 'وسط الدلتا', 'القناة وسيناء', 'مصر العليا', 'غرب الدلتا'],
                datasets: [
                    {
                        label: 'عقود مبرمة فعلياً (342)',
                        data: [200, 108, 22, 7, 3, 2],
                        backgroundColor: '#06b6d4',
                        borderRadius: 6
                    },
                    {
                        label: 'ممتنعون مستهدفون بالإرشاد (922)',
                        data: [213, 471, 114, 5, 52, 67],
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
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ` ${context.dataset.label}: ${context.raw} حالة`;
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 12, weight: 'bold' } } },
                    y: { beginAtZero: true, ticks: { font: { size: 12 } } }
                }
            }
        });
    }

    // 3. Stacked Horizontal Bar Chart - Regional Invalid Breakdown (977 Cases)
    const ctxInvalid = document.getElementById('chartInvalidRegional')?.getContext('2d');
    if (ctxInvalid) {
        chartInstances.invalid = new Chart(ctxInvalid, {
            type: 'bar',
            data: {
                labels: ['مصر الوسطى', 'القناة وسيناء', 'غرب الدلتا', 'شرق الدلتا', 'وسط الدلتا', 'مصر العليا'],
                datasets: [
                    {
                        label: 'محاضر وقرارات إزالة (764)',
                        data: [200, 0, 170, 160, 230, 4],
                        backgroundColor: '#a855f7',
                        borderRadius: 4
                    },
                    {
                        label: 'إزالة فعلية (أرض فضاء 185)',
                        data: [75, 1, 25, 58, 24, 2],
                        backgroundColor: '#f43f5e',
                        borderRadius: 4
                    },
                    {
                        label: 'التحويل لصالح للتقنين (28)',
                        data: [9, 0, 0, 19, 0, 0],
                        backgroundColor: '#10b981',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 14, padding: 12, font: { size: 12, weight: 'bold' } }
                    }
                },
                scales: {
                    x: { stacked: true, beginAtZero: true, ticks: { font: { size: 12 } } },
                    y: { stacked: true, grid: { display: false }, ticks: { font: { size: 12, weight: 'bold' } } }
                }
            }
        });
    }

    // 4. Bar Chart - Regional Licenses Breakdown (1979 Licenses)
    const ctxLicenses = document.getElementById('chartLicensesRegional')?.getContext('2d');
    if (ctxLicenses) {
        chartInstances.licenses = new Chart(ctxLicenses, {
            type: 'bar',
            data: {
                labels: ['شرق الدلتا', 'وسط الدلتا', 'مصر العليا', 'مصر الوسطى', 'غرب الدلتا', 'القناة وسيناء'],
                datasets: [{
                    label: 'عدد التراخيص الصادرة',
                    data: [873, 775, 153, 105, 66, 7],
                    backgroundColor: ['#14b8a6', '#06b6d4', '#f59e0b', '#a855f7', '#3b82f6', '#10b981'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const val = context.raw;
                                const pct = ((val / 1979) * 100).toFixed(1);
                                return ` ${val} ترخيصاً (${pct}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 12, weight: 'bold' } } },
                    y: { beginAtZero: true, ticks: { font: { size: 12 } } }
                }
            }
        });
    }

    // 4a. Line & Bar Chart - Daily Contracts Inflow (108 Contracts across 8 days)
    const ctxContractsFlow = document.getElementById('chartDailyContractsFlow')?.getContext('2d');
    if (ctxContractsFlow) {
        chartInstances.contractsFlow = new Chart(ctxContractsFlow, {
            type: 'bar',
            data: {
                labels: ['8-8 (السبت)', '9-8 (الأحد)', '10-8 (الإثنين)', '11-8 (الثلاثاء)', '12-8 (الأربعاء)', '13-8 (الخميس)', '15-8 (السبت)', '16-8 (الأحد)'],
                datasets: [
                    {
                        type: 'line',
                        label: 'إجمالي العقود اليومية (الهيئة)',
                        data: [35, 10, 5, 24, 24, 0, 0, 10],
                        borderColor: '#14b8a6',
                        backgroundColor: 'rgba(20, 184, 166, 0.15)',
                        borderWidth: 3,
                        pointBackgroundColor: '#14b8a6',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        fill: true,
                        tension: 0.3
                    },
                    {
                        type: 'bar',
                        label: 'مصر الوسطى (المتصدر 84)',
                        data: [28, 8, 5, 24, 19, 0, 0, 5],
                        backgroundColor: '#10b981',
                        borderRadius: 6
                    },
                    {
                        type: 'bar',
                        label: 'شرق الدلتا (18 عقداً)',
                        data: [7, 1, 0, 0, 5, 0, 0, 5],
                        backgroundColor: '#06b6d4',
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
                        labels: { boxWidth: 12, padding: 10, font: { size: 11, weight: 'bold' } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ` ${context.dataset.label}: ${context.raw} عقد`;
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 11, weight: 'bold' } } },
                    y: { beginAtZero: true, ticks: { font: { size: 11 } } }
                }
            }
        });
    }

    // 4b. Line & Area Chart - Daily Licenses Inflow
    const ctxLicensesFlow = document.getElementById('chartDailyLicensesFlow')?.getContext('2d');
    if (ctxLicensesFlow) {
        chartInstances.licensesFlow = new Chart(ctxLicensesFlow, {
            type: 'line',
            data: {
                labels: ['8-8', '9-8', '10-8', '11-8', '12-8', '13-8', '15-8', '16-8', '17-8'],
                datasets: [{
                    label: 'إجمالي التراخيص اليومية',
                    data: [7, 69, 208, 336, 518, 401, 164, 100, 174],
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.15)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // 5. Line & Area Chart - Daily Encroachments vs Target (150/Day)
    const ctxDaily = document.getElementById('chartDailyEncroachmentsTarget')?.getContext('2d');
    if (ctxDaily) {
        chartInstances.daily = new Chart(ctxDaily, {
            type: 'line',
            data: {
                labels: ['1-8', '2-8', '3-8', '4-8', '5-8', '6-8', '8-8', '9-8', '10-8', '11-8', '12-8', '13-8', '15-8', '16-8'],
                datasets: [
                    {
                        label: 'المستهدف اليومي الإلزامي (150 حالة/يوم)',
                        data: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
                        borderColor: '#f43f5e',
                        borderWidth: 2,
                        borderDash: [6, 6],
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'المرسل الفعلي من الأقاليم (إجمالي الهيئة)',
                        data: [33, 39, 90, 86, 83, 39, 27, 43, 48, 34, 54, 26, 28, 39],
                        borderColor: '#14b8a6',
                        backgroundColor: 'rgba(20, 184, 166, 0.15)',
                        borderWidth: 3,
                        pointBackgroundColor: '#14b8a6',
                        pointRadius: 4,
                        fill: true,
                        tension: 0.35
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 14, padding: 10, font: { size: 11, weight: 'bold' } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ` ${context.dataset.label}: ${context.raw} حالة`;
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 11, weight: 'bold' } } },
                    y: { beginAtZero: true, max: 170, ticks: { font: { size: 11 } } }
                }
            }
        });
    }

    // 6. Doughnut Chart - Regional Daily Encroachments Distribution (669 Cases)
    const ctxEncroachments = document.getElementById('chartEncroachmentsRegional')?.getContext('2d');
    if (ctxEncroachments) {
        chartInstances.encroachments = new Chart(ctxEncroachments, {
            type: 'doughnut',
            data: {
                labels: ['شرق الدلتا (167)', 'مصر الوسطى (161)', 'القناة وسيناء (101)', 'وسط الدلتا (98)', 'مصر العليا (98)', 'غرب الدلتا (44)'],
                datasets: [{
                    data: [167, 161, 101, 98, 98, 44],
                    backgroundColor: ['#14b8a6', '#a855f7', '#3b82f6', '#06b6d4', '#f43f5e', '#f59e0b'],
                    borderColor: 'transparent',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '55%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { boxWidth: 12, padding: 10, font: { size: 11, weight: 'bold' } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const total = 669;
                                const pct = ((context.raw / total) * 100).toFixed(1);
                                return ` ${context.label}: ${context.raw} حالة (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 7. Pie Chart - Platform 168/2025 Breakdown
    const ctxPlatform = document.getElementById('chartPlatformBreakdown')?.getContext('2d');
    if (ctxPlatform) {
        chartInstances.platform = new Chart(ctxPlatform, {
            type: 'pie',
            data: {
                labels: ['في انتظار موافقة المساحة العسكرية (3)', 'تمت الإزالة فوراً (1)'],
                datasets: [{
                    data: [3, 1],
                    backgroundColor: ['#f59e0b', '#f43f5e'],
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
                        labels: { boxWidth: 14, padding: 14, font: { size: 12, weight: 'bold' } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const total = 4;
                                const pct = Math.round((context.raw / total) * 100);
                                return ` ${context.label}: ${context.raw} حالة (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 8. Clustered Column Chart - Regional Guidance Interaction
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
                        label: 'تم التوقيع الفعلي',
                        data: [1, 5, 1, 0, 0, 0],
                        backgroundColor: '#10b981',
                        borderRadius: 6
                    },
                    {
                        label: 'موافقة مبدئية مشروطة (فصل حد مساحي)',
                        data: [0, 0, 11, 0, 0, 0],
                        backgroundColor: '#06b6d4',
                        borderRadius: 6
                    },
                    {
                        label: 'رفض تام / امتناع',
                        data: [0, 20, 0, 17, 0, 0],
                        backgroundColor: '#f43f5e',
                        borderRadius: 6
                    },
                    {
                        label: 'مهلة تفكير وتفاوض نشط',
                        data: [1, 5, 8, 0, 15, 12],
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
                        labels: { boxWidth: 12, padding: 10, font: { size: 11, weight: 'bold' } }
                    },
                    tooltip: {
                        callbacks: {
                            afterBody: function(context) {
                                const index = context[0].dataIndex;
                                if (index === 2) {
                                    return '\nتفصيل شرق الدلتا:\n• المستهدف: 20 مواطناً\n• تم التوقيع: 1 (الشرقية)\n• موافقة مشروطة بفصل الحد: 11 (الدقهلية)\n• مهلة تفكير ومتابعة: 8';
                                }
                                return '';
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 11, weight: 'bold' } } },
                    y: { beginAtZero: true, ticks: { font: { size: 11 } } }
                }
            }
        });
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateChartsTheme(currentTheme);
}

// ----------------------------------------------------
// Regional Master Scorecard Methodology Side Panel Logic
// ----------------------------------------------------
const regionalMethodologyData = {
    middle_egypt: {
        name: "إقليم مصر الوسطى",
        badge: "أعلى إبرام عقود وإزالات",
        badgeClass: "badge-teal",
        totalMath: "200 + 213 + 75 + 200 + 9 = 697 حالة",
        totalDesc: "عقود مبرمة (200) + ممتنعون (213) + إزالة فضاء (75) + قرارات ومحاضر (200) + تحويل لصالح (9).",
        validityMath: "[(200 عقود + 213 ممتنعون) ÷ 697 إجمالي] × 100 = 59.3%",
        validityDesc: "نسبة الحالات الصالحة (المبرمة 200 + الممتنعين 213 = 413 حالة) من إجمالي حالات الإقليم (697).",
        kpiBadge: "أعلى إبرام عقود وإزالات",
        kpiBadgeClass: "badge-teal",
        kpiReason: "تصدر المركز الأول على مستوى الجمهورية في إبرام العقود (200 عقد = 58.5% من الهيئة) والإزالات الفعلية واسترداد الأراضي فضاء (75 حالة = 40.5% من الهيئة)."
    },
    east_delta: {
        name: "إقليم شرق الدلتا",
        badge: "أعلى كتلة ممتنعين مستهدفة",
        badgeClass: "badge-cyan",
        totalMath: "108 + 471 + 58 + 160 + 19 = 816 حالة",
        totalDesc: "عقود مبرمة (108) + ممتنعون (471) + إزالة فضاء (58) + قرارات ومحاضر (160) + تحويل لصالح (19).",
        validityMath: "[(108 عقود + 471 ممتنعون) ÷ 816 إجمالي] × 100 = 71.0%",
        validityDesc: "نسبة الحالات الصالحة (المبرمة 108 + الممتنعين 471 = 579 حالة) من إجمالي حالات الإقليم (816).",
        kpiBadge: "أعلى كتلة ممتنعين مستهدفة",
        kpiBadgeClass: "badge-cyan",
        kpiReason: "يضم أكبر حجم عمل بالهيئة (816 حالة) وأكثر من نصف ممتنعي الجمهورية (471 ممتنعاً = 51.1%)، وهو الأولوية القصوى للإرشاد القانوني وتحصيل مقابل الانتفاع."
    },
    west_delta: {
        name: "إقليم غرب الدلتا",
        badge: "يتطلب حسم التسعير والمدد",
        badgeClass: "badge-amber",
        totalMath: "2 + 67 + 25 + 170 + 0 = 264 حالة",
        totalDesc: "عقود مبرمة (2) + ممتنعون (67) + إزالة فضاء (25) + قرارات ومحاضر (170) + تحويل لصالح (0).",
        validityMath: "[(2 عقود + 67 ممتنعون) ÷ 264 إجمالي] × 100 = 26.1%",
        validityDesc: "نسبة الحالات الصالحة (المبرمة 2 + الممتنعين 67 = 69 حالة) من إجمالي حالات الإقليم (264).",
        kpiBadge: "يتطلب حسم التسعير والمدد",
        kpiBadgeClass: "badge-amber",
        kpiReason: "تدني نسبة إبرام العقود (عقدان فقط = 2.9% من الصالح)، وطلب 67 ممتنعاً زيادة المدد لـ 5 سنوات وتحديد الأسعار حيث إنها لم تُحدد، مع اتخاذ 170 قرار ومحضر إزالة."
    },
    canal_sinai: {
        name: "إقليم القناة وسيناء",
        badge: "أعلى نسبة استجابة تعاقدية",
        badgeClass: "badge-emerald",
        totalMath: "7 + 5 + 1 + 0 + 0 = 13 حالة",
        totalDesc: "عقود مبرمة (7) + ممتنعون (5) + إزالة فضاء (1) + قرارات ومحاضر (0) + تحويل لصالح (0).",
        validityMath: "[(7 عقود + 5 ممتنعون) ÷ 13 إجمالي] × 100 = 92.3%",
        validityDesc: "نسبة الحالات الصالحة (المبرمة 7 + الممتنعين 5 = 12 حالة) من إجمالي حالات الإقليم (13).",
        kpiBadge: "أعلى نسبة استجابة تعاقدية",
        kpiBadgeClass: "badge-emerald",
        kpiReason: "سجل أعلى معدل استجابة تعاقدية بين الصالح (7 عقود من 12 حالة = 58.3%)، مع تحقيق أعلى نسبة صلاحية 92.3%، وصفر قرارات إزالة ومحاضر."
    },
    middle_delta: {
        name: "إقليم وسط الدلتا",
        badge: "فرصة تحصيل واعدة (مهل)",
        badgeClass: "badge-purple",
        totalMath: "22 + 114 + 24 + 230 + 0 = 390 حالة",
        totalDesc: "عقود مبرمة (22) + ممتنعون (114) + إزالة فضاء (24) + قرارات ومحاضر (230) + تحويل لصالح (0).",
        validityMath: "[(22 عقود + 114 ممتنعون) ÷ 390 إجمالي] × 100 = 34.9%",
        validityDesc: "نسبة الحالات الصالحة (المبرمة 22 + الممتنعين 114 = 136 حالة) من إجمالي حالات الإقليم (390).",
        kpiBadge: "فرصة تحصيل واعدة (مهل)",
        kpiBadgeClass: "badge-purple",
        kpiReason: "وجود 114 حالة امتناع طلبت مهلاً زمنية للتفكير والتسوية (فرصة تحصيل سريعة مع المتابعة) بجانب حسم 230 حالة بإجراءات وقرارات إزالة."
    },
    upper_egypt: {
        name: "إقليم مصر العليا",
        badge: "رفض مرتفع يتطلب حسم رادع",
        badgeClass: "badge-rose",
        totalMath: "3 + 52 + 2 + 4 + 0 = 61 حالة",
        totalDesc: "عقود مبرمة (3) + ممتنعون (52) + إزالة فضاء (2) + قرارات ومحاضر (4) + تحويل لصالح (0).",
        validityMath: "[(3 عقود + 52 ممتنعون) ÷ 61 إجمالي] × 100 = 90.2%",
        validityDesc: "نسبة الحالات الصالحة (المبرمة 3 + الممتنعين 52 = 55 حالة) من إجمالي حالات الإقليم (61).",
        kpiBadge: "رفض مرتفع يتطلب حسم رادع",
        kpiBadgeClass: "badge-rose",
        kpiReason: "رغم أن نسبة الصلاحية الفنية 90.2%، إلا أن 52 حالة ترفض التوقيع ولم يُبرم سوى 3 عقود (5.5%)، مما يتطلب اتخاذ الإجراءات القانونية والقضائية."
    },
    all: {
        name: "الإجمالي العام للهيئة",
        badge: "حوكمة شاملة 100%",
        badgeClass: "badge-teal",
        totalMath: "342 + 922 + 185 + 764 + 28 = 2,241 حالة",
        totalDesc: "عقود مبرمة (342) + ممتنعون (922) + إزالة فضاء (185) + قرارات ومحاضر (764) + تحويل لصالح (28).",
        validityMath: "[(342 عقود + 922 ممتنعون) ÷ 2,241 إجمالي] × 100 = 56.4%",
        validityDesc: "نسبة مجموع الحالات الصالحة على مستوى الهيئة (1,264 حالة) من إجمالي المعاينات الكلية (2,241 حالة).",
        kpiBadge: "حوكمة شاملة 100%",
        kpiBadgeClass: "badge-teal",
        kpiReason: "حصر وتدقيق وتسكين كافة الـ 2,241 حالة بنسبة مطابقة 100% دون أي فواقد إحصائية وتوزيعها على مسارات العمل التنفيذية."
    }
};

function selectMethodologyRegion(regionKey) {
    const data = regionalMethodologyData[regionKey];
    if (!data) return;

    // Update Chips
    document.querySelectorAll('.methodology-region-chips .m-chip').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-target') === regionKey);
    });

    // Update Table Row selection
    document.querySelectorAll('#matrixScorecardTable tbody tr.clickable-row').forEach(row => {
        row.classList.toggle('selected-row', row.getAttribute('data-region') === regionKey);
    });

    // Update Badge
    const badgeEl = document.getElementById('methodologyRegionBadge');
    if (badgeEl) {
        badgeEl.textContent = data.name;
        badgeEl.className = `badge ${data.badgeClass}`;
    }

    // Update Math Cards
    const totalMath = document.getElementById('mTotalMath');
    const totalDesc = document.getElementById('mTotalDesc');
    const validityMath = document.getElementById('mValidityMath');
    const validityDesc = document.getElementById('mValidityDesc');
    const kpiBadge = document.getElementById('mKpiBadge');
    const kpiDesc = document.getElementById('mKpiDesc');

    if (totalMath) totalMath.textContent = data.totalMath;
    if (totalDesc) totalDesc.textContent = data.totalDesc;
    if (validityMath) validityMath.textContent = data.validityMath;
    if (validityDesc) validityDesc.textContent = data.validityDesc;
    if (kpiBadge) {
        kpiBadge.textContent = data.kpiBadge;
        kpiBadge.className = `badge ${data.kpiBadgeClass}`;
    }
    if (kpiDesc) kpiDesc.textContent = data.kpiReason;
}

function initRegionalMethodology() {
    // Listeners for Chips
    document.querySelectorAll('.methodology-region-chips .m-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            selectMethodologyRegion(target);
        });
    });

    // Listeners for Table Rows
    document.querySelectorAll('#matrixScorecardTable tbody tr.clickable-row').forEach(row => {
        row.addEventListener('click', () => {
            const target = row.getAttribute('data-region');
            selectMethodologyRegion(target);
        });
    });
}

// ----------------------------------------------------
// Daily Encroachments Methodology & Calculations Engine
// ----------------------------------------------------
const dailyMethodologyData = {
    east_delta: {
        name: "إقليم شرق الدلتا",
        badge: "المركز 1 (استمرارية نشطة)",
        badgeClass: "badge-emerald",
        totalMath: "14 + 19 + 17 + 14 + 34 + 9 + 4 + 12 + 10 + 11 + 9 + 6 + 0 + 8 = 167 حالة",
        totalDesc: "مجموع التعديات المرسلة عبر 14 يوم عمل (1-8 إلى 16-8)، وسجل أعلى ذروة يوم 5-8 (34 حالة)، مع يوم توقف واحد فقط (15-8).",
        rateMath: "المتوسط: 167 ÷ 14 = 11.9 حالة/يوم | المساهمة: (167 ÷ 669) × 100 = 25.0%",
        rateDesc: "يمثل ربع إجمالي ما أرسلته الهيئة بالكامل (المركز الأول على مستوى الجمهورية) بمتوسط يومي منتظم قدره 11.9 حالة.",
        kpiBadge: "المركز 1 (استمرارية نشطة)",
        kpiBadgeClass: "badge-emerald",
        kpiReason: "أعلى الأقاليم انتظاماً وتدفقاً بنسبة تشغيل 92.9% (13 يوماً نشطاً من أصل 14)، ويشكل القوة الدافعة الرئيسية لحجم الإرسال بالهيئة."
    },
    middle_egypt: {
        name: "إقليم مصر الوسطى",
        badge: "المركز 2 (تذبذب حاد - 5 أيام صفر)",
        badgeClass: "badge-amber",
        totalMath: "0 + 0 + 34 + 31 + 12 + 20 + 18 + 0 + 7 + 0 + 14 + 15 + 0 + 10 = 161 حالة",
        totalDesc: "سجل قمم إرسال مرتفعة (34 و 31 حالة في 3 و 4 أغسطس)، مقابل 5 أيام انقطاع تام (صفر إرسال في 1، 2، 9، 11، 15 أغسطس).",
        rateMath: "المتوسط: 161 ÷ 14 = 11.5 حالة/يوم | المساهمة: (161 ÷ 669) × 100 = 24.1%",
        rateDesc: "المركز الثاني في حجم الإرسال بنسبة 24.1% بمتوسط 11.5 حالة/يوم، لكنه يعاني من تباين وتذبذب إحصائي حاد بين الأيام.",
        kpiBadge: "المركز 2 (تذبذب حاد - 5 أيام صفر)",
        kpiBadgeClass: "badge-amber",
        kpiReason: "يمتلك طاقة إرسال عالية عند التشغيل بنظام الدفعات (Batching)، لكنه يحتاج لضبط آلية الإرسال اليومي الفوري لمنع تراكم الأيام الصفرية."
    },
    canal_sinai: {
        name: "إقليم القناة وسيناء",
        badge: "المركز 3 (استجابة منتظمة)",
        badgeClass: "badge-teal",
        totalMath: "0 + 3 + 8 + 15 + 10 + 5 + 0 + 7 + 4 + 7 + 23 + 5 + 14 + 0 = 101 حالة",
        totalDesc: "إجمالي 101 حالة عبر 11 يوماً نشطاً، وسجل أعلى يوم إرسال في 12-8 بواقع 23 حالة، مقابل 3 أيام صفر فقط.",
        rateMath: "المتوسط: 101 ÷ 14 = 7.2 حالة/يوم | المساهمة: (101 ÷ 669) × 100 = 15.1%",
        rateDesc: "المركز الثالث على مستوى الهيئة بنسبة مساهمة 15.1% وبمعدل يومي متوازن قدره 7.2 حالة.",
        kpiBadge: "المركز 3 (استجابة منتظمة)",
        kpiBadgeClass: "badge-teal",
        kpiReason: "أداء مستقر ومتوازن مع تصاعد ملحوظ في الأسبوع الثاني يعكس التنسيق الميداني الفعال بين إدارات الإسماعيلية وسيناء وبورسعيد."
    },
    middle_delta: {
        name: "إقليم وسط الدلتا",
        badge: "المركز 4 (توقف 4 أيام ثم عودة)",
        badgeClass: "badge-purple",
        totalMath: "4 + 10 + 22 + 5 + 14 + 0 + 5 + 11 + 13 + 0 + 0 + 0 + 0 + 14 = 98 حالة",
        totalDesc: "إجمالي 98 حالة مع بداية قوية في الأسبوع الأول (ذروة 22 في 3-8)، تلاها انقطاع تام لـ 4 أيام متصلة (11-8 إلى 15-8) ثم استئناف في 16-8.",
        rateMath: "المتوسط: 98 ÷ 14 = 7.0 حالة/يوم | المساهمة: (98 ÷ 669) × 100 = 14.6%",
        rateDesc: "المركز الرابع مكرر بنسبة 14.6% من إجمالي الهيئة وبمتوسط يومي 7.0 حالات.",
        kpiBadge: "المركز 4 (توقف 4 أيام ثم عودة)",
        kpiBadgeClass: "badge-purple",
        kpiReason: "وجود فجوة انقطاع مفاجئة في النصف الثاني من الشهر تستوجب التنسيق مع إدارات المنوفية والغربية وكفر الشيخ لضمان استمرارية الرصد."
    },
    upper_egypt: {
        name: "إقليم مصر العليا",
        badge: "المركز 4 مكرر (تحسن وتصاعد تدريجي)",
        badgeClass: "badge-cyan",
        totalMath: "0 + 0 + 2 + 15 + 7 + 5 + 0 + 11 + 13 + 16 + 8 + 0 + 14 + 7 = 98 حالة",
        totalDesc: "إجمالي 98 حالة مع تصاعد تدريجي ملحوظ في النصف الثاني من الفترة (16 حالة في 11-8 و 14 حالة في 15-8)، مع 4 أيام صفر في البدايات.",
        rateMath: "المتوسط: 98 ÷ 14 = 7.0 حالة/يوم | المساهمة: (98 ÷ 669) × 100 = 14.6%",
        rateDesc: "المركز الرابع مكرر بمساهمة 14.6% ومتوسط يومي 7.0 حالات.",
        kpiBadge: "المركز 4 مكرر (تحسن وتصاعد تدريجي)",
        kpiBadgeClass: "badge-cyan",
        kpiReason: "منحنى أداء متصاعد ومبشر يعكس زيادة نشاط لجان المعاينة وحصر التعديات وتكثيف المرور الميداني في قنا وأسوان وسوهاج."
    },
    west_delta: {
        name: "إقليم غرب الدلتا",
        badge: "المركز الأخير (توقف حرج 5 أيام)",
        badgeClass: "badge-rose",
        totalMath: "15 + 7 + 7 + 6 + 6 + 0 + 0 + 2 + 1 + 0 + 0 + 0 + 0 + 0 = 44 حالة",
        totalDesc: "إجمالي 44 حالة فقط، منها 41 حالة أرسلت في أول 5 أيام، وتوقف تام وشلل كامل بعدها (5 أيام متتالية صفر من 11-8 إلى 16-8).",
        rateMath: "المتوسط: 44 ÷ 14 = 3.1 حالة/يوم | المساهمة: (44 ÷ 669) × 100 = 6.6%",
        rateDesc: "أدنى إقليم بالهيئة بمساهمة 6.6% فقط ومتوسط 3.1 حالة/يوم (أقل من نصف متوسط باقي الأقاليم).",
        kpiBadge: "المركز الأخير (توقف حرج 5 أيام)",
        kpiBadgeClass: "badge-rose",
        kpiReason: "يتطلب تشكيل لجنة دعم وتدخل ميداني عاجلة لمعالجة معوقات الرفع المساحي وحسم التسعير بالبحيرة لكسر حاجز الصفر المستمر."
    },
    all: {
        name: "الإجمالي العام للهيئة",
        badge: "فجوة عجز 68.1% (تستوجب كوتة ملزمة)",
        badgeClass: "badge-rose",
        totalMath: "167 (شرق) + 161 (وسطى) + 101 (قناة) + 98 (وسط) + 98 (عليا) + 44 (غرب) = 669 حالة",
        totalDesc: "إجمالي ما تم إرساله فعلياً من الأقاليم الستة على مدار 14 يوم عمل من 1-8 إلى 16-8-2026.",
        rateMath: "نسبة الإنجاز: (669 ÷ 2,100 مستهدف) × 100 = 31.9% | فجوة العجز: 2,100 - 669 = 1,431 حالة (68.1%)",
        rateDesc: "تحقيق ثلث المستهدف الإلزامي فقط بمتوسط 47.8 حالة/يوم مقارنة بالمستهدف المحدد بـ 150 حالة/يوم.",
        kpiBadge: "فجوة عجز 68.1% (تستوجب كوتة ملزمة)",
        kpiBadgeClass: "badge-rose",
        kpiReason: "إلزام الأقاليم بكوتة يومية صارمة (شرق الدلتا 35، مصر الوسطى 35، وسط 25، غرب 25، قناة 15، عليا 15) مع تقرير نبض يومي الساعة 2:00 ظهراً."
    }
};

function selectDailyMethodologyRegion(regionKey) {
    const data = dailyMethodologyData[regionKey];
    if (!data) return;

    // Update Daily Chips
    document.querySelectorAll('.daily-methodology-region-chips .m-chip').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-target') === regionKey);
    });

    // Update Daily Table Rows
    document.querySelectorAll('.daily-matrix-table tbody tr.clickable-daily-row').forEach(row => {
        row.classList.toggle('selected-row', row.getAttribute('data-region') === regionKey);
    });

    // Update Daily Badge
    const badgeEl = document.getElementById('dailyMethodologyRegionBadge');
    if (badgeEl) {
        badgeEl.textContent = data.name;
        badgeEl.className = `badge ${data.badgeClass}`;
    }

    // Update Daily Math Cards
    const totalMath = document.getElementById('dTotalMath');
    const totalDesc = document.getElementById('dTotalDesc');
    const rateMath = document.getElementById('dRateMath');
    const rateDesc = document.getElementById('dRateDesc');
    const kpiBadge = document.getElementById('dKpiBadge');
    const kpiDesc = document.getElementById('dKpiDesc');

    if (totalMath) totalMath.textContent = data.totalMath;
    if (totalDesc) totalDesc.textContent = data.totalDesc;
    if (rateMath) rateMath.textContent = data.rateMath;
    if (rateDesc) rateDesc.textContent = data.rateDesc;
    if (kpiBadge) {
        kpiBadge.textContent = data.kpiBadge;
        kpiBadge.className = `badge ${data.kpiBadgeClass}`;
    }
    if (kpiDesc) kpiDesc.textContent = data.kpiReason;
}

function initDailyMethodology() {
    // Listeners for Daily Chips
    document.querySelectorAll('.daily-methodology-region-chips .m-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            selectDailyMethodologyRegion(target);
        });
    });

    // Listeners for Daily Table Rows
    document.querySelectorAll('.daily-matrix-table tbody tr.clickable-daily-row').forEach(row => {
        row.addEventListener('click', () => {
            const target = row.getAttribute('data-region');
            selectDailyMethodologyRegion(target);
        });
    });
}

// ----------------------------------------------------
// Daily Licenses Flow Methodology & Calculations Engine
// ----------------------------------------------------
const licensesMethodologyData = {
    east_delta: {
        name: "إقليم شرق الدلتا",
        badge: "المركز 1 (أعلى مساهمة وتدفق مستمر)",
        badgeClass: "badge-emerald",
        totalMath: "5 + 6 + 117 + 125 + 163 + 163 + 81 + 79 + 134 = 873 ترخيصاً",
        totalDesc: "مجموع التراخيص المرسلة من الإدارات عبر 9 أيام عمل (8-8 إلى 17-8-2026)، مع ذروة نشاط في 12 و 13 أغسطس (163 ترخيصاً)، واستمرارية 100% دون انقطاع.",
        rateMath: "المتوسط: 873 ÷ 9 = 97.0 ترخيصاً/يوم | المساهمة: (873 ÷ 1,979) × 100 = 44.1%",
        rateDesc: "يتصدر المركز الأول بالهيئة بنسبة 44.1% وبمعدل تدفق يومي قياسي 97 ترخيصاً/يوم، ويشكل مع وسط الدلتا 83.3% من تراخيص الهيئة.",
        kpiBadge: "المركز 1 (أعلى مساهمة وتدفق مستمر)",
        kpiBadgeClass: "badge-emerald",
        kpiReason: "أداء استثنائي وتدفق وثائقي منضبط يعكس الجاهزية الكاملة لقواعد بيانات التراخيص بإدارات شرق الدلتا وسرعة إرسالها للربط بالمنظومة الرقمية."
    },
    middle_delta: {
        name: "إقليم وسط الدلتا",
        badge: "المركز 2 (أعلى ذروة يومية 319)",
        badgeClass: "badge-cyan",
        totalMath: "0 + 36 + 22 + 152 + 319 + 201 + 40 + 5 + 0 = 775 ترخيصاً",
        totalDesc: "حقق أعلى ذروة تدفق يومي على الإطلاق بالهيئة (319 ترخيصاً يوم 12-8)، وإجمالي 775 ترخيصاً رغم البداية البطيئة وتوقف الإرسال في اليوم الأخير.",
        rateMath: "المتوسط: 775 ÷ 9 = 86.1 ترخيصاً/يوم | المساهمة: (775 ÷ 1,979) × 100 = 39.2%",
        rateDesc: "المركز الثاني على مستوى الجمهورية بنسبة مساهمة 39.2% وبمعدل يومي قوي 86.1 ترخيصاً/يوم.",
        kpiBadge: "المركز 2 (أعلى ذروة يومية 319)",
        kpiBadgeClass: "badge-cyan",
        kpiReason: "قدرة استيعابية هائلة لإنهاء ملفات التراخيص بدفعات مركزة ضخمة، مع الحاجة لضمان استمرارية الإرسال اليومي المنتظم حتى انتهاء الحصر."
    },
    upper_egypt: {
        name: "إقليم مصر العليا",
        badge: "المركز 3 (تدفق متوسط متقطع)",
        badgeClass: "badge-amber",
        totalMath: "0 + 0 + 20 + 35 + 22 + 20 + 30 + 0 + 26 = 153 ترخيصاً",
        totalDesc: "إجمالي 153 ترخيصاً موزعة على 6 أيام عمل نشطة بذروة 35 ترخيصاً في 11-8، مقابل 3 أيام صفرية (8 و 9 و 16 أغسطس).",
        rateMath: "المتوسط: 153 ÷ 9 = 17.0 ترخيصاً/يوم | المساهمة: (153 ÷ 1,979) × 100 = 7.7%",
        rateDesc: "المركز الثالث بنسبة 7.7% من إجمالي تراخيص الهيئة وبمعدل 17.0 ترخيصاً/يوم.",
        kpiBadge: "المركز 3 (تدفق متوسط متقطع)",
        kpiBadgeClass: "badge-amber",
        kpiReason: "معدل تدفق مرضي مع ضرورة استكمال حصر باقي التراخيص الصادرة بالمحافظات الجنوبية وتفادي فترات التوقف."
    },
    middle_egypt: {
        name: "إقليم مصر الوسطى",
        badge: "المركز 4 (استجابة تدريجية منتظمة)",
        badgeClass: "badge-purple",
        totalMath: "0 + 6 + 33 + 24 + 14 + 10 + 0 + 8 + 8 = 105 تراخيص",
        totalDesc: "إجمالي 105 تراخيص عبر 7 أيام نشطة وسجل أعلى إرسال في 10-8 بواقع 33 ترخيصاً، مع انقطاع في يومين (8 و 15 أغسطس).",
        rateMath: "المتوسط: 105 ÷ 9 = 11.7 ترخيصاً/يوم | المساهمة: (105 ÷ 1,979) × 100 = 5.3%",
        rateDesc: "المركز الرابع بنسبة 5.3% ومتوسط يومي 11.7 ترخيصاً.",
        kpiBadge: "المركز 4 (استجابة تدريجية منتظمة)",
        kpiBadgeClass: "badge-purple",
        kpiReason: "إرسال يومي مستقر نسبياً مع الحاجة لرفع وتيرة الحصر بإدارات بني سويف والمنيا والفيوم."
    },
    west_delta: {
        name: "إقليم غرب الدلتا",
        badge: "المركز 5 (تراجع حاد وانقطاع 3 أيام)",
        badgeClass: "badge-rose",
        totalMath: "2 + 21 + 16 + 0 + 0 + 0 + 13 + 8 + 6 = 66 ترخيصاً",
        totalDesc: "إجمالي 66 ترخيصاً فقط مع انقطاع تام لـ 3 أيام متتالية (11 و 12 و 13 أغسطس) ثم استئناف بطيء بمعدل محدود.",
        rateMath: "المتوسط: 66 ÷ 9 = 7.3 ترخيصاً/يوم | المساهمة: (66 ÷ 1,979) × 100 = 3.3%",
        rateDesc: "المركز الخامس بنسبة 3.3% ومتوسط يومي متدنٍ قدره 7.3 ترخيصاً/يوم.",
        kpiBadge: "المركز 5 (تراجع حاد وانقطاع 3 أيام)",
        kpiBadgeClass: "badge-rose",
        kpiReason: "مستوى إرسال ضعيف لا يتناسب مع حجم الرقعة المخدومة بغرب الدلتا والبحيرة، ويتطلب تدخلاً إدارياً لتسريع إرسال التراخيص السارية."
    },
    canal_sinai: {
        name: "إقليم القناة وسيناء",
        badge: "المركز الأخير (حصر محدود - 8 أيام صفر)",
        badgeClass: "badge-rose",
        totalMath: "0 + 0 + 0 + 0 + 0 + 7 + 0 + 0 + 0 = 7 تراخيص",
        totalDesc: "إرسال 7 تراخيص فقط في يوم واحد (13-8) وصفر تام في باقي الأيام الـ 8 من فترة المتابعة.",
        rateMath: "المتوسط: 7 ÷ 9 = 0.8 ترخيص/يوم | المساهمة: (7 ÷ 1,979) × 100 = 0.4%",
        rateDesc: "المركز الأخير بنسبة 0.4% فقط من تراخيص الهيئة.",
        kpiBadge: "المركز الأخير (حصر محدود - 8 أيام صفر)",
        kpiBadgeClass: "badge-rose",
        kpiReason: "حصر محدود جداً يستوجب توجيه لجان التراخيص بالقناة وبورسعيد وسيناء لحصر ومراجعة التراخيص السارية والمنتهية للربط بالمنظومة."
    },
    all: {
        name: "إجمالي الهيئة ككل",
        badge: "إدخال 67.2% • مراجعة 32.8%",
        badgeClass: "badge-teal",
        totalMath: "873 (شرق) + 775 (وسط) + 153 (عليا) + 105 (وسطى) + 66 (غرب) + 7 (قناة) = 1,979 ترخيصاً",
        totalDesc: "إجمالي التراخيص الواردة من الإدارات العامة بالهيئة خلال 9 أيام (8-8 إلى 17-8-2026).",
        rateMath: "تم إدخالها بالمنظومة: 1,330 ترخيصاً (67.2%) | قيد المراجعة والتدقيق: 649 ترخيصاً (32.8%) | المتوسط اليومي: 219.9 ترخيصاً/يوم",
        rateDesc: "سجلت الهيئة ذروة تدفق كبرى يوم 12 أغسطس بإجمالي 518 ترخيصاً، ويتركز 83.3% من التراخيص في إقليمي شرق ووسط الدلتا.",
        kpiBadge: "إدخال 67.2% • مراجعة 32.8%",
        kpiBadgeClass: "badge-teal",
        kpiReason: "إلزام لجان التراخيص بالأقاليم بإنهاء تدقيق الـ 649 ترخيصاً المتبقية خلال 10 أيام عمل لرفع نسبة الإدخال بالمنظومة إلى 100% وتحصيل كافة مستحقات الدولة."
    }
};

function selectLicensesMethodologyRegion(regionKey) {
    const data = licensesMethodologyData[regionKey];
    if (!data) return;

    // Update Licenses Chips
    document.querySelectorAll('.licenses-methodology-region-chips .m-chip').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-target') === regionKey);
    });

    // Update Licenses Table Rows
    document.querySelectorAll('.daily-matrix-table tbody tr.clickable-licenses-row').forEach(row => {
        row.classList.toggle('selected-row', row.getAttribute('data-region') === regionKey);
    });

    // Update Licenses Badge
    const badgeEl = document.getElementById('licensesMethodologyRegionBadge');
    if (badgeEl) {
        badgeEl.textContent = data.name;
        badgeEl.className = `badge ${data.badgeClass}`;
    }

    // Update Licenses Math Cards
    const totalMath = document.getElementById('lTotalMath');
    const totalDesc = document.getElementById('lTotalDesc');
    const rateMath = document.getElementById('lRateMath');
    const rateDesc = document.getElementById('lRateDesc');
    const kpiBadge = document.getElementById('lKpiBadge');
    const kpiDesc = document.getElementById('lKpiDesc');

    if (totalMath) totalMath.textContent = data.totalMath;
    if (totalDesc) totalDesc.textContent = data.totalDesc;
    if (rateMath) rateMath.textContent = data.rateMath;
    if (rateDesc) rateDesc.textContent = data.rateDesc;
    if (kpiBadge) {
        kpiBadge.textContent = data.kpiBadge;
        kpiBadge.className = `badge ${data.kpiBadgeClass}`;
    }
    if (kpiDesc) kpiDesc.textContent = data.kpiReason;
}

function initLicensesMethodology() {
    // Listeners for Licenses Chips
    document.querySelectorAll('.licenses-methodology-region-chips .m-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            selectLicensesMethodologyRegion(target);
        });
    });

    // Listeners for Licenses Table Rows
    document.querySelectorAll('.daily-matrix-table tbody tr.clickable-licenses-row').forEach(row => {
        row.addEventListener('click', () => {
            const target = row.getAttribute('data-region');
            selectLicensesMethodologyRegion(target);
        });
    });
}

// ----------------------------------------------------
// Daily Parallel Contracts Flow Methodology & Calculations Engine
// ----------------------------------------------------
const contractsMethodologyData = {
    middle_egypt: {
        name: "إقليم مصر الوسطى",
        badge: "المركز 1 (ريادة مطلقة - 77.8% من الهيئة)",
        badgeClass: "badge-emerald",
        totalMath: "28 + 8 + 5 + 24 + 19 + 0 + 0 + 5 = 84 عقداً",
        totalDesc: "مجموع العقود المرسلة من إدارات مصر الوسطى عبر 8 أيام متابعة (8-8 إلى 16-8-2026)، وسجل أعلى ذروة يومية بالهيئة في 8 أغسطس (28 عقداً) و 24 عقداً في 11 و 12 أغسطس.",
        rateMath: "المتوسط: 84 ÷ 8 = 10.5 عقد/يوم | المساهمة: (84 ÷ 108) × 100 = 77.8%",
        rateDesc: "يتصدر المركز الأول بالهيئة باكتساح مطلق بنسبة 77.8% من إجمالي عقود الهيئة وبمعدل تدفق 10.5 عقد/يوم عبر 6 أيام عمل نشطة.",
        kpiBadge: "المركز 1 (ريادة مطلقة - 77.8% من الهيئة)",
        kpiBadgeClass: "badge-emerald",
        kpiReason: "كفاءة إدارية وقانونية استثنائية في سرعة استيفاء وتوثيق العقود وتحويل التوافق الميداني إلى مستندات تعاقدية ملزمة محصلة."
    },
    east_delta: {
        name: "إقليم شرق الدلتا",
        badge: "المركز 2 (تدفق متقطع بـ 4 أيام نشطة)",
        badgeClass: "badge-cyan",
        totalMath: "7 + 1 + 0 + 0 + 5 + 0 + 0 + 5 = 18 عقداً",
        totalDesc: "إجمالي 18 عقداً مرسلة عبر 4 أيام نشطة بذروة 7 عقود يوم 8-8 و 5 عقود في 12 و 16 أغسطس، مقابل 4 أيام توقف تام.",
        rateMath: "المتوسط: 18 ÷ 8 = 2.25 عقد/يوم | المساهمة: (18 ÷ 108) × 100 = 16.7%",
        rateDesc: "المركز الثاني على مستوى الهيئة بنسبة مساهمة 16.7% وبمعدل تدفق 2.25 عقد/يوم.",
        kpiBadge: "المركز 2 (تدفق متقطع بـ 4 أيام نشطة)",
        kpiBadgeClass: "badge-cyan",
        kpiReason: "معدل تدفق جيد مع الحاجة لتكثيف التنسيق مع إدارات شرق الدلتا لرفع وتيرة التوقيع وتحويل الممتنعين لعقود مبرمة."
    },
    upper_egypt: {
        name: "إقليم مصر العليا",
        badge: "المركز 3 (إرسال محدود - يوم واحد فقط)",
        badgeClass: "badge-amber",
        totalMath: "0 + 1 + 0 + 0 + 0 + 0 + 0 + 0 = 1 عقد",
        totalDesc: "إرسال عقد واحد فقط في يوم 9 أغسطس، وصفر عقود في باقي الأيام الـ 7 من فترة المتابعة.",
        rateMath: "المتوسط: 1 ÷ 8 = 0.13 عقد/يوم | المساهمة: (1 ÷ 108) × 100 = 0.9%",
        rateDesc: "المركز الثالث بنسبة مساهمة محدودة 0.9% ومتوسط 0.13 عقد/يوم.",
        kpiBadge: "المركز 3 (إرسال محدود - يوم واحد فقط)",
        kpiBadgeClass: "badge-amber",
        kpiReason: "إرسال محدود يستوجب حث لجان البت بمحافظات الصعيد على سرعة توثيق العقود للمواطنين الذين سددوا المقدمات."
    },
    west_delta: {
        name: "إقليم غرب الدلتا",
        badge: "انقطاع تام (صفر عقود طوال 8 أيام)",
        badgeClass: "badge-rose",
        totalMath: "0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 = 0 عقد",
        totalDesc: "سجل الإقليم صفراً تاماً في كافة أيام المتابعة الـ 8 دون إرسال أي عقد مبرم.",
        rateMath: "المتوسط: 0 ÷ 8 = 0.0 عقد/يوم | المساهمة: 0.0%",
        rateDesc: "عدم تسجيل أي تدفق تعاقدي خلال الفترة المذكورة.",
        kpiBadge: "انقطاع تام (صفر عقود طوال 8 أيام)",
        kpiBadgeClass: "badge-rose",
        kpiReason: "يتطلب تدخلاً إدارياً عاجلاً لحسم معوقات التسعير بالبحيرة وغرب الدلتا لسرعة بدء إبرام العقود وتوريد مستحقات الدولة."
    },
    middle_delta: {
        name: "إقليم وسط الدلتا",
        badge: "انقطاع تام (صفر عقود طوال 8 أيام)",
        badgeClass: "badge-rose",
        totalMath: "0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 = 0 عقد",
        totalDesc: "سجل الإقليم صفراً تاماً في كافة أيام المتابعة الـ 8 دون إرسال أي عقد مبرم.",
        rateMath: "المتوسط: 0 ÷ 8 = 0.0 عقد/يوم | المساهمة: 0.0%",
        rateDesc: "عدم تسجيل أي تدفق تعاقدي خلال الفترة المذكورة.",
        kpiBadge: "انقطاع تام (صفر عقود طوال 8 أيام)",
        kpiBadgeClass: "badge-rose",
        kpiReason: "ضرورة تحفيز إدارات الغربية والمنوفية وكفر الشيخ لتحويل الحالات الصالحة إلى عقود رسمية مبرمة ومسجلة."
    },
    canal_sinai: {
        name: "إقليم القناة وسيناء",
        badge: "انقطاع تام (صفر عقود طوال 8 أيام)",
        badgeClass: "badge-rose",
        totalMath: "0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 = 0 عقد",
        totalDesc: "سجل الإقليم صفراً تاماً في كافة أيام المتابعة الـ 8 دون إرسال أي عقد مبرم.",
        rateMath: "المتوسط: 0 ÷ 8 = 0.0 عقد/يوم | المساهمة: 0.0%",
        rateDesc: "عدم تسجيل أي تدفق تعاقدي خلال الفترة المذكورة.",
        kpiBadge: "انقطاع تام (صفر عقود طوال 8 أيام)",
        kpiBadgeClass: "badge-rose",
        kpiReason: "توجيه إدارات الإسماعيلية وسيناء وبورسعيد لمتابعة طالبي التقنين المستوفين لإنهاء توقيع العقود."
    },
    all: {
        name: "إجمالي الهيئة ككل",
        badge: "تركز 94.5% بوسطى وشرق الدلتا",
        badgeClass: "badge-teal",
        totalMath: "84 (وسطى) + 18 (شرق) + 1 (عليا) + 0 (غرب) + 0 (وسط) + 0 (قناة) = 108 عقود",
        totalDesc: "إجمالي العقود الواردة من الإدارات العامة بالهيئة خلال 8 أيام متابعة (8-8 إلى 16-8-2026).",
        rateMath: "المتوسط اليومي للهيئة: 108 ÷ 8 = 13.5 عقد/يوم | نسبة التركيز: (102 ÷ 108) × 100 = 94.5%",
        rateDesc: "حققت الهيئة ذروة تعاقدية كبرى يوم 8-8 بواقع 35 عقداً، ويتركز 94.5% من العقود في إقليمي مصر الوسطى وشرق الدلتا.",
        kpiBadge: "تركز 94.5% بوسطى وشرق الدلتا",
        kpiBadgeClass: "badge-teal",
        kpiReason: "إلزام لجان التعاقد بالأقاليم الصفرية الثلاثة (غرب، وسط، قناة) بإنهاء وتوريد عقود الحالات الصالحة لرفع معدل التحصيل العام."
    }
};

function selectContractsMethodologyRegion(regionKey) {
    const data = contractsMethodologyData[regionKey];
    if (!data) return;

    // Update Contracts Chips
    document.querySelectorAll('.contracts-methodology-region-chips .m-chip').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-target') === regionKey);
    });

    // Update Contracts Table Rows
    document.querySelectorAll('#dailyContractsTable tbody tr.clickable-contracts-row').forEach(row => {
        row.classList.toggle('selected-row', row.getAttribute('data-region') === regionKey);
    });

    // Update Contracts Badge
    const badgeEl = document.getElementById('contractsMethodologyRegionBadge');
    if (badgeEl) {
        badgeEl.textContent = data.name;
        badgeEl.className = `badge ${data.badgeClass}`;
    }

    // Update Contracts Math Cards
    const totalMath = document.getElementById('cTotalMath');
    const totalDesc = document.getElementById('cTotalDesc');
    const rateMath = document.getElementById('cRateMath');
    const rateDesc = document.getElementById('cRateDesc');
    const kpiBadge = document.getElementById('cKpiBadge');
    const kpiDesc = document.getElementById('cKpiDesc');

    if (totalMath) totalMath.textContent = data.totalMath;
    if (totalDesc) totalDesc.textContent = data.totalDesc;
    if (rateMath) rateMath.textContent = data.rateMath;
    if (rateDesc) rateDesc.textContent = data.rateDesc;
    if (kpiBadge) {
        kpiBadge.textContent = data.kpiBadge;
        kpiBadge.className = `badge ${data.kpiBadgeClass}`;
    }
    if (kpiDesc) kpiDesc.textContent = data.kpiReason;
}

function initContractsMethodology() {
    // Listeners for Contracts Chips
    document.querySelectorAll('.contracts-methodology-region-chips .m-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            selectContractsMethodologyRegion(target);
        });
    });

    // Listeners for Contracts Table Rows
    document.querySelectorAll('#dailyContractsTable tbody tr.clickable-contracts-row').forEach(row => {
        row.addEventListener('click', () => {
            const target = row.getAttribute('data-region');
            selectContractsMethodologyRegion(target);
        });
    });
}

