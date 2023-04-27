import AdminDashboard from "../../components/secure/admin/dashboard/AdminDashboard";
import PracticeManagement from "../../components/secure/admin/dashboard/practice-management/PracticeManagement";

const AdminRoutes = [
    { index: true, path: '', element: <AdminDashboard/> },
    { path: 'practice-management', element: <PracticeManagement/> },
    // { path: 'equipmenttype', element: <FindEquipmentType/> },
];

export default AdminRoutes