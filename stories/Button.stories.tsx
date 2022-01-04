import React, { Fragment, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Button, Props } from '../src/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

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
  return (
    <Button {...args}>
      <div className="">Button</div>
    </Button>
  );
};

export const Text = Template.bind({});

Text.args = {
  label: 'Button',
  variant: 'text',
};

export const Contained = Template.bind({});

Contained.args = {
  label: 'Button',
  variant: 'contained',
};

export const Outlined = Template.bind({});

Outlined.args = {
  label: 'Button',
  variant: 'outlined',
};

const IconTemplate: Story<Props> = (args) => {
  return (
    <Button {...args}>
      <FontAwesomeIcon className={`text-white`} icon={faArrowDown} size="sm" />
    </Button>
  );
};

export const Icon = IconTemplate.bind({});

Icon.args = {
  label: 'Button',
  icon: true,
  variant: 'contained',
  rounded: true,
};
