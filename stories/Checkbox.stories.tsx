import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Checkbox, Props } from '../src/Checkbox';

const meta: Meta = {
  title: 'Checkbox',
  component: Checkbox,
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;

const Template: Story<Props> = (args) => (
  <Checkbox id="checkbox" label="Checkbox" {...args} />
);

export const Default = Template.bind({});

export const Checked = Template.bind({});

Checked.args = {
  checked: true,
};
