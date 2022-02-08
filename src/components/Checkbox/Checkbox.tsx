import React, { forwardRef, HTMLAttributes } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type Icon = {
  checked: IconProp;
  unChecked: IconProp;
  className: string | undefined;
};

export interface Props extends HTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  icon?: Icon;
  indeterminate?: boolean;
  label?: string;
  onChange: () => void;
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(
  (
    {
      checked = false,
      disabled = false,
      error = false,
      icon = { checked: faCheck, unChecked: undefined },
      id,
      indeterminate = false,
      label,
      onChange,
      title,
      ...props
    },
    ref
  ) => {
    id = id ?? label;

    const color: string = error ? 'red' : 'green';

    const hasValue: boolean = checked || indeterminate;

    const handleChange = (): void => {
      !disabled && onChange();
    };

    const handleKeyDown = (code: string): void => {
      if (!disabled && ['Space', 'Enter'].includes(code)) {
        handleChange();
      }
    };

    return (
      <span className="flex">
        <span
          className={`absolute flex justify-center items-center h-4 w-4 m-1 rounded focus:outline-none focus-visible transition duration-100 ease-in-out filter${
            !icon.unChecked ? ' border border-gray-500 hover:shadow-sm' : ''
          }${
            !disabled
              ? ` ${
                  !icon.unChecked && `border-${color}-500`
                } cursor-pointer hover:brightness-110`
              : ' cursor-default'
          }${hasValue ? ` ${!icon.unChecked ? `bg-${color}-500` : ''}` : ''}`}
          data-testid="checkbox-alias"
          onClick={handleChange}
          onKeyDown={(e) => handleKeyDown(e.code)}
          tabIndex={0}
        >
          {icon.unChecked && !hasValue && (
            <FontAwesomeIcon
              className={`absolute ${icon.className ?? 'text-green-500'}`}
              icon={icon.unChecked}
              size="sm"
            />
          )}
          {hasValue && (
            <FontAwesomeIcon
              className={`absolute ${icon.className ?? 'text-white'}`}
              icon={(indeterminate ? faMinus : icon.checked) as IconProp}
              size={icon.unChecked ? 'sm' : 'xs'}
            />
          )}
        </span>
        <input
          checked={checked}
          className="hidden"
          data-testid="checkbox"
          disabled={disabled}
          id={id}
          onChange={handleChange}
          ref={ref}
          tabIndex={-1}
          type="checkbox"
          {...props}
        />
        <label className="ml-6 select-none" htmlFor={id}>
          {label}
        </label>
      </span>
    );
  }
);
