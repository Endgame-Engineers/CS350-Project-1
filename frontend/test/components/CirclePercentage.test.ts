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
        
        const container = screen.getByRole('figure');
        expect(container).toHaveStyle({ width: '4em', height: '4em' });
        
        const percentageTexts = screen.getAllByText('50%'); 
        expect(percentageTexts).toHaveLength(2);
        percentageTexts.forEach(text => {
            expect(text).toBeTruthy();
        });
    });

   it('renders title and subtitle when provided', () => {
    render(CirclePercentage, {
      props: {
        progress: 50,
        size: 4,
        title: 'Test Title',
        subtitle: 'Test Subtitle',
      },
    });

    const title = screen.getByText('Test Title');
    const subtitle = screen.getByText('Test Subtitle');

    expect(title).toBeTruthy();
    expect(subtitle).toBeTruthy();
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
