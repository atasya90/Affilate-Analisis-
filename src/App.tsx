import React, { useState } from 'react';
import { AppProvider, useApp, AppModule } from './contexts/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { Product } from './types';

// Page Imports
import { DashboardPage } from './pages/DashboardPage';
import { ProductExplorerPage } from './pages/ProductExplorerPage';
import { TrendingProductsPage } from './pages/TrendingProductsPage';
import { TikTokAnalysisPage } from './pages/TikTokAnalysisPage';
import { ShopeeAnalysisPage } from './pages/ShopeeAnalysisPage';
import { HashtagIntelligencePage } from './pages/HashtagIntelligencePage';
import { AffiliateProfitCalculatorPage } from './pages/AffiliateProfitCalculatorPage';
import { CompetitorAnalysisPage } from './pages/CompetitorAnalysisPage';
import { AiProductScorePage } from './pages/AiProductScorePage';
import { AiContentGeneratorPage } from './pages/AiContentGeneratorPage';
import { ProductComparisonPage } from './pages/ProductComparisonPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { HistoricalAnalyticsPage } from './pages/HistoricalAnalyticsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';

function AppContent() {
  const { activeModule } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'Dashboard':
        return <DashboardPage onOpenDetail={setDetailProduct} />;
      case 'Product Explorer':
        return <ProductExplorerPage onOpenDetail={setDetailProduct} />;
      case 'Trending Products':
        return <TrendingProductsPage onOpenDetail={setDetailProduct} />;
      case 'TikTok Shop Analysis':
        return <TikTokAnalysisPage onOpenDetail={setDetailProduct} />;
      case 'Shopee Analysis':
        return <ShopeeAnalysisPage onOpenDetail={setDetailProduct} />;
      case 'Hashtag Intelligence':
        return <HashtagIntelligencePage />;
      case 'Affiliate Profit Calculator':
        return <AffiliateProfitCalculatorPage />;
      case 'Competitor Analysis':
        return <CompetitorAnalysisPage onOpenDetail={setDetailProduct} />;
      case 'AI Product Score':
        return <AiProductScorePage onOpenDetail={setDetailProduct} />;
      case 'AI Content Generator':
        return <AiContentGeneratorPage />;
      case 'Product Comparison':
        return <ProductComparisonPage onOpenDetail={setDetailProduct} />;
      case 'Watchlist':
        return <WatchlistPage onOpenDetail={setDetailProduct} />;
      case 'Historical Analytics':
        return <HistoricalAnalyticsPage />;
      case 'Data Sources':
        return <DataSourcesPage />;
      case 'Settings':
        return <SettingsPage />;
      case 'Admin Panel':
        return <AdminPanelPage />;
      default:
        return <DashboardPage onOpenDetail={setDetailProduct} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        closeMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <Header openMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
