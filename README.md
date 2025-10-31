# 🌱 GreenFarm - Sistema de Créditos de Carbono

Sistema completo para gestão de créditos de carbono com backend em Node.js/TypeScript e frontend em Vue.js.

## 🚀 Início Rápido

### Instalação (primeira vez)

```bash
# Instalar todas as dependências (raiz + backend + frontend)
npm run install:all
```

### Desenvolvimento

```bash
# Rodar backend e frontend simultaneamente
npm run dev
```

Isso iniciará:
- 🔵 **Backend**: `http://localhost:3000`
- 🟢 **Frontend**: `http://localhost:5173`

### Build para Produção

```bash
# Compilar backend e frontend
npm run build
```

### Executar em Produção

```bash
# Rodar versão compilada
npm start
```

## 📁 Estrutura do Projeto

```
GreenFarm/
├── package.json              # Gerenciador do monorepo
├── backend/                  # API Node.js + TypeScript + Express
│   ├── src/
│   ├── collections/          # Banco de dados simpl.db
│   └── package.json
└── frontend/                 # Vue.js + Vite
    ├── src/
    └── package.json
```

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Roda backend + frontend em modo desenvolvimento |
| `npm run dev:backend` | Roda apenas o backend |
| `npm run dev:frontend` | Roda apenas o frontend |
| `npm run build` | Compila backend + frontend |
| `npm run start` | Executa versão de produção |
| `npm run install:all` | Instala todas as dependências |

## 🔌 API Endpoints

Documentação completa em: [`backend/API_ROUTES.md`](backend/API_ROUTES.md)

## 📖 Documentação

- [Integração Completa](INTEGRACAO_COMPLETA.md)
- [Rotas da API](backend/API_ROUTES.md)
- [Resumo Backend](backend/RESUMO_COMPLETO.md)

## 🌍 Variáveis de Ambiente

### Backend
Crie um arquivo `.env` em `backend/`:
```env
PORT=3000
NODE_ENV=development
```

### Frontend
Crie um arquivo `.env` em `frontend/`:
```env
VITE_API_URL=http://localhost:3000
```

## 🤝 Contribuindo

1. Clone o repositório
2. Instale as dependências: `npm run install:all`
3. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
4. Faça suas alterações e commit: `git commit -m "Adiciona nova funcionalidade"`
5. Push: `git push origin feature/nova-funcionalidade`
6. Abra um Pull Request

## 📝 Licença

ISC

---

Desenvolvido com 💚 para um futuro mais sustentável
