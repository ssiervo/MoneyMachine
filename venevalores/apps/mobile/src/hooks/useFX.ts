import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

const fetchFx = async () => {
  const { data } = await api.get('/api/fx');
  return data;
};

export const useFx = () => {
  return useQuery({ queryKey: ['fx'], queryFn: fetchFx, staleTime: 60000 });
};
