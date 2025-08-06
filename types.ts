
export interface EvolutionNote {
  date: string;
  note: string;
}

export interface Patient {
  id: string;
  clinicalHistoryNumber: string;
  name:string;
  dateOfBirth: string; // Changed from age
  address: string;
  insurance: string;
  mentalHealthHistory: string;
  baselineSituation: string;
  substanceUse: string;
  treatmentHistory: EvolutionNote[];
  consultationHistory: EvolutionNote[];
}

export interface Appointment {
  id: string;
  psychiatristId: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export interface Psychiatrist {
  id: string;
  name: string;
  specialty: string; // Added field
}
