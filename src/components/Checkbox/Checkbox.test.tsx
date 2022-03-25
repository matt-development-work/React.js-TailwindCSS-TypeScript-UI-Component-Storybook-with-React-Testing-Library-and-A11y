import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './Checkbox.stories';

const { Default, Disabled, Error } = composeStories(stories);

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
  //NOTE: Class name used for error state is subject to change
  const redColor: string = 'red-500';
  expect(checkbox).toHaveClass(`bg-${redColor} border-${redColor}`);
});
