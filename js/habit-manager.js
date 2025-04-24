// Helper functions for habit management

// Create sample data for first-time users
function createSampleData() {
    const sampleHabits = [
        {
            id: 1,
            name: 'Drink 8 glasses of water',
            category: 'health',
            frequency: 'daily',
            reminderTime: '09:00',
            difficulty: 'easy',
            motivation: 'Stay hydrated for better energy and focus',
            streak: 3,
            completedToday: false,
            dateCreated: new Date(Date.now() - 86400000 * 5).toISOString(),
            completionHistory: []
        },
        {
            id: 2,
            name: 'Read for 20 minutes',
            category: 'learning',
            frequency: 'daily',
            reminderTime: '20:00',
            difficulty: 'medium',
            motivation: 'Expand knowledge and improve focus',
            streak: 1,
            completedToday: false,
            dateCreated: new Date(Date.now() - 86400000 * 3).toISOString(),
            completionHistory: []
        }
    ];
    
    saveHabits(sampleHabits);
}

function createSampleHabitsBasedOnGoal(goal) {
    let sampleHabits = [];
    
    switch(goal) {
        case 'health':
            sampleHabits = [
                {
                    id: Date.now(),
                    name: 'Drink 8 glasses of water',
                    category: 'health',
                    frequency: 'daily',
                    reminderTime: '09:00',
                    difficulty: 'easy',
                    motivation: 'Stay hydrated for better energy and focus',
                    streak: 0,
                    completedToday: false,
                    dateCreated: new Date().toISOString(),
                    completionHistory: []
                },
                {
                    id: Date.now() + 1,
                    name: 'Exercise for 30 minutes',
                    category: 'health',
                    frequency: 'daily',
                    reminderTime: '17:00',
                    difficulty: 'medium',
                    motivation: 'Stay fit and boost my mood',
                    streak: 0,
                    completedToday: false,
                    dateCreated: new Date().toISOString(),
                    completionHistory: []
                }
            ];
            break;
        case 'productivity':
            sampleHabits = [
                {
                    id: Date.now(),
                    name: 'Plan my day',
                    category: 'productivity',
                    frequency: 'daily',
                    reminderTime: '08:00',
                    difficulty: 'easy',
                    motivation: 'Start the day organized and focused',
                    streak: 0,
                    completedToday: false,
                    dateCreated: new Date().toISOString(),
                    completionHistory: []
                },
                {
                    id: Date.now() + 1,
                    name: 'Zero inbox',
                    category: 'productivity',
                    frequency: 'daily',
                    reminderTime: '16:00',
                    difficulty: 'medium',
                    motivation: 'Maintain email organization and reduce stress',
                    streak: 0,
                    completedToday: false,
                    dateCreated: new Date().toISOString(),
                    completionHistory: []
                }
            ];
            break;
        case 'learning':
            sampleHabits = [
                {
                    id: Date.now(),
                    name: 'Read for 20 minutes',
                    category: 'learning',
                    frequency: 'daily',
                    reminderTime: '20:00',
                    difficulty: 'medium',
                    motivation: 'Expand knowledge and improve focus',
                    streak: 0,
                    completedToday: false,
                    dateCreated: new Date().toISOString(),
                    completionHistory: []
                },
                {
                    id: Date.now() + 1,
                    name: 'Practice a new skill',
                    category: 'learning',
                    frequency: 'daily',
                    reminderTime: '18:00',
                    difficulty: 'medium',
                    motivation: 'Continuous improvement in my skills',
                    streak: 0,
                    completedToday: false,
                    dateCreated: new Date().toISOString(),
                    completionHistory: []
                }
            ];
            break;
        case 'mindfulness':
            sampleHabits = [
                {
                    id: Date.now(),
                    name: 'Meditate for 10 minutes',
                    category: 'mindfulness',
                    frequency: 'daily',
                    reminderTime: '07:00',
                    difficulty: 'medium',
                    motivation: 'Reduce stress and improve focus',
                    streak: 0,
                    completedToday: false,
                    dateCreated: new Date().toISOString(),
                    completionHistory: []
                },
                {
                    id: Date.now() + 1,
                    name: 'Practice gratitude',
                    category: 'mindfulness',
                    frequency: 'daily',
                    reminderTime: '21:00',
                    difficulty: 'easy',
                    motivation: 'Increase happiness and positive outlook',
                    streak: 0,
                    completedToday: false,
                    dateCreated: new Date().toISOString(),
                    completionHistory: []
                }
            ];
            break;
        default:
            sampleHabits = [
                {
                    id: Date.now(),
                    name: 'Drink 8 glasses of water',
                    category: 'health',
                    frequency: 'daily',
                    reminderTime: '09:00',
                    difficulty: 'easy',
                    motivation: 'Stay hydrated for better energy and focus',
                    streak: 0,
                    completedToday: false,
                    dateCreated: new Date().toISOString(),
                    completionHistory: []
                }
            ];
    }
    
    saveHabits(sampleHabits);
}

// Initialize navigation
function initNavigation() {
    // Nothing needed here currently
    console.log('Navigation initialized');
}

// Reset daily habit completion (should be called at midnight)
function resetDailyHabits() {
    const habits = getHabits();
    habits.forEach(habit => {
        // Only reset daily habits
        if (habit.frequency === 'daily' || 
            (habit.frequency === 'weekdays' && isWeekday()) ||
            (habit.frequency === 'weekends' && isWeekend())) {
            habit.completedToday = false;
        }
    });
    saveHabits(habits);
}

// Check if today is a weekday
function isWeekday() {
    const day = new Date().getDay();
    return day >= 1 && day <= 5; // Monday to Friday
}

// Check if today is a weekend
function isWeekend() {
    const day = new Date().getDay();
    return day === 0 || day === 6; // Sunday or Saturday
}

// Get habits due today
function getHabitsDueToday() {
    const habits = getHabits();
    return habits.filter(habit => {
        if (habit.frequency === 'daily') return true;
        if (habit.frequency === 'weekdays' && isWeekday()) return true;
        if (habit.frequency === 'weekends' && isWeekend()) return true;
        if (habit.frequency === 'weekly') {
            // For weekly habits, check if it's the day of week they were created
            const habitCreatedDate = new Date(habit.dateCreated);
            const today = new Date();
            return habitCreatedDate.getDay() === today.getDay();
        }
        return false;
    });
}