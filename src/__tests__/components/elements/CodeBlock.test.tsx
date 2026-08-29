import { render, screen } from '@testing-library/react';

import CodeBlock from '@/common/components/elements/CodeBlock';

describe('CodeBlock', () => {
  it('renders code through the Prism syntax highlighter', async () => {
    const { container } = render(
      <CodeBlock className='language-javascript'>
        {'const answer = 42;\n'}
      </CodeBlock>,
    );

    expect(
      await screen.findByRole('button', { name: 'Copy to Clipboard' }),
    ).toBeInTheDocument();
    expect(container).toHaveTextContent('const answer = 42;');
  });
});
