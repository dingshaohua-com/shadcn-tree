import { Tree } from './tree';
import { treeDate } from '../utils/mock-data';

const DemoOne = () => {
  return (
    <div className="bg-amber-200 w-110  rounded-2xl h-160 overflow-y-auto">
      <Tree
        data={treeDate}
        checkable={true}
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
          console.log({ item, level });
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
  );
};

export default DemoOne;
