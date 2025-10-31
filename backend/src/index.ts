import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const app: express.Application = express();
const port: number = 3000;

// CORS configurado
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesPath = path.join(__dirname, 'routes');

// Função recursiva para carregar rotas de subdiretórios
async function loadRoutesFromDirectory(dirPath: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Recursivamente carregar subdiretórios
      await loadRoutesFromDirectory(fullPath);
      continue;
    }

    if (!entry.isFile()) continue;

    const ext = process.env.NODE_ENV === 'production' ? '.js' : '.ts';
    if (!entry.name.endsWith(ext)) continue;

    let mod: any;
    try {
      mod = await import(pathToFileURL(fullPath).href);
    } catch (err) {
      console.error(`❌ Falha ao importar ${entry.name}:`, err);
      continue;
    }

    const routes = (mod && (mod.default ?? mod)) as any;

    if (Array.isArray(routes)) {
      for (const route of routes) {
        if (!route?.endpoint || !route?.method || !route?.run) {
          console.warn(`⚠️  Rota inválida em ${entry.name}`);
          continue;
        }
        (app as any)[route.method](route.endpoint, route.run);
        console.log(`✓ ${route.method.toUpperCase()} ${route.endpoint}`);
      }
    } else if (routes?.endpoint && routes?.method && routes?.run) {
      (app as any)[routes.method](routes.endpoint, routes.run);
      console.log(`✓ ${routes.method.toUpperCase()} ${routes.endpoint}`);
    }
  }
}

// Rota de health check
app.get('/', (_: express.Request, res: express.Response) => {
  res.json({ 
    message: 'GreenFarm API está no ar!',
    version: '1.0.0',
    status: 'online'
  });
});

loadRoutesFromDirectory(routesPath)
  .then(() => {
    app.listen(port, () => {
      console.log(`\n🌱 GreenFarm API rodando na porta ${port}`);
      console.log(`🔗 http://localhost:${port}\n`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao carregar rotas:', err);
    process.exit(1);
  });
