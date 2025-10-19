
        const answers = {
            q1: 'Attack on Titan',
            q2: 'Negro',
            q3: 'KAFFY',
            q4: 'Café',
            q5: 'Roblox'
        };

// Music Player
let backgroundMusic = new Audio('music/Toy Story - Yo Soy Tu Amigo Fiel (By Ricardo Murguía) (Video & Letra) - Sr. Leo Pardo.mp3'); // CAMBIA ESTA RUTA
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
let isPlaying = false;

function toggleMusic() {
    const btn = document.getElementById('playPauseBtn');
    if (isPlaying) {
        backgroundMusic.pause();
        btn.textContent = '▶️';
        isPlaying = false;
    } else {
        backgroundMusic.play();
        btn.textContent = '⏸️';
        isPlaying = true;
    }
}

// Volume control
document.getElementById('volumeSlider').addEventListener('input', function(e) {
    backgroundMusic.volume = e.target.value / 100;
});

        let currentQuestion = 1;
        let score = 0;
        let userAnswers = {};
        let soundEnabled = true;
        
        let memories = [
    {
        type: 'image',   
        src: 'music/el roblox.jpg',
        caption: 'De los primeros juegos que jugamos'
    },
    {
        type: 'video',
        src: 'music/el roblox video.mp4',
        caption: 'Ese viaje, terminamos bugueando el juego'
    },
    {
        type: 'image',
        src: 'music/el roblox x2.jpg',
        caption: 'Terminamos aqui bugueados JAJAJA'
    },
    {
        type: 'image',
        src: 'music/alarmas.jpg',
        caption: 'Recuerdo inolvidable, me hiciste levantarme a las 2 de la mañana'
    },
    {
        type: 'image',
        src: 'music/alguna actividad.jpg',
        caption: 'En esta le doxeaste el teléfono como a 2 personas JAJAJA'
    },
    {
        type: 'image',
        src: 'music/dibujo.jpg',
        caption: 'Te acuerdas? fue de la primera carta que te hice xd'
    },
    {
        type: 'image',
        src: 'music/nochat.jpg',
        caption: 'De los primeros chats, el origen de todo'
    },
    {
        type: 'image',
        src: 'music/yo modo black.jpg',
        caption: 'Aqui me quedé todo negro'
    },
    {
        type: 'image',
        src: 'music/calvo.jpg',
        caption: 'Te quedaste bien calva JAJA'
    }
];

        // Hangman variables
        const targetWord = 'KAFFY';
        let guessedLetters = [];
        let attemptsLeft = 6;
        let wordCompleted = false;

        // Sound effects using Web Audio API
        function playSound(type) {
            if (!soundEnabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'correct':
                    oscillator.frequency.value = 800;
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                    break;
                case 'wrong':
                    oscillator.frequency.value = 200;
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;
                case 'celebration':
                    for(let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            const osc = audioContext.createOscillator();
                            const gain = audioContext.createGain();
                            osc.connect(gain);
                            gain.connect(audioContext.destination);
                            osc.frequency.value = 400 + (i * 200);
                            gain.gain.setValueAtTime(0.2, audioContext.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                            osc.start(audioContext.currentTime);
                            osc.stop(audioContext.currentTime + 0.4);
                        }, i * 100);
                    }
                    break;
            }
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            document.getElementById('soundIcon').textContent = soundEnabled ? '🔊' : '🔇';
                backgroundMusic.muted = !soundEnabled;
        }

        function startQuiz() {
            document.querySelector('.intro-screen').classList.remove('active');
            document.querySelector('.quiz-screen').classList.add('active');
            document.getElementById('q1').classList.add('active');
            updateProgress();
        }

        function selectOption(element, question, answer) {
            const options = element.parentElement.children;
            for (let opt of options) {
                opt.classList.remove('selected');
            }
            element.classList.add('selected');
            userAnswers[question] = answer;
            
            if (answer === answers[question]) {
                playSound('correct');
            } else {
                playSound('wrong');
            }
            
            const nextBtn = document.querySelector(`#${question} .next-btn`);
            nextBtn.style.display = 'block';
        }

        function nextQuestion(current) {
            const currentQ = `q${current}`;
            if (userAnswers[currentQ] === answers[currentQ]) {
                score++;
            }

            document.getElementById(currentQ).classList.remove('active');
            
            if (current === 2) {
                setupHangman();
            }
            
            currentQuestion = current + 1;
            document.getElementById(`q${currentQuestion}`).classList.add('active');
            updateProgress();
        }

        function updateProgress() {
            const progress = (currentQuestion / 5) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
        }

        // Hangman game
        function setupHangman() {
            const wordDisplay = document.getElementById('wordDisplay');
            const keyboard = document.getElementById('keyboard');
            
            wordDisplay.innerHTML = '';
            for (let i = 0; i < targetWord.length; i++) {
                const box = document.createElement('div');
                box.className = 'letter-box';
                box.id = `letter-${i}`;
                wordDisplay.appendChild(box);
            }

            keyboard.innerHTML = '';
            for (let i = 65; i <= 90; i++) {
                const letter = String.fromCharCode(i);
                const key = document.createElement('div');
                key.className = 'key';
                key.textContent = letter;
                key.onclick = () => guessLetter(letter, key);
                keyboard.appendChild(key);
            }
        }

        function guessLetter(letter, keyElement) {
            if (guessedLetters.includes(letter) || wordCompleted) return;
            
            guessedLetters.push(letter);
            keyElement.classList.add('used');

            let found = false;
            for (let i = 0; i < targetWord.length; i++) {
                if (targetWord[i] === letter) {
                    document.getElementById(`letter-${i}`).textContent = letter;
                    found = true;
                }
            }

            if (found) {
                playSound('correct');
            } else {
                playSound('wrong');
                attemptsLeft--;
                document.getElementById('attemptsLeft').textContent = attemptsLeft;
            }

            checkHangmanComplete();
        }

        function checkHangmanComplete() {
            let complete = true;
            for (let i = 0; i < targetWord.length; i++) {
                if (!document.getElementById(`letter-${i}`).textContent) {
                    complete = false;
                    break;
                }
            }

            if (complete || attemptsLeft === 0) {
                wordCompleted = true;
                if (complete) {
                    score++;
                    userAnswers.q3 = 'KAFFY';
                    playSound('celebration');
                }
                document.getElementById('hangmanNext').style.display = 'block';
            }
        }

        function finishQuiz() {
            playSound('celebration');
            createFireworks();
            document.querySelector('.quiz-screen').classList.remove('active');
            document.querySelector('.letter-screen').classList.add('active');
            document.getElementById('finalScore').textContent = `¡Obtuviste ${score} de 5 respuestas correctas!`;
        }

        function createFireworks() {
            const colors = ['#ff69b4', '#ffd1dc', '#e0c3fc', '#c3e0fc', '#fff', '#ffb6c1'];
            
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    const startX = Math.random() * window.innerWidth;
                    const startY = window.innerHeight;
                    
                    for (let j = 0; j < 30; j++) {
                        const firework = document.createElement('div');
                        firework.className = 'firework';
                        firework.style.left = startX + 'px';
                        firework.style.top = startY + 'px';
                        firework.style.background = colors[Math.floor(Math.random() * colors.length)];
                        
                        const angle = (Math.PI * 2 * j) / 30;
                        const velocity = 100 + Math.random() * 100;
                        const x = Math.cos(angle) * velocity;
                        const y = Math.sin(angle) * velocity - 200;
                        
                        firework.style.setProperty('--x', x + 'px');
                        firework.style.setProperty('--y', y + 'px');
                        firework.style.animation = 'explode 1.5s ease-out forwards';
                        
                        document.body.appendChild(firework);
                        
                        setTimeout(() => firework.remove(), 1500);
                    }
                }, i * 400);
            }
        }

        // Carousel functionality (auto-advance every 3 seconds)
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-image');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Auto-advance carousel every 3 seconds
setInterval(nextSlide, 3000);

        function showGallery() {
            document.querySelector('.letter-screen').classList.remove('active');
            document.querySelector('.gallery-screen').classList.add('active');
            renderGallery();
        }

        function toggleMemoryForm() {
            const form = document.getElementById('memoryForm');
            form.classList.toggle('active');
        }

        document.getElementById('memoryFile').addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name || '';
            document.getElementById('fileNameDisplay').textContent = fileName ? '✓ ' + fileName : '';
        });

        function saveMemory() {
            const fileInput = document.getElementById('memoryFile');
            const caption = document.getElementById('memoryCaption').value;
            
            if (!fileInput.files[0]) {
                alert('Por favor selecciona una foto o video');
                return;
            }
            
            if (!caption.trim()) {
                alert('Por favor escribe una descripción');
                return;
            }

            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const memory = {
                    type: file.type.startsWith('video') ? 'video' : 'image',
                    src: e.target.result,
                    caption: caption,
                    uploaded: true // Marca como subido temporalmente
                };
                
                memories.push(memory);
                
                // Reset form
                fileInput.value = '';
                document.getElementById('memoryCaption').value = '';
                document.getElementById('fileNameDisplay').textContent = '';
                document.getElementById('memoryForm').classList.remove('active');
                
                playSound('celebration');
                renderGallery();
            };
            
            reader.readAsDataURL(file);
        }

        function renderGallery() {
            const grid = document.getElementById('galleryGrid');
            
            // Contar solo los recuerdos pre-cargados (los que pusiste en el código)
            const preloadedMemories = memories.filter(m => !m.uploaded);
            
            if (memories.length === 0) {
                grid.innerHTML = `
                    <div class="empty-gallery">
                        <div style="font-size: 4em; margin-bottom: 20px;">📷</div>
                        <p>Aún no hay recuerdos.</p>
                        <p>¡Agrega fotos en el código o usa el botón de arriba!</p>
                    </div>
                `;
                return;
            }
            
            grid.innerHTML = memories.map((memory, index) => `
                <div class="gallery-item">
                    ${memory.type === 'video' 
                        ? `<video class="gallery-media" controls>
                             <source src="${memory.src}">
                           </video>`
                        : `<img class="gallery-media" src="${memory.src}" alt="Recuerdo ${index + 1}">`
                    }
                    <div class="gallery-caption">${memory.caption}</div>
                </div>
            `).join('');
        }
