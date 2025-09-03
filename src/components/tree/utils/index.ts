import { TreeDataItem } from "../types";

/**
 * 获取节点的所有子节点ID
 */
export const getAllChildrenIds = (item: TreeDataItem): (string | number)[] => {
  const ids: (string | number)[] = [];
  if (item.children) {
    item.children.forEach((child) => {
      ids.push(child.id);
      ids.push(...getAllChildrenIds(child));
    });
  }
  return ids;
};

/**
 * 计算半选中状态的节点ID数组
 */
export const calculateHalfCheckedKeys = (
  data: TreeDataItem[] | TreeDataItem,
  checkedKeys: (string | number)[]
): (string | number)[] => {
  const halfChecked: (string | number)[] = [];

  const calculate = (nodes: TreeDataItem[] | TreeDataItem) => {
    const nodeArray = Array.isArray(nodes) ? nodes : [nodes];

    for (const node of nodeArray) {
      if (node.children && node.children.length > 0) {
        // 先递归处理子节点
        calculate(node.children);

        // 计算当前节点的状态
        const childrenIds = node.children.map((child) => child.id);
        const checkedChildren = childrenIds.filter((id) =>
          checkedKeys.includes(id)
        );
        const halfCheckedChildren = childrenIds.filter((id) =>
          halfChecked.includes(id)
        );

        // 如果有部分子节点被选中或半选中，但不是全部，则当前节点为半选中
        if (
          (checkedChildren.length > 0 || halfCheckedChildren.length > 0) &&
          checkedChildren.length < childrenIds.length
        ) {
          halfChecked.push(node.id);
        }
      }
    }
  };

  calculate(data);
  return halfChecked;
};

/**
 * 计算仅包含勾选的末级节点ID数组
 */
export const calculateLeafCheckedKeys = (
  data: TreeDataItem[] | TreeDataItem,
  checkedKeys: (string | number)[]
): (string | number)[] => {
  const getLeafCheckedKeys = (
    nodes: TreeDataItem[] | TreeDataItem
  ): (string | number)[] => {
    const nodeArray = Array.isArray(nodes) ? nodes : [nodes];
    const leafKeys: (string | number)[] = [];

    for (const node of nodeArray) {
      const nodeId = node.id;

      // 如果当前节点被选中
      if (checkedKeys.includes(nodeId)) {
        // 检查是否为叶子节点（没有子节点或子节点为空）
        if (!node.children || node.children.length === 0) {
          leafKeys.push(nodeId);
        }
      }

      // 无论当前节点是否被选中，都要递归检查子节点
      if (node.children && node.children.length > 0) {
        leafKeys.push(...getLeafCheckedKeys(node.children));
      }
    }
    return leafKeys;
  };

  return getLeafCheckedKeys(data);
};

/**
 * 检查节点是否为叶子节点
 */
export const isLeafNode = (item: TreeDataItem): boolean => {
  return !item.children || item.children.length === 0;
};

/**
 * 根据叶子节点选中状态计算所有应该选中的节点（包括父节点）
 */
export const calculateAllCheckedKeysFromLeaf = (
  data: TreeDataItem[] | TreeDataItem,
  leafCheckedKeys: (string | number)[]
): (string | number)[] => {
  const allCheckedKeys: (string | number)[] = [...leafCheckedKeys];

  const calculateParentChecked = (nodes: TreeDataItem[] | TreeDataItem) => {
    const nodeArray = Array.isArray(nodes) ? nodes : [nodes];

    for (const node of nodeArray) {
      if (node.children && node.children.length > 0) {
        // 先递归处理子节点
        calculateParentChecked(node.children);

        // 检查所有子节点是否都被选中
        const allChildrenChecked = node.children.every(child => {
          if (isLeafNode(child)) {
            return leafCheckedKeys.includes(child.id);
          } else {
            return allCheckedKeys.includes(child.id);
          }
        });

        if (allChildrenChecked) {
          allCheckedKeys.push(node.id);
        }
      }
    }
  };

  calculateParentChecked(data);
  return allCheckedKeys;
};

/**
 * 根据叶子节点选中状态计算半选中的父节点
 */
export const calculateHalfCheckedKeysFromLeaf = (
  data: TreeDataItem[] | TreeDataItem,
  leafCheckedKeys: (string | number)[]
): (string | number)[] => {
  const halfChecked: (string | number)[] = [];
  const allCheckedKeys = calculateAllCheckedKeysFromLeaf(data, leafCheckedKeys);

  const calculate = (nodes: TreeDataItem[] | TreeDataItem) => {
    const nodeArray = Array.isArray(nodes) ? nodes : [nodes];

    for (const node of nodeArray) {
      if (node.children && node.children.length > 0) {
        // 先递归处理子节点
        calculate(node.children);

        // 如果当前节点没有被完全选中，但有子节点被选中，则为半选中
        if (!allCheckedKeys.includes(node.id)) {
          const hasCheckedChildren = node.children.some(child => {
            if (isLeafNode(child)) {
              return leafCheckedKeys.includes(child.id);
            } else {
              return allCheckedKeys.includes(child.id) || halfChecked.includes(child.id);
            }
          });

          if (hasCheckedChildren) {
            halfChecked.push(node.id);
          }
        }
      }
    }
  };

  calculate(data);
  return halfChecked;
};
