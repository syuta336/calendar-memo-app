import type { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';

// MSW を初期化する
initialize();

import '../src/styles/calendar.css';
import '../src/index.css';

// modal-root を DOM に追加
if (typeof window !== 'undefined') {
  // document.bodyが読み込まれてから modal-root を追加
  document.addEventListener('DOMContentLoaded', () => {
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  });
}

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
