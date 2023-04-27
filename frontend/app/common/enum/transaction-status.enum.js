const TransactionStatusEnum = {
0: 'Created',
1: 'Pending',
2: 'Authorized',
3: 'Posted',
4: 'Captured',  // (Earlier it was- Settled)
5: 'Failed',
6: 'Returned',
7: 'Chargeback',
8: 'Cancelled',
9: 'Refunded',
10: 'Paid',
11: 'Cancel Attempt',
12: 'Refund Attempt',
13: 'Hold',
14: 'Denied',
15: 'Settlement Hold',
16: 'Paid',
17: 'Retried',
18: 'Reprocess Attempt',
19: 'Reprocessed',
100: 'Unknown',
101: 'Partially Captured',
102: 'Partially Returned',
103: 'Partial Return Requested',
30: 'Closed',
25: 'Deleted' //where Recurring schdule table record is deleted
}

export default TransactionStatusEnum