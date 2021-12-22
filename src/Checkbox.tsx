import React, { Fragment, HTMLAttributes } from 'react';

export interface Props extends HTMLAttributes<HTMLInputElement> {
  checked: boolean;
  id: string;
  label?: string;
  onChange?: () => void;
}

export const Checkbox = ({
  checked = false,
  id,
  label = '',
  ...props
}: Props) => {
  return (
    <Fragment>
      <input
        aria-label={id}
        checked={checked}
        className="filter -hue-rotate-90"
        id={id}
        title={id}
        type="checkbox"
        {...props}
      />
      <label htmlFor={id}>{` ${label}`}</label>
    </Fragment>
  );
};
