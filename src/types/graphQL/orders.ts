import {DropdownData} from '../dropdownData';
import {GetResponse} from './response';

export interface OrderListArticleType {
  id: number;
  title: string;
  description: string;
  manufacturer: string;
  unit: string;
  amount: number;
  total_price: number;
  available?: number;
  net_price: number;
}

export interface OrderListItem {
  id: number;
  date_order: string;
  total_bruto: number;
  total_neto: number;
  public_procurement: DropdownData<string>;
  supplier: DropdownData<string>;
  status: string;
  articles: OrderListArticleType[];
  invoice_date: string;
  invoice_number: string;
  date_system: string;
  description: string;
  recipient_user: DropdownData<string>;
  office: DropdownData<string>;
  price: number;
  order_file: {
    id: number;
    name: string;
    type: string;
  };
  receive_file: {
    id: number;
    name: string;
    type: string;
  };
  movement_file: {
    id: number;
    name: string;
    type: string;
  };
  group_of_articles: DropdownData<string>;
  pro_forma_invoice_number: string;
  pro_forma_invoice_date: string;
}

export type GetOrderListResponse = {orderList_Overview: GetResponse<OrderListItem>};

export interface GetOrderListParams {
  page?: number;
  size?: number;
  id?: number;
  supplier_id?: number;
  status?: string;
  search?: string;
  finance_overview?: boolean;
}

export interface OrderListReceiveParams {
  order_id: number;
  date_system: string | null;
  invoice_date: string | null;
  invoice_number: string | null;
  description: string;
  receive_file?: number | null;
}
