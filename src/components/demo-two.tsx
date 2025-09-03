import { Tree } from './tree';
import { useState } from 'react';
import { treeDate } from '../utils/mock-data';
import { updateUrlParams } from '@/utils/url-helper';
import { Button } from '@/components/ui/components/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/components/dialog';

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

  const checkedKeys = [];

  const onCheckedChange = (...arg)=>{
    console.log(123, arg);
    
  }

  // 保存完整的选中状态，包括所有选中的节点ID
  // 控制 DropdownMenu 的开关状态
  const [isOpen, setIsOpen] = useState(false);


  const handleClear = () => {
  setIsOpen(false);
  };

  const handleOk = () => {
    setIsOpen(false);
    // // 同步至外层
    // syncSureState();
    // // 关闭下拉菜单
    // setIsOpen(false);
    // updateUrlParams({
    //   knPoint: leafCheckedKeysSure,
    // });
  };

  return (
    <div className="p-10">
      {/* <div className="mb-4">
        <div className="text-sm text-gray-600 flex gap-2">
          <div>选中的节点:</div>
          <div className="flex">
            <div>所有{allCheckedKeysSure.length} 个，</div>
            <div>末级{leafCheckedKeysSure.length} 个</div>
          </div>
        </div>
      </div> */}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <div className="text-blue-400 cursor-pointer">打开树选择器</div>
        </DialogTrigger>
        <DialogContent className="h-[calc(100%-40px)] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <DialogTitle />
            <DialogDescription />
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
            />
          </div>

          <hr />
          <div className="footer gap-2 flex justify-end mt-2">
            <Button className="cursor-pointer" onClick={handleClear}>
              清空选择
            </Button>
            <Button className="cursor-pointer bg-green-400" onClick={handleOk}>
              确定
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
