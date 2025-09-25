// NEBULIS Lab Language Switch JavaScript
// 中英文双语切换功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化语言切换
    initLanguageSwitch();
    
    // 从localStorage读取保存的语言设置，默认为英文
    const savedLang = localStorage.getItem('nebulis-lang') || 'en';
    setLanguage(savedLang);
    
    // 确保年份在语言设置后更新
    setTimeout(updateCurrentYear, 100);
});

// 初始化语言切换功能
function initLanguageSwitch() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            
            // 保存语言设置到localStorage
            localStorage.setItem('nebulis-lang', lang);
        });
    });
}

// 设置语言
function setLanguage(lang) {
    // 更新语言按钮状态
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // 更新页面内容
    updatePageContent(lang);
    
    // 更新HTML lang属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    
    // 更新页面标题
    updatePageTitle(lang);
    
    // 重新设置年份（因为语言切换会覆盖年份）
    updateCurrentYear();
}

// 更新年份函数
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// 更新页面内容
function updatePageContent(lang) {
    // 更新所有带有data-zh和data-en属性的元素
    const elements = document.querySelectorAll('[data-zh][data-en]');
    
    elements.forEach(element => {
        const zhText = element.getAttribute('data-zh');
        const enText = element.getAttribute('data-en');
        
        // 检查是否包含年份元素
        const hasYearElement = element.querySelector('#current-year');
        
        if (hasYearElement) {
            // 如果包含年份元素，需要特殊处理
            if (lang === 'zh') {
                element.innerHTML = zhText.replace('NEBULIS Lab.', '<span id="current-year"></span> NEBULIS Lab.');
            } else {
                element.innerHTML = enText.replace('NEBULIS Lab.', '<span id="current-year"></span> NEBULIS Lab.');
            }
        } else {
            // 普通元素使用textContent
            if (lang === 'zh') {
                element.textContent = zhText;
            } else {
                element.textContent = enText;
            }
        }
    });
    
    // 更新placeholder属性
    const inputs = document.querySelectorAll('input[data-zh-placeholder][data-en-placeholder]');
    inputs.forEach(input => {
        const zhPlaceholder = input.getAttribute('data-zh-placeholder');
        const enPlaceholder = input.getAttribute('data-en-placeholder');
        
        if (lang === 'zh') {
            input.placeholder = zhPlaceholder;
        } else {
            input.placeholder = enPlaceholder;
        }
    });
    
    // 更新aria-label属性
    const ariaElements = document.querySelectorAll('[data-zh][data-en][aria-label]');
    ariaElements.forEach(element => {
        const zhText = element.getAttribute('data-zh');
        const enText = element.getAttribute('data-en');
        
        if (lang === 'zh') {
            element.setAttribute('aria-label', zhText);
        } else {
            element.setAttribute('aria-label', enText);
        }
    });
    
    // Update alt attributes for images
    const imageElements = document.querySelectorAll('img[data-zh][data-en]');
    imageElements.forEach(element => {
        const zhText = element.getAttribute('data-zh');
        const enText = element.getAttribute('data-en');
        
        if (lang === 'zh') {
            element.setAttribute('alt', zhText);
        } else {
            element.setAttribute('alt', enText);
        }
    });
    
    // 更新导航链接的active状态
    updateNavigationActiveState();
    
    // 触发语言切换事件
    const event = new CustomEvent('languageChanged', {
        detail: { lang: lang }
    });
    document.dispatchEvent(event);
}

// 更新页面标题
function updatePageTitle(lang) {
    const titles = {
        'zh': {
            'index': 'NEBULIS Lab - 构建真实世界的可靠AI系统',
            'about': '关于我们 - NEBULIS Lab',
            'people': '团队成员 - NEBULIS Lab',
            'blog': '博客 - NEBULIS Lab',
            'resources': '资源 - NEBULIS Lab',
            'initiatives': '项目方向 - NEBULIS Lab',
            'affiliates': '合作伙伴 - NEBULIS Lab',
            'login': '登录 - NEBULIS Lab',
            '404': '页面未找到 - NEBULIS Lab'
        },
        'en': {
            'index': 'NEBULIS Lab - Building Reliable AI Systems for the Real World',
            'about': 'About Us - NEBULIS Lab',
            'people': 'Team Members - NEBULIS Lab',
            'blog': 'Blog - NEBULIS Lab',
            'resources': 'Resources - NEBULIS Lab',
            'initiatives': 'Initiatives - NEBULIS Lab',
            'affiliates': 'Partners - NEBULIS Lab',
            'login': 'Login - NEBULIS Lab',
            '404': 'Page Not Found - NEBULIS Lab'
        }
    };
    
    // 获取当前页面类型
    const currentPage = getCurrentPageType();
    const title = titles[lang][currentPage];
    
    if (title) {
        document.title = title;
    }
}

// 获取当前页面类型
function getCurrentPageType() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().split('.')[0];
    
    const pageMap = {
        'index': 'index',
        'about': 'about',
        'people': 'people',
        'blog': 'blog',
        'resources': 'resources',
        'initiatives': 'initiatives',
        'affiliates': 'affiliates',
        'login': 'login',
        '404': '404'
    };
    
    return pageMap[filename] || 'index';
}

// 更新导航链接的active状态
function updateNavigationActiveState() {
    const currentPage = getCurrentPageType();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (href === currentPage + '.html' || (currentPage === 'index' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// 获取当前语言
function getCurrentLanguage() {
    return localStorage.getItem('nebulis-lang') || 'en';
}

// 导出函数供其他脚本使用
window.LanguageSwitch = {
    setLanguage,
    getCurrentLanguage,
    updatePageContent
};
