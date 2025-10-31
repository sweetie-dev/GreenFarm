import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const app: express.Application = express();
const port: number = 3000;

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesPath = path.join(__dirname, 'routes');

const routeFiles = fs.readdirSync(routesPath).filter(file => {
  if (process.env.NODE_ENV === 'production') return file.endsWith('.js');
  return file.endsWith('.ts');
});

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

    const routes = (mod && (mod.default ?? mod)) as any;

    // Verifica se é um array de rotas
    if (Array.isArray(routes)) {
      for (const route of routes) {
        if (!route || typeof route.endpoint !== 'string' || typeof route.method !== 'string' || typeof route.run !== 'function') {
          console.warn(`Ignorando rota inválida em ${file}:`, route);
          continue;
        }
        (app as any)[route.method](route.endpoint, route.run);
        console.log(`✓ Rota carregada: ${route.method.toUpperCase()} ${route.endpoint}`);
      }
    } 
    // Verifica se é um objeto de rota único
    else if (routes && typeof routes.endpoint === 'string' && typeof routes.method === 'string' && typeof routes.run === 'function') {
      (app as any)[routes.method](routes.endpoint, routes.run);
      console.log(`✓ Rota carregada: ${routes.method.toUpperCase()} ${routes.endpoint}`);
    } 
    else {
      console.warn(`Ignorando arquivo de rota inválido: ${file}`);
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

loadRoutes()
  .then(() => {
    app.listen(port, () => {
      console.log(`\n🌱 GreenFarm API rodando na porta ${port}`);
      console.log(`🔗 Acesse: http://localhost:${port}\n`);
    });
  })
  .catch(err => {
    console.error('Erro ao carregar rotas:', err);
    process.exit(1);
  });
