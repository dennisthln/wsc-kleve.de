<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  value?: string | null
  blockIndex: number
  path: Array<string | number>
  tag?: string
  multiline?: boolean
  class?: any
}>(), {
  value: '',
  tag: 'div',
  multiline: false,
  class: undefined,
})

const { editMode, selectBlock, updateBlockValue, user } = usePayloadCms()

const elementRef = ref<HTMLElement | null>(null)
const localValue = ref(props.value ?? '')
const isFocused = ref(false)

const isEditable = computed(() => editMode.value && !!user.value)

watch(
  () => props.value,
  (value) => {
    if (isFocused.value) {
      return
    }

    localValue.value = value ?? ''
    if (elementRef.value && elementRef.value.innerText !== localValue.value) {
      elementRef.value.innerText = localValue.value
    }
  },
  { immediate: true },
)

const commit = () => {
  updateBlockValue(props.blockIndex, props.path, localValue.value)
}

const handleFocus = () => {
  isFocused.value = true
  selectBlock(props.blockIndex)
}

const handleInput = (event: Event) => {
  localValue.value = (event.target as HTMLElement).innerText
}

const handleBlur = () => {
  isFocused.value = false
  commit()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.multiline && event.key === 'Enter') {
    event.preventDefault()
    ;(event.target as HTMLElement).blur()
  }
}
</script>

<template>
  <component
    :is="tag"
    ref="elementRef"
    :class="[props.class, { 'cms-editable-inline': isEditable, 'is-multiline': multiline }]"
    :contenteditable="isEditable"
    :spellcheck="isEditable"
    suppress-contenteditable-warning
    @focus="handleFocus"
    @input="handleInput"
    @blur="handleBlur"
    @keydown="handleKeydown"
  >
    {{ localValue }}
  </component>
</template>

<style scoped>
.cms-editable-inline {
  position: relative;
  outline: 2px dashed transparent;
  outline-offset: 0.2rem;
  border-radius: 0.35rem;
  transition: outline-color 0.2s ease, background-color 0.2s ease;
  cursor: text;
}

.cms-editable-inline:hover {
  outline-color: rgba(0, 119, 190, 0.35);
  background: rgba(255, 255, 255, 0.24);
}

.cms-editable-inline:focus {
  outline-color: rgba(0, 119, 190, 0.75);
  background: rgba(255, 255, 255, 0.4);
}
</style>
