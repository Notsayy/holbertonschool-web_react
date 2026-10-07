import { render, screen } from '@testing-library/react';
import BodySectionWithMarginBottom from './BodySectionWithMarginBottom';

describe('BodySectionWithMarginBottom component', () => {
  test('contains a div with the class bodySectionWithMargin', () => {
    const { container } = render(
      <BodySectionWithMarginBottom title="test title">
        <p>test children</p>
      </BodySectionWithMarginBottom>
    );

    const divElement = container.querySelector('.bodySectionWithMargin');
    expect(divElement).toBeInTheDocument();
  });

  test('renders the BodySection component', () => {
    const { container } = render(
      <BodySectionWithMarginBottom title="test title">
        <p>test children</p>
      </BodySectionWithMarginBottom>
    );

    const bodySectionDiv = container.querySelector('.bodySection');
    expect(bodySectionDiv).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 2, name: 'test title' });
    expect(heading).toBeInTheDocument();

    const paragraph = screen.getByText('test children');
    expect(paragraph).toBeInTheDocument();
  });
});
