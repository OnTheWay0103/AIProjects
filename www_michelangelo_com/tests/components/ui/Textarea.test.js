import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Textarea from '@/components/ui/Textarea';

describe('Textarea', () => {
  it('renders textarea with label', () => {
    render(<Textarea label="描述" />);
    expect(screen.getByLabelText('描述')).toBeInTheDocument();
  });

  it('renders textarea without label', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Textarea error="请输入描述" />);
    expect(screen.getByRole('alert')).toHaveTextContent('请输入描述');
  });

  it('applies error styles when error is present', () => {
    render(<Textarea error="错误" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-error');
  });

  it('handles user input', async () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, '测试输入');
    
    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('测试输入');
  });

  it('applies custom className', () => {
    render(<Textarea className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('handles disabled state', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
}); 