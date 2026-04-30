# Base Components Map

Use these components to build all UI interfaces.

## Core UI

- **BaseButton**: `variant` (primary/secondary/success/danger/ghost), `size` (sm/md/lg), `icon` (Material Symbol), `loading`.
- **BaseCard**: `title`, `subtitle`. Container with consistent padding/shadow.
- **BaseLoader**: `text`, `size`.
- **BaseTooltip**: `text`, `position` (top/bottom/left/right). Wrapper for simple tooltips.
- **BaseDivider**: `label`, `orientation` (horizontal/vertical), `variant` (solid/dashed/dotted/gradient).
- **BasePopover**: `position`, `trigger` (click/hover), `title`, `maxWidth`. Slots: `trigger`, `default`. Uses Teleport.

## Forms & Inputs

- **BaseInput**: `label`, `error`, `icon`, `type`, `mask` (pattern), `currency` (boolean). Standard text input.
- **BaseTextarea**: `label`, `error`, `hint`, `maxlength`, `resize`, `disabled`. Multiline input.
- **BaseSelect**: `options`, `searchable`, `multiple`, `loading`. Features **Smart Positioning** (Drop-up).
- **BaseCheckbox**: `modelValue` (Boolean or Array), `value` (for array mode), `label`.
- **BaseSwitch**: `label`, `disabled`. Toggle switch.
- **BaseRadio**: `modelValue`, `value`, `label`, `disabled`. Single radio button with animated indicator.
- **BaseDatepicker**: `modelValue` (ISO string in single/datetime mode; `{ start, end }` object in range mode), `mode` (`'date'` | `'datetime'`, default `'date'`), `range` (boolean), `label`, `placeholder`, `error`, `required`, `disabled`. In `datetime` mode keeps dropdown open until "Confirm" clicked and emits `'YYYY-MM-DD HH:mm'`. In `range` mode emits `{ start: string, end: string }`.
- **BaseUpload**: `mode` (field/button), `accept`, `preview`. Single file.
- **BaseUploadMultiple**: `maxFiles`, `preview`. Multiple files with list view.
- **BaseRating**: `modelValue` (0–5), `max`, `size`, `variant`, `readonly`, `halfStar`, `showValue`, `label`.
- **BaseOtpInput**: `modelValue`, `length` (4/6), `inputType`, `size`, `masked`, `disabled`, `label`, `error`, `hint`. Emits: `complete`.
- **BaseColorPicker**: `modelValue` (hex), `presets` (string[]), `disabled`, `label`, `hint`. Panel with swatch grid + native fallback.
- **BaseTimePicker**: `modelValue` (HH:mm), `label`, `placeholder`, `error`, `required`, `disabled`, `step` (minute increment, default 5). Scrollable hour/minute column picker.

## Data Display

- **BaseTable**: `columns`, `data`, `pagination`, `selectable`. Slots: `cell-[key]`, `actions`, `filter-content`.
- **BaseReportTable**: `columns`, `data` (tree), `leftAxisTitle`. Tree view, sticky header, resizable axis.
- **BaseFilterModal**: Wrapper for advanced filters. Triggered by `filter-content` slot in Table.
- **BaseHighlightCard**: `label`, `value`, `icon`, `variant`, `trend`. Metric display card.
- **BaseAuditLog**: `logs` (AuditLogEntry[]), `title`, `compact`, `showSearch`, `showMetadata`, `groupByDate`, `hasMore`. Emits: `loadMore`.
- **BaseBadge**: `variant` (primary/secondary/success/warning/danger/info/neutral), `size`, `pill`, `dot`, `icon`.
- **BaseEmptyState**: `icon`, `title`, `description`, `variant`, `size`. Slot: `action`.
- **BaseStatCard**: `value`, `label`, `icon`, `variant`, `trend` (%), `description`, `suffix`, `sparkline` (number[]), `clickable`.
- **BaseSkeletonLoader**: `type` (text/avatar/image/button/card/block), `animated`, `width`, `height`, `lines`.
- **BaseAccordion**: `items` (AccordionItem[]), `multiple`, `defaultOpen`, `flush`. Slot per item: `item-[key]`.
- **BaseTimeline**: `items` (TimelineItem[]), `variant` (default/compact). Slots: `icon-[key]`, `content-[key]`.
- **BaseKanbanBoard**: `columns` (KanbanColumn[]), `compact`. Emits: `move-card`, `update:columns`. Supports drag-and-drop.
- **BaseCalendarView**: `modelValue` (selected date `YYYY-MM-DD`, `v-model`), `schedules` (`CalendarSchedule[]`, `v-model:schedules`), `view` (`yearly`/`monthly`/`daily`, `v-model:view`), `startHour`, `endHour`, `hourHeight`, `readonly`. Three-view calendar with schedule CRUD and overlap detection. `CalendarSchedule` uses `startDate`/`endDate` for multi-day event support. Delete action is an ✕ button on each chip/event block that opens a confirmation modal (not a button in the edit form). Exports: `CalendarSchedule`, `CalendarViewMode`.

## Charts & Visualization

- **BaseLineChart**: `data`, `categoryKey`, `seriesKeys`, `is3d`. Interactive Line/Area chart.
- **BaseBarChart**: `data`, `categoryKey`, `seriesKeys`, `is3d`. Interactive Bar chart.
- **BasePieChart**: `data`, `labelKey`, `valueKey`, `donut`. Interactive Pie/Donut chart.
- **BaseChart**: Wrapper for ECharts. Use specific charts above unless custom logic needed.

## Navigation

- **BaseBreadcrumb**: `items` (Array of `{ label, to }`).
- **BaseTabs**: `items` (TabItem[]), `modelValue` (active tab key), `variant` (line/pill/card). Badges and icons supported.
- **BaseStepper**: `steps` (StepItem[]), `modelValue` (current step), `orientation` (horizontal/vertical), `size`, `clickable`.
- **BasePagination**: `currentPage`, `totalPages`, `totalItems`, `showJump`, `siblingCount`. Emits: `update:currentPage`.

## Progress & Feedback

- **BaseProgress**: `value`, `variant`, `size`, `striped`, `animated`, `circular`, `label`, `showValue`.
- **BaseAlert**: `variant`, `title`, `message`, `dismissible`. Slot: `default`.
- **BaseAlertBanner**: Page-level banner alert.
- **BaseModal**: `visible`, `title`, `size`. Slots: `default`, `footer`.
- **BaseDrawer**: `visible`, `placement` (right/left/bottom), `size`, `title`. Slots: `default`, `header`, `footer`. Uses Teleport.
- **BaseToast**: Singleton toast component. Controlled by uiStore.
