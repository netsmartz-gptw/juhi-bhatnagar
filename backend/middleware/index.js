const auth = require('./auth');
const parentRole = require('./parentRole');
const childRole = require('./childRole');
const markAllCompleted = require('./markAllCompletedMiddleware')
const markAsComplete = require('./markChoreCompletedMiddleware')

module.exports = {
    auth,
    parentRole,
    childRole,
    markAllCompleted,
    markAsComplete
};
