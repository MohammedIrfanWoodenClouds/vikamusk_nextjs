'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavLink {
  label: string
  href: string
  submenu?: NavLink[]
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    href: '/products',
    submenu: [
      { label: 'Forklifts', href: '/products?category=forklifts' },
      { label: 'Excavators', href: '/products?category=excavators' },
      { label: 'Loaders', href: '/products?category=loaders' },
      { label: 'Dumpers', href: '/products?category=dumpers' },
      { label: 'Rollers', href: '/products?category=rollers' },
      { label: 'Telehandlers', href: '/products?category=telehandlers' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold text-primary"
            >
              Vikamusk
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:flex items-center space-x-1"
          >
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <motion.button
                  variants={itemVariants}
                  className="px-3 py-2 text-sm font-medium text-primary hover:text-accent transition-colors duration-200 flex items-center gap-1"
                >
                  {link.label}
                  {link.submenu && (
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  )}
                </motion.button>

                {/* Submenu */}
                {link.submenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  >
                    <div className="py-2">
                      {link.submenu.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-primary hover:bg-slate-100 hover:text-accent transition-colors duration-200"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block"
          >
            <Link
              href="/contact"
              className="px-6 py-2 bg-accent text-primary font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Get a Quote
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-primary hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-4"
            >
              {navLinks.map((link) => (
                <div key={link.label}>
                  <button
                    onClick={() =>
                      setOpenSubmenu(
                        openSubmenu === link.label ? null : link.label
                      )
                    }
                    className="w-full text-left px-3 py-2 text-sm font-medium text-primary hover:text-accent transition-colors flex items-center justify-between"
                  >
                    {link.label}
                    {link.submenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openSubmenu === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {link.submenu && openSubmenu === link.label && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50"
                    >
                      {link.submenu.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="block px-6 py-2 text-sm text-primary hover:text-accent transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4">
                <Link
                  href="/contact"
                  className="block w-full px-6 py-2 bg-accent text-primary font-medium rounded-lg text-center hover:bg-opacity-90 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Get a Quote
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
