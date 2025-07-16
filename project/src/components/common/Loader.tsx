import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-4 border-amber-200 border-t-amber-600 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-4 text-slate-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );
};

export default Loader;