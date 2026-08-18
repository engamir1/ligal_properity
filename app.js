/**
 * Egyptian State Land Regularization Executive Dashboard Script
 * 15-Slide Modular Architecture + Dual-Theme Synchronization
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

    // 5. Line & Area Chart - Daily Encroachments vs Target (150/Day)
    const ctxDaily = document.getElementById('chartDailyEncroachmentsTarget')?.getContext('2d');
    if (ctxDaily) {
        chartInstances.daily = new Chart(ctxDaily, {
            type: 'line',
            data: {
                labels: ['1-8', '2-8', '3-8', '4-8', '5-8', '6-8', '8-8', '9-8', '10-8', '11-8', '12-8', '13-8', '15-8', '16-8', '17-8', '18-8'],
                datasets: [
                    {
                        label: 'المستهدف اليومي الإلزامي (150 حالة/يوم)',
                        data: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
                        borderColor: '#f43f5e',
                        borderWidth: 2,
                        borderDash: [6, 6],
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'المرسل الفعلي من الأقاليم (إجمالي الهيئة)',
                        data: [33, 39, 90, 86, 83, 39, 27, 43, 48, 34, 54, 26, 28, 39, 18, 34],
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

    // 6. Doughnut Chart - Regional Encroachments (5,062 Cases)
    const ctxEncroachments = document.getElementById('chartEncroachmentsRegional')?.getContext('2d');
    if (ctxEncroachments) {
        chartInstances.encroachments = new Chart(ctxEncroachments, {
            type: 'doughnut',
            data: {
                labels: ['مصر الوسطى (1500)', 'شرق الدلتا (1211)', 'وسط الدلتا (1098)', 'غرب الدلتا (461)', 'القناة وسيناء (413)', 'مصر العليا (379)'],
                datasets: [{
                    data: [1500, 1211, 1098, 461, 413, 379],
                    backgroundColor: ['#a855f7', '#14b8a6', '#06b6d4', '#f59e0b', '#3b82f6', '#f43f5e'],
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
