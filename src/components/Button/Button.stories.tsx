import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Button, Props } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const meta: Meta = {
  title: 'Button',
  component: Button,
  argTypes: {
    onClick: { action: 'click event' },
    id: { defaultValue: 'Button' },
    title: { defaultValue: 'Button' },
  },
};

export default meta;

const Template: Story<Props> = (args) => {
  return <Button {...args} />;
};

export const Text = Template.bind({});

Text.args = {
  children: 'Text',
  variant: 'text',
};

export const Contained = Template.bind({});

Contained.args = {
  children: 'Contained',
  variant: 'contained',
};

export const Outlined = Template.bind({});

Outlined.args = {
  children: 'Outlined',
  variant: 'outlined',
};

const IconTemplate: Story<Props> = (args) => {
  return <Button {...args}></Button>;
};

export const Icon = IconTemplate.bind({});

Icon.args = {
  children: (
    <FontAwesomeIcon
      className="text-white"
      icon={faArrowDown as IconProp}
      size="sm"
    />
  ),
  round: true,
  variant: 'contained',
};
