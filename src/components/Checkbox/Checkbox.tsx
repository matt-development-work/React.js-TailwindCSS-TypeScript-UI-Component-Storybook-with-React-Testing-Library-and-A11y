import React, {
  forwardRef,
  Fragment,
  HTMLAttributes,
  useCallback,
  useMemo,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface icon {
  checked: IconProp;
  unChecked: IconProp;
  className: string | undefined;
}

export interface Props extends HTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  icon?: icon;
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
      error = false,
      icon = { checked: faCheck, unChecked: undefined },
      id,
      indeterminate = false,
      label = '',
      onChange,
      title,
      ...props
    },
    ref
  ) => {
    const color: string = useMemo(() => (error ? 'red' : 'green'), [error]);

    const handleChange = useCallback((): void => {
      !disabled && onChange();
    }, [disabled]);

    const handleKeyDown = useCallback(
      (code: string): void => {
        if (!disabled && ['Space', 'Enter'].includes(code)) {
          handleChange();
        }
      },
      [disabled]
    );

    const hasValue = useMemo<boolean>(
      () => checked || indeterminate,
      [checked, indeterminate]
    );

    return (
      <Fragment>
        <span
          className={`absolute flex justify-center items-center h-4 w-4 m-1 rounded focus:outline-none focus-visible transition duration-100 ease-in-out filter ${
            !icon.unChecked && 'border border-gray-500 hover:shadow-sm text'
          } ${
            !disabled
              ? `${
                  !icon.unChecked && `border-${color}-500`
                } cursor-pointer hover:brightness-110`
              : 'cursor-default'
          } ${hasValue && `${!icon.unChecked && `bg-${color}-500`}`} `}
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
              icon={indeterminate ? faMinus : icon.checked}
              size="sm"
            />
          )}
        </span>
        <input
          aria-label={id}
          checked={checked}
          className="hidden"
          disabled={disabled}
          id={id}
          onChange={handleChange}
          ref={ref}
          tabIndex={-1}
          title={title}
          type="checkbox"
          {...props}
        />
        <div className="ml-6">
          <label className="select-none" htmlFor={id}>
            {label}
          </label>
        </div>
      </Fragment>
    );
  }
);
