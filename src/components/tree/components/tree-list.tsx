import { TreeDataItem } from "../types";
import { TreeNode } from "./tree-node";

interface TreeListProps {
  data: TreeDataItem[];
  level?: number;
  selectedItemId?: string | number;
  expandedIds: (string | number)[];
  onExpandedChange?: (expandedIds: (string | number)[]) => void;
  onSelectChange?: (item: TreeDataItem) => void;
  checkable?: boolean;
  checkedKeys?: (string | number)[];
  halfCheckedKeys?: (string | number)[];
  onCheckChange?: (itemId: string | number, checked: boolean) => void;
  prefixCheckbox?: (arg: {
    item: TreeDataItem;
    level: number;
  }) => React.ReactNode;
  suffixTitle?: (arg: { item: TreeDataItem; level: number }) => React.ReactNode;
}

export const TreeList = ({ data, ...props }: TreeListProps) => (
  <ul className="relative space-y-1">
    {data.map((item) => (
      <TreeNode key={item.id} item={item} {...props} />
    ))}
  </ul>
);
