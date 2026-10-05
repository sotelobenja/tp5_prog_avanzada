import { useEffect, useState } from "react";

const TIPOS = [
  "Desarrollo",
  "Testing",
  "Documentación",
  "Análisis",
  "Diseño",
  "Bug",
  "Reunión",
];

const ESTADOS = ["Pendiente", "En progreso", "En revisión", "Finalizada"];
const PRIORIDADES = ["Baja", "Media", "Alta", "Crítica"];

const emptyForm = {
  nombreProyecto: "",
  tipoActividad: "Desarrollo",
  estado: "Pendiente",
  resumen: "",
  descripcion: "",
  prioridad: "Media",
  informador: "",
  personaAsignada: "",
  precondicion: "",
  fechaCreacion: new Date().toISOString().slice(0, 10),
  fechaCierre: "",
  sprint: "",
};

export default function TaskForm({ initialTask, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    setDateError("");
    if (initialTask) {
      setForm({
        ...emptyForm,
        ...initialTask,
        fechaCierre: initialTask.fechaCierre || "",
        descripcion: initialTask.descripcion || "",
        personaAsignada: initialTask.personaAsignada || "",
        precondicion: initialTask.precondicion || "",
        sprint: initialTask.sprint || "",
      });
    } else {
      setForm({
        ...emptyForm,
        fechaCreacion: new Date().toISOString().slice(0, 10),
      });
    }
  }, [initialTask]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (
        next.fechaCierre &&
        next.fechaCreacion &&
        next.fechaCierre < next.fechaCreacion
      ) {
        if (name === "fechaCreacion") {
          next.fechaCierre = "";
          setDateError("");
        } else {
          setDateError(
            "La fecha de cierre no puede ser anterior a la fecha de creación"
          );
        }
      } else {
        setDateError("");
      }
      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (
      form.fechaCierre &&
      form.fechaCreacion &&
      form.fechaCierre < form.fechaCreacion
    ) {
      setDateError(
        "La fecha de cierre no puede ser anterior a la fecha de creación"
      );
      return;
    }
    onSubmit(form);
  }

  const isEdit = Boolean(initialTask?.id);

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="card-header">
        <h2>{isEdit ? "Editar tarea" : "Nueva tarea"}</h2>
        <p>
          Complete los datos del ticket para el seguimiento del proyecto de
          software.
        </p>
      </div>

      <div className="grid">
        <label>
          Nombre del Proyecto
          <input
            name="nombreProyecto"
            value={form.nombreProyecto}
            onChange={handleChange}
            required
            maxLength={255}
          />
        </label>

        <label>
          Tipo de Actividad
          <select
            name="tipoActividad"
            value={form.tipoActividad}
            onChange={handleChange}
            required
          >
            {TIPOS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </label>

        <label>
          Estado
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </label>

        <label>
          Prioridad
          <select
            name="prioridad"
            value={form.prioridad}
            onChange={handleChange}
            required
          >
            {PRIORIDADES.map((prioridad) => (
              <option key={prioridad} value={prioridad}>
                {prioridad}
              </option>
            ))}
          </select>
        </label>

        <label className="span-2">
          Resumen
          <input
            name="resumen"
            value={form.resumen}
            onChange={handleChange}
            required
            maxLength={500}
          />
        </label>

        <label className="span-2">
          Descripción
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={4}
          />
        </label>

        <label>
          Informador
          <input
            name="informador"
            value={form.informador}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Persona asignada
          <input
            name="personaAsignada"
            value={form.personaAsignada}
            onChange={handleChange}
          />
        </label>

        <label className="span-2">
          Precondición
          <textarea
            name="precondicion"
            value={form.precondicion}
            onChange={handleChange}
            rows={3}
          />
        </label>

        <label>
          Fecha de Creación
          <input
            type="date"
            name="fechaCreacion"
            value={form.fechaCreacion}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Fecha de Cierre
          <input
            type="date"
            name="fechaCierre"
            value={form.fechaCierre}
            min={form.fechaCreacion}
            onChange={handleChange}
          />
          {dateError && <small className="field-error">{dateError}</small>}
        </label>

        <label>
          Sprint
          <input
            name="sprint"
            value={form.sprint}
            onChange={handleChange}
            placeholder="Sprint 1"
          />
        </label>
      </div>

      <div className="form-actions">
        {isEdit && (
          <button type="button" className="btn ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear tarea"}
        </button>
      </div>
    </form>
  );
}
