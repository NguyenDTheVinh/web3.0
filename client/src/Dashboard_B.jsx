import { Navbar, Footer, MonitorB } from "./components"
import { getDatabase, ref, child, get } from "firebase/database";


const DashboardB = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-custom">
        <Navbar/>
        <div className="flex justify-center items-center">
        <MonitorB/>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default DashboardB;
