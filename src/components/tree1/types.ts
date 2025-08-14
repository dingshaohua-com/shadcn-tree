import type {
  BizTreeDetail,
  BizTreeNode,
  BizTreeNodeWithChildren,
} from "../../_api/models";

export type TreeData = BizTreeNodeWithChildren[] | BizTreeDetail | BizTreeNode;
export type TreeDataItem = BizTreeNodeWithChildren;

export type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeData;
  initialSlelectedItemId?: string;
  onSelectChange?: (item: BizTreeDetail | undefined) => void;
  expandAll?: boolean;
  checkable?: boolean;
  checkedKeys?: string[];
  halfCheckedKeys?: string[];
  onCheckedChange?: (
    checkedKeys: string[],
    halfCheckedKeys: string[],
    leafCheckedKeys: string[]
  ) => void;
};
