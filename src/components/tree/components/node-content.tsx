import { truncateStr } from "@repo/ui/lib/utils";
import { match } from "ts-pattern";
import { TreeDataItem } from "../types";

interface NodeContentProps {
  item: TreeDataItem;
  level: number;
  suffixTitle: (arg: { item: TreeDataItem; level: number }) => React.ReactNode;
}

export const NodeContent = ({ item, level, suffixTitle }: NodeContentProps) => {
  return (
    <div className="flex items-center gap-1">
      {match(level)
        .with(0, () => (
          <span className="flex items-center justify-center gap-1 truncate text-base font-bold leading-tight text-zinc-800/90">
            {truncateStr(item.name)}
            {suffixTitle({ item, level })}
          </span>
        ))
        .otherwise(() => (
          <span className="flex items-center justify-center gap-1 truncate text-base font-normal leading-tight text-zinc-800/90">
            {truncateStr(item.name)}
            {suffixTitle({ item, level })}
          </span>
        ))}
    </div>
  );
};
