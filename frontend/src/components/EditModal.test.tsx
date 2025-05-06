import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditModal, { EditEventDatas } from './EditModal';
import { vi, beforeEach, describe, test, expect } from 'vitest';
import { ReactNode } from 'react';

vi.mock('./ModalPortal', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>, // childrenをそのままレンダリング
}));

describe('EditModal', () => {
  const mockToggleEditModal = vi.fn();
  const mockOnEdit = vi.fn();

  const selectedEventDatas = {
    id: '1',
    event: 'テストイベント',
    date: '2025-03-01T00:00:00.000Z',
    createdAt: '2025-03-01T00:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('初期値がフォームに正しく設定される', () => {
    render(
      <EditModal toggleEditModal={mockToggleEditModal} onEdit={mockOnEdit} selectedEventDatas={selectedEventDatas} />
    );

    const input = screen.getByPlaceholderText('予定を編集してください');
    expect(input).toHaveValue('テストイベント');
  });

  test('フォームが送信された時に onEdit が呼ばれ、フォームがリセットされる。', async () => {
    render(
      <EditModal toggleEditModal={mockToggleEditModal} onEdit={mockOnEdit} selectedEventDatas={selectedEventDatas} />
    );

    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('予定を編集してください');

    await user.clear(input);
    await user.type(input, '新しいテストイベント');

    await user.click(screen.getByText('追加'));

    expect(mockOnEdit).toHaveBeenCalledWith({
      id: '1',
      event: '新しいテストイベント',
    });

    expect(mockToggleEditModal).toHaveBeenCalled();

    await waitFor(() => {
      expect(input).toHaveValue('新しいテストイベント');
    });
  });

  test('バリデーションエラーメッセージが表示される', async () => {
    render(
      <EditModal toggleEditModal={mockToggleEditModal} onEdit={mockOnEdit} selectedEventDatas={selectedEventDatas} />
    );
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('予定を編集してください');

    await user.clear(input);
    await user.click(screen.getByText('追加'));

    await expect(screen.getByText('予定を追加してください。')).toBeInTheDocument();
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  test('「閉じる」ボタンを押したときにモーダルが閉じられる」', async () => {
    render(
      <EditModal toggleEditModal={mockToggleEditModal} onEdit={mockOnEdit} selectedEventDatas={selectedEventDatas} />
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('閉じる'));
    expect(mockToggleEditModal).toHaveBeenCalled();
  });
});
