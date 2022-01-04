import React from 'react';
import { render } from '@testing-library/react';

import SimpleButton from './SimpleButton';

describe('SimpleButton', () => {
  test('renders the SimpleButton component', () => {
    render(<SimpleButton label='Hello world!' />);
  });
});
