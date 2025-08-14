import { TreeNode } from './tree-node';
import { TreeDataItem } from '../types';

interface TreeListProps {
  data: TreeDataItem[];
  level?: number;
  selectedItemId?: string;
  expandedIds: string[];
  onExpandedChange?: (expandedIds: string[]) => void;
  onSelectChange?: (item: TreeDataItem) => void;
  checkable?: boolean;
  checkedKeys?: string[];
  halfCheckedKeys?: string[];
  onCheckChange?: (itemId: string, checked: boolean) => void;
  prefixCheckbox?: (arg: { item: TreeDataItem; level: number }) => React.ReactNode;
  suffixTitle?: (arg: { item: TreeDataItem; level: number }) => React.ReactNode;
}

export const TreeList = ({ data, ...props }: TreeListProps) => (
  <ul className="relative space-y-1">
    {data.map((item) => (
      <TreeNode key={item.id} item={item} {...props} />
    ))}
  </ul>
);
