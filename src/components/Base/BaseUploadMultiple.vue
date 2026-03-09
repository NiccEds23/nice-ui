<template>
  <div class="base-upload-multiple-wrapper">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
      <span v-if="maxFiles" class="limit-text">({{ modelValue.length }}/{{ maxFiles }})</span>
    </label>

    <!-- Drop Area -->
    <div 
      class="upload-area"
      :class="{ 'drag-active': isDragging, 'disabled': isLimitReached }"
      @dragenter.prevent="handleDragEnter"
      @dragleave.prevent="handleDragLeave"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="triggerInput"
    >
      <div class="placeholder-content">
        <span class="material-symbols-outlined icon">{{ isLimitReached ? 'block' : 'cloud_upload' }}</span>
        <p class="text">{{ isLimitReached ? 'Maximum files reached' : 'Click or drag files to upload' }}</p>
        <p class="sub-text" v-if="!isLimitReached && accept">Supported: {{ acceptFormatted }}</p>
        <p class="sub-text" v-else-if="isLimitReached">Remove files to upload more</p>
      </div>
    </div>

    <!-- Hidden Input -->
    <input 
      type="file" 
      ref="fileInputRef" 
      class="hidden-input"
      :accept="accept"
      multiple
      @change="handleFileSelect"
      style="display: none;"
    />

    <!-- File List -->
    <TransitionGroup name="list" tag="div" class="file-list" v-if="modelValue.length > 0">
      <div v-for="(file, index) in modelValue" :key="getFileKey(file, index)" class="file-item">
        
        <!-- Preview -->
        <div 
            class="file-preview-icon" 
            :class="{ 'clickable': isImage(file) }"
            @click="openPreview(file)"
        >
            <template v-if="isImage(file)">
                <img :src="getPreviewUrl(file)" alt="preview" class="thumb-img" />
                <div class="hover-overlay">
                    <span class="material-symbols-outlined">visibility</span>
                </div>
            </template>
            <span v-else class="material-symbols-outlined icon">description</span>
        </div>

        <!-- Info -->
        <div class="file-info">
          <p class="file-name">{{ getFileName(file) }}</p>
          <p class="file-size">{{ getFileSize(file) }}</p>
        </div>

        <!-- Actions -->
        <button class="remove-btn" @click="removeFile(index)" type="button">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </TransitionGroup>

    <!-- Preview Modal -->
    <BaseModal v-model:visible="showPreview" size="lg" :show-close="true">
        <div class="preview-modal-content">
            <img :src="previewSrc" alt="Full Preview" class="full-preview-img" />
        </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType, onUnmounted } from 'vue';
import BaseModal from '@/components/Base/BaseModal.vue';

const props = defineProps({
  modelValue: { 
    type: Array as PropType<(File | string)[]>, 
    default: () => [] 
  },
  label: { type: String, default: '' },
  accept: { type: String, default: '' },
  required: { type: Boolean, default: false },
  maxFiles: { type: Number, default: 0 } // 0 = unlimited
});

const emit = defineEmits(['update:modelValue']);

// Preview Modal State
const showPreview = ref(false);
const previewSrc = ref('');

const openPreview = (file: File | string) => {
    if (!isImage(file)) return;
    previewSrc.value = getPreviewUrl(file);
    showPreview.value = true;
};


const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const acceptFormatted = computed(() => {
  return props.accept.replace(/,/g, ', ').toUpperCase();
});

const isLimitReached = computed(() => {
    return props.maxFiles > 0 && props.modelValue.length >= props.maxFiles;
});

const triggerInput = () => {
    if (isLimitReached.value) return;
    fileInputRef.value?.click();
};

const handleDragEnter = () => {
    if (!isLimitReached.value) isDragging.value = true;
};

const handleDragLeave = () => {
    isDragging.value = false;
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    addFiles(Array.from(input.files));
  }
  // Reset input
  input.value = '';
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (isLimitReached.value) return;
  
  const files = event.dataTransfer?.files;
  if (files) {
    addFiles(Array.from(files));
  }
};

const addFiles = (newFiles: File[]) => {
    let updatedList = [...props.modelValue];
    const slotsRemaining = props.maxFiles > 0 ? props.maxFiles - updatedList.length : newFiles.length;
    if (slotsRemaining <= 0) return;

    const filesToAdd = newFiles.slice(0, slotsRemaining);
    updatedList = [...updatedList, ...filesToAdd];
    emit('update:modelValue', updatedList);
};

const removeFile = (index: number) => {
    const updatedList = [...props.modelValue];
    updatedList.splice(index, 1);
    emit('update:modelValue', updatedList);
};

// Utils
const getFileKey = (file: File | string, index: number) => {
    if (typeof file === 'string') return file + index;
    return file.name + file.size + index;
};

const isImage = (file: File | string) => {
    if (typeof file === 'string') {
        return /\.(jpeg|jpg|gif|png|webp)$/i.test(file) || file.startsWith('data:image');
    }
    return file.type.startsWith('image/');
};

const getFileName = (file: File | string) => {
    if (typeof file === 'string') return file.split('/').pop() || 'File';
    return file.name;
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileSize = (file: File | string) => {
    if (typeof file === 'string') return '';
    return formatSize(file.size);
};

// Start Object URL Manager
const fileUrlMap = new WeakMap<File, string>();
const objectUrls = ref<string[]>([]);

const getObjectUrlForFile = (file: File) => {
    if (fileUrlMap.has(file)) {
        return fileUrlMap.get(file)!;
    }
    const url = URL.createObjectURL(file);
    fileUrlMap.set(file, url);
    objectUrls.value.push(url);
    return url;
};

const getPreviewUrl = (file: File | string) => {
    if (typeof file === 'string') return file;
    return getObjectUrlForFile(file);
};

onUnmounted(() => {
    objectUrls.value.forEach(url => URL.revokeObjectURL(url));
});
</script>



<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/component_mixins' as *;

.base-upload-multiple-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.input-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $text-secondary;
  margin-left: 0.25rem;
  display: flex;
  justify-content: space-between;
}

.upload-area {
  @include upload-area;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: $neutral-50;
  }

  .placeholder-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: $text-secondary;
    
    .icon { font-size: 2.5rem; opacity: 0.5; }
    .text { font-weight: 500; font-size: 0.9rem; }
    .sub-text { font-size: 0.75rem; opacity: 0.7; }
  }
}

.file-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid $neutral-200;
  border-radius: 0.75rem;
  transition: all 0.2s;
  
  &:hover {
    border-color: $primary-200;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .file-preview-icon {
    width: 3rem;
    height: 3rem;
    flex-shrink: 0;
    border-radius: 0.5rem;
    overflow: hidden;
    background: $neutral-50;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $neutral-100;
    position: relative; // For overlay

    &.clickable {
        cursor: pointer;
        
        &:hover .hover-overlay {
            opacity: 1;
        }
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
        
        .material-symbols-outlined {
            font-size: 1.5rem;
        }
    }

    .thumb-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .icon {
        font-size: 1.5rem;
        color: $neutral-400;
    }
  }

  .file-info {
    flex: 1;
    min-width: 0; // Truncate text fix
    
    .file-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: $neutral-800;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .file-size {
        font-size: 0.75rem;
        color: $neutral-500;
        margin-top: 0.125rem;
    }
  }

  .remove-btn {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: $neutral-400;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &:hover {
        background: rgba($status-danger, 0.1);
        color: $status-danger;
    }
  }
}

// List Transitions
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
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
