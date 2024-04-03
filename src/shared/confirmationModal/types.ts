export interface ModalProps {
  open: boolean;
  onClose: (action?: any) => void;
  onConfirm: (action?: any) => void;
  customContent?: any;
  subTitle?: string;
}
