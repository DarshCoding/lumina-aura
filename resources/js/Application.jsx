import { Route, Routes } from "react-router-dom";
import SiteLayout from "@/layouts/SiteLayout";
import HomePage from "@/pages/HomePage";
import CollectionPage from "@/pages/CollectionPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import GiftsPage from "@/pages/GiftsPage";
import LoginPage from "@/pages/admin/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import ProductsPage from "@/pages/admin/ProductsPage";
import InventoryPage from "@/pages/admin/InventoryPage";
import BillingsPage from "@/pages/admin/BillingsPage";
import HampersPage from "@/pages/admin/HampersPage";
import SiteContentPage from "@/pages/admin/SiteContentPage";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShell } from "@/components/admin/AdminShell";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="collection" element={<CollectionPage />} />
        <Route path="collection/:id" element={<ProductDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="gifts" element={<GiftsPage />} />
      </Route>

      <Route path="/admin/login" element={<LoginPage />} />

      <Route path="/admin" element={<AdminGuard />}>
        <Route element={<AdminShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="billings" element={<BillingsPage />} />
          <Route path="hampers" element={<HampersPage />} />
          <Route path="content" element={<SiteContentPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
