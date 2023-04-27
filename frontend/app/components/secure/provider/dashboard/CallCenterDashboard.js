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

const CallCenterDashboard = (props) => {
    return (
        <div>
            <Dashboard
                Modules
                split={[6, 6]}
                title="Call Center Dashboard"
            >
                <div title="Open Balance List" side="left"></div>
                <div title="Collect Payment" side="left"></div>
                <div title="Alert List"></div>
                <div title="Notifications Search"></div>
            </Dashboard>
        </div>
    )
}

export default CallCenterDashboard;
