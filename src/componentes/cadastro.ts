interface BaseFieldType {
  nomeCompleto: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface PacienteFieldType extends BaseFieldType {
  perfil: "paciente";
}

export interface MedicoFieldType extends BaseFieldType {
  perfil: "medico";
  especialidade: string;
  crm: string;
}

export type FieldType = PacienteFieldType | MedicoFieldType;