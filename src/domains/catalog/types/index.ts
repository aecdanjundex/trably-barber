export interface Service {
  id: string;
  organizationId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  durationMinutes: number | null;
  priceInCents: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  sku: string | null;
  priceInCents: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategory {
  id: string;
  organizationId: string;
  name: string;
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  organizationId: string;
  name: string;
  type: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
