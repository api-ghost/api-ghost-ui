import { AppDispatch } from '@/store/index';
import { Field, MainTabType } from '@/pages/flow-canvas/types';
import { setSchema } from '@/store/slices/schemaEditorSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deepCloneWithValue } from '@/common/utils/deepCloneWithValue';

export const useSchemaEditor = (
  nodeId: string,
  initialRequest: Field[],
  initialResponse: Field[],
) => {
  const dispatch = useAppDispatch();
  const entry = useAppSelector(state => state.schemaEditor[nodeId]);
  const rawRequest = entry?.requestSchema ?? initialRequest;
  const rawResponse = entry?.responseSchema ?? initialResponse;
  const requestSchema: Field[] = deepCloneWithValue(rawRequest);
  const responseSchema: Field[] = deepCloneWithValue(rawResponse);

  const save = (type: MainTabType, schema: Field[]) =>
    dispatch(setSchema({ nodeId, type, schema }));

  return { requestSchema, responseSchema, save };
};
