import type { FieldNames } from "../types";

/**
 * 根据叶子节点ID获取所有父级节点ID（包括祖父级等）
 * 支持字段别名配置
 */
export const getParentIdsFromLeafKeys = (
  data: any[] | any,
  leafKeys: string[] | number[],
  fieldNames?: FieldNames
): string[] => {
  const parentIds = new Set<string>();

  // 默认字段名配置
  const fields = {
    key: fieldNames?.key || "id",
    title: fieldNames?.title || "name",
    children: fieldNames?.children || "children",
  };

  // 构建节点ID到节点的映射
  const nodeMap = new Map<string, any>();
  const parentMap = new Map<string, string>(); // 子节点ID -> 父节点ID

  const buildMaps = (nodes: any[], parentId?: string) => {
    nodes.forEach((node) => {
      const nodeId = String(node[fields.key]);
      nodeMap.set(nodeId, node);
      if (parentId) {
        parentMap.set(nodeId, parentId);
      }

      if (node[fields.children] && Array.isArray(node[fields.children])) {
        buildMaps(node[fields.children], nodeId);
      }
    });
  };

  const nodeArray = Array.isArray(data) ? data : [data];
  buildMaps(nodeArray);

  // 对每个叶子节点，向上查找所有父级节点
  leafKeys.forEach((leafId) => {
    let currentId = String(leafId);

    // 向上遍历找到所有父级节点
    while (parentMap.has(currentId)) {
      const parentId = parentMap.get(currentId)!;
      parentIds.add(parentId);
      currentId = parentId;
    }
  });

  return Array.from(parentIds);
};

/**
 * 根据叶子节点ID获取完整的节点路径（从根到叶子）
 * 支持字段别名配置
 */
export const getFullPathsFromLeafKeys = (
  data: any[] | any,
  leafKeys: string[] | number[],
  fieldNames?: FieldNames
): string[][] => {
  const paths: string[][] = [];

  // 默认字段名配置
  const fields = {
    key: fieldNames?.key || "id",
    title: fieldNames?.title || "name",
    children: fieldNames?.children || "children",
  };

  // 构建父子关系映射
  const parentMap = new Map<string, string>();

  const buildParentMap = (nodes: any[], parentId?: string) => {
    nodes.forEach((node) => {
      const nodeId = String(node[fields.key]);
      if (parentId) {
        parentMap.set(nodeId, parentId);
      }

      if (node[fields.children] && Array.isArray(node[fields.children])) {
        buildParentMap(node[fields.children], nodeId);
      }
    });
  };

  const nodeArray = Array.isArray(data) ? data : [data];
  buildParentMap(nodeArray);

  // 为每个叶子节点构建完整路径
  leafKeys.forEach((leafId) => {
    const path: string[] = [];
    let currentId = String(leafId);

    // 从叶子节点向上构建路径
    path.unshift(currentId);
    while (parentMap.has(currentId)) {
      const parentId = parentMap.get(currentId)!;
      path.unshift(parentId);
      currentId = parentId;
    }

    paths.push(path);
  });

  return paths;
};
