'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
}

export function AnimatedSection({ children, className = '', delay = 0, direction = 'up' }: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  /* Avoid filter:blur on animated nodes — it overflows layout and breaks alignment in sections */
  const variants = {
    up: { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -28 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 28 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated counter for stats
interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function Counter({ value, suffix = '', duration = 2 }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CounterNumber value={value} duration={duration} />
          {suffix}
        </motion.span>
      ) : (
        '0'
      )}
    </motion.span>
  );
}

function CounterNumber({ value, duration }: { value: number; duration: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration }}
    >
      {/* Using framer motion's useMotionValue internally: display as integer */}
      <CounterDisplay target={value} duration={duration} />
    </motion.span>
  );
}

function CounterDisplay({ target, duration }: { target: number; duration: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  // Simple counter with requestAnimationFrame
  const startTime = useRef<number | null>(null);

  if (typeof window !== 'undefined' && isInView && ref.current) {
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      if (ref.current) {
        ref.current.textContent = String(Math.floor(eased * target));
      }
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  return <span ref={ref}>0</span>;
}
