import { useState, useEffect } from 'react';
import { Field } from '../types/affiliate';
import { FieldService } from '../services/storage/FieldService';

export function useFields() {
  const [fields, setFields] = useState<Field[]>(FieldService.getFields());

  useEffect(() => {
    const unsubscribe = FieldService.subscribe(setFields);
    return unsubscribe;
  }, []);

  return fields;
}

export function useAffiliateFields() {
  const fields = useFields();
  return fields.filter(f => f.section === 'affiliate');
}

export function useContactFields() {
  const fields = useFields();
  return fields.filter(f => f.section === 'contact');
}

export function usePlacementFields() {
  const fields = useFields();
  return fields.filter(f => f.section === 'placement');
}