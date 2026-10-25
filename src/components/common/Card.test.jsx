import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card component', () => {
  it('merender elemen div secara default dengan class container standar', () => {
    render(<Card>Konten Kartu</Card>);
    const card = screen.getByText('Konten Kartu');
    expect(card).toBeInTheDocument();
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('rounded-2xl', 'bg-white');
  });

  it('mendukung kustomisasi tag HTML melalui prop "as"', () => {
    render(
      <ul>
        <Card as="li" data-testid="card-li">
          Item Daftar
        </Card>
      </ul>
    );

    const li = screen.getByTestId('card-li');
    expect(li.tagName).toBe('LI');
    expect(li).toHaveTextContent('Item Daftar');
  });

  it('menggabungkan className kustom', () => {
    render(<Card className="p-8 border-indigo-500">Kustom</Card>);
    const card = screen.getByText('Kustom');
    expect(card).toHaveClass('p-8', 'border-indigo-500');
  });
});

