// NEBULIS Lab People Page JavaScript
// 人员页面的筛选和搜索功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化人员数据
    initPeopleData();
    
    // 初始化筛选功能
    initPeopleFilter();
    
    // 初始化搜索功能
    initPeopleSearch();
    
    // 监听语言切换事件
    document.addEventListener('languageChanged', function(event) {
        updatePeopleCardsLanguage(event.detail.lang);
    });
});

// 人员数据（示例数据，实际项目中应该从API获取）
const peopleData = [
    {
        name: "name",
        role: "phd",
        program: "PhD",
        advisors: ["Pieter Abbeel"],
        areas: ["LLM Agents", "RL"],
        avatar: "image/icon/user.png",
        homepage: "https://example.com",
        scholar: "https://scholar.google.com/...",
        github: "https://github.com/...",
        email: "alan@lab.org",
        status: "current",
        cohort: 2023,
        affiliation: "NEBULIS Lab"
    },
    {
        name: "name",
        role: "postdoc",
        program: "Postdoc",
        advisors: ["John Doe"],
        areas: ["Computer Vision", "Robotics"],
        avatar: "image/icon/user.png",
        homepage: "https://example.com",
        scholar: "https://scholar.google.com/...",
        github: "https://github.com/...",
        email: "keira@lab.org",
        status: "current",
        cohort: 2022,
        affiliation: "NEBULIS Lab"
    },
    {
        name: "name",
        role: "phd",
        program: "PhD",
        advisors: ["Jane Smith"],
        areas: ["Distributed RL", "Multi-Agent"],
        avatar: "image/icon/user.png",
        homepage: "https://example.com",
        scholar: "https://scholar.google.com/...",
        github: "https://github.com/...",
        email: "shuaijun@lab.org",
        status: "current",
        cohort: 2021,
        affiliation: "NEBULIS Lab"
    },
    {
        name: "name",
        role: "faculty",
        program: "Professor",
        advisors: [],
        areas: ["AI Ethics", "Explainable AI"],
        avatar: "image/icon/user.png",
        homepage: "https://example.com",
        scholar: "https://scholar.google.com/...",
        github: "https://github.com/...",
        email: "sarah@lab.org",
        status: "current",
        cohort: 2018,
        affiliation: "NEBULIS Lab"
    },
    {
        name: "name",
        role: "masters",
        program: "Masters",
        advisors: ["Dr. Sarah Johnson"],
        areas: ["Data Science", "ML"],
        avatar: "image/icon/user.png",
        homepage: "https://example.com",
        scholar: "https://scholar.google.com/...",
        github: "https://github.com/...",
        email: "mike@lab.org",
        status: "current",
        cohort: 2023,
        affiliation: "NEBULIS Lab"
    },
    {
        name: "name",
        role: "alumni",
        program: "PhD",
        advisors: ["Dr. Sarah Johnson"],
        areas: ["NLP", "Deep Learning"],
        avatar: "image/icon/user.png",
        homepage: "https://example.com",
        scholar: "https://scholar.google.com/...",
        github: "https://github.com/...",
        email: "lisa@lab.org",
        status: "alumni",
        cohort: 2020,
        affiliation: "NEBULIS Lab"
    }
];

// 角色映射
const roleMapping = {
    'faculty': '教师',
    'postdoc': '博士后',
    'phd': '博士生',
    'masters': '硕士生',
    'undergrad': '本科生',
    'visiting': '访问学者',
    'alumni': '校友'
};

// 初始化人员数据
function initPeopleData() {
    const peopleGrid = document.getElementById('people-grid');
    if (!peopleGrid) return;
    
    // 清空现有内容
    peopleGrid.innerHTML = '';
    
    // 按状态和姓名排序
    const sortedPeople = peopleData.sort((a, b) => {
        // 当前成员优先
        if (a.status !== b.status) {
            return a.status === 'current' ? -1 : 1;
        }
        // 然后按姓名排序
        return a.name.localeCompare(b.name);
    });
    
    // 渲染人员卡片
    sortedPeople.forEach(person => {
        const card = createPersonCard(person);
        peopleGrid.appendChild(card);
    });
}

// 获取角色英文翻译
function getRoleEnText(role) {
    const roleEnMapping = {
        'faculty': 'Faculty',
        'postdoc': 'Postdoc',
        'phd': 'PhD Student',
        'masters': 'Masters Student',
        'undergrad': 'Undergraduate',
        'visiting': 'Visiting Scholar',
        'alumni': 'Alumni'
    };
    return roleEnMapping[role] || role;
}

// 创建人员卡片
function createPersonCard(person) {
    const card = document.createElement('div');
    card.className = 'person-card';
    card.setAttribute('data-role', person.role);
    card.setAttribute('data-name', person.name.toLowerCase());
    card.setAttribute('data-areas', person.areas.join(' ').toLowerCase());
    card.setAttribute('data-advisors', person.advisors.join(' ').toLowerCase());
    
    const roleText = roleMapping[person.role] || person.role;
    const areasText = person.areas.join(', ');
    
    card.innerHTML = `
        <img src="${person.avatar}" alt="${person.name} portrait" class="person-avatar">
        <h3 class="person-name">${person.name}</h3>
        <div class="person-role" data-zh="${roleText}" data-en="${getRoleEnText(person.role)}">${roleText}</div>
        <div class="person-areas">${areasText}</div>
        <div class="person-links">
            ${person.homepage ? `<a href="${person.homepage}" class="person-link" target="_blank" rel="noopener noreferrer" data-zh="主页" data-en="Homepage">主页</a>` : ''}
            ${person.scholar ? `<a href="${person.scholar}" class="person-link" target="_blank" rel="noopener noreferrer" data-zh="学术" data-en="Scholar">学术</a>` : ''}
            ${person.github ? `<a href="${person.github}" class="person-link" target="_blank" rel="noopener noreferrer" data-zh="GitHub" data-en="GitHub">GitHub</a>` : ''}
            ${person.email ? `<a href="mailto:${person.email}" class="person-link" data-zh="邮箱" data-en="Email">邮箱</a>` : ''}
        </div>
    `;
    
    return card;
}

// 更新人员卡片的语言
function updatePeopleCardsLanguage(lang) {
    const personCards = document.querySelectorAll('.person-card');
    personCards.forEach(card => {
        // 更新角色文本
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
        
        // 更新链接文本
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

// 初始化人员筛选
function initPeopleFilter() {
    const roleFilter = document.getElementById('role-filter');
    const letterFilter = document.getElementById('letter-filter');
    
    if (!roleFilter || !letterFilter) return;
    
    // 角色筛选
    roleFilter.addEventListener('change', applyFilters);
    
    // 字母筛选
    letterFilter.addEventListener('change', applyFilters);
}

// 初始化人员搜索
function initPeopleSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
    });
}

// 应用筛选
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
        const cardName = card.getAttribute('data-name');
        const cardAreas = card.getAttribute('data-areas');
        const cardAdvisors = card.getAttribute('data-advisors');
        
        let show = true;
        
        // 角色筛选
        if (selectedRole && cardRole !== selectedRole) {
            show = false;
        }
        
        // 字母筛选
        if (selectedLetter && !cardName.startsWith(selectedLetter.toLowerCase())) {
            show = false;
        }
        
        // 搜索筛选
        if (searchQuery) {
            const searchText = `${cardName} ${cardAreas} ${cardAdvisors}`;
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
    
    // 显示/隐藏空状态
    if (emptyState) {
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }
}

// 重置筛选
function resetFilters() {
    const roleFilter = document.getElementById('role-filter');
    const letterFilter = document.getElementById('letter-filter');
    const searchInput = document.getElementById('search-input');
    
    if (roleFilter) roleFilter.value = '';
    if (letterFilter) letterFilter.value = '';
    if (searchInput) searchInput.value = '';
    
    applyFilters();
}

// 导出函数
window.PeoplePage = {
    initPeopleData,
    applyFilters,
    resetFilters
};
