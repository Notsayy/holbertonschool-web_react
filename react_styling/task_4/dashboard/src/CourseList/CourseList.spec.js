import { render } from '@testing-library/react';
import CourseList from './CourseList';

const coursesList = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
];

describe('CourseList component', () => {
  test('renders CourseList component without crashing', () => {
    render(<CourseList />);
  });

  test('renders 5 different rows when receiving an array of courses objects', () => {
    const { container } = render(<CourseList courses={coursesList} />);
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBe(5);
  });

  test('renders 1 row in tbody when receiving an empty array', () => {
    const { container } = render(<CourseList courses={[]} />);
    const tbodyRows = container.querySelectorAll('tbody tr');
    expect(tbodyRows.length).toBe(1);
  });
});
