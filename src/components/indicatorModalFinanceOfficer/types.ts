export interface IndicatorModalProps {
  indicatorId?: number;
  goalId?: number;
  onClose: (refetch?: any, message?: any) => void;
  handleAddIndicator: (data: any) => void;
}
