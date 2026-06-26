export type User = {
  _id?: string;
  name: string;
  email: string;
  role: "customer" | "barber" | "admin";
};

export type AuthContextType = {
  user: User | null;
  token: string | null;

  login: (
    userData: User,
    accessToken: string
  ) => void;

  logout: () => void;
};