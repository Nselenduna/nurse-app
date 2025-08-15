/**
 * Constants for voice input simulation
 * Used for mocking voice recording functionality in development
 */

/**
 * Time (in ms) to simulate voice recording and processing
 */
export const VOICE_SIMULATION = {
  /**
   * Delay between starting recording and completing transcription
   */
  processingDelay: 2000,
  
  /**
   * Alert titles for voice operations
   */
  alerts: {
    /**
     * Title for successful voice processing
     */
    successTitle: 'Voice Input',
    
    /**
     * Message for successful voice processing
     */
    successMessage: 'Voice input processed successfully!',
    
    /**
     * Title for voice processing error
     */
    errorTitle: 'Voice Error',
    
    /**
     * Message for voice processing error
     */
    errorMessage: 'Failed to process voice input. Please try again.',
  },
} as const;

/**
 * Sample voice transcription texts for simulation
 * Used to provide realistic mock data during development
 */
export const VOICE_SAMPLES = {
  /**
   * Clinical practice samples
   */
  clinical: [
    "Attended advanced life support training session covering latest resuscitation guidelines",
    "Participated in clinical skills workshop on wound care and dressing techniques",
    "Completed online module on medication administration safety protocols"
  ],
  
  /**
   * Leadership samples
   */
  leadership: [
    "Led team meeting on improving patient handover procedures between shifts",
    "Participated in professional development workshop on conflict resolution strategies",
    "Mentored junior staff member on clinical documentation standards"
  ],
  
  /**
   * Research samples
   */
  research: [
    "Reviewed latest research on infection prevention in clinical settings",
    "Participated in journal club discussing evidence-based practice for pain management",
    "Conducted literature review on patient outcomes in critical care settings"
  ]
} as const;

/**
 * Gets a random voice sample from all categories
 * 
 * @returns {string} A randomly selected sample transcription
 */
export function getRandomVoiceSample(): string {
  const allSamples = [
    ...VOICE_SAMPLES.clinical,
    ...VOICE_SAMPLES.leadership,
    ...VOICE_SAMPLES.research
  ];
  
  return allSamples[Math.floor(Math.random() * allSamples.length)];
}
