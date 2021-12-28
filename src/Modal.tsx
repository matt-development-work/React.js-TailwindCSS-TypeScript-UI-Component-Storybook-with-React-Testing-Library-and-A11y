import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { Backdrop } from '../src/Backdrop';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  transitionDuration: 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000;
}

export const Modal = forwardRef<HTMLDivElement, Props>(
  ({ children, onClose, open, transitionDuration, ...props }, ref) => {
    return (
      <Backdrop
        onClose={onClose}
        open={open}
        transitionDuration={transitionDuration}
      >
        <div
          className={'relative w-auto h-auto overflow-hidden bg-white'}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          ref={ref}
        >
          {children}
        </div>
      </Backdrop>
    );
  }
);
