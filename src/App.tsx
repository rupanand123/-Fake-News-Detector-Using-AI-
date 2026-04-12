/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HeroCanvas } from './components/HeroCanvas';
import { NewsAnalyzer } from './components/NewsAnalyzer';
import { Dashboard } from './components/Dashboard';
import { FeatureSection, Navbar, Footer } from './components/Layout';
import { motion, useScroll, useSpring } from 'motion/react';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <AuthProvider>
      <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-blue/30">
        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-accent-blue z-[100] origin-left"
          style={{ scaleX }}
        />

        <Navbar />
        
        <main>
          <HeroCanvas />
          
          <div className="relative z-10 bg-bg-primary">
            <NewsAnalyzer />
            <FeatureSection />
            <Dashboard />
          </div>
        </main>

        <Footer />

        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-blue/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-green/5 blur-[120px] rounded-full" />
        </div>
      </div>
    </AuthProvider>
  );
}
