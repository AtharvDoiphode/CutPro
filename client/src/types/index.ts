export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "barber" | "admin";
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  image: string;
}

export interface Barber {
  _id: string;
  name: string;
  avatar: string;
  experience: number;
  rating: number;
  specialization: string[];
}