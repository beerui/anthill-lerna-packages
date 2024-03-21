import { TdLinkProps, TdPopconfirmProps } from 'tdesign-vue-next';
import { defaultsDeep } from 'lodash';
import { OperatorConfigItem } from "@/packages/types";

const defaultProps = {
  attrs: { theme: 'primary' },
  pop: { show: false },
};
/**
 * 操作按钮统一渲染
 * @param configs
 *
 * theme
 * - 删除按钮设置theme为：warning 其它类型按钮；默认为primary
 * - pop.show 默认：false 传入true则为展示确认框
 *
 * 示例：
 * ```
 * [
 *   {
 *     name: '详情',
 *     attrs: { onClick: () => onCheck(row) },
 *   },
 *   {
 *     name: '删除',
 *     attrs: {
 *       theme: 'warning',
 *     },
 *     pop: {
 *       show: true,
 *       content: '是否删除',
 *       onConfirm: () => onDelete(row),
 *     },
 *   },
 * ]
 * ```
 */
const renderOperator = (configs: OperatorConfigItem[]) => {
  const links: TdPopconfirmProps[] | TdLinkProps[] = [];
  for (let i = 0; i < configs.length; i++) {
    const config = defaultsDeep(configs[i], defaultProps);
    if (config.pop.show) {
      links.push(
        <t-popconfirm {...config.pop}>
          <t-link class="base-operator-btn__item" hover="color" {...config.attrs}>
            {config.name || '-'}
          </t-link>
        </t-popconfirm>,
      );
    } else {
      links.push(
        <t-link class="base-operator-btn__item" hover="color" {...config.attrs}>
          {config.name || '-'}
        </t-link>,
      );
    }
  }
  return <span class="base-operator-btn">{links}</span>;
};

export default renderOperator;
