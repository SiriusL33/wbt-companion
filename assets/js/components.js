/*
 * WBT Companion - UI Components
 * Features: Header/Footer Injection, Mobile Menu, User Onboarding (Safe Input)
 */

document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
    injectFooter();
    setupMobileMenu(); // Burger Menü Logik
    initUserSystem();  // Namens-Abfrage Logik
});

function getBasePath() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
}

function injectHeader() {
    const basePath = getBasePath();
    const currentPath = window.location.pathname;
    
    // Active State Logic
    const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || (!currentPath.includes('pages/'));
    const isExplore = currentPath.includes('explore.html') || currentPath.includes('detail.html');
    const isTopics = currentPath.includes('topics.html');
    const isAbout = currentPath.includes('about.html');

    const activeClass = 'text-blue-600 bg-blue-50 md:bg-transparent md:text-blue-600 font-bold';
    const inactiveClass = 'text-slate-600 hover:text-blue-600 md:hover:bg-transparent transition-colors';

    const headerHTML = `
    <nav class="fixed w-full z-50 top-0 start-0 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
        <div class="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
            
            <a href="${basePath}index.html" class="flex items-center gap-3 group">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:rotate-6 transition-transform">
                    W
                </div>
                <div class="flex flex-col">
                    <span class="text-xl font-bold text-slate-800 tracking-tight leading-none">WBT <span class="text-blue-600">Companion</span></span>
                    <span class="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Medical Explorer</span>
                </div>
            </a>
            
            <button id="mobile-menu-btn" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-slate-500 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200">
                <span class="sr-only">Menü öffnen</span>
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>

            <div class="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-slate-100 rounded-lg md:flex-row md:items-center md:space-x-8 md:mt-0 md:border-0">
                    <li><a href="${basePath}index.html" class="block py-2 px-3 rounded md:p-0 ${isHome ? activeClass : inactiveClass}">Startseite</a></li>
                    <li><a href="${basePath}pages/explore.html" class="block py-2 px-3 rounded md:p-0 ${isExplore ? activeClass : inactiveClass}">Explore</a></li>
                    <li><a href="${basePath}pages/topics.html" class="block py-2 px-3 rounded md:p-0 ${isTopics ? activeClass : inactiveClass}">Themen</a></li>
                    <li><a href="${basePath}pages/about.html" class="block py-2 px-3 rounded md:p-0 ${isAbout ? activeClass : inactiveClass}">About</a></li>
                    
                    <li class="hidden md:block h-6 w-px bg-slate-200 mx-2"></li>
                    
                    <li class="hidden md:flex items-center gap-3 pl-2 cursor-pointer group/profile" onclick="resetUser()" title="Namen ändern">
                        <div class="text-right hidden lg:block">
                            <div id="user-name-display" class="text-sm font-bold text-slate-700">Gast</div>
                            <div class="text-[10px] text-slate-400">Student (Sem. 4)</div>
                        </div>
                        <img id="user-avatar-display" src="https://ui-avatars.com/api/?name=Guest&background=e2e8f0&color=64748b" class="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover/profile:scale-105 transition-transform" alt="Profil">
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;

    const headerContainer = document.getElementById('app-header');
    if(headerContainer) headerContainer.innerHTML = headerHTML;
}

function injectFooter() {
    const html = `
    <footer class="py-12 border-t border-slate-200 bg-slate-50 mt-auto">
        <div class="container mx-auto px-4 text-center">
            <div class="mb-6 flex justify-center items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div class="w-6 h-6 bg-gradient-to-br from-blue-600 to-teal-400 rounded-md flex items-center justify-center text-white text-xs font-bold">W</div>
                <span class="font-bold text-slate-700">WBT Companion</span>
            </div>
            <p class="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                Ein interaktiver Prototyp zur Demonstration moderner E-Learning Konzepte.
            </p>
            <div class="mt-8 pt-8 border-t border-slate-200/60 opacity-40">
                <span class="text-xs font-mono">&copy; 2026 Medical Design Lab</span>
            </div>
        </div>
    </footer>
    `;
    const footerContainer = document.getElementById('app-footer');
    if(footerContainer) footerContainer.innerHTML = html;
}

// --- LOGIK: MOBILE MENU ---
function setupMobileMenu() {
    // Wir warten kurz, bis das HTML sicher injected ist
    setTimeout(() => {
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('navbar-default');

        if(btn && menu) {
            btn.onclick = () => {
                menu.classList.toggle('hidden');
            };
        }
    }, 100);
}

// --- LOGIK: USER ONBOARDING (SECURE) ---
function initUserSystem() {
    const storedName = localStorage.getItem('wbt_username');

    if (storedName) {
        // Name existiert -> UI Updaten
        updateUserUI(storedName);
    } else {
        // Kein Name -> Modal anzeigen
        showWelcomeModal();
    }
}

function updateUserUI(name) {
    const nameEl = document.getElementById('user-name-display');
    const avatarEl = document.getElementById('user-avatar-display');
    
    // SICHERHEIT: textContent verhindert Code-Injection!
    if(nameEl) nameEl.textContent = name;
    
    // Avatar URL bauen (Safe, da URL encoded)
    if(avatarEl) {
        const safeName = encodeURIComponent(name);
        avatarEl.src = `https://ui-avatars.com/api/?name=${safeName}&background=3b82f6&color=fff&bold=true`;
    }

    // Auf der Startseite auch die Begrüßung anpassen (falls vorhanden)
    // Suche nach "Guten Morgen, ..." Texten
    const welcomeHeader = document.querySelector('h1'); 
    if(welcomeHeader && welcomeHeader.innerText.includes('Guten Morgen')) {
        // Optional: Falls du auf der Startseite eine persönliche Begrüßung hast
    }
}

function showWelcomeModal() {
    // Modal HTML dynamisch erzeugen
    const modalHTML = `
    <div id="welcome-modal" class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-300">
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform scale-90 transition-transform duration-300">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">👋</div>
                <h2 class="text-2xl font-bold text-slate-800">Willkommen im Explorer!</h2>
                <p class="text-slate-500 mt-2">Wie dürfen wir dich ansprechen?</p>
            </div>
            
            <input type="text" id="input-name" placeholder="Dein Vorname" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all mb-4 text-center font-bold text-slate-700" maxlength="20">
            
            <button onclick="saveUser()" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200">
                Loslegen ➜
            </button>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Einblenden Animation
    setTimeout(() => {
        const modal = document.getElementById('welcome-modal');
        const content = modal.querySelector('div');
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-90');
        content.classList.add('scale-100');
        
        // Fokus ins Feld
        document.getElementById('input-name').focus();
        
        // Enter Taste Support
        document.getElementById('input-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveUser();
        });
    }, 50);
}

function saveUser() {
    const input = document.getElementById('input-name');
    let name = input.value.trim();

    // Fallback falls leer
    if (!name) name = "Gast";

    // Speichern (Browser merkt sich das)
    localStorage.setItem('wbt_username', name);

    // Modal schließen
    const modal = document.getElementById('welcome-modal');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.remove(), 300);

    // UI sofort updaten
    updateUserUI(name);
}

// Funktion zum Zurücksetzen (Debugging oder Klick auf Profil)
function resetUser() {
    if(confirm("Namen zurücksetzen?")) {
        localStorage.removeItem('wbt_username');
        location.reload();
    }
}