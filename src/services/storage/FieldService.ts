import { 
  Field, 
  AffiliateField, 
  ContactField, 
  PlacementField,
  DEFAULT_AFFILIATE_FIELDS, 
  DEFAULT_CONTACT_FIELDS,
  DEFAULT_PLACEMENT_FIELDS,
  CustomFieldValue
} from '../../types/affiliate';

const FIELDS_STORAGE_KEY = 'custom_fields';
const FIELD_UPDATE_EVENT = 'FIELD_UPDATE';

export class FieldService {
  private static listeners: ((fields: Field[]) => void)[] = [];

  static subscribe(listener: (fields: Field[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners() {
    const fields = this.getFields();
    this.listeners.forEach(listener => listener(fields));
    // Dispatch event for components that can't use subscribe
    window.dispatchEvent(new CustomEvent(FIELD_UPDATE_EVENT, { detail: fields }));
  }

  static getFields(): Field[] {
    try {
      const savedFields = localStorage.getItem(FIELDS_STORAGE_KEY);
      const customFields = savedFields ? JSON.parse(savedFields) : [];
      return [
        ...DEFAULT_AFFILIATE_FIELDS, 
        ...DEFAULT_CONTACT_FIELDS, 
        ...DEFAULT_PLACEMENT_FIELDS,
        ...customFields
      ];
    } catch (error) {
      console.error('Error getting fields:', error);
      return [
        ...DEFAULT_AFFILIATE_FIELDS, 
        ...DEFAULT_CONTACT_FIELDS,
        ...DEFAULT_PLACEMENT_FIELDS
      ];
    }
  }

  static addField(field: Omit<Field, 'id' | 'order'>): Field {
    try {
      const fields = this.getFields();
      const sectionFields = fields.filter(f => f.section === field.section);
      
      const newField: Field = {
        ...field,
        id: Math.random().toString(36).substr(2, 9),
        order: sectionFields.length
      };

      const customFields = fields.filter(f => 
        !DEFAULT_AFFILIATE_FIELDS.find(def => def.id === f.id) &&
        !DEFAULT_CONTACT_FIELDS.find(def => def.id === f.id) &&
        !DEFAULT_PLACEMENT_FIELDS.find(def => def.id === f.id)
      );

      localStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify([...customFields, newField]));
      this.notifyListeners();
      return newField;
    } catch (error) {
      console.error('Error adding field:', error);
      throw new Error('Failed to add custom field');
    }
  }

  static updateField(field: Field): void {
    try {
      const fields = this.getFields();
      const customFields = fields.filter(f => 
        !DEFAULT_AFFILIATE_FIELDS.find(def => def.id === f.id) &&
        !DEFAULT_CONTACT_FIELDS.find(def => def.id === f.id) &&
        !DEFAULT_PLACEMENT_FIELDS.find(def => def.id === f.id)
      );

      const updatedFields = customFields.map(f => 
        f.id === field.id ? field : f
      );

      localStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(updatedFields));
      this.notifyListeners();
    } catch (error) {
      console.error('Error updating field:', error);
      throw new Error('Failed to update custom field');
    }
  }

  static deleteField(fieldId: string): void {
    try {
      const fields = this.getFields();
      const customFields = fields.filter(f => 
        !DEFAULT_AFFILIATE_FIELDS.find(def => def.id === f.id) &&
        !DEFAULT_CONTACT_FIELDS.find(def => def.id === f.id) &&
        !DEFAULT_PLACEMENT_FIELDS.find(def => def.id === f.id)
      );

      const updatedFields = customFields.filter(f => f.id !== fieldId);
      localStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(updatedFields));
      this.notifyListeners();
    } catch (error) {
      console.error('Error deleting field:', error);
      throw new Error('Failed to delete custom field');
    }
  }

  static getAffiliateFields(): AffiliateField[] {
    return this.getFields().filter(f => f.section === 'affiliate') as AffiliateField[];
  }

  static getContactFields(): ContactField[] {
    return this.getFields().filter(f => f.section === 'contact') as ContactField[];
  }

  static getPlacementFields(): PlacementField[] {
    return this.getFields().filter(f => f.section === 'placement') as PlacementField[];
  }

  static getFieldById(fieldId: string): Field | undefined {
    return this.getFields().find(f => f.id === fieldId);
  }

  static formatFieldValue(value: any, type: Field['type']): string {
    if (value == null) return '';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(Number(value));
      case 'number':
        return new Intl.NumberFormat().format(Number(value));
      case 'date':
        return new Date(value).toLocaleDateString();
      default:
        return String(value);
    }
  }

  static validateFieldValue(value: any, type: Field['type']): boolean {
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'url':
        try {
          new URL(value.startsWith('http') ? value : `https://${value}`);
          return true;
        } catch {
          return false;
        }
      case 'phone':
        return /^[\d\s\-\+\(\)]+$/.test(value);
      case 'number':
      case 'currency':
        return !isNaN(Number(value));
      case 'date':
        return !isNaN(Date.parse(value));
      default:
        return true;
    }
  }
}