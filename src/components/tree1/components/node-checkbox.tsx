import { Checkbox } from "@repo/ui/components/checkbox";
import { TreeDataItem } from "../types";

interface NodeCheckboxProps {
  item: TreeDataItem;
  checkedKeys?: string[];
  halfCheckedKeys?: string[];
  onCheckChange?: (itemId: string, checked: boolean) => void;
  onSelectChange?: (item: TreeDataItem) => void;
}

export const NodeCheckbox = ({
  item,
  checkedKeys,
  halfCheckedKeys,
  onCheckChange,
  onSelectChange,
}: NodeCheckboxProps) => {
  const nodeId = item.bizTreeNodeId.toString();
  const isChecked = checkedKeys?.includes(nodeId) || false;
  const isHalfChecked = halfCheckedKeys?.includes(nodeId) || false;

  return (
    <Checkbox
      checked={isHalfChecked ? "indeterminate" : isChecked}
      onCheckedChange={(checked) => {
        onCheckChange?.(nodeId, checked as boolean);
        onSelectChange?.(item);
      }}
      onClick={(e) => e.stopPropagation()}
    />
  );
};
