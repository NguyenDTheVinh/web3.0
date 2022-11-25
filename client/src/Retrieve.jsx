import { Navbar, Footer, Transactions } from "./components"
import { getDatabase, ref, child, get } from "firebase/database";


const Retrieve = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar className="shadow-boxx" />
        <Transactions/>
      </div>
      <Footer />
    </div>
  )
}

export default Retrieve;
