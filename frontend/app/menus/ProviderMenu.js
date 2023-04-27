import label from '../../assets/i18n/en.json'
const ProviderMenu =
    [
        { title: 'Dashboard', path: '', icon: 'home' },
        {
            title: 'Scheduling', path: 'schedule', icon: 'calendar alternate outline', children: [
                { title: 'Calendar', path: 'schedule/calendar', icon: 'calendar alternate outline' },
                { title: 'Availability', path: 'schedule/availability', icon: 'user md' },
            ]
        },
        {
            title: 'Patient Management', path: 'patient', icon: 'heartbeat', children: [
                {title: 'Provider Notes', path: 'patient/notes'}
            ]
        },

        {
            title: 'Payments', path: 'payments', icon: 'dollar sign', children: [
                // { title: 'Transactions', path: 'payments/transactions' },
                // { title: 'Receipts', path: 'payments/receipts' },
                { title: 'Subscriptions', path: 'payments/subscriptions' },
                { title: 'Payment Plans', path: 'payments/payment-plans' },
            ]
        },
        // {
        //     title: 'Insurance', path: 'insurance', icon: 'circle plus', disabled: true, children: [
        //         { title: 'Claims', path: 'insurance/claims' },
        //         // { title: 'Discovery', path: 'insurance/discovery' },
        //         { title: 'Eligibility', path: 'insurance/eligibility' },
        //     ]
        // },
        // {
        //     title: 'Notifications', path: 'notifications', icon: 'bell', children: [
        //         { title: 'Surveys', path: 'notifications/surveys' },
        //         { title: 'Promotions', path: 'notifications/promotions' },
        //     ]
        // },
        // {
        //     title: 'Inventory', path: 'inventory', icon: 'clipboard check', children: [
        //         { title: 'Equipment', path: `inventory/equipment` },
        //         { title: 'Inventory Audit', path: `inventory/audit` },
        //         { title: 'Equipment Audit', path: `inventory/audit`, icon: 'star' },
        //     ]
        // },
        { title: 'Reports', path: 'reports', icon: 'clipboard', children:[
            {title: 'Transactions', path: 'reports/transactions'},
            {title: 'Appointment', path: 'reports/appointment'},
            {title: 'Patient', path: 'reports/patient'},
            {title: 'Service', path: 'reports/service'},
            {title: 'Product', path: 'reports/product'},
            {title: 'Payments', path: 'reports/payments'},
         ] },
        { title: 'Settings', path: 'settings', icon: 'sliders horizontal',children:[
            {title: 'Practice', path: 'settings/practice'},
            {title: 'Add Patient Account', path: 'settings/patient-account/add'}, //Temp
            {title: 'Provider', path: 'settings/provider'},
            {title: 'User', path: 'settings/user'},
            {title: 'Notifications', path: 'settings/notifications'},
        ]

         },
        //  {title: 'Notifications', path: 'notification', icon:'bell'}
        // {
        //     title: 'Support', path: 'support', icon: 'exclamation', children: [
        //         { title: 'Training Videos', path: 'support/training' },
        //         { title: 'Tutorials', path: 'support/tutorials' },
        //         { title: 'Contact Us', path: 'support/contact' },
        //     ]
        // }
    ]

export default ProviderMenu