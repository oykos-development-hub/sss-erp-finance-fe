import {createOptions} from '../utils/createOptions';

//* BudgetStatusTypeEnum and BudgetSubmissionStatusEnum are meant for a single, mutual status field.

export enum BudgetStatusTypeEnum {
  Created = 1,
  Sent = 2,
  Completed = 3,
}

export const BudgetStatusTypeDisplay: {[key in BudgetStatusTypeEnum]: string} = {
  [BudgetStatusTypeEnum.Created]: 'Kreiran',
  [BudgetStatusTypeEnum.Sent]: 'Poslat',
  [BudgetStatusTypeEnum.Completed]: 'Zaključen',
};

export const BudgetStatusOptions = createOptions(BudgetStatusTypeDisplay);

export enum BudgetSubmissionStatusEnum {
  ToBeFilled = 4,
  InProgress = 5,
  Completed = 6,
}

export const BudgetSubmissionStatusDisplay: {[key in BudgetSubmissionStatusEnum]: string} = {
  [BudgetSubmissionStatusEnum.ToBeFilled]: 'Obradi',
  [BudgetSubmissionStatusEnum.InProgress]: 'U toku',
  [BudgetSubmissionStatusEnum.Completed]: 'Zaključen',
};

export const BudgetSubmissionStatusOptions = createOptions(BudgetSubmissionStatusDisplay);
