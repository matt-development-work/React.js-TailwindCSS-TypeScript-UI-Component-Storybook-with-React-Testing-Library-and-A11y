import React, { forwardRef, HTMLAttributes, ReactNode, useMemo } from 'react';

export interface Props extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick: () => void;
  round?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, onClick, round, variant = 'contained', ...props }, ref) => {
    // TODO: Extract class names to theme
    const color = useMemo<string>(() => 'green', []);
    const classes = useMemo<{
      contained: string;
      outlined: string;
      text: string;
    }>(() => {
      return {
        contained: `bg-${color}-700 hover:brightness-90 shadow-md hover:shadow-xl text-white`,
        outlined: `border border-${color}-500 hover:bg-${color}-100`,
        text: `hover:bg-${color}-100`,
      };
    }, [color]);
    return (
      <button
        className={`${classes[variant]}${
          round ? ' rounded-full h-8 w-8' : ''
        } p-2 transition ease-in-out duration-300 filter cursor-pointer flex justify-center items-center select-none focus:outline-none focus-visible`}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;
