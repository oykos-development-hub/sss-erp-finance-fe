import {Count} from '../types/graphQL/counts.ts';
import {DropdownData} from '../types/dropdownData.ts';

interface Transaction {
  amount: string;
  destination_account: DropdownData<number>;
  id: number;
  source_account: DropdownData<number>;
}

interface CountForPDF extends Count {
  destination?: string;
  source?: string;
  label: string;
}
const removeFilledData = (nodes: Count[]): Count[] => {
  return nodes.map(node => {
    const {filled_data, children, ...rest} = node;
    return {
      ...rest,
      children: removeFilledData(children as Count[]),
      label: `${rest.serial_number} - ${rest.title}`,
    };
  });
};

const updateBudgetNodes = (nodes: CountForPDF[], transactions: Transaction[]): CountForPDF[] => {
  const findAndUpdateNode = (node: CountForPDF, transaction: Transaction) => {
    if (node.id === transaction.destination_account.id) {
      node.destination = transaction.amount;
    }
    if (node.id === transaction.source_account.id) {
      node.source = transaction.amount;
    }
    node.children = node?.children?.map(child => findAndUpdateNode(child, transaction));
    return node;
  };

  transactions.forEach(transaction => {
    nodes = nodes.map(node => findAndUpdateNode(node, transaction));
  });

  return nodes;
};

const flattenNodes = (nodes: CountForPDF[]): CountForPDF[] => {
  const flatArray: CountForPDF[] = [];

  const flatten = (node: CountForPDF) => {
    const {children, ...rest} = node;
    flatArray.push(rest as CountForPDF);
    node.children?.forEach(child => flatten(child));
  };

  nodes.forEach(node => flatten(node));

  return flatArray;
};

export const generateInternalReallocationPdfData = (nodes: Count[], transactions: Transaction[]): CountForPDF[] => {
  const resultWithoutFilledData = removeFilledData(nodes);
  const updatedResult = updateBudgetNodes(resultWithoutFilledData as CountForPDF[], transactions);

  const calculateSums = (node: CountForPDF): {destination: number; source: number} => {
    let destination = 0;
    let source = 0;

    if (node.destination) {
      destination += parseFloat(node.destination);
    }

    if (node.source) {
      source += parseFloat(node.source);
    }

    node.children?.forEach(child => {
      const childSums = calculateSums(child);
      destination += childSums.destination;
      source += childSums.source;
    });

    // TODO add format currency
    node.destination = destination.toString();
    node.source = source.toString();

    return {destination, source};
  };

  updatedResult.forEach(node => calculateSums(node));

  return flattenNodes(updatedResult);
};
