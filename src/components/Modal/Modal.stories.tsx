import React, { useRef, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Modal, Props } from './Modal';
import Backdrop from '../Backdrop';
import Button from '../Button';
import Checkbox from '../Checkbox';

const meta: Meta = {
  title: 'Modal',
  component: Modal,
  argTypes: {
    id: { defaultValue: 'modal' },
    title: { defaultValue: 'Modal' },
  },
};

export default meta;

const DefaultTemplate: Story<Props> = (args) => {
  const modalButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  args = {
    ...args,
    open: open,
    onClose: () => {
      setOpen(false);
      modalButton.current?.focus();
    },
  };
  const handleClick: () => void = () => {
    setOpen(true);
  };
  return (
    <div>
      <Button
        data-testid="modal-button"
        onClick={() => handleClick()}
        ref={modalButton}
        variant="outlined"
      >
        open
      </Button>
      <Modal {...args}>
        <div className="flex items-end justify-end p-4">
          <div className="w-80 h-40">
            {[...Array(3).keys()].map((el) => {
              const val = `Option ${el + 1}`;
              return (
                <Checkbox
                  id={val}
                  key={val}
                  label={val}
                  onChange={() => undefined}
                />
              );
            })}
          </div>
          <Button variant="outlined" onClick={() => undefined}>
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export const Default = DefaultTemplate.bind({});

const LoadingSpinnerTemplate: Story = () => {
  const [open, setOpen] = useState(false);
  const handleClick: () => void = () => {
    setOpen(true);
    setTimeout((): void => {
      setOpen(false);
    }, 2500);
  };

  return (
    <div>
      <Button
        variant="outlined"
        data-testid="modal-button"
        onClick={() => handleClick()}
      >
        open
      </Button>
      <Backdrop displayOnly open={open} transitionDuration={700}>
        <div className="loading-spinner"></div>
      </Backdrop>
    </div>
  );
};

export const LoadingSpinner = LoadingSpinnerTemplate.bind({});
