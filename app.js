/**
 * Egyptian State Land Regularization Executive Dashboard Script
 * 16-Slide Modular Architecture + Dual-Theme Synchronization + Systems Animation Engine
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

// System Philosophy Animation State
let animActiveNode = 1;
let animTimer = null;
let isAnimRunning = true;
let currentAnimMode = 'contract';

document.addEventListener('DOMContentLoaded', () => {
    if (totalSlidesNumEl) totalSlidesNumEl.textContent = totalSlides;
    initTheme();
    updateSlideView(0);
    initAllCharts();
    initCounters();
    setupEventListeners();
    startSystemAnimation();
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
// Interactive System Animation Functions
// ----------------------------------------------------
const nodeDescriptions = {
    contract: {
        1: { title: "المرحلة 1: الرصد والاستشعار الميداني", desc: "تقوم لجان المرور الميدانية والإدارات بحصر التعديات وتدفق التراخيص وإدخالها فورياً على المنظومة الموازية لحفظ حقوق الدولة ومنع ترسيخ أي أمر واقع." },
        2: { title: "المرحلة 2: التدقيق والفرز الفني", desc: "تطبيق المعايير الهندسية لمنافع الصرف: تحديد الصلاحية (صالحة للتقنين 56.4% أو غير صالحة 43.6%) وفرز الممتنعين المستهدفين بالإرشاد." },
        3: { title: "المرحلة 3: الربط السيادي والمكاني", desc: "إرسال الإحداثيات والرفع المساحي الرقمي إلى هيئة المساحة العسكرية ومطابقتها مع خرائط المتغيرات المكانية الوطنية لضمان عدم وجود تداخل." },
        4: { title: "المرحلة 4: إصدار كارت الوصف المميكن", desc: "توليد كارت وصف مشفر بـ QR Code وباركود ورقم إحداثي معتمد يثبت حدود القطعة وشاغلها الفعلي وطبيعة الاستغلال." },
        5: { title: "المرحلة 5: إبرام العقد والتحصيل المالي", desc: "توقيع العقد الرسمي، سداد مقدمات ومقابل الانتفاع، وتحويل الأصل إلى مورد مالي مستدام للدولة بحماية قانونية كاملة." }
    },
    license: {
        1: { title: "المرحلة 1: طلب الترخيص بالانتفاع", desc: "استقبال طلبات التراخيص الصادرة من الإدارات والأقاليم (1,979 ترخيصاً) لحصر أوجه الانتفاع المؤقتة والمصرح بها." },
        2: { title: "المرحلة 2: مراجعة الاشتراطات الفنية", desc: "فحص ومراجعة التراخيص (تم إدخال 1,330 ترخيصاً وجارٍ تدقيق 649 ترخيصاً بالرجوع للأقاليم) لضمان عدم إعاقة أعمال التطهير والصيانة." },
        3: { title: "المرحلة 3: التوثيق الجغرافي للترخيص", desc: "توقيع موقع الترخيص بدقة على خرائط GIS الخاصة بشبكة المصارف المائية ومطابقتها مع خطوط نزع الملكية." },
        4: { title: "المرحلة 4: كارت الترخيص الرقمي", desc: "إصدار ترخيص ذكي مميكن يحدد المدة الزمنية والأنشطة المسموح بها ورسوم مقابل الانتفاع السنوية." },
        5: { title: "المرحلة 5: التحصيل الدوري والمتابعة", desc: "تحصيل رسوم الترخيص ومتابعة الالتزام بالاشتراطات ومنع تحول الترخيص إلى تعدٍ دائم أو تغيير للنشاط." }
    },
    removal: {
        1: { title: "المرحلة 1: رصد مخالفة غير قابلة للتقنين", desc: "رصد أي تعدٍ يقع داخل القطاع المائي الحرج أو حرم المصرف العام مما يعيق التدفق المائي أو يهدد سلامة الجسور." },
        2: { title: "المرحلة 2: الحسم الفني بعدم الصلاحية", desc: "إصدار قرار فني قاطع برفض التقنين (977 حالة غير صالحة) وتصنيف درجة خطورة التعدي." },
        3: { title: "المرحلة 3: اتخاذ الإجراءات القانونية", desc: "تم اتخاذ الإجراءات القانونية لعدد 764 حالة (جنح / أحكام قضائية) واستصدار القرارات اللازمة وإخطار الجهات المختصة." },
        4: { title: "المرحلة 4: الإدراج في موجات الإزالة", desc: "التنسيق مع قوات إنفاذ القانون والمحليات وتجهيز المعدات الميكانيكية للهيئة لتنفيذ الإزالة الفورية." },
        5: { title: "المرحلة 5: التنفيذ الفعلي واسترداد الأصل", desc: "إزالة التعدي بالكامل ورد الشيء لأصله واسترداد الأرض فضاء (185 حالة منفذة بنجاح) وتطبيق الحجز الإداري لمقابل الانتفاع." }
    }
};

function selectAnimNode(num) {
    animActiveNode = num;
    for (let i = 1; i <= 5; i++) {
        const node = document.getElementById(`node${i}`);
        if (node) node.classList.toggle('active-node', i === num);
    }

    const info = nodeDescriptions[currentAnimMode][num];
    const titleEl = document.getElementById('animCardTitle');
    const descEl = document.getElementById('animCardDesc');

    if (titleEl && descEl && info) {
        titleEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${info.title}`;
        descEl.textContent = info.desc;
    }
}

function switchAnimMode(mode) {
    currentAnimMode = mode;
    ['Contract', 'License', 'Removal'].forEach(m => {
        const btn = document.getElementById(`mode${m}`);
        if (btn) btn.classList.toggle('active', m.toLowerCase() === mode);
    });

    const node5Icon = document.getElementById('node5Icon');
    const node5Title = document.getElementById('node5Title');
    const node5Desc = document.getElementById('node5Desc');

    if (mode === 'contract') {
        if (node5Icon) node5Icon.innerHTML = '<i class="fa-solid fa-file-signature"></i>';
        if (node5Title) node5Title.textContent = '5. إبرام العقد والتحصيل';
        if (node5Desc) node5Desc.textContent = 'توقيع العقد وسداد الرسوم ومقابل الانتفاع';
    } else if (mode === 'license') {
        if (node5Icon) node5Icon.innerHTML = '<i class="fa-solid fa-certificate"></i>';
        if (node5Title) node5Title.textContent = '5. إصدار الترخيص والتحصيل';
        if (node5Desc) node5Desc.textContent = 'إصدار الترخيص وسداد مقابل الانتفاع الدوري';
    } else if (mode === 'removal') {
        if (node5Icon) node5Icon.innerHTML = '<i class="fa-solid fa-gavel"></i>';
        if (node5Title) node5Title.textContent = '5. الإزالة الفورية والاسترداد';
        if (node5Desc) node5Desc.textContent = 'تنفيذ الإزالة ورد الشيء لأصله فضاءً';
    }

    selectAnimNode(animActiveNode);
}

function startSystemAnimation() {
    if (animTimer) clearInterval(animTimer);
    animTimer = setInterval(() => {
        if (isAnimRunning) {
            animActiveNode = (animActiveNode % 5) + 1;
            selectAnimNode(animActiveNode);
        }
    }, 2800);
}

function toggleSystemAnimation() {
    isAnimRunning = !isAnimRunning;
    const btn = document.getElementById('btnAnimToggle');
    if (btn) {
        btn.innerHTML = isAnimRunning
            ? '<i class="fa-solid fa-pause"></i> إيقاف مؤقت'
            : '<i class="fa-solid fa-play"></i> تشغيل المحاكاة';
    }
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
                        data: [213, 471, 114, 4, 52, 67],
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
                        labels: { boxWidth: 14, padding: 14, font: { size: 12, weight: 'bold' } }
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
                        labels: { boxWidth: 12, padding: 10, font: { size: 11, weight: 'bold' } }
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
