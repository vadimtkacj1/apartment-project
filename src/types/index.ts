export interface Apartment {
  id: number;
  title: string;
  description: string;
  price: number;
  area: number;
  rooms: number;
  floor: number;
  location: string;
  amenities: string[];
  images: string[];
  status: "available" | "booked" | "unavailable";
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "blocked";
  createdAt: Date;
}

export interface Booking {
  id: number;
  apartmentId: number;
  userId: number;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
}

export interface Review {
  id: number;
  apartmentId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: Date;
}
