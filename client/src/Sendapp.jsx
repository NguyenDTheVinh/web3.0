import { Navbar, Footer, Welcome, Services, Transactions } from "./components"

const Sendapp = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Footer />
    </div>
  )
}

export default Sendapp
