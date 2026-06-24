import React from 'react';
import { useStore } from './store/useStore';
import Sidebar from './components/Sidebar';
import ServiceOrdersModule from './components/ServiceOrdersModule';
import ClientsModule from './components/ClientsModule';
import PartsModule from './components/PartsModule';

function App() {
  const { activeTab, setActiveTab } = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <ServiceOrdersModule />;
      case 'clients':
        return <ClientsModule />;
      case 'parts':
        return <PartsModule />;
      default:
        return <ServiceOrdersModule />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden bg-slate-100">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
