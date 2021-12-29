import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Tree, TreeProps } from '../src/Tree';
import { Card } from '../src/Card';

const meta: Meta = {
  title: 'Tree',
  component: Tree,
  argTypes: {
    id: { defaultValue: 'tree' },
    title: { defaultValue: 'Tree' },
  },
};

export default meta;

const Template: Story<TreeProps> = (args) => {
  return (
    <Card className="bg-gray-800">
      <Tree {...args} />
    </Card>
  );
};

export const Default = Template.bind({});

const generateString: () => string = () => Math.random().toString(36).slice(2);

Default.args = {
  label: 'Default',
  data: [
    {
      id: 1,
      value: 'Root',
      children: [
        { id: 2, value: generateString() },
        {
          id: 3,
          value: generateString(),
          children: [
            {
              id: 5,
              value: generateString(),
              children: [
                {
                  id: 9,
                  value: generateString(),
                  children: [
                    {
                      id: 13,
                      value: generateString(),
                      children: [
                        { id: 13, value: generateString() },
                        { id: 14, value: generateString() },
                      ],
                    },
                    { id: 14, value: generateString() },
                  ],
                },
                { id: 10, value: generateString() },
              ],
            },
            { id: 6, value: generateString() },
          ],
        },
        {
          id: 4,
          value: generateString(),
          children: [
            {
              id: 7,
              value: generateString(),
              children: [
                { id: 11, value: generateString() },
                {
                  id: 12,
                  value: generateString(),
                  children: [
                    { value: generateString() },
                    { value: generateString() },
                  ],
                },
              ],
            },
            { id: 8, value: generateString() },
          ],
        },
      ],
    },
  ],
};
