/**
 * Constants for voice input simulation
 * Used for mocking voice recording functionality in development
 */

/**
 * Time (in ms) to simulate voice recording and processing
 */
export const VOICE_SIMULATION = {
  processingDelay: 2000, // 2 seconds to simulate voice processing
  alerts: {
    successTitle: 'Voice Input',
    successMessage: 'Voice input processed successfully!',
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
    "Participated in clinical audit meeting reviewing patient safety protocols",
    "Completed online module on infection prevention and control measures",
    "Mentored junior staff member on clinical documentation standards",
    "Attended professional development workshop on leadership skills",
    "Conducted research on patient outcomes in critical care settings",
    "Led quality improvement initiative for medication safety",
    "Participated in interprofessional education session on communication skills",
    "Completed mandatory training on safeguarding vulnerable adults",
    "Attended conference on evidence-based practice in nursing",
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
