import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './Modal.stories';

const { Default } = composeStories(stories);

test('Renders a Backdrop component', () => {
  const component = render(<Default {...Default.args} />);
  const openButton = component.getByTestId(
    'dialog-open-button'
  ) as HTMLButtonElement;
  fireEvent.click(openButton);
  const backdrop = component.getByTestId('backdrop') as HTMLDivElement;
  expect(backdrop).toBeInTheDocument();
});

test("When the dialog closes, the user's point of regard is maintained by returning focus to the Open Modal button.", async () => {
  const component = render(<Default {...Default.args} />);
  const openButton = component.getByTestId(
    'dialog-open-button'
  ) as HTMLButtonElement;
  fireEvent.click(openButton);
  const cancelButton = component.getByTestId(
    'dialog-cancel-button'
  ) as HTMLButtonElement;
  fireEvent.click(cancelButton);
  const backdrop = component.getByTestId('backdrop') as HTMLDivElement;
  await waitFor(() => {
    expect(backdrop).not.toBeInTheDocument();
  });
  expect(document.activeElement === openButton).toBeTruthy();
});
