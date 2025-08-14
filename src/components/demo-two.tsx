import { Tree } from './tree';
import { treeDate } from '../utils/mock-data';
import { Button } from '@/components/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/components/dropdown-menu';

export default function DemoTwo() {
  const onCheckedChange = (a, b, leafCheckedKeys: string[]) => {
    console.log(leafCheckedKeys);
  };
  return (
    <div className="p-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <div className="bg-gray-50 w-110  rounded-2xl h-160 overflow-y-auto">
            <Tree
              data={treeDate}
              checkable={true}
              onCheckedChange={onCheckedChange}
              fieldNames={{
                key: 'bizTreeNodeId',
                title: 'bizTreeNodeName',
                children: 'bizTreeNodeChildren',
              }}
              suffixTitle={({ item, level }) => (
                <>
                  {level !== 0 && item.isWeak === 1 && <div className="tag-tip rounded bg-[#FF8559] px-1 text-white">薄弱</div>}
                  <div className="tag-count rounded bg-black/5 px-1 font-normal text-black/50">{item.wrongQuestionCount}题</div>
                </>
              )}
              prefixCheckbox={({ item, level }) => {
                return (
                  <div className="text-sm">
                    {level === 0 ? (
                      item.weakCount > 0 && <span>{item.weakCount}薄弱</span>
                    ) : (
                      <span>
                        {item.learnCount}/{item.allLearnCount}
                      </span>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
