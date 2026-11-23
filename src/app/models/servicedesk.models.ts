export type RolUsuario = 'USUARIO_FINAL' | 'SOPORTE_TI' | 'JEFE_TI';
export type CategoriaTicket =
  | 'RED_WIFI'
  | 'ERP_ODOO'
  | 'BASE_DATOS'
  | 'HARDWARE_SOFTWARE'
  | 'SOFTWARE_OFIMATICA'
  | 'IMPRESORAS_PERIFERICOS'
  | 'CORREO_COLABORACION'
  | 'ACCESOS_CUENTAS'
  | 'SEGURIDAD_INFORMATICA';
export type PrioridadTicket = 'SIN_ASIGNAR' | 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type EstadoTicket = 'PENDIENTE' | 'ASIGNADO' | 'EN_PROGRESO' | 'RESUELTO';

export const CATEGORIAS_SERVICIO: { valor: CategoriaTicket; etiqueta: string }[] = [
  { valor: 'RED_WIFI', etiqueta: 'Redes y Conectividad' },
  { valor: 'ERP_ODOO', etiqueta: 'ERP Odoo / Sistemas' },
  { valor: 'BASE_DATOS', etiqueta: 'Bases de Datos y Backups' },
  { valor: 'HARDWARE_SOFTWARE', etiqueta: 'Hardware y Equipos' },
  { valor: 'SOFTWARE_OFIMATICA', etiqueta: 'Software y Ofimática' },
  { valor: 'IMPRESORAS_PERIFERICOS', etiqueta: 'Impresoras y Periféricos' },
  { valor: 'CORREO_COLABORACION', etiqueta: 'Correo y Microsoft 365' },
  { valor: 'ACCESOS_CUENTAS', etiqueta: 'Accesos y Cuentas' },
  { valor: 'SEGURIDAD_INFORMATICA', etiqueta: 'Seguridad Informática' }
];

export const AREAS_EMPRESA: string[] = [
  'Administración',
  'Almacén Central',
  'Almacén Provincias',
  'Aseguramiento de la Calidad',
  'Contabilidad',
  'Control de Calidad',
  'Desarrollo / TI',
  'Dirección Técnica',
  'Empaque',
  'Finanzas',
  'Gerencia General',
  'Licitaciones',
  'Logística',
  'Mantenimiento',
  'Marketing',
  'Producción',
  'Producción de Lentes',
  'Recursos Humanos',
  'Reparto',
  'TI / Sistemas',
  'Ventas'
];

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
  rolEtiqueta: string;
  area: string;
  activo: boolean;
  debeCambiarPassword: boolean;
}

export interface CrearUsuarioRequest {
  nombre: string;
  email: string;
  password: string;
  rol: RolUsuario;
  area: string;
  debeCambiarPassword: boolean;
}

export interface ActualizarUsuarioRequest {
  nombre: string;
  rol: RolUsuario;
  area: string;
}

export interface RegistroUsuarioRequest {
  nombre: string;
  email: string;
  password: string;
  area: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  expiraEnSegundos: number;
  usuario: Usuario;
}

export interface BitacoraEntry {
  id: number;
  accion: string;
  comentario: string;
  autorNombre: string;
  autorRol: string;
  fecha: string;
}

export interface Ticket {
  id: number;
  codigo: string;
  titulo: string;
  categoria: CategoriaTicket;
  categoriaEtiqueta: string;
  prioridad: PrioridadTicket;
  prioridadEtiqueta: string;
  ubicacion: string;
  descripcion: string;
  estado: EstadoTicket;
  estadoEtiqueta: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  creador: Usuario;
  tecnicoAsignado: Usuario | null;
  bitacoras: BitacoraEntry[];
}

export interface NuevoTicketRequest {
  titulo: string;
  categoria: CategoriaTicket;
  prioridad?: PrioridadTicket;
  ubicacion: string;
  descripcion: string;
}

export interface DashboardMetrics {
  totalTickets: number;
  pendientes: number;
  enAtencion: number;
  resueltos: number;
  criticosActivos: number;
  porCategoria: Record<string, number>;
  recientes: Ticket[];
}