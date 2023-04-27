// import secure routes 
import ProviderRoutes from "./ProviderRoutes"
import PatientRoutes from "./PatientRoutes"
import FormsRoutes from "./FormsRoutes"
import FacilityRoutes from "./FacilityRoutes"
import AdminRoutes from "./AdminRoutes"

const SecureRoutes = [
  {path: 'admin', children: AdminRoutes},
  {path: 'provider', children: ProviderRoutes},
  {path: 'patient', children: PatientRoutes},
]

export default SecureRoutes
