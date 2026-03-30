import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import NewsTicker from '@/components/NewsTicker'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Committee from '@/components/Committee'
import Events from '@/components/Events'
import Gallery from '@/components/Gallery'
import News from '@/components/News'
import BecomeMember from '@/components/BecomeMember'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <NewsTicker />
      <About />
      <BecomeMember />
      <Projects />
      <Committee />
      <Events />
      <Gallery />
      <News />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  )
}
