import React, {useState, useEffect} from 'react'
import Dashboard from '../../../../templates/layouts/Dashboard'
import FindAllTransactionsList from '../find-all-transactions/FindAllTransactionsList'

const FindAllTransactionsDashboard = (props)=>{
    return(
        <Dashboard Modules stacked>
            <FindAllTransactionsList side="right"/>
        </Dashboard>
    )
}


export default FindAllTransactionsDashboard