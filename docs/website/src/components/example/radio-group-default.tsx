'use client';

import { RadioGroup } from '@cocso-ui/react';
import { useState } from 'react';

export default function RadioGroupDefault() {
  const [value, setValue] = useState('option-1');

  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RadioGroup.Item value="option-1" id="option-1">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <label htmlFor="option-1">옵션 1</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RadioGroup.Item value="option-2" id="option-2">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <label htmlFor="option-2">옵션 2</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RadioGroup.Item value="option-3" id="option-3">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <label htmlFor="option-3">옵션 3</label>
        </div>
      </div>
    </RadioGroup>
  );
}
