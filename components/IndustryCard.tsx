'use client';

import React from 'react';

interface IndustryCardProps {
  emoji: string;
  name: string;
  desc: string;
  equipment: string[];
}

export default function IndustryCard({ emoji, name, desc, equipment }: IndustryCardProps) {
  return (
    <div
      className="bg-white rounded-2xl border border-border/50 h-full group hover:border-accent/30 transition-all duration-300 hover-lift overflow-hidden"
      style={{
        padding: '2rem 1.75rem',
        margin: '0.5rem 0',
      }}
    >
      {/* Header: Emoji + Title + Description */}
      <div className="flex items-start gap-5" style={{ marginBottom: '1.25rem' }}>
        <span
          className="shrink-0 flex items-center justify-center rounded-xl bg-surface"
          style={{
            fontSize: '2rem',
            width: '3.5rem',
            height: '3.5rem',
          }}
        >
          {emoji}
        </span>
        <div style={{ flex: 1 }}>
          <h3
            className="font-bold text-primary"
            style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}
          >
            {name}
          </h3>
          <p
            className="text-muted leading-relaxed"
            style={{ fontSize: '0.875rem' }}
          >
            {desc}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        className="border-t border-border/40"
        style={{ margin: '1rem 0 1.25rem 0' }}
      />

      {/* Equipment Tags */}
      <div
        className="flex flex-wrap gap-2"
        style={{
          padding: '0.5rem 0.75rem',
          margin: '0 0.25rem',
          background: 'rgba(248, 250, 252, 0.8)',
          borderRadius: '0.75rem',
        }}
      >
        {equipment.map((eq, j) => (
          <span
            key={j}
            className="text-xs font-semibold text-accent"
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              border: '1px solid rgba(245, 158, 11, 0.15)',
              transition: 'all 0.2s ease',
            }}
          >
            {eq}
          </span>
        ))}
      </div>
    </div>
  );
}
