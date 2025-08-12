window.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const canvas = document.getElementById('game-canvas');
    const audio = document.getElementById('ambient-audio');
    const messageBox = document.getElementById('message-box');
    const ctx = canvas.getContext('2d');
  
    // Flag to check if the game has already started
    let gameStarted = false;
  
    // Make canvas full-screen
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  
    // Starry background with swirling effect
    let stars = [];
    let time = 0;
  
    // Create random stars
    function createStars() {
      for (let i = 0; i < 300; i++) { // Increase star count
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,  // Size of stars
          speed: Math.random() * 0.5 + 0.2,
          angle: Math.random() * 2 * Math.PI,
          color: `hsl(${Math.random() * 360}, 100%, 75%)` // Random star color
        });
      }
    }
  
    // Draw stars
    function drawStars() {
      stars.forEach(star => {
        star.x += Math.sin(star.angle) * star.speed;
        star.y += Math.cos(star.angle) * star.speed;
  
        // Create a swirling effect
        star.angle += 0.005;
  
        // Wrap stars around edges
        if (star.x > canvas.width) star.x = 0;
        if (star.y > canvas.height) star.y = 0;
        if (star.x < 0) star.x = canvas.width;
        if (star.y < 0) star.y = canvas.height;
  
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color; // Color for each star
        ctx.fill();
      });
    }
  
    // Draw background gradient (swirling Van Gogh effect)
    function drawBackground() {
      let gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, canvas.width);
      gradient.addColorStop(0, 'hsl(215, 50%, 20%)');  // Deep dark blue center
      gradient.addColorStop(1, 'hsl(215, 50%, 40%)');  // Lighter blue edges
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  
    // Typing text system
    const messages = [
      "Do not refresh.",
      "You have already begun.",
      "This is not a game.",
      "Did you hear that?",
      "It sees your cursor.",
      "We remember you.",
      "Why are you still here?"
    ];
    let messageIndex = 0;
  
    function typeMessage(text, delay = 100) {
      messageBox.textContent = '';
      messageBox.style.opacity = 1;
      let i = 0;
      const typing = setInterval(() => {
        if (i < text.length) {
          messageBox.textContent += text[i];
          i++;
        } else {
          clearInterval(typing);
          setTimeout(() => {
            messageBox.style.opacity = 0;
          }, 4000); // Hide after 4s
        }
      }, delay);
    }
  
    // Add mouse cursor as a static star
    const cursorStar = {
      size: Math.random() * 2 + 1,  // Random size, same as background stars
      color: 'hsl(0, 100%, 75%)'  // Color for the cursor star
    };
  
    canvas.addEventListener('mousemove', (e) => {
      // Position the cursor star at the mouse position
      cursorStar.x = e.clientX;
      cursorStar.y = e.clientY;
    });
  
    // Draw the cursor star
    function drawCursorStar() {
      ctx.beginPath();
      ctx.arc(cursorStar.x, cursorStar.y, cursorStar.size, 0, Math.PI * 2);
      ctx.fillStyle = cursorStar.color;
      ctx.fill();
    }
  
    // Start game
    startScreen.addEventListener('click', () => {
      if (gameStarted) return; // Prevent game from starting multiple times
  
      gameStarted = true; // Set gameStarted flag to true
  
      // Fade out start screen
      startScreen.style.transition = 'opacity 1s ease';
      startScreen.style.opacity = '0';
      setTimeout(() => {
        startScreen.style.display = 'none';
      }, 1000);
  
      // Start audio
      audio.play().catch(err => {
        console.error('Audio play failed:', err);
      });
  
      // Create stars
      createStars();
  
      // Start visuals
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        drawBackground(); // Draw background gradient
        drawStars(); // Draw the stars
        drawCursorStar(); // Draw the static cursor star
        time += 0.1;
        requestAnimationFrame(animate);
      }
      animate();
  
      // Show messages one by one
      typeMessage(messages[messageIndex]);
      messageIndex++;
  
      setInterval(() => {
        if (messageIndex < messages.length) {
          typeMessage(messages[messageIndex]);
          messageIndex++;
        }
      }, 7000); // every 7 seconds
    });
});
