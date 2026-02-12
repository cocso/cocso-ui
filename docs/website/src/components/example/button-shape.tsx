import { Button } from '@cocso-ui/react';
import { PlusIcon } from '@cocso-ui/react-icons';

export default function ButtonShape() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button shape="square">Square</Button>
      <Button shape="rounded">Rounded</Button>
      <Button shape="circle" svgOnly aria-label="추가"><PlusIcon /></Button>
    </div>
  );
}
