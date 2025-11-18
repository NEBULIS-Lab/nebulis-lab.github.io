// NEBULIS Lab Website Main JavaScript
// Based on interaction requirements from guide.txt

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initNavigation();
    
    // Mobile menu toggle
    initMobileMenu();
    
    // Smooth scrolling
    initSmoothScroll();
    
    // Form handling
    initForms();
    
    // Search functionality
    initSearch();
    
    // Animation effects
    initAnimations();
    
    // Pagination functionality
    initPagination();
    
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove background when scrolling
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(216, 235, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.borderBottomColor = 'rgba(168, 200, 238, 0.6)';
        } else {
            navbar.style.background = 'rgba(230, 243, 255, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.borderBottomColor = 'rgba(168, 200, 238, 0.6)';
        }
        
        // Scroll direction detection (optional: hide/show navbar)
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down, hide navbar
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up, show navbar
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Mobile menu toggle - 简化版本
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    // 简单的切换函数
    function toggleMenu() {
        navMenu.classList.toggle('mobile-open');
        const isOpen = navMenu.classList.contains('mobile-open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    
    // 绑定点击事件
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // 点击外部关闭菜单
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('mobile-open')) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('mobile-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // 点击菜单项关闭菜单
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('mobile-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Smooth scrolling
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar height
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            if (navMenu && navMenu.classList.contains('mobile-open')) {
                navMenu.classList.remove('mobile-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Form handling
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Processing...';
                submitBtn.disabled = true;
                
                // Simulate submission (in real project should send to server)
                setTimeout(() => {
                    alert('Form submitted successfully!');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    form.reset();
                }, 2000);
            }
        });
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length < 2) {
                // Show all results
                showAllResults();
                return;
            }
            
            // Execute search
            performSearch(query);
        }, 300);
    });
}

// Show all results
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

// Execute search
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
    
    // Show/hide empty state
    if (emptyState) {
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }
}

// Animation effects
function initAnimations() {
    // Scroll animation
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
    
    // Observe elements that need animation
    const animatedElements = document.querySelectorAll('.showcase-card, .post-card, .person-card, .resource-card, .initiative-card, .partner-card, .news-feature-card, .news-list-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// People filtering functionality
function initPeopleFilter() {
    const roleFilter = document.getElementById('role-filter');
    const letterFilter = document.getElementById('letter-filter');
    const searchInput = document.getElementById('search-input');
    
    if (!roleFilter || !letterFilter || !searchInput) return;
    
    // Combined filtering
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
            
            // Role filtering
            if (role && roleText !== role) {
                show = false;
            }
            
            // Letter filtering
            if (letter && !name.startsWith(letter.toLowerCase())) {
                show = false;
            }
            
            // Search filtering
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
        
        // Show/hide empty state
        if (emptyState) {
            if (visibleCount === 0) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
            }
        }
    }
    
    // Bind events
    roleFilter.addEventListener('change', applyFilters);
    letterFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
}

// Utility functions
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


// Pagination functionality
function initPagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    const prevBtn = paginationContainer.querySelector('.pagination-btn:first-child');
    const nextBtn = paginationContainer.querySelector('.pagination-btn:last-child');
    const infoSpan = paginationContainer.querySelector('.pagination-info');
    const blogGrid = document.querySelector('.blog-grid');
    
    if (!prevBtn || !nextBtn || !infoSpan || !blogGrid) return;
    
    // Pagination state
    let currentPage = 1;
    const itemsPerPage = 6; // Show 6 articles per page
    const blogCards = blogGrid.querySelectorAll('.blog-card');
    const totalPages = Math.ceil(blogCards.length / itemsPerPage);
    
    // Initialize pagination
    function updatePagination() {
        // Update button state
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        
        // Update information display
        const currentLang = document.documentElement.lang || 'zh-CN';
        if (currentLang === 'zh-CN' || currentLang === 'zh') {
            infoSpan.textContent = `第 ${currentPage} 页，共 ${totalPages} 页`;
        } else {
            infoSpan.textContent = `Page ${currentPage} of ${totalPages}`;
        }
        
        // Show/hide articles
        blogCards.forEach((card, index) => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            
            if (index >= startIndex && index < endIndex) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Previous page
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
    
    // Next page
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
    
    // Initialize display
    updatePagination();
    
    // Listen for language change events
    document.addEventListener('languageChanged', updatePagination);
}

// Export functions for use by other scripts
window.NEBULIS = {
    initPeopleFilter,
    performSearch,
    showAllResults,
    initPagination
};
