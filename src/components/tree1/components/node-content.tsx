import { cn, truncateStr } from "@repo/ui/lib/utils";
import { TreeDataItem } from "../types";

interface NodeContentProps {
  item: TreeDataItem;
  level: number;
}

export const NodeContent = ({ item, level }: NodeContentProps) => (
  <div className="flex items-center gap-1">
    <span
      className={cn("flex gap-1 truncate text-sm", level === 0 && "font-bold")}
    >
      {item.bizTreeNodeSerialPath} {truncateStr(item.bizTreeNodeName)}
      {level !== 0 && item.isWeak === 1 && (
        <div className="tag-tip rounded bg-[#FF8559] px-1 text-white">薄弱</div>
      )}
      <div className="tag-count rounded bg-black/5 px-1 font-normal text-black/50">
        {item.wrongQuestionCount}题
      </div>
    </span>
  </div>
);
