"use client";

import { Accordion } from "@cocso-ui/react";

export default function AccordionNoChevron() {
  return (
    <div className="w-full max-w-md p-4">
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger chevron={false}>
              What is COCSO UI?
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            COCSO UI is a React component library built on Base UI with CSS
            Modules and design tokens.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger chevron={false}>
              Is it accessible?
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            Yes. Built on Base UI, all components follow WAI-ARIA patterns for
            keyboard navigation and screen reader support.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
