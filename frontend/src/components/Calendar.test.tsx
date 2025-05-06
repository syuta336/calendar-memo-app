import { render, screen, waitFor, act } from '@testing-library/react';
import { beforeAll, afterEach, afterAll, describe, test, expect } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import CalendarComponent from './Calendar';
import userEvent from '@testing-library/user-event';

type EventType = {
  id: string;
  event: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

// モックデータ
const mockEventDatas = [
  {
    id: '67c6160d99a23eb02fcc6a6a',
    event: '予定を追加０４',
    date: '2025-02-27T15:00:00.000Z',
    createdAt: '2025-03-03T20:50:21.517Z',
    updatedAt: '2025-03-03T20:50:21.517Z',
  },
  {
    id: '67c4de4f99a23eb02fcc6a66',
    event: '更新前イベントモック',
    date: '2025-02-27T15:00:00.000Z',
    createdAt: '2025-03-02T22:40:15.224Z',
    updatedAt: '2025-03-02T22:40:15.224Z',
  },
];

const mockNewEvent = {
  id: '67c6160d99a23eb02fcc6a6b',
  event: '新しいイベント',
  date: '2025-02-20T15:00:00.000Z',
  createdAt: '2025-03-04T12:00:00.000Z',
  updatedAt: '2025-03-04T12:00:00.000Z',
};

// `msw` のモックサーバーをセットアップ
const server = setupServer(
  http.get('http://localhost:5005/api/events', async () => {
    return HttpResponse.json(mockEventDatas);
  }),

  http.post('http://localhost:5005/api/events', async ({ request }) => {
    const newEvent = (await request.json()) as EventType;
    return HttpResponse.json<EventType>({ ...mockNewEvent, ...newEvent });
  }),

  http.patch('http://localhost:5005/api/events/:eventId', async ({ params, request }) => {
    console.log('params:', params); // 👀 params の中身を確認
    const { eventId } = params;
    console.log('patched_eventId:', eventId); // 👀 eventId の中身を確認
    try {
      const updateEvent = (await request.json()) as EventType;

      return HttpResponse.json(
        {
          message: `イベント${eventId}を更新しました。`,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('error_message', error);
    }
  }),

  http.delete('http://localhost:5005/api/events/:eventId', async ({ params }) => {
    const { eventId } = params;

    return HttpResponse.json({
      message: `イベント${eventId}を削除しました。`,
    });
  })
);

// グローバルセットアップ
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CalendarComponent', () => {
  beforeEach(() => {
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.setAttribute('id', 'modal-root');
      document.body.appendChild(modalRoot);
    }
  });

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      modalRoot.remove();
    }
  });

  test('カレンダーが正しく表示される', async () => {
    const { container } = await act(async () => render(<CalendarComponent />));
    expect(container.querySelector('.react-calendar')).toBeInTheDocument();
  });

  test('予定が表示される', async () => {
    await act(async () => {
      render(<CalendarComponent />);
    });

    await waitFor(() => {
      expect(screen.getByText('予定を追加０４')).toBeInTheDocument();
      expect(screen.getByText('更新前イベントモック')).toBeInTheDocument();
    });
  });

  test('予定が追加される', async () => {
    await act(async () => {
      render(<CalendarComponent />);
    });

    const user = userEvent.setup();
    const dateElement = await screen.findByTestId('date-20');
    expect(dateElement).toBeInTheDocument();
    await user.click(dateElement);

    await waitFor(() => {
      const modalContainer = document.querySelector('.modal-container');
      expect(modalContainer).toBeInTheDocument();
    });

    const inputField = screen.getByPlaceholderText('予定を追加してください');
    await user.type(inputField, '新しいイベント');

    const addButton = await screen.findByRole('button', { name: '追加' });
    await user.click(addButton);

    await waitFor(() => {
      expect(document.querySelector('.modal-container')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('新しいイベント')).toBeInTheDocument();
      // expect(screen.getByText('2025-02-20T15:00:00.000Z')).toBeInTheDocument();
    });
  });

  test('予定が編集される', async () => {
    await act(async () => {
      render(<CalendarComponent />);
    });

    const user = userEvent.setup();

    const eventElement = await screen.findByText('更新前イベントモック');
    expect(eventElement).toBeInTheDocument();
    await user.click(eventElement);

    await waitFor(() => {
      expect(document.querySelector('.modal-container')).toBeInTheDocument();
    });

    const inputField = screen.getByPlaceholderText('予定を編集してください');
    await user.clear(inputField);
    await user.type(inputField, '予定を編集完了');

    const editButton = await screen.findByRole('button', { name: '更新' });
    await user.click(editButton);

    const Button = await screen.findByRole('button', { name: '閉じる' });
    await user.click(Button);

    await waitFor(() => {
      const modalContainer = document.querySelector('.modal-container');
      // if (modalContainer) screen.debug(modalContainer); // モーダルが閉じた後に確認
      expect(modalContainer).not.toBeInTheDocument(); // モーダルが閉じたことを確認
      // expect(screen.findByText('予定を編集完了')).toBeInTheDocument();
    });
  });

  test('削除ボタンをクリックすると confirm ダイアログが表示される', async () => {
    const { container } = await act(async () => render(<CalendarComponent />));

    const user = userEvent.setup();
    const confirmMock = vi.spyOn(window, 'confirm').mockImplementation(() => true);

    const deleteButton = container.querySelector('.delete-icon');
    if (deleteButton) {
      await user.click(deleteButton);
    } else {
      throw new Error('削除ボタンが見つかりませんでした');
    }

    expect(confirmMock).toHaveBeenCalled();
    confirmMock.mockRestore();
  });

  test('confirm OK を選択するとイベントが削除される', async () => {
    await act(async () => {
      render(<CalendarComponent />);
    });

    const user = userEvent.setup();
    const confirmMock = vi.spyOn(window, 'confirm').mockImplementation(() => true);

    const deleteButton = document.querySelector('.delete-icon');
    if (deleteButton) {
      await user.click(deleteButton);
    } else {
      throw new Error('削除ボタンが見つかりませんでした');
    }

    await waitFor(() => {
      expect(screen.queryByText('予定を追加０４')).not.toBeInTheDocument();
    });
  });
});
