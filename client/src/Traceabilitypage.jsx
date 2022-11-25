import { NavbarConsumer, Footer, Traceability, Services, Home } from "./components"

const Traceabilitypage = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <NavbarConsumer />
        <Traceability />
      </div>
      <Footer />
    </div>
  )
}

export default Traceabilitypage
