/*===== BASE API URL =====*/
// If the page is opened directly as a file, point to the local server. 
// Otherwise, use relative paths (works when served via FastAPI)
const BASE_URL = window.location.protocol === 'file:' ? 'http://localhost:5000' : '';

/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle', 'nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            sectionsClass.classList.add('active-link')
        } else {
            sectionsClass.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== SHOW SCROLL TOP ====================*/
function scrollTop() {
    const scrollTop = document.getElementById('scroll-top');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if (this.scrollY >= 560) scrollTop.classList.add('show-scroll'); else scrollTop.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollTop)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
    reset: false // Animations only play once for a cleaner professional feel
});

sr.reveal('.home__data, .home__img, .about__img, .section-title', {});
sr.reveal('.home__social, .about__data, .skills__data', { interval: 100, origin: 'bottom' });
sr.reveal('.project-card, .services-box, .contact__form', { interval: 100 });
sr.reveal('.footer__social, .footer__copy', { interval: 100, origin: 'bottom' });

/* ===== Contact form AJAX submit ===== */
const contactForm = document.getElementById('contact-form')
const contactStatus = document.getElementById('contact-status')

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        contactStatus.textContent = 'Sending...'
        const payload = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        }

        try {
            const res = await fetch(`${BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                contactStatus.style.color = '#10b981' // Success green
                contactStatus.textContent = 'Message sent — thank you!'
                contactForm.reset()
            } else {
                const data = await res.json()
                contactStatus.style.color = '#ef4444' // Error red
                contactStatus.textContent = data.detail?.error || data.detail || 'Failed to send message.'
            }
        } catch (err) {
            contactStatus.textContent = 'Network error — could not reach server.'
        }
        setTimeout(() => contactStatus.textContent = '', 5000)
    })
}

/* ===== AI Chat Bot Logic ===== */
const chatToggle = document.getElementById('chat-toggle')
const chatClose = document.getElementById('chat-close')
const chatWindow = document.getElementById('chat-window')
const chatFormAi = document.getElementById('chat-form-ai')
const chatMessages = document.getElementById('chat-messages')
const chatInput = document.getElementById('chat-input')

if (chatToggle && chatClose && chatWindow) {
    chatToggle.addEventListener('click', () => chatWindow.classList.add('show'))
    chatClose.addEventListener('click', () => chatWindow.classList.remove('show'))

    chatFormAi.addEventListener('submit', async (e) => {
        e.preventDefault()
        const query = chatInput.value.trim()
        if (!query) return

        // Add user message
        addMessage(query, 'user')
        chatInput.value = ''

        // Add loading state
        const loadingMsg = addMessage('Thinking...', 'bot loading')

        try {
            const res = await fetch(`${BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            })

            const data = await res.json()
            loadingMsg.remove()

            if (res.ok) {
                addMessage(data.response, 'bot')
            } else {
                addMessage('Sorry, I hit a snag. Please try again later.', 'bot')
            }
        } catch (err) {
            loadingMsg.remove()
            addMessage('Network error. Check your connection.', 'bot')
        }
    })
}

function addMessage(text, type) {
    const msgDiv = document.createElement('div')
    msgDiv.className = `msg ${type}`
    // Basic formatting for newlines
    msgDiv.innerHTML = text.replace(/\n/g, '<br>')
    chatMessages.appendChild(msgDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
    return msgDiv
}

/* ===== ADMIN DASHBOARD LOGIC ===== */
const adminTrigger = document.getElementById('admin-trigger');
const adminOverlay = document.getElementById('admin-overlay');
const adminCloseBtn = document.getElementById('admin-close-btn');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminDashboard = document.getElementById('admin-dashboard');
const adminLogoutBtn = document.getElementById('admin-logout-btn');
const adminPassInput = document.getElementById('admin-pass');
const adminError = document.getElementById('admin-error');
const adminStatus = document.getElementById('admin-status');
const adminMessagesContainer = document.getElementById('admin-messages-container');

let adminToken = sessionStorage.getItem('adminToken');

if (adminTrigger && adminOverlay) {
    adminTrigger.addEventListener('click', () => {
        if (adminToken) {
            showAdminDashboard();
        } else {
            adminOverlay.classList.add('show');
        }
    });

    adminCloseBtn.addEventListener('click', () => adminOverlay.classList.remove('show'));

    adminLoginBtn.addEventListener('click', async () => {
        const pass = adminPassInput.value;
        const isValid = await validateAdminToken(pass);
        if (isValid) {
            adminToken = pass;
            sessionStorage.setItem('adminToken', adminToken);
            adminOverlay.classList.remove('show');
            adminError.style.display = 'none';
            adminPassInput.value = '';
            showAdminDashboard();
        } else {
            adminError.style.display = 'block';
        }
    });

    adminLogoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('adminToken');
        adminToken = null;
        adminDashboard.classList.remove('show');
    });
}

async function validateAdminToken(token) {
    try {
        const res = await fetch(`${BASE_URL}/api/contacts?limit=1`, {
            headers: { 'X-Admin-Token': token }
        });
        return res.ok;
    } catch { return false; }
}

async function showAdminDashboard() {
    adminDashboard.classList.add('show');
    adminDashboard.scrollIntoView({ behavior: 'smooth' });
    fetchAdminMessages();
}

async function fetchAdminMessages() {
    if (!adminToken) return;
    adminStatus.textContent = 'Fetching messages...';
    try {
        const res = await fetch(`${BASE_URL}/api/contacts`, {
            headers: { 'X-Admin-Token': adminToken }
        });
        if (res.status === 403) {
            sessionStorage.removeItem('adminToken');
            adminToken = null;
            adminDashboard.classList.remove('show');
            adminOverlay.classList.add('show');
            return;
        }
        const data = await res.json();
        if (data.contacts && data.contacts.length > 0) {
            adminStatus.textContent = `Showing ${data.contacts.length} recent messages.`;
            adminMessagesContainer.innerHTML = data.contacts.map(c => `
                <div class="admin-card">
                    <div class="admin-meta">
                        <span><strong>From:</strong> ${c.name}</span>
                        <span class="badge">Contact</span>
                    </div>
                    <div class="admin-meta">
                        <span><strong>Email:</strong> ${c.email}</span>
                    </div>
                    <div class="admin-message">${c.message}</div>
                    <div class="admin-actions">
                        <button onclick="generateAdminReply('${c.name}', '${c.email}', '${encodeURIComponent(c.message)}', this)" class="button" style="padding: 0.6rem 1.2rem; font-size: 0.8rem;">
                            <i class='bx bx-bot'></i> AI Draft Reply
                        </button>
                        <a href="mailto:${c.email}" class="button" style="background: var(--bg-accent); border: 1px solid var(--glass-border); padding: 0.6rem 1.2rem; font-size: 0.8rem; margin-left: 0.5rem;">
                            <i class='bx bx-envelope'></i> Reply via Email
                        </a>
                    </div>
                    <div class="ai-reply-box" id="reply-${c._id}">
                        <strong>AI Suggestion:</strong>
                        <p class="reply-text" style="margin-top: 0.5rem; font-size: 0.9rem; font-style: italic; color: var(--text-color-light);"></p>
                    </div>
                </div>
            `).join('');
        } else {
            adminStatus.textContent = 'No messages found.';
        }
    } catch (err) {
        adminStatus.textContent = 'Error connecting to server.';
    }
}

window.generateAdminReply = async function (name, email, encodedMsg, btn) {
    const card = btn.closest('.admin-card');
    const replyBox = card.querySelector('.ai-reply-box');
    const replyText = replyBox.querySelector('.reply-text');

    btn.disabled = true;
    btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Thinking...";

    try {
        const res = await fetch(`${BASE_URL}/api/draft-reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Token': adminToken
            },
            body: JSON.stringify({ name, email, message: decodeURIComponent(encodedMsg) })
        });
        const data = await res.json();
        if (res.ok) {
            replyBox.style.display = 'block';
            replyText.innerHTML = data.reply.replace(/\n/g, '<br>');
            btn.innerHTML = "<i class='bx bx-check'></i> Draft Ready";
        } else {
            alert('Draft failed: ' + (data.detail || 'check API key'));
            btn.innerHTML = "<i class='bx bx-bot'></i> AI Draft Reply";
            btn.disabled = false;
        }
    } catch (err) {
        alert('Connection error');
        btn.disabled = false;
    }
}

/* ===== HERO PARTICLES ===== */
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const mouse = { x: null, y: null, radius: 100 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.size > 0.2) this.size -= 0.01;
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                this.x -= dx / 20;
                this.y -= dy / 20;
            }
        }
        draw() {
            const isLight = document.body.classList.contains('light-theme');
            ctx.fillStyle = isLight ? 'rgba(124, 58, 237, 0.25)' : 'rgba(124, 58, 237, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].size <= 0.3) {
                particles[i] = new Particle();
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    init();
    animate();
}
/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'light-theme'
const iconTheme = 'bx-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'light' : 'dark'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-sun' : 'bx-moon'

// We validate if the user previously chose a topic
if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the theme
    document.body.classList[selectedTheme === 'light' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'bx-sun' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
if (themeButton) {
    themeButton.addEventListener('click', () => {
        // Add or remove the light-theme / sun icon
        document.body.classList.toggle(darkTheme)
        themeButton.classList.toggle(iconTheme)
        // We save the theme and the current icon that the user chose
        localStorage.setItem('selected-theme', getCurrentTheme())
        localStorage.setItem('selected-icon', getCurrentIcon())
    })
}

/*==================== PROJECT MODAL LOGIC ====================*/
const projectCards = document.querySelectorAll('.project-card');
const projectModal = document.getElementById('project-modal');
const projectModalClose = document.getElementById('project-modal-close');

const modalImg = document.getElementById('modal-img');
const modalTag = document.getElementById('modal-tag');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const modalTech = document.getElementById('modal-tech');

if (projectCards && projectModal) {
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('.card-banner img').src;
            const tag = card.querySelector('.card-tag').innerText;
            const title = card.querySelector('.card-title').innerText;
            const text = card.querySelector('.card-text').innerText;
            const tech = card.querySelector('.card-technologies').innerHTML;

            modalImg.src = img;
            modalTag.innerText = tag;
            modalTitle.innerText = title;
            modalText.innerText = text;
            modalTech.innerHTML = tech;

            projectModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    projectModalClose.addEventListener('click', () => {
        projectModal.classList.remove('show');
        document.body.style.overflow = 'initial';
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.classList.remove('show');
            document.body.style.overflow = 'initial';
        }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('show')) {
            projectModal.classList.remove('show');
            document.body.style.overflow = 'initial';
        }
    });
}
