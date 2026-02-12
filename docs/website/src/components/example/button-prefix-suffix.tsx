import { Button } from '@cocso-ui/react';
import { PlusIcon, ArrowIOSForwardIcon } from '@cocso-ui/react-icons';

export default function ButtonPrefixSuffix() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button prefix={<PlusIcon />}>Prefix</Button>
      <Button suffix={<ArrowIOSForwardIcon />}>Suffix</Button>
      <Button prefix={<PlusIcon />} suffix={<ArrowIOSForwardIcon />}>Both</Button>
    </div>
  );
}
