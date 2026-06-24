// Types for Oficina Luciano - Peças e Serviços

export type OrderStatus = 'Aberta' | 'Aprovada' | 'Em andamento' | 'Fechada' | 'Cancelada';

export type IshikawaCause = 'Mão de Obra' | 'Máquina' | 'Material' | 'Método' | 'Medida' | 'Meio Ambiente' | '';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ServiceOrder {
  id: string;
  clientId: string;
  clientName: string;
  vehicle: string;
  plate: string;
  status: OrderStatus;
  notaFiscal: string;
  items: ServiceItem[];
  totalValue: number;
  paymentReceived: boolean;
  gravity: number;      // G: 1-5
  urgency: number;       // U: 1-5
  trend: number;         // T: 1-5
  gutScore: number;      // G x U x T
  ishikawaCause: IshikawaCause;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  cpfCnpj: string;
  phone: string;
  email?: string;
  address?: string;
  associatedVehicle: string;
  createdAt: string;
}

export interface Part {
  id: string;
  name: string;
  internalCode: string;
  unitPrice: number;
  quantity: number;
  category?: string;
  supplier?: string;
  createdAt: string;
  updatedAt: string;
}

export type NavigationTab = 'orders' | 'clients' | 'parts';
