import TriangleFill from "@/public/icons/triangle-fill.svg?react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { cn } from "@repo/ui/lib/utils";
import { TreeDataItem } from "../types";
import { NodeCheckbox } from "./node-checkbox";
import { NodeContent } from "./node-content";
import { TreeList } from "./tree-list";

interface TreeNodeProps {
  item: TreeDataItem;
  level?: number;
  selectedItemId?: string;
  expandedIds: string[];
  onExpandedChange?: (expandedIds: string[]) => void;
  onSelectChange?: (item: TreeDataItem) => void;
  checkable?: boolean;
  checkedKeys?: string[];
  halfCheckedKeys?: string[];
  onCheckChange?: (itemId: string, checked: boolean) => void;
  prefixCheckbox: (arg: {
    item: TreeDataItem;
    level: number;
  }) => React.ReactNode;
  suffixTitle: (arg: { item: TreeDataItem; level: number }) => React.ReactNode;
}

export const TreeNode = ({
  item,
  level = 0,
  selectedItemId,
  expandedIds,
  onExpandedChange,
  onSelectChange,
  checkable,
  checkedKeys,
  halfCheckedKeys,
  onCheckChange,
  prefixCheckbox,
  suffixTitle,
}: TreeNodeProps) => {
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <Accordion
        type="multiple"
        value={expandedIds}
        onValueChange={onExpandedChange}
      >
        <AccordionItem value={item.id}>
          <div className="flex items-center justify-between">
            {/* 左侧（非根节点） */}
            <AccordionTrigger
              className={cn(
                "before:bg-muted/80 flex-1 px-2 before:absolute before:left-0 before:-z-10 before:h-[1.75rem] before:w-full before:opacity-0 hover:no-underline hover:before:opacity-100",
                selectedItemId === item.id &&
                  "before:bg-accent text-accent-foreground before:border-l-accent-foreground/50 before:border-l-2 before:opacity-100 dark:before:border-0"
              )}
              onClick={() => onSelectChange?.(item)}
            >
              <div className="flex items-center gap-1">
                <TriangleFill
                  className={cn(
                    "rotate-270 h-1 w-2 transition-transform duration-200",
                    expandedIds.includes(item.id) && "rotate-360"
                  )}
                />
                {/* 左侧标题 */}
                <NodeContent
                  item={item}
                  level={level}
                  suffixTitle={suffixTitle}
                />
              </div>
            </AccordionTrigger>
            {/* 右侧 */}
            <div className="flex items-center gap-2">
              {prefixCheckbox({ item, level })}
              {checkable && (
                <div className="mr-2 flex items-center">
                  <NodeCheckbox
                    item={item}
                    checkedKeys={checkedKeys}
                    halfCheckedKeys={halfCheckedKeys}
                    onCheckChange={onCheckChange}
                    onSelectChange={onSelectChange}
                  />
                </div>
              )}
            </div>
          </div>
          <AccordionContent className="pl-6">
            <TreeList
              data={item.children!}
              level={level + 1}
              selectedItemId={selectedItemId}
              expandedIds={expandedIds}
              onExpandedChange={onExpandedChange}
              onSelectChange={onSelectChange}
              checkable={checkable}
              checkedKeys={checkedKeys}
              halfCheckedKeys={halfCheckedKeys}
              onCheckChange={onCheckChange}
              prefixCheckbox={prefixCheckbox}
              suffixTitle={suffixTitle}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <div
      className={cn(
        "before:bg-muted/80 flex cursor-pointer items-center justify-between px-2 py-2 before:absolute before:left-0 before:right-1 before:-z-10 before:h-[1.75rem] before:w-full before:opacity-0 hover:before:opacity-100",
        selectedItemId === item.id &&
          "before:bg-accent text-accent-foreground before:border-l-accent-foreground/50 before:border-l-2 before:opacity-100 dark:before:border-0"
      )}
      onClick={() => onSelectChange?.(item)}
    >
      {/* 根节点 */}
      <NodeContent item={item} level={level} suffixTitle={suffixTitle} />

      <div className="flex items-center gap-2">
        {prefixCheckbox({ item, level })}
        {checkable && (
          <NodeCheckbox
            item={item}
            checkedKeys={checkedKeys}
            halfCheckedKeys={halfCheckedKeys}
            onCheckChange={onCheckChange}
            onSelectChange={onSelectChange}
          />
        )}
      </div>
    </div>
  );
};
