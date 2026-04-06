'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic session check with try-catch
    let hasSeenSplash = false;
    try {
      hasSeenSplash = sessionStorage.getItem('hasSeenSplash') === 'true';
    } catch (e) {
      console.warn('sessionStorage not available', e);
    }

    if (hasSeenSplash) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
        try {
          sessionStorage.setItem('hasSeenSplash', 'true');
        } catch (e) {}
      }, 2000); // reduced to 2s
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#001f3f]"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-72 h-72 md:w-[450px] md:h-[450px] mb-12 flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/logo-custom.png"
                alt="Vikamusk"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 300px, 450px"
              />
            </div>
          </motion.div>
          
          {/* Enhanced Minimalist Loader */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
