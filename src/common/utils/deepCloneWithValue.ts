import { Field } from '@/pages/flow-canvas/types';

export const deepCloneWithValue = (fields: Field[]): Field[] => {
  return fields.map(f => {
    const result: Field = {
      type: f.type,
      name: f.name,
      value: (f as any).value ?? 'empty',
    };

    if (f.nestedFields) {
      result.nestedFields = deepCloneWithValue(f.nestedFields);
    }

    return result;
  });
};
