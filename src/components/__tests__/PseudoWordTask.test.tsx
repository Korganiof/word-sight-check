import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PseudoWordTask } from '../PseudoWordTask';
import { type WordItem } from '@/lib/pseudowords';

const mockItems: WordItem[] = [
  { text: 'brint', isWord: false },
  { text: 'garden', isWord: true },
];

describe('PseudoWordTask', () => {
  it('renders the first item', () => {
    const { getByText } = render(
      <BrowserRouter>
        <PseudoWordTask items={mockItems} />
      </BrowserRouter>
    );

    expect(getByText('brint')).toBeInTheDocument();
  });

  it('displays progress information', () => {
    const { getByText } = render(
      <BrowserRouter>
        <PseudoWordTask items={mockItems} />
      </BrowserRouter>
    );

    expect(getByText(/Trial 1 of 2/i)).toBeInTheDocument();
  });

  it('renders answer buttons with keyboard shortcuts', () => {
    const { getByText } = render(
      <BrowserRouter>
        <PseudoWordTask items={mockItems} />
      </BrowserRouter>
    );

    expect(getByText(/Real word/i)).toBeInTheDocument();
    expect(getByText(/Not a word/i)).toBeInTheDocument();
    expect(getByText(/Press A/i)).toBeInTheDocument();
    expect(getByText(/Press L/i)).toBeInTheDocument();
  });

  it('displays task instruction', () => {
    const { getByText } = render(
      <BrowserRouter>
        <PseudoWordTask items={mockItems} />
      </BrowserRouter>
    );

    expect(getByText(/Is this a real word?/i)).toBeInTheDocument();
  });
});
