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
}: TreeNodeProps) => {
  const hasChildren =
    item.bizTreeNodeChildren && item.bizTreeNodeChildren.length > 0;

  if (hasChildren) {
    return (
      <Accordion
        type="multiple"
        value={expandedIds}
        onValueChange={onExpandedChange}
      >
        <AccordionItem value={item.bizTreeNodeId.toString()}>
          <div className="flex items-center justify-between">
            <AccordionTrigger
              className={cn(
                "before:bg-muted/80 flex-1 px-2 before:absolute before:left-0 before:-z-10 before:h-[1.75rem] before:w-full before:opacity-0 hover:no-underline hover:before:opacity-100",
                selectedItemId === item.bizTreeNodeId.toString() &&
                  "before:bg-accent text-accent-foreground before:border-l-accent-foreground/50 before:border-l-2 before:opacity-100 dark:before:border-0"
              )}
              onClick={() => onSelectChange?.(item)}
            >
              <div className="flex items-center gap-1">
                <TriangleFill
                  width={12}
                  className={cn(
                    "rotate-270 transition-transform duration-200",
                    expandedIds.includes(item.bizTreeNodeId.toString()) &&
                      "rotate-360"
                  )}
                />
                <NodeContent item={item} level={level} />
              </div>
            </AccordionTrigger>
            <div className="flex items-center gap-2">
              <div className="text-sm">
                {level === 0 ? (
                  item.weakCount > 0 && <span>{item.weakCount}薄弱</span>
                ) : (
                  <span>
                    {item.learnCount}/{item.allLearnCount}
                  </span>
                )}
              </div>
              {checkable && (
                <div className="mr-2">
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
              data={item.bizTreeNodeChildren!}
              level={level + 1}
              selectedItemId={selectedItemId}
              expandedIds={expandedIds}
              onExpandedChange={onExpandedChange}
              onSelectChange={onSelectChange}
              checkable={checkable}
              checkedKeys={checkedKeys}
              halfCheckedKeys={halfCheckedKeys}
              onCheckChange={onCheckChange}
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
        selectedItemId === item.bizTreeNodeId.toString() &&
          "before:bg-accent text-accent-foreground before:border-l-accent-foreground/50 before:border-l-2 before:opacity-100 dark:before:border-0"
      )}
      onClick={() => onSelectChange?.(item)}
    >
      <NodeContent item={item} level={level} />

      <div className="flex items-center gap-2">
        <div className="text-sm">
          {level === 0 ? (
            item.weakCount > 0 && <span>{item.weakCount}薄弱</span>
          ) : (
            <span>
              {item.learnCount}/{item.allLearnCount}
            </span>
          )}
        </div>
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
