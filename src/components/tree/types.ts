import { type LucideIcon } from "lucide-react";

export interface FieldNames {
  title?: string;
  key?: string;
  children?: string;
}

export interface TreeDataItem {
  id: string;
  name: string;
  icon?: LucideIcon;
  children?: TreeDataItem[];
  
}

export type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  // data: TreeDataItem[] | TreeDataItem;
  data:any;
  initialSlelectedItemId?: string;
  onSelectChange?: (item: TreeDataItem | undefined) => void;
  expandAll?: boolean;
  checkable?: boolean;
  checkedKeys?: string[];
  onCheckedChange?: (checkedKeys: string[], halfCheckedKeys: string[], leafCheckedKeys: string[]) => void;
  fieldNames?: FieldNames; // 新增字段别名配置
  prefixCheckbox: (arg: { item: TreeDataItem; level: number }) => React.ReactNode;
  suffixTitle: (arg: { item: TreeDataItem; level: number }) => React.ReactNode;
};
