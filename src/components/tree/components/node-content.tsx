import { cn } from "@repo/ui/lib/utils";
import { TreeDataItem } from "../types";

interface NodeContentProps {
  item: TreeDataItem;
  level: number;
  suffixTitle: (arg: { item: TreeDataItem; level: number }) => React.ReactNode;
}

export const NodeContent = ({ item, level, suffixTitle }: NodeContentProps) => (
  <div className="flex items-center gap-1">
    <span
      className={cn("flex gap-1 truncate text-sm", level === 0 && "font-bold")}
    >
      {item.name}
      {/* {level !== 0 && (
        <div className="tag-tip rounded bg-[#FF8559] px-1 text-white">薄弱</div>
      )}
      <div className="tag-count rounded bg-black/5 px-1 font-normal text-black/50">
        10题
      </div> */}
      {suffixTitle({ item, level })}
    </span>
  </div>
);
