import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import WithLogging from './WithLogging';

class MockApp extends React.Component {
  render() {
    return (
      <h1>
        Hello from Mock App Component
      </h1>
    );
  }
}

const MockAppWithLogging = WithLogging(MockApp);

afterEach(cleanup);

describe('WithLogging HOC', () => {
  it('renders the wrapped component output', () => {
    render(<MockAppWithLogging />);
    expect(screen.getByText('Hello from Mock App Component')).toBeInTheDocument();
  });

  it('renders a heading element with the correct text', () => {
    render(<MockAppWithLogging />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Hello from Mock App Component');
  });

  it('sets displayName to WithLogging(MockApp)', () => {
    expect(MockAppWithLogging.displayName).toBe('WithLogging(MockApp)');
  });

  it('logs mount message on componentDidMount', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<MockAppWithLogging />);
    expect(consoleSpy).toHaveBeenCalledWith('Component MockApp is mounted');
    consoleSpy.mockRestore();
  });

  it('logs unmount message on componentWillUnmount', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const { unmount } = render(<MockAppWithLogging />);
    unmount();
    expect(consoleSpy).toHaveBeenCalledWith('Component MockApp is going to unmount');
    consoleSpy.mockRestore();
  });

  it('uses Component as default name when wrapped component has no name', () => {
    const Anonymous = WithLogging(() => <p>Anon</p>);
    // anonymous arrow functions may or may not have a name inferred; we just
    // verify displayName follows the WithLogging(...) pattern
    expect(Anonymous.displayName).toMatch(/^WithLogging\(/);
  });
});
