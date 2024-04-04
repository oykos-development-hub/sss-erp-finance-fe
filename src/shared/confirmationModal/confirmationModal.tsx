import {Button, Modal, Typography} from 'client-library';
import React from 'react';
import {ModalContent, ModalControlButtons, TriangleIcon} from './styles';
import {ModalProps} from './types';

export const ConfirmationModal: React.FC<ModalProps> = ({open, onClose, onConfirm, customContent, subTitle}) => {
  const buttonControls = (
    <ModalControlButtons>
      <Button content={'Potvrdi'} onClick={onConfirm} variant="primary" />
      <Button content={'Otkaži'} onClick={onClose} variant="secondary" />
    </ModalControlButtons>
  );

  const defaultContent = (
    <ModalContent>
      <TriangleIcon />
      <Typography content="Da li ste sigurni ?" variant="bodyMedium" style={{fontWeight: 600}} />
      <Typography content={subTitle} variant="bodySmall" style={{textAlign: 'center'}} />
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
