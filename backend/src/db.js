import pg from "pg";

const { Pool, types } = pg;
types.setTypeParser(1082, (value) => value);

export const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "tareas",
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      nombre_proyecto VARCHAR(255) NOT NULL,
      tipo_actividad VARCHAR(100) NOT NULL,
      estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
      resumen VARCHAR(500) NOT NULL,
      descripcion TEXT,
      prioridad VARCHAR(50) NOT NULL,
      informador VARCHAR(255) NOT NULL,
      persona_asignada VARCHAR(255),
      precondicion TEXT,
      fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
      fecha_cierre DATE,
      sprint VARCHAR(100),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

export function mapTask(row) {
  if (!row) return null;
  return {
    id: row.id,
    nombreProyecto: row.nombre_proyecto,
    tipoActividad: row.tipo_actividad,
    estado: row.estado,
    resumen: row.resumen,
    descripcion: row.descripcion,
    prioridad: row.prioridad,
    informador: row.informador,
    personaAsignada: row.persona_asignada,
    precondicion: row.precondicion,
    fechaCreacion: row.fecha_creacion,
    fechaCierre: row.fecha_cierre,
    sprint: row.sprint,
  };
}
