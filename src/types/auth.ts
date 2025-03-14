
export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  role?: 'client' | 'admin';
  telefone?: string;
  endereco?: string;
}
