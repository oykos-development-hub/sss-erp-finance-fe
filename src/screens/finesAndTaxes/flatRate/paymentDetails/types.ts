export interface PaymentDetails {
  id: number;
  flat_rate_id: number;
  payment_method: {
    id: number;
    title: string;
  };
  amount: number;
  payment_date: string;
  payment_due_date: string;
  receipt_number: string;
  payment_reference_number: string;
  debit_reference_number: string;
  status: {
    id: number;
    title: string;
  };
  // only for FE, because useFieldArray will overwrite the id
  originalID?: number;
}
