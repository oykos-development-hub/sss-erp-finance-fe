import {Button, Modal, Typography} from 'client-library';
import React from 'react';
import {DeleteModalContent, DeleteModalControlButtons, TriangleIcon} from './styles';
import {DeleteModalProps} from './types';

export const DeleteModal: React.FC<DeleteModalProps> = ({open, onClose, handleDelete, customContent}) => {
  const buttonControls = (
    <DeleteModalControlButtons>
      <Button content={'Obriši'} onClick={handleDelete} variant="primary" />
      <Button content={'Otkaži'} onClick={onClose} variant="secondary" />
    </DeleteModalControlButtons>
  );

  const defaultContent = (
    <DeleteModalContent>
      <TriangleIcon />
      <Typography content="Da li ste sigurni ?" variant="bodyLarge" style={{fontWeight: 600}} />
      <Typography content="Ovaj budžet će biti trajno izbrisan iz sistema" variant="bodySmall" />
    </DeleteModalContent>
  );

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose(true);
      }}
      width={450}
      leftButtonText="Obriši"
      rightButtonText="Otkaži"
      content={customContent ? customContent : defaultContent}
      customButtonsControls={buttonControls}
    />
  );
};
