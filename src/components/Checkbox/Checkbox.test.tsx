import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './Checkbox.stories';
import { Checkbox } from './Checkbox';

const { Default, Disabled, Error } = composeStories(stories);

test('When checked, the checkbox element has state aria-checked set to true.', () => {
  const component = render(
    <Checkbox
      checked
      label=""
      onChange={() => {
        return;
      }}
    />
  );
  const checkbox = component.getByTestId('checkbox') as HTMLSpanElement;
  expect(checkbox.getAttribute('aria-checked')).toEqual('true');
});

test('When not checked, the checkbox element has state aria-checked set to false.', () => {
  const component = render(
    <Checkbox
      label=""
      onChange={() => {
        return;
      }}
    />
  );
  const checkbox = component.getByTestId('checkbox') as HTMLSpanElement;
  expect(checkbox.getAttribute('aria-checked')).toEqual('false');
});

test('When partially checked, the checkbox element has state aria-checked set to mixed.', () => {
  const component = render(
    <Checkbox
      indeterminate
      label=""
      onChange={() => {
        return;
      }}
    />
  );
  const checkbox = component.getByTestId('checkbox') as HTMLSpanElement;
  expect(checkbox.getAttribute('aria-checked')).toEqual('mixed');
});

test('Checked value changes when component onChange method is invoked', () => {
  const Wrapper = () => {
    const [checked, setChecked] = useState<boolean>(false);
    Default.args = {
      ...Default.args,
      checked: checked,
      onChange: (): void => {
        setChecked(!checked);
      },
    };
    return <Default {...Default.args} />;
  };
  const component = render(<Wrapper />);
  const checkbox = component.getByTestId('checkbox') as HTMLSpanElement;
  const checkboxComponentCheckedState: string = checkbox.ariaChecked as string;
  fireEvent.change(checkbox);
  switch (checkboxComponentCheckedState) {
    case 'true':
      expect(checkbox.ariaChecked).toEqual('false');
      break;
    case 'false':
      expect(checkbox.ariaChecked).toEqual('true');
      break;
  }
});

test('Disabled component checked value does not change', () => {
  const component = render(<Disabled {...Disabled.args} />);
  const checkbox = component.getByTestId('checkbox') as HTMLSpanElement;
  const checkboxComponentCheckedState: string = checkbox.ariaChecked as string;
  fireEvent.change(checkbox);
  switch (checkboxComponentCheckedState) {
    case 'true':
      expect(checkbox.ariaChecked).toEqual('true');
      break;
    case 'false':
      expect(checkbox.ariaChecked).toEqual('false');
      break;
  }
});

test('Disabled component has default cursor', () => {
  const component = render(<Disabled {...Disabled.args} />);
  const checkbox = component.getByTestId('checkbox') as HTMLSpanElement;
  expect(checkbox).toHaveClass('cursor-default');
});

test('Error state component has a red color', () => {
  const component = render(<Error {...Error.args} />);
  const checkbox = component.getByTestId('checkbox') as HTMLSpanElement;
  //NOTE: Class name used for error state may change
  const redColor: string = 'red-500';
  expect(checkbox).toHaveClass(`bg-${redColor} border-${redColor}`);
});
