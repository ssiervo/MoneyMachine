import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

const fetchPortfolio = async () => {
  const { data } = await api.get('/api/portfolio');
  return data;
};

const fetchHistory = async () => {
  const { data } = await api.get('/api/portfolio/history');
  return data.history;
};

export const usePortfolio = () => {
  const portfolio = useQuery({ queryKey: ['portfolio'], queryFn: fetchPortfolio, staleTime: 60000 });
  const history = useQuery({ queryKey: ['portfolio-history'], queryFn: fetchHistory, staleTime: 60000 });
  return { portfolio, history };
};
