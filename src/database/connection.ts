import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env (RF02)
dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

// Apenas testando a conexão ao inicializar
pool.on('error', (err) => {
    console.error('Erro inesperado na conexão com o banco de dados:', err);
});
