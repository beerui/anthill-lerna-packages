<template>
  <BaseSearchBar :config="searchConfig" @reset="onReset" @submit="onSubmit"/>
  <Editor ref="EditorRef" :exclude-keys="exCludes" auto-focus></Editor>
  <t-button @click="getToolConfig">测试</t-button>
</template>
<script lang="ts" setup>
import { defineComponent } from 'vue'
import Editor  from './packages/Editor/Editor.vue'

import {ref} from "vue";
const baseSearchConfig = [
  {
    name: 'deptName',
    value: '',
    type: 'INPUT',
    label: '处理单位',
    attrs: {
      placeholder: '请输入处理单位',
    },
  },
  {
    name: 'times',
    value: [],
    default: [],
    type: 'DATE_RANGE_PICKER',
    label: '创建时间',
    attrs: {
      placeholder: '请输入',
      clearable: true,
      enableTimePicker: true,
      pickMonth: 3,
    },
  },
  {
    name: 'timeLimit',
    value: '',
    type: 'SELECT',
    label: '处理时限',
    attrs: {
      options: [
        { key: -1, label: '已逾期', value: -1 },
        { key: 0, label: '今天到期', value: 0 },
        { key: 3, label: '近3天到期', value: 3 },
        { key: 7, label: '近7天到期', value: 7 },
        { key: 15, label: '近15天到期', value: 15 },
      ],
      clearable: true,
    },
  },
];
const searchConfig:any = ref(baseSearchConfig)
const onReset: any = () => {
  console.log('测试reset')
}
type ItemOptions = {
  name: number;
  value: number;
}
const onSubmit: any = () => {
  const params: ItemOptions & any = {};
  searchConfig.value.forEach((item: ItemOptions)=> {
    if(item.value) {
      params[item.name] = item.value
    }
  })
  console.log(params)
  console.log('测试submit')
}
const exCludes = ref(['headerSelect'])
const EditorRef = ref();
const getToolConfig = () => {
  const config = (EditorRef.value as any).getToolConfig();
  console.log(config);
}
const uploadFail = (value: any) => {
  console.log(value);
}
</script>
