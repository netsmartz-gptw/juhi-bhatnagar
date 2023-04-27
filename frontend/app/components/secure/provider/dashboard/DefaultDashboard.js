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

const DefaultDashboard = (props) => {
    return (
        <div>
            <Dashboard
                Modules
                split={[6, 6]}
            >
                <TodaysAppointments side="right" title={label.appointment.list.upcoming} icon="calendar outline" />
                <AddPatient side="left" title={label.patient.add.heading} icon="plus" />
                <AddAppointmentForm id="add-appointment" side="left" title={label.appointment.add.heading} icon="calendar plus outline" />
                {/* <AddInvoice title="Collect Payment" icon="cart" side="left" hideCancel/> */}
            </Dashboard>
        </div>
    )
}

export default DefaultDashboard;
