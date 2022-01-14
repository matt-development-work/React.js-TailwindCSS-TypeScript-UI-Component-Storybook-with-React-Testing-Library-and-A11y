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
    const rounded: string = useMemo(
      () => (!square ? ' rounded' : ''),
      [square]
    );
    const hoverEffects: string = useMemo(
      () =>
        hoverElevation ? ` hover:shadow-${hoverElevation} cursor-pointer` : '',
      [hoverElevation]
    );
    return (
      <div
        className={`absolute transition-shadow ease-in-out duration-500 p-2 shadow-${elevation}${hoverEffects}${rounded}`}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
