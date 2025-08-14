import React from "react";
import { TreeDataItem } from "../types";

export const useTreeState = (
  data: TreeDataItem[] | TreeDataItem,
  initialSelectedId?: string,
  initialCheckedKeys: string[] = [],
  initialHalfCheckedKeys: string[] = []
) => {
  const [selectedItemId, setSelectedItemId] = React.useState<
    string | undefined
  >(initialSelectedId);
  const [expandedIds, setExpandedIds] = React.useState<string[]>([]);
  const [checkedKeys, setCheckedKeys] =
    React.useState<string[]>(initialCheckedKeys);
  const [halfCheckedKeys, setHalfCheckedKeys] = React.useState<string[]>(
    initialHalfCheckedKeys
  );

  // 同步外部传入的 checkedKeys
  React.useEffect(() => {
    setCheckedKeys(initialCheckedKeys);
  }, [initialCheckedKeys]);

  // 同步外部传入的 halfCheckedKeys
  React.useEffect(() => {
    setHalfCheckedKeys(initialHalfCheckedKeys);
  }, [initialHalfCheckedKeys]);

  const getAllChildrenIds = React.useCallback(
    (item: TreeDataItem): string[] => {
      const ids: string[] = [];
      if (item.bizTreeNodeChildren) {
        item.bizTreeNodeChildren.forEach((child) => {
          ids.push(child.bizTreeNodeId.toString());
          ids.push(...getAllChildrenIds(child));
        });
      }
      return ids;
    },
    []
  );

  const updateCheckState = React.useCallback(
    (itemId: string, checked: boolean) => {
      let newCheckedKeys = [...checkedKeys];
      let newHalfCheckedKeys = [...halfCheckedKeys];

      if (checked) {
        // 选中：添加当前节点和所有子节点
        if (!newCheckedKeys.includes(itemId)) {
          newCheckedKeys.push(itemId);
        }

        // 找到当前项并添加所有子节点
        const findAndAddChildren = (nodes: TreeDataItem[] | TreeDataItem) => {
          const nodeArray = Array.isArray(nodes) ? nodes : [nodes];
          for (const node of nodeArray) {
            if (node.bizTreeNodeId.toString() === itemId) {
              const childrenIds = getAllChildrenIds(node);
              childrenIds.forEach((childId) => {
                if (!newCheckedKeys.includes(childId)) {
                  newCheckedKeys.push(childId);
                }
              });
              break;
            }
            if (node.bizTreeNodeChildren) {
              findAndAddChildren(node.bizTreeNodeChildren);
            }
          }
        };
        findAndAddChildren(data);

        // 移除半选中状态
        newHalfCheckedKeys = newHalfCheckedKeys.filter((id) => id !== itemId);
      } else {
        // 取消选中：移除当前节点和所有子节点
        const findAndRemoveChildren = (
          nodes: TreeDataItem[] | TreeDataItem
        ) => {
          const nodeArray = Array.isArray(nodes) ? nodes : [nodes];
          for (const node of nodeArray) {
            if (node.bizTreeNodeId.toString() === itemId) {
              const childrenIds = getAllChildrenIds(node);
              newCheckedKeys = newCheckedKeys.filter(
                (id) => id !== itemId && !childrenIds.includes(id)
              );
              break;
            }
            if (node.bizTreeNodeChildren) {
              findAndRemoveChildren(node.bizTreeNodeChildren);
            }
          }
        };
        findAndRemoveChildren(data);
      }

      // 更新父节点的半选中状态
      const updateParentStates = (
        nodes: TreeDataItem[] | TreeDataItem,
        targetNodeId?: string
      ) => {
        const nodeArray = Array.isArray(nodes) ? nodes : [nodes];

        for (const node of nodeArray) {
          if (node.bizTreeNodeChildren) {
            // 先递归处理子节点
            updateParentStates(node.bizTreeNodeChildren);

            const childrenIds = node.bizTreeNodeChildren.map((child) =>
              child.bizTreeNodeId.toString()
            );
            const checkedChildren = childrenIds.filter((id) =>
              newCheckedKeys.includes(id)
            );
            const halfCheckedChildren = childrenIds.filter((id) =>
              newHalfCheckedKeys.includes(id)
            );

            const nodeId = node.bizTreeNodeId.toString();

            if (
              checkedChildren.length === 0 &&
              halfCheckedChildren.length === 0
            ) {
              // 没有子节点被选中或半选中，移除父节点的选中和半选中状态
              newCheckedKeys = newCheckedKeys.filter((id) => id !== nodeId);
              newHalfCheckedKeys = newHalfCheckedKeys.filter(
                (id) => id !== nodeId
              );
            } else if (checkedChildren.length === childrenIds.length) {
              // 所有子节点都被选中，父节点完全选中
              if (!newCheckedKeys.includes(nodeId)) {
                newCheckedKeys.push(nodeId);
              }
              newHalfCheckedKeys = newHalfCheckedKeys.filter(
                (id) => id !== nodeId
              );
            } else {
              // 部分子节点被选中或半选中，父节点半选中
              newCheckedKeys = newCheckedKeys.filter((id) => id !== nodeId);
              if (!newHalfCheckedKeys.includes(nodeId)) {
                newHalfCheckedKeys.push(nodeId);
              }
            }
          }
        }
      };

      updateParentStates(data);

      setCheckedKeys(newCheckedKeys);
      setHalfCheckedKeys(newHalfCheckedKeys);

      // 计算仅包含勾选的末级节点
      const getLeafCheckedKeys = (
        nodes: TreeDataItem[] | TreeDataItem
      ): string[] => {
        const nodeArray = Array.isArray(nodes) ? nodes : [nodes];
        const leafKeys: string[] = [];

        for (const node of nodeArray) {
          const nodeId = node.bizTreeNodeId.toString();

          // 如果当前节点被选中
          if (newCheckedKeys.includes(nodeId)) {
            // 检查是否为叶子节点（没有子节点或子节点为空）
            if (
              !node.bizTreeNodeChildren ||
              node.bizTreeNodeChildren.length === 0
            ) {
              leafKeys.push(nodeId);
            }
          }

          // 无论当前节点是否被选中，都要递归检查子节点
          if (node.bizTreeNodeChildren && node.bizTreeNodeChildren.length > 0) {
            leafKeys.push(...getLeafCheckedKeys(node.bizTreeNodeChildren));
          }
        }
        return leafKeys;
      };

      const leafCheckedKeys = getLeafCheckedKeys(data);

      return { newCheckedKeys, newHalfCheckedKeys, leafCheckedKeys };
    },
    [checkedKeys, halfCheckedKeys, data, getAllChildrenIds]
  );

  return {
    selectedItemId,
    setSelectedItemId,
    expandedIds,
    setExpandedIds,
    checkedKeys,
    halfCheckedKeys,
    updateCheckState,
  };
};
