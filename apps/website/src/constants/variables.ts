export const env = {
  posthog_key: process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
  posthog_host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
} as const;
