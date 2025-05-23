import {
  ScenarioInfo,
  ScenarioNameListResponse,
  ScenarioInfoResponse,
} from '@/pages/flow-canvas/types/index.ts';
import { apiClient } from '@/common/service/apiClient.ts';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const getScenarioList = async (): Promise<string[]> => {
  const response: ScenarioNameListResponse = await apiClient.get('/apighost/scenario-list');
  return response.scenarioNameList;
};

export const getScenarioInfo = async (fileName: string): Promise<ScenarioInfo> => {
  const response: ScenarioInfoResponse = await apiClient.get('/apighost/scenario-info', {
    scenarioName: fileName,
  });
  return response.file;
};

export const exportScenario = async (
  scenario: ScenarioInfo,
): Promise<{
  status: boolean;
}> => {
  return await apiClient.post('/apighost/scenario-export', scenario);
};

export const scenarioTest = (name: string): EventSource => {
  const queryString = new URLSearchParams({ scenarioName: name }).toString();
  const fullUrl = `${baseUrl}/apighost/scenario-test?${queryString}`;
  return new EventSource(fullUrl);
};

export const scenarioDelete = async (fileName: string): Promise<boolean> => {
  const response: boolean = await apiClient.delete(`/apighost/file-remove/${fileName}`);
  return response;
};
