import posthog from 'posthog-js';
import { env } from '~/constants/variables';

posthog.init(env.posthog_key, {
  api_host: env.posthog_host,
  defaults: '2025-05-24',
});
