import Login from "../components/public/login/Login"
import { Navigate } from 'react-router-dom'
const AppRoutes = {
    provider: [
        { path: '', element: <Navigate to="/login" /> },
        { path: '**', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: 'login/:providerName', element: <Login /> },
        // {path: '', element: <PublicComponent/>, children: PublicRoutes},
        // {path: '', element: <SecureComponent/>, children: SecureRoutes},

    ],
    patient: [
        { path: '', element: <Navigate to="/login" /> },
        { path: '**', element: <Navigate to="/login" /> },
        { path: 'login/:providerName', element: <Login /> },
        // { path: 'login', element: <PatientLogin/> },
        // {path: '', element: <PatientPublicComponent/>, children: PatientPublicRoutes},
        // {path: '', element: <PatientSecureComponent/>, children: PatientSecureRoutes},

    ]
}



export default AppRoutes