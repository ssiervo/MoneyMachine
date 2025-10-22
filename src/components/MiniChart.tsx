import { Area, AreaChart, ResponsiveContainer } from 'recharts';

import type { Candle } from '@/lib/api/types';

export const MiniChart = ({ candles }: { candles: Candle[] }) => (
  <ResponsiveContainer width="100%" height={32}>
    <AreaChart data={candles}>
      <Area type="monotone" dataKey="close" stroke="#1e40af" fill="#1e40af33" strokeWidth={2} />
    </AreaChart>
  </ResponsiveContainer>
);
