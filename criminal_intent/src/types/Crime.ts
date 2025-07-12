export interface Crime {
  id: string;
  title: string;
  details: string;
  date: Date;
  isSolved: boolean;
  photoUri?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrimeFormData {
  title: string;
  details: string;
  date: Date;
  isSolved: boolean;
  photoUri?: string;
}