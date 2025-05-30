// Store exams in memory
let exams = [];

document.addEventListener('DOMContentLoaded', () => {
    // Load exams on dashboard
    loadExams();

    // Handle exam creation form
    const examForm = document.getElementById('exam-form');
    if (examForm) {
        examForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const btnText = document.getElementById('btn-text');
            const btnSpinner = document.getElementById('btn-spinner');
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';
            
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const duration = document.getElementById('duration').value;

            try {
                // Get existing exams from localStorage
                const savedExams = localStorage.getItem('exams');
                exams = savedExams ? JSON.parse(savedExams) : [];
                
                // Create new exam with proper ID
                const newExam = {
                    id: exams.length > 0 ? Math.max(...exams.map(exam => exam.id)) + 1 : 1,
                    title,
                    description,
                    duration: parseInt(duration),
                    created_at: new Date().toISOString()
                };
                
                // Add to exams array
                exams.push(newExam);
                
                // Store in localStorage
                localStorage.setItem('exams', JSON.stringify(exams));
                
                // Show success state with celebration
                showSuccessCelebration(submitBtn);
                
                // Reset form
                examForm.reset();
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2500);
            } catch (err) {
                console.error('Error creating exam:', err);
                // Show error state
                showErrorState(submitBtn, btnText, btnSpinner);
            }
        });
    }
});

function loadExams() {
    const loader = document.getElementById('loader');
    const examsList = document.getElementById('exams-list');
    
    if (loader && examsList) {
        loader.style.display = 'block';
        examsList.style.display = 'none';
        
        // Check localStorage for saved exams
        const savedExams = localStorage.getItem('exams');
        exams = savedExams ? JSON.parse(savedExams) : [];
        
        setTimeout(() => {
            loader.style.display = 'none';
            examsList.style.display = 'grid';
            
            if (exams.length === 0) {
                examsList.innerHTML = `
                    <div class="no-exams">
                        <i class="fas fa-book-open"></i>
                        <p>No exams found. Create your first exam!</p>
                    </div>
                `;
                return;
            }
            
            examsList.innerHTML = '';
            
            // Add cards with staggered animation
            exams.forEach((exam, index) => {
                const examCard = document.createElement('div');
                examCard.className = 'exam-card';
                examCard.style.opacity = '0';
                examCard.style.transform = 'translateY(20px)';
                examCard.style.transition = `all 0.5s ease ${index * 0.1}s`;
                examCard.innerHTML = `
                    <h3><i class="fas fa-file-alt"></i> ${exam.title}</h3>
                    <p class="description">${exam.description || 'No description'}</p>
                    <div class="exam-meta">
                        <span><i class="fas fa-clock"></i> ${exam.duration} mins</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(exam.created_at).toLocaleDateString()}</span>
                    </div>
                `;
                examsList.appendChild(examCard);
                
                // Animate each card in
                setTimeout(() => {
                    examCard.style.opacity = '1';
                    examCard.style.transform = 'translateY(0)';
                }, 100 + (index * 100));
            });
        }, 800);
    }
}



function showSuccessCelebration(button) {
    // Change button appearance
    button.innerHTML = '<i class="fas fa-check"></i> Success!';
    button.classList.add('success-state');
    
    // Create celebration elements
    createConfetti();
    createFloatingEmojis();
    playSuccessSound();
}

function showErrorState(button, btnText, btnSpinner) {
    button.disabled = false;
    btnText.style.display = 'inline-block';
    btnSpinner.style.display = 'none';
    
    button.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error! Try Again';
    button.classList.add('error-state');
    
    // Shake animation
    button.style.animation = 'shake 0.5s';
    setTimeout(() => {
        button.style.animation = '';
    }, 500);
    
    // Reset after 3 seconds
    setTimeout(() => {
        button.innerHTML = '<span id="btn-text">Create Exam</span><i class="fas fa-spinner fa-spin" id="btn-spinner" style="display: none;"></i>';
        button.classList.remove('error-state');
    }, 3000);
}

function createConfetti() {
    const colors = ['#5e35b1', '#26c6da', '#ff7043', '#66bb6a', '#ffa726'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = '-10px';
        confetti.style.opacity = '0.8';
        confetti.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`;
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        confettiContainer.appendChild(confetti);
    }
    
    setTimeout(() => {
        confettiContainer.remove();
    }, 3000);
}

function createFloatingEmojis() {
    const emojis = ['🎉', '✨', '👏', '🎊', '👍', '💯'];
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
    
    for (let i = 0; i < 20; i++) {
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.position = 'absolute';
        emoji.style.fontSize = `${Math.random() * 20 + 20}px`;
        emoji.style.left = `${Math.random() * 100}vw`;
        emoji.style.top = `${Math.random() * 100}vh`;
        emoji.style.opacity = '0';
        emoji.style.animation = `floatUp ${Math.random() * 2 + 2}s ease-out forwards`;
        emoji.style.animationDelay = `${Math.random() * 1}s`;
        container.appendChild(emoji);
    }
    
    setTimeout(() => {
        container.remove();
    }, 3000);
}

function playSuccessSound() {
    // In a real app, you would play an actual sound
    console.log('Playing success sound!');
    // Example: new Audio('success-sound.mp3').play();
}

// Add CSS animations to head
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes fall {
        to { transform: translateY(100vh) rotate(360deg); }
    }
    
    @keyframes floatUp {
        0% { 
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% { 
            opacity: 1;
        }
        100% { 
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .success-state {
        background: linear-gradient(135deg, #4CAF50, #2E7D32) !important;
        box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4) !important;
    }
    
    .error-state {
        background: linear-gradient(135deg, #f44336, #c62828) !important;
        box-shadow: 0 4px 20px rgba(244, 67, 54, 0.4) !important;
    }
`;
document.head.appendChild(style);