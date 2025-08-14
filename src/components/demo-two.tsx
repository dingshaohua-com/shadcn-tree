import { Tree } from './tree';
import { useState } from 'react';
import { treeDate } from '../utils/mock-data';
import { Button } from '@/components/ui/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/components/dropdown-menu';

interface SuffixTitle {
  item: {
    bizTreeNodeId: number; // 节点 ID
    bizTreeNodeName: string; // 节点名称
    bizTreeParentNodeId: number; // 父节点 ID
    bizTreeNodeSiblingOrder: number; // 兄弟节点排序
    bizTreeNodeLevel: number; // 节点层级
    bizTreeNodeSerialPath: string; // 节点序列路径
    weakCount: number; // 知识薄弱数量
    allLearnCount: number; // 总学习次数
    learnCount: number; // 已学习次数
    shelfStatus?: number; // 上架状态（可选）
    shelfOnLeafNodeStat?: string; // 叶子节点上架状态（可选）
    wrongQuestionCount?: number; // 错题数量（可选）
    isWeak?: number; // 是否薄弱（可选）
  };
  level: number;
}

export default function DemoTwo() {
  // 保存完整的选中状态，包括所有选中的节点ID
  const [allCheckedKeys, setAllCheckedKeys] = useState<string[]>([]);
  const [leafCheckedKeys, setLeafCheckedKeys] = useState<string[]>([]);
  const [allCheckedKeysSure, setAllCheckedKeysSure] = useState<string[]>([]);
  const [leafCheckedKeysSure, setLeafCheckedKeysSure] = useState<string[]>([]);
  // 控制 DropdownMenu 的开关状态
  const [isOpen, setIsOpen] = useState(false);

  const onCheckedChange = (allCheckedKeys: string[], leafCheckedKeys: string[]) => {
    // 保存完整的选中状态
    setAllCheckedKeys(allCheckedKeys);
    setLeafCheckedKeys(leafCheckedKeys);
  };

  const syncSureState = (all = allCheckedKeys, leaf = leafCheckedKeys) => {
    setAllCheckedKeysSure(all);
    setLeafCheckedKeysSure(leaf);
  };

  const handleClearSelection = () => {
    // 同时清空所有选中状态
    setAllCheckedKeys([]);
    setLeafCheckedKeys([]);
    // 同步至外层
    syncSureState([],[]);
    // 关闭下拉菜单
    setIsOpen(false);
  };

  const handleOkSelection = () => {
    // 同步至外层
    syncSureState();
    // 关闭下拉菜单
    setIsOpen(false);
  };

  return (
    <div className="p-10">
      <div className="mb-4">
        <div className="text-sm text-gray-600 flex gap-2">
          <div>选中的节点:</div>
          <div className="flex">
            <div>所有{allCheckedKeysSure.length} 个，</div>
            <div>末级{leafCheckedKeysSure.length} 个</div>
          </div>
        </div>
      </div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">打开树选择器</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <div className="bg-gray-50 w-110  rounded-2xl h-160 overflow-y-auto">
            <div className="gap-2 flex justify-end">
              <Button className="cursor-pointer" onClick={handleClearSelection}>
                清空选择
              </Button>
              <Button className="cursor-pointer bg-green-400" onClick={handleOkSelection}>
                确定
              </Button>
            </div>
            <Tree
              data={treeDate}
              checkable={true}
              checkedKeys={allCheckedKeys} // 传入保存的选中状态
              onCheckedChange={onCheckedChange}
              fieldNames={{
                key: 'bizTreeNodeId',
                title: 'bizTreeNodeName',
                children: 'bizTreeNodeChildren',
              }}
              suffixTitle={(params: any) => {
                const { item, level } = params as SuffixTitle;
                return (
                  <>
                    {level !== 0 && item.isWeak === 1 && <div className="tag-tip rounded bg-[#FF8559] px-1 text-white">薄弱</div>}
                    <div className="tag-count rounded bg-black/5 px-1 font-normal text-black/50">{item.wrongQuestionCount}题</div>
                  </>
                );
              }}
              prefixCheckbox={(params: any) => {
                const { item, level } = params as SuffixTitle;
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
