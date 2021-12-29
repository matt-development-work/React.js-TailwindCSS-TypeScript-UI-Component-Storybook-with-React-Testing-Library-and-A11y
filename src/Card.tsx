import React, { forwardRef, HTMLAttributes, ReactNode, useMemo } from 'react';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className: string;
  elevation?: string;
  hoverElevation?: string;
  square?: boolean;
}

export const Card = forwardRef<HTMLDivElement, Props>(
  (
    { children, className, elevation = 'md', hoverElevation, square, ...props },
    ref
  ) => {
    const rounded: string | undefined = useMemo(
      () => (!square ? 'rounded' : undefined),
      [square]
    );

    return (
      <div
        className={`${className} absolute transition-shadow ease-in-out duration-500 p-2 shadow-${elevation} hover:shadow-${hoverElevation} ${
          hoverElevation && 'cursor-pointer'
        } ${rounded}`}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
