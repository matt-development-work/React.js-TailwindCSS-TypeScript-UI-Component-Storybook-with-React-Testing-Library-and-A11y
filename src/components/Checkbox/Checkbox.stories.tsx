import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Checkbox, Props } from './Checkbox';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const meta: Meta = {
  title: 'Checkbox',
  component: Checkbox,
  argTypes: {},
};

export default meta;

const Template: Story<Props> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: 'Default',
};

export const Checked = Template.bind({});

Checked.args = {
  checked: true,
  label: 'Checked',
};

export const Indeterminate = Template.bind({});

Indeterminate.args = {
  indeterminate: true,
  label: 'Indeterminate',
};

export const Disabled = Template.bind({});

Disabled.args = {
  disabled: true,
  label: 'Disabled',
};

export const Error = Template.bind({});

Error.args = {
  checked: true,
  error: true,
  label: 'Error',
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

const TemplateCustom: Story<Props> = (args) => {
  const [checked, setChecked] = useState<boolean>(false);
  args = {
    ...args,
    checked: checked,
    onChange: (): void => {
      setChecked(!checked);
    },
  };
  return <Checkbox {...args} />;
};

export const Custom1 = TemplateCustom.bind({});

Custom1.args = {
  icon: {
    checked: faSolidHeart as IconProp,
    unChecked: faRegularHeart as IconProp,
    className: 'text-pink-400',
  },
  label: 'Custom 1',
};

export const Custom2 = TemplateCustom.bind({});

Custom2.args = {
  icon: {
    checked: faPlay as IconProp,
    unChecked: faPause as IconProp,
    className: 'text-green-500',
  },
  label: 'Custom 2',
};
