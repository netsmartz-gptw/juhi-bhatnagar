module.exports = {
    apiurls: {
        createNotifications: {
            url: 'admin/notifications',
            method: 'post'
        }
    },
    notifications: {
        chore_created: {
            type: 'chore_created',
            description: 'New chore is assigned to you',
            title: 'Chore Created'
        },
        chore_completed: {
            type: 'chore_completed',
            description: 'A chore is marked completed. Please review',
            title: 'Chore Completed'
        }
    }
}