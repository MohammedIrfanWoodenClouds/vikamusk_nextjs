'use client'

import { motion } from 'framer-motion'
import { NumberCounter } from './number-counter'

interface Stat {
  value: string | number
  label: string
  icon?: React.ReactNode
  isCounter?: boolean
}

interface StatsSectionProps {
  stats: Stat[]
  title?: string
  description?: string
}

export function StatsSection({ stats, title, description }: StatsSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200"
            >
              {stat.icon && (
                <div className="text-accent text-4xl mb-4">{stat.icon}</div>
              )}
              <div className="text-4xl font-bold text-accent mb-2">
                {stat.isCounter && typeof stat.value === 'number' ? (
                  <NumberCounter
                    to={stat.value}
                    suffix={typeof stat.value === 'string' ? stat.value.replace(/\d+/g, '') : ''}
                  />
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-primary font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
