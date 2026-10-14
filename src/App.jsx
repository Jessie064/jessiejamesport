import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import GithubGame from './components/GithubGame';
import Footer from './components/Footer';

export default function App() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navbar />
    <main id="main" className="container" tabIndex={-1}>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <GithubGame />
    </main>
    <Footer />
  </>;
}
