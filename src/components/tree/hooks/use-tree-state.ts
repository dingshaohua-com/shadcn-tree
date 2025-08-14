import React from "react";
import { TreeDataItem } from "../types";

export const useTreeState = (
  data: TreeDataItem[] | TreeDataItem,
  initialSelectedId?: string,
  initialCheckedKeys: string[] = []
) => {
  const [selectedItemId, setSelectedItemId] = React.useState<string | undefined>(initialSelectedId);
  const [expandedIds, setExpandedIds] = React.useState<string[]>([]);
  const [checkedKeys, setCheckedKeys] = React.useState<string[]>(initialCheckedKeys);
  const [halfCheckedKeys, setHalfCheckedKeys] = React.useState<string[]>([]);

  const getAllChildrenIds = React.useCallback((item: TreeDataItem): string[] => {
    const ids: string[] = [];
    if (item.children) {
      item.children.forEach((child) => {
        ids.push(child.id);
        ids.push(...getAllChildrenIds(child));
      });
    }
    return ids;
  }, []);

  const updateCheckState = React.useCallback((itemId: string, checked: boolean) => {
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
          if (node.id === itemId) {
            const childrenIds = getAllChildrenIds(node);
            childrenIds.forEach(childId => {
              if (!newCheckedKeys.includes(childId)) {
                newCheckedKeys.push(childId);
              }
            });
            break;
          }
          if (node.children) {
            findAndAddChildren(node.children);
          }
        }
      };
      findAndAddChildren(data);

      // 移除半选中状态
      newHalfCheckedKeys = newHalfCheckedKeys.filter(id => id !== itemId);
    } else {
      // 取消选中：移除当前节点和所有子节点
      const findAndRemoveChildren = (nodes: TreeDataItem[] | TreeDataItem) => {
        const nodeArray = Array.isArray(nodes) ? nodes : [nodes];
        for (const node of nodeArray) {
          if (node.id === itemId) {
            const childrenIds = getAllChildrenIds(node);
            newCheckedKeys = newCheckedKeys.filter(id => id !== itemId && !childrenIds.includes(id));
            break;
          }
          if (node.children) {
            findAndRemoveChildren(node.children);
          }
        }
      };
      findAndRemoveChildren(data);
    }

    // 更新父节点的半选中状态 - 从底向上递归
    const updateParentStates = (nodes: TreeDataItem[] | TreeDataItem) => {
      const nodeArray = Array.isArray(nodes) ? nodes : [nodes];

      for (const node of nodeArray) {
        if (node.children && node.children.length > 0) {
          // 先递归处理子节点
          updateParentStates(node.children);

          // 然后处理当前节点
          const childrenIds = node.children.map(child => child.id);
          const checkedChildren = childrenIds.filter(id => newCheckedKeys.includes(id));
          const halfCheckedChildren = childrenIds.filter(id => newHalfCheckedKeys.includes(id));

          if (checkedChildren.length === 0 && halfCheckedChildren.length === 0) {
            // 没有子节点被选中或半选中，移除父节点的选中和半选中状态
            newCheckedKeys = newCheckedKeys.filter(id => id !== node.id);
            newHalfCheckedKeys = newHalfCheckedKeys.filter(id => id !== node.id);
          } else if (checkedChildren.length === childrenIds.length) {
            // 所有子节点都被选中，父节点完全选中
            if (!newCheckedKeys.includes(node.id)) {
              newCheckedKeys.push(node.id);
            }
            newHalfCheckedKeys = newHalfCheckedKeys.filter(id => id !== node.id);
          } else {
            // 部分子节点被选中或半选中，父节点半选中
            newCheckedKeys = newCheckedKeys.filter(id => id !== node.id);
            if (!newHalfCheckedKeys.includes(node.id)) {
              newHalfCheckedKeys.push(node.id);
            }
          }
        }
      }
    };

    updateParentStates(data);

    setCheckedKeys(newCheckedKeys);
    setHalfCheckedKeys(newHalfCheckedKeys);

    return { newCheckedKeys, newHalfCheckedKeys };
  }, [checkedKeys, halfCheckedKeys, data, getAllChildrenIds]);

  return {
    selectedItemId,
    setSelectedItemId,
    expandedIds,
    setExpandedIds,
    checkedKeys,
    halfCheckedKeys,
    updateCheckState
  };
};