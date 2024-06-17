interface BudgetItem {
  id: number;
  account_id: number;
  current_year: number;
  next_year: number;
  year_after_next: number;
  description: string;
}

interface ActualBudgetItem {
  id: number;
  actual: number;
}

interface ReallocationItem {
  source_account_id?: number;
  destination_account_id?: number;
  amount: string;
}

export const flattenBudgetData = (data: any, parentId = 0) => {
  const result: BudgetItem[] = [];
  const traverse = (obj: any, id: number) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object') {
        // Continue to traverse deeper if the value is an object
        traverse(value, key.match(/^\d+$/) ? parseInt(key, 10) : id);
      } else {
        // Process budget and description fields
        const match = key.match(/^(\d+)-(currentYearBudget|nextYearBudget|yearAfterNextBudget|description)$/);
        if (match) {
          // Ensure an entry for this account_id exists
          let entry = result.find(entry => entry.account_id === parseInt(match[1], 10));
          if (!entry) {
            entry = {
              id: 0,
              account_id: parseInt(match[1], 10),
              current_year: 0,
              next_year: 0,
              year_after_next: 0,
              description: '',
            };
            result.push(entry);
          }
          // Determine the appropriate value based on the type and suffix
          const setValue = (value: any, suffix: string) => {
            if (typeof value === 'string' && suffix !== 'description') {
              return parseInt(value, 10); // Parse to integer for budget fields
            }
            return value; // Use the value directly for 'description' or if it's already a number
          };

          // Fill the entry based on the suffix
          switch (match[2]) {
            case 'currentYearBudget':
              entry.current_year = setValue(value, match[2]);
              break;
            case 'nextYearBudget':
              entry.next_year = setValue(value, match[2]);
              break;
            case 'yearAfterNextBudget':
              entry.year_after_next = setValue(value, match[2]);
              break;
            case 'description':
              entry.description = setValue(value, match[2]);
              break;
          }
        }
      }
    });
  };

  traverse(data, parentId);
  return result;
};

export const flattenActualBudgetData = (data: any, parentId = 0) => {
  const result: ActualBudgetItem[] = [];
  const traverse = (obj: any, id: number) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object') {
        // Continue to traverse deeper if the value is an object
        traverse(value, key.match(/^\d+$/) ? parseInt(key, 10) : id);
      } else {
        // Process budget and description fields
        const match = key.match(/^(\d+)-(actualBudget)$/);
        if (match) {
          // Ensure an entry for this account_id exists
          let entry = result.find(entry => entry.id === parseInt(match[1], 10));
          if (!entry) {
            entry = {
              id: parseInt(match[1], 10),
              actual: 0,
            };
            result.push(entry);
          }
          // Determine the appropriate value based on the type and suffix
          const setValue = (value: any, suffix: string) => {
            if (typeof value === 'string' && suffix !== 'description') {
              return parseInt(value, 10); // Parse to integer for budget fields
            }
            return value; // Use the value directly for 'description' or if it's already a number
          };

          // Fill the entry based on the suffix
          switch (match[2]) {
            case 'actualBudget':
              entry.actual = setValue(value, match[2]);
              break;
          }
        }
      }
    });
  };

  traverse(data, parentId);
  return result;
};

export const flattenReallocationBudgetData = (data: any, result: ReallocationItem[] = []): ReallocationItem[] => {
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (typeof value === 'object' && value !== null) {
      // Recursively process nested objects
      flattenReallocationBudgetData(value, result);
    } else if (typeof value === 'string') {
      // Process only leaf nodes
      const [accountId, transactionType] = key.split('-');
      const amount = value;
      if (value === '0') return; // Skip if amount is zero

      if (transactionType === 'amountGiven') {
        result.push({
          destination_account_id: parseInt(accountId, 10),
          amount: amount,
        });
      } else if (transactionType === 'amountTaken') {
        result.push({
          source_account_id: parseInt(accountId, 10),
          amount: amount,
        });
      }
    }
  });

  return result;
};

export const calcReallocationSums = (data: any): {destination: number; source: number; diff: number} => {
  let sourceSum = 0;
  let destinationSum = 0;

  if (!data) return {destination: 0, source: 0, diff: 0};

  const traverse = (obj: any) => {
    Object.entries(obj).forEach(([key, value]: [string, any]) => {
      const match = key.match(/^(\d+)-(amount(Taken|Given))$/);
      if (match) {
        const amount = parseFloat(value);
        if (amount === 0) return; // Skip if amount is zero

        if (match[2] === 'amountTaken') {
          sourceSum += amount;
        } else if (match[2] === 'amountGiven') {
          destinationSum += amount;
        }
      }
    });
  };

  traverse(data);
  return {source: sourceSum, destination: destinationSum, diff: sourceSum - destinationSum};
};
