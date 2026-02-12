import { Select } from '@cocso-ui/react';

export default function SelectStretch() {
  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <Select stretch>
        <option value="">전체 너비 Select</option>
        <option value="1">옵션 1</option>
        <option value="2">옵션 2</option>
      </Select>
    </div>
  );
}
