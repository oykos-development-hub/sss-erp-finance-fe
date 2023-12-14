export interface DeleteModalProps {
  open: boolean;
  onClose: (action?: any) => void;
  handleDelete: (action?: any) => void;
  customContent?: any;
}
