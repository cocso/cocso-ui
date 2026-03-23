"use client";

import { Button, Dropdown } from "@cocso-ui/react";
import { ContentCopyIcon, DeleteIcon, MoreHorizIcon, PencilIcon } from "@cocso-ui/react-icons";

export default function DropdownDefault() {
  return (
    <div className="p-4">
      <Dropdown>
        <Dropdown.Trigger render={<Button variant="secondary" svgOnly><MoreHorizIcon size={18} /></Button>} />
        <Dropdown.Content>
          <Dropdown.Item prefix={<PencilIcon size={16} />}>Edit</Dropdown.Item>
          <Dropdown.Item prefix={<ContentCopyIcon size={16} />}>Duplicate</Dropdown.Item>
          <Dropdown.Item prefix={<DeleteIcon size={16} />}>Delete</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}
