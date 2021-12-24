import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Checkbox, Props } from '../src/Checkbox';

const meta: Meta = {
  title: 'Checkbox',
  component: Checkbox,
  argTypes: {
    onChange: { action: 'changed' },
    id: { defaultValue: 'checkbox' },
    title: { defaultValue: 'Checkbox' },
  },
};

export default meta;

const Template: Story<Props> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: 'Checkbox',
};

export const Checked = Template.bind({});

Checked.args = {
  checked: true,
  label: 'Checkbox',
};

export const Indeterminate = Template.bind({});

Indeterminate.args = {
  indeterminate: true,
  label: 'Checkbox',
};

export const Disabled = Template.bind({});

Disabled.args = {
  disabled: true,
  label: 'Checkbox',
};

export const Error = Template.bind({});

Error.args = {
  checked: true,
  error: true,
};

const MultiLineTemplate: Story<Props> = (args) => (
  <div className="w-96">
    <Checkbox {...args} />
  </div>
);

export const MultiLine = MultiLineTemplate.bind({});

MultiLine.args = {
  checked: true,
  label: (() => {
    const label = 'Multi-line Checkbox ';
    return label.repeat(8);
  })(),
};
