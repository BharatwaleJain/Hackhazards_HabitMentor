// Social and community features

// Initialize social features
function initSocial() {
    console.log('Social features initialized');
    // In a real app, this would connect to a backend for social functionality
}

// Send a nudge to an accountability partner
function sendNudge(partnerId) {
    console.log(`Reminder sent to partner ${partnerId}`);
    // In a real app, this would send a notification to the partner
    
    // Show confirmation for demo
    alert('Reminder sent successfully!');
}

// Join a challenge
function joinChallenge(challengeId) {
    console.log(`Joining challenge ${challengeId}`);
    // In a real app, this would register the user for the challenge
    
    // Show confirmation for demo
    alert('You have joined the challenge!');
    
    // Unlock social butterfly achievement if this is the first challenge
    const challenges = JSON.parse(localStorage.getItem('joinedChallenges') || '[]');
    if (challenges.length === 0) {
        unlockAchievement('social-butterfly');
    }
    
    // Add to joined challenges
    challenges.push(challengeId);
    localStorage.setItem('joinedChallenges', JSON.stringify(challenges));
}

// Like a community tip
function likeTip(tipId) {
    console.log(`Liked tip ${tipId}`);
    // In a real app, this would update the like count in the database
    
    // For demo, just increment the displayed count
    const likeButton = document.querySelector(`[data-tip-id="${tipId}"] .btn-heart`);
    if (likeButton) {
        const countSpan = likeButton.querySelector('span');
        if (countSpan) {
            let count = parseInt(countSpan.textContent);
            countSpan.textContent = count + 1;
        }
    }
}

// Add comment to a community tip
function addComment(tipId, commentText) {
    if (!commentText.trim()) {
        alert('Please enter a comment');
        return;
    }
    
    console.log(`Comment on tip ${tipId}: ${commentText}`);
    // In a real app, this would save the comment to the database
    
    // Show confirmation for demo
    alert('Comment added!');
}

// Add accountability partner
function addPartner(email) {
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    console.log(`Adding partner: ${email}`);
    // In a real app, this would send an invitation to the email address
    
    // Show confirmation for demo
    alert(`Invitation sent to ${email}`);
    
    // Unlock achievement if this is the first partner
    const partners = JSON.parse(localStorage.getItem('accountabilityPartners') || '[]');
    if (partners.length === 0) {
        unlockAchievement('social-butterfly');
    }
    
    // Add to partners list
    partners.push({
        email: email,
        name: email.split('@')[0], // Use part of email as name for demo
        joined: false,
        dateInvited: new Date().toISOString()
    });
    localStorage.setItem('accountabilityPartners', JSON.stringify(partners));
}

// Validate email format
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Share progress to social media (mock function)
function shareProgress() {
    const habits = getHabits();
    const completionRate = calculateCompletionRate(habits);
    const longestStreak = getLongestStreak(habits);
    
    const shareText = `I'm on a ${longestStreak}-day streak with my habits and have completed ${completionRate}% of today's goals! #HabitMentor`;
    
    console.log(`Sharing: ${shareText}`);
    // In a real app, this would open a share dialog
    
    // For demo purposes, just copy to clipboard and show alert
    navigator.clipboard.writeText(shareText)
        .then(() => {
            alert('Progress copied to clipboard! In a real app, this would share to social media.');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Text to share: ' + shareText);
        });
}