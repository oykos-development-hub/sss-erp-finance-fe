export interface FinePaymentForm {
  fine_id: number;
  payment_method: number;
  amount: number;
  payment_date: string;
  receipt_number: string;
  payment_reference_number: string;
  debit_reference_number: string;
}
