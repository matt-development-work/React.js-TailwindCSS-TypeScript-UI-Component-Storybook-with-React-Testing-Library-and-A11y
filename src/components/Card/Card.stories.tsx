import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Card, Props } from './Card';

const meta: Meta = {
  title: 'Card',
  component: Card,
  argTypes: {
    className: { defaultValue: 'h-40 w-40 flex items-center justify-center' },
    id: { defaultValue: 'Card' },
    title: { defaultValue: 'Card' },
  },
};

export default meta;

const Template: Story<Props> = (args) => {
  return <Card {...args} />;
};

export const Default = Template.bind({});

export const Square = Template.bind({});

Square.args = {
  square: true,
};

export const Hover = Template.bind({});

Hover.args = {
  elevation: 'md',
  hoverElevation: 'lg',
};
