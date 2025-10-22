import { ReactNode, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import { AppLayout } from './layout';
import { AuthPage } from '@/pages/auth';
import { MarketsPage } from '@/pages/markets';
import { NewsPage } from '@/pages/news';
import { PortfolioPage } from '@/pages/portfolio';
import { PredictionsPage } from '@/pages/predictions';
import { SettingsPage } from '@/pages/settings';
import { SymbolPage } from '@/pages/symbol';
import { TradePage } from '@/pages/trade';
import { authStorage } from '@/lib/utils/auth';

const useAuthStatus = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(() => authStorage.isAuthenticated());

  useEffect(() => authStorage.subscribe(setAuthenticated), []);

  return authenticated;
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const authenticated = useAuthStatus();
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

const ProtectedOutlet = () => (
  <ProtectedRoute>
    <Outlet />
  </ProtectedRoute>
);

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<ProtectedOutlet />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/portfolio" replace />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="markets" element={<MarketsPage />} />
          <Route path="symbol/:ticker" element={<SymbolPage />} />
          <Route path="trade" element={<TradePage />} />
          <Route path="predictions" element={<PredictionsPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/portfolio" replace />} />
    </Routes>
  </BrowserRouter>
);
