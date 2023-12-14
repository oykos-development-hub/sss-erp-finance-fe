export interface GoalsModalProps {
  open: boolean;
  onClose: (refetch?: any, message?: any) => void;
  budgetProgramId: number;
}
