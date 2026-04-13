import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Globe, Cpu, Database, Search, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

const FEATURES = [
  {
    title: "AI Verification Engine",
    description: "Powered by Gemini 3.1 Pro, our engine analyzes linguistic patterns, sentiment, and factual consistency to detect misinformation.",
    icon: Cpu,
    image: "https://picsum.photos/seed/ai-engine/800/600"
  },
  {
    title: "Multi-Input Analysis",
    description: "Whether it's a snippet of text, a news URL, or a social media graphic, Truth Lens handles it all with specialized detection models.",
    icon: Database,
    image: "https://picsum.photos/seed/multi-input/800/600"
  },
  {
    title: "Real-Time Fact Checking",
    description: "Our system cross-references claims with millions of verified sources in real-time to provide instant, accurate verdicts.",
    icon: Zap,
    image: "https://picsum.photos/seed/realtime/800/600"
  },
  {
    title: "Trusted Source Mapping",
    description: "We map the origin of news items and assign reliability scores based on historical accuracy and journalistic standards.",
    icon: Globe,
    image: "https://picsum.photos/seed/source-map/800/600"
  }
];

export const FeatureSection: React.FC = () => {
  return (
    <div className="space-y-32 py-24 overflow-hidden">
      {FEATURES.map((feature, index) => (
        <div key={index} className="max-w-7xl mx-auto px-4">
          <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
            <motion.div 
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-6 relative"
            >
              <div className="absolute -left-12 top-0 vertical-rail hidden lg:block">Feature {index + 1}</div>
              <div className="inline-flex p-3 rounded-2xl bg-accent-blue/10 text-accent-blue mb-4">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed max-w-xl">
                {feature.description}
              </p>
              <ul className="space-y-4">
                {['Advanced NLP Analysis', 'Cross-Source Validation', 'Linguistic Pattern Recognition'].map((item, i) => (
                  <li key={i} className="flex items-center text-text-primary">
                    <Shield className="w-4 h-4 mr-3 text-accent-green" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: index % 2 === 0 ? 2 : -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative"
            >
              <div className="absolute -inset-4 bg-accent-blue/20 blur-3xl rounded-full" />
              <div className="relative glass border-border-custom rounded-3xl overflow-hidden aspect-video halftone">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center neon-glow-blue">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-serif font-bold text-white tracking-tight">Truth Lens</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {['Analyze', 'Features', 'Dashboard', 'About'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-sm font-medium text-text-secondary hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-10 w-10 rounded-full overflow-hidden focus:outline-none ring-offset-bg-primary focus-visible:ring-2 focus-visible:ring-accent-blue transition-all">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                  <AvatarFallback className="bg-accent-blue text-white">
                    {user.displayName?.charAt(0) || <UserIcon />}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass border-white/10 text-white" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-text-secondary">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" className="text-text-secondary hover:text-white" onClick={login}>Login</Button>
              <Button className="bg-white text-bg-primary hover:bg-white/90 font-bold" onClick={login}>Get Started</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="py-24 px-6 border-t border-white/5 bg-bg-primary">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1 space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="text-accent-blue w-8 h-8" />
            <span className="text-2xl font-serif font-bold text-white">Truth Lens</span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            Empowering the world to fight misinformation with the power of advanced artificial intelligence.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-text-secondary">
            <li><a href="#" className="hover:text-white transition-colors">Analyzer</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Browser Extension</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Resources</h4>
          <ul className="space-y-4 text-sm text-text-secondary">
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Fact Check Guide</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Newsletter</h4>
          <p className="text-sm text-text-secondary mb-4">Stay updated with the latest in AI fact checking.</p>
          <div className="flex gap-2">
            <Input placeholder="Email" className="bg-white/5 border-white/10 text-white" />
            <Button className="bg-accent-blue hover:bg-blue-600">Join</Button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary">
        <p>© 2026 Truth Lens AI. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};
