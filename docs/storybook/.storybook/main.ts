import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../../../packages/react/src/**/*.stories.@(ts|tsx)',
    '../../../packages/react-icons/src/**/*.stories.@(ts|tsx)',
  ],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: config => {
    config.plugins = [
      ...(config.plugins || []),
      {
        name: 'suppress-sourcemap-warning',
        configResolved(resolvedConfig) {
          const originalWarn = resolvedConfig.logger.warn;
          resolvedConfig.logger.warn = (msg, ...args) => {
            if (typeof msg === 'string' && msg.includes("Can't resolve original location of error")) {
              return;
            }
            originalWarn(msg, ...args);
          };
        },
      },
    ];
    config.build = {
      ...config.build,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        ...config.build?.rollupOptions,
        onwarn(warning, defaultHandler) {
          if (
            warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
            warning.message.includes('use client')
          ) {
            return;
          }
          defaultHandler(warning);
        },
      },
    };
    return config;
  },
};

export default config;
