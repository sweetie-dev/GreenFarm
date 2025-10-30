import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const app: express.Application = express();
const port: number = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const routesPath = path.join(__dirname, 'routes');
const routeFiles = fs.readdirSync(routesPath).filter(file => {
  if (process.env.npm_command === 'start') return file.endsWith('.js');
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
    routes.forEach((route: any) => {
      (app as any)[route.method](route.endpoint, route.run)
    });
    
  }
}

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