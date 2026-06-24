import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { ServiceOrder, OrderStatus, IshikawaCause, ServiceItem } from '../types';

// Icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ishikawaLabels: { value: IshikawaCause; label: string; description: string }[] = [
  { value: 'Mão de Obra', label: 'Mão de Obra', description: 'Funcionários, capacitação, carga de trabalho' },
  { value: 'Máquina', label: 'Máquina', description: 'Equipamentos, ferramentas, manutenção' },
  { value: 'Material', label: 'Material', description: 'Peças, suprimentos, fornecedores' },
  { value: 'Método', label: 'Método', description: 'Processos, procedimentos, fluxos' },
  { value: 'Medida', label: 'Medida', description: 'Métricas, padrões, qualidade' },
  { value: 'Meio Ambiente', label: 'Meio Ambiente', description: 'Clima, local, condições externas' },
];

const statusOptions: OrderStatus[] = ['Aberta', 'Aprovada', 'Em andamento', 'Fechada', 'Cancelada'];

interface OrderFormData {
  clientId: string;
  clientName: string;
  vehicle: string;
  plate: string;
  status: OrderStatus;
  notaFiscal: string;
  paymentReceived: boolean;
  gravity: number;
  urgency: number;
  trend: number;
  ishikawaCause: IshikawaCause;
  items: ServiceItem[];
}

const initialFormData: OrderFormData = {
  clientId: '',
  clientName: '',
  vehicle: '',
  plate: '',
  status: 'Aberta',
  notaFiscal: '',
  paymentReceived: false,
  gravity: 3,
  urgency: 3,
  trend: 3,
  ishikawaCause: '',
  items: [],
};

export const ServiceOrdersModule: React.FC = () => {
  const { orders, clients, addOrder, updateOrder, deleteOrder, selectedOrderId, selectOrder } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null);
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');

  // Sort orders by GUT score descending
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.gutScore - a.gutScore);
  }, [orders]);

  const selectedOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  const openCreateModal = () => {
    setEditingOrder(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (order: ServiceOrder) => {
    setEditingOrder(order);
    setFormData({
      clientId: order.clientId,
      clientName: order.clientName,
      vehicle: order.vehicle,
      plate: order.plate,
      status: order.status,
      notaFiscal: order.notaFiscal,
      paymentReceived: order.paymentReceived,
      gravity: order.gravity,
      urgency: order.urgency,
      trend: order.trend,
      ishikawaCause: order.ishikawaCause,
      items: [...order.items],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalValue = formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (editingOrder) {
      updateOrder(editingOrder.id, {
        ...formData,
        totalValue,
      });
    } else {
      addOrder({
        ...formData,
        totalValue,
      });
    }
    setIsModalOpen(false);
    setFormData(initialFormData);
  };

  const addItem = () => {
    if (newItemName && newItemPrice) {
      const newItem: ServiceItem = {
        id: Math.random().toString(36).substring(2, 9),
        name: newItemName,
        price: parseFloat(newItemPrice),
        quantity: parseInt(newItemQty) || 1,
      };
      setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
      setNewItemName('');
      setNewItemPrice('');
      setNewItemQty('1');
    }
  };

  const removeItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Aberta': return 'bg-blue-100 text-blue-800';
      case 'Aprovada': return 'bg-green-100 text-green-800';
      case 'Em andamento': return 'bg-yellow-100 text-yellow-800';
      case 'Fechada': return 'bg-gray-100 text-gray-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGUTScore = () => {
    return formData.gravity * formData.urgency * formData.trend;
  };

  const getGUTColor = (score: number) => {
    if (score > 100) return 'bg-red-600';
    if (score > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Ordens de Serviço</h2>
            <p className="text-slate-500 text-sm mt-1">Gerencie as ordens de serviço da oficina</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <PlusIcon />
            Nova O.S.
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">ID O.S.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Veículo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Situação</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">NF</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Valor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Score GUT</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => selectOrder(order.id)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    order.gutScore > 100 ? 'border-l-4 border-l-red-500' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-mono text-slate-600">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{order.clientName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{order.vehicle}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{order.notaFiscal}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">
                    R$ {order.totalValue.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-10 h-7 rounded-lg text-sm font-bold text-white ${getGUTColor(order.gutScore)}`}>
                      {order.gutScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(order); }}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedOrders.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              Nenhuma ordem de serviço encontrada
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedOrder && (
        <div className="w-96 bg-white border-l border-slate-200 shadow-lg overflow-auto">
          <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Detalhes da O.S.</h3>
            <button
              onClick={() => selectOrder(null)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <XIcon />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Client Info */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Cliente</h4>
              <p className="font-medium text-slate-800">{selectedOrder.clientName}</p>
              <p className="text-sm text-slate-600">{selectedOrder.vehicle}</p>
              <p className="text-sm text-slate-500">Placa: {selectedOrder.plate}</p>
            </div>

            {/* Status & Payment */}
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-slate-50 rounded-lg">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Situação</h4>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex-1 p-3 bg-slate-50 rounded-lg">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Pagamento</h4>
                <span className={`inline-flex items-center gap-1 text-sm font-medium ${selectedOrder.paymentReceived ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedOrder.paymentReceived ? <><CheckIcon /> Pago</> : 'Pendente'}
                </span>
              </div>
            </div>

            {/* Financial */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Informações Financeiras</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Nota Fiscal:</span>
                <span className="text-sm font-medium text-slate-800">{selectedOrder.notaFiscal}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-slate-600">Valor Total:</span>
                <span className="text-lg font-bold text-slate-800">
                  R$ {selectedOrder.totalValue.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* GUT Score */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Matriz GUT</h4>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-2 rounded-lg text-white font-bold ${getGUTColor(selectedOrder.gutScore)}`}>
                  {selectedOrder.gutScore}
                </span>
                <span className="text-sm text-slate-600">
                  {selectedOrder.gutScore > 100 ? 'Crítico' : selectedOrder.gutScore > 50 ? 'Alto' : 'Normal'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded">
                  <span className="block text-slate-400">G</span>
                  <span className="font-semibold text-slate-700">{selectedOrder.gravity}</span>
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="block text-slate-400">U</span>
                  <span className="font-semibold text-slate-700">{selectedOrder.urgency}</span>
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="block text-slate-400">T</span>
                  <span className="font-semibold text-slate-700">{selectedOrder.trend}</span>
                </div>
              </div>
            </div>

            {/* Service Items */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Itens de Serviço</h4>
              {selectedOrder.items.length > 0 ? (
                <ul className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.name}</span>
                      <span className="font-medium text-slate-800">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">Nenhum item adicionado</p>
              )}
            </div>

            {/* Ishikawa Diagram - Show when status is "Em andamento" or has cause */}
            {(selectedOrder.status === 'Em andamento' || selectedOrder.ishikawaCause) && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Diagrama de Ishikawa</h4>
                <p className="text-sm text-slate-600 mb-3">Causa do atraso/problema:</p>
                <select
                  value={selectedOrder.ishikawaCause}
                  onChange={(e) => updateOrder(selectedOrder.id, { ishikawaCause: e.target.value as IshikawaCause })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma causa...</option>
                  {ishikawaLabels.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                {selectedOrder.ishikawaCause && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-700">{selectedOrder.ishikawaCause}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {ishikawaLabels.find((l) => l.value === selectedOrder.ishikawaCause)?.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingOrder ? 'Editar O.S.' : 'Nova Ordem de Serviço'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Client Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => {
                      const client = clients.find((c) => c.id === e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        clientId: e.target.value,
                        clientName: client?.name || '',
                        vehicle: client?.associatedVehicle.split(' - ')[0] || '',
                        plate: client?.associatedVehicle.split(' - ')[1] || '',
                      }));
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um cliente...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Veículo</label>
                  <input
                    type="text"
                    value={formData.vehicle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vehicle: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Honda Civic"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Placa</label>
                  <input
                    type="text"
                    value={formData.plate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, plate: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: ABC-1234"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nota Fiscal</label>
                  <input
                    type="text"
                    value={formData.notaFiscal}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notaFiscal: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: NF-001234"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Situação</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as OrderStatus }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.paymentReceived}
                      onChange={(e) => setFormData((prev) => ({ ...prev, paymentReceived: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Pagamento Recebido</span>
                  </label>
                </div>
              </div>

              {/* GUT Matrix */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Matriz GUT - Priorização</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Gravidade (G)</label>
                    <select
                      value={formData.gravity}
                      onChange={(e) => setFormData((prev) => ({ ...prev, gravity: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Urgência (U)</label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData((prev) => ({ ...prev, urgency: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Tendência (T)</label>
                    <select
                      value={formData.trend}
                      onChange={(e) => setFormData((prev) => ({ ...prev, trend: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center">
                  <span className="text-sm text-slate-600 mr-2">Score GUT:</span>
                  <span className={`px-3 py-1 rounded-lg text-white font-bold ${getGUTColor(getGUTScore())}`}>
                    {getGUTScore()}
                  </span>
                </div>
              </div>

              {/* Service Items */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Itens de Serviço</h4>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Serviço"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="R$"
                    className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    placeholder="Qtd"
                    className="w-16 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <PlusIcon />
                  </button>
                </div>
                <ul className="space-y-1 max-h-32 overflow-auto">
                  {formData.items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center text-sm bg-slate-50 px-3 py-2 rounded">
                      <span className="text-slate-600">{item.name} x{item.quantity}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XIcon />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingOrder ? 'Salvar Alterações' : 'Criar O.S.'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceOrdersModule;
