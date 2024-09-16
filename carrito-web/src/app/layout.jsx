
import { Toaster } from "../components"
import { Footer } from "../tienda/pages/Footer"

export default function RootLayout({ children }) {
  return (
    <section className="h-[100%]">
        {children}
        <Toaster />
      <Footer/>
    </section>
  )
}
