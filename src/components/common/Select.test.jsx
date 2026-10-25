import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from './Select';

describe('Select', () => {
  it('merender label dan select dengan opsi', () => {
    render(
      <Select id="floor" label="Lantai" value="2" onChange={() => {}}>
        <option value="">Semua</option>
        <option value="1">Lantai 1</option>
        <option value="2">Lantai 2</option>
      </Select>
    );

    expect(screen.getByLabelText('Lantai')).toBeInTheDocument();
    expect(screen.getByLabelText('Lantai')).toHaveValue('2');
  });

  it('merender tanpa label jika prop label tidak diberikan', () => {
    render(
      <Select id="shift" value="pagi" onChange={() => {}}>
        <option value="pagi">Pagi</option>
        <option value="sore">Sore</option>
      </Select>
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('memanggil onChange ketika nilai dipilih', () => {
    const handleChange = vi.fn();
    render(
      <Select id="shift" label="Shift" value="pagi" onChange={handleChange}>
        <option value="pagi">Pagi</option>
        <option value="sore">Sore</option>
      </Select>
    );

    fireEvent.change(screen.getByLabelText('Shift'), { target: { value: 'sore' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('mendukung state disabled', () => {
    render(
      <Select id="test" value="" onChange={() => {}} disabled>
        <option value="">Pilih</option>
      </Select>
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('meneruskan className tambahan', () => {
    render(
      <Select id="test" value="" onChange={() => {}} className="custom-class">
        <option value="">Pilih</option>
      </Select>
    );

    expect(screen.getByRole('combobox').className).toContain('custom-class');
  });
});

