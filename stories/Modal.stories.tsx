import React, { Fragment, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Backdrop, Props } from '../src/Backdrop';
import { Button } from '../src/Button';
import { Modal } from '../src/Modal';
import { Checkbox } from '../src/Checkbox';

const meta: Meta = {
  title: 'Modal',
  component: Modal,
  argTypes: {
    id: { defaultValue: 'modal' },
    title: { defaultValue: 'Modal' },
  },
};

export default meta;

const Template: Story<Props> = (args) => {
  const [open, setOpen] = useState(false);
  args = {
    ...args,
    open: open,
    onClose: () => setOpen(false),
  };
  const handleClick = () => {
    setOpen(true);
  };
  return (
    <div>
      <Button variant="outlined" onClick={() => handleClick()}>
        open
      </Button>
      <Modal {...args}>
        <div className="flex items-end justify-end p-4">
          <div className="w-80 h-40">
            <Checkbox
              id="Option 1"
              label="Option 1"
              onChange={() => undefined}
            />
            <Checkbox
              id="Option 2"
              label="Option 2"
              onChange={() => undefined}
            />
            <Checkbox
              id="Option 3"
              label="Option 3"
              onChange={() => undefined}
            />
          </div>
          <Button variant="outlined" onClick={() => undefined}>
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export const Default = Template.bind({});

Default.args = {
  label: 'Default',
};
