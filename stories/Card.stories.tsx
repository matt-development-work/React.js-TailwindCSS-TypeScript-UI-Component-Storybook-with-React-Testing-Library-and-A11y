import React, { Fragment, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Card, Props } from '../src/Card';

const meta: Meta = {
  title: 'Card',
  component: Card,
  argTypes: {
    id: { defaultValue: 'Card' },
    title: { defaultValue: 'Card' },
  },
};

export default meta;

const Template: Story<Props> = (args) => {
  return (
    <Card {...args}>
      <div className="h-40 w-40 flex items-center justify-center"></div>
    </Card>
  );
};

export const Default = Template.bind({});

Default.args = {
  label: 'Default',
};

export const Square = Template.bind({});

Square.args = {
  label: 'Square',
  square: true,
};

export const Hover = Template.bind({});

Hover.args = {
  label: 'Hover',
  elevation: 'md',
  hoverElevation: 'lg',
};
