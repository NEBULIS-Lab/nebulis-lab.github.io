// NEBULIS Lab Language Switch JavaScript
// Bilingual Chinese-English language switching functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize language switching
    initLanguageSwitch();
    
    // Read saved language setting from localStorage, default to English
    const savedLang = localStorage.getItem('nebulis-lang') || 'en';
    setLanguage(savedLang);
    
    // Ensure year is updated after language setting
    setTimeout(updateCurrentYear, 100);
});

// Initialize language switching functionality
function initLanguageSwitch() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            
            // Save language setting to localStorage
            localStorage.setItem('nebulis-lang', lang);
        });
    });
}

// Set language
function setLanguage(lang) {
    // Update language button states
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update page content
    updatePageContent(lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    
    // Update page title
    updatePageTitle(lang);
    
    // Reset year (because language switching overwrites the year)
    updateCurrentYear();
}

// Update year function
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// Update page content
function updatePageContent(lang) {
    // Update all elements with data-zh and data-en attributes
    const elements = document.querySelectorAll('[data-zh][data-en]');
    
    elements.forEach(element => {
        const zhText = element.getAttribute('data-zh');
        const enText = element.getAttribute('data-en');
        
        // Check if element contains year element
        const hasYearElement = element.querySelector('#current-year');
        
        if (hasYearElement) {
            // If contains year element, special handling required
            if (lang === 'zh') {
                element.innerHTML = zhText.replace('NEBULIS Lab.', '<span id="current-year"></span> NEBULIS Lab.');
            } else {
                element.innerHTML = enText.replace('NEBULIS Lab.', '<span id="current-year"></span> NEBULIS Lab.');
            }
        } else {
            // Regular elements use textContent
            if (lang === 'zh') {
                element.textContent = zhText;
            } else {
                element.textContent = enText;
            }
        }
    });
    
    // Update placeholder attributes
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
    
    // Update aria-label attributes
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
    
    // Update navigation link active states
    updateNavigationActiveState();
    
    // Trigger language change event
    const event = new CustomEvent('languageChanged', {
        detail: { lang: lang }
    });
    document.dispatchEvent(event);
}

// Update page title
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
            'initiatives': 'Projects - NEBULIS Lab',
            'affiliates': 'Partners - NEBULIS Lab',
            'login': 'Login - NEBULIS Lab',
            '404': 'Page Not Found - NEBULIS Lab'
        }
    };
    
    // Get current page type
    const currentPage = getCurrentPageType();
    const title = titles[lang][currentPage];
    
    if (title) {
        document.title = title;
    }
}

// Get current page type
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

// Update navigation link active state
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

// Get current language
function getCurrentLanguage() {
    return localStorage.getItem('nebulis-lang') || 'en';
}

// Export functions for use by other scripts
window.LanguageSwitch = {
    setLanguage,
    getCurrentLanguage,
    updatePageContent
};
