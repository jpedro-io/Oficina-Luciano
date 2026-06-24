import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ServiceOrder, Client, Part, NavigationTab, OrderStatus, IshikawaCause } from '../types/Index';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

// Mock Data - Initial data for the application
const initialOrders: ServiceOrder[] = [
  {
    id: generateId(),
    clientId: 'c1',
    clientName: 'Carlos Silva',
    vehicle: 'Honda Civic',
    plate: 'ABC-1234',
    status: 'Aberta',
    notaFiscal: 'NF-001234',
    items: [
      { id: 'i1', name: 'Troca de Oléo', price: 150, quantity: 1 },
      { id: 'i2', name: 'Filtro de Ar', price: 80, quantity: 1 },
    ],
    totalValue: 230,
    paymentReceived: false,
    gravity: 4,
    urgency: 5,
    trend: 4,
    gutScore: 80,
    ishikawaCause: '',
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
  },
  {
    id: generateId(),
    clientId: 'c2',
    clientName: 'Maria Santos',
    vehicle: 'Toyota Corolla',
    plate: 'XYZ-5678',
    status: 'Em andamento',
    notaFiscal: 'NF-001235',
    items: [
      { id: 'i3', name: 'Freios Dianteiros', price: 450, quantity: 1 },
      { id: 'i4', name: 'Pastilhas', price: 220, quantity: 2 },
    ],
    totalValue: 890,
    paymentReceived: true,
    gravity: 5,
    urgency: 5,
    trend: 5,
    gutScore: 125,
    ishikawaCause: 'Material',
    createdAt: '2026-05-28T14:30:00Z',
    updatedAt: '2026-06-02T09:00:00Z',
  },
  {
    id: generateId(),
    clientId: 'c3',
    clientName: 'Pedro Oliveira',
    vehicle: 'Ford Ka',
    plate: 'DEF-9012',
    status: 'Aprovada',
    notaFiscal: 'NF-001236',
    items: [
      { id: 'i5', name: 'Bateria', price: 350, quantity: 1 },
    ],
    totalValue: 350,
    paymentReceived: false,
    gravity: 3,
    urgency: 4,
    trend: 3,
    gutScore: 36,
    ishikawaCause: '',
    createdAt: '2026-05-30T11:00:00Z',
    updatedAt: '2026-05-31T16:00:00Z',
  },
  {
    id: generateId(),
    clientId: 'c4',
    clientName: 'Ana Costa',
    vehicle: 'Chevrolet Onix',
    plate: 'GHI-3456',
    status: 'Fechada',
    notaFiscal: 'NF-001237',
    items: [
      { id: 'i6', name: 'Alinhamento', price: 200, quantity: 1 },
      { id: 'i7', name: 'Balanceamento', price: 100, quantity: 4 },
    ],
    totalValue: 600,
    paymentReceived: true,
    gravity: 2,
    urgency: 2,
    trend: 2,
    gutScore: 8,
    ishikawaCause: '',
    createdAt: '2026-05-15T09:00:00Z',
    updatedAt: '2026-05-20T14:00:00Z',
  },
  {
    id: generateId(),
    clientId: 'c5',
    clientName: 'Roberto Alves',
    vehicle: 'Volkswagen Gol',
    plate: 'JKL-7890',
    status: 'Em andamento',
    notaFiscal: 'NF-001238',
    items: [
      { id: 'i8', name: 'Motor de Partida', price: 800, quantity: 1 },
    ],
    totalValue: 800,
    paymentReceived: false,
    gravity: 5,
    urgency: 4,
    trend: 5,
    gutScore: 100,
    ishikawaCause: 'Mão de Obra',
    createdAt: '2026-05-25T08:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
  },
];

const initialClients: Client[] = [
  {
    id: 'c1',
    name: 'Carlos Silva',
    cpfCnpj: '123.456.789-00',
    phone: '(11) 99999-1111',
    email: 'carlos@email.com',
    address: 'Rua das Flores, 123 - São Paulo',
    associatedVehicle: 'Honda Civic - ABC-1234',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'c2',
    name: 'Maria Santos',
    cpfCnpj: '987.654.321-00',
    phone: '(11) 99999-2222',
    email: 'maria@email.com',
    address: 'Av. Paulista, 456 - São Paulo',
    associatedVehicle: 'Toyota Corolla - XYZ-5678',
    createdAt: '2025-02-20T14:00:00Z',
  },
  {
    id: 'c3',
    name: 'Pedro Oliveira',
    cpfCnpj: '456.789.123-00',
    phone: '(11) 99999-3333',
    email: 'pedro@email.com',
    address: 'Rua Augusta, 789 - São Paulo',
    associatedVehicle: 'Ford Ka - DEF-9012',
    createdAt: '2025-03-10T09:00:00Z',
  },
  {
    id: 'c4',
    name: 'Ana Costa',
    cpfCnpj: '321.654.987-00',
    phone: '(11) 99999-4444',
    email: 'ana@email.com',
    address: 'Av. Brasil, 321 - São Paulo',
    associatedVehicle: 'Chevrolet Onix - GHI-3456',
    createdAt: '2025-04-05T11:00:00Z',
  },
  {
    id: 'c5',
    name: 'Roberto Alves',
    cpfCnpj: '654.987.321-00',
    phone: '(11) 99999-5555',
    email: 'roberto@email.com',
    address: 'Rua Liberdade, 654 - São Paulo',
    associatedVehicle: 'Volkswagen Gol - JKL-7890',
    createdAt: '2025-05-12T15:00:00Z',
  },
];

const initialParts: Part[] = [
  {
    id: 'p1',
    name: 'Filtro de Óleo',
    internalCode: 'FO-001',
    unitPrice: 45.00,
    quantity: 25,
    category: 'Filtros',
    supplier: 'AutoPeças Brasil',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2026-05-15T10:00:00Z',
  },
  {
    id: 'p2',
    name: 'Filtro de Ar',
    internalCode: 'FA-001',
    unitPrice: 35.00,
    quantity: 18,
    category: 'Filtros',
    supplier: 'AutoPeças Brasil',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2026-05-15T10:00:00Z',
  },
  {
    id: 'p3',
    name: 'Pastilha de Freio',
    internalCode: 'PF-001',
    unitPrice: 120.00,
    quantity: 8,
    category: 'Freios',
    supplier: 'Freios Max',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'p4',
    name: 'Disco de Freio',
    internalCode: 'DF-001',
    unitPrice: 180.00,
    quantity: 2,
    category: 'Freios',
    supplier: 'Freios Max',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'p5',
    name: 'Bateria 60Ah',
    internalCode: 'BT-001',
    unitPrice: 350.00,
    quantity: 5,
    category: 'Elétrica',
    supplier: 'Baterias Moura',
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'p6',
    name: 'Vela de Ignição',
    internalCode: 'VI-001',
    unitPrice: 25.00,
    quantity: 40,
    category: 'Motor',
    supplier: 'NGK Brasil',
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'p7',
    name: 'Correia Dentada',
    internalCode: 'CD-001',
    unitPrice: 95.00,
    quantity: 1,
    category: 'Motor',
    supplier: 'Gates Brasil',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2026-06-02T10:00:00Z',
  },
  {
    id: 'p8',
    name: 'Amortecedor Dianteiro',
    internalCode: 'AD-001',
    unitPrice: 280.00,
    quantity: 4,
    category: 'Suspensão',
    supplier: 'Monroe',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z',
  },
];

interface StoreState {
  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  // Service Orders
  orders: ServiceOrder[];
  selectedOrderId: string | null;
  addOrder: (order: Omit<ServiceOrder, 'id' | 'gutScore' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, updates: Partial<ServiceOrder>) => void;
  deleteOrder: (id: string) => void;
  selectOrder: (id: string | null) => void;

  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Parts
  parts: Part[];
  addPart: (part: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePart: (id: string, updates: Partial<Part>) => void;
  deletePart: (id: string) => void;
}

// Helper to calculate GUT score
const calculateGUTScore = (gravity: number, urgency: number, trend: number): number => {
  return gravity * urgency * trend;
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Navigation
      activeTab: 'orders',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Service Orders
      orders: initialOrders,
      selectedOrderId: null,

      addOrder: (orderData) => {
        const newOrder: ServiceOrder = {
          ...orderData,
          id: generateId(),
          gutScore: calculateGUTScore(orderData.gravity, orderData.urgency, orderData.trend),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [...state.orders, newOrder] }));
      },

      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id === id) {
              const gravity = updates.gravity ?? order.gravity;
              const urgency = updates.urgency ?? order.urgency;
              const trend = updates.trend ?? order.trend;
              const gutScore = calculateGUTScore(gravity, urgency, trend);
              return {
                ...order,
                ...updates,
                gutScore,
                updatedAt: new Date().toISOString(),
              };
            }
            return order;
          }),
        }));
      },

      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
          selectedOrderId: state.selectedOrderId === id ? null : state.selectedOrderId,
        }));
      },

      selectOrder: (id) => set({ selectedOrderId: id }),

      // Clients
      clients: initialClients,

      addClient: (clientData) => {
        const newClient: Client = {
          ...clientData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ clients: [...state.clients, newClient] }));
      },

      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...updates } : client
          ),
        }));
      },

      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        }));
      },

      // Parts
      parts: initialParts,

      addPart: (partData) => {
        const newPart: Part = {
          ...partData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ parts: [...state.parts, newPart] }));
      },

      updatePart: (id, updates) => {
        set((state) => ({
          parts: state.parts.map((part) =>
            part.id === id
              ? { ...part, ...updates, updatedAt: new Date().toISOString() }
              : part
          ),
        }));
      },

      deletePart: (id) => {
        set((state) => ({
          parts: state.parts.filter((part) => part.id !== id),
        }));
      },
    }),
    {
      name: 'oficina-luciano-storage',
    }
  )
);
