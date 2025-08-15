describe('Export Feature', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate to settings and export data', async () => {
    // Navigate to login screen and log in
    await element(by.text('Login to Portal')).tap();
    
    // Wait for dashboard to load
    await waitFor(element(by.text('CPD Dashboard')))
      .toBeVisible()
      .withTimeout(5000);
    
    // Navigate to settings tab
    await element(by.text('Settings')).tap();
    
    // Wait for settings screen to load
    await waitFor(element(by.text('Export Data')))
      .toBeVisible()
      .withTimeout(2000);
    
    // Tap export button
    await element(by.text('Export Data')).tap();
    
    // Wait for export options to appear
    await waitFor(element(by.text('Export as JSON')))
      .toBeVisible()
      .withTimeout(2000);
    
    // Choose JSON export
    await element(by.text('Export as JSON')).tap();
    
    // Verify success message appears
    await waitFor(element(by.text('Export Successful')))
      .toBeVisible()
      .withTimeout(5000);
    
    // Check that file path is shown
    await expect(element(by.text(/File saved to/)))
      .toBeVisible();
  });

  it('should handle export errors gracefully', async () => {
    // Mock a failure condition (this would be implemented in the app's test mode)
    await device.launchApp({
      newInstance: true,
      launchArgs: { FORCE_EXPORT_FAILURE: 'true' },
    });
    
    // Navigate to login screen and log in
    await element(by.text('Login to Portal')).tap();
    
    // Wait for dashboard to load and navigate to settings
    await waitFor(element(by.text('CPD Dashboard')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.text('Settings')).tap();
    
    // Tap export button
    await element(by.text('Export Data')).tap();
    await element(by.text('Export as JSON')).tap();
    
    // Verify error message appears
    await waitFor(element(by.text('Export Failed')))
      .toBeVisible()
      .withTimeout(2000);
    
    // Check that error details are shown
    await expect(element(by.text(/Unable to export data/)))
      .toBeVisible();
  });

  it('should be accessible to screen readers', async () => {
    // Navigate to settings
    await element(by.text('Login to Portal')).tap();
    await waitFor(element(by.text('CPD Dashboard')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.text('Settings')).tap();
    
    // Verify export button has proper accessibility label
    await expect(element(by.label('Export your CPD data')))
      .toBeVisible();
    
    // Tap export button
    await element(by.label('Export your CPD data')).tap();
    
    // Verify export options have proper accessibility labels
    await expect(element(by.label('Export as JSON file')))
      .toBeVisible();
    await expect(element(by.label('Export as PDF file')))
      .toBeVisible();
    
    // Choose JSON export
    await element(by.label('Export as JSON file')).tap();
    
    // Verify success message is accessible
    await waitFor(element(by.label('Export completed successfully')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
