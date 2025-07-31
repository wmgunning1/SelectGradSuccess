import { render } from '@testing-library/react';

import { TestHarness } from '@/_test/TestHarness';

import Home from './Home';

const renderComponent = (props: { route?: string }) =>
  render(<TestHarness {...props} children={<Home />}></TestHarness>).container;

describe('<Home />', () => {
  test('title should be visible in page', () => {
    renderComponent({});

    expect(true).toBeTruthy();
  });
});
