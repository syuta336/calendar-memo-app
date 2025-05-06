import React, { ReactNode } from 'react';
import { vi, beforeEach, describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';
import AddModal from './AddModal';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

vi.mock('./ModalPortal', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>, // childrenをそのままレンダリング
}));

describe('AddModal Component', () => {
  const toggleAddModal = vi.fn();
  const onAdd = vi.fn();
  const testDate = new Date(2025, 2, 15);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('モーダルが適切にレンダリングされること', () => {
    render(<AddModal toggleAddModal={toggleAddModal} onAdd={onAdd} date={testDate} />);

    expect(screen.getByText('2025年03月15日')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('予定を追加してください')).toBeInTheDocument();
    expect(screen.getByText('閉じる')).toBeInTheDocument();
    expect(screen.getByText('追加')).toBeInTheDocument();
  });

  test('予定を入力し、"追加" ボタンを押したら onAdd が呼ばれる', async () => {
    render(<AddModal toggleAddModal={toggleAddModal} onAdd={onAdd} date={testDate} />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('予定を追加してください');
    await user.type(input, 'テストイベント');

    await user.click(screen.getByText('追加'));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith({ event: 'テストイベント', date: testDate });
    });

    expect(toggleAddModal).toHaveBeenCalled();
  });

  test('空の入力で "追加" を押したときにエラーメッセージが表示される', async () => {
    render(<AddModal toggleAddModal={toggleAddModal} onAdd={onAdd} date={testDate} />);
    const user = userEvent.setup();

    await user.click(screen.getByText('追加'));

    await waitFor(() => {
      expect(screen.getByText('予定を追加してください。')).toBeInTheDocument();
    });

    expect(onAdd).not.toHaveBeenCalled();
  });

  test('20文字以上入力するとエラーメッセージが表示される。', async () => {
    render(<AddModal toggleAddModal={toggleAddModal} onAdd={onAdd} date={testDate} />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('予定を追加してください');
    await user.type(input, 'あいうえおかきくけこさしすせそたちつてとなにぬね');

    await user.click(screen.getByText('追加'));

    await waitFor(() => {
      expect(screen.getByText('20文字以内で入力してください。')).toBeInTheDocument();
    });

    expect(onAdd).not.toHaveBeenCalled();
  });

  test('予定を追加後、フォームがリセットされる', async () => {
    render(<AddModal toggleAddModal={toggleAddModal} onAdd={onAdd} date={testDate} />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('予定を追加してください');
    await user.type(input, 'テストイベント');
    await user.click(screen.getByText('追加'));

    await waitFor(() => {
      expect(input).toHaveValue(''); // 入力がリセットされることを確認
    });
  });

  test('「閉じる」ボタンを押したときにフォームがリセットされる', async () => {
    render(<AddModal toggleAddModal={toggleAddModal} onAdd={onAdd} date={testDate} />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('予定を追加してください');
    await user.type(input, 'テストイベント');
    await user.click(screen.getByText('閉じる'));

    await waitFor(() => {
      expect(toggleAddModal).toHaveBeenCalled(); // モーダルが閉じられる
    });

    // 再度開いたときにフォームがリセットされていることを確認
    render(<AddModal toggleAddModal={toggleAddModal} onAdd={onAdd} date={testDate} />);
    expect(input).toHaveValue('');
  });
});
