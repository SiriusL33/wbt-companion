/*
 * WBT Companion - UI Components
 * Fix: Menüpunkte (Themen/About) restored & Dark Mode Shadow Fix
 */

document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
    injectFooter();
    setupMobileMenu(); 
    initUserSystem();  
    initThemeToggle();
});

function getBasePath() {
    return window.location.pathname.includes('/pages/') ? '../' : '';
}

/* --- HEADER & FOOTER --- */
function injectHeader() {
    const basePath = getBasePath();
    const currentPath = window.location.pathname;
    
    // Active State Logic
    const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || (!currentPath.includes('pages/'));
    const isExplore = currentPath.includes('explore.html') || currentPath.includes('detail.html');
    const isTopics = currentPath.includes('topics.html');
    const isAbout = currentPath.includes('about.html');

    const activeClass = 'text-blue-600 bg-blue-50 md:bg-transparent md:text-blue-600 font-bold';
    const inactiveClass = 'text-slate-600 hover:text-blue-600 md:hover:bg-transparent transition-colors dark:text-slate-300 dark:hover:text-blue-400';

    const headerHTML = `
    <nav class="fixed w-full z-50 top-0 start-0 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all duration-300 dark:bg-slate-900/90 dark:border-slate-800">
        <div class="max-w-7xl flex flex-wrap items-center justify-between mx-auto px-6 py-4">
            
            <a href="${basePath}index.html" class="flex items-center gap-3 group">
                <div class="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-teal-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:rotate-6 transition-transform">
                    W
                </div>
                <div class="flex flex-col">
                    <span class="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-none dark:text-slate-100">KLARTEXT <span class="text-blue-600 dark:text-blue-400">MEDIZIN</span></span>
                    <span class="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-semibold">Digitalmedizin <br> leicht gemacht</span>
                </div>
            </a>
            
            <button id="mobile-menu-btn" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-slate-500 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:text-slate-400 dark:hover:bg-slate-800">
                <span class="sr-only">Menü öffnen</span>
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>

            <div class="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-slate-100 rounded-lg md:flex-row md:items-center md:space-x-8 md:mt-0 md:border-0 dark:border-slate-700">
                    <li><a href="${basePath}index.html" class="block py-2 px-3 rounded md:p-0 ${isHome ? activeClass : inactiveClass}">Startseite</a></li>
                    <li><a href="${basePath}pages/explore.html" class="block py-2 px-3 rounded md:p-0 ${isExplore ? activeClass : inactiveClass}">Themenwelt</a></li>
                    
                    <li><a href="${basePath}pages/topics.html" class="block py-2 px-3 rounded md:p-0 ${isTopics ? activeClass : inactiveClass}">Schwerpunkte</a></li>
                    <li><a href="${basePath}pages/about.html" class="block py-2 px-3 rounded md:p-0 ${isAbout ? activeClass : inactiveClass}">Über</a></li>

                    <li class="flex items-center py-2 px-3 md:p-0">
                        <label class="theme-switch inline-flex items-center gap-2 cursor-pointer select-none">
                            <span class="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Dark</span>
                            <span class="relative inline-flex items-center">
                                <input id="theme-toggle" type="checkbox" class="sr-only peer" aria-label="Dark Mode umschalten">
                                <span class="w-11 h-6 rounded-full bg-slate-200 peer-checked:bg-blue-600 transition-colors dark:bg-slate-700"></span>
                                <span class="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"></span>
                            </span>
                        </label>
                    </li>

                    <li class="hidden md:block h-6 w-px bg-slate-200 mx-2 dark:bg-slate-700"></li>
                    
                    <li class="hidden md:flex items-center gap-3 pl-2 cursor-pointer group/profile" onclick="resetUser()" title="Namen ändern">
                        <div class="text-right hidden lg:block">
                            <div id="user-name-display" class="text-sm font-bold text-slate-700 dark:text-slate-200">Besucher</div>
                            <div class="text-[10px] text-slate-400">Mein Bereich</div>
                        </div>
                        <img id="user-avatar-display" src="https://ui-avatars.com/api/?name=Guest&background=e2e8f0&color=64748b" class="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover/profile:scale-105 transition-transform" alt="Profil">
                    </li>
                </ul>
            </div>
        </div>
    </nav>`;

    const headerContainer = document.getElementById('app-header');
    if(headerContainer) headerContainer.innerHTML = headerHTML;
}

function injectFooter() {
    const html = `
    <footer class="py-12 border-t border-slate-200 bg-slate-50 mt-auto dark:bg-slate-900/50 dark:border-slate-800">
        <div class="container mx-auto px-4 text-center">
            <div class="mb-6 flex justify-center items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div class="w-6 h-6 bg-gradient-to-br from-blue-600 to-teal-400 rounded-md flex items-center justify-center text-white text-xs font-bold">W</div>
                <span class="font-bold text-slate-700 dark:text-slate-300">WBT Companion</span>
            </div>
            <p class="text-slate-400 text-sm mb-6 max-w-md mx-auto">Ein interaktiver Prototyp zur Demonstration moderner E-Learning Konzepte.</p>
            <div class="mt-8 pt-8 border-t border-slate-200/60 opacity-40 dark:border-slate-700"><span class="text-xs font-mono">&copy; 2026 CMLabs Dev</span></div>
        </div>
    </footer>`;
    const footerContainer = document.getElementById('app-footer');
    if(footerContainer) footerContainer.innerHTML = html;
}

function setupMobileMenu() {
    setTimeout(() => {
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('navbar-default');
        if(btn && menu) btn.onclick = () => { menu.classList.toggle('hidden'); };
    }, 100);
}

/* --- THEME TOGGLE --- */
function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
}

function initThemeToggle() {
    const storedTheme = localStorage.getItem('wbt_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);

    // Warte kurz, bis das HTML injiziert wurde
    setTimeout(() => {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;
        toggle.checked = initialTheme === 'dark';
        toggle.addEventListener('change', () => {
            const nextTheme = toggle.checked ? 'dark' : 'light';
            applyTheme(nextTheme);
            localStorage.setItem('wbt_theme', nextTheme);
        });
    }, 100);
}

/* --- LOGIK: USER & ZEIT --- */
/* --- LOGIK: USER & ZEIT --- */
async function initUserSystem() {
    try {
        // Wir fragen unseren neuen API-Endpunkt, wer eingeloggt ist
        const response = await fetch('/api/me');
        const data = await response.json();

        if (data.loggedIn) {
            // Server bestätigt Login: Wir updaten das UI mit dem echten Namen!
            updateUserUI(data.username);
        } else {
            // Niemand eingeloggt? Nur zur Sicherheit werfen wir den User zum Login.
            if (!window.location.pathname.includes('login.html')) {
                window.location.replace('/login.html');
            }
        }
    } catch (error) {
        console.error("Fehler bei der Session-Prüfung", error);
    }
}

function getTimeBasedGreeting() {
    const h = new Date().getHours();
    if (h >= 5 && h < 11) return "Guten Morgen";
    if (h >= 11 && h < 18) return "Guten Tag";
    if (h >= 18 && h < 22) return "Guten Abend";
    return "Hallo"; 
}

function updateUserUI(name) {
    // 1. Namen im Header aktualisieren
    const nameEl = document.getElementById('user-name-display');
    const avatarEl = document.getElementById('user-avatar-display');
    
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) {
        const safeName = encodeURIComponent(name);
        avatarEl.src = `https://ui-avatars.com/api/?name=${safeName}&background=3b82f6&color=fff&bold=true`;
    }

    // 2. Begrüßung auf der Startseite anpassen (falls vorhanden)
    const greetingHeadline = document.getElementById('dynamic-greeting');
    if (greetingHeadline) {
        const timeGreeting = getTimeBasedGreeting();
        greetingHeadline.innerHTML = `${timeGreeting}, <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">${name}.</span>`;
    }
}

// Den alten LocalStorage-Reset verwandeln wir in einen echten Logout!
async function resetUser() {
    if(confirm("Möchtest du dich sicher abmelden?")) {
        window.location.replace('/login.html');
    }
}