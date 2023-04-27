import { Navigate } from "react-router-dom";

// import modules
import ProviderDashboard from "../../components/secure/provider/dashboard/ProviderDashboard";

// Patient Pages 
import AddPatient from "../../components/secure/provider/patient/add-patient/AddPatient";
import EditPatient from "../../components/secure/provider/patient/edit-patient/EditPatient";
import ProviderPatientDashboard from "../../components/secure/provider/patient/patient-dashboard/ProviderPatientDashboard";

// Scheduling


// Payments


// Insurance


// Notifications


// Inventory
// Equipment Pages
import AddEquipment from '../../components/secure/provider/equipment/add-equipment/AddEquipment'
import EditEquipment from '../../components/secure/provider/equipment/edit-equipment/EditEquipment'
import EquipmentDashboard from "../../components/secure/provider/equipment/EquipmentDashboard";

// Reports 


// Settings
// Doctor Pages
import Notifications from "../../components/secure/provider/notifications/notifications";
import Module from "../../components/templates/components/Module";
import AddAppointmentForm from "../../components/secure/provider/appointment/add-appointment-form/AddAppointmentForm";
import EditAppointmentForm from "../../components/secure/provider/appointment/edit-appointment-form/EditAppointmentForm";
import NoteDashboard from "../../components/secure/provider/note/note-dashboard/NoteDashboard";
import AppointmentSchedule from "../../components/secure/provider/appointment/appointment-schedule/appointment-schedule/AppointmentSchedule";
import ProviderReportDashboard from "../../components/secure/provider/report/ProviderReportDashboard";
import PaymentDashboard from "../../components/secure/provider/payments/PaymentDashboard";
import Context from "../../components/Context";
import SettingsDashboard from "../../components/secure/provider/settings-dashboard/SettingsDashboard";
import VirtualTerminalForm from "../../components/secure/provider/transactions/terminals/virtual-terminal/virtual-terminal-form/VirtualTerminalForm";
import UnavailableBlockForm from "../../components/secure/provider/unavailable-block/unavailable-block-form/UnavailableBlockForm";
import FormFormBuilder from "../../components/secure/provider/forms/form-form-builder/FormFormBuilder";
import MainDashboard from "../../components/secure/provider/dashboard/MainDashboard";
// Support 


const ProviderRoutes = [

    { index: true, path: '', element: <MainDashboard /> },
    { path: 'formbuilder', element: <FormFormBuilder /> },
    // Patient Management
    { path: 'patient', element: <ProviderPatientDashboard />},
    { path: 'patient/add', element: <AddPatient /> },
    { path: 'patient/edit', element: <EditPatient /> },
    // { path: 'patient/find', element: <FindPatientSearch /> },
    { path: 'patient/notes', element: <NoteDashboard /> },
    { path: 'unavailableBlock', element: <UnavailableBlockForm /> },
    // Forms Management
    // { path: 'note', element: <FindNote/>},

    // Scheduling
    { path: 'schedule', element: <AppointmentSchedule resource="provider" /> },
    { path: 'schedule/availability', element: <AppointmentSchedule resource="availability" /> },
    { path: 'schedule/equipment', element: <AppointmentSchedule resource="equipment" /> },
    { path: 'schedule/room', element: <AppointmentSchedule resource="room" /> },
    { path: 'schedule/addappointment', element: <Module title="Add Appointment"><AddAppointmentForm /></Module> },
    { path: 'schedule/editappointment', element: <Module title="Edit Appointment"><EditAppointmentForm id="gLbeOlQ6" /></Module> },  // { path: 'availability', element: <FindAvailability/>},

    // Payments
    { path: 'payments', element: <PaymentDashboard tab="invoices" /> },
    { path: 'payments/transactions', element: <PaymentDashboard tab="transactions" /> },
    { path: 'payments/memberships', element: <PaymentDashboard tab="memberships" /> },
    { path: 'payments/paymentplans', element: <PaymentDashboard tab="paymentplans" /> },
    { path: 'payments/virtual-terminal', element: <VirtualTerminalForm /> },
    // { path: 'findtransaction/credit', element: <FindTransaction/>},
    // { path: 'findtransaction/credit/:fromBackClick', element: <FindTransaction/>},
    // { path: 'findtransaction/all', element: <FindTransaction/>},
    // { path: 'findtransaction/all/:fromBackClick', element: <FindTransaction/>},
    // { path: 'findtransaction/debit', element: <FindTransaction/>},
    // { path: 'findtransaction/debit/:fromBackClick', element: <FindTransaction/>},
    // { path: 'findtransaction/ach', element: <FindTransaction/>},
    // { path: 'findtransaction/ach/:fromBackClick', element: <FindTransaction/>},
    // { path: 'findtransaction/onetime', element: <FindOneTimeTransaction/>},
    // { path: 'findtransaction/onetime/:fromBackClick', element: <FindOneTimeTransaction/>},
    // { path: 'findtransaction/cash', element: <FindTransaction/>},
    // { path: 'findtransaction/cash/:fromBackClick', element: <FindTransaction/>},
    // { path: 'findtransaction/check', element: <FindTransaction/>},
    // { path: 'findtransaction/check/:fromBackClick', element: <FindTransaction/>},
    // { path: 'paymentplan', element: <FindPaymentPlan/>},
    // { path: 'patientcheckout', element: <FindInvoice/>},
    // { path: 'patientcheckout/checkout', element: <FindInvoice/>},

    // Insurance
    // { path: 'claims', element: <FindClaims/>},
    // { path: 'insurance', element: <FindInsurance/>},


    // Notifications
    { path: 'notification', element: <Notifications /> },

    // Inventory
    { path: 'inventory/equipment', element: <EquipmentDashboard /> },
    { path: 'inventory/equipment/add', element: <AddEquipment /> },
    { path: 'inventory/equipment/edit', element: <EditEquipment /> },
    // { path: 'products-services', element: <FindProductService/>},
    // { path: 'upload-products-services', element: <ProductsBulkUpload/>},

    // Reports
    { path: 'reports', element: <ProviderReportDashboard tab="payment" /> },
    { path: 'reports/patient', element: <ProviderReportDashboard tab="patient" /> },
    { path: 'reports/provider', element: <ProviderReportDashboard tab="provider" /> },
    { path: 'reports/practice', element: <ProviderReportDashboard tab="practice" /> },
    { path: 'reports/product-inventory', element: <ProviderReportDashboard tab="product-inventory" /> },

    // Settings
    { path: 'settings', element: <SettingsDashboard tab="account" /> },
    { path: 'settings/patients', element: <SettingsDashboard tab="patients" /> },
    { path: 'settings/location', element: <SettingsDashboard tab="location" /> },
    { path: 'settings/provider', element: <SettingsDashboard tab="provider" /> },
    { path: 'settings/practice', element: <SettingsDashboard tab="practice" /> },
    { path: 'settings/users', element: <SettingsDashboard tab="users" /> },
    // Support 
    { path: 'context', element: <Context /> }
];

export default ProviderRoutes
