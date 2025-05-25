import React, { MouseEvent, useState, useEffect } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';
import { useBodyEditorController } from '@/pages/flow-canvas/hooks/useBodyEditorController';
import { BODY_EDITOR_TABS, Tab } from '@/pages/flow-canvas/types';
import { RequestBody } from '@/common/types';
import { MainTabType, SubTabType } from '@/pages/flow-canvas/types';
import RenderHeaderInputTable from './RenderHeaderInputTable';
import JsonToggleField from './JsonToggleField';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setShowBodyVisibility, updateNodeSchema } from '@/store/slices/flowSlice';
import { setNodeTab } from '@/store/slices/nodeTabSlice';

interface ScenarioNodeBodyProps {
  nodeId: string;
}

const ScenarioNodeBody: React.FC<ScenarioNodeBodyProps> = ({ nodeId }) => {
  const dispatch = useAppDispatch();
  const node = useAppSelector(state => state.flow.nodes.find(n => n.id === nodeId));
  const tab = useAppSelector(state => state.nodeTab[nodeId]) ?? {
    mainTab: MainTabType.REQUEST,
    subTab: SubTabType.HEADER,
  };
  const [reqSchema, setReqSchema] = useState<RequestBody>({ json: '' });
  const [resSchema, setResSchema] = useState<string>('');
  const [header, setHeader] = useState<string>('');

  const { mainTab, subTab, selectMainTab, selectSubTab, availableSubTabs } =
    useBodyEditorController(BODY_EDITOR_TABS, tab.mainTab, tab.subTab);

  useEffect(() => {
    if (!node?.data) return;
    const raw = node.data.requestSchema as any;
    if (typeof raw === 'string') {
      setReqSchema({ json: raw });
    } else if (raw && typeof raw.json === 'string') {
      setReqSchema({ json: raw.json });
    } else {
      setReqSchema({ json: '' });
    }
    setResSchema(node.data.responseSchema ?? '');
    setHeader(node.data.header ?? '');
  }, [JSON.stringify(node?.data)]);

  const handleSave = () => {
    dispatch(
      updateNodeSchema({
        nodeId,
        requestSchema: reqSchema.json || '',
        responseSchema: resSchema,
        header: header,
      }),
    );
    dispatch(setShowBodyVisibility({ nodeId, visible: false }));
  };

  const handleClose = () => {
    dispatch(setShowBodyVisibility({ nodeId, visible: false }));
  };

  const handleMainTab = (tab: Tab) => {
    selectMainTab(tab);
    dispatch(
      setNodeTab({ nodeId, mainTab: tab.label as MainTabType, subTab: subTab.label as SubTabType }),
    );
  };

  const handleSubTab = (tab: Tab) => {
    selectSubTab(tab);
    dispatch(
      setNodeTab({
        nodeId,
        mainTab: mainTab.label as MainTabType,
        subTab: tab.label as SubTabType,
      }),
    );
  };

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  const updateRequestJson = (updated: string) => {
    setReqSchema({ json: updated });
  };
  if (!node?.data) return null;

  return (
    <div className={styles.editorPopover} onClick={stopPropagation}>
      <nav className={styles.mainTabs}>
        {BODY_EDITOR_TABS.map(group => (
          <button
            key={group.mainTab.label}
            className={`${styles.tab} ${
              mainTab.label === group.mainTab.label ? styles.activeMainTab : ''
            }`}
            onClick={() => handleMainTab(group.mainTab)}
          >
            {group.mainTab.label}
          </button>
        ))}
      </nav>

      <nav className={styles.subTabs}>
        {availableSubTabs.map(tab => (
          <button
            key={tab.label}
            className={`${styles.tab} ${subTab.label === tab.label ? styles.activeSubTab : ''}`}
            onClick={() => handleSubTab(tab)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {subTab.label === SubTabType.HEADER && (
        <RenderHeaderInputTable header={header} onChange={setHeader} />
      )}
      {subTab.showSchema && (
        <section className={styles.contentArea}>
          <JsonToggleField
            initialJson={reqSchema.json ?? ''}
            defaultToJson={true}
            editable={true}
            onChange={updateRequestJson}
          />
        </section>
      )}

      <footer className={styles.buttonRow}>
        {
          <button className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
        }
        <button className={styles.closeButton} onClick={handleClose}>
          Close
        </button>
      </footer>
    </div>
  );
};

export default ScenarioNodeBody;
