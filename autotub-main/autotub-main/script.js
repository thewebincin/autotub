document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Logic
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');

    // Follow mouse
    document.addEventListener('mousemove', (e) => {
        if (!cursor || !follower) return;

        // Immediate position for the dot
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Delayed/smoothed position for the follower via CSS transition on transform
        // We use left/top for base position, then let it track
        // Actually for smoothness, updating left/top in JS is better, let's just apply it directly
        // The transition in CSS will handle the delay/smoothness
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });

    // Add hover states to all links, buttons, and anything with class 'hover-trigger'
    const hoverElements = document.querySelectorAll('a, button, .hover-trigger');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hover');
            if (follower) follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hover');
            if (follower) follower.classList.remove('hover');
        });
    });


    // 2. Theme Toggling Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateButtonText(currentTheme);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateButtonText('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateButtonText(newTheme);
        });
    }

    function updateButtonText(theme) {
        if (!themeToggleBtn) return;
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '☀️ Light';
        } else {
            themeToggleBtn.innerHTML = '🌙 Dark';
        }
    }


    // 3. Loading Screen Logic
    const loader = document.getElementById('page-loader');

    setTimeout(() => {
        loader.classList.add('hidden');
    }, 600);

    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (!href || href.startsWith('#') || link.target === '_blank' || window.location.href.endsWith(href)) {
                return;
            }

            e.preventDefault();
            loader.classList.remove('hidden');

            setTimeout(() => {
                window.location.href = href;
            }, 800);
        });
    });


    // 4. Snappy Intersection Observer for Fade-In and new animations
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right, .zoom-in');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    animatedElements.forEach(el => observer.observe(el));


    // 5. Intense Parallax 3D Tilt Effect on Bulky Cards
    const tiltElements = document.querySelectorAll('.tilt');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Increased tilt multiplier for bulkier feel
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });


    // 6. Dynamic Navbar Shrink on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // 7. Contact Form Submission (Mock)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'SENDING...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.textContent = 'MESSAGE SENT!';
                btn.style.backgroundColor = 'var(--primary-color)';
                btn.style.color = '#000';
                contactForm.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1000);
        });
    }

    // 8. Mobile Menu Logic
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('nav-links');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });

        // Ensure menu closes when clicking a link on mobile
        const mobileLinks = navLinksContainer.querySelectorAll('a');
        mobileLinks.forEach(l => l.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
        }));
    }

    // 9. AI Chatbot Logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatBody = document.getElementById('chat-body');

    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('hidden');
        });

        closeChat.addEventListener('click', () => {
            chatbotWindow.classList.add('hidden');
            sessionStorage.setItem('chat_closed', 'true');
        });

        const sendMessage = () => {
            const text = chatInput.value.trim();
            if (!text) return;

            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'message user-msg';
            userMsg.textContent = text;
            chatBody.appendChild(userMsg);
            chatInput.value = '';
            chatBody.scrollTop = chatBody.scrollHeight;

            // Simulate Smart AI response
            setTimeout(() => {
                const aiMsg = document.createElement('div');
                aiMsg.className = 'message ai-msg';

                const lowerText = text.toLowerCase();

                // If it's the very first message after asking for their name
                if (sessionStorage.getItem('asking_name') === 'true') {
                    sessionStorage.setItem('asking_name', 'false');
                    sessionStorage.setItem('user_name', text);
                    aiMsg.innerHTML = `Nice to meet you, <strong>${text}</strong>! I'm the Auto Tub Assistant.<br><br><strong>Quick Info:</strong><br>📞 Booking: <a href="tel:+919778717351" style="color: var(--primary-color);">+91 97787 17351</a><br>📍 Location: <a href="https://share.google/I43hIt9YkVxPDysiN" target="_blank" style="color: var(--primary-color);">Get Google Maps Directions</a><br>🕒 Open: 24 Hours<br><br>How can I help you today?`;
                    chatBody.appendChild(aiMsg);
                    chatBody.scrollTop = chatBody.scrollHeight;
                    return;
                }

                const userName = sessionStorage.getItem('user_name') || 'Friend';
                let response = `I am an AI assistant for Auto Tub! How can I help you today, ${userName}?`;

                if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('how much') || lowerText.includes('package') || lowerText.includes('plan')) {
                    response = "We offer 3 unlimited body wash plans!<br><br>• <strong>1 Month:</strong> Hatchback ₹1600, Sedan ₹2000, SUV ₹2300<br>• <strong>3 Months:</strong> Hatchback ₹4100, Sedan ₹5100, SUV ₹6100<br>• <strong>6 Months:</strong> Hatchback ₹8100, Sedan ₹10100, SUV ₹11700<br><br>Check out our Services page for more info!";
                } else if (lowerText.includes('location') || lowerText.includes('where') || lowerText.includes('address')) {
                    response = `We are located at Bus Stop, Kuzhivila, Ulloor - Akkulam Rd in Trivandrum.<br>📍 <a href="https://share.google/I43hIt9YkVxPDysiN" target="_blank" style="color: var(--primary-color);">Click here for Maps</a>.<br>We also offer free pickup and drop off up to 3 KM!`;
                } else if (lowerText.includes('phone') || lowerText.includes('call') || lowerText.includes('contact') || lowerText.includes('number')) {
                    response = `You can reach us directly anytime via phone:<br>📞 <a href="tel:+919778717351" style="color: var(--primary-color);">+91 97787 17351</a><br>📞 <a href="tel:09495620773" style="color: var(--primary-color);">094956 20773</a>`;
                } else if (lowerText.includes('time') || lowerText.includes('hour') || lowerText.includes('open') || lowerText.includes('close')) {
                    response = "We are <strong style='color: var(--primary-color);'>OPEN 24 HOURS</strong> a day, 7 days a week! Stop by anytime.";
                } else if (lowerText.includes('service') || lowerText.includes('wash')) {
                    response = "Our packages include multiple full washes and <strong>unlimited</strong> body wash access for an entire month, 3 months, or 6 months! We offer free pickup and drop up to 3 KM.";
                } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
                    response = `Hello there, <strong>${userName}</strong>! Welcome to Auto Tub. How can I assist you with your car Spa needs today?`;
                } else if (lowerText.includes('book') || lowerText.includes('appointment')) {
                    response = `To book an appointment or schedule a free pickup, please give us a call at <a href="tel:+919778717351" style="color: var(--primary-color);">+91 97787 17351</a> and our team will get your car sorted!`;
                } else if (lowerText.includes('thank')) {
                    response = `You're very welcome, <strong>${userName}</strong>! Let me know if you need anything else.`;
                }

                aiMsg.innerHTML = response;
                chatBody.appendChild(aiMsg);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 600);
        };

        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // 10. Smart Formal Welcome Greeting (Always triggers unless previously closed)
        setTimeout(() => {
            if (sessionStorage.getItem('chat_closed') === 'true') return;

            // Automatically pop up!
            if (chatbotWindow.classList.contains('hidden')) {
                chatbotWindow.classList.remove('hidden');

                setTimeout(() => {
                    // Only greet if it's the initial state
                    if (chatBody.children.length <= 1) {
                        chatBody.innerHTML = '';
                        const welcomeMsg = document.createElement('div');
                        welcomeMsg.className = 'message ai-msg';

                        const savedName = sessionStorage.getItem('user_name');
                        if (savedName) {
                            welcomeMsg.innerHTML = `Welcome back to Auto Tub, <strong>${savedName}</strong>!<br><br>Need a quick hookup? Call us immediately at <a href="tel:+919778717351" style="color: var(--primary-color);">+91 97787 17351</a>.<br><br>How can I assist you today?`;
                            sessionStorage.setItem('asking_name', 'false');
                        } else {
                            welcomeMsg.innerHTML = "Welcome to Auto Tub! We're open 24/7.<br><br>Before we get started, may I know your name?";
                            sessionStorage.setItem('asking_name', 'true');
                        }

                        chatBody.appendChild(welcomeMsg);
                        chatBody.scrollTop = chatBody.scrollHeight;
                    }
                }, 500);
            }
        }, 2500); // Wait for the page loader wash animation to finish before popping up
    }

});