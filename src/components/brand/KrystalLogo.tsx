import * as React from 'react';

export function KrystalLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Upper Navy Wing */}
      <path
        d="M20 54C20 42 27 33 39 33H78L60 54H20Z"
        fill="#0B2545"
      />
      {/* Middle Navy Wing */}
      <path
        d="M25 67C25 57 32 48 43 48H85L68 67H25Z"
        fill="#071A34"
      />
      {/* Lower Darker Rich Green Chevrons */}
      <path
        d="M44 67L35 83H56L72 67H44Z"
        fill="#5FAD00"
      />
      <path
        d="M62 67L53 83H74L90 67H62Z"
        fill="#4D9600"
      />
    </svg>
  );
}
