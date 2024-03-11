import {useEffect, useState} from 'react';
import useAppContext from '../../../context/useAppContext';
import {GetOrderListParams, GetOrderListResponse, OrderListItem} from '../../../types/graphQL/orders';
import getOrderList from './getOrders';

const useGetOrderList = (params: GetOrderListParams) => {
  const [total, setTotal] = useState<number>(0);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchOrders = async () => {
    const response: GetOrderListResponse = await fetch(getOrderList, params);
    const totalNum = response?.orderList_Overview?.total;
    setTotal(totalNum || 0);

    const items = response?.orderList_Overview?.items;

    setOrders(items || []);
    setLoading(false);
  };

  useEffect(() => {
    if (params.supplier_id) {
      fetchOrders();
    }
  }, [params.page, params.size, params.id, params.supplier_id, params.status, params.search]);

  return {orders, loading, total: total, fetch: fetchOrders};
};

export default useGetOrderList;
