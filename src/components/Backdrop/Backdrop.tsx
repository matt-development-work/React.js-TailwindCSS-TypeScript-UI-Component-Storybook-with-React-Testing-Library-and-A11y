import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import FocusLock from 'react-focus-lock';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose?: () => void;
  open: boolean;
  transitionDuration?: 0 | 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000;
  /* If true, the component is non-interactable with mouse/keyboard input. */
  displayOnly?: boolean;
}

export const Backdrop = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      open,
      onClose,
      transitionDuration = 0,
      displayOnly = false,
      ...props
    },
    ref
  ) => {
    /* TODO: Add opacity as a prop. */
    const openedStateOpacity: number = 80;

    const [opacity, setOpacity] = useState<number>(0);

    const [backdropIsRenderable, setBackdropIsRenderable] = useState<boolean>();

    const [initialRender, setInitialRender] = useState<boolean>(true);

    //Auto-handle transition on close
    useEffect(() => {
      if (!initialRender) {
        if (open) {
          setBackdropIsRenderable(open);
        } else {
          setTimeout((): void => {
            setBackdropIsRenderable(open);
          }, transitionDuration);
        }
      } else {
        setInitialRender(false);
      }
    }, [open]);

    useEffect(() => {
      backdropIsRenderable &&
        (transitionDuration > 0
          ? setTimeout((): void => {
              setOpacity(openedStateOpacity);
            }, 0)
          : setOpacity(openedStateOpacity));
    }, [backdropIsRenderable]);

    useEffect(() => {
      !displayOnly &&
        document.addEventListener('keydown', (e) => {
          e.key === 'Escape' && handleClose();
        });
    }, [displayOnly]);

    useEffect(() => {
      !open && handleClose();
    }, [open]);

    const handleClose = useCallback((): void => {
      setOpacity(0);
      setTimeout((): void => {
        onClose && onClose();
      }, transitionDuration);
    }, [transitionDuration]);

    return backdropIsRenderable
      ? createPortal(
          <FocusLock autoFocus={true}>
            <div
              className={`flex justify-center items-center fixed inset-0 bg-gray-800 transition-opacity ease-in-out duration-${transitionDuration} opacity-${opacity}`}
              data-testid="backdrop"
              onClick={!displayOnly ? handleClose : undefined}
              ref={ref}
              {...props}
            >
              {children}
            </div>
          </FocusLock>,
          document.body
        )
      : null;
  }
);
