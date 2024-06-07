export interface IndicatorModalProps {
  onClose: (refetch?: any, message?: any) => void;
  handleAddIndicator: (data: any) => void;
  indicatorId?: number;
  goalId?: number;
  disabled?: boolean;
}
