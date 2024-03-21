<!--
 * @FileDescription: 基础表单项
 -->
<template>
  <t-form-item
    :label="config?.label"
    :labelWidth="config?.labelWidth"
    :name="config?.name"
    v-if="config.type === 'INPUT'"
  >
    <t-input v-model="value" v-bind="$attrs" />
  </t-form-item>
  <t-form-item
    :label="config?.label"
    :labelWidth="config?.labelWidth"
    :name="config?.name"
    v-else-if="config.type === 'SELECT'"
  >
    <t-select v-model="value" v-bind="$attrs" />
  </t-form-item>
  <!-- 级联、时间选择 -->
  <t-form-item
    :label="config?.label"
    :labelWidth="config?.labelWidth"
    :name="config?.name"
    v-else-if="config.type === 'DATE_PICKER'"
  >
    <t-date-picker v-model="value" v-bind="$attrs" class="base-date-picker" />
  </t-form-item>
  <t-form-item
    :label="config?.label"
    :labelWidth="config?.labelWidth"
    :name="config?.name"
    v-else-if="config.type === 'DATE_RANGE_PICKER'"
  >
    <t-date-range-picker v-model="value" v-bind="$attrs" />
  </t-form-item>
  <t-form-item
    :label="config?.label"
    :labelWidth="config?.labelWidth"
    :name="config?.name"
    v-else-if="config.type === 'CASCADER'"
  >
    <t-cascader v-model="value" v-bind="$attrs" />
  </t-form-item>
  <t-form-item
    :label="config?.label"
    :labelWidth="config?.labelWidth"
    :name="config?.name"
    v-else-if="config.type === 'RADIO'"
  >
    <t-radio-group v-model="value" v-bind="$attrs" />
  </t-form-item>
  <t-form-item
    :label="config?.label"
    :labelWidth="config?.labelWidth"
    :name="config?.name"
    v-else-if="config.type === 'CHECKBOX'"
  >
    <t-checkbox-group v-model="value" v-bind="$attrs" />
  </t-form-item>
  <t-form-item
    :label="config?.label"
    :labelWidth="config?.labelWidth"
    :name="config?.name"
    v-else-if="config.type === 'TREE_SELECT'"
  >
    <t-tree-select v-model="value" v-bind="$attrs" />
  </t-form-item>
  <t-form-item
    v-else-if="config.type === 'TYPE_SELECT'"
    :label-width="config.showLabel ? null : 0"
    :name="config?.name"
    :label="config?.label"
  >
    <t-input-adornment>
      <t-select v-model="value" v-bind="$attrs" :options="options" />
      <template #prepend>
        <t-select v-model="type" class="type-select" :options="attrOptions" :style="{ width: config.typeWidth }" />
      </template>
    </t-input-adornment>
  </t-form-item>
  <!-- eg: /smartMaintain/lineInspectionSet -->
  <t-form-item
    v-else-if="config.type === 'TYPE_INPUT'"
    :label="config?.label"
    :label-width="config?.labelWidth"
    :name="config?.name"
    class="w-full"
  >
    <t-input-adornment class="w-full">
      <t-input v-model="value" v-bind="$attrs" />
      <template #prepend>
        <t-select v-model="type" class="type-select" :options="attrOptions" :style="{ width: config.typeWidth }" />
      </template>
      <template v-if="config?.appendShow" #append>{{ config.appendText || '' }}</template>
    </t-input-adornment>
  </t-form-item>
</template>
<script setup lang="ts">
import { computed } from 'vue';

type ConfigType = {
  modelValue?: any;
  typeValue?: any;
  config?: any;
};

const props = defineProps<ConfigType>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'update:typeValue', value: any): void;
  (e: 'change', value: any): void;
}>();

const value = computed({
  get() {
    return props?.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
    emits('change', value);
  },
});

const type = computed({
  get() {
    return props?.typeValue;
  },
  set(type) {
    emits('update:typeValue', type);
    emits('update:modelValue', '');
  },
});
const options = computed(() => {
  const select = props.config.attrs.options.find((item: any) => item.value === props.typeValue);
  return select?.children;
});

const attrOptions = computed(() => {
  const options = props.config.attrs.options;
  return options ? options.map((item: any) => { return { value: item.value, label: item.label }}) : [];
});
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<style lang="less" scoped>
:deep(.t-input-adornment, .t-date-picker) {
  width: 100%;
}
.base-date-picker {
  width: 100%;
}
</style>
