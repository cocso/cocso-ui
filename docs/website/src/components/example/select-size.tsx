import { Select } from '@cocso-ui/react';

export default function SelectSize() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <Select size="xs">
        <option>XSmall</option>
      </Select>
      <Select size="sm">
        <option>Small</option>
      </Select>
      <Select size="md">
        <option>Medium</option>
      </Select>
      <Select size="lg">
        <option>Large</option>
      </Select>
      <Select size="xl">
        <option>XLarge</option>
      </Select>
    </div>
  );
}
