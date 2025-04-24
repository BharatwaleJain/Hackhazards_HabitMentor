// Achievement system functionality

// Initialize achievement system
function initAchievements() {
    // Initialize achievement system
    if (!localStorage.getItem('achievements')) {
        const initialAchievements = {
            'first-step': false,
            'consistent': false,
            'social-butterfly': false,
            'week-warrior': false,
            'habit-master': false,
            'reflection-starter': false
        };
        localStorage.setItem('achievements', JSON.stringify(initialAchievements));
    }
}

// Unlock a new achievement
function unlockAchievement(achievementId) {
    const achievements = JSON.parse(localStorage.getItem('achievements'));
    
    // If already unlocked, don't show notification again
    if (achievements[achievementId]) return;
    
    achievements[achievementId] = true;
    localStorage.setItem('achievements', JSON.stringify(achievements));
    
    // Show achievement toast
    const achievementNames = {
        'first-step': 'First Step',
        'consistent': 'Consistent',
        'social-butterfly': 'Social Butterfly',
        'week-warrior': 'Week Warrior',
        'habit-master': 'Habit Master',
        'reflection-starter': 'Reflection Starter'
    };
    
    document.getElementById('achievement-name').textContent = achievementNames[achievementId];
    const toast = new bootstrap.Toast(document.getElementById('achievementToast'));
    toast.show();
}

// Check for achievements based on user activity
function checkForAchievements(habits) {
    // Check for "consistent" achievement (3-day streak for all habits)
    const allHabitsCompleted = habits.every(h => h.completedToday);
    const habitsExist = habits.length > 0;
    
    if (allHabitsCompleted && habitsExist) {
        const consecutive = localStorage.getItem('consecutiveDays') || '0';
        const consecutiveDays = parseInt(consecutive) + 1;
        localStorage.setItem('consecutiveDays', consecutiveDays.toString());
        
        if (consecutiveDays >= 3) {
            unlockAchievement('consistent');
        }
        
        if (consecutiveDays >= 7) {
            unlockAchievement('week-warrior');
        }
    } else {
        localStorage.setItem('consecutiveDays', '0');
    }
    
    // Check for "habit-master" achievement (30-day streak on any habit)
    const anyLongStreak = habits.some(h => h.streak >= 30);
    if (anyLongStreak) {
        unlockAchievement('habit-master');
    }
}

// Get all achievements
function getAllAchievements() {
    return JSON.parse(localStorage.getItem('achievements') || '{}');
}

// Check if an achievement is unlocked
function isAchievementUnlocked(achievementId) {
    const achievements = getAllAchievements();
    return achievements[achievementId] || false;
}

// Get count of unlocked achievements
function getUnlockedAchievementCount() {
    const achievements = getAllAchievements();
    return Object.values(achievements).filter(Boolean).length;
}

// Get total achievement count
function getTotalAchievementCount() {
    const achievements = getAllAchievements();
    return Object.keys(achievements).length;
}