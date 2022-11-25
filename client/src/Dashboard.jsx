import { Navbar, Footer, Monitor } from "./components"
import { getDatabase, ref, child, get } from "firebase/database";


const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-custom">
        <Navbar/>
        <div className="flex justify-center items-center">
        <Monitor/>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard;
