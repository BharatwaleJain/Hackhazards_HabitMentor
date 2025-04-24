// Main application functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the app
    initApp();

    // Register event listeners
    registerEventListeners();

    // Load and render habits
    loadAndRenderHabits();

    // Initialize charts (for insights view)
    initCharts();

    // Initialize achievement system
    initAchievements();

    // Show onboarding for first-time users
    if (!localStorage.getItem('onboardingComplete')) {
        showOnboarding();
    }

    // Handle placeholders for missing content
    showPlaceholderForMissingContent();
});

// Initialize the application
function initApp() {
    console.log('Initializing HabitMentor app...');

    // Set current date in UI
    updateDateDisplay();

    // Initialize navigation
    initNavigation();

    // Create sample data if first time
    if (!localStorage.getItem('habits')) {
        createSampleData();
    }
}

// Register all event listeners
function registerEventListeners() {
    // Navigation event listeners
    document.querySelectorAll('.nav-link[data-view]').forEach(navLink => {
        navLink.addEventListener('click', function (e) {
            e.preventDefault();
            const viewToShow = this.getAttribute('data-view');
            showView(viewToShow);
        });
    });

    // Form submission for new habits - Updated with validation
    document.getElementById('save-habit-btn').addEventListener('click', validateAndSaveHabit);

    // Onboarding navigation buttons
    document.getElementById('onboarding-next-btn').addEventListener('click', handleOnboardingNavigation);
    document.getElementById('onboarding-back-btn').addEventListener('click', handleOnboardingBack);
    document.getElementById('onboarding-finish-btn').addEventListener('click', completeOnboarding);

    // Mood selection in congrats modal
    document.querySelectorAll('.mood-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            saveMoodSelection(this.getAttribute('data-mood'));
        });
    });

    // Save reflection button
    document.getElementById('save-reflection').addEventListener('click', saveReflection);

    // Form field event listeners for validation
    const formFields = document.querySelectorAll('#new-habit-form input[required], #new-habit-form select[required]');
    formFields.forEach(field => {
        field.addEventListener('change', function () {
            validateField(this);
        });
        field.addEventListener('blur', function () {
            validateField(this);
        });
    });

    // Edit and delete from modal
    document.getElementById('update-habit-btn').addEventListener('click', validateAndUpdateHabit);
    document.getElementById('delete-habit-btn').addEventListener('click', deleteHabitFromModal);

    // Form field event listeners for edit form validation
    const editFormFields = document.querySelectorAll('#edit-habit-form input[required], #edit-habit-form select[required]');
    editFormFields.forEach(field => {
        field.addEventListener('change', function () {
            validateField(this);
        });
        field.addEventListener('blur', function () {
            validateField(this);
        });
    });

    // Send Nudge button in social view
    document.querySelectorAll('.send-nudge-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const partnerId = this.dataset.partnerId;
            const partnerName = this.dataset.partnerName;
            showNudgeModal(partnerId, partnerName);
        });
    });

    // Send nudge button in modal
    document.getElementById('send-nudge-btn').addEventListener('click', handleSendNudge);

    // Like buttons for community tips
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', toggleLike);
    });

    // Comment buttons for community tips
    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.addEventListener('click', showComments);
    });

    // Post comment button
    document.getElementById('post-comment-btn').addEventListener('click', postComment);
}

// Validate a single form field
function validateField(field) {
    if (!field.value.trim()) {
        field.classList.add('is-invalid');
        return false;
    } else {
        field.classList.remove('is-invalid');
        return true;
    }
}

// Validate all form fields and save habit if valid
function validateAndSaveHabit() {
    const habitName = document.getElementById('habit-name');
    const habitCategory = document.getElementById('habit-category');
    const habitFrequency = document.getElementById('habit-frequency');

    let isValid = true;

    // Validate each required field
    if (!validateField(habitName)) isValid = false;
    if (!validateField(habitCategory)) isValid = false;
    if (!validateField(habitFrequency)) isValid = false;

    // If all validations pass, proceed to save the habit
    if (isValid) {
        saveNewHabit();
    }
}

// Show placeholders for missing content
function showPlaceholderForMissingContent() {
    // Find all elements with content-placeholder class
    const placeholders = document.querySelectorAll('.content-placeholder');

    placeholders.forEach(placeholder => {
        if (!placeholder.textContent.trim() || placeholder.textContent === 'Will be added in future') {
            placeholder.textContent = 'Will be added in future';
        }
    });

    // For badge images without icons, add a placeholder icon
    const badgeImagesWithoutIcons = document.querySelectorAll('.badge-image:not(:has(i))');
    badgeImagesWithoutIcons.forEach(badge => {
        if (!badge.querySelector('i')) {
            badge.innerHTML = '<i class="bi bi-image text-secondary display-1"></i>';
        }
    });
}

// Switch between different views
function showView(viewName) {
    document.querySelectorAll('.view-container').forEach(view => {
        view.classList.add('d-none');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(`${viewName}-view`).classList.remove('d-none');
    document.querySelector(`.nav-link[data-view="${viewName}"]`).classList.add('active');

    // Special initialization for certain views
    if (viewName === 'insights') {
        updateCharts();
    }
}

// Load and render all habits
function loadAndRenderHabits() {
    const habits = getHabits();
    renderHabits(habits);
    updateProgressBar(habits);
}

// Render habits in their respective category lists
function renderHabits(habits) {
    // Clear all habit lists
    document.querySelectorAll('.habit-list').forEach(list => {
        list.innerHTML = '';
    });

    // Sort habits by completed status (incomplete first)
    habits.sort((a, b) => {
        if (a.completedToday === b.completedToday) return 0;
        return a.completedToday ? 1 : -1;
    });

    // If no habits, show empty state
    if (habits.length === 0) {
        const emptyState = `
            <div class="text-center py-5">
                <i class="bi bi-journal-plus display-1 text-muted"></i>
                <h5 class="mt-3">No habits yet</h5>
                <p>Click "Add Habit" to get started on your journey!</p>
            </div>
        `;
        document.getElementById('all-habits-list').innerHTML = emptyState;
        return;
    }

    // Render habits in their respective lists
    habits.forEach(habit => {
        const habitCard = createHabitCard(habit);

        // Add to "All" tab
        document.getElementById('all-habits-list').appendChild(habitCard.cloneNode(true));

        // Add to category-specific tab
        const categoryList = document.getElementById(`${habit.category}-habits-list`);
        if (categoryList) {
            categoryList.appendChild(habitCard);
        }
    });

    // Add event listeners to the habit checkboxes and buttons
    document.querySelectorAll('.habit-check').forEach(check => {
        check.addEventListener('click', toggleHabitCompletion);
    });

    document.querySelectorAll('.habit-delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteHabit);
    });

    // Add edit button event listeners
    document.querySelectorAll('.edit-habit-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const habitId = this.dataset.id;
            populateEditForm(habitId);
            const editModal = new bootstrap.Modal(document.getElementById('editHabitModal'));
            editModal.show();
        });
    });
}

// Create a habit card element
function createHabitCard(habit) {
    const div = document.createElement('div');
    div.className = `card shadow-sm habit-card ${habit.category}`;
    div.dataset.id = habit.id;
    let streakClass = habit.streak >= 5 ? 'good' : '';
    let checkClass = habit.completedToday ? 'completed' : '';
    div.innerHTML = `
        <div class="card-body d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <div class="habit-check ${checkClass}" data-id="${habit.id}">
                    ${habit.completedToday ? '<i class="bi bi-check"></i>' : ''}
                </div>
                <div class="ms-3">
                    <h5 class="card-title mb-1">${habit.name}</h5>
                    <p class="card-text text-muted mb-0 small">${getCategoryLabel(habit.category)} · ${getFrequencyLabel(habit.frequency)}</p>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <span class="streak-indicator ${streakClass}">
                    <i class="bi bi-lightning-fill me-1"></i> ${habit.streak}
                </span>
                <div class="dropdown ms-2">
                    <button class="btn btn-sm btn-link text-muted" type="button" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><button class="dropdown-item edit-habit-btn" data-id="${habit.id}">Edit</button></li>
                        <li><button class="dropdown-item text-danger habit-delete-btn" data-id="${habit.id}">Delete</button></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    return div;
}

// Handle habit completion toggle
function toggleHabitCompletion() {
    const habitId = this.dataset.id;
    const habits = getHabits();

    const habitIndex = habits.findIndex(h => h.id == habitId);
    if (habitIndex === -1) return;

    const habit = habits[habitIndex];
    habit.completedToday = !habit.completedToday;

    // Update streak
    if (habit.completedToday) {
        habit.streak += 1;
        habit.lastCompletedDate = new Date().toISOString();
        showCongratulationsModal(habit);
        checkForAchievements(habits);
    } else {
        habit.streak = Math.max(0, habit.streak - 1);
    }

    // Save changes
    habits[habitIndex] = habit;
    saveHabits(habits);

    // Update UI
    loadAndRenderHabits();
}

// Create a new habit
function saveNewHabit() {
    const habitName = document.getElementById('habit-name').value.trim();
    const category = document.getElementById('habit-category').value;
    const frequency = document.getElementById('habit-frequency').value;
    const reminderTime = document.getElementById('reminder-time').value;
    const difficulty = document.getElementById('habit-difficulty').value;
    const motivation = document.getElementById('habit-motivation').value.trim();

    // Create new habit object
    const newHabit = {
        id: Date.now(),
        name: habitName,
        category: category,
        frequency: frequency,
        reminderTime: reminderTime,
        difficulty: difficulty,
        motivation: motivation,
        streak: 0,
        completedToday: false,
        dateCreated: new Date().toISOString(),
        completionHistory: []
    };

    // Add to habits array
    const habits = getHabits();
    habits.push(newHabit);
    saveHabits(habits);

    // Check for "first habit" achievement
    if (habits.length === 1) {
        unlockAchievement('first-step');
    }

    // Reset form and close modal
    document.getElementById('new-habit-form').reset();

    // Remove any validation classes
    document.querySelectorAll('#new-habit-form .is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addHabitModal'));
    modal.hide();

    // Show success message
    const toast = new bootstrap.Toast(document.getElementById('achievementToast'));
    document.getElementById('achievement-name').textContent = 'New Habit Created';
    toast.show();

    // Refresh the habit list
    loadAndRenderHabits();
}

// Delete a habit
function deleteHabit(e) {
    e.stopPropagation();
    const habitId = this.dataset.id;

    if (confirm('Are you sure you want to delete this habit?')) {
        const habits = getHabits();
        const updatedHabits = habits.filter(h => h.id != habitId);
        saveHabits(updatedHabits);
        loadAndRenderHabits();
    }
}

// Update the progress bar
function updateProgressBar(habits) {
    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.completedToday).length;

    const progressBar = document.getElementById('daily-progress-bar');
    const habitsCompleted = document.getElementById('habits-completed');
    const habitsTotal = document.getElementById('habits-total');

    if (totalHabits > 0) {
        const progressPercentage = (completedHabits / totalHabits) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        if (progressPercentage === 100) {
            progressBar.classList.add('bg-success');
        } else {
            progressBar.classList.remove('bg-success');
        }
    } else {
        progressBar.style.width = '0%';
    }

    habitsCompleted.textContent = `${completedHabits} completed`;
    habitsTotal.textContent = `of ${totalHabits} habits`;
}

// Show congratulations modal
function showCongratulationsModal(habit) {
    const modal = new bootstrap.Modal(document.getElementById('congratsModal'));

    document.getElementById('congrats-message').textContent = `You completed "${habit.name}"!`;
    document.getElementById('current-streak').textContent = habit.streak;

    // Reset mood selection
    document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));

    modal.show();
}

// Save mood selection after completing a habit
function saveMoodSelection(mood) {
    console.log(`Mood saved: ${mood}`);
    // In a real app, you would save this to the habit's completion history
}

// Save reflection
function saveReflection() {
    const reflectionText = document.getElementById('reflection-text').value.trim();

    if (reflectionText) {
        // In a real app, you would save this to the user's reflection history
        console.log(`Reflection saved: ${reflectionText}`);

        // Save to local storage for demo purposes
        const reflections = JSON.parse(localStorage.getItem('reflections') || '[]');
        reflections.push({
            text: reflectionText,
            date: new Date().toISOString()
        });
        localStorage.setItem('reflections', JSON.stringify(reflections));

        // Show success message
        document.getElementById('reflection-text').value = '';
        alert('Reflection saved successfully!');

        // Check for reflection achievement
        if (reflections.length === 5) {
            unlockAchievement('reflection-starter');
        }
    } else {
        // Show validation error
        alert('Please enter your reflection before saving.');
    }
}

// Helper functions
function getHabits() {
    return JSON.parse(localStorage.getItem('habits') || '[]');
}

function saveHabits(habits) {
    localStorage.setItem('habits', JSON.stringify(habits));
}

function getCategoryLabel(category) {
    const categories = {
        'health': 'Health & Fitness',
        'productivity': 'Productivity',
        'learning': 'Learning',
        'mindfulness': 'Mindfulness',
        'other': 'Other'
    };
    return categories[category] || 'Other';
}

function getFrequencyLabel(frequency) {
    const frequencies = {
        'daily': 'Daily',
        'weekdays': 'Weekdays',
        'weekends': 'Weekends',
        'weekly': 'Weekly'
    };
    return frequencies[frequency] || 'Daily';
}

function updateDateDisplay() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    // If you have a date display element, update it here
}

// Onboarding functions
function showOnboarding() {
    const onboardingModal = new bootstrap.Modal(document.getElementById('onboardingModal'));
    onboardingModal.show();
}

function handleOnboardingNavigation() {
    const carousel = document.getElementById('onboarding-carousel');
    const bsCarousel = bootstrap.Carousel.getInstance(carousel);

    // Get the current slide index
    const activeSlide = carousel.querySelector('.carousel-item.active');
    const slides = carousel.querySelectorAll('.carousel-item');
    const currentIndex = Array.from(slides).indexOf(activeSlide);

    // If we're on the last slide, show the finish button
    if (currentIndex === slides.length - 2) {
        document.getElementById('onboarding-next-btn').classList.add('d-none');
        document.getElementById('onboarding-finish-btn').classList.remove('d-none');
    }

    // Go to next slide
    bsCarousel.next();
}

function handleOnboardingBack() {
    const carousel = document.getElementById('onboarding-carousel');
    const bsCarousel = bootstrap.Carousel.getInstance(carousel);

    // Reset buttons if going back from last slide
    document.getElementById('onboarding-next-btn').classList.remove('d-none');
    document.getElementById('onboarding-finish-btn').classList.add('d-none');

    // Go to previous slide
    bsCarousel.prev();
}

function completeOnboarding() {
    // Save user preferences
    const username = document.getElementById('username').value.trim() || 'User';
    const primaryGoal = document.getElementById('primary-goal').value;
    const notificationTime = document.getElementById('notification-time').value;

    localStorage.setItem('username', username);
    localStorage.setItem('primaryGoal', primaryGoal);
    localStorage.setItem('notificationTime', notificationTime);
    localStorage.setItem('onboardingComplete', 'true');

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('onboardingModal'));
    modal.hide();

    // Create sample habits based on primary goal
    createSampleHabitsBasedOnGoal(primaryGoal);

    // Refresh UI
    loadAndRenderHabits();
}

// Populate the edit form with habit data
function populateEditForm(habitId) {
    const habits = getHabits();
    const habit = habits.find(h => h.id == habitId);

    if (!habit) return;

    document.getElementById('edit-habit-id').value = habit.id;
    document.getElementById('edit-habit-name').value = habit.name;
    document.getElementById('edit-habit-category').value = habit.category;
    document.getElementById('edit-habit-frequency').value = habit.frequency;
    document.getElementById('edit-reminder-time').value = habit.reminderTime || '';
    document.getElementById('edit-habit-difficulty').value = habit.difficulty;
    document.getElementById('edit-habit-motivation').value = habit.motivation || '';

    // Clear any validation classes
    document.querySelectorAll('#edit-habit-form .is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });
}

// Validate edit form and update habit
function validateAndUpdateHabit() {
    const habitId = document.getElementById('edit-habit-id').value;
    const habitName = document.getElementById('edit-habit-name');
    const habitCategory = document.getElementById('edit-habit-category');
    const habitFrequency = document.getElementById('edit-habit-frequency');

    let isValid = true;

    // Validate each required field
    if (!validateField(habitName)) isValid = false;
    if (!validateField(habitCategory)) isValid = false;
    if (!validateField(habitFrequency)) isValid = false;

    // If all validations pass, proceed to update the habit
    if (isValid) {
        updateHabit(habitId);
    }
}

// Update a habit
function updateHabit(habitId) {
    const habits = getHabits();
    const habitIndex = habits.findIndex(h => h.id == habitId);

    if (habitIndex === -1) return;

    // Get values from form
    const name = document.getElementById('edit-habit-name').value.trim();
    const category = document.getElementById('edit-habit-category').value;
    const frequency = document.getElementById('edit-habit-frequency').value;
    const reminderTime = document.getElementById('edit-reminder-time').value;
    const difficulty = document.getElementById('edit-habit-difficulty').value;
    const motivation = document.getElementById('edit-habit-motivation').value.trim();

    // Update habit object
    habits[habitIndex] = {
        ...habits[habitIndex], // Keep existing properties (like streaks)
        name,
        category,
        frequency,
        reminderTime,
        difficulty,
        motivation
    };

    // Save changes
    saveHabits(habits);

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editHabitModal'));
    modal.hide();

    // Show success message
    const toast = new bootstrap.Toast(document.getElementById('achievementToast'));
    document.getElementById('achievement-name').textContent = 'Habit Updated';
    toast.show();

    // Refresh habit list
    loadAndRenderHabits();
}

// Delete a habit from the edit modal
function deleteHabitFromModal() {
    const habitId = document.getElementById('edit-habit-id').value;

    if (confirm('Are you sure you want to delete this habit?')) {
        const habits = getHabits();
        const updatedHabits = habits.filter(h => h.id != habitId);
        saveHabits(updatedHabits);

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editHabitModal'));
        modal.hide();

        // Show deletion message
        const toast = new bootstrap.Toast(document.getElementById('achievementToast'));
        document.getElementById('achievement-name').textContent = 'Habit Deleted';
        toast.show();

        // Refresh habit list
        loadAndRenderHabits();
    }
}

// Show nudge modal when Send Nudge button is clicked
function showNudgeModal(partnerId, partnerName) {
    // Set the partner name in the modal
    document.getElementById('nudge-recipient-name').textContent = partnerName;

    // Store the partner ID in a data attribute for use when sending
    document.getElementById('send-nudge-btn').dataset.partnerId = partnerId;

    // Clear any previous message
    document.getElementById('nudge-message').value = '';

    // Uncheck anonymous checkbox
    document.getElementById('send-anonymously').checked = false;

    // Show the modal
    const nudgeModal = new bootstrap.Modal(document.getElementById('nudgeModal'));
    nudgeModal.show();
}

// Handle sending the nudge
function handleSendNudge() {
    // Get partner ID from the button's data attribute
    const partnerId = this.dataset.partnerId;

    // Get message and anonymous status
    const message = document.getElementById('nudge-message').value.trim();
    const isAnonymous = document.getElementById('send-anonymously').checked;

    // In a real app, this would send the nudge to the backend
    console.log(`Sending nudge to partner ${partnerId}`);
    console.log(`Message: ${message}`);
    console.log(`Anonymous: ${isAnonymous}`);

    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('nudgeModal'));
    modal.hide();

    // Show success toast
    const toast = new bootstrap.Toast(document.getElementById('nudgeSentToast'));
    toast.show();
}

// Toggle like for a community tip
function toggleLike() {
    const tipId = this.dataset.tipId;
    const isLiked = this.dataset.liked === 'true';
    
    // Toggle liked state
    this.dataset.liked = !isLiked;
    
    // Update the like count
    const likeCountElement = this.querySelector('.like-count');
    let likeCount = parseInt(likeCountElement.textContent);
    
    if (isLiked) {
        // Unlike - decrease count
        likeCount--;
        this.classList.remove('btn-primary');
        this.classList.add('btn-outline-primary');
        this.querySelector('i').classList.remove('bi-heart-fill');
        this.querySelector('i').classList.add('bi-heart');
    } else {
        // Like - increase count
        likeCount++;
        this.classList.remove('btn-outline-primary');
        this.classList.add('btn-primary');
        this.querySelector('i').classList.remove('bi-heart');
        this.querySelector('i').classList.add('bi-heart-fill');
    }
    
    likeCountElement.textContent = likeCount;
    
    // In a real app, you would save this to the backend
    console.log(`Tip ${tipId} like toggled. New state: ${!isLiked}`);
}

// Show comments for a community tip
function showComments() {
    const tipId = this.dataset.tipId;
    const author = this.dataset.author;
    
    // Set the modal title to include the tip author
    document.querySelector('#commentsModal .modal-title').textContent = `Comments on ${author}'s Tip`;
    
    // Store the tip ID on the Post Comment button
    document.getElementById('post-comment-btn').dataset.tipId = tipId;
    
    // Clear the comment text area
    document.getElementById('new-comment-text').value = '';
    
    // Load comments (in a real app, this would fetch from a database)
    loadComments(tipId);
    
    // Show the modal
    const commentsModal = new bootstrap.Modal(document.getElementById('commentsModal'));
    commentsModal.show();
}

// Load comments for a tip
function loadComments(tipId) {
    const commentsContainer = document.getElementById('comments-container');
    const noCommentsMessage = document.getElementById('no-comments-message');
    
    // Get existing comments from localStorage or use empty array
    let storedComments = localStorage.getItem(`comments_${tipId}`);
    let comments = storedComments ? JSON.parse(storedComments) : [];
    
    // Clear current comments
    commentsContainer.innerHTML = '';
    
    // If no comments, show message
    if (comments.length === 0) {
        commentsContainer.appendChild(noCommentsMessage);
        return;
    }
    
    // Add each comment to the container
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item mb-3 p-3 border rounded';
        commentElement.innerHTML = `
            <div class="d-flex justify-content-between mb-2">
                <h6 class="mb-0">${comment.author}</h6>
                <small class="text-muted">${formatTimestamp(comment.timestamp)}</small>
            </div>
            <p class="mb-0">${comment.text}</p>
        `;
        commentsContainer.appendChild(commentElement);
    });
}

// Post a new comment
function postComment() {
    const tipId = this.dataset.tipId;
    const commentText = document.getElementById('new-comment-text').value.trim();
    
    if (!commentText) {
        alert('Please enter a comment');
        return;
    }
    
    // Get username from localStorage or use default
    const username = localStorage.getItem('username') || 'You';
    
    // Create comment object
    const newComment = {
        id: Date.now(),
        tipId: tipId,
        author: username,
        text: commentText,
        timestamp: new Date().toISOString()
    };
    
    // Get existing comments or create empty array
    let storedComments = localStorage.getItem(`comments_${tipId}`);
    let comments = storedComments ? JSON.parse(storedComments) : [];
    
    // Add new comment to array
    comments.unshift(newComment);
    
    // Save to localStorage
    localStorage.setItem(`comments_${tipId}`, JSON.stringify(comments));
    
    // Reload comments
    loadComments(tipId);
    
    // Clear textarea
    document.getElementById('new-comment-text').value = '';
}

// Helper function to format timestamps
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
        return `Today at ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}