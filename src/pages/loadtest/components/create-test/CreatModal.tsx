import React, { ReactNode } from 'react';
import styles from '@/common/components/CommonModal.module.scss';
import { CommonButton } from '@/common/components/CommonButton';
import CreatTest from './CreatTest';
import { ScenarioInfo } from '@/pages/flow-canvas/types';
interface CommonModalProps {
  onConfirm?: () => void;
  onCancle?: () => void;
  showButton?: boolean;
  selectedScenario?: ScenarioInfo | null;
}

const CreatModal: React.FC<CommonModalProps> = ({
  onConfirm,
  onCancle,
  showButton = false,
  selectedScenario,
}) => {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  const handleCancle = () => {
    if (onCancle) onCancle();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create New Load Test</h2>
        </div>
        <div className={styles.content}>
          <CreatTest onClose={handleCancle} selectedScenario={selectedScenario} />
        </div>
        {showButton && <CommonButton onConfirm={handleConfirm} onCancel={handleCancle} />}
      </div>
    </div>
  );
};

export default CreatModal;
