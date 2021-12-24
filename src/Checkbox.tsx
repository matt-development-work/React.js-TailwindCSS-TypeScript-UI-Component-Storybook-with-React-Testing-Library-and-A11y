import React, { forwardRef, Fragment, HTMLAttributes, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
export interface Props extends HTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  disabled?: boolean;
  id: string;
  indeterminate?: boolean;
  label?: string;
  onChange: () => void;
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(
  (
    {
      checked = false,
      disabled = false,
      id,
      indeterminate = false,
      label = '',
      onChange,
      title,
      ...props
    },
    ref
  ) => {
    const hasValue: boolean = useMemo(
      () => checked || indeterminate,
      [checked, indeterminate]
    );

    return (
      <Fragment>
        <span
          className={`absolute flex justify-center items-center h-4 w-4 m-1 rounded border border-green-500 ${
            !disabled && 'cursor-pointer'
          } ${hasValue && 'bg-green-500'} focus:outline-none focus-visible`}
          onClick={() => !disabled && onChange()}
          tabIndex={0}
        >
          {hasValue && (
            <FontAwesomeIcon
              className="absolute text-white"
              size="sm"
              icon={indeterminate ? faMinus : faCheck}
            />
          )}
        </span>
        <input
          aria-label={id}
          checked={checked}
          className="hidden"
          disabled={disabled}
          id={id}
          ref={ref}
          tabIndex={-1}
          title={title}
          type="checkbox"
          {...props}
        />
        <label className="ml-6" htmlFor={id}>
          {label}
        </label>
      </Fragment>
    );
  }
);
