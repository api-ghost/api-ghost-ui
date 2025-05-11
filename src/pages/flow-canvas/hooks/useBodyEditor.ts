import { useState, useCallback } from 'react';
import { Field } from '@/pages/flow-canvas/types/index';
import { deepCloneWithValue } from '@/common/utils/deepCloneWithValue';

/**
 * Hook for managing schema editing state.
 * @param initialSchema - initial Field[] array
 */
export const useBodyEditor = (initialSchema: Field[]) => {
  const [currentSchema, setCurrentSchema] = useState<Field[]>(() =>
    deepCloneWithValue(initialSchema),
  );

  const updateSchema = useCallback((newSchema: Field[]) => {
    setCurrentSchema(newSchema);
  }, []);
  return { currentSchema, updateSchema };
};
