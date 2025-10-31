import express, { Application, RequestHandler } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const app: Application = express();
const port = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesPath = path.join(__dirname, 'routes');

const routeFiles = fs.readdirSync(routesPath).filter(file => {
  return process.env.NODE_ENV === 'production'
    ? file.endsWith('.js')
    : file.endsWith('.ts');
});

interface Route {
  endpoint: string;
  method: 'get' | 'post' | 'put' | 'delete';
  run: RequestHandler;
}

async function loadRoutes() {
  for (const file of routeFiles) {
    const filePath = path.join(routesPath, file);

    let mod: any;
    try {
      mod = await import(pathToFileURL(filePath).href);
    } catch (err) {
      console.error(`Falha ao importar ${file}:`, err);
      continue;
    }

    const route: Route | undefined = mod?.default ?? mod;

    if (!route || typeof route.endpoint !== 'string' || typeof route.method !== 'string' || typeof route.run !== 'function') {
      console.warn(`Ignorando arquivo de rota inválido: ${file}`);
      continue;
    }

    app[route.method](route.endpoint, route.run);
    console.log(`Rota carregada: [${route.method.toUpperCase()}] ${route.endpoint}`);
  }
}

app.use(express.json());

loadRoutes()
  .then(() => {
    app.listen(port, () => {
      console.log(`GreenFarm API rodando na porta ${port}`);
    });
  })
  .catch(err => {
    console.error('Erro ao carregar rotas:', err);
    process.exit(1);
  });
