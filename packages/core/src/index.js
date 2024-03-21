import * as components from './components';

export * as BaseOperator from "@/packages/BaseTable/BaseOperator";
export * from './components';

export default {
  install(Vue) {
      Object.keys(components).forEach((name) => {
        Vue.component(name, components[name]);
      });
  }
}
