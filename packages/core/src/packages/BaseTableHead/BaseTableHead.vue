<!--
 * @FileDescription: 表格头部标题+按钮栏
 * @notice 为了保持样式一致性：slot中的按钮 必须增加class base-table-content__btn
 -->
<template>
  <div class="fcb my-table-head-wrapper">
    <div class="flex items-center">
      <div class="title" :style="props.config?.style">{{ props.config?.title }}</div>
      <slot></slot>
    </div>
    <div class="base-table-content">
      <span v-for="(item, index) in props.config.btn" :key="index" class="base-table-content__btn">
        <t-dropdown
          v-if="item.cate === 'dropdown'"
          class="base-table-content__btn"
          :options="item.options"
          @click="(dropdownItem: DropdownOption)=>emits('click', dropdownItem)"
        >
          <t-button v-bind="item.attrs">
            {{ item.text }}
            <t-icon v-if="item.icon" style="margin-top: 2px; margin-left: 2px" :name="item.icon"></t-icon>
          </t-button>
        </t-dropdown>
        <span v-else-if="item.url">
          <t-badge v-if="item.badge" :count="item.badgeValue" v-bind="item.badgeAttrs">
            <t-button v-bind="item.attrs" @click.stop="openPage(item.url)">{{ item.text }}</t-button>
          </t-badge>
          <t-button v-else v-bind="item.attrs" @click.stop="openPage(item.url)">{{ item.text }}</t-button>
        </span>
        <span v-else>
          <t-badge v-if="item.badge" :count="item.badgeValue" v-bind="item.badgeAttrs">
            <t-button v-bind="item.attrs" @click.stop="emits('click', item.event)">{{ item.text }}</t-button>
          </t-badge>
          <t-button v-else v-bind="item.attrs" @click.stop="emits('click', item.event)">{{ item.text }}</t-button>
        </span>
      </span>
      <t-dropdown
        v-for="(item, index) in props.config.dropdown"
        :key="index"
        class="base-table-content__btn"
        :options="item.options"
        @click="(dropdownItem: DropdownOption)=>emits('click', dropdownItem)"
      >
        <t-button v-bind="item.btn.attrs">
          {{ item.btn.text }}
          <t-icon v-if="item.btn.icn" style="margin-top: 2px; margin-left: 2px" :name="item.btn.icn"></t-icon>
        </t-button>
      </t-dropdown>
      <slot name="btns"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DropdownOption } from 'tdesign-vue-next/es/dropdown/type';
import { BTN_LIST_TYPE } from '../types/components';

const openPage = (value) => {
  emits('openPage', value);
};

type ConfigType = {
  config: BTN_LIST_TYPE;
};

const emits = defineEmits<{
  (value: any, event): void;
  (openPage: any, event): void;
}>();

const props = defineProps<ConfigType>();
</script>
<style lang="less" scoped>
.base-table-content {
  .t-button + .t-button {
    margin-left: 0;
  }
  &__btn {
    margin-right: 16px;
    &:last-child {
      margin-right: 0;
    }
  }
}
.my-table-head-wrapper {
  .title {
    font-size: 16px;
    line-height: 32px;
    font-weight: 500;
    font: var(--td-font-title-medium);
    color: var(--td-text-color-primary);
    margin-right: var(--td-comp-margin-l);
  }
  :deep(.t-form-inline) {
    .t-form__item {
      margin-right: 0;
      + .t-form__item {
        margin-left: var(--td-comp-margin-xxl);
      }
    }
  }
}
</style>
