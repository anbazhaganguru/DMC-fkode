import React from 'react';
import Navbar from './components/layout/Navbar';
import CinematicJourney from './components/cinematic/CinematicJourney';
import Home from './sections/Home/Home';
import About from './sections/About/About';
import Therapy from './sections/Therapy/Therapy';
import RecoveryFor from './sections/RecoveryFor/RecoveryFor';
import CTA from './sections/CTA/CTA';
import Footer from './sections/Footer/Footer';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <CinematicJourney>
          <Home id="home" />
          <About id="about" />
          <Therapy id="therapy" />
          <RecoveryFor id="recovery-for" />
        </CinematicJourney>
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
