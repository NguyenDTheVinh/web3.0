import { Navbar, Welcome } from "./components";
import Dashboard from "./Dashboard";
import DashboardB from "./Dashboard_B";
import Sendapp from "./Sendapp";
import Retrieve from "./Retrieve";
import Traceability from "./components/Traceability";
import { Route, Routes } from "react-router-dom";
import Homepage from "./Homepage";
import Traceabilitypage from "./Traceabilitypage"

const App = () => {


  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/owner/upload" element={<Sendapp />} />
        <Route path="/owner/dashboard/area/a" element={<Dashboard />} />
        <Route path="/owner/dashboard/area/b" element={<DashboardB />} />
        <Route path="/owner/retrieve" element={<Retrieve />} />
        <Route path="/traceability/product/ButterheadLettuce" element={<Traceabilitypage />} />
      </Routes>
    </div>
  )
}

export default App
