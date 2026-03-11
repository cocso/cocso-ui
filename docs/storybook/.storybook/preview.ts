import "../globals.css";
import "@cocso-ui/css/token.css";
import "@cocso-ui/react/styles.css";

import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "dark", value: "#0a0a0a" },
        { name: "light", value: "#ffffff" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
