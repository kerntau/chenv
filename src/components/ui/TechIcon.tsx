import React from 'react';

export interface TechIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
}

export const TechIcon: React.FC<TechIconProps> = ({ name, className = 'w-3.5 h-3.5', ...props }) => {
  const norm = name.trim().toLowerCase();

  // Go
  if (norm === 'go' || norm === 'golang') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="#00ADD8" {...props}>
        <path d="M1.811 11.296c.197-.68.514-1.284.951-1.812a5.577 5.577 0 011.696-1.326C5.176 7.78 5.96 7.594 6.81 7.6c.725.006 1.408.148 2.05.426.64.277 1.19.673 1.65 1.189l-1.63 1.63a3.376 3.376 0 00-2.07-.805c-.528 0-1.008.13-1.44.39-.432.26-.77.625-1.014 1.094-.245.47-.367 1.01-.367 1.62 0 .61.122 1.15.367 1.62.244.47.582.834 1.014 1.094.432.26.912.39 1.44.39.463 0 .888-.088 1.275-.264.387-.176.702-.42.945-.732h-2.22V13.31h4.41v4.793a6.793 6.793 0 01-2.128 1.054 7.674 7.674 0 01-2.282.343c-.85 0-1.634-.186-2.352-.558a5.577 5.577 0 01-1.696-1.326 6.096 6.096 0 01-.951-1.812c-.22-.68-.33-1.42-.33-2.22 0-.8.11-1.54.33-2.22v-.078zm13.439-3.696h2.22v9.58h-2.22v-9.58zm5.55 0h2.22v9.58h-2.22v-9.58z" />
      </svg>
    );
  }

  // Rust
  if (norm === 'rust') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="#DEA584" {...props}>
        <circle cx="12" cy="12" r="9" stroke="#CE412B" strokeWidth="2" fill="none" />
        <path d="M12 4v4m0 8v4m-8-8h4m8 0h4m-2.8-5.7l-2.8 2.8m-5.7 5.7l-2.8 2.8m0-11.3l2.8 2.8m5.7 5.7l2.8 2.8" stroke="#CE412B" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" fill="#CE412B" />
      </svg>
    );
  }

  // Python
  if (norm === 'python') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" {...props}>
        <path d="M11.91 2c-5.04 0-4.73 2.18-4.73 2.18l.01 2.26h4.81v.68H5.21S2 6.75 2 11.83c0 5.07 2.8 4.89 2.8 4.89h1.67v-2.34s-.09-2.8 2.76-2.8h4.74v-.69H9.22s-2.73.06-2.73-2.67c0-2.74 2.39-2.65 2.39-2.65h7.84S19.45 5.57 19.45 2H11.91z" fill="#3776AB" />
        <path d="M12.09 22c5.04 0 4.73-2.18 4.73-2.18l-.01-2.26h-4.81v-.68h6.78s3.21.37 3.21-4.71c0-5.07-2.8-4.89-2.8-4.89h-1.67v2.34s.09 2.8-2.76 2.8h-4.74v.69h4.75s2.73-.06 2.73 2.67c0 2.74-2.39 2.65-2.39 2.65H9.46s-2.73-.01-2.73 3.56H12.09z" fill="#FFD43B" />
        <circle cx="8.5" cy="4.5" r="0.8" fill="#FFF" />
        <circle cx="15.5" cy="19.5" r="0.8" fill="#FFF" />
      </svg>
    );
  }

  // Node.js
  if (norm.includes('node')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="#5FA04E" {...props}>
        <path d="M12 2l9 5.2v10.4L12 22.8 3 17.6V7.2L12 2zm0 2.4L5 8.5v7l7 4.1 7-4.1v-7l-7-4.1z" />
      </svg>
    );
  }

  // React
  if (norm.includes('react')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#61DAFB" strokeWidth="1.5" {...props}>
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.8" fill="#61DAFB" stroke="none" />
      </svg>
    );
  }

  // TypeScript
  if (norm.includes('typescript') || norm === 'ts') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" {...props}>
        <rect width="22" height="22" x="1" y="1" rx="4" fill="#3178C6" />
        <path d="M6 10h6m-3 0v8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 11.5c-.8-.7-1.8-.7-2.5-.3s-.8 1-.5 1.5c.6.9 3 1.1 3 3.2 0 1.5-1.2 2.3-2.8 2.1-1.2-.2-2-.9-2.4-1.6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Rsbuild / Rspack
  if (norm.includes('rsbuild') || norm.includes('rspack')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" {...props}>
        <path d="M12 2L2 19.5h20L12 2z" fill="#F97316" fillOpacity="0.2" stroke="#F97316" strokeWidth="1.8" />
        <path d="M12 7l4 9h-8l4-9z" fill="#F97316" />
      </svg>
    );
  }

  // Tailwind CSS
  if (norm.includes('tailwind')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="#06B6D4" {...props}>
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" />
      </svg>
    );
  }

  // PostgreSQL
  if (norm.includes('postgres')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" {...props}>
        <circle cx="12" cy="12" r="9" fill="#336791" />
        <path d="M7 11c1.5-2.5 5-3 8-1s3 4.5 1 7c-2 2.5-6 2.5-8 .5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <circle cx="9.5" cy="11.5" r="1" fill="#FFFFFF" />
      </svg>
    );
  }

  // ClickHouse
  if (norm.includes('clickhouse')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" {...props}>
        <rect x="2" y="5" width="3" height="14" rx="1" fill="#FFCC00" />
        <rect x="7" y="2" width="3" height="20" rx="1" fill="#FF3333" />
        <rect x="12" y="7" width="3" height="10" rx="1" fill="#FFCC00" />
        <rect x="17" y="4" width="3" height="16" rx="1" fill="#FF3333" />
      </svg>
    );
  }

  // Redis
  if (norm.includes('redis')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" {...props}>
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#DC382D" />
        <path d="M12 2v20M3 7l18 10M3 17l18-10" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.4" />
      </svg>
    );
  }

  // Kafka
  if (norm.includes('kafka')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="#231F20" {...props}>
        <circle cx="12" cy="12" r="3.5" fill="#E535AB" />
        <circle cx="4" cy="12" r="2.5" fill="#3B82F6" />
        <circle cx="20" cy="12" r="2.5" fill="#3B82F6" />
        <path d="M6.5 12h2m7 0h2" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Kubernetes
  if (norm.includes('k8s') || norm.includes('kubernetes')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#326CE5" strokeWidth="1.8" {...props}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill="#326CE5" />
        <path d="M12 3v6m0 6v6M3 12h6m6 0h6" />
      </svg>
    );
  }

  // Docker
  if (norm.includes('docker')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="#2496ED" {...props}>
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.12a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.76 9.89c-.365-1.583-1.63-2.73-3.17-2.887-.22-.023-.442-.016-.66.02a4.92 4.92 0 00-4.068-2.071c-.08 0-.158.006-.236.014V3.574A1.685 1.685 0 0013.94 1.89h-2.12a1.685 1.685 0 00-1.684 1.684v1.032H8.1a1.685 1.685 0 00-1.685 1.684v1.032H5.136A1.685 1.685 0 003.45 9.006v2.073H2.217a1.685 1.685 0 00-1.685 1.684c0 4.887 3.56 8.947 8.353 9.328 5.642.45 10.748-2.65 12.357-7.447.886-.23 1.954-.852 2.518-2.754z" />
      </svg>
    );
  }

  // Linux
  if (norm.includes('linux')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="#FCC624" {...props}>
        <ellipse cx="12" cy="14" rx="7" ry="8" fill="#1E293B" />
        <ellipse cx="12" cy="15" rx="5" ry="6" fill="#F8FAFC" />
        <circle cx="9.5" cy="7" r="1.5" fill="#1E293B" />
        <circle cx="14.5" cy="7" r="1.5" fill="#1E293B" />
        <polygon points="12,8 10,11 14,11" fill="#FCC624" />
      </svg>
    );
  }

  // Nginx
  if (norm.includes('nginx')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" {...props}>
        <path d="M12 2L21 7.2v9.6L12 22L3 16.8V7.2L12 2z" fill="#009639" />
        <path d="M8.5 7v10l7-10v10" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // CI/CD
  if (norm.includes('ci') || norm.includes('cd')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#6366F1" strokeWidth="1.8" {...props}>
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="12" r="3" fill="#6366F1" />
        <path d="M6 9v6M9 6h4a5 5 0 0 1 5 5" />
      </svg>
    );
  }

  // 兜底微型科技芯片
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
    </svg>
  );
};
