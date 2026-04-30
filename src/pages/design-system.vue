<template>
  <div class="design-system-page">
    <header class="text-center mb-8 py-16 px-4 rounded-2xl shadow-sm">
      <h1
        class="text-3xl font-extrabold mb-4 p-0"
        style="
          background: linear-gradient(
            135deg,
            var(--primary-color) 0%,
            var(--secondary-color) 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        "
      >
        NiceUI Design System
      </h1>
      <p class="text-lg text-muted">Base components & style guide</p>
    </header>

    <!-- Buttons -->
    <section class="ds-section">
      <h2>Buttons</h2>
      <div
        class="d-grid gap-8"
        style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr))"
      >
        <BaseCard title="Variants">
          <div class="d-flex flex-wrap gap-4 items-center">
            <BaseButton>Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="success">Success</BaseButton>
            <BaseButton variant="danger">Danger</BaseButton>
            <BaseButton variant="ghost">Ghost</BaseButton>
          </div>
        </BaseCard>

        <BaseCard title="Outlined">
          <div class="d-flex flex-wrap gap-4 items-center">
            <BaseTooltip text="Outline Primary" position="top">
              <BaseButton outlined>Primary</BaseButton>
            </BaseTooltip>
            <BaseTooltip text="Outline Secondary" position="bottom">
              <BaseButton variant="secondary" outlined>Secondary</BaseButton>
            </BaseTooltip>
            <BaseTooltip text="Outline Success" position="left">
              <BaseButton variant="success" outlined>Success</BaseButton>
            </BaseTooltip>
            <BaseTooltip text="Outline Danger" position="right">
              <BaseButton variant="danger" outlined>Danger</BaseButton>
            </BaseTooltip>
          </div>
        </BaseCard>

        <BaseCard title="Sizes & Icons">
          <div class="d-flex flex-wrap gap-4 items-center">
            <BaseButton size="sm" icon="add">Small</BaseButton>
            <BaseButton size="md" icon="edit">Medium</BaseButton>
            <BaseButton size="lg" icon="delete">Large</BaseButton>
            <BaseButton loading>If not loading, show text</BaseButton>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- Inputs -->
    <section class="ds-section">
      <h2>Inputs</h2>
      <div
        class="d-grid gap-8"
        style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr))"
      >
        <BaseCard title="Text Inputs">
          <div class="d-flex flex-col gap-4 item-stretch">
            <BaseInput
              label="Default Input"
              placeholder="Type something..."
              v-model="inputText"
            />
            <BaseInput
              label="With Icon"
              icon="search"
              placeholder="Search..."
            />
          </div>
        </BaseCard>

        <BaseCard title="States">
          <div class="d-flex flex-col gap-4 items-stretch">
            <BaseInput
              label="Error State"
              error="Invalid value"
              model-value="Wrong input"
            />
            <BaseInput
              label="Success State"
              success
              model-value="Valid input"
            />
          </div>
        </BaseCard>

        <BaseCard title="Formatted & Masked Inputs">
          <div class="d-flex flex-col gap-4 items-stretch">
            <!-- Currency (IDR) -->
            <div>
              <BaseInput
                label="Salary (IDR)"
                v-model="salaryInput"
                currency
                placeholder="0"
                icon="payments"
              />
              <div class="text-xs text-muted mt-1">
                Raw Value: {{ salaryInput }}
              </div>
            </div>

            <!-- Custom Masks -->
            <BaseInput
              label="Phone Number"
              v-model="phoneInput"
              mask="+62 ###-####-####"
              placeholder="+62 812-3456-7890"
              icon="phone"
            />

            <BaseInput
              label="Credit Card"
              v-model="ccInput"
              mask="#### #### #### ####"
              placeholder="0000 0000 0000 0000"
              icon="credit_card"
            />

            <div class="d-flex gap-4">
              <BaseInput
                label="Date"
                v-model="dateMaskInput"
                mask="##/##/####"
                placeholder="DD/MM/YYYY"
              />
              <BaseInput
                label="Percentage"
                v-model="percentInput"
                mask="### %"
                placeholder="100 %"
              />
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- Alerts -->
    <section class="ds-section">
      <h2>Alerts & Feedback</h2>
      <div
        class="d-grid gap-8"
        style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr))"
      >
        <BaseCard title="Banner Alerts">
          <div class="d-flex flex-col gap-4 items-stretch">
            <BaseAlertBanner variant="info" title="Information"
              >This is an info alert.</BaseAlertBanner
            >
            <BaseAlertBanner variant="success" title="Success"
              >Operation completed successfully.</BaseAlertBanner
            >
            <BaseAlertBanner variant="warning" title="Warning"
              >Please check your inputs.</BaseAlertBanner
            >
            <BaseAlertBanner
              variant="danger"
              title="Error"
              dismissible
              @dismiss="handleDismiss"
              >Failed to save changes.</BaseAlertBanner
            >
          </div>
        </BaseCard>

        <BaseCard title="Global Notifications">
          <div>
            <div class="d-flex flex-col gap-2 w-full pb-6">
              <h4 class="text-sm font-bold text-muted uppercase">
                Toast Stack (Top Right)
              </h4>
              <div class="d-flex flex-wrap gap-2">
                <BaseButton
                  @click="triggerToast('success')"
                  variant="secondary"
                  size="sm"
                  >Success</BaseButton
                >
                <BaseButton
                  @click="triggerToast('warning')"
                  variant="secondary"
                  size="sm"
                  >Warning</BaseButton
                >
                <BaseButton
                  @click="triggerToast('danger')"
                  variant="secondary"
                  size="sm"
                  >Danger</BaseButton
                >
                <BaseButton
                  @click="triggerToast('info')"
                  variant="secondary"
                  size="sm"
                  >Info</BaseButton
                >
                <BaseButton
                  @click="triggerRandomToast"
                  variant="primary"
                  size="sm"
                  >Random</BaseButton
                >
              </div>
            </div>

            <div class="w-full border-t border-light"></div>

            <div class="d-flex flex-col gap-2 w-full">
              <h4 class="text-sm font-bold text-muted uppercase">
                Center Alert & Loader
              </h4>
              <div class="d-flex flex-wrap gap-2">
                <BaseButton
                  @click="triggerAlert('success')"
                  variant="secondary"
                  size="sm"
                  >Success Alert</BaseButton
                >
                <BaseButton
                  @click="triggerAlert('warning')"
                  variant="secondary"
                  size="sm"
                  >Warning Alert</BaseButton
                >
                <BaseButton
                  @click="triggerAlert('danger')"
                  variant="secondary"
                  size="sm"
                  >Danger Alert</BaseButton
                >
                <BaseButton
                  @click="triggerAlert('info')"
                  variant="secondary"
                  size="sm"
                  >Info Alert</BaseButton
                >
                <BaseButton
                  @click="triggerPersistentAlert"
                  variant="secondary"
                  size="sm"
                  >Persistent</BaseButton
                >
                <BaseButton
                  @click="triggerGlobalLoader"
                  size="sm"
                  icon="hourglass_top"
                  >Global Loader (3s)</BaseButton
                >
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- Tooltips -->
    <section class="ds-section">
      <h2>Tooltips & Popovers</h2>
      <div
        class="d-grid gap-8"
        style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr))"
      >
        <BaseCard title="Component Tooltips">
          <div class="d-flex flex-col gap-6 items-stretch">
            <div class="d-flex gap-4 items-center">
              <BaseTooltip text="This is a required field" position="right">
                <span class="material-symbols-outlined text-muted cursor-help"
                  >help</span
                >
              </BaseTooltip>

              <BaseTooltip text="Search database" position="top">
                <span
                  class="text-sm font-bold text-primary border-b border-primary cursor-pointer border-dashed"
                  >Hover me for info</span
                >
              </BaseTooltip>
            </div>

            <BaseTooltip
              text="Enter your full legal name"
              position="top"
              class="w-full"
            >
              <BaseInput label="Name (Hover Input)" placeholder="John Doe" />
            </BaseTooltip>

            <div class="d-flex gap-4">
              <BaseTooltip text="Launch rocket!" position="bottom">
                <BaseButton icon="rocket_launch">Action</BaseButton>
              </BaseTooltip>

              <BaseTooltip position="right">
                <template #content>
                  <div class="d-flex gap-2 items-center">
                    <span class="material-symbols-outlined text-warning text-sm"
                      >warning</span
                    >
                    <span>Custom <strong>HTML</strong> Content</span>
                  </div>
                </template>
                <BaseButton variant="ghost" icon="info" />
              </BaseTooltip>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- Modals -->
    <section class="ds-section">
      <h2>Modals</h2>
      <div
        class="d-grid gap-8"
        style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr))"
      >
        <BaseCard title="Preview">
          <div class="d-flex flex-wrap gap-4 items-center">
            <BaseButton @click="showModal = true" size="lg" icon="open_in_new"
              >Open Transaction Modal</BaseButton
            >
            <BaseButton
              @click="showFormModal = true"
              size="lg"
              variant="success"
              icon="assignment"
              outlined
            >
              Open Dynamic Form
            </BaseButton>
            <BaseButton
              @click="router.push('/form-demo')"
              size="lg"
              variant="ghost"
              icon="web"
            >
              Go to Page Form Demo
            </BaseButton>
          </div>
        </BaseCard>
      </div>

      <BaseModal
        v-model:visible="showModal"
        title="Confirm Transaction"
        icon="account_balance_wallet"
        icon-color="blue"
      >
        <p class="text-center mb-6 text-secondary font-medium">
          You are about to transfer
          <strong class="text-primary">$12,450.00</strong> to
          <strong class="text-primary">Neural Assets Ltd</strong>.<br />
          This action is irreversible.
        </p>

        <div class="modal-preview-content">
          <div class="row">
            <span class="label">From Account</span>
            <span class="value">Main •••• 4295</span>
          </div>
          <div class="divider"></div>
          <div class="row">
            <span class="label">Reference</span>
            <span class="value">#NICE-8821-X</span>
          </div>
        </div>

        <template #footer>
          <BaseButton variant="secondary" block @click="showModal = false"
            >Go Back</BaseButton
          >
          <BaseButton block @click="showModal = false"
            >Confirm Transfer</BaseButton
          >
        </template>
      </BaseModal>

      <ModalForm v-model:visible="showFormModal" />
    </section>

    <!-- Form Complex -->
    <section class="ds-section">
      <h2>Form Components</h2>
      <div
        class="d-grid gap-8"
        style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr))"
      >
        <BaseCard title="Selects & Switches">
          <div class="d-flex flex-col gap-4 items-stretch">
            <BaseSelect
              label="User Role (Simple)"
              v-model="selectedRole"
              :options="['Admin', 'Editor', 'Viewer']"
              placeholder="Select a role"
            />

            <BaseSelect
              label="Country (Searchable)"
              v-model="selectedCountry"
              :options="countryOptions"
              placeholder="Type to search..."
              searchable
            />

            <BaseSelect
              label="Async Search"
              v-model="selectedAsync"
              :options="asyncOptions"
              placeholder="Type 'a' to load..."
              searchable
              :loading="isLoading"
              @search="handleAsyncSearch"
            />

            <BaseSelect
              label="Multi-Select Tags"
              v-model="selectedMulti"
              :options="countryOptions"
              placeholder="Select countries..."
              multiple
              searchable
            />

            <div class="h-4"></div>

            <div class="d-flex gap-4 items-center">
              <BaseSwitch label="Email" v-model="switches.email" />
              <BaseSwitch label="SMS" v-model="switches.sms" />
              <BaseSwitch label="Push" v-model="switches.push" disabled />
            </div>
          </div>
        </BaseCard>

        <BaseCard title="Date & Uploads">
          <div class="d-flex flex-col gap-4 items-stretch">
            <BaseDatepicker label="Single Date" v-model="dateValue" />

            <BaseDatepicker
              label="Date Range"
              v-model="dateRangeValue"
              range
              placeholder="Select date range"
            />

            <BaseDatepicker
              label="Date & Time"
              v-model="dsDatetime"
              mode="datetime"
              placeholder="Select date and time"
            />

            <div class="h-px bg-light w-full my-2"></div>

            <BaseTimePicker label="Time" v-model="dsTimePicker" />
            <div class="text-xs text-muted">Value: {{ dsTimePicker }}</div>

            <BaseTimePicker
              label="Time (15-min steps)"
              v-model="dsTimePickerStep15"
              :step="15"
            />

            <div class="h-px bg-light w-full my-2"></div>

            <BaseUpload
              mode="button"
              label="Import"
              v-model="importFile"
              accept=".csv,.xlsx"
            />

            <BaseUpload
              label="Profile"
              v-model="uploadedFile"
              accept="image/*"
            />

            <BaseUploadMultiple
              label="Document Gallery"
              v-model="galleryFiles"
              :max-files="5"
              accept="image/*"
            />
          </div>
        </BaseCard>

        <BaseCard title="Checkboxes">
          <div class="d-flex flex-col gap-4">
            <div class="demo-group">
              <h4 class="text-xs font-bold text-muted uppercase mb-2">
                Single Selection
              </h4>
              <BaseCheckbox
                v-model="singleCheckbox"
                label="Accept Terms & Conditions"
              />
              <div class="text-xs text-muted mt-1">
                Value: {{ singleCheckbox }}
              </div>
            </div>

            <div class="border-t border-light my-2"></div>

            <div class="demo-group">
              <h4 class="text-xs font-bold text-muted uppercase mb-2">
                Multiple Selection (Array)
              </h4>
              <div class="d-flex gap-4">
                <BaseCheckbox
                  v-model="multiCheckbox"
                  value="Apple"
                  label="Apple"
                />
                <BaseCheckbox
                  v-model="multiCheckbox"
                  value="Banana"
                  label="Banana"
                />
                <BaseCheckbox
                  v-model="multiCheckbox"
                  value="Cherry"
                  label="Cherry"
                />
              </div>
              <div class="text-xs text-muted mt-1">
                Selected: {{ multiCheckbox }}
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- Tables -->
    <section class="ds-section">
      <h2>Data Display & Advanced Table</h2>
      <div class="d-grid" style="grid-template-columns: 1fr">
        <BaseTable
          title="Advanced Product Inventory"
          subtitle="Right-click header to toggle columns"
          :columns="tableColumns"
          :data="advancedTableData"
          selectable
          searchable
          :loading="isTableLoading"
          :pagination="tablePagination"
          v-model:selectedRows="selectedRows"
          v-model:searchQuery="tableRequest.search"
          :sort-by="tableRequest.sortBy"
          :sort-direction="tableRequest.sortDirection"
          @page-change="handleAdvancedPageChange"
          @update:show="handleShowChange"
          @update:query="handleSearchChange"
          @sort="handleSortChange"
          @apply-filters="handleAdvancedPageChange(1)"
          @reset-filters="resetFilters"
          enable-column-visibility
        >
          <template #header-actions>
            <BaseButton icon="add">New Product</BaseButton>
          </template>

          <template #filter-content>
            <div class="d-grid gap-4">
              <BaseSelect
                label="Status"
                v-model="tableRequest.status"
                :options="['Active', 'Low Stock', 'Out of Stock', 'Draft']"
                placeholder="All Statuses"
              />

              <div class="d-flex gap-4">
                <BaseInput
                  label="Min Price"
                  v-model="tableRequest.minPrice"
                  currency
                  placeholder="0"
                />
                <BaseInput
                  label="Max Price"
                  v-model="tableRequest.maxPrice"
                  currency
                  placeholder="10000"
                />
              </div>

              <BaseCheckbox label="Show Archived" />
            </div>
          </template>

          <template #cell-status="{ val }">
            <span class="status-badge" :class="getStatusClass(val)">
              <span class="dot"></span>
              {{ val }}
            </span>
          </template>

          <template #cell-price="{ val }">
            <span class="font-bold text-primary">{{
              formatCurrency(val)
            }}</span>
          </template>

          <template #actions>
            <BaseButton variant="ghost" size="sm" icon="more_vert" />
          </template>
        </BaseTable>
      </div>
    </section>

    <!-- Charts & Data Visualization -->
    <section class="ds-section">
      <div class="d-flex justify-between items-end mb-6">
        <div>
          <h2>Charts & Data Visualization</h2>
          <p class="text-sm text-muted">
            Interactive charts with reactive data filtering. Try changing the
            date range!
          </p>
        </div>
        <div class="w-64">
          <BaseDatepicker
            label="Filter Period"
            v-model="chartFilterDate"
            range
            placeholder="Select date range"
          />
        </div>
      </div>

      <!-- Highlight Cards Row -->
      <div
        class="d-grid gap-4 mb-8"
        style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))"
      >
        <BaseHighlightCard
          label="Total Revenue"
          :value="metrics.revenue"
          unit="$"
          icon="payments"
          variant="emerald"
          :trend="12.5"
          trend-label="+12.5%"
          subtext="vs. previous period"
          subtext-intent="success"
        />
        <BaseHighlightCard
          label="Active Users"
          :value="metrics.users"
          icon="group"
          variant="blue"
          :trend="-2.4"
          trend-label="-2.4%"
          subtext="vs. previous period"
          subtext-intent="danger"
        />
        <BaseHighlightCard
          label="Avg. Session"
          :value="metrics.session"
          unit="m"
          icon="timer"
          variant="indigo"
          status="optimal"
          status-icon="check_circle"
          subtext="Above industry average"
          subtext-intent="success"
        />
        <BaseHighlightCard
          label="Bounce Rate"
          :value="metrics.bounce"
          unit="%"
          icon="call_missed_outgoing"
          variant="rose"
          :trend="0.8"
          trend-label="+0.8%"
          subtext="Needs attention"
          subtext-intent="danger"
        />
      </div>

      <!-- Charts Row -->
      <div
        class="d-grid gap-8"
        style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))"
      >
        <!-- Line Chart (Traffic) -->
        <BaseCard title="Traffic Trends" subtitle="Daily Visitors vs Pageviews">
          <div class="h-80 w-full">
            <BaseLineChart
              :data="simulatedTrafficData"
              category-key="date"
              :series-keys="{
                visitors: 'Unique Visitors',
                pageviews: 'Pageviews',
                sessions: 'Sessions',
              }"
              :is3d="false"
              height="100%"
              width="100%"
            />
          </div>
        </BaseCard>

        <!-- Bar Chart (Sales) -->
        <BaseCard
          title="Sales by Category"
          subtitle="Current vs Previous Month"
        >
          <div class="h-80 w-full">
            <BaseBarChart
              :data="simulatedCategoryData"
              category-key="category"
              :series-keys="{
                current: 'Current Period',
                previous: 'Previous Period',
              }"
              :is3d="false"
              height="100%"
              width="100%"
            />
          </div>
        </BaseCard>

        <!-- Pie Chart (Devices) -->
        <BaseCard title="Device Distribution" subtitle="User Access Points">
          <div class="h-80 w-full">
            <BasePieChart
              :data="simulatedDeviceData"
              label-key="device"
              value-key="count"
              donut
              height="100%"
              width="100%"
            />
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- Report Table -->
    <section class="ds-section">
      <h2>General Ledger Report</h2>
      <div class="d-grid" style="grid-template-columns: 1fr">
        <BaseCard title="Financial Report (Tree View)">
          <p class="text-sm text-muted mb-4">
            Features: Sticky Header,
            <strong>Resizable Sticky Left Axis</strong>, Expandable Rows. Try
            dragging the line right of "ACCOUNT" header.
          </p>

          <div
            style="
              overflow: hidden;
              border: 1px solid #e2e8f0;
              border-radius: 0.75rem;
            "
          >
            <BaseReportTable
              left-axis-title="ACCOUNT"
              :columns="reportColumns"
              :data="reportData"
            />
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- Audit Log Trail -->
    <section class="ds-section">
      <h2>Audit Log Trail</h2>
      <div
        class="d-grid gap-8"
        style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))"
      >
        <!-- Full version -->
        <BaseCard
          title="Full Version"
          subtitle="With search, metadata, and change diff"
        >
          <BaseAuditLog
            title="Activity Log"
            :logs="auditLogs"
            :show-search="true"
            :show-metadata="true"
            :group-by-date="true"
            :has-more="true"
            @load-more="() => {}"
          />
        </BaseCard>

        <!-- Compact version -->
        <BaseCard title="Compact Version" subtitle="For sidebar/detail panels">
          <BaseAuditLog
            :logs="auditLogs"
            :compact="true"
            :show-search="false"
            :show-metadata="false"
            :group-by-date="false"
          />
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseBadge ─────────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Badge</h2>
      <div class="d-grid">
        <BaseCard title="Variants & Sizes">
          <div class="d-flex flex-col gap-4">
            <div class="d-flex gap-2 flex-wrap items-center">
              <BaseBadge variant="primary">Primary</BaseBadge>
              <BaseBadge variant="secondary">Secondary</BaseBadge>
              <BaseBadge variant="success">Success</BaseBadge>
              <BaseBadge variant="warning">Warning</BaseBadge>
              <BaseBadge variant="danger">Danger</BaseBadge>
              <BaseBadge variant="info">Info</BaseBadge>
              <BaseBadge variant="neutral">Neutral</BaseBadge>
            </div>
            <div class="d-flex gap-2 flex-wrap items-center">
              <BaseBadge size="xs" variant="primary">XSmall</BaseBadge>
              <BaseBadge size="sm" variant="primary">Small</BaseBadge>
              <BaseBadge size="md" variant="primary">Medium</BaseBadge>
            </div>
            <div class="d-flex gap-2 flex-wrap items-center">
              <BaseBadge pill variant="success" icon="check"
                >Verified</BaseBadge
              >
              <BaseBadge pill variant="warning" dot>Pending</BaseBadge>
              <BaseBadge pill variant="danger" dot>Critical</BaseBadge>
              <BaseBadge pill variant="neutral">Draft</BaseBadge>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseTextarea ───────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Textarea</h2>
      <div class="d-grid">
        <BaseCard title="Examples">
          <div class="d-flex flex-col gap-4">
            <BaseTextarea
              v-model="dsTextarea"
              label="Description"
              placeholder="Write something..."
              hint="Minimum 20 characters."
              :rows="3"
            />
            <BaseTextarea
              v-model="dsTextareaMax"
              label="Message (with counter)"
              placeholder="Max 200 chars..."
              :maxlength="200"
              :rows="4"
            />
            <BaseTextarea
              v-model="dsTextareaErr"
              label="Notes"
              error="This field is required."
              :rows="3"
            />
            <BaseTextarea
              v-model="dsTextareaResize"
              label="Resizable"
              :resize="true"
              :rows="3"
            />
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseRadio ──────────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Radio Button</h2>
      <div class="d-grid">
        <BaseCard title="Radio Group">
          <div class="d-flex flex-col gap-3">
            <p class="text-sm text-muted mb-2">
              Selected: <strong>{{ dsRadio }}</strong>
            </p>
            <BaseRadio
              v-model="dsRadio"
              value="monthly"
              label="Monthly Billing"
              name="billing"
            />
            <BaseRadio
              v-model="dsRadio"
              value="yearly"
              label="Yearly Billing (Save 20%)"
              name="billing"
            />
            <BaseRadio
              v-model="dsRadio"
              value="lifetime"
              label="Lifetime Access"
              name="billing"
            />
            <BaseRadio
              v-model="dsRadio"
              value="disabled"
              label="Disabled Option"
              name="billing"
              disabled
            />
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseEmptyState ─────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Empty State</h2>
      <div
        class="d-grid"
        style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))"
      >
        <BaseCard>
          <BaseEmptyState
            icon="search_off"
            title="No results found"
            description="Try adjusting your search or filter criteria."
            variant="default"
          >
            <template #action
              ><BaseButton size="sm" variant="ghost"
                >Clear filters</BaseButton
              ></template
            >
          </BaseEmptyState>
        </BaseCard>
        <BaseCard>
          <BaseEmptyState
            icon="add_circle"
            title="No items yet"
            description="Create your first item to get started."
            variant="primary"
          >
            <template #action
              ><BaseButton size="sm" icon="add"
                >Create Item</BaseButton
              ></template
            >
          </BaseEmptyState>
        </BaseCard>
        <BaseCard>
          <BaseEmptyState
            icon="warning"
            title="Access denied"
            description="You don't have permission to view this."
            variant="warning"
            size="sm"
          />
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseTabs ───────────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Tabs</h2>
      <div class="d-flex flex-col gap-6">
        <BaseCard title="Line variant (default)">
          <BaseTabs v-model="dsTabLine" :tabs="dsTabs">
            <div v-if="dsTabLine === 'overview'" class="tab-panel">
              Overview content — analytics and summaries here.
            </div>
            <div v-if="dsTabLine === 'users'" class="tab-panel">
              Users panel — manage team members and permissions.
            </div>
            <div v-if="dsTabLine === 'settings'" class="tab-panel">
              Settings panel — configure your application.
            </div>
          </BaseTabs>
        </BaseCard>
        <BaseCard title="Pill variant">
          <BaseTabs v-model="dsTabPill" :tabs="dsTabsSimple" variant="pill">
            <div class="tab-panel mt-4">
              Active tab: <strong>{{ dsTabPill }}</strong>
            </div>
          </BaseTabs>
        </BaseCard>
        <BaseCard title="Card variant">
          <BaseTabs v-model="dsTabCard" :tabs="dsTabsSimple" variant="card">
            <div>
              Active tab: <strong>{{ dsTabCard }}</strong>
            </div>
          </BaseTabs>
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseStepper ────────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Stepper</h2>
      <div class="d-flex flex-col gap-6">
        <BaseCard title="Horizontal (interactive)">
          <BaseStepper v-model="dsStep" :steps="dsSteps" :clickable="true" />
          <div class="d-flex gap-2 mt-4">
            <BaseButton
              size="sm"
              variant="ghost"
              :disabled="dsStep === 0"
              icon="arrow_back"
              @click="dsStep--"
              >Back</BaseButton
            >
            <BaseButton
              size="sm"
              icon="arrow_forward"
              :disabled="dsStep >= dsSteps.length - 1"
              @click="dsStep++"
              >Next</BaseButton
            >
          </div>
        </BaseCard>
        <BaseCard title="Vertical">
          <BaseStepper
            v-model="dsStepV"
            :steps="dsStepsV"
            orientation="vertical"
          />
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseProgress ───────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Progress</h2>
      <div
        class="d-grid"
        style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))"
      >
        <BaseCard title="Linear">
          <div class="d-flex flex-col gap-4">
            <BaseProgress :value="72" label="Storage Used" variant="primary" />
            <BaseProgress
              :value="45"
              label="Tasks Done"
              variant="success"
              size="sm"
            />
            <BaseProgress
              :value="88"
              label="CPU Usage"
              variant="danger"
              size="lg"
              :striped="true"
              :animated="true"
            />
            <BaseProgress :value="60" label="Bandwidth" variant="warning" />
            <BaseProgress
              :value="30"
              label="Downloads"
              variant="secondary"
              size="xs"
            />
          </div>
        </BaseCard>
        <BaseCard title="Circular">
          <div class="d-flex gap-6 flex-wrap items-center justify-center">
            <BaseProgress
              :value="72"
              variant="primary"
              :circular="true"
              :circular-size="100"
              label="Revenue"
            />
            <BaseProgress
              :value="45"
              variant="success"
              :circular="true"
              :circular-size="100"
              label="Tasks"
            />
            <BaseProgress
              :value="88"
              variant="danger"
              :circular="true"
              :circular-size="100"
              label="CPU"
            />
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseSkeletonLoader ─────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Skeleton Loader</h2>
      <div
        class="d-grid"
        style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))"
      >
        <BaseCard title="Text block">
          <BaseSkeletonLoader type="text" :lines="4" />
        </BaseCard>
        <BaseCard title="Card scaffold">
          <BaseSkeletonLoader type="card" />
        </BaseCard>
        <BaseCard title="Mixed layout">
          <div class="d-flex gap-3 items-start mb-4">
            <BaseSkeletonLoader type="avatar" size="3rem" />
            <div style="flex: 1">
              <BaseSkeletonLoader type="text" :lines="2" />
            </div>
          </div>
          <BaseSkeletonLoader type="image" height="8rem" />
          <div class="d-flex gap-2 mt-3">
            <BaseSkeletonLoader type="button" width="6rem" />
            <BaseSkeletonLoader type="button" width="5rem" />
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseDrawer demo trigger ────────────────────────────────── -->
    <section class="ds-section">
      <h2>Drawer</h2>
      <div class="d-grid">
        <BaseCard title="Placement & Size">
          <div class="d-flex gap-3 flex-wrap">
            <BaseButton
              icon="arrow_back"
              variant="secondary"
              @click="
                dsDrawerPlacement = 'left';
                dsDrawer = true;
              "
              >Left</BaseButton
            >
            <BaseButton
              icon="arrow_forward"
              @click="
                dsDrawerPlacement = 'right';
                dsDrawer = true;
              "
              >Right (default)</BaseButton
            >
            <BaseButton
              icon="arrow_downward"
              variant="secondary"
              @click="
                dsDrawerPlacement = 'bottom';
                dsDrawer = true;
              "
              >Bottom Sheet</BaseButton
            >
          </div>
        </BaseCard>
      </div>
    </section>

    <BaseDrawer
      v-model:visible="dsDrawer"
      :placement="dsDrawerPlacement"
      title="Edit Record"
      subtitle="Update the details below"
      icon="edit"
    >
      <div class="d-flex flex-col gap-4">
        <BaseInput label="Full Name" model-value="Alex Rivera" />
        <BaseInput label="Email" type="email" model-value="alex@niceui.io" />
        <BaseTextarea
          label="Notes"
          model-value="Some notes here..."
          :rows="3"
        />
      </div>
      <template #footer>
        <BaseButton variant="ghost" @click="dsDrawer = false"
          >Cancel</BaseButton
        >
        <BaseButton @click="dsDrawer = false">Save Changes</BaseButton>
      </template>
    </BaseDrawer>

    <!-- ── BaseDivider ───────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Divider</h2>
      <div class="d-grid">
        <BaseCard title="Variants">
          <div class="d-flex flex-col gap-6">
            <div>
              <p class="text-muted text-sm mb-2">Solid</p>
              <BaseDivider />
            </div>
            <div>
              <p class="text-muted text-sm mb-2">Dashed</p>
              <BaseDivider variant="dashed" />
            </div>
            <div>
              <p class="text-muted text-sm mb-2">Dotted</p>
              <BaseDivider variant="dotted" />
            </div>
            <div>
              <p class="text-muted text-sm mb-2">Gradient</p>
              <BaseDivider variant="gradient" />
            </div>
            <div>
              <p class="text-muted text-sm mb-2">With Label</p>
              <BaseDivider label="OR" />
            </div>
            <div class="d-flex items-center gap-4" style="height: 80px">
              <span class="text-sm text-muted">Left</span>
              <BaseDivider orientation="vertical" />
              <span class="text-sm text-muted">Right</span>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseRating ────────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Rating</h2>
      <div class="d-grid">
        <BaseCard title="Interactive & Variants">
          <div class="d-flex flex-col gap-5">
            <div class="d-flex flex-col gap-2">
              <p class="text-muted text-sm">Interactive (v-model)</p>
              <BaseRating v-model="dsRating" show-value label="Your rating" />
            </div>
            <BaseDivider />
            <div class="d-flex flex-col gap-3">
              <BaseRating
                :model-value="4"
                variant="warning"
                readonly
                label="Warning (readonly)"
              />
              <BaseRating
                :model-value="3"
                variant="primary"
                readonly
                label="Primary"
                size="lg"
              />
              <BaseRating
                :model-value="5"
                variant="success"
                readonly
                label="Success"
                size="sm"
              />
              <BaseRating
                :model-value="2"
                variant="danger"
                readonly
                label="Danger"
                disabled
              />
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseOtpInput ──────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>OTP / PIN Input</h2>
      <div
        class="d-grid"
        style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))"
      >
        <BaseCard title="OTP — 6 digits">
          <div class="d-flex flex-col gap-4">
            <BaseOtpInput
              v-model="dsOtp"
              :length="6"
              label="Verification Code"
              hint="Enter the code from your authenticator app"
              @complete="(v) => console.log('OTP complete:', v)"
            />
            <p class="text-muted text-sm">
              Value: <strong>{{ dsOtp || "––" }}</strong>
            </p>
          </div>
        </BaseCard>
        <BaseCard title="PIN — 4 digits (masked)">
          <div class="d-flex flex-col gap-4">
            <BaseOtpInput
              v-model="dsPin"
              :length="4"
              label="Enter PIN"
              masked
              size="lg"
            />
            <BaseOtpInput
              v-model="dsOtp"
              :length="6"
              label="Error state"
              error="Invalid code. Please try again."
            />
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- ── BasePagination ────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Pagination</h2>
      <div class="d-grid">
        <BaseCard title="Interactive Pagination">
          <div class="d-flex flex-col gap-6">
            <div>
              <p class="text-muted text-sm mb-3">
                Standard — Page {{ dsPaginationPage }} of 20
              </p>
              <BasePagination
                v-model:current-page="dsPaginationPage"
                :total-pages="20"
                :total-items="387"
              />
            </div>
            <BaseDivider />
            <div>
              <p class="text-muted text-sm mb-3">With Jump to Page</p>
              <BasePagination
                v-model:current-page="dsPaginationPage"
                :total-pages="20"
                :total-items="387"
                :show-jump="true"
              />
            </div>
            <BaseDivider />
            <div>
              <p class="text-muted text-sm mb-3">Near boundaries</p>
              <BasePagination :current-page="1" :total-pages="8" />
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseAccordion ─────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Accordion</h2>
      <div
        class="d-grid"
        style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))"
      >
        <BaseCard title="Single Open">
          <BaseAccordion :items="dsAccordionItems" :default-open="['q1']" />
        </BaseCard>
        <BaseCard title="Multiple Open + Flush">
          <BaseAccordion
            :items="dsAccordionItems"
            :multiple="true"
            :flush="true"
            :default-open="['q1', 'q3']"
          />
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseTimeline ──────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Timeline</h2>
      <div
        class="d-grid"
        style="grid-template-columns: repeat(auto-fit, minmax(380px, 1fr))"
      >
        <BaseCard title="Detailed Timeline">
          <BaseTimeline :items="dsTimelineItems" />
        </BaseCard>
        <BaseCard title="Compact Timeline">
          <BaseTimeline :items="dsTimelineItems" variant="compact" />
        </BaseCard>
      </div>
    </section>

    <!-- ── BasePopover ───────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Popover</h2>
      <div class="d-grid">
        <BaseCard title="Positions & Triggers">
          <div
            class="d-flex flex-wrap gap-4 items-center"
            style="padding: 2rem 0"
          >
            <BasePopover position="top" title="Top Popover">
              <template #trigger>
                <BaseButton size="sm" variant="secondary"
                  >Top (click)</BaseButton
                >
              </template>
              This is a popover on the <strong>top</strong>. It supports rich
              HTML content.
            </BasePopover>

            <BasePopover position="bottom" title="Bottom Popover">
              <template #trigger>
                <BaseButton size="sm" variant="secondary">Bottom</BaseButton>
              </template>
              Popover positioned below the trigger element.
            </BasePopover>

            <BasePopover position="left" title="Left Popover">
              <template #trigger>
                <BaseButton size="sm" variant="secondary">Left</BaseButton>
              </template>
              Popover on the left side.
            </BasePopover>

            <BasePopover position="right" title="Right Popover">
              <template #trigger>
                <BaseButton size="sm" variant="secondary">Right</BaseButton>
              </template>
              Popover on the right side.
            </BasePopover>

            <BasePopover trigger="hover" title="Hover me!">
              <template #trigger>
                <BaseButton size="sm" variant="ghost" icon="info"
                  >Hover trigger</BaseButton
                >
              </template>
              This popover opens on hover instead of click.
            </BasePopover>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseColorPicker ───────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Color Picker</h2>
      <div
        class="d-grid"
        style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))"
      >
        <BaseCard title="Standard">
          <div class="d-flex flex-col gap-4">
            <BaseColorPicker
              v-model="dsColor"
              label="Brand Color"
              hint="Click the swatch to open the picker"
            />
            <p class="text-muted text-sm">
              Selected: <strong>{{ dsColor }}</strong>
            </p>
          </div>
        </BaseCard>
        <BaseCard title="Custom presets + Disabled">
          <div class="d-flex flex-col gap-4">
            <BaseColorPicker
              v-model="dsColor2"
              label="Chart Color"
              :presets="[
                '#6366f1',
                '#8b5cf6',
                '#ec4899',
                '#14b8a6',
                '#f59e0b',
                '#10b981',
                '#3b82f6',
                '#f43f5e',
                '#0ea5e9',
                '#a855f7',
              ]"
            />
            <BaseColorPicker v-model="dsColor" label="Disabled" disabled />
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- ── BaseStatCard ──────────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Stat Card</h2>
      <div
        class="d-grid"
        style="
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        "
      >
        <BaseStatCard
          label="Total Revenue"
          :value="128450000"
          icon="payments"
          variant="primary"
          :trend="12.5"
          suffix="IDR"
          description="vs. last month"
          :sparkline="[40, 55, 45, 70, 65, 80, 75, 90, 85, 100]"
          clickable
        />
        <BaseStatCard
          label="Active Users"
          :value="3842"
          icon="group"
          variant="success"
          :trend="8.3"
          description="registered this week"
          :sparkline="[20, 30, 25, 45, 50, 60, 55, 70]"
        />
        <BaseStatCard
          label="Pending Orders"
          :value="47"
          icon="hourglass_empty"
          variant="warning"
          :trend="-3.1"
          description="awaiting fulfillment"
          :sparkline="[70, 60, 65, 55, 50, 45, 48, 47]"
        />
        <BaseStatCard
          label="Refund Rate"
          :value="'2.4%'"
          icon="undo"
          variant="danger"
          :trend="-0.8"
          description="target: below 3%"
          :sparkline="[5, 4, 3.5, 4, 3, 2.8, 2.5, 2.4]"
        />
        <BaseStatCard
          label="Conversion Rate"
          :value="'18.7%'"
          icon="auto_graph"
          variant="secondary"
          :trend="1.2"
          description="page-to-purchase"
        />
        <BaseStatCard
          label="Support Tickets"
          :value="128"
          icon="support_agent"
          variant="neutral"
          :trend="5"
          description="open tickets"
        />
      </div>
    </section>

    <!-- ── BaseKanbanBoard ───────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Kanban Board</h2>
      <BaseCard title="Project Tasks" subtitle="Drag cards between columns">
        <BaseKanbanBoard
          v-model:columns="dsKanbanColumns"
          @move-card="
            (id, from, to) => console.log(`Moved ${id}: ${from} → ${to}`)
          "
        />
      </BaseCard>
    </section>

    <!-- ── BaseCalendarView ──────────────────────────────────────── -->
    <section class="ds-section">
      <h2>Calendar View</h2>
      <p class="text-sm text-muted mb-4">
        Three-view calendar (Yearly / Monthly / Daily) with schedule management
        and overlap detection. Click a month to drill down, click a date to see
        the daily timeline, click an empty time slot to add a schedule.
      </p>
      <BaseCalendarView
        v-model="dsCalendarDate"
        v-model:schedules="dsCalendarSchedules"
        v-model:view="dsCalendarView"
        :start-hour="7"
        :end-hour="22"
        :hour-height="64"
      />
      <div class="d-flex gap-4 mt-4 text-sm text-muted flex-wrap">
        <span
          >Selected:
          <strong class="text-primary">{{ dsCalendarDate }}</strong></span
        >
        <span
          >View:
          <strong class="text-primary">{{ dsCalendarView }}</strong></span
        >
        <span
          >Schedules:
          <strong class="text-primary">{{
            dsCalendarSchedules.length
          }}</strong></span
        >
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseHighlightCard from "@/components/Base/BaseHighlightCard.vue";
import BaseLineChart from "@/components/Base/BaseLineChart.vue";
import BaseBarChart from "@/components/Base/BaseBarChart.vue";
import BasePieChart from "@/components/Base/BasePieChart.vue";
import BaseAuditLog, {
  type AuditLogEntry,
} from "@/components/Base/BaseAuditLog.vue";
import BaseStepper, { type StepItem } from "@/components/Base/BaseStepper.vue";
import BaseProgress from "@/components/Base/BaseProgress.vue";
import BaseSkeletonLoader from "@/components/Base/BaseSkeletonLoader.vue";
import BaseDrawer from "@/components/Base/BaseDrawer.vue";
import BaseInput from "@/components/Base/BaseInput.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
// Batch 1 — 9 components
import BaseBadge from "@/components/Base/BaseBadge.vue";
import BaseTextarea from "@/components/Base/BaseTextarea.vue";
import BaseRadio from "@/components/Base/BaseRadio.vue";
import BaseEmptyState from "@/components/Base/BaseEmptyState.vue";
import BaseTabs, { type TabItem } from "@/components/Base/BaseTabs.vue";
// Batch 2 — 10 components
import BaseDivider from "@/components/Base/BaseDivider.vue";
import BaseRating from "@/components/Base/BaseRating.vue";
import BaseOtpInput from "@/components/Base/BaseOtpInput.vue";
import BasePagination from "@/components/Base/BasePagination.vue";
import BaseAccordion, {
  type AccordionItem,
} from "@/components/Base/BaseAccordion.vue";
import BaseTimeline, {
  type TimelineItem,
} from "@/components/Base/BaseTimeline.vue";
import BasePopover from "@/components/Base/BasePopover.vue";
import BaseColorPicker from "@/components/Base/BaseColorPicker.vue";
import BaseStatCard from "@/components/Base/BaseStatCard.vue";
import BaseKanbanBoard, {
  type KanbanColumn,
} from "@/components/Base/BaseKanbanBoard.vue";
import BaseCalendarView, {
  type CalendarSchedule,
  type CalendarViewMode,
} from "@/components/Base/BaseCalendarView.vue";

// ── New component demo state ────────────────────────────────────────────────
// Textarea
const dsTextarea = ref("");
const dsTextareaMax = ref("");
const dsTextareaErr = ref("");
const dsTextareaResize = ref("Resizable content here...");

// Radio
const dsRadio = ref("monthly");

// Tabs
const dsTabLine = ref("overview");
const dsTabPill = ref("all");
const dsTabCard = ref("all");

const dsTabs: TabItem[] = [
  {
    key: "overview",
    label: "Overview",
    icon: "bar_chart",
    badge: 3,
    badgeVariant: "primary",
  },
  { key: "users", label: "Users", icon: "group" },
  { key: "settings", label: "Settings", icon: "settings", disabled: false },
];
const dsTabsSimple: TabItem[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "archived", label: "Archived" },
];

// Stepper
const dsStep = ref(1);
const dsSteps: StepItem[] = [
  { label: "Account Info", description: "Name & email", icon: "person" },
  { label: "Plan", description: "Choose your plan", icon: "credit_card" },
  { label: "Review", description: "Confirm details" },
  { label: "Done", description: "Setup complete!", icon: "check_circle" },
];
const dsStepV = ref(2);
const dsStepsV: StepItem[] = [
  { label: "Order Placed", description: "March 9, 09:00" },
  { label: "Processing", description: "March 9, 10:30" },
  { label: "Shipped", description: "March 9, 14:00" },
  { label: "Delivered", description: "Pending" },
];

// Drawer
const dsDrawer = ref(false);
const dsDrawerPlacement = ref<"right" | "left" | "bottom">("right");

// ── Batch 2: State for 10 new components ───────────────────────────────────
const dsRating = ref(3);
const dsOtp = ref("");
const dsPin = ref("");
const dsPaginationPage = ref(5);
const dsColor = ref("#6366f1");
const dsColor2 = ref("#14b8a6");

const dsAccordionItems: AccordionItem[] = [
  {
    key: "q1",
    title: "What is NiceUI?",
    icon: "palette",
    content:
      "NiceUI is a comprehensive Vue 3 UI Kit with dark mode support and glassmorphism design, built for enterprise dashboards.",
  },
  {
    key: "q2",
    title: "How do I install it?",
    icon: "download",
    badge: "New",
    badgeVariant: "success",
    content:
      "Clone the repository and run pnpm install. All components are auto-imported via unplugin-vue-components.",
  },
  {
    key: "q3",
    title: "Is dark mode supported?",
    icon: "dark_mode",
    content:
      "Yes. Every component uses CSS variables that respond to the data-theme attribute on the html element.",
  },
  {
    key: "q4",
    title: "Can I customize colors?",
    icon: "format_color_fill",
    content:
      "Absolutely. Override the CSS variables in _theme.scss or pass a custom --primary-color via inline style.",
  },
];

const dsTimelineItems: TimelineItem[] = [
  {
    key: "login",
    title: "User logged in",
    description: "Session started from Jakarta, ID on Chrome/Windows.",
    time: "3 min ago",
    icon: "login",
    status: "success",
  },
  {
    key: "create",
    title: "Invoice INV-2026-089 created",
    description: "Invoice of Rp 4.500.000 created for PT. Maju Jaya.",
    time: "12 min ago",
    icon: "receipt_long",
    status: "info",
    badge: "Finance",
    badgeVariant: "primary",
  },
  {
    key: "approve",
    title: "Approval pending",
    description: "Waiting for manager approval before processing.",
    time: "1 hr ago",
    icon: "pending",
    status: "warning",
  },
  {
    key: "error",
    title: "Payment webhook failed",
    description: "Unable to reach payment gateway. Retry scheduled.",
    time: "2 hr ago",
    icon: "error",
    status: "danger",
  },
  {
    key: "old",
    title: "Account created",
    description: "User registered via email.",
    time: "3 days ago",
    icon: "person_add",
    status: "muted",
  },
];

const dsKanbanColumns = ref<KanbanColumn[]>([
  {
    key: "backlog",
    title: "Backlog",
    color: "#94a3b8",
    cards: [
      {
        id: "k1",
        title: "Setup authentication flow",
        description: "Integrate JWT + refresh token strategy.",
        priority: "high",
        tags: ["backend", "security"],
        assignee: "Rudi",
        dueDate: "Mar 15",
      },
      {
        id: "k2",
        title: "Design system audit",
        description: "Review all components for consistency.",
        priority: "low",
        tags: ["design"],
      },
    ],
  },
  {
    key: "inprogress",
    title: "In Progress",
    color: "#6366f1",
    cards: [
      {
        id: "k3",
        title: "BaseKanbanBoard component",
        description: "Build drag-and-drop kanban for NiceUI.",
        priority: "urgent",
        tags: ["frontend", "ui"],
        assignee: "Sari",
        dueDate: "Mar 10",
      },
      {
        id: "k4",
        title: "API rate limiting",
        priority: "medium",
        tags: ["backend"],
        assignee: "Budi",
      },
    ],
  },
  {
    key: "review",
    title: "In Review",
    color: "#f59e0b",
    cards: [
      {
        id: "k5",
        title: "Dark mode fixes",
        description: "Fix remaining hardcoded colors.",
        priority: "medium",
        tags: ["css"],
        dueDate: "Mar 9",
      },
    ],
  },
  {
    key: "done",
    title: "Done",
    color: "#22c55e",
    cards: [
      {
        id: "k6",
        title: "BaseProgress component",
        description: "Linear + circular progress indicators.",
        priority: "low",
        tags: ["ui"],
      },
    ],
  },
]);

// ── BaseCalendarView demo state ─────────────────────────────────────────────
const dsCalendarView = ref<CalendarViewMode>("monthly");
const dsCalendarDate = ref<string>("2026-04-29");
const dsCalendarSchedules = ref<CalendarSchedule[]>([
  {
    id: "cs1",
    title: "Team Standup",
    startDate: "2026-04-29",
    endDate: "2026-04-29",
    startTime: "09:00",
    endTime: "09:30",
    color: "#3b82f6",
    description: "Daily sync with engineering team.",
  },
  {
    id: "cs2",
    title: "Design Review",
    startDate: "2026-04-29",
    endDate: "2026-04-29",
    startTime: "09:15",
    endTime: "10:15",
    color: "#8b5cf6",
    description: "Review new UI components.",
  },
  {
    id: "cs3",
    title: "Sprint Planning",
    startDate: "2026-04-29",
    endDate: "2026-04-29",
    startTime: "11:00",
    endTime: "13:00",
    color: "#22c55e",
  },
  {
    id: "cs4",
    title: "Client Call",
    startDate: "2026-04-30",
    endDate: "2026-04-30",
    startTime: "14:00",
    endTime: "15:00",
    color: "#f59e0b",
  },
  {
    id: "cs5",
    title: "Code Review",
    startDate: "2026-05-02",
    endDate: "2026-05-02",
    startTime: "10:00",
    endTime: "11:00",
    color: "#06b6d4",
  },
  {
    id: "cs6",
    title: "1:1 with Manager",
    startDate: "2026-05-05",
    endDate: "2026-05-05",
    startTime: "15:00",
    endTime: "15:30",
    color: "#ec4899",
  },
]);

const now = new Date();
const minsAgo = (n: number) =>
  new Date(now.getTime() - n * 60000).toISOString();
const daysAgo = (n: number) =>
  new Date(now.getTime() - n * 86400000).toISOString();

const auditLogs: AuditLogEntry[] = [
  {
    id: 1,
    actor: "Budi Santoso",
    action: "login",
    description: "Logged in from a new device.",
    timestamp: minsAgo(3),
    metadata: {
      ip: "192.168.1.42",
      device: "Chrome / Windows",
      location: "Jakarta, ID",
    },
  },
  {
    id: 2,
    actor: "Rina Maharani",
    action: "create",
    resource: "Invoice #INV-2026-089",
    description: "Created a new invoice for client PT. Maju Jaya.",
    timestamp: minsAgo(18),
    metadata: { ip: "10.0.0.5", device: "Safari / macOS" },
  },
  {
    id: 3,
    actor: "Budi Santoso",
    action: "update",
    resource: "Invoice #INV-2026-089",
    description: "Updated payment method and due date.",
    timestamp: minsAgo(45),
    changes: [
      {
        field: "Payment Method",
        oldValue: "Bank Transfer",
        newValue: "Credit Card",
      },
      { field: "Due Date", oldValue: "10 Mar 2026", newValue: "20 Mar 2026" },
      {
        field: "Notes",
        oldValue: null,
        newValue: "Rush order, prioritize delivery",
      },
    ],
    metadata: { ip: "192.168.1.42", device: "Chrome / Windows" },
  },
  {
    id: 4,
    actor: "System",
    action: "export",
    resource: "Sales Report Q1 2026",
    description: "Automated monthly report exported to PDF.",
    timestamp: daysAgo(1),
    metadata: { ip: "127.0.0.1", device: "Scheduler" },
  },
  {
    id: 5,
    actor: "Admin",
    action: "approve",
    resource: "Leave Request #LVR-004",
    description: "Approved 3-day leave request for Rafi Pratama.",
    timestamp: daysAgo(1),
  },
  {
    id: 6,
    actor: "Rafi Pratama",
    action: "delete",
    resource: "Draft Order #ORD-TEMP-77",
    description: "Removed abandoned draft order from queue.",
    timestamp: daysAgo(2),
    metadata: { ip: "10.0.1.99", device: "Mobile / Android" },
  },
  {
    id: 7,
    actor: "Rina Maharani",
    action: "logout",
    timestamp: daysAgo(2),
    metadata: { ip: "10.0.0.5", device: "Safari / macOS" },
  },
];

const uiStore = useUIStore();
const router = useRouter();

// -- Simulation Logic for Charts --
const chartFilterDate = ref({ start: "2026-01-01", end: "2026-01-07" });

// Reactive metrics simulating data fetch
const metrics = computed(() => {
  // Generate a seed based on the sum of characters in the date string to ensure it changes
  const startStr = chartFilterDate.value?.start || "";
  const endStr = chartFilterDate.value?.end || "";

  const seed = (startStr + endStr)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return {
    revenue: (13450 + (seed % 1000) * 10).toLocaleString(),
    users: (8932 + (seed % 500) * 5).toLocaleString(),
    session: (4.2 + (seed % 20) / 10).toFixed(1),
    bounce: (42.5 + (seed % 100) / 10).toFixed(1),
  };
});

// Mock Data Generators that react to "Date Range" changes (simulation)
const simulatedTrafficData = computed(() => {
  const start = chartFilterDate.value?.start
    ? new Date(chartFilterDate.value.start)
    : new Date("2026-01-01");
  const end = chartFilterDate.value?.end
    ? new Date(chartFilterDate.value.end)
    : new Date(start);

  // Ensure end is at least start
  if (end < start) end.setDate(start.getDate());

  // Calculate days difference
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day

  // Cap at 31 days for demo performance if needed, but dynamic is better
  const daysToGenerate = Math.min(diffDays, 60);

  const data = [];

  for (let i = 0; i < daysToGenerate; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    // Pseudo-random based on date
    const base = 100 + ((d.getDate() * 15 + d.getMonth() * 50) % 200);

    data.push({
      date: dateStr,
      visitors: base + Math.floor(Math.random() * 50),
      pageviews: base * 2 + Math.floor(Math.random() * 100),
      sessions: base + Math.floor(Math.random() * 30),
    });
  }
  return data;
});

const simulatedCategoryData = computed(() => {
  const startStr = chartFilterDate.value?.start || "";
  const endStr = chartFilterDate.value?.end || "";
  const seed = (startStr + endStr)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const mod = seed % 50;

  return [
    {
      category: "Electronics",
      current: 450 + mod * 5,
      previous: 400 + mod * 2,
    },
    { category: "Fashion", current: 320 + mod * 3, previous: 350 - mod },
    { category: "Home", current: 210 + mod * 4, previous: 180 + mod * 2 },
    { category: "Sports", current: 150 + mod * 2, previous: 120 + mod },
  ];
});

const simulatedDeviceData = computed(() => {
  const startStr = chartFilterDate.value?.start || "";
  const endStr = chartFilterDate.value?.end || "";
  const seed = (startStr + endStr)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return [
    { device: "Desktop", count: 60 + (seed % 40) },
    { device: "Mobile", count: 30 + (seed % 30) },
    { device: "Tablet", count: 10 + (seed % 10) },
  ];
});

// ...
const singleCheckbox = ref(false);
const multiCheckbox = ref(["Apple"]);
const uploadedFile = ref<File | null>(null);
const importFile = ref<File | null>(null);
const galleryFiles = ref<(File | string)[]>([]);

const triggerGlobalLoader = () => {
  uiStore.startLoading("Simulating System Process...");
  setTimeout(() => {
    uiStore.stopLoading();
  }, 3000);
};

const triggerAlert = (variant: "success" | "warning" | "danger" | "info") => {
  uiStore.showAlert({
    title: variant.charAt(0).toUpperCase() + variant.slice(1),
    message: "This is a global system alert that closes automatically.",
    variant: variant,
    autoClose: true,
  });
};

const triggerPersistentAlert = () => {
  uiStore.showAlert({
    title: "Persistent Alert",
    message: "This alert will not close until you click the close button.",
    variant: "info",
    autoClose: false,
  });
};

const triggerToast = (variant: "success" | "warning" | "danger" | "info") => {
  uiStore.showToast({
    title: "Notification",
    message: `This is a ${variant} toast message.`,
    variant: variant,
    duration: 3000,
  });
};

const triggerRandomToast = () => {
  const variants = ["success", "warning", "danger", "info"] as const;
  const randomVariant = variants[Math.floor(Math.random() * variants.length)];
  triggerToast(randomVariant!);
};

const inputText = ref("");
const salaryInput = ref("");
const phoneInput = ref("");
const ccInput = ref("");
const dateMaskInput = ref("");
const percentInput = ref("");
const showModal = ref(false);
const showFormModal = ref(false);
const selectedRows = ref<any[]>([]);

watch(selectedRows, (newVal) => {
  console.log("Selected rows:", newVal);
});

// Form Component State
const selectedRole = ref("");
const selectedCountry = ref("");
const selectedMulti = ref<string[]>([]);
const countryOptions = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Australia",
  "Indonesia",
  "Singapore",
];

const selectedAsync = ref("");
const asyncOptions = ref<string[]>([]);
const isLoading = ref(false);

const handleAsyncSearch = (query: string) => {
  if (!query) {
    asyncOptions.value = [];
    return;
  }

  isLoading.value = true;
  // Simulate API call
  setTimeout(() => {
    asyncOptions.value = [
      `${query} Result A`,
      `${query} Result B`,
      `${query} Result C`,
    ];
    isLoading.value = false;
  }, 1000);
};

const switches = reactive({
  email: true,
  sms: false,
  push: true,
});
const dateValue = ref("");
const dateRangeValue = ref({ start: "", end: "" });
const dsDatetime = ref("");
const dsTimePicker = ref("09:30");
const dsTimePickerStep15 = ref("10:00");

const handleDismiss = () => {
  // alert('Dismissed!');
};

const tableColumns = [
  { key: "name", label: "Product Name", sortable: true },
  { key: "sku", label: "SKU" },
  { key: "status", label: "Status" },
  { key: "inventory", label: "Inventory" },
  { key: "price", label: "Price", align: "right", sortable: true },
];

const getStatusClass = (status: string) => {
  switch (status) {
    case "Active":
      return "status-active";
    case "Low Stock":
      return "status-warning";
    case "Out of Stock":
      return "status-danger";
    case "Draft":
      return "status-neutral";
    default:
      return "status-neutral";
  }
};

// -- Advanced Table Simulation Logic --
import { tableHelper } from "@/composables/useTableHelper";
import BaseReportTable from "@/components/Base/BaseReportTable.vue";

const rawAdvancedData = [
  {
    id: 1,
    name: "Quantum Processor v9",
    sku: "QP-9000-X",
    status: "Active",
    inventory: "342 in stock",
    price: 12990000,
  },
  {
    id: 2,
    name: "Neural Interface Link",
    sku: "NI-L200-Z",
    status: "Low Stock",
    inventory: "12 in stock",
    price: 8495000,
  },
  {
    id: 3,
    name: "Synapse Array Mod",
    sku: "SA-M150-A",
    status: "Active",
    inventory: "1,240 in stock",
    price: 2400000,
  },
  {
    id: 4,
    name: "Haptic Feedback Unit",
    sku: "HF-U001-B",
    status: "Out of Stock",
    inventory: "0 in stock",
    price: 125000,
  },
  {
    id: 5,
    name: "Cortex Memory Module",
    sku: "CM-M512-Y",
    status: "Draft",
    inventory: "Pending",
    price: 450000,
  },
  {
    id: 6,
    name: "Cybernetic Arm v2",
    sku: "CA-V200-M",
    status: "Active",
    inventory: "50 in stock",
    price: 3500000,
  },
  {
    id: 7,
    name: "Optical Implant Gen 4",
    sku: "OI-G400-S",
    status: "Active",
    inventory: "89 in stock",
    price: 1200000,
  },
  {
    id: 8,
    name: "Subdermal Plating",
    sku: "SP-T100-R",
    status: "Low Stock",
    inventory: "5 in stock",
    price: 800000,
  },
  {
    id: 9,
    name: "Neuro-Link Cable",
    sku: "NL-C050-U",
    status: "Active",
    inventory: "500 in stock",
    price: 50000,
  },
  {
    id: 10,
    name: "Bio-Monitor Watch",
    sku: "BM-W001-P",
    status: "Active",
    inventory: "200 in stock",
    price: 250000,
  },
  {
    id: 11,
    name: "Exoskeleton Frame (Light)",
    sku: "EF-L100-E",
    status: "Draft",
    inventory: "Pending",
    price: 5000000,
  },
  {
    id: 12,
    name: "Plasma Cutter Tool",
    sku: "PC-T500-H",
    status: "Out of Stock",
    inventory: "0 in stock",
    price: 450000,
  },
];

const advancedTableData = ref<any[]>([]);
const isTableLoading = ref(false);
const tablePagination = ref({
  currentPage: 1,
  total: 0,
  perPage: 5,
  lastPage: 1,
});

const tableRequest = reactive({
  page: 1,
  show: 5,
  sortBy: "name",
  sortDirection: "asc" as "asc" | "desc",
  search: "",
  status: "",
  minPrice: "",
  maxPrice: "",
});

const mockGetData = async () => {
  isTableLoading.value = true;

  // Simulate API Latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  let filtered = [...rawAdvancedData];

  // Filter by Status
  if (tableRequest.status) {
    filtered = filtered.filter((item) => item.status === tableRequest.status);
  }

  // Filter by Search
  if (tableRequest.search) {
    const lowerQ = tableRequest.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQ) ||
        item.sku.toLowerCase().includes(lowerQ),
    );
  }

  // Filter by Price Range
  const minPrice = parseNumber(tableRequest.minPrice);
  const maxPrice = parseNumber(tableRequest.maxPrice);

  if (minPrice > 0 || maxPrice > 0) {
    filtered = filtered.filter((item) => {
      const price = item.price;
      const matchesMin = minPrice > 0 ? price >= minPrice : true;
      const matchesMax = maxPrice > 0 ? price <= maxPrice : true;
      return matchesMin && matchesMax;
    });
  }

  // Sort
  filtered.sort((a: any, b: any) => {
    const valA = a[tableRequest.sortBy];
    const valB = b[tableRequest.sortBy];
    if (valA < valB) return tableRequest.sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return tableRequest.sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const total = filtered.length;
  const start = (tableRequest.page - 1) * tableRequest.show;
  const end = start + tableRequest.show;

  advancedTableData.value = filtered.slice(start, end);
  tablePagination.value = {
    currentPage: tableRequest.page,
    total,
    perPage: tableRequest.show,
    lastPage: Math.ceil(total / tableRequest.show),
  };

  isTableLoading.value = false;
};

const helper = tableHelper(tableRequest, mockGetData);

// Expose helper methods to template
const handleAdvancedPageChange = helper.setPage;
const handleShowChange = helper.setShow;
const handleSearchChange = helper.setSearch;
const handleSortChange = (key: string) =>
  helper.setSort(key, tableRequest.sortDirection);

const resetFilters = () => {
  tableRequest.status = "";
  tableRequest.minPrice = "";
  tableRequest.maxPrice = "";
  handleAdvancedPageChange(1);
};

// Report Table Data
const reportColumns = [
  { key: "jan", label: "Jan 2024", align: "right" as const },
  { key: "feb", label: "Feb 2024", align: "right" as const },
  { key: "mar", label: "Mar 2024", align: "right" as const },
  { key: "total", label: "FY Total", align: "right" as const },
];

const reportData = [
  {
    id: "assets",
    label: "Assets",
    children: [
      {
        id: "current_assets",
        label: "Current Assets",
        children: [
          {
            id: "cash",
            label: "Cash & Equivalents",
            jan: "15,000",
            feb: "12,500",
            mar: "18,200",
            total: "45,700",
          },
          {
            id: "ar",
            label: "Accounts Receivable",
            jan: "8,200",
            feb: "9,100",
            mar: "7,500",
            total: "24,800",
          },
        ],
      },
      {
        id: "fixed_assets",
        label: "Fixed Assets",
        children: [
          {
            id: "eq",
            label: "Equipment",
            jan: "45,000",
            feb: "45,000",
            mar: "44,500",
            total: "134,500",
          },
          {
            id: "prop",
            label: "Property",
            jan: "120,000",
            feb: "120,000",
            mar: "120,000",
            total: "360,000",
          },
        ],
      },
    ],
  },
  {
    id: "liabilities",
    label: "Liabilities",
    children: [
      {
        id: "ap",
        label: "Accounts Payable",
        jan: "(5,000)",
        feb: "(4,200)",
        mar: "(6,100)",
        total: "(15,300)",
      },
      {
        id: "loans",
        label: "Loans",
        jan: "(20,000)",
        feb: "(19,500)",
        mar: "(19,000)",
        total: "(58,500)",
      },
    ],
  },
];

// Initial Load
mockGetData();
</script>

<route lang="yaml">
meta:
  layout: dashboard
  breadcrumb:
    - name: Home
      route: /
    - name: Design System
      route: null
</route>

<style lang="scss" scoped>
@use "@/assets/styles/component_mixins" as *;

.design-system-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: var(--bg-gradient);
  min-height: 100vh;
}

.ds-section {
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    &::after {
      content: "";
      flex: 1;
      height: 1px;
      background: var(--border-light);
    }
  }
}

.modal-preview-content {
  background: var(--surface-glass);
  backdrop-filter: blur(4px);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-glass);
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;

    .label {
      color: var(--text-secondary);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .value {
      color: var(--text-primary);
      font-weight: 600;
    }
  }

  .divider {
    height: 1px;
    background: var(--border-light);
    width: 100%;
  }
}

.active-filter {
  background: var(--surface-white) !important;
  color: var(--text-primary) !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.status-badge {
  @include status-badge;
}
</style>
