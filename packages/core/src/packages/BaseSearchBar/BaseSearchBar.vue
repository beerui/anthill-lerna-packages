<!--
 * @FileDescription: 基础筛选栏
 -->
<template>
  <t-form :label-width="80" colon @reset="emits('reset')" @submit="emits('submit')">
    <t-row :gutter="[24, 24]">
      <t-col :span="12 - btnSpan">
        <t-row :gutter="[24, 24]">
          <t-col v-for="(item, index) in config" :key="index" :span="item.span || 4">
            <t-form-item
                v-if="item.type === 'SLOT'"
                :label="item?.label"
                :label-width="item?.labelWidth"
                :name="item?.name"
            >
              <slot :name="item.name" :data="item"></slot>
            </t-form-item>
            <base-form-item v-bind="item.attrs" v-model="item.value" v-model:typeValue="item.typeValue" :config="item" @change="(value) => onChangeValue(value, item)" />
          </t-col>
        </t-row>
      </t-col>
      <t-col :span="btnSpan" class="text-right" :style="btnBoxStyle">
        <slot name="btnPre"></slot>
        <div v-if="hasBtn" class="base-search-operator">
          <t-button type="submit" theme="primary">查询</t-button>
          <t-button class="ml-15" type="reset" variant="base" theme="default">重置</t-button>
        </div>
        <slot></slot>
      </t-col>
    </t-row>
  </t-form>
</template>
<script setup lang="ts">
import BaseFormItem from '../components/BaseFormItem.vue';
import { BaseFormItemType } from '../types/components';

type Props = {
  config: BaseFormItemType[];
  hasBtn?: boolean;
  btnBoxStyle?: any;
  btnSpan?: number;
};

withDefaults(defineProps<Props>(), {
  hasBtn: true,
  btnSpan: 2,

});
const emits = defineEmits(['reset', 'submit']);

const onChangeValue = (value: any, item: BaseFormItemType) => {
  if (item.trigger === 'immediately') {
    emits('submit');
  }
};
</script>
<style scoped lang="less">
.base-search-operator {
  .t-button + .t-button {
    margin-left: var(--td-comp-margin-l);
  }
}
</style>
