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
}: NodeCheckboxProps) => (
  <Checkbox
    checked={
      halfCheckedKeys?.includes(item.id)
        ? "indeterminate"
        : checkedKeys?.includes(item.id) || false
    }
    onCheckedChange={(checked) => {
      onCheckChange?.(item.id, checked as boolean);
      onSelectChange?.(item);
    }}
    onClick={(e) => e.stopPropagation()}
  />
);
