import { Select } from '@cocso-ui/react';

export default function SelectDefault() {
  return (
    <Select>
      <option value="">선택하세요</option>
      <option value="1">옵션 1</option>
      <option value="2">옵션 2</option>
      <option value="3">옵션 3</option>
    </Select>
  );
}
