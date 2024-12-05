// TODO: Carlos
import { render, fireEvent, screen } from '@testing-library/vue';
import UserStatsPercentage from '../../src/components/UserStatsPercentages.vue';
import '@testing-library/jest-dom';

describe('UserStatsPercentage.vue', () => {
  it('displays a warning when the total percentage is not 100%', async () => {
    const props = {
      isEditing: true,
      userStats: { proteinpercentage: 50, fatpercentage: 30, carbpercentage: 20 },
      editUserStats: { proteinpercentage: 50, fatpercentage: 30, carbpercentage: 20 },
    };

    render(UserStatsPercentage, { props });

    const proteinInput = screen.getByLabelText('Protein Percentage');
    const fatInput = screen.getByLabelText('Fat Percentage');
    const carbInput = screen.getByLabelText('Carb Percentage');

    await fireEvent.update(proteinInput, '60');

    expect(screen.getByRole('alert')).toHaveTextContent('The total percentage must add up to 100%');
  });
  it('hides the warning when the total percentage equals 100%', async () => {
    const props = {
      isEditing: true,
      userStats: { proteinpercentage: 50, fatpercentage: 30, carbpercentage: 20 },
      editUserStats: { proteinpercentage: 50, fatpercentage: 30, carbpercentage: 20 },
    };
  
    render(UserStatsPercentage, { props });
  
    const proteinInput = screen.getByLabelText('Protein Percentage');
    const fatInput = screen.getByLabelText('Fat Percentage');
    const carbInput = screen.getByLabelText('Carb Percentage');

    await fireEvent.update(proteinInput, '40');
    await fireEvent.update(fatInput, '30');
    await fireEvent.update(carbInput, '30');
  
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
