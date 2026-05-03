import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from '@/layout/rootLayout';
import { Formulario } from '../pages/formulario/formulario';
import { Login } from '../pages/login/login';
import { Reservas } from '../pages/reservas/reservas';
import { useAuthStore } from '../store/auth/authStore';

export const AppRoutes = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <BrowserRouter>
      <Routes>
        {token ? (
          <Route element={<RootLayout />}>
            <Route path="/" element={<Formulario />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};
