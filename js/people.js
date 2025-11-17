// NEBULIS Lab People Page JavaScript
// People page filtering and search functionality

document.addEventListener('DOMContentLoaded', function() {
    // Force English language for people page (temporarily disabled Chinese)
    // Override language setting to English
    const currentLang = localStorage.getItem('nebulis-lang');
    if (currentLang === 'zh') {
        // Temporarily set to English for this page only
        // Don't update localStorage to avoid affecting other pages
    }
    
    // Initialize people data
    initPeopleData();
    
    // Initialize filtering functionality
    initPeopleFilter();
    
    // Initialize search functionality
    initPeopleSearch();
    
    // Initialize mobile filter toggle
    initMobileFilterToggle();
    
    // Temporarily disable language change events for people page
    // document.addEventListener('languageChanged', function(event) {
    //     updatePeopleCardsLanguage(event.detail.lang);
    // });
    
    // Force all cards to display in English
    setTimeout(() => {
        updatePeopleCardsLanguage('en');
    }, 100);
});

// People data (sample data, in real project should be fetched from API)
const peopleData = [
    {
        name: "苏宁馨",
        nameEn: "Prof. Ningxin Su",
        role: "faculty",
        program: "Faculty",
        advisors: [],
        description: "Assistant Professor at IoT in HKUST(GZ). Director of the NEBULIS Lab. Received Ph.D. degree from the ECE, University of Toronto, supervised by Prof. Baochun Li. Research interests: Embodied AI, Multi-agent Systems and Distributed Systems.",
        descriptionZh: "香港科技大学（广州）助理教授，NEBULIS Lab 负责人。博士毕业于多伦多大学电子与计算机工程系，师从 Baochun Li 教授。",
        avatar: "image/user/profsu.jpg",
        homepage: "https://ningxinsu.github.io/",
        scholar: "https://scholar.google.com/citations?user=XkeT3_8AAAAJ&hl=en",
        github: "https://github.com/NingxinSu",
        email: "ningxinsu@hkust-gz.edu.cn",
        status: "current",
        cohort: 2025,
        affiliation: "NEBULIS Lab"
    },
    {
        name: "刘帅军",
        nameEn: "Shuaijun Liu",
        role: "phd",
        program: "PhD",
        advisors: ["苏宁馨"],
        description: "BSc in Statistics & CS from HKBU; MSc in CS from Boston University. Research interests: IoT-based Dynamic Control, LLM Deployment and Inference, 3D Reconstruction. Resently working on an TCM pulse-diagnosis project supervised by Prof. Su.",
        descriptionZh: "香港浸会大学统计学、计算机科学学士；波士顿大学计算机科学硕士。研究兴趣：边缘计算中的动态控制、大语言模型部署与推理、三维重建。目前在苏教授指导下进行中医脉诊项目研究。",
        avatar: "image/user/shuaijun.jpg",
        homepage: "https://shuaijun-liu.github.io/",
        scholar: "https://scholar.google.com/citations?user=-tBtMaAAAAAJ&hl=en",
        github: "https://github.com/Shuaijun-LIU",
        email: "sliu529@connect.hkust-gz.edu.cn",
        status: "current",
        cohort: 2025,
        affiliation: "NEBULIS Lab"
    },
    {
        name: "陈星维",
        nameEn: "Xingwei Chen",
        role: "ra",
        program: "Research Assistant",
        advisors: ["苏宁馨"],
        description: "BEng in Control & Instrumentation from Nanjing University of Aeronautics and Astronautics; MSc in Precision Instrumentation from NTU (Singapore). Research interests: Embodied AI & VLA/VLM, Optimization & Cutting-edge AI in Robotics, RL.",
        descriptionZh: "南京航空航天大学控制与仪器工程学士；新加坡南洋理工大学精密仪器硕士。研究兴趣：具身智能与视觉语言模型、机器人优化与前沿AI、强化学习。",
        avatar: "image/user/xingwei.jpg",
        homepage: "https://example.com",
        scholar: "https://scholar.google.com/...",
        github: "https://github.com/HarryXingweiCHEN",
        email: "xingweichen@hkust-gz.edu.cn",
        status: "current",
        cohort: 2025,
        affiliation: "NEBULIS Lab"
    },
    {
        name: "尤飞扬",
        nameEn: "Feiyang You",
        role: "ra",
        program: "Research Assistant",
        advisors: ["苏宁馨"],
        description: "BEng in Automation from Shanghai Jiao Tong University. Research interests: Real-time Motion Generation in Embodied Intelligence. Enjoys soccer and LOL. My friends call me “Dormitory TheShy” due to my remarkably consistent feeding skills.",
        descriptionZh: "上海交通大学自动化专业学士。研究兴趣：具身智能中的实时运动生成。喜欢足球、英雄联盟和观看比赛。顺便一提，朋友们叫我“宿舍 TheShy”，因为我有着非常稳定的送人头技巧。",
        avatar: "image/user/feiyang.jpg",
        homepage: "https://example.com",
        scholar: "https://scholar.google.com/...",
        github: "https://github.com/Feiyang-You",
        email: "feiyangyou@hkust-gz.edu.cn",
        status: "current",
        cohort: 2025,
        affiliation: "NEBULIS Lab"
    },
    {
        name: "杨庆凯",
        nameEn: "Qingkai Yang",
        role: "ra",
        program: "Research Assistant",
        advisors: ["苏宁馨"],
        description: "Embodied intelligent hardware development.",
        descriptionZh: "具身智能硬件开发。",
        avatar: "image/icon/user.png",
        homepage: "https://example.com",
        scholar: "https://scholar.google.com/...",
        github: "https://github.com/...",
        email: "qingkai@lab.org",
        status: "current",
        cohort: 2025,
        affiliation: "NEBULIS Lab"
    },
    {
        name: "Nebula-ChatBot",
        nameEn: "Nebula-ChatBot",
        role: "ai",
        program: "Research Assistant",
        advisors: ["苏宁馨"],
        description: "Nebula is the intelligent assistant of NEBULIS Lab, designed to help researchers or potential partners quickly access our project information, datasets, publications, and other lab related resources. Additional features will be launched in the future.",
        descriptionZh: "Nebula 是 NEBULIS Lab 的智能助手，旨在帮助研究人员或潜在合作伙伴快速访问我们的项目信息、数据集、出版物和其他实验室相关资源。未来将推出更多功能。",
        avatar: "image/user/nebula.jpg",
        homepage: "https://openai.com",
        scholar: "https://scholar.google.com/...",
        github: "https://github.com/...",
        email: "chatgpt@lab.org",
        status: "current",
        cohort: 2025,
        affiliation: "NEBULIS Lab"
    }
];

// Role mapping
const roleMapping = {
    'faculty': '教师',
    'postdoc': '博士后',
    'phd': '博士生',
    'masters': '硕士生',
    'undergrad': '本科生',
    'visiting': '访问学者',
    'alumni': '校友',
    'ra': '研究助理'
};

// Initialize people data
function initPeopleData() {
    const peopleGrid = document.getElementById('people-grid');
    if (!peopleGrid) return;
    
    // Clear existing content
    peopleGrid.innerHTML = '';
    
    // Sort by role priority and name
    const sortedPeople = [...peopleData].sort((a, b) => {
        // Faculty 永远最前（保证左上角）
        if (a.role === 'faculty' && b.role !== 'faculty') return -1;
        if (b.role === 'faculty' && a.role !== 'faculty') return 1;
    
        // Current members first
        if (a.status !== b.status) {
            return a.status === 'current' ? -1 : 1;
        }

        const rolePriority = { 'faculty': 0, 'phd': 1, 'postdoc': 2, 'masters': 3, 'undergrad': 4, 'ra': 5, 'visiting': 6, 'alumni': 7 };
        const aPriority = rolePriority[a.role] || 8;
        const bPriority = rolePriority[b.role] || 8;
        
        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        return a.name.localeCompare(b.name);
    });
    
    // Debug: log the sorted order
    console.log('Sorted people order:', sortedPeople.map(p => `${p.name} (${p.role})`));
    
    // Render people cards
    sortedPeople.forEach(person => {
        const card = createPersonCard(person);
        peopleGrid.appendChild(card);
    });
}

// Get role English translation
function getRoleEnText(role) {
    const roleEnMapping = {
        'faculty': 'Faculty',
        'postdoc': 'Postdoc',
        'phd': 'PhD Student',
        'masters': 'Masters Student',
        'undergrad': 'Undergraduate',
        'visiting': 'Visiting Scholar',
        'alumni': 'Alumni',
        'ra': 'Research Assistant',
        'ai': 'AI Assistant'
    };
    return roleEnMapping[role] || role;
}

// Create person card
function createPersonCard(person) {
    const card = document.createElement('div');
    card.className = 'person-card';
    card.setAttribute('data-role', person.role);
    
    const nameZh = (person.name || '').toLowerCase().trim();
    const nameEn = (person.nameEn || person.name || '').toLowerCase().trim();
    const combinedName = `${person.name || ''} ${person.nameEn || ''}`.toLowerCase().trim();
    const letterMatch = (person.nameEn || person.name || '').match(/[A-Za-z]/);
    const primaryLetter = letterMatch ? letterMatch[0].toLowerCase() : '';

    card.setAttribute('data-name', combinedName || nameZh || nameEn);
    card.setAttribute('data-name-zh', nameZh);
    card.setAttribute('data-name-en', nameEn);
    card.setAttribute('data-letter', primaryLetter);
    
    const roleText = roleMapping[person.role] || person.role;
    const description = person.description || person.areas?.join(', ') || '';
    const descriptionZh = person.descriptionZh || description;
    
    const avatarElement = person.homepage 
        ? `<a href="${person.homepage}" target="_blank" rel="noopener noreferrer" class="person-avatar-link"><img src="${person.avatar}" alt="${person.name} portrait" class="person-avatar"></a>`
        : `<img src="${person.avatar}" alt="${person.name} portrait" class="person-avatar">`;
    
    // Force English for people page (temporarily disabled Chinese)
    // const currentLang = localStorage.getItem('nebulis-lang') || 'en';
    // const initialDescription = currentLang === 'zh' ? descriptionZh : description;
    const initialDescription = description; // Always use English
    
    // Force English role text
    const roleEnText = getRoleEnText(person.role);
    
    card.innerHTML = `
        ${avatarElement}
        <h3 class="person-name" data-zh="${person.name}" data-en="${person.nameEn || person.name}">${person.nameEn || person.name}</h3>
        <div class="person-role" data-zh="${roleText}" data-en="${roleEnText}">${roleEnText}</div>
        <div class="person-description" data-zh="${descriptionZh}" data-en="${description}">${initialDescription}</div>
        <div class="person-links">
            ${person.scholar ? `<a href="${person.scholar}" class="person-link" target="_blank" rel="noopener noreferrer" data-zh="Google Scholar" data-en="Google Scholar">Google Scholar</a>` : ''}
            ${person.github ? `<a href="${person.github}" class="person-link" target="_blank" rel="noopener noreferrer" data-zh="GitHub" data-en="GitHub">GitHub</a>` : ''}
            ${person.email ? `<a href="mailto:${person.email}" class="person-link" data-zh="邮箱" data-en="Email">Email</a>` : ''}
        </div>
    `;
    
    return card;
}

// Update people cards language
function updatePeopleCardsLanguage(lang) {
    const personCards = document.querySelectorAll('.person-card');
    personCards.forEach(card => {
        // Update role text
        const roleElement = card.querySelector('.person-role');
        if (roleElement) {
            const zhText = roleElement.getAttribute('data-zh');
            const enText = roleElement.getAttribute('data-en');
            if (lang === 'zh') {
                roleElement.textContent = zhText;
            } else {
                roleElement.textContent = enText;
            }
        }
        
        // Update description text
        const descriptionElement = card.querySelector('.person-description');
        if (descriptionElement) {
            const zhText = descriptionElement.getAttribute('data-zh');
            const enText = descriptionElement.getAttribute('data-en');
            if (zhText && enText) {
                if (lang === 'zh') {
                    descriptionElement.textContent = zhText;
                } else {
                    descriptionElement.textContent = enText;
                }
            }
        }
        
        // Update link text
        const links = card.querySelectorAll('.person-link[data-zh][data-en]');
        links.forEach(link => {
            const zhText = link.getAttribute('data-zh');
            const enText = link.getAttribute('data-en');
            if (lang === 'zh') {
                link.textContent = zhText;
            } else {
                link.textContent = enText;
            }
        });
    });
}

// Initialize people filtering
function initPeopleFilter() {
    const roleFilter = document.getElementById('role-filter');
    const letterFilter = document.getElementById('letter-filter');
    
    if (!roleFilter || !letterFilter) return;
    
    // Role filtering
    roleFilter.addEventListener('change', applyFilters);
    
    // Letter filtering
    letterFilter.addEventListener('change', applyFilters);
}

// Initialize people search
function initPeopleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchWrapper = searchInput?.parentElement;
    if (!searchInput || !searchWrapper) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        // Add typing animation class to wrapper
        searchWrapper.classList.add('search-typing');
        
        searchTimeout = setTimeout(() => {
            searchWrapper.classList.remove('search-typing');
            applyFilters();
        }, 300);
    });
}

// Initialize mobile filter toggle
function initMobileFilterToggle() {
    const filterToggle = document.querySelector('.filter-toggle');
    const filterBar = document.querySelector('.filter-bar');
    
    if (!filterToggle || !filterBar) return;
    
    filterToggle.addEventListener('click', () => {
        filterBar.classList.toggle('mobile-open');
        const isOpen = filterBar.classList.contains('mobile-open');
        filterToggle.setAttribute('aria-expanded', isOpen);
    });
}

// Apply filters
function applyFilters() {
    const roleFilter = document.getElementById('role-filter');
    const letterFilter = document.getElementById('letter-filter');
    const searchInput = document.getElementById('search-input');
    const peopleGrid = document.getElementById('people-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!peopleGrid) return;
    
    const selectedRole = roleFilter?.value || '';
    const selectedLetter = letterFilter?.value || '';
    const searchQuery = searchInput?.value.toLowerCase().trim() || '';
    
    const cards = peopleGrid.querySelectorAll('.person-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const cardRole = card.getAttribute('data-role');
        const cardNameCombined = card.getAttribute('data-name') || '';
        const cardNameZh = card.getAttribute('data-name-zh') || '';
        const cardNameEn = card.getAttribute('data-name-en') || '';
        const cardLetter = card.getAttribute('data-letter') || '';
        
        let show = true;
        
        // Role filtering (exclude "ai" role from RA filter)
        if (selectedRole && cardRole !== selectedRole) {
            show = false;
        }
        // Exclude "ai" role when filtering by "ra"
        if (selectedRole === 'ra' && cardRole === 'ai') {
            show = false;
        }
        
        // Letter filtering
        if (selectedLetter) {
            const letter = selectedLetter.toLowerCase();
            const matchesLetter = cardLetter === letter || cardNameEn.startsWith(letter);
            if (!matchesLetter) {
                show = false;
            }
        }
        
        // Search filtering (only by name)
        if (searchQuery) {
            const searchText = `${cardNameCombined} ${cardNameZh} ${cardNameEn}`;
            if (!searchText.includes(searchQuery)) {
                show = false;
            }
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

// Reset filters
function resetFilters() {
    const roleFilter = document.getElementById('role-filter');
    const letterFilter = document.getElementById('letter-filter');
    const searchInput = document.getElementById('search-input');
    
    if (roleFilter) roleFilter.value = '';
    if (letterFilter) letterFilter.value = '';
    if (searchInput) searchInput.value = '';
    
    applyFilters();
}

// Export functions
window.PeoplePage = {
    initPeopleData,
    applyFilters,
    resetFilters
};
