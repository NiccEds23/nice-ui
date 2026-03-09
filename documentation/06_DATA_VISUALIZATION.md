# 06. Data Visualization

Components designed for visualizing data, metrics, and trends.
**Location**: `src/components/Base/`

## 📊 Charts

Our charting system is built on **Apache ECharts**. We provide a wrapper `BaseChart` and several specialized components for common chart types.

### BaseLineChart

Interactive Line chart with support for smooth lines, multiple series, and optional 3D mode.

**Props**:

- `data`: Array of objects (Raw Data)
- `categoryKey`: String (Key for X-axis, e.g., 'date')
- `seriesKeys`: String[] | Object (Keys to plot. Object format `{ key: 'Label' }` is recommended)
- `is3d`: Boolean (Enables 3D mode)
- `title`: String
- `loading`: Boolean

```vue
<BaseLineChart
  title="Traffic Trends"
  :data="chartData"
  category-key="date"
  :series-keys="{ visitors: 'Unique Visitors', pageviews: 'Page Views' }"
  height="300px"
/>
```

### BaseBarChart

Interactive Bar chart. Supports standard bars and 3D bars.

**Props**: Same as BaseLineChart.

```vue
<BaseBarChart
  title="Sales by Category"
  :data="salesData"
  category-key="category"
  :series-keys="{ current: 'This Month', previous: 'Last Month' }"
/>
```

### BasePieChart

Interactive Pie/Donut chart.

**Props**:

- `data`: Array of objects
- `labelKey`: String (Key for slice labels)
- `valueKey`: String (Key for slice values)
- `donut`: Boolean (Enables Donut style)
- `title`: String

```vue
<BasePieChart
  title="Device Distribution"
  :data="deviceData"
  label-key="device"
  value-key="count"
  donut
/>
```

### BaseChart (Wrapper)

Low-level wrapper for ECharts. Use this if you need to pass a raw ECharts `option` object for complex custom charts that don't fit the helper components above.

**Props**:

- `options`: EChartsOption object
- `height`: String (default: 100%)
- `width`: String (default: 100%)
- `loading`: Boolean

---

## 📈 Metrics

### BaseHighlightCard

A specialized card for displaying a single key metric with trends and status.

**Props**:

- `label`: String (Title)
- `value`: String/Number (Main value)
- `unit`: String (Suffix, e.g., '%', '$')
- `icon`: String (Material Symbol name)
- `variant`: String (Color theme: 'primary', 'blue', 'emerald', 'rose', 'indigo', etc.)
- `trend`: Number (Positive/Negative number for trend indicator)
- `trendLabel`: String (Text to display next to trend arrow)
- `subtext`: String (Bottom helper text)
- `subtextIntent`: String ('success', 'danger', 'neutral')

```vue
<BaseHighlightCard
  label="Total Revenue"
  value="45,200"
  unit="$"
  icon="payments"
  variant="emerald"
  :trend="12.5"
  trend-label="+12.5%"
  subtext="vs last month"
  subtext-intent="success"
/>
```
