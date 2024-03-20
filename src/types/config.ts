import {createOptions} from '../utils/createOptions';

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
  ToBeFilled = 1,
  InProgress = 2,
  Completed = 3,
}

export const BudgetSubmissionStatusDisplay: {[key in BudgetStatusTypeEnum]: string} = {
  [BudgetSubmissionStatusEnum.ToBeFilled]: 'Obradi',
  [BudgetSubmissionStatusEnum.InProgress]: 'U toku',
  [BudgetSubmissionStatusEnum.Completed]: 'Zaključen',
};

export const BudgetSubmissionStatusOptions = createOptions(BudgetSubmissionStatusDisplay);
