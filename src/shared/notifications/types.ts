export interface ModalProps {
  open: boolean;
  onClose: (action?: any) => void;
  handleRightButtomClick: (action?: any) => void;
  customContent?: any;
  subTitle?: string;
}
