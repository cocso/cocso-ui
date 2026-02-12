---
"@cocso-ui/react-icons": minor
---

### Semantic 아이콘을 Tabler Icons로 전환

모든 semantic 아이콘의 SVG를 [Tabler Icons](https://tabler.io/icons) 기반으로 교체하였습니다.

#### 주요 변경사항

- **SVG 소스 전환**: 기존 커스텀/Material 기반 SVG를 Tabler Icons SVG로 교체 (56개 아이콘)
- **Filled 아이콘 적용**: `ArrowDropDownIcon`, `ArrowDropUpIcon`, `CheckCircleIcon`, `RemoveCircleIcon`, `VerifiedIcon`, `SideNavigationIcon`에 filled 스타일 적용
- **신규 아이콘 추가**: `ArrowBackwardIcon`, `ArrowUpIcon`, `DocumentScannerIcon`, `DollarIcon`, `HospitalIcon`, `LinkIcon`, `NetworkNodeIcon`, `PencilIcon`, `PieChartIcon`, `PlugConnectIcon`, `SystemUpdateIcon`
- **아이콘 삭제**: `AddIcon` 제거 (`PlusIcon`으로 대체)
- **CheckIndeterminateSmallIcon**: 마이너스 라인 길이 조정

#### Breaking Changes

- `AddIcon`이 삭제되었습니다. `PlusIcon`을 사용해주세요.
- 아이콘의 SVG path가 변경되어 시각적 형태가 달라질 수 있습니다.
