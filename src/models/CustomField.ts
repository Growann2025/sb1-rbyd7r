export type FieldType = 'text' | 'number' | 'date' | 'email' | 'phone' | 'url' | 'currency';
export type FieldSection = 'affiliate' | 'contact' | 'placement';

export interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  order: number;
  section: FieldSection;
  options?: string[];
}

export interface CustomFieldValue {
  fieldId: string;
  value: string | number | Date;
}