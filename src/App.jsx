import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import GithubGame from './components/GithubGame';
import Footer from './components/Footer';
import { PortfolioLoadingScreen } from './components/SkeletonLoader';
import usePortfolioLoading from './hooks/usePortfolioLoading';

export default function App() {
  const loading = usePortfolioLoading();
  useEffect(() => {
    if (!loading && window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    }
  }, [loading]);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navbar />
    <main id="main" className="container" tabIndex={-1} aria-busy={loading || undefined} aria-label={loading ? 'Loading portfolio' : undefined}>
      {loading ? <PortfolioLoadingScreen /> : <div className="portfolio-content">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <GithubGame />
      </div>}
    </main>
    {!loading && <Footer />}
  </>;
}
