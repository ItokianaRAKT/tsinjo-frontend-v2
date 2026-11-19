import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { ExplorerPage } from './pages/ExplorerPage'
import { HomePage } from './pages/HomePage'
import { MerchantDashboardPage } from './pages/MerchantDashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage'
import { ReservationsPage } from './pages/ReservationsPage'

/**
 * Routage de l’application : une structure globale (`MainLayout`) qui
 * enchaîne en-tête, page et pied de page.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explorer" element={<ExplorerPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/merchant" element={<MerchantDashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
