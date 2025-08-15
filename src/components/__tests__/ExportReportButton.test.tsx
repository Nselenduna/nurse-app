import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as FileSystem from 'expo-file-system';
import React from 'react';
import { Alert, Share } from 'react-native';
import { useCpd } from '../../hooks/useCpd';

// Mock the useCpd hook
jest.mock('../../hooks/useCpd');
jest.mock('expo-file-system');
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));
jest.mock('react-native/Libraries/Share/Share', () => ({
  share: jest.fn(),
}));

// Create a simple ExportReportButton component for testing
// This would typically be in its own file
const ExportReportButton = ({ 
  format = 'json',
  onSuccess = () => {},
  accessibilityLabel = 'Export data',
  testID = 'export-button'
}) => {
  const { exportData, loading } = useCpd();
  
  const handleExport = async () => {
    try {
      // Get data from the hook
      const data = await exportData();
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `cpd_export_${timestamp}.${format}`;
      const filePath = `${FileSystem.documentDirectory}${filename}`;
      
      if (format === 'json') {
        // Save JSON directly
        await FileSystem.writeAsStringAsync(filePath, data);
      } else if (format === 'pdf') {
        // Mock PDF generation (in a real app, would use a PDF library)
        // Convert the JSON data to PDF format
        const pdfContent = `PDF content generated from: ${data.substring(0, 50)}...`;
        await FileSystem.writeAsStringAsync(filePath, pdfContent);
      }
      
      // Share the file
      await Share.share({
        url: filePath,
        title: `CPD ${format.toUpperCase()} Export`,
        message: `Here is your CPD data export in ${format.toUpperCase()} format.`,
      });
      
      // Announce for accessibility
      if (global.AccessibilityInfo?.announceForAccessibility) {
        global.AccessibilityInfo.announceForAccessibility(
          `Export completed. File saved as ${filename}`
        );
      }
      
      onSuccess(filePath);
    } catch (error) {
      Alert.alert(
        'Export Failed',
        `Unable to export data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    }
  };
  
  return (
    <button
      onPress={handleExport}
      disabled={loading}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={`Exports your CPD data as a ${format.toUpperCase()} file`}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: loading }}
      testID={testID}
    >
      {loading ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
    </button>
  );
};

describe('ExportReportButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the useCpd hook implementation
    (useCpd as jest.Mock).mockReturnValue({
      exportData: jest.fn().mockResolvedValue(JSON.stringify({
        exportDate: new Date().toISOString(),
        logs: [{ id: '1', text: 'Test log', category: 'Clinical Practice', hours: 2, createdAt: Date.now(), isVoiceGenerated: false }],
        statistics: { totalHours: 2, totalActivities: 1 }
      })),
      loading: false,
    });
    
    // Mock FileSystem functions
    FileSystem.documentDirectory = 'file://test-directory/';
    FileSystem.writeAsStringAsync = jest.fn().mockResolvedValue(undefined);
    
    // Mock Share.share
    Share.share = jest.fn().mockResolvedValue({ action: 'sharedAction' });
    
    // Mock AccessibilityInfo
    global.AccessibilityInfo = {
      announceForAccessibility: jest.fn(),
      isScreenReaderEnabled: jest.fn().mockResolvedValue(true),
    };
  });
  
  it('should export JSON data when pressed', async () => {
    const onSuccess = jest.fn();
    const { getByTestId } = render(
      <ExportReportButton format="json" onSuccess={onSuccess} />
    );
    
    // Press the export button
    fireEvent.press(getByTestId('export-button'));
    
    // Wait for async operations to complete
    await waitFor(() => {
      // Verify exportData was called
      expect(useCpd().exportData).toHaveBeenCalled();
      
      // Verify file was written
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        expect.stringMatching(/file:\/\/test-directory\/cpd_export_.*\.json/),
        expect.any(String)
      );
      
      // Verify sharing was triggered
      expect(Share.share).toHaveBeenCalledWith(expect.objectContaining({
        url: expect.stringMatching(/file:\/\/test-directory\/cpd_export_.*\.json/),
        title: 'CPD JSON Export',
      }));
      
      // Verify accessibility announcement
      expect(global.AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
        expect.stringMatching(/Export completed. File saved as cpd_export_.*\.json/)
      );
      
      // Verify success callback
      expect(onSuccess).toHaveBeenCalledWith(
        expect.stringMatching(/file:\/\/test-directory\/cpd_export_.*\.json/)
      );
    });
  });
  
  it('should export PDF data when format is pdf', async () => {
    const { getByTestId } = render(
      <ExportReportButton format="pdf" />
    );
    
    // Press the export button
    fireEvent.press(getByTestId('export-button'));
    
    // Wait for async operations to complete
    await waitFor(() => {
      // Verify file was written with PDF content
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        expect.stringMatching(/file:\/\/test-directory\/cpd_export_.*\.pdf/),
        expect.stringContaining('PDF content generated from:')
      );
      
      // Verify sharing was triggered with PDF title
      expect(Share.share).toHaveBeenCalledWith(expect.objectContaining({
        title: 'CPD PDF Export',
      }));
    });
  });
  
  it('should handle export errors gracefully', async () => {
    // Mock exportData to throw an error
    (useCpd as jest.Mock).mockReturnValue({
      exportData: jest.fn().mockRejectedValue(new Error('Export failed')),
      loading: false,
    });
    
    const { getByTestId } = render(
      <ExportReportButton />
    );
    
    // Press the export button
    fireEvent.press(getByTestId('export-button'));
    
    // Wait for async operations to complete
    await waitFor(() => {
      // Verify Alert was shown
      expect(Alert.alert).toHaveBeenCalledWith(
        'Export Failed',
        'Unable to export data: Export failed',
        expect.anything()
      );
      
      // Verify file was not written
      expect(FileSystem.writeAsStringAsync).not.toHaveBeenCalled();
      
      // Verify sharing was not triggered
      expect(Share.share).not.toHaveBeenCalled();
    });
  });
  
  it('should show loading state during export', async () => {
    // Create a mock that doesn't resolve immediately
    let resolveExport: (value: string) => void;
    const exportPromise = new Promise<string>(resolve => {
      resolveExport = resolve;
    });
    
    // Mock the hook with the pending promise
    (useCpd as jest.Mock).mockReturnValue({
      exportData: jest.fn().mockReturnValue(exportPromise),
      loading: true,
    });
    
    const { getByTestId, getByText } = render(
      <ExportReportButton />
    );
    
    // Button should show loading state
    expect(getByText('Exporting...')).toBeTruthy();
    
    // Button should be disabled
    const button = getByTestId('export-button');
    expect(button.props.disabled).toBe(true);
    expect(button.props.accessibilityState.busy).toBe(true);
    expect(button.props.accessibilityState.disabled).toBe(true);
    
    // Resolve the export promise
    resolveExport!(JSON.stringify({ logs: [] }));
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
    });
  });
  
  it('should have proper accessibility attributes', () => {
    const { getByTestId } = render(
      <ExportReportButton accessibilityLabel="Export CPD data" />
    );
    
    const button = getByTestId('export-button');
    expect(button.props.accessibilityLabel).toBe('Export CPD data');
    expect(button.props.accessibilityHint).toBe('Exports your CPD data as a JSON file');
    expect(button.props.accessibilityRole).toBe('button');
  });
  
  it('should handle file system errors during export', async () => {
    // Mock FileSystem.writeAsStringAsync to throw an error
    FileSystem.writeAsStringAsync = jest.fn().mockRejectedValue(
      new Error('Disk full')
    );
    
    const { getByTestId } = render(
      <ExportReportButton />
    );
    
    // Press the export button
    fireEvent.press(getByTestId('export-button'));
    
    // Wait for async operations to complete
    await waitFor(() => {
      // Verify Alert was shown with the correct error
      expect(Alert.alert).toHaveBeenCalledWith(
        'Export Failed',
        'Unable to export data: Disk full',
        expect.anything()
      );
      
      // Verify sharing was not triggered
      expect(Share.share).not.toHaveBeenCalled();
    });
  });
});
