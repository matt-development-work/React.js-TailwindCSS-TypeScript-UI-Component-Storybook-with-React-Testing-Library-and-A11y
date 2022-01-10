import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './Checkbox.stories';

const { Default, Disabled, Error } = composeStories(stories);

test('Checked value changes when component is clicked', () => {
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
  const checkbox = component.getByTestId('checkbox') as HTMLInputElement;
  const checkboxComponentCheckedState: boolean = checkbox.checked;
  fireEvent.click(checkbox);
  switch (checkboxComponentCheckedState) {
    case true:
      expect(checkbox.checked).toBeFalsy();
      break;
    case false:
      expect(checkbox.checked).toBeTruthy();
      break;
  }
});

test('Disabled component checked value does not change when component is clicked', () => {
  const component = render(<Disabled {...Disabled.args} />);
  const checkbox = component.getByTestId('checkbox') as HTMLInputElement;
  const checkboxComponentCheckedState: boolean = checkbox.checked;
  fireEvent.click(checkbox);
  switch (checkboxComponentCheckedState) {
    case true:
      expect(checkbox.checked).toBeTruthy();
      break;
    case false:
      expect(checkbox.checked).toBeFalsy();
      break;
  }
});

test('Disabled component has default cursor', () => {
  const component = render(<Disabled {...Disabled.args} />);
  const checkboxAlias = component.getByTestId(
    'checkbox-alias'
  ) as HTMLInputElement;
  expect(checkboxAlias).toHaveClass('cursor-default');
});

test('Error state component has a red color', () => {
  const component = render(<Error {...Error.args} />);
  const checkboxAlias = component.getByTestId(
    'checkbox-alias'
  ) as HTMLInputElement;
  //NOTE: Class name used for error state is subject to change
  const redColor: string = 'red-500';
  expect(checkboxAlias).toHaveClass(`bg-${redColor} border-${redColor}`);
});
