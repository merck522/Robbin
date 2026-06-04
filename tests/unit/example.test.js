import { describe, it, expect } from 'vitest';

// Simple function to test
function add(a, b) {
  return a + b;
}

describe('Unit Tests', () => {
  it('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });
});
