import { Tree } from './tree';
import { useState } from 'react';
import { treeDate } from '../utils/mock-data';
import { Button } from '@/components/ui/components/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/components/dialog';
import { getUrlParams, updateUrlParams } from '@/utils/url-helper';

export default function DemoTwo() {
  const urlParams = getUrlParams();
  
  const [checkedKeys, setCheckedKeys] = useState<(string | number)[]>(urlParams.knPoint || []);

  const onCheckedChange = (newLeafCheckedKeys: (string | number)[]) => {
    console.log('Leaf checked keys:', newLeafCheckedKeys);
    setCheckedKeys(newLeafCheckedKeys);
  };

  // 保存完整的选中状态，包括所有选中的节点ID
  // 控制 DropdownMenu 的开关状态
  const [isOpen, setIsOpen] = useState(false);


  const handleClear = () => {
    setCheckedKeys([]);
    setIsOpen(false);
  };

  const handleOk = () => {
    console.log('确定选择的叶子节点:', checkedKeys);
    setIsOpen(false);
    // 这里可以处理确定后的逻辑
    updateUrlParams({
      knPoint: checkedKeys.filter(id => typeof id === 'number') as number[],
    });
  };

  return (
    <div className="p-10">
      <div className="mb-4">
        <div className="text-sm text-gray-600 flex gap-2">
          <div>已选中的叶子节点: {checkedKeys.length} 个</div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {checkedKeys.join(', ')}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <div className="text-blue-400 cursor-pointer">打开树选择器</div>
        </DialogTrigger>
        <DialogContent className="h-[calc(100%-40px)] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <DialogTitle />
            <DialogDescription />
            <div>{JSON.stringify(checkedKeys)}</div>
            <Tree
              data={treeDate}
              checkable={true}
              checkedKeys={checkedKeys} // 传入叶子节点选中状态
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
