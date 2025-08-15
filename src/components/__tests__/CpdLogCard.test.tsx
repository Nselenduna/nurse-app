import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import CpdLogCard from '../CpdLogCard';

// Mock the Ionicons component
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => 'Ionicons'
}));

describe('CpdLogCard', () => {
  // Sample test data
  const sampleLog = {
    id: '1',
    text: 'Test CPD activity with a longer description to test text truncation',
    category: 'Clinical Practice',
    hours: 2,
    createdAt: 1609459200000, // 2021-01-01
    isVoiceGenerated: true,
    tags: ['nursing', 'clinical', 'training', 'extra']
  };
  
  it('renders correctly with all props', () => {
    const { getByText, queryByText } = render(
      <CpdLogCard 
        log={sampleLog}
        onPress={jest.fn()}
        onDelete={jest.fn()}
        showActions={true}
      />
    );
    
    // Check if main content is displayed
    expect(getByText('Clinical Practice')).toBeTruthy();
    expect(getByText('2h')).toBeTruthy();
    expect(getByText(sampleLog.text)).toBeTruthy();
    
    // Check that tags are displayed (first 3 only)
    expect(getByText('nursing')).toBeTruthy();
    expect(getByText('clinical')).toBeTruthy();
    expect(getByText('training')).toBeTruthy();
    
    // Check that the +1 indicator is shown for extra tags
    expect(getByText('+1')).toBeTruthy();
    
    // Check that the date is formatted correctly
    expect(queryByText(/1 Jan 2021/)).toBeTruthy();
    
    // Check that voice input indicator is shown
    expect(queryByText(/Voice Input/)).toBeTruthy();
  });
  
  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <CpdLogCard 
        log={sampleLog}
        onPress={onPressMock}
      />
    );
    
    // Find the card by its text content and press it
    fireEvent.press(getByText(sampleLog.text));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
  
  it('calls onDelete when delete button is pressed', () => {
    const onDeleteMock = jest.fn();
    const { getByTestId } = render(
      <CpdLogCard 
        log={sampleLog}
        onDelete={onDeleteMock}
        showActions={true}
        testID="cpd-log-card"
      />
    );
    
    // Find the delete button and press it
    fireEvent.press(getByTestId('delete-button'));
    expect(onDeleteMock).toHaveBeenCalledWith(sampleLog.id);
  });
  
  it('does not show delete button when showActions is false', () => {
    const { queryByTestId } = render(
      <CpdLogCard 
        log={sampleLog}
        onDelete={jest.fn()}
        showActions={false}
        testID="cpd-log-card"
      />
    );
    
    // Check that delete button is not rendered
    expect(queryByTestId('delete-button')).toBeNull();
  });
  
  it('handles logs without tags', () => {
    const logWithoutTags = { ...sampleLog, tags: undefined };
    const { queryByText } = render(<CpdLogCard log={logWithoutTags} />);
    
    // Check that no tags are rendered
    expect(queryByText('nursing')).toBeNull();
    expect(queryByText('+1')).toBeNull();
  });
  
  it('is not pressable when onPress is not provided', () => {
    const { getByText } = render(
      <CpdLogCard 
        log={sampleLog}
      />
    );
    
    // Find the card and check its props
    const card = getByText(sampleLog.text).parent;
    expect(card.props.disabled).toBe(true);
  });
});
