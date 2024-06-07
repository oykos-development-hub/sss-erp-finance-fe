import {Goal} from '../../types/nonFinance.ts';

export interface GoalsModalFinanceOfficerProps {
  goalId: number | undefined;
  onClose: (refetch?: any, message?: any) => void;
  handleAddGoal: (goal: Goal) => void;
  goals: Goal[];
  disabled?: boolean;
}
