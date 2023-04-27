const dev_urls = {
    'users': 'https://devapi.buckone.org/users',
    'chores': 'https://devapi.buckone.org/chores',
    'moodle': 'https://devapi.buckone.org/moodle',
    'subscription': 'https://devapi.buckone.org/subscription',
    'galileo': 'https://devapi.buckone.org/galileo',
}

const qa_urls = {
    'users': 'https://qaapi.buckone.org/users',
    'chores': 'https://qaapi.buckone.org/chores',
    'moodle': 'https://qaapi.buckone.org/moodle',
    'subscription': 'https://qaapi.buckone.org/subscription',
    'galileo': 'https://qaapi.buckone.org/galileo',
}

const prod_urls = {
    'users': 'https://uatapi.buckone.org/users',
    'chores': 'https://uatapi.buckone.org/chores',
    'moodle': 'https://uatapi.buckone.org/moodle',
    'subscription': 'https://uatapi.buckone.org/subscription',
    'galileo': 'https://uatapi.buckone.org/galileo',
}

const local_urls = {
    'users': 'localhost:3000',
    'chores': 'localhost:3001',
    'moodle': 'localhost:3002',
    'subscription': 'localhost:3003',
    'galileo': 'localhost:3004',
}

module.exports = {
    development: dev_urls,
    production: prod_urls,
    localhost: local_urls,
    qa: qa_urls
}