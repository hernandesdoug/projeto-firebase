export interface FieldType {
  email: string;
  password: string;
  nomeCompleto: string;
  remember?: boolean;
  username: string;
  perfil: "paciente" | "medico";
}
