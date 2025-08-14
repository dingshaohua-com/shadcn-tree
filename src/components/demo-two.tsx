import { Tree } from './tree';
import { treeDate } from '../utils/mock-data';
import { Button } from '@/components/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/components/dropdown-menu';
import { useState } from 'react';

export default function DemoTwo() {
  // 保存完整的选中状态，包括所有选中的节点ID
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [leafCheckedKeys, setLeafCheckedKeys] = useState<string[]>([]);

  const onCheckedChange = (allCheckedKeys: string[], halfCheckedKeys: string[], leafCheckedKeys: string[]) => {
    console.log('All checked keys:', allCheckedKeys);
    console.log('Leaf checked keys:', leafCheckedKeys);
    // 保存完整的选中状态
    setCheckedKeys(allCheckedKeys);
    setLeafCheckedKeys(leafCheckedKeys);
  };

  return (
    <div className="p-10">
      <div className="mb-4">
        <div className="text-sm text-gray-600">选中的叶子节点: {leafCheckedKeys.length} 个</div>
        <div className="text-xs text-gray-400">{leafCheckedKeys.join(', ')}</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open ({checkedKeys.length} selected)</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <div className="bg-gray-50 w-110  rounded-2xl h-160 overflow-y-auto">
            <Tree
              data={treeDate}
              checkable={true}
              checkedKeys={checkedKeys} // 传入保存的选中状态
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
