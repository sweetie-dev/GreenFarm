import Database from 'simpl.db';

const db = new (Database as unknown as { new (options?: any): any })({
	collectionsFolder: './collections',
    collectionTimestamps: true,
    autoSave: true
});

export const Produtores = db.createCollection('produtores');
export const Projetos = db.createCollection('projetos');
export const Empresas = db.createCollection('empresas');
export const Transacoes = db.createCollection('transacoes')
export const Administradores = db.createCollection('administradores');



export default db;