import { Snapshot, HttpReqDuration, EndpointResult } from '@/pages/loadtest/types';
import { CHART_OPTIONS } from '@/pages/loadtest/config/chartJS';

export interface ParsedSnapshot {
  timestamp: string;
  vus: number;
  rps: number;
  failRate: number;
  checksRate: number;
  avgDuration: number;
  maxDuration: number;
  minDuration: number;
  medDuration: number;
  p90Duration: number;
  p95Duration: number;
}

export const parseSnapshot = (snapshot: Snapshot): ParsedSnapshot => {
  const result = snapshot.result;
  const httpDuration = result.http_req_duration;

  return {
    timestamp: formatTimestamp(snapshot.timeStamp),
    vus: result.vus,
    rps: result.http_reqs.rate,
    failRate: result.http_req_failed.rate,
    checksRate: 0,
    avgDuration: httpDuration.avg,
    maxDuration: httpDuration.max,
    minDuration: httpDuration.min,
    medDuration: httpDuration.med,
    p90Duration: httpDuration['p(90)'],
    p95Duration: httpDuration['p(95)'],
  };
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

export const getDoughnutChartData = (snapshot: Snapshot) => {
  const result = snapshot.result;
  const success = result.http_reqs.count - result.http_req_failed.fail;
  const failure = result.http_req_failed.fail;

  return {
    labels: ['Success', 'Failure'],
    datasets: [
      {
        data: [success, failure],
        backgroundColor: CHART_OPTIONS.doughnut.color.backgroundColor,
        hoverBackgroundColor: CHART_OPTIONS.doughnut.color.hoverBackgroundColor,
        borderWidth: 1,
      },
    ],
  };
};

export const getBarChartData = (duration: HttpReqDuration | undefined) => {
  if (!duration) return;
  return {
    labels: ['Min', 'Median', 'P90', 'P95', 'Max'],
    datasets: [
      {
        label: 'Response Time (ms)',
        data: [duration.min, duration.med, duration['p(90)'], duration['p(95)'], duration.max],
        backgroundColor: CHART_OPTIONS.bar.color.backgroundColor,
        borderColor: CHART_OPTIONS.bar.color.borderColor,
        borderWidth: 1,
      },
    ],
  };
};

export const getLineChartData = (metricType: string, timeline: ParsedSnapshot[]) => {
  const labels = timeline.map(item => item.timestamp);
  const tension = 0.4;

  switch (metricType) {
    case 'vus':
      return {
        labels,
        datasets: [
          {
            label: 'Virtual Users',
            data: timeline.map(item => item.vus),
            borderColor: CHART_OPTIONS.line.color.vus.color,
            backgroundColor: CHART_OPTIONS.line.color.vus.bg,
            tension,
            fill: true,
          },
          {
            label: 'Requests Per Second',
            data: timeline.map(item => item.rps),
            borderColor: CHART_OPTIONS.line.color.rps.color,
            backgroundColor: CHART_OPTIONS.line.color.rps.bg,
            tension,
            fill: true,
          },
        ],
      };

    case 'errorRate':
      return {
        labels,
        datasets: [
          {
            label: 'Error Rate',
            data: timeline.map(item => item.failRate * 100), // Convert to percentage
            borderColor: CHART_OPTIONS.line.color.errorRate.color,
            backgroundColor: CHART_OPTIONS.line.color.errorRate.bg,
            tension,
            fill: true,
          },
          {
            label: 'Checks Rate',
            data: timeline.map(item => item.checksRate),
            borderColor: CHART_OPTIONS.line.color.checksRate.color,
            backgroundColor: CHART_OPTIONS.line.color.checksRate.bg,
            tension,
            fill: true,
          },
        ],
      };

    case 'avgDuration':
      return {
        labels,
        datasets: [
          {
            label: 'Avg Duration',
            data: timeline.map(item => item.avgDuration),
            borderColor: CHART_OPTIONS.line.color.durations.avg,
            backgroundColor: 'transparent',
            tension,
          },
          {
            label: 'Median',
            data: timeline.map(item => item.medDuration),
            borderColor: CHART_OPTIONS.line.color.durations.med,
            backgroundColor: 'transparent',
            tension,
          },
          {
            label: 'P90',
            data: timeline.map(item => item.p90Duration),
            borderColor: CHART_OPTIONS.line.color.durations.p90,
            backgroundColor: 'transparent',
            tension,
          },
          {
            label: 'P95',
            data: timeline.map(item => item.p95Duration),
            borderColor: CHART_OPTIONS.line.color.durations.p95,
            backgroundColor: 'transparent',
            tension,
          },
        ],
      };

    default:
      return {
        labels,
        datasets: [],
      };
  }
};

// Optional: Function to compute metrics for specific endpoints
export const getEndpointMetrics = (endpointResultMap: Record<string, EndpointResult[]>) => {
  const endpoints = Object.keys(endpointResultMap);

  return endpoints.map(endpoint => {
    const results = endpointResultMap[endpoint];
    const lastResult = results[results.length - 1];

    return {
      url: endpoint,
      requests: lastResult.http_reqs.count,
      failRate: lastResult.http_req_failed.rate * 100,
      minDuration: lastResult.http_req_duration.min,
      maxDuration: lastResult.http_req_duration.max,
      medDuration: lastResult.http_req_duration.med,
      avgDuration: lastResult.http_req_duration.avg,
      p90: lastResult.http_req_duration['p(90)'],
      p95: lastResult.http_req_duration['p(95)'],
    };
  });
};
