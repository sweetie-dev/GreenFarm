-- sql/schema.sql
CREATE DATABASE IF NOT EXISTS eco_trade;
USE eco_trade;

CREATE TABLE IF NOT EXISTS creditos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produtor_id INT NOT NULL,
  quantidade DECIMAL(12,4) NOT NULL,
  origem VARCHAR(255) NOT NULL,
  data DATE NOT NULL,              -- data de geração/origem do crédito
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compras_vendas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comprador_id INT NOT NULL,
  vendedor_id INT NOT NULL,
  credito_id INT NOT NULL,
  quantidade DECIMAL(12,4) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data DATETIME DEFAULT CURRENT_TIMESTAMP
);
