import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  action?: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  padding = 'md',
  hover = false,
  ...props 
}) => {
  const baseClasses = cn(
    'bg-white rounded-lg border transition-all duration-200',
    'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
    hover && 'hover:shadow-md hover:-translate-y-1',
    className
  );

  const variantClasses = {
    default: 'border-gray-200 shadow-sm',
    outlined: 'border-gray-300 shadow-none',
    elevated: 'border-transparent shadow-lg',
    flat: 'border-gray-100 shadow-none bg-gray-50',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding]
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  action,
  className,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-gray-100 pb-3 mb-3',
        className
      )}
      {...props}
    >
      <div className="flex-1">
        {children}
      </div>
      {action && (
        <div className="flex-shrink-0 ml-3">
          {action}
        </div>
      )}
    </div>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className,
  ...props 
}) => {
  return (
    <div
      className={cn('flex-1', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  align = 'left',
  className,
  ...props 
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      className={cn(
        'flex items-center border-t border-gray-100 pt-3 mt-3',
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
