export enum SeverityLevel {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical"
}

export interface MedicalAnalysis {
  transcription: string; // The Sesotho text transcribed from audio
  possible_condition: string; // Name of condition in Sesotho (English in brackets optional)
  severity: SeverityLevel;
  self_care_advice: string[]; // List of advice in Sesotho
  red_flags: string[]; // Warning signs in Sesotho
  doctor_recommendation: string; // When to see a doctor in Sesotho
}

export interface AudioState {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
}