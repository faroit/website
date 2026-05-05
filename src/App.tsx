import Nav from "@/sections/Nav"
import Hero from "@/sections/Hero"
import Features from "@/sections/Features"
import About from "@/sections/About"
import Press from "@/sections/Press"
import Service from "@/sections/Service"
import Software from "@/sections/Software"
import Datasets from "@/sections/Datasets"
import Publications from "@/sections/Publications"
import Footer from "@/sections/Footer"

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Features />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-20">
        <About />
        <Press />
        <Service />
        <Software />
        <Datasets />
        <Publications />
      </main>
      <Footer />
    </div>
  )
}
