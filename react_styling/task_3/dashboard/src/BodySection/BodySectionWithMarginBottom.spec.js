import { render, screen } from '@testing-library/react';
import BodySectionWithMarginBottom from './BodySectionWithMarginBottom';

describe('BodySectionWithMarginBottom component', () => {
  test('renders the BodySection component correctly with title and children', () => {
    render(
      <BodySectionWithMarginBottom title="test title">
        <p>test children</p>
      </BodySectionWithMarginBottom>
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'test title' });
    expect(heading).toBeInTheDocument();

    const paragraph = screen.getByText('test children');
    expect(paragraph).toBeInTheDocument();
  });
});
