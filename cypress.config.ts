import {defineConfig} from 'cypress';
import plugins from './cypress/plugins/index.js';

export default defineConfig({
  defaultCommandTimeout: 8000,
  video: false,
  experimentalMemoryManagement: true,
  projectId: 'biz82n', // Cypress Cloud
  e2e: {
    baseUrl: 'http://127.0.0.1:8087',
    setupNodeEvents (on, config) {
      return plugins(on, config);
    }
  }
});
