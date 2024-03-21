import {
    TdButtonProps,
    TdCascaderProps,
    TdFormItemProps,
    TdLinkProps,
    TdInputProps,
    TdSelectProps,
    TdTimePickerProps,
    TdTimeRangePickerProps,
    TdInputAdornmentProps,
    TdPopconfirmProps,
    DropdownOption,
} from 'tdesign-vue-next';
export declare type OperatorConfigItem = {
    name: string;
    pop?: { show: boolean; showType?: string } & TdPopconfirmProps & DropdownOption;
    attrs?: TdLinkProps;
};

const defaultProps = {
    attrs: { theme: 'primary' },
    pop: { show: false },
};

export type BaseFormItemType = {
    name?: string;
    value: any;
    typeValue?: any;
    type:
        | 'SLOT'
        | 'INPUT'
        | 'SELECT'
        | 'DATE_PICKER'
        | 'DATE_RANGE_PICKER'
        | 'CASCADER'
        | 'ORGANIZE_TREE'
        | 'RADIO'
        | 'CHECKBOX'
        | 'TREE_SELECT'
        | 'DROPDOWN'
        | 'TYPE_SELECT'
        | 'TYPE_INPUT';
    label?: string;
    typeWidth?: string;
    appendShow?: boolean;
    appendText?: string;
    default?: any;
    attrs?: any;
    trigger?: string; // immediately-value变更后立即触发
    showLabel?: boolean;
    span?: number;
} & TdFormItemProps;

interface EVENT_BTN {
}

export type BTN_LIST_BTN_TYPE = {
    attrs?: TdButtonProps;
    event?: EVENT_BTN;
    trigger?: any;
    url?: any;
    text: string;
    icn?: string;
    icon?: string;
    badge?: boolean;
    badgeValue?: any;
    badgeAttrs?: any;
    popcon?: boolean;
    popconValue?: any;
    popconAttrs?: any;
    cate?: 'dropdown';
    options?: any[];
    upUrl?: any;
    acceptType?: any;
    upAttrs?: any;
    acceptRegex?: any;
};

export type BTN_LIST_TYPE = {
    title?: string;
    btn?: BTN_LIST_BTN_TYPE[];
    search?: BaseFormItemType[];
    dropdown?: { btn: BTN_LIST_BTN_TYPE; options: { content: string; value: any; event: EVENT_BTN }[] }[];
    style?: any;
};
