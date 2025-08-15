/**
 * Represents a Continuing Professional Development log entry
 * 
 * @interface CpdLog
 * @property {string} id - Unique identifier for the log
 * @property {string} text - Main content/description of the CPD activity
 * @property {string} category - Category of the CPD activity
 * @property {number} hours - Number of hours spent on the activity
 * @property {number} createdAt - Timestamp when the log was created (milliseconds since epoch)
 * @property {boolean} isVoiceGenerated - Whether the log was created using voice input
 * @property {string[]} [tags] - Optional tags for categorizing the log
 * @property {string} [reflection] - Optional reflection on the learning experience
 * @property {number} [updatedAt] - Timestamp when the log was last updated
 */
export interface CpdLog {
  id: string;
  text: string;
  category: string;
  hours: number;
  createdAt: number;
  isVoiceGenerated: boolean;
  tags?: string[];
  reflection?: string;
  updatedAt?: number;
}

/**
 * Represents a voice recording for CPD logging
 * 
 * @interface VoiceRecording
 * @property {string} id - Unique identifier for the recording
 * @property {string} audioUri - URI pointing to the audio file
 * @property {string} transcript - Transcribed text from the recording
 * @property {number} duration - Length of the recording in seconds
 * @property {number} createdAt - Timestamp when the recording was created
 * @property {'recording' | 'processing' | 'completed' | 'error'} status - Current status of the recording
 */
export interface VoiceRecording {
  id: string;
  audioUri: string;
  transcript: string;
  duration: number;
  createdAt: number;
  status: 'recording' | 'processing' | 'completed' | 'error';
}

/**
 * Represents an NMC form for various professional documentation
 * 
 * @interface NmcForm
 * @property {string} id - Unique identifier for the form
 * @property {'revalidation' | 'practice_log' | 'reflection'} type - Type of NMC form
 * @property {string} title - Title of the form
 * @property {FormField[]} fields - Array of form fields
 * @property {Record<string, any>} data - Form data as key-value pairs
 * @property {number} createdAt - Timestamp when the form was created
 * @property {number} updatedAt - Timestamp when the form was last updated
 */
export interface NmcForm {
  id: string;
  type: 'revalidation' | 'practice_log' | 'reflection';
  title: string;
  fields: FormField[];
  data: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

/**
 * Represents a field in an NMC form
 * 
 * @interface FormField
 * @property {string} id - Unique identifier for the field
 * @property {string} label - Display label for the field
 * @property {'text' | 'textarea' | 'select' | 'date' | 'number'} type - Type of form field
 * @property {boolean} required - Whether the field is required
 * @property {string[]} [options] - Options for select fields
 * @property {string} [placeholder] - Placeholder text for the field
 */
export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

/**
 * Represents a learning resource or material
 * 
 * @interface LearningMaterial
 * @property {string} id - Unique identifier for the material
 * @property {string} title - Title of the learning material
 * @property {string} description - Description of the content
 * @property {string} category - Category of the material
 * @property {'beginner' | 'intermediate' | 'advanced'} difficulty - Difficulty level
 * @property {number} duration - Estimated time to complete in minutes
 * @property {string[]} tags - Tags for categorizing the material
 * @property {string[]} nmcPillars - NMC pillars covered by the material
 */
export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  tags: string[];
  nmcPillars: string[];
}

/**
 * Represents a user's professional profile
 * 
 * @interface UserProfile
 * @property {string} id - Unique identifier for the user
 * @property {string} name - Full name of the user
 * @property {string} nmcNumber - NMC registration number
 * @property {string} speciality - Nursing/midwifery speciality
 * @property {string} revalidationDate - Date when revalidation is due
 * @property {number} targetHours - Target CPD hours for revalidation
 * @property {number} completedHours - Completed CPD hours
 */
export interface UserProfile {
  id: string;
  name: string;
  nmcNumber: string;
  speciality: string;
  revalidationDate: string;
  targetHours: number;
  completedHours: number;
}

/**
 * Valid categories for CPD activities
 * Based on NMC revalidation guidelines
 * 
 * @typedef {string} CpdCategory
 */
export type CpdCategory = 
  | 'Clinical Practice'
  | 'Leadership & Management'
  | 'Education & Training'
  | 'Research & Development'
  | 'Quality Improvement'
  | 'Professional Development';

/**
 * The four pillars of the NMC Code
 * Used for categorizing professional standards
 * 
 * @typedef {string} NmcPillar
 */
export type NmcPillar = 
  | 'Prioritise People'
  | 'Practise Effectively'
  | 'Preserve Safety'
  | 'Promote Professionalism and Trust';
