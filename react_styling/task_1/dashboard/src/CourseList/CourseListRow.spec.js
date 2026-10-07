import { render } from '@testing-library/react';
import CourseListRow from './CourseListRow';

describe('CourseListRow component', () => {
  describe('when isHeader is true', () => {
    test('renders one th cell with colSpan = 2 when textSecondCell is null', () => {
      const { container } = render(
        <table>
          <thead>
            <CourseListRow isHeader={true} textFirstCell="Header text" textSecondCell={null} />
          </thead>
        </table>
      );
      const th = container.querySelector('th');
      expect(th).not.toBeNull();
      expect(th.getAttribute('colSpan')).toBe('2');
      expect(th.textContent).toBe('Header text');
    });

    test('renders two th cells when textSecondCell is not null', () => {
      const { container } = render(
        <table>
          <thead>
            <CourseListRow isHeader={true} textFirstCell="Header 1" textSecondCell="Header 2" />
          </thead>
        </table>
      );
      const ths = container.querySelectorAll('th');
      expect(ths.length).toBe(2);
      expect(ths[0].textContent).toBe('Header 1');
      expect(ths[1].textContent).toBe('Header 2');
    });
  });

  describe('when isHeader is false', () => {
    test('renders correctly two td elements within a tr element', () => {
      const { container } = render(
        <table>
          <tbody>
            <CourseListRow isHeader={false} textFirstCell="Cell 1" textSecondCell="Cell 2" />
          </tbody>
        </table>
      );
      const tr = container.querySelector('tr');
      const tds = container.querySelectorAll('td');
      expect(tr).not.toBeNull();
      expect(tds.length).toBe(2);
      expect(tds[0].textContent).toBe('Cell 1');
      expect(tds[1].textContent).toBe('Cell 2');
    });
  });
});
