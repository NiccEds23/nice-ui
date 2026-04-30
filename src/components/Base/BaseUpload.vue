<template>
  <div class="base-upload-wrapper">
    <label v-if="label && mode === 'field'" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <!-- Field Mode (Drag & Drop) -->
    <div 
      v-if="mode === 'field'" 
      class="upload-area"
      :class="{ 'drag-active': isDragging }"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="triggerInput"
    >
      <div v-if="!modelValue" class="placeholder-content">
        <span class="material-symbols-outlined icon">cloud_upload</span>
        <p class="text">Click or drag file to upload</p>
        <p class="sub-text" v-if="accept">Supported: {{ acceptFormatted }}</p>
      </div>
      
      <div v-else class="file-preview">
        <div v-if="previewUrl" class="image-preview-wrapper clickable" @click.stop="openPreview">
            <img :src="previewUrl" alt="Preview" class="image-preview" />
            <div class="hover-overlay">
                <span class="material-symbols-outlined">visibility</span>
            </div>
        </div>
        <span v-else class="material-symbols-outlined file-icon">description</span>
        
        <div class="file-info">
          <p class="file-name">{{ fileName }}</p>
          <p class="file-size" v-if="fileSize">{{ fileSize }}</p>
        </div>
        <button class="remove-btn" @click.stop="removeFile">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>

    <!-- Button Mode -->
    <div v-else class="upload-button-wrapper">
      <input 
        type="file" 
        ref="fileInput" 
        class="hidden-input"
        :accept="accept"
        @change="handleFileSelect"
      />
      <button class="upload-btn" @click="triggerInput">
        <span class="material-symbols-outlined">upload_file</span>
        {{ label || 'Upload File' }}
      </button>
      <div v-if="modelValue" class="selected-file-wrapper">
         <span class="selected-file-name">{{ fileName }}</span>
         <button class="remove-btn-mini" @click="removeFile" title="Remove file">
            <span class="material-symbols-outlined">close</span>
         </button>
      </div>
    </div>

    <input 
      type="file" 
      ref="fileInputRef" 
      class="hidden-input"
      :accept="accept"
      @change="handleFileSelect"
      style="display: none;"
    />

    <!-- Preview Modal -->
    <BaseModal v-model:visible="showPreview" size="lg" :show-close="true">
        <div class="preview-modal-content">
            <img :src="previewUrl || undefined" alt="Full Preview" class="full-preview-img" />
        </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch, type PropType } from 'vue';
import BaseModal from '@/components/Base/BaseModal.vue';

const props = defineProps({
  modelValue: { type: [Object, String] as PropType<File | string | null>, default: null },
  label: { type: String, default: '' },
  accept: { type: String, default: '' }, // e.g. "image/*,.pdf"
  mode: { type: String, default: 'field', validator: (v: string) => ['field', 'button'].includes(v) },
  required: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

// Preview State
const showPreview = ref(false);
const openPreview = () => {
    if (previewUrl.value) {
        showPreview.value = true;
    }
};

const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const localPreviewUrl = ref<string | null>(null);

const acceptFormatted = computed(() => {
  return props.accept.replace(/,/g, ', ').toUpperCase();
});

// Calculate Preview URL
const previewUrl = computed(() => {
    if (typeof props.modelValue === 'string') {
        return props.modelValue;
    }
    if (props.modelValue instanceof File && props.modelValue.type.startsWith('image/')) {
        // Revoke old URL if exists to prevent leak?
        // Ideally we watch modelValue -> set local ref
        // For simple computed, createObjectURL might be called repeatedly if deps change.
        // Better to use a watcher or just direct usage if careful.
        // Let's rely on a separate watcher to handle object URL creation/revocation cleanly.
        return localPreviewUrl.value;
    }
    return null;
});

// File Name
const fileName = computed(() => {
    if (typeof props.modelValue === 'string') {
        return props.modelValue.split('/').pop() || 'Existing File';
    }
    if (props.modelValue instanceof File) {
        return props.modelValue.name;
    }
    return '';
});

// File Size
const fileSize = computed(() => {
    if (props.modelValue instanceof File) {
        return formatSize(props.modelValue.size);
    }
    return ''; // Unknown size for URL
});

watch(() => props.modelValue, (newVal, oldVal) => {
    // Clean up old object URL if needed
    if (oldVal instanceof File && localPreviewUrl.value && !newVal) {
        URL.revokeObjectURL(localPreviewUrl.value);
        localPreviewUrl.value = null;
    }

    if (newVal instanceof File && newVal.type.startsWith('image/')) {
        localPreviewUrl.value = URL.createObjectURL(newVal);
    } else if (typeof newVal === 'string') {
        localPreviewUrl.value = newVal;
    } else {
        localPreviewUrl.value = null;
    }
}, { immediate: true });

onUnmounted(() => {
    if (localPreviewUrl.value && props.modelValue instanceof File) {
        URL.revokeObjectURL(localPreviewUrl.value);
    }
});

const triggerInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    emit('update:modelValue', files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    emit('update:modelValue', files[0]);
  }
};

const removeFile = () => {
  emit('update:modelValue', null);
  if (fileInputRef.value) fileInputRef.value.value = '';
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/component_mixins' as *;

.base-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.input-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $text-secondary; // #64748b
  margin-left: 0.25rem;
}

.upload-area {
  @include upload-area;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;

  .placeholder-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: $text-secondary; // #64748b
    
    .icon { font-size: 3rem; opacity: 0.5; }
    .text { font-weight: 500; }
    .sub-text { font-size: 0.75rem; opacity: 0.7; }
  }

  .file-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.6);
    padding: 1rem;
    border-radius: 1rem;
    width: 100%;
    
    .file-icon { font-size: 2rem; color: $status-info; } // #3b82f6

    .image-preview-wrapper {
        width: 7rem;
        height: 7rem;
        flex-shrink: 0;
        border-radius: 0.5rem;
        overflow: hidden;
        border: 1px solid $neutral-200;
        position: relative; // For overlay
        
        &.clickable {
            cursor: pointer;
            &:hover .hover-overlay { opacity: 1; }
        }

        .hover-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;
            color: white;
            backdrop-filter: blur(2px);
        }
        
        .image-preview {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    
    .file-info {
      flex: 1;
      min-width: 0;
      text-align: left;
      overflow: hidden;

      .file-name {
        font-weight: 600;
        color: $text-primary;
        font-size: 0.875rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .file-size { font-size: 0.75rem; color: $text-secondary; }
    }

    .remove-btn {
      flex-shrink: 0;
      background: rgba($status-danger, 0.1);
      color: $status-danger;
      border: none;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover { background: rgba($status-danger, 0.2); }
    }
  }
}

.upload-button-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  input{
    display: none;
  }
  
  .upload-btn {
    @include btn-base;
    @include btn-secondary;
  }
  
  .selected-file-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .selected-file-name {
     font-size: 0.875rem;
     color: $neutral-600; // #475569
  }
  
  .remove-btn-mini {
      background: transparent;
      border: none;
      cursor: pointer;
      color: $neutral-400;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 1.5rem;
      height: 1.5rem;
      transition: all 0.2s;
      
      span {
          font-size: 1.25rem;
      }
      
      &:hover {
          color: $status-danger;
          background: rgba($status-danger, 0.1);
      }
  }

}

.preview-modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  
  .full-preview-img {
    max-width: 100%;
    max-height: 80vh;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
}
</style>
