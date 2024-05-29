import {Goal} from '../../types/nonFinance.ts';

export interface GoalsModalFinanceOfficerProps {
  open: boolean;
  onClose: (refetch?: any, message?: any) => void;
  handleAddGoal: (goal: Goal) => void;
  goals: Goal[];
}
