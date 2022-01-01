import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Tree, TreeProps } from '../src/Tree';
import { Card } from '../src/Card';
import { customTreeData } from './data';

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
    <div className="absolute h-5/6">
      <Card className="bg-gray-900 relative max-h-full overflow-y-scroll shadow-lg">
        <Tree {...args} />
      </Card>
    </div>
  );
};

export const Custom = Template.bind({});

Custom.args = {
  label: 'Default',
  data: customTreeData,
};
