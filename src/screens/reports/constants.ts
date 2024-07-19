export const accountingReportOptions = [
  {id: 1, title: 'Analitička kartica'},
  {id: 0, title: 'Dnevnik knjiženja'},
  {id: 2, title: 'Glavna knjiga'},
];

export enum AccountingReportType {
  PostingJournal = 0,
  AnalyticalCard = 1,
  Ledger = 2,
}

export const TypesOfObligation = [
  {id: 'obligations', title: 'Obaveze'},
  {id: 'payment_orders', title: 'Nalozi za plaćanje'},
  {id: 'enforced_payments', title: 'Prinudne naplate'},
  {id: 'return_enforced_payment', title: 'Povraćaji prinudnih naplata'},
];
