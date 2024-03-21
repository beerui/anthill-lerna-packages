import {
    TdLinkProps,
    TdPopconfirmProps,
    DropdownOption,
} from 'tdesign-vue-next';
export declare type OperatorConfigItem = {
    name: string;
    pop?: { show: boolean; showType?: string } & TdPopconfirmProps & DropdownOption;
    attrs?: TdLinkProps;
};
