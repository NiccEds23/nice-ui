<template>
  <BaseModal 
    :visible="visible" 
    :title="title" 
    size="md" 
    icon="filter_alt" 
    icon-color="indigo"
    @close="$emit('close'); $emit('update:visible', false)"
  >
    <div class="filter-form">
      <slot></slot>
    </div>

    <template #footer>
      <div class="d-flex gap-4 w-full">
        <BaseButton 
          variant="ghost" 
          block 
          @click="reset"
        >
          Reset
        </BaseButton>
        <BaseButton 
          variant="primary" 
          block 
          @click="apply"
        >
          Apply Filters
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/Base/BaseModal.vue';
import BaseButton from '@/components/Base/BaseButton.vue';

const props = defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, default: 'Advanced Filters' }
});

const emit = defineEmits(['update:visible', 'apply', 'reset', 'close']);

const apply = () => {
  emit('apply');
  emit('update:visible', false);
};

const reset = () => {
  emit('reset');
  // Optional: Don't close on reset, or let parent decide
};
</script>

<style lang="scss" scoped>
.filter-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  text-align: left;
}
</style>
