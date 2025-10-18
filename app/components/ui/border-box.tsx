import React from 'react';

type Props = {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  borderColor?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hoverShadow?: boolean;
};

export function BorderBox({
  className = '',
  children,
  style,
  rounded = 'md',
  shadow = 'sm',
  borderColor = 'border-gray-300',
  padding = 'md',
  hoverShadow = false,
}: Props) {
  const roundedClassMap: Record<typeof rounded, string> = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const shadowClassMap: Record<typeof shadow, string> = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const paddingClassMap: Record<typeof padding, string> = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const hoverClass = hoverShadow ? 'hover:shadow-lg transition-shadow duration-300' : '';

  return (
    <div
      className={`border ${borderColor} ${roundedClassMap[rounded]} ${shadowClassMap[shadow]} ${paddingClassMap[padding]} box-border overflow-hidden break-words ${hoverClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
