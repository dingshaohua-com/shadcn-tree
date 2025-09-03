import { type LucideIcon } from "lucide-react";

export interface FieldNames {
  title?: string;
  key?: string;
  children?: string;
}

export interface TreeDataItem {
  id: string | number;
  name: string;
  icon?: LucideIcon;
  children?: TreeDataItem[];
}

export type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  // data: TreeDataItem[] | TreeDataItem;
  data: any;
  initialSlelectedItemId?: string | number;
  onSelectChange?: (item: TreeDataItem | undefined) => void;
  expandAll?: boolean;
  checkable?: boolean;
  checkedKeys?: (string | number)[];
  onCheckedChange?: (leafCheckedKeys: (string | number)[]) => void;
  fieldNames?: FieldNames; // 新增字段别名配置
  prefixCheckbox?: (arg: {
    item: TreeDataItem;
    level: number;
  }) => React.ReactNode;
  suffixTitle?: (arg: { item: TreeDataItem; level: number }) => React.ReactNode;
};
