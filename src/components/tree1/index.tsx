"use client";

import { cn } from "@repo/ui/lib/utils";
import React from "react";
import { TreeList } from "./components/tree-list";
import { useTreeState } from "./hooks/use-tree-state";
import { TreeDataItem, TreeProps } from "./types";

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      initialSlelectedItemId,
      onSelectChange,
      checkable = false,
      checkedKeys = [],
      halfCheckedKeys = [],
      onCheckedChange,
      className,
      ...props
    },
    ref
  ) => {
    const {
      selectedItemId,
      setSelectedItemId,
      expandedIds,
      setExpandedIds,
      checkedKeys: currentCheckedKeys,
      halfCheckedKeys: currentHalfCheckedKeys,
      updateCheckState,
    } = useTreeState(
      data,
      initialSlelectedItemId,
      checkedKeys,
      halfCheckedKeys
    );

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem) => {
        setSelectedItemId(item.bizTreeNodeId.toString());
        // @ts-expect-error
        onSelectChange?.(item);
      },
      [onSelectChange, setSelectedItemId]
    );

    const handleCheckChange = React.useCallback(
      (itemId: string, checked: boolean) => {
        const { newCheckedKeys, newHalfCheckedKeys, leafCheckedKeys } =
          updateCheckState(itemId, checked);
        onCheckedChange?.(newCheckedKeys, newHalfCheckedKeys, leafCheckedKeys);
      },
      [updateCheckState, onCheckedChange]
    );

    const treeData = Array.isArray(data) ? data : [data];

    return (
      <div className={cn("overflow-hidden", className)} ref={ref} {...props}>
        <TreeList
          data={treeData}
          selectedItemId={selectedItemId}
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
          onSelectChange={handleSelectChange}
          checkable={checkable}
          checkedKeys={checkedKeys}
          halfCheckedKeys={halfCheckedKeys}
          onCheckChange={handleCheckChange}
        />
      </div>
    );
  }
);

Tree.displayName = "Tree";

export { Tree, type TreeDataItem };
