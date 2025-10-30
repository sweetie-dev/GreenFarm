const express = require('express');
const app = express();
const port = 3000;

const compraVendasRoutes = require('./routes/compra_vendas.js');

app.use('/compras', compraVendasRoutes);

app.get('/', (req, res) => {
  // Apenas envia uma mensagem de status para confirmar que está funcionando
  res.send('A EcoCredit API está no ar!');
});

app.listen(port, () => {
  console.log(`EcoCredit API rodando na porta ${port}`);
});

