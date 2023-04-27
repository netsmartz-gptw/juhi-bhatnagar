import React, { useState, useEffect } from "react";


// Templates
import Dashboard from "../../../templates/layouts/Dashboard";

// Components
import AddPatient from "../patient/add-patient/AddPatient";
import AppointmentForm from "../appointment/appointment-form/AppointmentForm";
import TodaysAppointments from "../appointment/todays-appointments/TodaysAppointments";

// Constants
import label from "../../../../../assets/i18n/en.json";
import Toaster from "../../../templates/components/Toaster";
import AddAppointmentForm from "../appointment/add-appointment-form/AddAppointmentForm";
import AddInvoice from "../invoices/add-invoice/AddInvoice";
import EmployeeWorkTicket from "../report/employee-work-ticket/EmployeeWorkTicket";
import CommonService from "../../../../services/api/common.service";

const ProviderDashboard = (props) => {
const loggedInUserData = CommonService.getLoggedInData()
const providerId = loggedInUserData?.providerId
    return (
        <div>
            <Dashboard
                Modules
                split={[6, 6]}
                title="Provider Dashboard"
            >
                <div title="Upcomming Appointment List" side="left">
                    <TodaysAppointments providerPage providerId={providerId}/>
                </div>
                <div title="Work Ticket Report" side="left">
                    <EmployeeWorkTicket/>
                </div>
                <div title="Patient Summary"></div>
                <div title="Procedure Start with Prior Notes"></div>
            </Dashboard>
        </div>
    )
}

export default ProviderDashboard;
