import React, { forwardRef, HTMLAttributes, ReactNode, useMemo } from 'react';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  elevation?: string;
  hoverElevation?: string;
  square?: boolean;
}

export const Card = forwardRef<HTMLDivElement, Props>(
  (
    { children, className, elevation = 'md', hoverElevation, square, ...props },
    ref
  ) => {
    const rounded = useMemo<string>(
      () => (!square ? ' rounded' : ''),
      [square]
    );
    const hoverEffects = useMemo<string>(
      () =>
        hoverElevation ? ` hover:shadow-${hoverElevation} cursor-pointer` : '',
      [hoverElevation]
    );
    className = useMemo<string>(
      () => (className ? ` ${className}` : ''),
      [className]
    );
    return (
      <div
        className={`transition-shadow ease-in-out duration-500 p-2 shadow-${elevation}${hoverEffects}${rounded}${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
