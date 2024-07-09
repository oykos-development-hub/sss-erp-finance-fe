import {Count, FilledDataActual} from '../types/graphQL/counts.ts';

const calculateSumsForNode = (node: Count): FilledDataActual => {
  if (!node.children || node.children.length === 0) {
    return node.filled_data as FilledDataActual;
  }

  const initialSum: FilledDataActual = {actual: 0, balance: 0, budget_id: 0, initial_actual: 0, current_amount: 0};

  const summedData = node.children.reduce<FilledDataActual>((acc, child) => {
    const childData = calculateSumsForNode(child);
    return {
      actual: acc.actual + childData.actual,
      balance: acc.balance + childData.balance,
      budget_id: acc.budget_id + childData.budget_id,
      initial_actual: acc.initial_actual + childData.initial_actual,
      current_amount: acc.current_amount + childData.current_amount,
    };
  }, initialSum);

  node.filled_data = summedData;
  return summedData;
};

export const calculateSums = (nodes: Count[]): Count[] => {
  nodes.forEach(node => calculateSumsForNode(node));
  return nodes;
};
