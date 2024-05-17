export const accountingReportOptions = [
  {id: 0, title: 'Dnevnik knjiženja'},
  {id: 1, title: 'Analitička kartica'},
];

export enum AccountingReportType {
  PostingJournal = 0,
  AnalyticalCard = 1,
}

export const TypesOfObligation = [
  {id: 'obligations', title: 'Obaveze'},
  {id: 'payment_orders', title: 'Nalozi za plaćanje'},
  {id: 'enforced_payments', title: 'Prinudna naplata'},
  {id: 'return_enforced_payment', title: 'Povraćaji prinudne naplate'},
];
