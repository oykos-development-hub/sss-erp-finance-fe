export interface ObligationsItemForAccounting {
  id: number;
  invoice_id: number;
  salary_id: number;
  date: string;
  status: string;
  price: string;
  title: string;
  type: string;
  supplier: {
    id: number;
    title: string;
  };
}

export interface AccountingOrderItem {
  id: number;
  organization_unit: {
    id: number;
    title: string;
  };
  date_of_booking: string;
  credit_amount: number;
  debit_amount: number;
  items: [
    {
      id: number;
      account: {
        id: number;
        title: string;
      };
      title: string;
      credit_amount: number;
      debit_amount: number;
      type: string;
      invoice: {
        id: number;
        title: string;
      };
      salary: {
        id: number;
        title: string;
      };
      payment_order: {
        id: number;
        title: string;
      };
      enforced_payment: {
        id: number;
        title: string;
      };
    },
  ];
}

export interface AccountinOrderParams {
  date_of_booking: Date;
  invoice_id: number[] | null;
  salary_id: number[] | null;
  organization_unit_id: number;
}

export interface AccountingInsertParams {
  date_of_booking: string | null;
  items: {
    account_id: number;
    credit_amount: number;
    debit_amount: number;
    enforced_payment_id: number;
    title: string;
    type: string;
  }[];
}
