import axios from 'axios';

import { env } from '@/lib/utils/env';

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
});

type RetryConfig = {
  retryCount?: number;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetryConfig & typeof error.config;
    if (!config) {
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount ?? 0;
    if (config.retryCount >= 2) {
      return Promise.reject(error);
    }

    config.retryCount += 1;
    const delay = 300 * 2 ** (config.retryCount - 1);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return apiClient(config);
  },
);

export { apiClient };
