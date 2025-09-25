// NEBULIS Lab People Page JavaScript
// People page filtering and search functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize people data
    initPeopleData();
    
    // Initialize filtering functionality
    initPeopleFilter();
    
    // Initialize search functionality
    initPeopleSearch();
    
    // Listen for language change events
    document.addEventListener('languageChanged', function(event) {
        updatePeopleCardsLanguage(event.detail.lang);
    });
});

// People data (sample data, in real project should be fetched from API)
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

// Role mapping
const roleMapping = {
    'faculty': '教师',
    'postdoc': '博士后',
    'phd': '博士生',
    'masters': '硕士生',
    'undergrad': '本科生',
    'visiting': '访问学者',
    'alumni': '校友'
};

// Initialize people data
function initPeopleData() {
    const peopleGrid = document.getElementById('people-grid');
    if (!peopleGrid) return;
    
    // Clear existing content
    peopleGrid.innerHTML = '';
    
    // Sort by status and name
    const sortedPeople = peopleData.sort((a, b) => {
        // Current members first
        if (a.status !== b.status) {
            return a.status === 'current' ? -1 : 1;
        }
        // Then sort by name
        return a.name.localeCompare(b.name);
    });
    
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
        'alumni': 'Alumni'
    };
    return roleEnMapping[role] || role;
}

// Create person card
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
        <h3 class="person-name" data-zh="名字" data-en="name">name</h3>
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
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
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
        const cardName = card.getAttribute('data-name');
        const cardAreas = card.getAttribute('data-areas');
        const cardAdvisors = card.getAttribute('data-advisors');
        
        let show = true;
        
        // Role filtering
        if (selectedRole && cardRole !== selectedRole) {
            show = false;
        }
        
        // Letter filtering
        if (selectedLetter && !cardName.startsWith(selectedLetter.toLowerCase())) {
            show = false;
        }
        
        // Search filtering
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
