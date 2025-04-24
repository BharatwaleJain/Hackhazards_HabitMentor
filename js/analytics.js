// Analytics and data visualization

// Initialize charts
function initCharts() {
    // Completion Chart
    const completionCtx = document.getElementById('completion-chart').getContext('2d');
    window.completionChart = new Chart(completionCtx, {
        type: 'line',
        data: {
            labels: getLast7Days(),
            datasets: [{
                label: 'Completion Rate (%)',
                data: [0, 0, 0, 0, 0, 0, 0],
                fill: true,
                backgroundColor: 'rgba(40, 167, 69, 0.2)',
                borderColor: 'rgba(40, 167, 69, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
    
    // Streak Chart
    const streakCtx = document.getElementById('streak-chart').getContext('2d');
    window.streakChart = new Chart(streakCtx, {
        type: 'bar',
        data: {
            labels: ['Top Habits'],
            datasets: []
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Initialize calendar view
    initCalendarView();
}

// Update charts with current data
function updateCharts() {
    const habits = getHabits();
    
    // Update completion chart with mock data
    // In a real app, you would use actual historical data
    const mockCompletionData = [65, 72, 60, 85, 90, 75, 70];
    window.completionChart.data.datasets[0].data = mockCompletionData;
    window.completionChart.update();
    
    // Update streak chart
    const habitsByStreak = [...habits].sort((a, b) => b.streak - a.streak).slice(0, 5);
    const streakData = {
        labels: habitsByStreak.map(h => h.name),
        datasets: [{
            label: 'Current Streak',
            data: habitsByStreak.map(h => h.streak),
            backgroundColor: [
                'rgba(40, 167, 69, 0.7)',
                'rgba(0, 123, 255, 0.7)',
                'rgba(111, 66, 193, 0.7)',
                'rgba(255, 193, 7, 0.7)',
                'rgba(220, 53, 69, 0.7)'
            ]
        }]
    };
    
    window.streakChart.data.labels = streakData.labels;
    window.streakChart.data.datasets = streakData.datasets;
    window.streakChart.update();
    
    // Update calendar view
    updateCalendarView();
}

// Initialize the calendar view
function initCalendarView() {
    const calendarContainer = document.getElementById('calendar-view');
    const days = getLast7Days(true);
    
    days.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.innerHTML = `
            <div class="date">${day.short}</div>
            <div class="day-name">${day.weekday}</div>
            <div class="completion-dots">
                <span class="completion-dot"></span>
                <span class="completion-dot"></span>
                <span class="completion-dot"></span>
            </div>
        `;
        calendarContainer.appendChild(dayDiv);
    });
}

// Update the calendar view with completion data
function updateCalendarView() {
    // In a real app, you would use actual historical data to populate the dots
    const dots = document.querySelectorAll('.completion-dot');
    dots.forEach(dot => {
        if (Math.random() > 0.4) {
            dot.classList.add('completed');
        } else {
            dot.classList.remove('completed');
        }
    });
}

// Get the last 7 days for chart labels
function getLast7Days(detailed = false) {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        if (detailed) {
            days.push({
                full: date.toLocaleDateString(),
                short: date.getDate(),
                weekday: dayNames[date.getDay()]
            });
        } else {
            days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
    }
    
    return days;
}

// Calculate habit completion rate
function calculateCompletionRate(habits) {
    if (!habits || habits.length === 0) return 0;
    
    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.completedToday).length;
    
    return Math.round((completedHabits / totalHabits) * 100);
}

// Get average streak across all habits
function getAverageStreak(habits) {
    if (!habits || habits.length === 0) return 0;
    
    const totalStreak = habits.reduce((total, habit) => total + habit.streak, 0);
    return Math.round(totalStreak / habits.length);
}

// Get longest streak from all habits
function getLongestStreak(habits) {
    if (!habits || habits.length === 0) return 0;
    
    return Math.max(...habits.map(h => h.streak));
}