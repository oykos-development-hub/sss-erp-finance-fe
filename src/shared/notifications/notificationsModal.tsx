import {Button, Modal, Typography} from 'client-library';
import React from 'react';
import {ModalContent, ModalControlButtons, TriangleIcon} from './styles';
import {ModalProps} from './types';

export const NotificationsModal: React.FC<ModalProps> = ({
  open,
  onClose,
  handleRightButtomClick,
  customContent,
  subTitle,
}) => {
  const buttonControls = (
    <ModalControlButtons>
      <Button content={'Otkaži'} onClick={onClose} variant="secondary" />
      <Button content={'Potvrdi'} onClick={handleRightButtomClick} variant="primary" />
    </ModalControlButtons>
  );

  const defaultContent = (
    <ModalContent>
      <TriangleIcon />
      <Typography content="Da li ste sigurni ?" variant="bodyMedium" style={{fontWeight: 600}} />
      <Typography content={subTitle} variant="bodySmall" />
    </ModalContent>
  );

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose(true);
      }}
      width={450}
      content={customContent ? customContent : defaultContent}
      customButtonsControls={buttonControls}
    />
  );
};
