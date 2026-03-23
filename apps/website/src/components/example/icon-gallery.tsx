"use client";

import {
  AdminMedsIcon,
  AllInboxIcon,
  ArrowBackwardIcon,
  ArrowDownIcon,
  ArrowDropDownIcon,
  ArrowDropUpIcon,
  ArrowForwardIcon,
  ArrowIOSBackwardIcon,
  ArrowIOSForwardIcon,
  ArrowUpIcon,
  AutoRenewIcon,
  BusinessMessagesIcon,
  CalculateIcon,
  CalendarMonthIcon,
  ChangeCircleIcon,
  CheckCircleIcon,
  CheckIcon,
  CheckIndeterminateSmallIcon,
  CheckbookIcon,
  CloseIcon,
  ContentCopyIcon,
  DeleteIcon,
  DirectionsRunIcon,
  DockToRightIcon,
  DocumentScannerIcon,
  DollarIcon,
  DomainIcon,
  DownloadIcon,
  EditDocumentIcon,
  EditNoteIcon,
  ExternalLinkIcon,
  FileSaveIcon,
  HospitalIcon,
  HubIcon,
  InfoIcon,
  KeyboardArrowDownIcon,
  LinkIcon,
  MedicationIcon,
  MenuIcon,
  MoreHorizIcon,
  NetworkNodeIcon,
  OpenInNewIcon,
  OutpatientMedIcon,
  PencilIcon,
  PercentIcon,
  PersonEditIcon,
  PersonIcon,
  PieChartIcon,
  PlugConnectIcon,
  PlusIcon,
  RefreshIcon,
  ReleaseAlertIcon,
  RemoveCircleIcon,
  SatelliteAltIcon,
  SearchIcon,
  SelectorIcon,
  SettingsBackupRestoreIcon,
  SettingsIcon,
  SideNavigationIcon,
  SpaceDashboardIcon,
  Stat1Icon,
  StatMinus1Icon,
  SupervisedUserCircleIcon,
  SystemUpdateIcon,
  TextSelectJumpToEndIcon,
  ThumbUpIcon,
  TrendingUpIcon,
  VerifiedIcon,
} from "@cocso-ui/react-icons";
import { Dropdown, toast, Typography } from "@cocso-ui/react";
import { ContentCopyIcon as CopyIcon } from "@cocso-ui/react-icons";
import type { ComponentType } from "react";
import { useCallback, useState } from "react";

interface IconEntry {
  name: string;
  Component: ComponentType<{ size?: number }>;
}

const allIcons: IconEntry[] = [
  { name: "ArrowBackward", Component: ArrowBackwardIcon },
  { name: "ArrowDown", Component: ArrowDownIcon },
  { name: "ArrowDropDown", Component: ArrowDropDownIcon },
  { name: "ArrowDropUp", Component: ArrowDropUpIcon },
  { name: "ArrowForward", Component: ArrowForwardIcon },
  { name: "ArrowIOSBackward", Component: ArrowIOSBackwardIcon },
  { name: "ArrowIOSForward", Component: ArrowIOSForwardIcon },
  { name: "ArrowUp", Component: ArrowUpIcon },
  { name: "KeyboardArrowDown", Component: KeyboardArrowDownIcon },
  { name: "SideNavigation", Component: SideNavigationIcon },
  { name: "Check", Component: CheckIcon },
  { name: "CheckCircle", Component: CheckCircleIcon },
  { name: "CheckIndeterminateSmall", Component: CheckIndeterminateSmallIcon },
  { name: "RemoveCircle", Component: RemoveCircleIcon },
  { name: "Verified", Component: VerifiedIcon },
  { name: "Close", Component: CloseIcon },
  { name: "Delete", Component: DeleteIcon },
  { name: "EditDocument", Component: EditDocumentIcon },
  { name: "EditNote", Component: EditNoteIcon },
  { name: "FileSave", Component: FileSaveIcon },
  { name: "Menu", Component: MenuIcon },
  { name: "MoreHoriz", Component: MoreHorizIcon },
  { name: "Pencil", Component: PencilIcon },
  { name: "Plus", Component: PlusIcon },
  { name: "Refresh", Component: RefreshIcon },
  { name: "Search", Component: SearchIcon },
  { name: "Selector", Component: SelectorIcon },
  { name: "ContentCopy", Component: ContentCopyIcon },
  { name: "ExternalLink", Component: ExternalLinkIcon },
  { name: "Link", Component: LinkIcon },
  { name: "OpenInNew", Component: OpenInNewIcon },
  { name: "Info", Component: InfoIcon },
  { name: "ReleaseAlert", Component: ReleaseAlertIcon },
  { name: "ChangeCircle", Component: ChangeCircleIcon },
  { name: "ThumbUp", Component: ThumbUpIcon },
  { name: "AdminMeds", Component: AdminMedsIcon },
  { name: "Hospital", Component: HospitalIcon },
  { name: "Medication", Component: MedicationIcon },
  { name: "OutpatientMed", Component: OutpatientMedIcon },
  { name: "BusinessMessages", Component: BusinessMessagesIcon },
  { name: "Person", Component: PersonIcon },
  { name: "PersonEdit", Component: PersonEditIcon },
  { name: "SupervisedUserCircle", Component: SupervisedUserCircleIcon },
  { name: "Domain", Component: DomainIcon },
  { name: "Checkbook", Component: CheckbookIcon },
  { name: "Calculate", Component: CalculateIcon },
  { name: "Dollar", Component: DollarIcon },
  { name: "Percent", Component: PercentIcon },
  { name: "PieChart", Component: PieChartIcon },
  { name: "TrendingUp", Component: TrendingUpIcon },
  { name: "Stat1", Component: Stat1Icon },
  { name: "StatMinus1", Component: StatMinus1Icon },
  { name: "CalendarMonth", Component: CalendarMonthIcon },
  { name: "AllInbox", Component: AllInboxIcon },
  { name: "DocumentScanner", Component: DocumentScannerIcon },
  { name: "Download", Component: DownloadIcon },
  { name: "Hub", Component: HubIcon },
  { name: "SpaceDashboard", Component: SpaceDashboardIcon },
  { name: "AutoRenew", Component: AutoRenewIcon },
  { name: "DirectionsRun", Component: DirectionsRunIcon },
  { name: "DockToRight", Component: DockToRightIcon },
  { name: "Settings", Component: SettingsIcon },
  { name: "SettingsBackupRestore", Component: SettingsBackupRestoreIcon },
  { name: "SystemUpdate", Component: SystemUpdateIcon },
  { name: "NetworkNode", Component: NetworkNodeIcon },
  { name: "PlugConnect", Component: PlugConnectIcon },
  { name: "SatelliteAlt", Component: SatelliteAltIcon },
  { name: "TextSelectJumpToEnd", Component: TextSelectJumpToEndIcon },
];

export default function IconGallery() {
  const [search, setSearch] = useState("");
  const filtered = allIcons.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  }, []);

  return (
    <div className="flex w-full flex-col gap-4">
      <input
        className="w-full cursor-text rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search icons..."
        type="text"
        value={search}
      />
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
        {filtered.map(({ name, Component }) => (
          <Dropdown key={name}>
            <Dropdown.Trigger
              render={
                <button
                  className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border border-neutral-100 bg-transparent p-3 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
                  type="button"
                >
                  <Component size={24} />
                  <Typography type="custom" className="w-full truncate text-center text-neutral-500" size={10}>
                    {name}
                  </Typography>
                </button>
              }
            />
            <Dropdown.Content>
              <Dropdown.Item
                onClick={() => handleCopy(`import { ${name}Icon } from "@cocso-ui/react-icons";`)}
                prefix={<CopyIcon size={14} />}
              >
                Import
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleCopy(`${name}Icon`)}
                prefix={<CopyIcon size={14} />}
              >
                Name
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        ))}
      </div>
      {filtered.length === 0 && (
        <Typography type="custom" className="py-8 text-center text-neutral-400" size={14}>
          No icons found matching "{search}"
        </Typography>
      )}
    </div>
  );
}
