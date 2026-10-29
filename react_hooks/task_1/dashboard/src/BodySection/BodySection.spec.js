import { render, screen } from '@testing-library/react';
import BodySection from './BodySection';

describe('BodySection component', () => {
  test('renders a heading with the title prop value', () => {
    render(
      <BodySection title="test title">
        <p>test children</p>
      </BodySection>
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'test title' });
    expect(heading).toBeInTheDocument();
  });

  test('renders any number of children passed to it', () => {
    render(
      <BodySection title="test title">
        <p>test child 1</p>
        <p>test child 2</p>
      </BodySection>
    );

    expect(screen.getByText('test child 1')).toBeInTheDocument();
    expect(screen.getByText('test child 2')).toBeInTheDocument();
  });
});
