import express from "express";
import cors from "cors";
import { initDb } from "./db.js";
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  finalizeTask,
  catalogs,
} from "./tasks.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/catalogs", (_req, res) => {
  res.json(catalogs);
});

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get("/api/tasks", asyncHandler(listTasks));
app.get("/api/tasks/:id", asyncHandler(getTask));
app.post("/api/tasks", asyncHandler(createTask));
app.put("/api/tasks/:id", asyncHandler(updateTask));
app.delete("/api/tasks/:id", asyncHandler(deleteTask));
app.patch("/api/tasks/:id/finalizar", asyncHandler(finalizeTask));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

async function waitForDb(retries = 20) {
  for (let i = 1; i <= retries; i += 1) {
    try {
      await initDb();
      return;
    } catch (error) {
      console.log(`Esperando Postgres (${i}/${retries})...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (i === retries) throw error;
    }
  }
}

waitForDb()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`API escuchando en puerto ${port}`);
    });
  })
  .catch((error) => {
    console.error("No se pudo inicializar la base de datos", error);
    process.exit(1);
  });
