'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user has already seen the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
      }, 2500); // Show splash for 2.5 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#001f3f]"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-56 h-16 xl:w-64 xl:h-20 mb-10"
          >
            <Image
              src="/images/logo.png"
              alt="Vikamusk"
              fill
              className="object-contain brightness-0 invert"
              priority
              sizes="(max-width: 768px) 224px, 256px"
            />
          </motion.div>
          
          {/* Enhanced Minimalist Loader */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-48 xl:w-64 h-1 bg-white/10 rounded-full overflow-hidden relative"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                duration: 1.5, 
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
