// A página sempre abre pelo início da seção Sobre, inclusive após recarregar
// ou retornar pelo histórico. Os links internos continuam funcionando normalmente.
window.addEventListener('pageshow', () => {
    if (window.location.hash) {
        history.replaceState(history.state, '', window.location.pathname + window.location.search);
    }
    requestAnimationFrame(() => {
        const root = document.documentElement;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        requestAnimationFrame(() => root.style.removeProperty('scroll-behavior'));
    });
});

tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "surface-bg": "#0d1117",
                "surface-card": "#161b22",
                "surface-hover": "#21262d",
                "cyber-amber": "#facc15",
                "cyber-amber-glow": "#eab308",
                "cyber-blue": "#00d2ff",
                "cobalt-blue": "#2563eb",
                "text-main": "#f0f6fc",
                "text-muted": "#8b949e",
                "border-dark": "#30363d"
            },
            fontFamily: {
                sans: ['Space Grotesk', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            }
        }
    }
};

function updateClock() {
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        const now = new Date();
        clockEl.textContent = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now) + ' UTC';
    }
}
setInterval(updateClock, 1000);
updateClock();

// Carousel Logic
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const carouselStage = document.querySelector('.carousel-stage');
const indicator = document.getElementById('carousel-indicator');
const totalSlides = slides.length;
let transitionTimer;

function showSlide(index) {
    if (!totalSlides) return;
    const nextSlide = (index + totalSlides) % totalSlides;
    if (nextSlide === currentSlide) return;
    currentSlide = nextSlide;

    clearTimeout(transitionTimer);
    carouselStage?.classList.remove('is-switching');

    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentSlide);
        slide.classList.remove('entering');
    });

    const activeSlide = slides[currentSlide];
    void activeSlide.offsetWidth;
    activeSlide.classList.add('entering');
    carouselStage?.classList.add('is-switching');
    transitionTimer = setTimeout(() => {
        activeSlide.classList.remove('entering');
        carouselStage?.classList.remove('is-switching');
    }, 760);

    if (indicator) {
        indicator.textContent = `0${currentSlide + 1} / 0${totalSlides}`;
    }
}

document.getElementById('carousel-prev')?.addEventListener('click', () => {
    showSlide(currentSlide - 1);
});

document.getElementById('carousel-next')?.addEventListener('click', () => {
    showSlide(currentSlide + 1);
});

// Seis cards por página, incluindo os projetos apresentados no carrossel.
const projectCards = Array.from(document.querySelectorAll('#project-grid > article'));
const projectsPerPage = 6;
const projectPageCount = Math.ceil(projectCards.length / projectsPerPage);
const projectPageNumbers = document.getElementById('project-page-numbers');
const projectPrev = document.getElementById('project-prev');
const projectNext = document.getElementById('project-next');
const projectSummary = document.getElementById('project-page-summary');
const projectTotal = document.getElementById('project-total');
let currentProjectPage = 1;
const pageButtons = [];

if (projectTotal) {
    projectTotal.textContent = `TOTAL (${String(projectCards.length).padStart(2, '0')} PROJETOS ATIVOS)`;
}

for (let page = 1; page <= projectPageCount; page++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = page;
    button.setAttribute('aria-label', `Página ${page} de projetos`);
    button.className = 'min-w-[2.25rem] rounded-lg border px-3 py-2 transition-colors';
    button.addEventListener('click', () => showProjectPage(page));
    projectPageNumbers?.appendChild(button);
    pageButtons.push(button);
}

function showProjectPage(page) {
    currentProjectPage = Math.min(Math.max(page, 1), projectPageCount);
    const firstIndex = (currentProjectPage - 1) * projectsPerPage;
    const lastIndex = Math.min(firstIndex + projectsPerPage, projectCards.length);

    projectCards.forEach((card, index) => {
        card.hidden = index < firstIndex || index >= lastIndex;
    });

    pageButtons.forEach((button, index) => {
        const active = index + 1 === currentProjectPage;
        button.classList.toggle('bg-cyber-blue', active);
        button.classList.toggle('border-cyber-blue', active);
        button.classList.toggle('text-black', active);
        button.classList.toggle('font-bold', active);
        button.classList.toggle('bg-surface-card', !active);
        button.classList.toggle('border-border-dark', !active);
        button.classList.toggle('text-text-main', !active);
        if (active) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
    });

    if (projectPrev) projectPrev.disabled = currentProjectPage === 1;
    if (projectNext) projectNext.disabled = currentProjectPage === projectPageCount;
    if (projectSummary) projectSummary.textContent = `Exibindo ${firstIndex + 1}–${lastIndex} de ${projectCards.length} projetos`;
}

projectPrev?.addEventListener('click', () => showProjectPage(currentProjectPage - 1));
projectNext?.addEventListener('click', () => showProjectPage(currentProjectPage + 1));
if (projectPageCount) showProjectPage(1);

document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(button.dataset.copy);
            const previous = button.title;
            button.title = 'Copiado!';
            setTimeout(() => { button.title = previous; }, 1800);
        } catch {
            button.title = 'Selecione e copie o texto exibido';
        }
    });
});

document.getElementById('contact-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const [name, email, scope, message] = Array.from(form.elements).filter((element) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)).map((element) => element.value.trim());
    const subject = encodeURIComponent(`[NEXUS] ${scope}`);
    const body = encodeURIComponent(`Nome / organização: ${name}\nE-mail: ${email}\nEscopo: ${scope}\n\n${message}`);
    document.getElementById('form-status').textContent = 'Seu aplicativo de e-mail será aberto com a mensagem preparada para envio.';
    window.location.href = `mailto:alex.nexus.arch@proton.me?subject=${subject}&body=${body}`;
});
