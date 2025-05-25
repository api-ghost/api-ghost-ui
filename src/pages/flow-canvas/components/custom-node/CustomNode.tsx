import React, { useEffect, MouseEvent, useState, useRef } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import NodeBody from '@/pages/flow-canvas/components/custom-node/NodeBody';
import styles from '@/pages/flow-canvas/styles/CustomNode.module.scss';
import { NodeEndPoint } from '@/pages/flow-canvas/types';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleShowBody, updateNodePath, updateNodeSchema } from '@/store/slices/flowSlice';

const CustomNode: React.FC<NodeProps<NodeEndPoint>> = ({ id }) => {
  const dispatch = useAppDispatch();
  const node = useAppSelector(state => state.flow.nodes.find(n => n.id === id));

  const data = node?.data;

  const [isEditingPath, setIsEditingPath] = useState(false);
  const [tempPath, setTempPath] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!data) return;
    setTempPath(data.path);
  }, [data?.path]);

  useEffect(() => {
    if (isEditingPath && inputRef.current) {
      const len = inputRef.current.value.length;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isEditingPath]);
  if (!data) return null;

  const handleDoubleClickPath = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEditingPath(true);
  };

  const handlePathBlur = () => {
    const newPath = tempPath.trim();
    dispatch(updateNodePath({ nodeId: id, path: newPath }));
    setIsEditingPath(false);
  };

  const handleToggleBody = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    dispatch(toggleShowBody(id));
  };

  const { baseUrl, method, isSuccess: pass, isFail: nonPass, showBody, type } = data;

  const isPassStyle = pass ? 'success' : '';
  const isFailStyle = nonPass ? 'fail' : '';
  const isMockNode = type === 'mockNode';

  return (
    <div className={styles.nodeWrapper}>
      <div className={`${styles.node}`}>
        <div
          className={`${styles.header} ${isPassStyle && styles.passHeader} ${isFailStyle && styles.nonPassHeader} ${isMockNode && styles.mockHeader}`}
        >
          {baseUrl}
        </div>

        <div
          className={`${styles.actions} ${isPassStyle && styles.passBody} ${isFailStyle && styles.nonpassBody} `}
        >
          <div className={`${styles.methodButton} ${styles[`${method}Method`]}`}>{method}</div>
          {isEditingPath ? (
            <input
              ref={inputRef}
              type="text"
              className={styles.pathInput}
              value={tempPath}
              onChange={e => setTempPath(e.target.value)}
              onBlur={handlePathBlur}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handlePathBlur();
                }
              }}
            />
          ) : (
            <span className={styles.path} onDoubleClick={handleDoubleClickPath}>
              {data.path}
            </span>
          )}
          <div className={styles.menuIcon} onClick={handleToggleBody}>
            <span className={styles.line} />
            <span className={styles.line} />
            <span className={styles.line} />
          </div>
        </div>

        {showBody && <NodeBody nodeId={id} />}
      </div>
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
};

export default CustomNode;
