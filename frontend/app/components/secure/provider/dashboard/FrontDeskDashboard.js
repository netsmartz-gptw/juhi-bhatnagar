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

const FrontDeskDashboard = (props) => {
    return (
        <div>
            <Dashboard
                Modules
                split={[6, 6]}
                title="Front Desk Dashboard"
            >
                <div title="Patient Status View" side="left"></div>
                <div title="Patient Summary" side="left"></div>
                <div title="Open Balance List" side="left"></div>
                <div title="Upcoming Appointments List">
                    <TodaysAppointments />
                </div>
                <div title="Scheduling View"></div>
                <div title="Work Ticket Report">
                    <EmployeeWorkTicket />
                </div>
            </Dashboard>
        </div>
    )
}

export default FrontDeskDashboard;
