import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import Backdrop from '../Backdrop';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  transitionDuration?: 0 | 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000;
}

export const Modal = forwardRef<HTMLDivElement, Props>(
  ({ children, onClose, open, transitionDuration = 0, ...props }, ref) => {
    return (
      <Backdrop
        onClose={onClose}
        open={open}
        transitionDuration={transitionDuration}
      >
        <div
          aria-modal
          className={'relative w-auto h-auto overflow-hidden bg-white'}
          data-testid="dialog"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </Backdrop>
    );
  }
);
