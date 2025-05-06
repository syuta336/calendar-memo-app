import type { Meta, StoryObj } from '@storybook/react';
import CalendarComponent from './Calendar';
import { http, HttpResponse } from 'msw';
import { userEvent, within, expect, waitFor } from '@storybook/test';
import type { StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { Decorator } from '@storybook/react';

const mockEventDatas = [
  {
    id: '67c6160d99a23eb02fcc6a6a',
    event: '予定を追加０４',
    date: '2025-03-15T15:00:00.000Z',
    createdAt: '2025-03-03T20:50:21.517Z',
    updatedAt: '2025-03-03T20:50:21.517Z',
  },
  {
    id: '67c4de4f99a23eb02fcc6a66',
    event: '更新前イベントモック',
    date: '2025-03-15T15:00:00.000Z',
    createdAt: '2025-03-02T22:40:15.224Z',
    updatedAt: '2025-03-02T22:40:15.224Z',
  },
];

// `modal-root` を確実に追加するデコレーター
// const withModalRoot: Decorator = (Story) => {
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       // `modal-root` が既に存在する場合は削除
//       let modalRoot = document.getElementById('modal-root');
//       if (modalRoot) {
//         modalRoot.remove();
//       }

//       // `modal-root` を新しく作成
//       modalRoot = document.createElement('div');
//       modalRoot.id = 'modal-root';
//       document.body.appendChild(modalRoot);
//     }
//   }, []);

//   return <Story />;
// };

const meta: Meta<typeof CalendarComponent> = {
  component: CalendarComponent,
  // decorators: [withModalRoot],
};

export default meta;

type Story = StoryObj<typeof CalendarComponent>;

export const MockedSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:5005/api/events', () => {
          return HttpResponse.json(mockEventDatas);
        }),
      ],
    },
  },
};

export const OpenAddModal: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:5005/api/events', () => {
          return HttpResponse.json(mockEventDatas);
        }),
      ],
    },
  },
  render: () => {
    // useEffect(() => {
    //   if (typeof window !== 'undefined') {
    //     // すでに存在する `modal-root` を削除
    //     const existingModalRoot = document.getElementById('modal-root');
    //     if (existingModalRoot) {
    //       existingModalRoot.remove();
    //     }

    //     // `modal-root` を追加
    //     const modalRoot = document.createElement('div');
    //     modalRoot.id = 'modal-root';
    //     document.body.appendChild(modalRoot);
    //   }
    // }, []);

    return <CalendarComponent />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // const iframe = canvasElement as HTMLIFrameElement;

    // const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    // if (!iframeDocument) {
    //   console.error('iframeDocument is undefined');
    //   return;
    // }

    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      console.log('modal-root : ', modalRoot);
      document.body.appendChild(modalRoot);
    }

    // if (iframeDocument) {
    //   // iframeDocument.body は HTMLElement 型なので、within に渡せます
    //   const canvas = within(iframeDocument.body);

    //   // 以降、canvas を使って DOM 要素を探す
    //   const dateTitle = await canvas.findByTestId('date-15');
    //   await waitFor(() => {
    //     console.log('dateTitle', dateTitle);
    //   });
    //   expect(dateTitle).toBeInTheDocument();

    //   await userEvent.click(dateTitle);

    //   const inputElement = canvas.getByPlaceholderText('予定を追加してください');
    //   expect(inputElement).toBeInTheDocument();
    // } else {
    //   console.error('iframeDocument is undefined');
    //   // iframe が読み込まれていない場合のエラーハンドリング
    // }

    //15日の日付をクリック
    const dateTitle = await canvas.findByTestId('date-15');
    await waitFor(() => {
      console.log('dateTitle', dateTitle);
    });
    expect(dateTitle).toBeInTheDocument();
    await userEvent.click(dateTitle);

    await waitFor(
      () => {
        // const iframeDocument = canvasElement.ownerDocument;
        const iframeDocument = canvasElement as HTMLIFrameElement;
        const iframeContentDocument = iframeDocument.contentDocument || iframeDocument.contentWindow?.document;
        if (iframeContentDocument) {
          const canvas = within(iframeContentDocument.body);
          const inputElement = canvas.getAllByPlaceholderText('予定を追加してください');
          expect(inputElement).toBeInTheDocument();
        }
        // const modalRoot = iframeDocument.getElementById('modal-root');
        // const inputElement = iframeDocument.querySelector('[placeholder="予定を追加してください"]');
        // expect(modalRoot).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const OpenEditModal: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:5005/api/events', () => {
          return HttpResponse.json(mockEventDatas);
        }),
      ],
    },
  },
  render: () => {
    // useEffect(() => {
    //   if (typeof window !== 'undefined') {
    //     // すでに存在する `modal-root` を削除
    //     const existingModalRoot = document.getElementById('modal-root');
    //     if (existingModalRoot) {
    //       existingModalRoot.remove();
    //     }

    //     // `modal-root` を追加
    //     const modalRoot = document.createElement('div');
    //     modalRoot.id = 'modal-root';
    //     document.body.appendChild(modalRoot);
    //   }
    // }, []);

    return <CalendarComponent />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // const iframe = canvasElement as HTMLIFrameElement;

    // const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    // if (!iframeDocument) {
    //   console.error('iframeDocument is undefined');
    //   return;
    // }

    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      console.log('modal-root : ', modalRoot);
      document.body.appendChild(modalRoot);
    }

    // if (iframeDocument) {
    //   // iframeDocument.body は HTMLElement 型なので、within に渡せます
    //   const canvas = within(iframeDocument.body);

    //   // 以降、canvas を使って DOM 要素を探す
    //   const dateTitle = await canvas.findByTestId('date-15');
    //   await waitFor(() => {
    //     console.log('dateTitle', dateTitle);
    //   });
    //   expect(dateTitle).toBeInTheDocument();

    //   await userEvent.click(dateTitle);

    //   const inputElement = canvas.getByPlaceholderText('予定を追加してください');
    //   expect(inputElement).toBeInTheDocument();
    // } else {
    //   console.error('iframeDocument is undefined');
    //   // iframe が読み込まれていない場合のエラーハンドリング
    // }

    //適当な予定をクリック
    const eventOnce = await canvas.findByText('予定を追加０４');
    await waitFor(() => {
      console.log('eventOnce', eventOnce);
    });
    expect(eventOnce).toBeInTheDocument();
    await userEvent.click(eventOnce);

    await waitFor(
      () => {
        // const iframeDocument = canvasElement.ownerDocument;
        const iframeDocument = canvasElement as HTMLIFrameElement;
        const iframeContentDocument = iframeDocument.contentDocument || iframeDocument.contentWindow?.document;
        if (iframeContentDocument) {
          const canvas = within(iframeContentDocument.body);
          const inputElement = canvas.getAllByPlaceholderText('予定を編集してください');
          expect(inputElement).toBeInTheDocument();
        }
        // const modalRoot = iframeDocument.getElementById('modal-root');
        // const inputElement = iframeDocument.querySelector('[placeholder="予定を追加してください"]');
        // expect(modalRoot).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
