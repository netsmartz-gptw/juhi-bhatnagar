const InvoiceEnum = {
    InvoiceStatusEnum: {
        'Draft': 1,
        'Finalize': 2,
        'Cancelled': 3,
        'FullPaymentCreated': 4,  //'PayInProgress' : 4,
        'PaymentPlanCreated': 5,
        'OneTimeScheduledCreated': 6,   //'PayScheduled' : 6,
        'SubscriptionPlanCreated': 7,
        'InProgress': 8, //Unknown : 100,Created : 0,Pending : 1,Approved : 10,
        'Paid': 9,  //Authorized : 2,Success : 16,
        'Unpaid': 10,  //Failed : 5, Cancelled : 8,Refunded : 9,CancelAttempt : 11,RefundAttempt : 12,Denied : 14
        'Unsubscribed': 11, //subscription payment plan when cancel : 8
        'Closed': 30
    },
    InvoiceStatusReportEnum: {
        'Ready To Send': 1,
        'Awaiting Payment': 2,
        'Cancelled': 3,
        'Full payment created': 4,
        'Payment plan created': 5,
        'OneTime scheduled created': 6,
        'Subscription plan created': 7,
        'In progress': 8,
        'Paid': 9,
        'Unpaid': 10,
        'Unsubscribed': 11,
        'Closed': 30
    },
    InvoiceStatusMapEnum: {
        'Draft': 'Ready To Send',
        'Finalize': 'Awaiting Payment',
        'Cancelled': 'Cancelled',
        'FullPaymentCreated': 'Payment Created',
        'PaymentPlanCreated': 'Payment Plan Created',
        'OneTimeScheduledCreated': 'Payment Scheduled',
        'SubscriptionPlanCreated': 'Subscription Plan Created',
        'InProgress': 'In Progress',
        'Paid': 'Paid',
        'Unpaid': 'Unpaid',
        'Unsubscribed': 'Unsubscribed',
        'Closed': 'Closed'
    }
    ,
    InvoicePaymentStatusEnum: {
        'Unpaid': 1,
        'PartiallyPaid': 2,
        'Paid': 3
    }
    ,
    InvoiceLineItemSourceEnum: {
        'Product': 1,
        'Manual': 2
    }
    ,
    InvoiceTypeEnum: {
        'OneTime': 0,
        'Installment': 1,
        'ScheduledOneTime': 2,
        'Subscription': 3
    },
    InvoiceTypeMapEnum: {
        'OneTime': 'Full Payment',
        'Installment': 'Installment',
        'ScheduledOneTime': 'Scheduled One Time',
        'Subscription': 'Subscription'
    }
}