'use client';

import React, { ReactNode } from 'react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

export default function ServiceCard({ icon, title, desc }: ServiceCardProps) {
  return (
    <div
      className="bg-white rounded-2xl border border-border/50 h-full group hover:border-accent/30 transition-all duration-300 hover-lift overflow-hidden"
      style={{
        padding: '2rem 1.75rem',
        margin: '0.5rem 0',
      }}
    >
      <div className="flex items-start gap-5">
        <div
          className="shrink-0 flex items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-primary transition-all"
          style={{
            width: '3.5rem',
            height: '3.5rem',
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <h3
            className="font-bold text-primary"
            style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}
          >
            {title}
          </h3>
          <p
            className="text-muted leading-relaxed"
            style={{ fontSize: '0.875rem' }}
          >
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
