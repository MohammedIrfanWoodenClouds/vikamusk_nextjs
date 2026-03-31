'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader } from 'lucide-react'

export function ContactFormClient() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    country: '',
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setStatus('success')
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        country: '',
      })

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof Error ? error.message : 'An error occurred. Please try again.'
      )
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Status Messages */}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
        >
          Thank you for your message! We'll get back to you within 24 hours.
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
        >
          {errorMessage}
        </motion.div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <motion.div variants={inputVariants} initial="hidden" animate="visible">
          <label className="block text-sm font-semibold text-primary mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            placeholder="John Smith"
          />
        </motion.div>

        {/* Email */}
        <motion.div
          variants={inputVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.05 }}
        >
          <label className="block text-sm font-semibold text-primary mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            placeholder="john@example.com"
          />
        </motion.div>

        {/* Phone */}
        <motion.div
          variants={inputVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-semibold text-primary mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            placeholder="+1 (555) 123-4567"
          />
        </motion.div>

        {/* Company */}
        <motion.div
          variants={inputVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
        >
          <label className="block text-sm font-semibold text-primary mb-2">
            Company Name
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            placeholder="Your Company"
          />
        </motion.div>

        {/* Country */}
        <motion.div
          variants={inputVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-semibold text-primary mb-2">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            placeholder="United States"
          />
        </motion.div>
      </div>

      {/* Message */}
      <motion.div
        variants={inputVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.25 }}
      >
        <label className="block text-sm font-semibold text-primary mb-2">
          Message *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 resize-none"
          placeholder="Tell us about your equipment needs..."
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div
        variants={inputVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <motion.button
          type="submit"
          disabled={status === 'loading'}
          whileHover={{ scale: status === 'loading' ? 1 : 1.05 }}
          whileTap={{ scale: status === 'loading' ? 1 : 0.95 }}
          className="w-full px-8 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'loading' && <Loader className="w-4 h-4 animate-spin" />}
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </motion.button>
      </motion.div>

      <p className="text-xs text-muted-foreground text-center">
        We respect your privacy. Your information will be used only to respond to your inquiry.
      </p>
    </motion.form>
  )
}
