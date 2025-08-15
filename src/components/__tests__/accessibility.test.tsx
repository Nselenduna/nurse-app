import React from 'react';
import { render } from '@testing-library/react-native';
import CpdLogCard from '../CpdLogCard';
import CategorySelector from '../CategorySelector';

// Mock dependencies
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => 'Ionicons'
}));

describe('Accessibility Tests', () => {
  describe('CpdLogCard', () => {
    it('has appropriate accessibility properties', () => {
      const sampleLog = {
        id: '1',
        text: 'Test CPD activity',
        category: 'Clinical Practice',
        hours: 2,
        createdAt: Date.now(),
        isVoiceGenerated: false
      };
      
      const { getByA11yRole, queryByA11yRole } = render(
        <CpdLogCard 
          log={sampleLog}
          onPress={jest.fn()}
          showActions={true}
          onDelete={jest.fn()}
          accessibilityLabel={`CPD activity: ${sampleLog.text}`}
          testID="cpd-log-card"
        />
      );
      
      // Check that the card has appropriate role
      expect(getByA11yRole('button')).toBeTruthy();
      
      // Check that delete button has appropriate role and label
      const deleteButton = queryByA11yRole('button', { name: /delete/i });
      expect(deleteButton).toBeTruthy();
    });
  });
  
  describe('CategorySelector', () => {
    it('has accessible labels and roles', () => {
      const { getAllByA11yRole } = render(
        <CategorySelector 
          selectedCategory="Clinical Practice"
          onSelectCategory={jest.fn()}
        />
      );
      
      // Check that category chips are buttons
      const buttons = getAllByA11yRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Check that the first button is the selected one
      const firstButton = buttons[0];
      expect(firstButton.props.accessibilityState).toEqual(
        expect.objectContaining({ selected: true })
      );
    });
  });
});
