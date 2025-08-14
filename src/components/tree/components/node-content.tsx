import { cn, truncateStr} from "@repo/ui/lib/utils";
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
      {truncateStr(item.name)}
      {suffixTitle({ item, level })}
    </span>
  </div>
);
