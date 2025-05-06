import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import AddModal from './AddModal';
import { userEvent, within, expect, waitFor } from '@storybook/test';

const meta: Meta<typeof AddModal> = {
  title: 'Components/AddModal',
  component: AddModal,
  argTypes: {
    toggleAddModal: { action: 'toggleAddModal' },
    onAdd: { action: 'onAdd' },
    date: { control: 'date' },
  },
  decorators: [
    (Story) => {
      if (!document.getElementById('modal-root')) {
        const modalRoot = document.createElement('div');
        modalRoot.id = 'modal-root';
        console.log('modal-root created:', modalRoot);
        document.body.appendChild(modalRoot);
      }
      return <Story />;
    },
  ],
};

export default meta;

type Story = StoryObj<typeof AddModal>;

export const Default: Story = {
  args: {
    toggleAddModal: () => console.log('Modal closed'),
    onAdd: (addEventDates: { event: string; date: string }) => {
      console.log('onAdd', addEventDates);
    },
    date: new Date(),
  },
};

export const WithSpecificDate: Story = {
  args: {
    toggleAddModal: () => console.log('Modal closed'),
    onAdd: (addEventDates: { event: string; date: string }) => {
      console.log('onAdd', addEventDates);
    },
    date: new Date(Date.UTC(2025, 3, 26)), // 2025年3月26日
  },
};

export const AddEvent: Story = {
  args: {
    toggleAddModal: () => console.log('Modal closed'),
    onAdd: (addEventDates: { event: string; date: string }) => {
      console.log('onAdd', addEventDates);
    },
    date: new Date(Date.UTC(2025, 3, 26)), // 2025年3月26日
  },
  play: async ({ canvasElement }) => {
    await waitFor(async () => {
      const modalRoot = document.getElementById('modal-root');
      if (!modalRoot) {
        throw new Error('modal-root not found');
      }

      const canvas = within(modalRoot);
      const inputElement = canvas.getByPlaceholderText('予定を追加してください');
      userEvent.type(inputElement, 'ミーティング');

      const addButton = canvas.getByRole('button', { name: /追加/i });
      userEvent.click(addButton);

      //   expect(await canvas.findAllByText('ミーティング')).toBeInTheDocument();
    });
  },
};

export const ValidationError: Story = {
  args: {
    toggleAddModal: () => console.log('Modal closed'),
    onAdd: (addEventDates: { event: string; date: string }) => {
      console.log('onAdd', addEventDates);
    },
    date: new Date(Date.UTC(2025, 3, 26)), // 2025年3月26日
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      //   const iframeDocument = canvasElement.ownerDocument;
      //   const inputElement = iframeDocument.querySelector('[placeholder="予定を追加してください"]');
      //   expect(inputElement).toBeInTheDocument();

      const modalRoot = document.getElementById('modal-root');
      if (!modalRoot) {
        throw new Error('modal-root not found');
      }

      const canvas = within(modalRoot);
      const addButton = canvas.getByRole('button', { name: '追加' });
      expect(addButton).toBeInTheDocument();

      userEvent.click(addButton);
      expect(canvas.getByText('予定を追加してください。')).toBeInTheDocument();
    });
  },
};
