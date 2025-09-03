// Global Variables
let currentStep = 1;
let selectedGame = '';
let selectedNominal = '';
let selectedPayment = '';
let totalPrice = 0;

// Game Data
const gameData = {
    'mobile-legends': {
        name: 'Mobile Legends',
        nominals: [
            { amount: '86 Diamond', price: 20000 },
            { amount: '172 Diamond', price: 39000 },
            { amount: '257 Diamond', price: 58000 },
            { amount: '344 Diamond', price: 77000 },
            { amount: '429 Diamond', price: 96000 },
            { amount: '514 Diamond', price: 115000 },
            { amount: '706 Diamond', price: 154000 },
            { amount: '878 Diamond', price: 193000 }
        ]
    },
    'free-fire': {
        name: 'Free Fire',
        nominals: [
            { amount: '70 Diamond', price: 10000 },
            { amount: '140 Diamond', price: 20000 },
            { amount: '355 Diamond', price: 50000 },
            { amount: '720 Diamond', price: 100000 },
            { amount: '1450 Diamond', price: 200000 },
            { amount: '2180 Diamond', price: 300000 },
            { amount: '3640 Diamond', price: 500000 },
            { amount: '7290 Diamond', price: 1000000 }
        ]
    },
    'pubg-mobile': {
        name: 'PUBG Mobile',
        nominals: [
            { amount: '60 UC', price: 15000 },
            { amount: '325 UC', price: 75000 },
            { amount: '660 UC', price: 150000 },
            { amount: '1800 UC', price: 400000 },
            { amount: '3850 UC', price: 800000 },
            { amount: '8100 UC', price: 1600000 }
        ]
    },
    'genshin-impact': {
        name: 'Genshin Impact',
        nominals: [
            { amount: '60 Genesis Crystal', price: 16000 },
            { amount: '330 Genesis Crystal', price: 79000 },
            { amount: '1090 Genesis Crystal', price: 249000 },
            { amount: '2240 Genesis Crystal', price: 499000 },
            { amount: '3880 Genesis Crystal', price: 799000 },
            { amount: '8080 Genesis Crystal', price: 1599000 }
        ]
    }
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateStepIndicator();
    populateNominalOptions();
});

// Initialize Event Listeners
function initializeEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Game search functionality
    const gameSearch = document.getElementById('gameSearch');
    if (gameSearch) {
        gameSearch.addEventListener('input', filterGames);
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterGamesByCategory(this.dataset.category);
        });
    });

    // Game cards click
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            const game = this.dataset.game;
            selectGameAndShowForm(game);
        });
    });

    // Top up buttons
    const topupButtons = document.querySelectorAll('.btn-topup');
    topupButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameCard = this.closest('.game-card');
            const game = gameCard.dataset.game;
            selectGameAndShowForm(game);
        });
    });

    // Game selection in form
    const gameOptions = document.querySelectorAll('.game-option');
    gameOptions.forEach(option => {
        option.addEventListener('click', function() {
            gameOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedGame = this.dataset.game;
            updateOrderSummary();
            populateNominalOptions();
        });
    });

    // Account verification
    const verifyBtn = document.querySelector('.btn-verify');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', verifyAccount);
    }

    // Form inputs
    const userIdInput = document.getElementById('userId');
    const serverIdSelect = document.getElementById('serverId');
    
    if (userIdInput) {
        userIdInput.addEventListener('input', updateOrderSummary);
    }
    
    if (serverIdSelect) {
        serverIdSelect.addEventListener('change', updateOrderSummary);
    }

    // Promo code
    const promoBtn = document.querySelector('.btn-promo');
    if (promoBtn) {
        promoBtn.addEventListener('click', applyPromoCode);
    }

    // Form submission
    const topupForm = document.getElementById('topupForm');
    if (topupForm) {
        topupForm.addEventListener('submit', handleFormSubmit);
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Scroll to games section
function scrollToGames() {
    const gamesSection = document.getElementById('games');
    if (gamesSection) {
        gamesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Filter games by search
function filterGames() {
    const searchTerm = document.getElementById('gameSearch').value.toLowerCase();
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const gameName = card.querySelector('.game-info h3').textContent.toLowerCase();
        if (gameName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter games by category
function filterGamesByCategory(category) {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Select game and show form
function selectGameAndShowForm(game) {
    selectedGame = game;
    
    // Update game selection in form
    const gameOptions = document.querySelectorAll('.game-option');
    gameOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.game === game) {
            option.classList.add('selected');
        }
    });
    
    // Scroll to form
    const topupSection = document.getElementById('topup-form');
    if (topupSection) {
        topupSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    updateOrderSummary();
    populateNominalOptions();
}

// Step navigation
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 4) {
            currentStep++;
            updateStepIndicator();
            showCurrentStep();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepIndicator();
        showCurrentStep();
    }
}

// Validate current step
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            if (!selectedGame) {
                alert('Silakan pilih game terlebih dahulu');
                return false;
            }
            break;
        case 2:
            const userId = document.getElementById('userId').value;
            const serverId = document.getElementById('serverId').value;
            if (!userId || !serverId) {
                alert('Silakan lengkapi data akun');
                return false;
            }
            break;
        case 3:
            if (!selectedNominal) {
                alert('Silakan pilih nominal terlebih dahulu');
                return false;
            }
            break;
        case 4:
            if (!selectedPayment) {
                alert('Silakan pilih metode pembayaran');
                return false;
            }
            break;
    }
    return true;
}

// Update step indicator
function updateStepIndicator() {
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    
    steps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const submitBtn = document.querySelector('.btn-submit');
    
    if (prevBtn) {
        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    }
    
    if (nextBtn && submitBtn) {
        if (currentStep === 4) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }
}

// Show current step
function showCurrentStep() {
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Populate nominal options
function populateNominalOptions() {
    const nominalGrid = document.getElementById('nominalGrid');
    if (!nominalGrid || !selectedGame) return;
    
    const game = gameData[selectedGame];
    if (!game) return;
    
    nominalGrid.innerHTML = '';
    
    game.nominals.forEach((nominal, index) => {
        const nominalOption = document.createElement('div');
        nominalOption.className = 'nominal-option';
        nominalOption.innerHTML = `
            <div class="amount">${nominal.amount}</div>
            <div class="price">Rp ${nominal.price.toLocaleString('id-ID')}</div>
        `;
        
        nominalOption.addEventListener('click', function() {
            document.querySelectorAll('.nominal-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedNominal = nominal.amount;
            totalPrice = nominal.price;
            updateOrderSummary();
        });
        
        nominalGrid.appendChild(nominalOption);
    });
}

// Payment method selection
document.addEventListener('click', function(e) {
    if (e.target.closest('.payment-option')) {
        const paymentOption = e.target.closest('.payment-option');
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
        paymentOption.classList.add('selected');
        selectedPayment = paymentOption.dataset.method;
        updateOrderSummary();
    }
});

// Update order summary
function updateOrderSummary() {
    const summaryGame = document.getElementById('summaryGame');
    const summaryUserId = document.getElementById('summaryUserId');
    const summaryServer = document.getElementById('summaryServer');
    const summaryNominal = document.getElementById('summaryNominal');
    const summaryPayment = document.getElementById('summaryPayment');
    const summaryTotal = document.getElementById('summaryTotal');
    
    if (summaryGame) {
        summaryGame.textContent = selectedGame ? gameData[selectedGame]?.name || '-' : '-';
    }
    
    if (summaryUserId) {
        const userId = document.getElementById('userId')?.value || '';
        summaryUserId.textContent = userId || '-';
    }
    
    if (summaryServer) {
        const serverId = document.getElementById('serverId')?.value || '';
        summaryServer.textContent = serverId || '-';
    }
    
    if (summaryNominal) {
        summaryNominal.textContent = selectedNominal || '-';
    }
    
    if (summaryPayment) {
        summaryPayment.textContent = selectedPayment ? selectedPayment.toUpperCase() : '-';
    }
    
    if (summaryTotal) {
        summaryTotal.textContent = totalPrice > 0 ? `Rp ${totalPrice.toLocaleString('id-ID')}` : 'Rp 0';
    }
}

// Verify account
function verifyAccount() {
    const userId = document.getElementById('userId').value;
    const serverId = document.getElementById('serverId').value;
    const verificationResult = document.getElementById('verificationResult');
    
    if (!userId || !serverId) {
        alert('Silakan lengkapi User ID dan Server ID');
        return;
    }
    
    // Simulate verification process
    verificationResult.style.display = 'block';
    verificationResult.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memverifikasi akun...';
    
    setTimeout(() => {
        // Simulate successful verification
        verificationResult.className = 'verification-result success';
        verificationResult.innerHTML = '<i class="fas fa-check-circle"></i> Akun berhasil diverifikasi!';
    }, 2000);
}

// Apply promo code
function applyPromoCode() {
    const promoCode = document.getElementById('promoCode').value;
    
    if (!promoCode) {
        alert('Silakan masukkan kode promo');
        return;
    }
    
    // Simulate promo code validation
    const validPromoCodes = ['NEWUSER10', 'DISCOUNT5', 'SAVE20'];
    
    if (validPromoCodes.includes(promoCode.toUpperCase())) {
        const discount = promoCode.toUpperCase() === 'SAVE20' ? 0.2 : 
                        promoCode.toUpperCase() === 'NEWUSER10' ? 0.1 : 0.05;
        
        totalPrice = Math.round(totalPrice * (1 - discount));
        updateOrderSummary();
        alert(`Kode promo berhasil diterapkan! Diskon ${Math.round(discount * 100)}%`);
    } else {
        alert('Kode promo tidak valid');
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    // Show loading modal
    showModal('loadingModal');
    
    // Simulate payment processing
    setTimeout(() => {
        hideModal('loadingModal');
        showModal('successModal');
        
        // Reset form after successful payment
        setTimeout(() => {
            resetForm();
        }, 3000);
    }, 3000);
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeModal(modalId) {
    hideModal(modalId);
}

// Reset form
function resetForm() {
    currentStep = 1;
    selectedGame = '';
    selectedNominal = '';
    selectedPayment = '';
    totalPrice = 0;
    
    // Reset form elements
    document.getElementById('topupForm').reset();
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    
    // Reset verification result
    const verificationResult = document.getElementById('verificationResult');
    if (verificationResult) {
        verificationResult.style.display = 'none';
    }
    
    updateStepIndicator();
    showCurrentStep();
    updateOrderSummary();
    populateNominalOptions();
}

// Smooth scroll animation for hero buttons
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .testimonial-card, .game-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 23, 42, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(15, 23, 42, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Keyboard navigation for modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const visibleModal = document.querySelector('.modal[style*="block"]');
        if (visibleModal) {
            visibleModal.style.display = 'none';
        }
    }
});

// Mobile menu functionality
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Add click outside to close mobile menu
document.addEventListener('click', function(e) {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(function() {
    // Add any scroll-based animations or effects here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading states for better UX
function showLoadingState(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function hideLoadingState(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

// Error handling for network requests
function handleNetworkError(error) {
    console.error('Network error:', error);
    alert('Terjadi kesalahan jaringan. Silakan coba lagi.');
}

// Local storage for form data persistence
function saveFormData() {
    const formData = {
        selectedGame,
        selectedNominal,
        selectedPayment,
        userId: document.getElementById('userId')?.value || '',
        serverId: document.getElementById('serverId')?.value || ''
    };
    
    localStorage.setItem('topupFormData', JSON.stringify(formData));
}

function loadFormData() {
    const savedData = localStorage.getItem('topupFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        
        selectedGame = formData.selectedGame || '';
        selectedNominal = formData.selectedNominal || '';
        selectedPayment = formData.selectedPayment || '';
        
        if (formData.userId) {
            const userIdInput = document.getElementById('userId');
            if (userIdInput) userIdInput.value = formData.userId;
        }
        
        if (formData.serverId) {
            const serverIdSelect = document.getElementById('serverId');
            if (serverIdSelect) serverIdSelect.value = formData.serverId;
        }
        
        updateOrderSummary();
    }
}

// Save form data on input changes
document.addEventListener('input', debounce(saveFormData, 500));

// Load form data on page load
document.addEventListener('DOMContentLoaded', loadFormData);

// Clear saved data after successful transaction
function clearSavedFormData() {
    localStorage.removeItem('topupFormData');
}

