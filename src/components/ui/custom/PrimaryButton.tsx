
import { ReactNode, ButtonHTMLAttributes, forwardRef, ElementType } from 'react';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  as?: ElementType;
  to?: string; // for React Router Link
}

const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(({ 
  children, 
  className, 
  variant = 'default', 
  size = 'md', 
  fullWidth = false,
  isLoading = false,
  as: Component = 'button',
  to,
  ...props 
}, ref) => {
  const baseStyles = "rounded-full font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-motta-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  
  const variantStyles = {
    default: "bg-motta-primary text-white hover:bg-motta-primary/90 active:bg-motta-primary/95",
    outline: "border-2 border-motta-primary text-motta-primary hover:bg-motta-primary/10 active:bg-motta-primary/20",
    ghost: "bg-transparent text-motta-primary hover:bg-motta-primary/10 active:bg-motta-primary/20"
  };
  
  const sizeStyles = {
    sm: "text-sm px-4 py-1.5 h-9",
    md: "text-base px-6 py-2 h-11",
    lg: "text-lg px-8 py-3 h-14"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  // If it's a link component, include the "to" prop
  const componentProps = Component !== 'button' && to ? { to, ...props } : props;

  return (
    <Component
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        widthClass,
        className
      )}
      disabled={isLoading || props.disabled}
      ref={ref}
      {...componentProps}
    >
      {isLoading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Carregando...
        </>
      ) : (
        children
      )}
    </Component>
  );
});

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
