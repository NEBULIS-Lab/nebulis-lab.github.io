// NEBULIS Lab Website Main JavaScript
// 基于guide.txt中的交互需求

document.addEventListener('DOMContentLoaded', function() {
    // 导航栏功能
    initNavigation();
    
    // 移动端菜单切换
    initMobileMenu();
    
    // 平滑滚动
    initSmoothScroll();
    
    // 表单处理
    initForms();
    
    // 搜索功能
    initSearch();
    
    // 动画效果
    initAnimations();
    
    // 自动更新年份
    updateCurrentYear();
    
    // 确保年份更新在页面完全加载后执行
    setTimeout(updateCurrentYear, 100);
});

// 导航栏功能
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // 滚动时添加/移除背景
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        // 滚动方向检测（可选：隐藏/显示导航栏）
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // 向下滚动，隐藏导航栏
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// 移动端菜单切换
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('mobile-open');
        
        if (isOpen) {
            navMenu.classList.remove('mobile-open');
            navToggle.setAttribute('aria-expanded', 'false');
        } else {
            navMenu.classList.add('mobile-open');
            navToggle.setAttribute('aria-expanded', 'true');
        }
    });
    
    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('mobile-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// 平滑滚动
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const offsetTop = target.offsetTop - 80; // 考虑固定导航栏高度
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

// 表单处理
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // 显示加载状态
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = '处理中...';
                submitBtn.disabled = true;
                
                // 模拟提交（实际项目中应该发送到服务器）
                setTimeout(() => {
                    alert('表单提交成功！');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    form.reset();
                }, 2000);
            }
        });
    });
}

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length < 2) {
                // 显示所有结果
                showAllResults();
                return;
            }
            
            // 执行搜索
            performSearch(query);
        }, 300);
    });
}

// 显示所有结果
function showAllResults() {
    const peopleGrid = document.getElementById('people-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (peopleGrid) {
        const cards = peopleGrid.querySelectorAll('.person-card');
        cards.forEach(card => {
            card.style.display = 'block';
        });
    }
    
    if (emptyState) {
        emptyState.style.display = 'none';
    }
}

// 执行搜索
function performSearch(query) {
    const peopleGrid = document.getElementById('people-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!peopleGrid) return;
    
    const cards = peopleGrid.querySelectorAll('.person-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const name = card.querySelector('.person-name')?.textContent.toLowerCase() || '';
        const role = card.querySelector('.person-role')?.textContent.toLowerCase() || '';
        const areas = card.querySelector('.person-areas')?.textContent.toLowerCase() || '';
        
        const searchText = `${name} ${role} ${areas}`;
        
        if (searchText.includes(query)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // 显示/隐藏空状态
    if (emptyState) {
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }
}

// 动画效果
function initAnimations() {
    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.showcase-card, .post-card, .person-card, .resource-card, .initiative-card, .partner-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 人员筛选功能
function initPeopleFilter() {
    const roleFilter = document.getElementById('role-filter');
    const letterFilter = document.getElementById('letter-filter');
    const searchInput = document.getElementById('search-input');
    
    if (!roleFilter || !letterFilter || !searchInput) return;
    
    // 组合筛选
    function applyFilters() {
        const role = roleFilter.value;
        const letter = letterFilter.value;
        const search = searchInput.value.toLowerCase();
        
        const peopleGrid = document.getElementById('people-grid');
        const emptyState = document.getElementById('empty-state');
        
        if (!peopleGrid) return;
        
        const cards = peopleGrid.querySelectorAll('.person-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const name = card.querySelector('.person-name')?.textContent.toLowerCase() || '';
            const roleText = card.querySelector('.person-role')?.textContent.toLowerCase() || '';
            const areas = card.querySelector('.person-areas')?.textContent.toLowerCase() || '';
            
            let show = true;
            
            // 角色筛选
            if (role && roleText !== role) {
                show = false;
            }
            
            // 字母筛选
            if (letter && !name.startsWith(letter.toLowerCase())) {
                show = false;
            }
            
            // 搜索筛选
            if (search && !`${name} ${roleText} ${areas}`.includes(search)) {
                show = false;
            }
            
            if (show) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // 显示/隐藏空状态
        if (emptyState) {
            if (visibleCount === 0) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
            }
        }
    }
    
    // 绑定事件
    roleFilter.addEventListener('change', applyFilters);
    letterFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
}

// 工具函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 自动更新年份
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    
    console.log('Updating year to:', currentYear);
    console.log('Found elements:', yearElements.length);
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
        console.log('Updated element:', element);
    });
}

// 导出函数供其他脚本使用
window.NEBULIS = {
    initPeopleFilter,
    performSearch,
    showAllResults,
    updateCurrentYear
};
