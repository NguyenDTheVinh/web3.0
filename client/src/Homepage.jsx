import { NavbarConsumer, Footer, Welcome, Services, Home } from "./components"

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <NavbarConsumer />
        <Home />
      </div>
      <Footer />
    </div>
  )
}

export default Homepage
