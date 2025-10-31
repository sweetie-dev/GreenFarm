import express, { Application, RequestHandler } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const app: express.Application = express();
const port: number = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesPath = path.join(__dirname, 'routes');

const routeFiles = fs.readdirSync(routesPath).filter(file => {
  if (process.env.NODE_ENV === 'production') return file.endsWith('.js');
  return file.endsWith('.ts');
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

    const route = (mod && (mod.default ?? mod)) as any;

    if (!route || typeof route.endpoint !== 'string' || typeof route.method !== 'string' || typeof route.run !== 'function') {
      console.warn(`Ignorando arquivo de rota inválido: ${file}`);
      continue;
    }

    (app as any)[route.method](route.endpoint, route.run)
  }
}

/*
app["get"]('/', (_: express.Request, res: express.Response) => {
  res.send('A EcoCredit API está no ar!');
});
*/

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
