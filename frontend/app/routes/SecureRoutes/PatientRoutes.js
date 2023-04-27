import PatientDashboard from "../../components/secure/patient/dashboard/PatientDashboard";

const PatientRoutes = [
    { index: true, path: '', element: <PatientDashboard /> },
    { path: 'appointments', element: <h1>Appointments</h1> },
    { path: 'financial', element: <h1>Financial Profile</h1> },
    { path: 'settings', element: <h1>Settings</h1> },
    { path: 'notification', element: <h1>Notifications</h1> },

];

export default PatientRoutes