import React, { useEffect } from "react";
import { TreeDataItem } from "../types";
import {
  calculateHalfCheckedKeysFromLeaf,
  calculateAllCheckedKeysFromLeaf,
  isLeafNode,
} from "../utils";

export const useTreeState = (
  data: TreeDataItem[] | TreeDataItem,
  initialSelectedId?: string,
  initialLeafCheckedKeys: string[] = []
) => {
  const [selectedItemId, setSelectedItemId] = React.useState<
    string | undefined
  >(initialSelectedId);
  const [expandedIds, setExpandedIds] = React.useState<string[]>([]);
  // 只存储叶子节点的选中状态
  const [leafCheckedKeys, setLeafCheckedKeys] =
    React.useState<string[]>(initialLeafCheckedKeys);

  // 响应外部 leafCheckedKeys 的变化
  useEffect(() => {
    setLeafCheckedKeys(initialLeafCheckedKeys);
  }, [initialLeafCheckedKeys]);

  // 基于叶子节点计算所有选中的节点（包括父节点）
  const checkedKeys = React.useMemo(() => {
    return calculateAllCheckedKeysFromLeaf(data, leafCheckedKeys);
  }, [leafCheckedKeys, data]);

  // 基于叶子节点计算半选中状态
  const halfCheckedKeys = React.useMemo(() => {
    return calculateHalfCheckedKeysFromLeaf(data, leafCheckedKeys);
  }, [leafCheckedKeys, data]);

  const updateCheckState = React.useCallback(
    (itemId: string, checked: boolean) => {
      let newLeafCheckedKeys = [...leafCheckedKeys];

      // 找到被点击的节点
      const findNode = (nodes: TreeDataItem[] | TreeDataItem, targetId: string): TreeDataItem | null => {
        const nodeArray = Array.isArray(nodes) ? nodes : [nodes];
        for (const node of nodeArray) {
          if (node.id === targetId) {
            return node;
          }
          if (node.children) {
            const found = findNode(node.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      const clickedNode = findNode(data, itemId);
      if (!clickedNode) return { newLeafCheckedKeys };

      if (isLeafNode(clickedNode)) {
        // 如果点击的是叶子节点，直接添加或移除
        if (checked) {
          if (!newLeafCheckedKeys.includes(itemId)) {
            newLeafCheckedKeys.push(itemId);
          }
        } else {
          newLeafCheckedKeys = newLeafCheckedKeys.filter(id => id !== itemId);
        }
      } else {
        // 如果点击的是父节点，需要处理所有子叶子节点
        const getAllLeafChildren = (node: TreeDataItem): string[] => {
          const leafIds: string[] = [];
          if (isLeafNode(node)) {
            leafIds.push(node.id);
          } else if (node.children) {
            node.children.forEach(child => {
              leafIds.push(...getAllLeafChildren(child));
            });
          }
          return leafIds;
        };

        const leafChildrenIds = getAllLeafChildren(clickedNode);

        if (checked) {
          // 选中父节点：添加所有子叶子节点
          leafChildrenIds.forEach(leafId => {
            if (!newLeafCheckedKeys.includes(leafId)) {
              newLeafCheckedKeys.push(leafId);
            }
          });
        } else {
          // 取消选中父节点：移除所有子叶子节点
          newLeafCheckedKeys = newLeafCheckedKeys.filter(id => !leafChildrenIds.includes(id));
        }
      }

      setLeafCheckedKeys(newLeafCheckedKeys);
      return { newLeafCheckedKeys };
    },
    [leafCheckedKeys, data]
  );

  return {
    selectedItemId,
    setSelectedItemId,
    expandedIds,
    setExpandedIds,
    checkedKeys,
    halfCheckedKeys,
    leafCheckedKeys,
    updateCheckState,
  };
};
