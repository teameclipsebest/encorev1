
// Particles.js configuration
particlesJS("particles-js", {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#ff0000"
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            },
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ff0000",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "grab"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// Simulate fetching bot stats data
// In a real scenario, you would fetch this from your API
function updateStats() {
    // Random numbers for demonstration
    const serverCount = Math.floor(Math.random() * 1000) + 500;
    const userCount = Math.floor(Math.random() * 100000) + 50000;
    const commandCount = Math.floor(Math.random() * 50) + 30;
    const playerCount = Math.floor(Math.random() * 200) + 100;
    
    // Update the DOM
    document.getElementById('serverCount').textContent = serverCount.toLocaleString();
    document.getElementById('userCount').textContent = userCount.toLocaleString();
    document.getElementById('commandCount').textContent = commandCount;
    document.getElementById('playerCount').textContent = playerCount;
}

// Update stats when page loads
document.addEventListener('DOMContentLoaded', updateStats);

// Add some animation to the stats every few seconds
setInterval(() => {
    const statCards = document.querySelectorAll('.stat-card');
    const randomCard = statCards[Math.floor(Math.random() * statCards.length)];
    
    randomCard.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        randomCard.style.transform = 'translateY(0)';
    }, 300);
}, 3000);
