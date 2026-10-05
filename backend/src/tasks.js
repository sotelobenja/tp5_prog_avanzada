import { pool, mapTask } from "./db.js";

const ESTADOS = ["Pendiente", "En progreso", "En revisión", "Finalizada"];
const PRIORIDADES = ["Baja", "Media", "Alta", "Crítica"];
const TIPOS = [
  "Desarrollo",
  "Testing",
  "Documentación",
  "Análisis",
  "Diseño",
  "Bug",
  "Reunión",
];

function emptyToNull(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }
  return value;
}

function validate(body, { partial = false } = {}) {
  const errors = [];
  const required = [
    "nombreProyecto",
    "tipoActividad",
    "estado",
    "resumen",
    "prioridad",
    "informador",
    "fechaCreacion",
  ];

  if (!partial) {
    for (const field of required) {
      if (!body[field] || String(body[field]).trim() === "") {
        errors.push(`El campo ${field} es obligatorio`);
      }
    }
  }

  if (body.tipoActividad && !TIPOS.includes(body.tipoActividad)) {
    errors.push("Tipo de actividad inválido");
  }
  if (body.estado && !ESTADOS.includes(body.estado)) {
    errors.push("Estado inválido");
  }
  if (body.prioridad && !PRIORIDADES.includes(body.prioridad)) {
    errors.push("Prioridad inválida");
  }

  const fechaCierre = emptyToNull(body.fechaCierre);
  if (fechaCierre && body.fechaCreacion && fechaCierre < body.fechaCreacion) {
    errors.push(
      "La fecha de cierre no puede ser anterior a la fecha de creación"
    );
  }

  return errors;
}

export async function listTasks(_req, res) {
  const { rows } = await pool.query(
    "SELECT * FROM tasks ORDER BY id DESC"
  );
  res.json(rows.map(mapTask));
}

export async function getTask(req, res) {
  const { rows } = await pool.query("SELECT * FROM tasks WHERE id = $1", [
    req.params.id,
  ]);
  if (!rows[0]) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  res.json(mapTask(rows[0]));
}

export async function createTask(req, res) {
  const errors = validate(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const {
    nombreProyecto,
    tipoActividad,
    estado,
    resumen,
    descripcion,
    prioridad,
    informador,
    personaAsignada,
    precondicion,
    fechaCreacion,
    fechaCierre,
    sprint,
  } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO tasks (
      nombre_proyecto, tipo_actividad, estado, resumen, descripcion,
      prioridad, informador, persona_asignada, precondicion,
      fecha_creacion, fecha_cierre, sprint
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *`,
    [
      nombreProyecto.trim(),
      tipoActividad,
      estado,
      resumen.trim(),
      emptyToNull(descripcion),
      prioridad,
      informador.trim(),
      emptyToNull(personaAsignada),
      emptyToNull(precondicion),
      fechaCreacion,
      emptyToNull(fechaCierre),
      emptyToNull(sprint),
    ]
  );

  res.status(201).json(mapTask(rows[0]));
}

export async function updateTask(req, res) {
  const existing = await pool.query("SELECT * FROM tasks WHERE id = $1", [
    req.params.id,
  ]);
  if (!existing.rows[0]) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  const current = mapTask(existing.rows[0]);
  const merged = { ...current, ...req.body };
  const errors = validate(merged);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const { rows } = await pool.query(
    `UPDATE tasks SET
      nombre_proyecto = $1,
      tipo_actividad = $2,
      estado = $3,
      resumen = $4,
      descripcion = $5,
      prioridad = $6,
      informador = $7,
      persona_asignada = $8,
      precondicion = $9,
      fecha_creacion = $10,
      fecha_cierre = $11,
      sprint = $12,
      updated_at = NOW()
    WHERE id = $13
    RETURNING *`,
    [
      merged.nombreProyecto.trim(),
      merged.tipoActividad,
      merged.estado,
      merged.resumen.trim(),
      emptyToNull(merged.descripcion),
      merged.prioridad,
      merged.informador.trim(),
      emptyToNull(merged.personaAsignada),
      emptyToNull(merged.precondicion),
      merged.fechaCreacion,
      emptyToNull(merged.fechaCierre),
      emptyToNull(merged.sprint),
      req.params.id,
    ]
  );

  res.json(mapTask(rows[0]));
}

export async function deleteTask(req, res) {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING id",
    [req.params.id]
  );
  if (!result.rows[0]) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  res.status(204).send();
}

export async function finalizeTask(req, res) {
  const { rows } = await pool.query(
    `UPDATE tasks
     SET estado = 'Finalizada',
         fecha_cierre = COALESCE(fecha_cierre, CURRENT_DATE),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [req.params.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  res.json(mapTask(rows[0]));
}

export const catalogs = { ESTADOS, PRIORIDADES, TIPOS };
