import { generateBadgeSection } from "./components/badge";
import { generateButtonSection } from "./components/button";
import { generateCheckboxSection } from "./components/checkbox";
import { generateDialogSection } from "./components/dialog";
import { generateInputSection } from "./components/input";
import { generateLinkSection } from "./components/link";
import { generatePaginationSection } from "./components/pagination";
import { generateRadioSection } from "./components/radio";
import { generateSelectSection } from "./components/select";
import { generateSpinnerSection } from "./components/spinner";
import { generateStockQuantityStatusSection } from "./components/stock-quantity-status";
import { generateSwitchSection } from "./components/switch";
import { generateTypographySection } from "./components/typography";

const generators: Array<(container: FrameNode) => void> = [
  generateButtonSection,
  generateBadgeSection,
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
];

export function generateFromRecipes(container: FrameNode): number {
  for (const generate of generators) {
    generate(container);
  }
  return generators.length;
}
