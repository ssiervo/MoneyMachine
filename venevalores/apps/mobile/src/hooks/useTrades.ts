import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { TradeFormValues } from '../utils/validators';

const fetchTrades = async () => {
  const { data } = await api.get('/api/trades');
  return data.trades;
};

export const useTrades = () => {
  const client = useQueryClient();
  const trades = useQuery({ queryKey: ['trades'], queryFn: fetchTrades });

  const createTrade = useMutation({
    mutationFn: (payload: TradeFormValues) => api.post('/api/trades', payload).then((res) => res.data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['trades'] });
      client.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });

  return { trades, createTrade };
};
