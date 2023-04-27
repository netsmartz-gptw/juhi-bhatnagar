import React, { useState, useEffect } from "react";


// Templates
import Dashboard from "../../../templates/layouts/Dashboard";
import TransactionReportTable from "../report/transactions-report-table/TransactionReportTable";


const ProviderAdminDashboard = (props) => {
    return (
        <div>
            <Dashboard
                Modules
                split={[6, 6]}
                title="Admin Dashboard"
            >
                <div title="Sales View" side="left"></div>
                <div title="Utilization View" side="left"></div>
                <div title="Patient Type/Membership View" side="left"></div>
                <div title="Transaction Search">
                    <TransactionReportTable/>
                </div>
                <div title="Inventory Report"></div>
                <div title="Patient Status View"></div>
            </Dashboard>
        </div>
    )
}

export default ProviderAdminDashboard;
