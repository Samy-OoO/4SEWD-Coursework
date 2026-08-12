import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { Route, Routes } from 'react-router-dom';

import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import StockAlerts from './pages/StockAlerts';
import Suppliers from './pages/Suppliers';
import SupplierDetails from './pages/SupplierDetails';
import ViewProduct from './pages/ViewProduct';
import ProductForm from './pages/ProductForm';
import SupplierForm from './pages/SupplierForm';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <>
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell><Dashboard /></AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <AppShell><Products /></AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/stock-alerts"
            element={
              <ProtectedRoute>
                <AppShell><StockAlerts /></AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/suppliers"
            element={
              <ProtectedRoute>
                <AppShell><Suppliers /></AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/suppliers/:id"
            element={
              <ProtectedRoute>
                <AppShell><SupplierDetails /></AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <AppShell><ViewProduct /></AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/new"
            element={
              <ProtectedRoute>
                <AppShell><ProductForm /></AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/edit/:id"
            element={
              <ProtectedRoute>
                <AppShell><ProductForm /></AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/suppliers/new"
            element={
              <ProtectedRoute>
                <AppShell><SupplierForm /></AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/suppliers/edit/:id"
            element={
              <ProtectedRoute>
                <AppShell><SupplierForm /></AppShell>
              </ProtectedRoute>
            }
          />

        </Routes>
      </DataProvider>
    </AuthProvider>
    </>
  );
}

export default App;