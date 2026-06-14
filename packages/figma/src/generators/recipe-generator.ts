import { generateAlertSection } from "./components/alert";
import { generateAvatarSection } from "./components/avatar";
import { generateBadgeSection } from "./components/badge";
import { generateBreadcrumbSection } from "./components/breadcrumb";
import { generateButtonSection } from "./components/button";
import { generateCardSection } from "./components/card";
import { generateCheckboxSection } from "./components/checkbox";
import { generateDialogSection } from "./components/dialog";
import { generateInputSection } from "./components/input";
import { generateLinkSection } from "./components/link";
import { generatePaginationSection } from "./components/pagination";
import { generateProgressSection } from "./components/progress";
import { generateRadioSection } from "./components/radio";
import { generateSelectSection } from "./components/select";
import { generateSkeletonSection } from "./components/skeleton";
import { generateSpinnerSection } from "./components/spinner";
import { generateStockQuantityStatusSection } from "./components/stock-quantity-status";
import { generateSwitchSection } from "./components/switch";
import { generateTypographySection } from "./components/typography";

const generators: Array<(container: FrameNode) => void> = [
  generateButtonSection,
  generateAvatarSection,
  generateBadgeSection,
  generateCardSection,
  generateInputSection,
  generateSelectSection,
  generateLinkSection,
  generateStockQuantityStatusSection,
  generateCheckboxSection,
  generateSwitchSection,
  generateRadioSection,
  generateSpinnerSection,
  generateDialogSection,
  generateTypographySection,
  generatePaginationSection,
  generateAlertSection,
  generateBreadcrumbSection,
  generateProgressSection,
  generateSkeletonSection,
];

export function generateFromRecipes(container: FrameNode): number {
  for (const generate of generators) {
    generate(container);
  }
  return generators.length;
}
