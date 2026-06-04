import { describe, it, expect } from 'vitest';

describe('Integration Tests (DOM Environment)', () => {
  it('manipulates the DOM correctly', () => {
    // happy-dom supplies document and window
    const div = document.createElement('div');
    div.id = 'test-element';
    div.textContent = 'Hello World';
    document.body.appendChild(div);

    const found = document.getElementById('test-element');
    expect(found).not.toBeNull();
    expect(found.textContent).toBe('Hello World');
    
    // Clean up
    document.body.removeChild(found);
  });
});
