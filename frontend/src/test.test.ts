import { describe, it, expect } from 'vitest';

describe('jsdom test', () => {
  it('should have a window object', () => {
    expect(window).toBeDefined();
  });

  it('should have a document object', () => {
    expect(document).toBeDefined();
  });

  it('should be able to create elements', () => {
    const div = document.createElement('div');
    div.id = 'test';
    document.body.appendChild(div);

    expect(document.getElementById('test')).not.toBeNull();
  });
});
