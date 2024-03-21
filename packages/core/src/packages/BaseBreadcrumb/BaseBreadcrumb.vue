<template>
  <t-row align="center" justify="space-between" :style="{marginBottom: `${mb}px`}">
    <t-breadcrumb :max-item-width="maxItemWidth">
      <t-breadcrumbItem v-for="(item, index) in list" :key="`breadcrumbItem-${index}`" :to="item.path">
        {{ item.title }}
      </t-breadcrumbItem>
    </t-breadcrumb>
    <slot name="right"></slot>
    <t-button v-if="isBack" theme="primary" shape="round" variant="base" @click="onBack" >
      <template #icon>
        <t-icon name="rollback"></t-icon>
      </template>
      返回
    </t-button>
  </t-row>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
interface Props {
  list?: any[];
  isBack?: boolean;
  maxItemWidth?: string;
  mb?: number;
}
const onBack = () => {
  router.back();
};
withDefaults(defineProps<Props>(), {
  isBack: false,
  maxItemWidth: '150',
  mb: 20
});
</script>
