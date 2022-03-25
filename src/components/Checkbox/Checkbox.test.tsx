import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './Checkbox.stories';
import { Checkbox } from './Checkbox';
import userEvent from '@testing-library/user-event';

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

test('Space key press changes the checkbox checked state.', () => {
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
  checkbox.focus();
  userEvent.keyboard('{Space}');
  expect(checkbox.getAttribute('aria-checked')).toEqual('true');
});

test('Click event changes the checkbox checked state.', () => {
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
  fireEvent.click(checkbox);
  expect(checkbox.getAttribute('aria-checked')).toEqual('true');
});

test('Click event does not change the checked state of a checkbox with a disabled prop set to true.', () => {
  const Wrapper = () => {
    const [checked, setChecked] = useState<boolean>(false);
    Default.args = {
      ...Default.args,
      checked: checked,
      disabled: true,
      onChange: (): void => {
        setChecked(!checked);
      },
    };
    return <Default {...Default.args} />;
  };
  const component = render(<Wrapper />);
  const checkbox = component.getByTestId('checkbox') as HTMLSpanElement;
  fireEvent.click(checkbox);
  expect(checkbox.getAttribute('aria-checked')).toEqual('false');
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

test('Checkbox element has a parent HTML label element.', () => {
  const component = render(<Default {...Default.args} />);
  const checkbox = component.getByTestId('checkbox') as HTMLSpanElement;
  const label = checkbox.parentNode as HTMLLabelElement;
  expect(label.nodeName).toEqual('LABEL');
});

test("Checkbox element has an aria-labelledby attribute equal to its parent HTML label element's id attribute.", () => {
  const component = render(<Default {...Default.args} />);
  const checkbox = component.getByTestId('checkbox') as HTMLSpanElement;
  const label = checkbox.parentNode as HTMLLabelElement;
  expect(checkbox.getAttribute('aria-labelledby')).toEqual(
    label.getAttribute('id')
  );
});
