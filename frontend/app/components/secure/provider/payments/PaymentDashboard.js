import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Module from '../../../templates/components/Module'
import SideTabs from '../../../templates/layouts/SideTabs'
import FindAllInvoices from '../invoices/find-all-invoices/FindAllInvoices'
import PaymentPlanList from '../report/paymentPlan-list/PaymentPlanList'
import FindAllTransactionsList from '../transactions/find-all-transactions/FindAllTransactionsList'
import FindTransactions from '../transactions/find-transactions.js/FindTransactions'
import TransactionList from '../transactions/transactions-list/TransactionList'

const PaymentDashboard = (props) => {
    const [activeTab, setActiveTab] = useState()

    const navigate = useNavigate()
    useEffect(() => {
        changeTab(props.tab)
    }, [props.tab])

    const changeTab = (tab) => {
        if (tab === 'invoices') {
            navigate('/provider/payments')
            setActiveTab(tab)
        }
        else {
            navigate(`/provider/payments/${tab}`)
            setActiveTab(tab)
        }
    }
    return (
        <SideTabs title="Payment Dashboard" menuTitle="Payment Menu" activeKey={activeTab}  onSelect={k=>changeTab(k)}>
            <Module title="Invoices" eventKey="invoices">
                <FindAllInvoices title="Invoices" />
            </Module>
            <Module title="Transactions" eventKey="transactions">
                <FindAllTransactionsList title="Transactions" />
            </Module>
            <Module title="Memberships" eventKey="memberships">
            <PaymentPlanList type={3} />
            </Module>
            <Module title="Payment Plans" eventKey="paymentplans">
                <PaymentPlanList type={1} />
            </Module>
        </SideTabs>
    )
}

export default PaymentDashboard