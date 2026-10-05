function Badge({ value, kind }) {
  const slug = String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
  return <span className={`badge ${kind} ${kind}-${slug}`}>{value}</span>;
}

export default function TaskList({ tasks, onEdit, onDelete, onFinalize }) {
  if (!tasks.length) {
    return (
      <section className="card">
        <div className="card-header">
          <h2>Listado de Tareas</h2>
          <p>Todavía no hay tareas registradas.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>Listado de Tareas</h2>
        <p>{tasks.length} tarea{tasks.length === 1 ? "" : "s"} en el tablero.</p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Resumen</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Asignada</th>
              <th>Sprint</th>
              <th>Fechas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <strong>{task.nombreProyecto}</strong>
                  <small>Informador: {task.informador}</small>
                </td>
                <td>
                  <strong>{task.resumen}</strong>
                  {task.descripcion && <small>{task.descripcion}</small>}
                  {task.precondicion && (
                    <small>Precondición: {task.precondicion}</small>
                  )}
                </td>
                <td>{task.tipoActividad}</td>
                <td>
                  <Badge kind="estado" value={task.estado} />
                </td>
                <td>
                  <Badge kind="prioridad" value={task.prioridad} />
                </td>
                <td>{task.personaAsignada || "Sin asignar"}</td>
                <td>{task.sprint || "-"}</td>
                <td>
                  <small>Creación: {task.fechaCreacion}</small>
                  <small>Cierre: {task.fechaCierre || "-"}</small>
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => onEdit(task)}
                    >
                      Editar
                    </button>
                    {task.estado !== "Finalizada" && (
                      <button
                        type="button"
                        className="btn success"
                        onClick={() => onFinalize(task)}
                      >
                        Finalizar
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn danger"
                      onClick={() => onDelete(task)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
