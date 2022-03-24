import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import * as stories from './Modal.stories';

const { Default } = composeStories(stories);

test('Renders a Backdrop component', () => {
  const component = render(<Default {...Default.args} />);
  const openButton = component.getByTestId('open-dialog') as HTMLButtonElement;
  fireEvent.click(openButton);
  const backdrop = component.getByTestId('backdrop') as HTMLDivElement;
  expect(backdrop).toBeInTheDocument();
});

test("When the dialog closes, the user's point of regard is maintained by returning focus to the Open Modal button.", async () => {
  const component = render(<Default {...Default.args} />);
  const open = component.getByTestId('open-dialog') as HTMLButtonElement;
  fireEvent.click(open);
  const cancel = component.getByTestId('dialog-cancel') as HTMLButtonElement;
  fireEvent.click(cancel);
  const backdrop = component.getByTestId('backdrop') as HTMLDivElement;
  await waitFor(() => {
    expect(backdrop).not.toBeInTheDocument();
  });
  expect(document.activeElement === open).toBeTruthy();
});

test('The page Tab sequence is contained within the scope of dialog.', () => {
  const component = render(<Default {...Default.args} />);
  const open = component.getByTestId('open-dialog') as HTMLButtonElement;
  fireEvent.click(open);
  const backdrop = component.getByTestId('backdrop') as HTMLDivElement;
  const initialFocusedElement = document.activeElement;
  let iterating = true;
  while (iterating) {
    userEvent.keyboard('{Tab}');
    const focusedElement = document.activeElement;
    if (!backdrop.contains(focusedElement)) break;
    if (focusedElement === initialFocusedElement) iterating = false;
  }
  expect(iterating).toBeFalsy();
});
