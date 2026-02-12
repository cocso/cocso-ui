import { Accordion } from '@cocso-ui/react';

export default function AccordionDefault() {
  return (
    <Accordion type="single" collapsible style={{ width: '100%', maxWidth: 400 }}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>항목 1</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>항목 1의 내용입니다.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>항목 2</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>항목 2의 내용입니다.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Header>
          <Accordion.Trigger>항목 3</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>항목 3의 내용입니다.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}
