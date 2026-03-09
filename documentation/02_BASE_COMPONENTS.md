# 02. Base Components — Developer Reference

> **Location**: `src/components/Base/` | **Total**: 45 components
> **Design System preview**: `http://localhost:5173/design-system`

All Base Components must be used **instead of raw HTML elements**. See `CODING_RULES.md §3` for the full replacement table.

---

## 📑 Table of Contents

1. [Core UI](#-core-ui)
2. [Forms & Inputs](#-forms--inputs)
3. [Data Display](#-data-display)
4. [Charts](#-charts)
5. [Navigation](#-navigation)
6. [Progress & Feedback](#-progress--feedback)
7. [Overlays & Floating UI](#-overlays--floating-ui)
8. [Layout](#-layout)
9. [Audit & Activity](#-audit--activity)
10. [Type Exports Reference](#-type-exports-reference)

---

## 🧩 Core UI

### `BaseButton`

**Use for**: Every clickable button in the app. Never use raw `<button>`.

| Prop        | Type      | Default     | Values                                           |
| ----------- | --------- | ----------- | ------------------------------------------------ |
| `variant`   | `String`  | `"primary"` | `primary` `secondary` `success` `danger` `ghost` |
| `size`      | `String`  | `"md"`      | `sm` `md` `lg`                                   |
| `icon`      | `String`  | `""`        | Material Symbol name (left icon)                 |
| `iconRight` | `String`  | `""`        | Material Symbol name (right icon)                |
| `loading`   | `Boolean` | `false`     | Shows spinner, disables button                   |
| `disabled`  | `Boolean` | `false`     | Disables interaction                             |
| `block`     | `Boolean` | `false`     | Full-width button                                |
| `outlined`  | `Boolean` | `false`     | Outlined style (border only, no fill)            |

```vue
<BaseButton
  variant="primary"
  size="md"
  icon="add"
  :loading="saving"
  @click="save"
>
  Save
</BaseButton>
<BaseButton
  variant="danger"
  outlined
  size="sm"
  @click="deleteItem"
>Delete</BaseButton>
<BaseButton variant="ghost" icon="filter_list" block>Filter</BaseButton>
```

---

### `BaseCard`

**Use for**: Content containers. Provides consistent glassmorphism surface, padding, shadow.

| Slot                   | Description           |
| ---------------------- | --------------------- |
| `default`              | Main content          |
| `header` _(if exists)_ | Custom header content |

| Prop / Attr       | Type      | Default | Notes                                          |
| ----------------- | --------- | ------- | ---------------------------------------------- |
| `title`           | `String`  | —       | Card header title                              |
| `subtitle`        | `String`  | —       | Card header subtitle                           |
| `no-body-padding` | `Boolean` | `false` | Removes inner padding (for full-bleed content) |

```vue
<BaseCard title="User Statistics" subtitle="Last 30 days">
  <p>Content goes here.</p>
</BaseCard>

<BaseCard :no-body-padding="true">
  <img src="..." style="width:100%;border-radius:1.5rem" />
</BaseCard>
```

---

### `BaseLoader`

**Use for**: Full-screen or section-level loading spinner.

| Prop   | Type     | Default | Notes               |
| ------ | -------- | ------- | ------------------- |
| `text` | `String` | `""`    | Label below spinner |
| `size` | `String` | `"md"`  | `sm` `md` `lg`      |

```vue
<BaseLoader text="Loading data..." />
```

---

### `BaseTooltip`

**Use for**: Short explanatory text on hover. Uses `<Teleport to="body">` — never clipped by overflow.

| Prop       | Type     | Default | Values                        |
| ---------- | -------- | ------- | ----------------------------- |
| `text`     | `String` | `""`    | Tooltip content               |
| `position` | `String` | `"top"` | `top` `bottom` `left` `right` |
| `delay`    | `Number` | `200`   | Delay in ms before showing    |

```vue
<BaseTooltip text="Delete this item" position="top">
  <BaseButton variant="ghost" icon="delete" size="sm" />
</BaseTooltip>
```

---

### `BaseDivider`

**Use for**: Visual separator between sections. Replaces `<hr>`.

| Prop          | Type     | Default        | Values                               |
| ------------- | -------- | -------------- | ------------------------------------ |
| `variant`     | `String` | `"solid"`      | `solid` `dashed` `dotted` `gradient` |
| `orientation` | `String` | `"horizontal"` | `horizontal` `vertical`              |
| `label`       | `String` | `""`           | Optional centered label text         |

```vue
<BaseDivider />
<BaseDivider variant="dashed" />
<BaseDivider label="OR" />
<BaseDivider variant="gradient" />
<BaseDivider orientation="vertical" />
<!-- requires fixed height on parent -->
```

---

## 📝 Forms & Inputs

### `BaseInput`

**Use for**: All single-line text inputs. Supports masks, icons, currency formatting.

| Prop          | Type            | Default  | Notes                                   |
| ------------- | --------------- | -------- | --------------------------------------- |
| `modelValue`  | `String/Number` | —        | `v-model`                               |
| `label`       | `String`        | `""`     | Input label                             |
| `placeholder` | `String`        | `""`     | —                                       |
| `type`        | `String`        | `"text"` | HTML input type                         |
| `icon`        | `String`        | `""`     | Left Material Symbol icon               |
| `error`       | `String`        | `""`     | Displays red error text below           |
| `hint`        | `String`        | `""`     | Displays muted hint text below          |
| `mask`        | `String`        | `""`     | Maska format pattern (e.g. `"###-###"`) |
| `currency`    | `Boolean`       | `false`  | IDR currency mask (Rp format)           |
| `disabled`    | `Boolean`       | `false`  | —                                       |
| `required`    | `Boolean`       | `false`  | Shows `*` on label                      |

```vue
<BaseInput
  v-model="name"
  label="Full Name"
  placeholder="Enter name"
  icon="person"
/>
<BaseInput v-model="phone" label="Phone" mask="(###) ###-####" />
<BaseInput v-model="price" label="Price" currency />
<BaseInput v-model="email" label="Email" type="email" :error="errors.email" />
```

---

### `BaseTextarea`

**Use for**: Multiline text input (notes, descriptions, addresses).

| Prop          | Type      | Default | Notes                             |
| ------------- | --------- | ------- | --------------------------------- |
| `modelValue`  | `String`  | —       | `v-model`                         |
| `label`       | `String`  | `""`    | —                                 |
| `placeholder` | `String`  | `""`    | —                                 |
| `error`       | `String`  | `""`    | Error text                        |
| `hint`        | `String`  | `""`    | Hint text                         |
| `maxlength`   | `Number`  | `0`     | Character limit (`0` = unlimited) |
| `rows`        | `Number`  | `4`     | Visible rows                      |
| `resize`      | `Boolean` | `true`  | Allow manual resize               |
| `disabled`    | `Boolean` | `false` | —                                 |

```vue
<BaseTextarea
  v-model="notes"
  label="Notes"
  :maxlength="500"
  hint="Max 500 characters"
/>
<BaseTextarea v-model="address" label="Address" :rows="3" :resize="false" />
```

---

### `BaseSelect`

**Use for**: All dropdown selectors. Teleport-based — works inside tables, modals, any overflow container.

| Prop          | Type                  | Default | Notes                              |
| ------------- | --------------------- | ------- | ---------------------------------- |
| `modelValue`  | `String/Number/Array` | —       | `v-model`                          |
| `options`     | `Array`               | `[]`    | `string[]` or `{ label, value }[]` |
| `label`       | `String`              | `""`    | —                                  |
| `placeholder` | `String`              | `""`    | —                                  |
| `searchable`  | `Boolean`             | `false` | Enables type-to-filter             |
| `multiple`    | `Boolean`             | `false` | Multi-select with tag chips        |
| `loading`     | `Boolean`             | `false` | Shows spinner in dropdown          |
| `error`       | `String`              | `""`    | Error text                         |
| `hint`        | `String`              | `""`    | Hint text                          |
| `disabled`    | `Boolean`             | `false` | —                                  |
| `required`    | `Boolean`             | `false` | Shows `*` on label                 |

**Emits**: `update:modelValue`, `search` (string), `change`

```vue
<BaseSelect v-model="role" label="Role" :options="['Admin', 'User', 'Guest']" />

<!-- Complex options with label/value pairs -->
<BaseSelect
  v-model="status"
  label="Status"
  :options="[
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ]"
/>

<!-- Searchable + multiple -->
<BaseSelect
  v-model="tags"
  label="Tags"
  :options="tagOptions"
  searchable
  multiple
/>

<!-- Async search -->
<BaseSelect
  v-model="user"
  :options="userResults"
  searchable
  @search="fetchUsers"
/>
```

---

### `BaseCheckbox`

**Use for**: Boolean toggles and multi-select checkboxes.

| Prop         | Type            | Default | Notes                                             |
| ------------ | --------------- | ------- | ------------------------------------------------- |
| `modelValue` | `Boolean/Array` | —       | `v-model`                                         |
| `value`      | `any`           | `""`    | Used in array mode — the value added to the array |
| `label`      | `String`        | `""`    | —                                                 |
| `disabled`   | `Boolean`       | `false` | —                                                 |

```vue
<!-- Boolean mode -->
<BaseCheckbox v-model="agree" label="I agree to terms" />

<!-- Array mode (multiple checkboxes bound to same array) -->
<BaseCheckbox v-model="permissions" value="read" label="Read" />
<BaseCheckbox v-model="permissions" value="write" label="Write" />
<BaseCheckbox v-model="permissions" value="delete" label="Delete" />
```

---

### `BaseRadio`

**Use for**: Single-select among mutually exclusive options.

| Prop         | Type      | Default | Notes                                         |
| ------------ | --------- | ------- | --------------------------------------------- |
| `modelValue` | `any`     | —       | `v-model` (shared across all radios in group) |
| `value`      | `any`     | —       | The value this radio represents               |
| `label`      | `String`  | `""`    | —                                             |
| `disabled`   | `Boolean` | `false` | —                                             |

```vue
<BaseRadio v-model="plan" value="monthly" label="Monthly billing" />
<BaseRadio v-model="plan" value="yearly" label="Yearly billing" />
<BaseRadio v-model="plan" value="lifetime" label="Lifetime" :disabled="true" />
```

---

### `BaseSwitch`

**Use for**: On/off toggle settings.

| Prop         | Type      | Default | Notes     |
| ------------ | --------- | ------- | --------- |
| `modelValue` | `Boolean` | —       | `v-model` |
| `label`      | `String`  | `""`    | —         |
| `disabled`   | `Boolean` | `false` | —         |

```vue
<BaseSwitch v-model="notifications" label="Enable email notifications" />
<BaseSwitch v-model="darkMode" label="Dark mode" />
```

---

### `BaseDatepicker`

**Use for**: Date input with calendar popup. Supports single date and date range.

| Prop          | Type           | Default | Notes                                       |
| ------------- | -------------- | ------- | ------------------------------------------- |
| `modelValue`  | `String/Array` | —       | ISO date string or `[start, end]` for range |
| `label`       | `String`       | `""`    | —                                           |
| `placeholder` | `String`       | `""`    | —                                           |
| `range`       | `Boolean`      | `false` | Enables range selection mode                |
| `error`       | `String`       | `""`    | —                                           |
| `disabled`    | `Boolean`      | `false` | —                                           |

```vue
<BaseDatepicker
  v-model="birthDate"
  label="Date of Birth"
  placeholder="Select date"
/>
<BaseDatepicker v-model="dateRange" label="Report Period" range />
```

---

### `BaseUpload`

**Use for**: Single file upload. Supports field (drag-and-drop area) or button mode.

| Prop         | Type        | Default   | Notes                                         |
| ------------ | ----------- | --------- | --------------------------------------------- |
| `modelValue` | `File/null` | —         | `v-model`                                     |
| `mode`       | `String`    | `"field"` | `field` (drop zone) or `button` (click only)  |
| `accept`     | `String`    | `"*"`     | MIME type filter (e.g. `"image/*"`, `".pdf"`) |
| `preview`    | `Boolean`   | `false`   | Shows image thumbnail after selection         |
| `label`      | `String`    | `""`      | —                                             |
| `error`      | `String`    | `""`      | —                                             |

```vue
<BaseUpload
  v-model="avatar"
  mode="field"
  accept="image/*"
  preview
  label="Profile Photo"
/>
<BaseUpload
  v-model="doc"
  mode="button"
  accept=".pdf,.docx"
  label="Upload Document"
/>
```

---

### `BaseUploadMultiple`

**Use for**: Multiple file uploads with a list preview.

| Prop         | Type      | Default | Notes                 |
| ------------ | --------- | ------- | --------------------- |
| `modelValue` | `File[]`  | `[]`    | `v-model`             |
| `maxFiles`   | `Number`  | `10`    | Maximum files allowed |
| `accept`     | `String`  | `"*"`   | MIME type filter      |
| `preview`    | `Boolean` | `true`  | Shows file list       |
| `label`      | `String`  | `""`    | —                     |

```vue
<BaseUploadMultiple
  v-model="attachments"
  :max-files="5"
  accept="image/*,application/pdf"
/>
```

---

### `BaseRating`

**Use for**: Star rating input or display.

| Prop         | Type      | Default     | Values/Notes                           |
| ------------ | --------- | ----------- | -------------------------------------- |
| `modelValue` | `Number`  | `0`         | `v-model` (0 to `max`)                 |
| `max`        | `Number`  | `5`         | Total stars                            |
| `size`       | `String`  | `"md"`      | `sm` `md` `lg`                         |
| `variant`    | `String`  | `"warning"` | `primary` `warning` `success` `danger` |
| `readonly`   | `Boolean` | `false`     | Display only, no interaction           |
| `disabled`   | `Boolean` | `false`     | —                                      |
| `halfStar`   | `Boolean` | `false`     | Allow 0.5 increments                   |
| `showValue`  | `Boolean` | `false`     | Show numeric value next to stars       |
| `label`      | `String`  | `""`        | —                                      |

```vue
<BaseRating v-model="score" label="Your rating" show-value />
<BaseRating :model-value="4.5" :half-star="true" readonly size="lg" />
<BaseRating v-model="difficulty" variant="danger" :max="10" />
```

---

### `BaseOtpInput`

**Use for**: OTP / PIN code input. Auto-tabs on each character, paste support, backspace navigation.

| Prop         | Type      | Default    | Values/Notes                       |
| ------------ | --------- | ---------- | ---------------------------------- |
| `modelValue` | `String`  | `""`       | `v-model`                          |
| `length`     | `Number`  | `6`        | Number of cells (typically 4 or 6) |
| `inputType`  | `String`  | `"number"` | `text` `number` `password`         |
| `size`       | `String`  | `"md"`     | `sm` `md` `lg`                     |
| `masked`     | `Boolean` | `false`    | Shows dots instead of characters   |
| `disabled`   | `Boolean` | `false`    | —                                  |
| `label`      | `String`  | `""`       | —                                  |
| `error`      | `String`  | `""`       | —                                  |
| `hint`       | `String`  | `""`       | —                                  |

**Emits**: `update:modelValue`, `complete` (fired when all cells filled)

```vue
<BaseOtpInput
  v-model="code"
  :length="6"
  label="Verification Code"
  hint="Check your email"
  @complete="verifyCode"
/>
<BaseOtpInput v-model="pin" :length="4" masked label="Enter PIN" />
```

---

### `BaseColorPicker`

**Use for**: Selecting a color, with preset swatches and hex input.

| Prop         | Type       | Default            | Notes                       |
| ------------ | ---------- | ------------------ | --------------------------- |
| `modelValue` | `String`   | `"#6366f1"`        | Hex color string, `v-model` |
| `presets`    | `String[]` | (built-in palette) | Array of hex color strings  |
| `label`      | `String`   | `""`               | —                           |
| `hint`       | `String`   | `""`               | —                           |
| `disabled`   | `Boolean`  | `false`            | —                           |

```vue
<BaseColorPicker v-model="brandColor" label="Brand Color" />
<BaseColorPicker
  v-model="accent"
  label="Accent"
  :presets="['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']"
/>
```

---

## 🗃️ Data Display

### `BaseTable`

**Use for**: All data tables. Handles sorting, pagination, row selection, search, and filtering.

| Prop          | Type      | Default | Notes                                         |
| ------------- | --------- | ------- | --------------------------------------------- |
| `columns`     | `Array`   | `[]`    | `{ key, label, sortable?, align?, width? }[]` |
| `data`        | `Array`   | `[]`    | Rows to display                               |
| `pagination`  | `Object`  | `null`  | `{ currentPage, total, perPage, lastPage }`   |
| `loading`     | `Boolean` | `false` | Shows skeleton overlay                        |
| `selectable`  | `Boolean` | `false` | Enables row checkboxes                        |
| `title`       | `String`  | `""`    | Table section title                           |
| `subtitle`    | `String`  | `""`    | —                                             |
| `showSearch`  | `Boolean` | `true`  | Show search input in toolbar                  |
| `showFilters` | `Boolean` | `true`  | Show filter button                            |

**Slots**:

- `cell-[key]` — Custom cell renderer: `{ row, val, index }`
- `actions` — Custom actions column cell: `{ row }`
- `filter-content` — Content inside the filter panel

**Emits**: `page-change`, `per-page-change`, `sort-change`, `search`, `selection-change`

> **Note on pagination**: BaseTable has its own integrated footer (rows-per-page + prev/next). Do **not** add `<BasePagination>` inside or below it.

```vue
<BaseTable
  title="Customers"
  :columns="[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', align: 'center' },
  ]"
  :data="customers"
  :pagination="meta"
  :loading="isLoading"
  selectable
  @page-change="fetchCustomers"
  @sort-change="handleSort"
  @selection-change="selected = $event"
>
  <template #cell-status="{ val }">
    <BaseBadge :variant="val === 'active' ? 'success' : 'neutral'">{{ val }}</BaseBadge>
  </template>

  <template #actions="{ row }">
    <BaseTooltip text="Edit">
      <BaseButton variant="ghost" size="sm" icon="edit" @click="edit(row)" />
    </BaseTooltip>
    <BaseTooltip text="Delete">
      <BaseButton variant="ghost" size="sm" icon="delete" @click="remove(row)" />
    </BaseTooltip>
  </template>

  <template #filter-content>
    <BaseSelect v-model="filters.status" :options="statusOptions" label="Status" />
    <BaseDatepicker v-model="filters.date" label="Created" range />
  </template>
</BaseTable>
```

---

### `BaseReportTable`

**Use for**: Financial / tree-structured reporting tables. Sticky header, sticky left axis, resizable.

| Prop            | Type     | Default   | Notes                                                |
| --------------- | -------- | --------- | ---------------------------------------------------- |
| `columns`       | `Array`  | `[]`      | `{ key, label, align? }[]`                           |
| `data`          | `Array`  | `[]`      | Rows; supports `{ label, children: [...] }` for tree |
| `leftAxisTitle` | `String` | `""`      | Header of the left-fixed column                      |
| `labelKey`      | `String` | `"label"` | Property used for the left column display            |

```vue
<BaseReportTable
  left-axis-title="Account"
  :columns="[
    { key: 'q1', label: 'Q1', align: 'right' },
    { key: 'q2', label: 'Q2', align: 'right' },
    { key: 'total', label: 'Total', align: 'right' },
  ]"
  :data="financialTree"
/>
```

---

### `BaseFilterModal`

**Use for**: Advanced filter panel inside `BaseTable`'s `filter-content` slot. Wraps content in a consistent modal layout with Apply/Reset buttons.

```vue
<template #filter-content>
  <BaseFilterModal @apply="applyFilters" @reset="resetFilters">
    <BaseSelect
      v-model="filters.category"
      :options="categories"
      label="Category"
    />
    <BaseSelect v-model="filters.status" :options="statuses" label="Status" />
  </BaseFilterModal>
</template>
```

---

### `BaseHighlightCard`

**Use for**: KPI / metric cards in dashboards. Shows a large value with an icon, trend badge, and subtext.

| Prop            | Type            | Default     | Notes                                                   |
| --------------- | --------------- | ----------- | ------------------------------------------------------- |
| `label`         | `String`        | `""`        | Metric name (e.g., "Total Revenue")                     |
| `value`         | `String/Number` | `""`        | Main display value                                      |
| `unit`          | `String`        | `""`        | Unit suffix (e.g., "kg", "IDR")                         |
| `icon`          | `String`        | `""`        | Material Symbol name                                    |
| `variant`       | `String`        | `"blue"`    | `blue` `indigo` `rose` `emerald` `purple` `orange`      |
| `trend`         | `Number`        | `0`         | Positive = up arrow, negative = down arrow              |
| `trendLabel`    | `String`        | `""`        | Label next to trend arrow                               |
| `status`        | `String`        | `""`        | Override badge: `positive` `negative` `optimal` `alert` |
| `statusIcon`    | `String`        | `""`        | Override status icon (Material Symbol)                  |
| `subtext`       | `String`        | `""`        | Small text below value                                  |
| `subtextIntent` | `String`        | `"neutral"` | `neutral` `danger` `success`                            |
| `loading`       | `Boolean`       | `false`     | Shows loading overlay                                   |

**Slots**: `value` (custom value render), `footer`, `header-actions`

```vue
<BaseHighlightCard
  label="Total Revenue"
  value="128,450,000"
  unit="IDR"
  icon="payments"
  variant="blue"
  :trend="12.5"
  trend-label="+12.5%"
  subtext="vs. last month"
/>
```

---

### `BaseStatCard`

**Use for**: Compact metric cards with optional sparkline chart (e.g., dashboard widgets).

| Prop          | Type            | Default     | Notes                                                        |
| ------------- | --------------- | ----------- | ------------------------------------------------------------ |
| `value`       | `String/Number` | `""`        | Main metric value                                            |
| `label`       | `String`        | `""`        | Metric name                                                  |
| `icon`        | `String`        | `""`        | Material Symbol name                                         |
| `variant`     | `String`        | `"primary"` | `primary` `success` `warning` `danger` `secondary` `neutral` |
| `trend`       | `Number`        | `0`         | % change (positive = green up, negative = red down)          |
| `description` | `String`        | `""`        | Small text below trend                                       |
| `suffix`      | `String`        | `""`        | Unit appended to value                                       |
| `sparkline`   | `Number[]`      | `[]`        | Data points for mini SVG chart                               |
| `clickable`   | `Boolean`       | `false`     | Adds hover effect and cursor pointer                         |

```vue
<BaseStatCard
  label="Active Users"
  value="11,322"
  icon="group"
  variant="success"
  :trend="-2.4"
  description="vs. previous period"
  :sparkline="[60, 72, 55, 80, 68, 90, 78]"
/>
```

---

### `BaseBadge`

**Use for**: Status labels, tags, and count indicators.

| Prop      | Type      | Default     | Values                                                              |
| --------- | --------- | ----------- | ------------------------------------------------------------------- |
| `variant` | `String`  | `"primary"` | `primary` `secondary` `success` `warning` `danger` `info` `neutral` |
| `size`    | `String`  | `"md"`      | `sm` `md` `lg`                                                      |
| `pill`    | `Boolean` | `false`     | Fully rounded pill shape                                            |
| `dot`     | `Boolean` | `false`     | Adds a colored dot before text                                      |
| `icon`    | `String`  | `""`        | Material Symbol name (before text)                                  |

```vue
<BaseBadge variant="success">Active</BaseBadge>
<BaseBadge variant="danger" pill dot>Out of Stock</BaseBadge>
<BaseBadge variant="info" icon="schedule" size="sm">Pending</BaseBadge>
```

---

### `BaseEmptyState`

**Use for**: Empty lists, zero-data tables, or "nothing here yet" pages.

| Prop          | Type     | Default           | Values                               |
| ------------- | -------- | ----------------- | ------------------------------------ |
| `icon`        | `String` | `"inbox"`         | Material Symbol name                 |
| `title`       | `String` | `"No data found"` | —                                    |
| `description` | `String` | `""`              | Explanatory subtitle                 |
| `variant`     | `String` | `"default"`       | `default` `search` `error` `success` |
| `size`        | `String` | `"md"`            | `sm` `md` `lg`                       |

**Slot**: `action` — call-to-action area (button etc.)

```vue
<BaseEmptyState
  icon="receipt_long"
  title="No invoices yet"
  description="Invoices will appear here once created."
>
  <template #action>
    <BaseButton icon="add" @click="createInvoice">Create Invoice</BaseButton>
  </template>
</BaseEmptyState>
```

---

### `BaseSkeletonLoader`

**Use for**: Placeholder content while data is loading.

| Prop       | Type      | Default  | Values/Notes                                    |
| ---------- | --------- | -------- | ----------------------------------------------- |
| `type`     | `String`  | `"text"` | `text` `avatar` `image` `button` `card` `block` |
| `animated` | `Boolean` | `true`   | Shimmer animation                               |
| `lines`    | `Number`  | `3`      | Number of lines (only for `type="text"`)        |
| `width`    | `String`  | `"100%"` | CSS width (for `type="block"`)                  |
| `height`   | `String`  | `"1rem"` | CSS height (for `type="block"`)                 |

```vue
<!-- Text lines placeholder -->
<BaseSkeletonLoader type="text" :lines="4" />

<!-- Card placeholder -->
<BaseSkeletonLoader type="card" />

<!-- Custom block -->
<BaseSkeletonLoader type="block" width="200px" height="120px" />

<!-- Commonly used in v-if pattern -->
<template v-if="isLoading">
  <BaseSkeletonLoader type="card" />
</template>
<template v-else>
  <BaseStatCard ... />
</template>
```

---

### `BaseAccordion`

**Use for**: FAQ sections, collapsible settings groups, expandable detail panels.

| Prop          | Type              | Default | Notes                                    |
| ------------- | ----------------- | ------- | ---------------------------------------- |
| `items`       | `AccordionItem[]` | `[]`    | See type below                           |
| `multiple`    | `Boolean`         | `false` | Allow multiple items open simultaneously |
| `defaultOpen` | `String[]`        | `[]`    | Keys of items open on mount              |
| `flush`       | `Boolean`         | `false` | Separator-only style (no card borders)   |

**`AccordionItem` interface**:

```ts
import BaseAccordion, {
  type AccordionItem,
} from "@/components/Base/BaseAccordion.vue";

interface AccordionItem {
  key: string; // Unique identifier
  title: string; // Header text
  content?: string; // Body text (use slot for rich content)
  icon?: string; // Material Symbol before title
  badge?: string; // Badge text
  badgeVariant?: string;
  disabled?: boolean;
}
```

**Slot**: `item-[key]` — Custom content for a specific item

```vue
<BaseAccordion
  :items="faqItems"
  :default-open="['shipping']"
  :multiple="true"
/>

<!-- Custom content per item -->
<BaseAccordion :items="items">
  <template #item-shipping>
    <p>Delivery takes <strong>3–5 business days</strong>.</p>
  </template>
</BaseAccordion>
```

---

### `BaseTimeline`

**Use for**: Activity feeds, order history, change logs.

| Prop      | Type             | Default     | Values                                      |
| --------- | ---------------- | ----------- | ------------------------------------------- |
| `items`   | `TimelineItem[]` | `[]`        | See type below                              |
| `variant` | `String`         | `"default"` | `default` (full detail) `compact` (minimal) |

**`TimelineItem` interface**:

```ts
import BaseTimeline, {
  type TimelineItem,
} from "@/components/Base/BaseTimeline.vue";

interface TimelineItem {
  key: string;
  title: string;
  description?: string;
  time?: string; // Display string (e.g. "3 min ago")
  icon?: string; // Material Symbol
  status?: string; // 'success' | 'warning' | 'danger' | 'info' | 'muted'
  badge?: string; // Tag text
  badgeVariant?: string; // BaseBadge variant
}
```

```vue
<BaseTimeline :items="activityLog" />
<BaseTimeline :items="activityLog" variant="compact" />
```

---

### `BaseKanbanBoard`

**Use for**: Task management boards with drag-and-drop between columns.

| Prop      | Type             | Default | Notes                |
| --------- | ---------------- | ------- | -------------------- |
| `columns` | `KanbanColumn[]` | `[]`    | `v-model:columns`    |
| `compact` | `Boolean`        | `false` | Smaller card padding |

**`KanbanColumn` / `KanbanCard` interfaces**:

```ts
import BaseKanbanBoard, {
  type KanbanColumn,
  type KanbanCard,
} from "@/components/Base/BaseKanbanBoard.vue";

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  tags?: string[];
  assignee?: string;
  dueDate?: string;
}

interface KanbanColumn {
  key: string;
  title: string;
  color?: string; // Column header accent color
  cards: KanbanCard[];
}
```

**Emits**: `move-card` (cardId, fromColumnKey, toColumnKey), `update:columns`

```vue
<BaseKanbanBoard v-model:columns="boardColumns" @move-card="onCardMoved" />
```

---

## 📊 Charts

> All chart components are wrappers around ECharts. Use the specific chart components below; use `BaseChart` directly only for custom chart types.

### `BaseLineChart`

**Use for**: Time-series trends, performance over time.

| Prop          | Type       | Default   | Notes                              |
| ------------- | ---------- | --------- | ---------------------------------- |
| `data`        | `Array`    | `[]`      | Array of objects                   |
| `categoryKey` | `String`   | `"date"`  | Property used as X-axis            |
| `seriesKeys`  | `String[]` | `[]`      | Properties to plot as series lines |
| `is3d`        | `Boolean`  | `false`   | 3D area effect                     |
| `height`      | `String`   | `"300px"` | —                                  |

```vue
<BaseLineChart
  :data="revenueData"
  category-key="month"
  :series-keys="['revenue', 'expenses']"
/>
```

---

### `BaseBarChart`

**Use for**: Comparisons, rankings, categorical data.

| Prop          | Type       | Default   | Notes                      |
| ------------- | ---------- | --------- | -------------------------- |
| `data`        | `Array`    | `[]`      | —                          |
| `categoryKey` | `String`   | `"label"` | X-axis property            |
| `seriesKeys`  | `String[]` | `[]`      | Properties to plot as bars |
| `is3d`        | `Boolean`  | `false`   | 3D bar effect              |
| `height`      | `String`   | `"300px"` | —                          |

```vue
<BaseBarChart
  :data="salesByProduct"
  category-key="product"
  :series-keys="['q1', 'q2', 'q3']"
/>
```

---

### `BasePieChart`

**Use for**: Part-to-whole breakdown (market share, category split).

| Prop       | Type      | Default   | Notes                    |
| ---------- | --------- | --------- | ------------------------ |
| `data`     | `Array`   | `[]`      | —                        |
| `labelKey` | `String`  | `"label"` | Property for slice label |
| `valueKey` | `String`  | `"value"` | Property for slice size  |
| `donut`    | `Boolean` | `false`   | Donut (ring) style       |
| `height`   | `String`  | `"300px"` | —                        |

```vue
<BasePieChart
  :data="deviceBreakdown"
  label-key="device"
  value-key="count"
  donut
/>
```

---

### `BaseChart`

**Use for**: Custom ECharts configurations not covered by the above.

| Prop     | Type     | Default   | Notes                       |
| -------- | -------- | --------- | --------------------------- |
| `option` | `Object` | `{}`      | Raw ECharts `option` object |
| `height` | `String` | `"300px"` | —                           |

```vue
<BaseChart :option="myCustomEchartsOption" height="400px" />
```

---

## 🧭 Navigation

### `BaseBreadcrumb`

**Use for**: Page hierarchy navigation trail.

| Prop    | Type                                         | Notes                                      |
| ------- | -------------------------------------------- | ------------------------------------------ |
| `items` | `{ label: string, to?: RouteLocationRaw }[]` | Last item is current page (no link needed) |

```vue
<BaseBreadcrumb
  :items="[
    { label: 'Dashboard', to: '/' },
    { label: 'Customers', to: '/customers' },
    { label: 'Detail' },
  ]"
/>
```

---

### `BaseTabs`

**Use for**: Content switching within a page section.

| Prop         | Type        | Default  | Values                    |
| ------------ | ----------- | -------- | ------------------------- |
| `modelValue` | `String`    | —        | Active tab key, `v-model` |
| `items`      | `TabItem[]` | `[]`     | See type below            |
| `variant`    | `String`    | `"line"` | `line` `pill` `card`      |

**`TabItem` interface**:

```ts
import BaseTabs, { type TabItem } from "@/components/Base/BaseTabs.vue";

interface TabItem {
  key: string;
  label: string;
  icon?: string; // Material Symbol
  badge?: number | string;
  disabled?: boolean;
}
```

```vue
<BaseTabs v-model="activeTab" :items="tabs" variant="pill" />

<!-- Conditional content based on active tab -->
<component v-if="activeTab === 'overview'" :is="OverviewPanel" />
<component v-else-if="activeTab === 'users'" :is="UsersPanel" />
```

---

### `BaseStepper`

**Use for**: Multi-step forms and onboarding flows.

| Prop          | Type         | Default        | Values                           |
| ------------- | ------------ | -------------- | -------------------------------- |
| `modelValue`  | `Number`     | `0`            | Current step index, `v-model`    |
| `steps`       | `StepItem[]` | `[]`           | See type below                   |
| `orientation` | `String`     | `"horizontal"` | `horizontal` `vertical`          |
| `size`        | `String`     | `"md"`         | `sm` `md` `lg`                   |
| `clickable`   | `Boolean`    | `false`        | Allow jumping to completed steps |

**`StepItem` interface**:

```ts
import BaseStepper, { type StepItem } from "@/components/Base/BaseStepper.vue";

interface StepItem {
  label: string;
  description?: string;
  icon?: string;
}
```

```vue
<BaseStepper
  v-model="currentStep"
  :steps="formSteps"
  orientation="horizontal"
/>

<div v-if="currentStep === 0"><!-- Step 1 content --></div>
<div v-if="currentStep === 1"><!-- Step 2 content --></div>

<BaseButton @click="currentStep++" :disabled="currentStep >= steps.length - 1">
  Next
</BaseButton>
```

---

### `BasePagination`

**Use for**: Standalone pagination for grids, card lists, or any non-table list. **Do not use inside BaseTable** (it already has its own).

| Prop           | Type      | Default | Notes                      |
| -------------- | --------- | ------- | -------------------------- |
| `currentPage`  | `Number`  | `1`     | `v-model:current-page`     |
| `totalPages`   | `Number`  | `1`     | —                          |
| `totalItems`   | `Number`  | `0`     | Shown in "X results" label |
| `siblingCount` | `Number`  | `1`     | Pages shown around current |
| `showJump`     | `Boolean` | `false` | Jump-to-page input         |

**Emits**: `update:currentPage`

```vue
<BasePagination
  v-model:current-page="page"
  :total-pages="totalPages"
  :total-items="totalItems"
  :show-jump="true"
/>
```

---

## 🔄 Progress & Feedback

### `BaseProgress`

**Use for**: Progress bars and circular gauges.

| Prop        | Type      | Default     | Values/Notes                           |
| ----------- | --------- | ----------- | -------------------------------------- |
| `value`     | `Number`  | `0`         | 0–100                                  |
| `variant`   | `String`  | `"primary"` | `primary` `success` `warning` `danger` |
| `size`      | `String`  | `"md"`      | `sm` `md` `lg`                         |
| `label`     | `String`  | `""`        | Label text                             |
| `showValue` | `Boolean` | `false`     | Displays percentage                    |
| `striped`   | `Boolean` | `false`     | Striped fill                           |
| `animated`  | `Boolean` | `false`     | Animated stripes                       |
| `circular`  | `Boolean` | `false`     | Circular SVG gauge instead of bar      |

```vue
<BaseProgress :value="uploadProgress" variant="primary" show-value />
<BaseProgress :value="75" striped animated variant="success" />
<BaseProgress :value="cpuUsage" circular label="CPU" show-value />
```

---

### `BaseAlert`

**Use for**: System-level global alerts (success, error, warning). **Controlled by `uiStore`** — do not use props directly.

```ts
// Trigger from any composable or page:
import { useUIStore } from "@/stores/ui";
const uiStore = useUIStore();

uiStore.showAlert({
  variant: "success",
  title: "Saved!",
  message: "Changes saved successfully.",
});
uiStore.showAlert({ variant: "danger", message: "Something went wrong." });
```

Mount once in your root layout:

```vue
<!-- In DashboardLayout.vue or App.vue -->
<BaseAlert />
```

---

### `BaseAlertBanner`

**Use for**: Inline, page-level alert banners (not floating). Placed directly in the page template.

| Prop          | Type      | Default  | Values                              |
| ------------- | --------- | -------- | ----------------------------------- |
| `variant`     | `String`  | `"info"` | `info` `success` `warning` `danger` |
| `title`       | `String`  | `""`     | Bold header                         |
| `message`     | `String`  | `""`     | Body text (or use default slot)     |
| `dismissible` | `Boolean` | `false`  | Shows ✕ button                      |

**Emits**: `dismiss`

**Slot**: `default` — replaces `message` with rich content

```vue
<BaseAlertBanner
  v-if="showBanner"
  variant="warning"
  title="Maintenance Notice"
  message="System will be down on Saturday 10pm–2am."
  dismissible
  @dismiss="showBanner = false"
/>

<!-- With slot -->
<BaseAlertBanner variant="info">
  Your free trial expires in <strong>3 days</strong>.
  <BaseButton size="sm" variant="primary">Upgrade Now</BaseButton>
</BaseAlertBanner>
```

---

### `BaseToast`

**Use for**: Transient toast notifications. **Controlled by `uiStore`** — do not use props directly.

```ts
import { useUIStore } from "@/stores/ui";
const uiStore = useUIStore();

uiStore.showToast({ message: "Copied to clipboard!", variant: "success" });
uiStore.showToast({
  message: "Failed to save.",
  variant: "danger",
  duration: 5000,
});
```

Mount once in your root layout:

```vue
<!-- In DashboardLayout.vue or App.vue -->
<BaseToast />
```

---

## 🪟 Overlays & Floating UI

### `BaseModal`

**Use for**: Dialogs, confirmation prompts, forms in an overlay.

| Prop         | Type      | Default | Values                                    |
| ------------ | --------- | ------- | ----------------------------------------- |
| `visible`    | `Boolean` | `false` | **Use `v-model:visible`** (not `v-model`) |
| `title`      | `String`  | `""`    | Modal header title                        |
| `size`       | `String`  | `"md"`  | `sm` `md` `lg` `xl`                       |
| `closable`   | `Boolean` | `true`  | Show ✕ button                             |
| `persistent` | `Boolean` | `false` | Prevent closing on backdrop click         |

**Slots**: `default` (body), `footer`

**Emits**: `update:visible`, `close`

```vue
<BaseModal v-model:visible="showModal" title="Confirm Delete" size="sm">
  <p>Are you sure you want to delete this item? This cannot be undone.</p>

  <template #footer>
    <BaseButton variant="ghost" @click="showModal = false">Cancel</BaseButton>
    <BaseButton variant="danger" :loading="deleting" @click="confirmDelete">
      Delete
    </BaseButton>
  </template>
</BaseModal>
```

---

### `BaseDrawer`

**Use for**: Side panels (filters, detail views, settings). Teleport-based — never clipped.

| Prop         | Type      | Default   | Values                            |
| ------------ | --------- | --------- | --------------------------------- |
| `visible`    | `Boolean` | `false`   | `v-model:visible`                 |
| `title`      | `String`  | `""`      | Drawer header title               |
| `placement`  | `String`  | `"right"` | `right` `left` `bottom`           |
| `size`       | `String`  | `"md"`    | `sm` `md` `lg` `full`             |
| `closable`   | `Boolean` | `true`    | Show ✕ button                     |
| `persistent` | `Boolean` | `false`   | Prevent closing on backdrop click |

**Slots**: `default` (body), `header`, `footer`

**Emits**: `update:visible`, `close`

```vue
<BaseDrawer
  v-model:visible="showFilters"
  title="Filters"
  placement="right"
  size="md"
>
  <BaseSelect v-model="filters.status" :options="statusOptions" label="Status" />
  <BaseDatepicker v-model="filters.period" label="Period" range />

  <template #footer>
    <BaseButton variant="ghost" @click="resetFilters">Reset</BaseButton>
    <BaseButton @click="applyFilters">Apply Filters</BaseButton>
  </template>
</BaseDrawer>
```

---

### `BasePopover`

**Use for**: Contextual info panels, rich tooltips, mini menus. Teleport-based.

| Prop       | Type     | Default    | Values                        |
| ---------- | -------- | ---------- | ----------------------------- |
| `position` | `String` | `"bottom"` | `top` `bottom` `left` `right` |
| `trigger`  | `String` | `"click"`  | `click` `hover`               |
| `title`    | `String` | `""`       | Popover header                |
| `maxWidth` | `String` | `"280px"`  | CSS max-width                 |

**Slots**: `trigger` (the element that triggers it), `default` (popover body)

```vue
<BasePopover position="bottom" trigger="click" title="Help">
  <template #trigger>
    <BaseButton variant="ghost" size="sm" icon="help_outline" />
  </template>
  <p>This field accepts values between 1 and 100.</p>
</BasePopover>
```

---

## 🧱 Layout

### `BaseDashboardGrid`

**Use for**: Draggable/resizable grid layouts for dashboard pages. Uses `grid-layout-plus`.

| Prop        | Type               | Default | Notes                          |
| ----------- | ------------------ | ------- | ------------------------------ |
| `layout`    | `GridLayoutItem[]` | —       | **Required.** `v-model:layout` |
| `editable`  | `Boolean`          | `false` | Enables drag and resize        |
| `cols`      | `Number`           | `12`    | Grid column count              |
| `rowHeight` | `Number`           | `60`    | Height of one row unit (px)    |

**`GridLayoutItem`** must have: `i` (unique key), `x`, `y`, `w`, `h`

**Slot**: Named slot per item key — `#[item.i]` receives `{ item }`

**Emits**: `update:layout`

```vue
<BaseDashboardGrid
  v-model:layout="gridLayout"
  :editable="isEditing"
  :row-height="80"
>
  <template #revenue-chart="{ item }">
    <BaseCard title="Revenue"><BaseLineChart ... /></BaseCard>
  </template>
  <template #users-count="{ item }">
    <BaseStatCard ... />
  </template>
</BaseDashboardGrid>
```

---

## 🕵️ Audit & Activity

### `BaseAuditLog`

**Use for**: Chronological activity/audit trail on detail pages (invoices, users, orders).

| Prop           | Type              | Default | Notes                             |
| -------------- | ----------------- | ------- | --------------------------------- |
| `logs`         | `AuditLogEntry[]` | —       | **Required**                      |
| `title`        | `String`          | `""`    | Section title                     |
| `loading`      | `Boolean`         | `false` | Loading state                     |
| `hasMore`      | `Boolean`         | `false` | Shows "Load older logs" button    |
| `compact`      | `Boolean`         | `false` | Hides description + metadata      |
| `showSearch`   | `Boolean`         | `true`  | Search input                      |
| `showMetadata` | `Boolean`         | `true`  | IP / device / location chips      |
| `groupByDate`  | `Boolean`         | `true`  | Groups entries under date headers |

**Emits**: `loadMore`

**`AuditLogEntry` type**:

```ts
import BaseAuditLog, {
  type AuditLogEntry,
} from "@/components/Base/BaseAuditLog.vue";

interface AuditLogEntry {
  id?: string | number;
  actor: string; // "John Doe"
  action: string; // "create" | "update" | "delete" | "login" |
  // "logout" | "export" | "import" | "approve" |
  // "reject" | "view"
  resource?: string; // "Invoice #INV-001"
  description?: string;
  timestamp: string; // ISO 8601
  changes?: {
    field: string;
    oldValue?: string | null;
    newValue?: string | null;
  }[];
  metadata?: { ip?: string; device?: string; location?: string };
}
```

```vue
<!-- Full mode on detail page -->
<BaseAuditLog
  title="Activity Log"
  :logs="auditLogs"
  :has-more="hasMoreLogs"
  @load-more="fetchMoreLogs"
/>

<!-- Compact mode for sidebars -->
<BaseAuditLog
  :logs="auditLogs"
  :compact="true"
  :show-search="false"
  :show-metadata="false"
/>
```

---

## 🔗 Type Exports Reference

```ts
import BaseTabs, { type TabItem } from "@/components/Base/BaseTabs.vue";
import BaseStepper, { type StepItem } from "@/components/Base/BaseStepper.vue";
import BaseAccordion, {
  type AccordionItem,
} from "@/components/Base/BaseAccordion.vue";
import BaseTimeline, {
  type TimelineItem,
} from "@/components/Base/BaseTimeline.vue";
import BaseKanbanBoard, {
  type KanbanColumn,
  type KanbanCard,
} from "@/components/Base/BaseKanbanBoard.vue";
import BaseAuditLog, {
  type AuditLogEntry,
} from "@/components/Base/BaseAuditLog.vue";
```
