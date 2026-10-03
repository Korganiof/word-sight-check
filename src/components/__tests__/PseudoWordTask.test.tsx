import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PseudoWordTask } from '../PseudoWordTask';
import { type WordItem } from '@/lib/pseudowords';

const mockItems: WordItem[] = [
  { text: 'mipu', isWord: false },
  { text: 'talo', isWord: true },
];

describe('PseudoWordTask', () => {
  it('renders the first item', () => {
    const { getByText } = render(
      <BrowserRouter>
        <PseudoWordTask items={mockItems} />
      </BrowserRouter>
    );

    expect(getByText('mipu')).toBeInTheDocument();
  });

  it('displays progress information', () => {
    const { getByText } = render(
      <BrowserRouter>
        <PseudoWordTask items={mockItems} />
      </BrowserRouter>
    );

    expect(getByText(/Tehtävä 1 \/ 2/i)).toBeInTheDocument();
  });

  it('shows practice label when warmupCount is set', () => {
    const { getByText } = render(
      <BrowserRouter>
        <PseudoWordTask items={mockItems} warmupCount={1} />
      </BrowserRouter>
    );

    expect(getByText(/Harjoituskierros 1 \/ 1/i)).toBeInTheDocument();
    expect(getByText(/Harjoittelu/i)).toBeInTheDocument();
  });

  it('renders answer buttons with keyboard shortcuts', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <PseudoWordTask items={mockItems} />
      </BrowserRouter>
    );

    // The keycaps are inside the buttons; the accessible name spells the key out.
    expect(getByRole('button', { name: /Oikea sana \(A\)/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /Ei sana \(L\)/i })).toBeInTheDocument();
  });

  it('displays task instruction', () => {
    const { getByText } = render(
      <BrowserRouter>
        <PseudoWordTask items={mockItems} />
      </BrowserRouter>
    );

    expect(getByText(/Onko tämä oikea sana\?/i)).toBeInTheDocument();
  });
});
