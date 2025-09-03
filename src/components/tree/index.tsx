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
      initialSelectedItemId,
      onSelectChange,
      checkable = false,
      checkedKeys = [],
      onCheckedChange,
      fieldNames = {},
      className,
      prefixCheckbox = () => null,
      suffixTitle = () => null,
      ...props
    },
    ref
  ) => {
    console.log(data);

    // 填充默认字段名
    const mergedFieldNames = React.useMemo(
      () => ({
        title: fieldNames.title || "name",
        key: fieldNames.key || "id",
        children: fieldNames.children || "children",
      }),
      [fieldNames]
    );

    // 转换数据格式
    const normalizedData = React.useMemo(() => {
      const normalizeItem = (item: any): TreeDataItem => ({
        id: item[mergedFieldNames.key],
        name: item[mergedFieldNames.title],
        icon: item.icon,
        children: item[mergedFieldNames.children]?.map(normalizeItem),
        ...item, // 保留原始数据
      });

      const rawData = Array.isArray(data) ? data : [data];
      return rawData.map(normalizeItem);
    }, [data, mergedFieldNames]);

    const {
      selectedItemId,
      setSelectedItemId,
      expandedIds,
      setExpandedIds,
      checkedKeys: currentCheckedKeys,
      halfCheckedKeys,
      updateCheckState,
    } = useTreeState(normalizedData, initialSelectedItemId, checkedKeys);

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem) => {
        setSelectedItemId(item.id);
        onSelectChange?.(item);
      },
      [onSelectChange, setSelectedItemId]
    );

    const handleCheckChange = React.useCallback(
      (itemId: string, checked: boolean) => {
        const { newLeafCheckedKeys } = updateCheckState(itemId, checked);

        // 只传递叶子节点的选中状态
        onCheckedChange?.(newLeafCheckedKeys);
      },
      [updateCheckState, onCheckedChange]
    );

    const treeData = normalizedData;

    return (
      <div className={cn("overflow-hidden", className)} ref={ref} {...props}>
        <TreeList
          data={treeData}
          selectedItemId={selectedItemId}
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
          onSelectChange={handleSelectChange}
          checkable={checkable}
          checkedKeys={currentCheckedKeys}
          halfCheckedKeys={halfCheckedKeys}
          onCheckChange={handleCheckChange}
          prefixCheckbox={prefixCheckbox}
          suffixTitle={suffixTitle}
        />
      </div>
    );
  }
);

Tree.displayName = "Tree";

export { Tree, type TreeDataItem };
