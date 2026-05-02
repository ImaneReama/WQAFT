export type Role = "automobiliste" | "mecanicien";
export const ROLES: Role[] = ["automobiliste", "mecanicien"];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // Aggregate of first + last
  email: string;
  role: Role;
  phone: string;
  vehicleType?: "Voiture" | "Moto";
  vehicleBrand?: string;
  mecaType?: string;
  hasTowingService?: boolean;
  specialty?: string;
  brandsHandled?: string; // "Toutes" or list
  workshop?: string; // Still used for mecaniens
  specialties?: string[];
  status?: "available" | "occupied" | "offline" | string;
  createdAt?: string;
}

export interface AssistanceRequest {
  id: string;
  clientId: string;
  mecanicienId?: string;
  status: 'pending' | 'negotiating' | 'active' | 'completed' | 'cancelled';
  typePanne: string;
  description: string;
  address: string;
  locationInfo?: string;
  serviceType: 'Mécanicien sur place' | 'Dépannage (remorquage)' | 'Les deux';
  vehicleInfo: {
    type: string;
    brand: string;
  };
  proposedPrice: number;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface Offer {
  id: string;
  requestId: string;
  mecanicienId: string;
  mecanicienName: string;
  price: number;
  estimatedTime: string;
  status: 'pending' | 'accepted' | 'rejected';
}
