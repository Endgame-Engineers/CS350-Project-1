// TODO: Carlos
import { render, screen } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import CirclePercentage from '../../src/components/CirclePercentage.vue';

describe('CirclePercentage.vue', () => {
  it('renders correctly with default props', () => {
    render(CirclePercentage, {
      props: {
        progress: 50,
        size: 4,
      },
    });

    const container = screen.getByRole('figure'); // Ensure the container is rendered
    expect(container).toHaveStyle({ width: '4em', height: '4em' });

    const percentageText = screen.getByText('50%'); // Check the progress text
    expect(percentageText).toBeTruthy();
  });

  it('renders title and subtitle when provided', () => {
    render(CirclePercentage, {
      props: {
        progress: 75,
        size: 6,
        title: 'Test Title',
        subtitle: 'Test Subtitle',
      },
    });

    const title = screen.getByText('Test Title');
    const subtitle = screen.getByText('Test Subtitle');

    expect(title).toBeTruthy();
    expect(subtitle).toBeTruthy();
  });

  it('handles invalid progress values gracefully', () => {
    render(CirclePercentage, {
      props: {
        progress: 'invalid',
        size: 4,
      },
    });

    const percentageText = screen.getByText('0%');
    expect(percentageText).toBeTruthy(); // Invalid progress defaults to 0
  });

  it('does not render progress circle when progress is 0', () => {
    render(CirclePercentage, {
      props: {
        progress: 0,
        size: 4,
      },
    });

    const progressCircle = screen.queryByRole('path', { name: 'circle' });
    expect(progressCircle).toBeNull(); // No progress circle rendered for 0 progress
  });
});
