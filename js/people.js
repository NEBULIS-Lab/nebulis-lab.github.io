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
    
    // Load people data from JSON file
    loadPeopleData();
    
    // Initialize filtering functionality
    initPeopleFilter();
    
    // Initialize search functionality
    initPeopleSearch();
    
    // Temporarily disable language change events for people page
    // document.addEventListener('languageChanged', function(event) {
    //     updatePeopleCardsLanguage(event.detail.lang);
    // });
    
    // Force all cards to display in English
    setTimeout(() => {
        updatePeopleCardsLanguage('en');
    }, 100);
});

// People data will be loaded from JSON file
let peopleData = [];

// Load people data from JSON file
function loadPeopleData() {
    const jsonPath = 'data/people.json';
    
    console.log('Loading people data from:', jsonPath);
    
    fetch(jsonPath)
        .then(response => {
            console.log('Response status:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Loaded people data:', data.length);
            if (!Array.isArray(data) || data.length === 0) {
                console.warn('No people data found in JSON file');
                const peopleGrid = document.getElementById('people-grid');
                if (peopleGrid) {
                    peopleGrid.innerHTML = '<div style="padding: var(--space-4); color: var(--color-muted);">No team members available.</div>';
                }
                return;
            }
            
            peopleData = data;
            // Initialize people data display
            initPeopleData();
        })
        .catch(error => {
            console.error('Failed to load people data:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                attemptedPath: jsonPath,
                currentURL: window.location.href
            });
            const peopleGrid = document.getElementById('people-grid');
            if (peopleGrid) {
                peopleGrid.innerHTML = `<div style="padding: var(--space-4); color: var(--color-muted);">
                    Failed to load people data. Error: ${error.message}<br>
                    <small>Attempted path: ${jsonPath}</small>
                </div>`;
            }
        });
}

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
    
    // Check if this is Nebula-ChatBot
    const isNebulaChatBot = (person.name === 'Nebula-ChatBot' || person.nameEn === 'Nebula-ChatBot');
    
    // Generate links section - special handling for Nebula-ChatBot
    let linksHTML = '';
    if (isNebulaChatBot) {
        // Only show "Talk with Chatbot" button for Nebula-ChatBot
        linksHTML = `
        <div class="person-links">
            <button class="person-link chatbot-button" data-zh="与聊天机器人对话" data-en="Talk with Chatbot">Talk with Chatbot</button>
        </div>
        `;
    } else {
        // Regular links for other people
        linksHTML = `
        <div class="person-links">
            ${person.scholar ? `<a href="${person.scholar}" class="person-link" target="_blank" rel="noopener noreferrer" data-zh="Google Scholar" data-en="Google Scholar">Google Scholar</a>` : ''}
            ${person.github ? `<a href="${person.github}" class="person-link" target="_blank" rel="noopener noreferrer" data-zh="GitHub" data-en="GitHub">GitHub</a>` : ''}
            ${person.email ? `<a href="mailto:${person.email}" class="person-link" data-zh="邮箱" data-en="Email">Email</a>` : ''}
        </div>
        `;
    }
    
    card.innerHTML = `
        ${avatarElement}
        <h3 class="person-name" data-zh="${person.name}" data-en="${person.nameEn || person.name}">${person.nameEn || person.name}</h3>
        <div class="person-role" data-zh="${roleText}" data-en="${roleEnText}">${roleEnText}</div>
        <div class="person-description" data-zh="${descriptionZh}" data-en="${description}">${initialDescription}</div>
        ${linksHTML}
    `;
    
    // Add click handler for Nebula-ChatBot button
    if (isNebulaChatBot) {
        const chatbotButton = card.querySelector('.chatbot-button');
        if (chatbotButton) {
            chatbotButton.addEventListener('click', function(e) {
                e.preventDefault();
                // Functionality not yet available
                // You can add a notification here if needed
                console.log('Chatbot feature coming soon');
            });
        }
    }
    
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
