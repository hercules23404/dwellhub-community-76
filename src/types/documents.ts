
export type DocumentType = 
  | "Rent Agreement" 
  | "Aadhar Card" 
  | "PAN Card" 
  | "Utility Bill" 
  | "Other";

export const DOCUMENT_TYPES: DocumentType[] = [
  "Rent Agreement",
  "Aadhar Card",
  "PAN Card",
  "Utility Bill",
  "Other"
];

export interface UserDocument {
  id: string;
  user_id: string;
  document_type: DocumentType;
  document_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}
