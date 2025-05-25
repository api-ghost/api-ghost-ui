import React, { MouseEvent, useState, useEffect, useMemo } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';
import { useBodyEditorController } from '@/pages/flow-canvas/hooks/useBodyEditorController';
import { BODY_EDITOR_TABS, Tab } from '@/pages/flow-canvas/types/index';
import { MainTabType, SubTabType } from '@/pages/flow-canvas/types';
import RenderJsonSchema from '@/pages/flow-canvas/components/custom-node/RenderJsonSchema';
import RenderHeaderInputTable from './RenderHeaderInputTable';
import JsonToggleField from '@/pages/flow-canvas/components/custom-node/JsonToggleField';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setShowBodyVisibility, updateNodeSchema } from '@/store/slices/flowSlice';
import { setNodeTab } from '@/store/slices/nodeTabSlice';

interface NodeBodyProps {
  nodeId: string;
}

const NodeBody: React.FC<NodeBodyProps> = ({ nodeId }) => {
  const dispatch = useAppDispatch();
  const node = useAppSelector(state => state.flow.nodes.find(n => n.id === nodeId));

  const currentTab = useAppSelector(state => state.nodeTab[nodeId]);
  const mainTab = currentTab?.mainTab ?? MainTabType.REQUEST;
  const subTab = currentTab?.subTab ?? SubTabType.HEADER;

  const [reqSchema, setReqSchema] = useState('');
  const [resSchema, setResSchema] = useState('');
  const [header, setHeader] = useState('');

  useEffect(() => {
    if (node?.data) {
      setReqSchema(node.data.requestSchema ?? '');
      setResSchema(node.data.responseSchema ?? '');
      setHeader(node.data.header ?? '');
    }
  }, [JSON.stringify(node?.data)]);

  const handleSave = () => {
    dispatch(
      updateNodeSchema({
        nodeId,
        requestSchema: reqSchema,
        responseSchema: resSchema,
        header,
      }),
    );
    dispatch(setShowBodyVisibility({ nodeId, visible: false }));
  };

  const handleMainTab = (tab: Tab) => {
    const firstSub =
      BODY_EDITOR_TABS.find(group => group.mainTab.label === tab.label)?.subTabs[0]?.label ??
      SubTabType.HEADER;
    dispatch(
      setNodeTab({ nodeId, mainTab: tab.label as MainTabType, subTab: firstSub as SubTabType }),
    );
  };

  const handleSubTab = (tab: Tab) => {
    dispatch(setNodeTab({ nodeId, mainTab, subTab: tab.label as SubTabType }));
  };

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();
  const isRequestTab = mainTab === MainTabType.REQUEST;
  if (!node?.data) return null;

  return (
    <div className={styles.editorPopover} onClick={stopPropagation}>
      <nav className={styles.mainTabs}>
        {BODY_EDITOR_TABS.map(group => (
          <button
            key={group.mainTab.label}
            className={`${styles.tab} ${mainTab === group.mainTab.label ? styles.activeMainTab : ''}`}
            onClick={() => handleMainTab(group.mainTab)}
          >
            {group.mainTab.label}
          </button>
        ))}
      </nav>

      <nav className={styles.subTabs}>
        {BODY_EDITOR_TABS.find(group => group.mainTab.label === mainTab)?.subTabs.map(sub => (
          <button
            key={sub.label}
            className={`${styles.tab} ${subTab === sub.label ? styles.activeSubTab : ''}`}
            onClick={() => handleSubTab(sub)}
          >
            {sub.label}
          </button>
        ))}
      </nav>

      {subTab === SubTabType.HEADER && (
        <RenderHeaderInputTable header={header} onChange={setHeader} />
      )}
      {BODY_EDITOR_TABS.some(group =>
        group.subTabs.find(t => t.label === subTab && t.showSchema),
      ) && (
        <section className={styles.contentArea}>
          {isRequestTab ? (
            <JsonToggleField
              initialJson={reqSchema}
              editable={true}
              onChange={setReqSchema}
              className={styles.jsonSchemaField}
            />
          ) : (
            <JsonToggleField
              initialJson={resSchema}
              editable={true}
              onChange={setResSchema}
              className={styles.jsonSchemaField}
            />
          )}
        </section>
      )}

      <footer className={styles.buttonRow}>
        <button className={styles.saveButton} onClick={handleSave}>
          Save
        </button>
        <button
          className={styles.closeButton}
          onClick={() => dispatch(setShowBodyVisibility({ nodeId, visible: false }))}
        >
          Close
        </button>
      </footer>
    </div>
  );
};

export default NodeBody;
