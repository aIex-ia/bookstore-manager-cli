import { pool } from '../database/connection';
import { Cliente } from '../models/Cliente';

export class ClienteRepository {
    async cadastrar(nome: string, email: string, telefone?: string): Promise<Cliente> {
        const query = 'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [nome, email, telefone || null]);
        return result.rows[0];
    }

    async listarTodos(): Promise<Cliente[]> {
        const query = 'SELECT * FROM clientes ORDER BY id ASC';
        const result = await pool.query(query);
        return result.rows;
    }

    async buscarPorId(id: number): Promise<Cliente | null> {
        const query = 'SELECT * FROM clientes WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async findByEmail(email: string): Promise<Cliente | null> {
        const query = 'SELECT * FROM clientes WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows.length ? result.rows[0] : null;
    }

    async atualizar(id: number, nome: string, email: string, telefone?: string): Promise<Cliente | null> {
        const query = 'UPDATE clientes SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *';
        const result = await pool.query(query, [nome, email, telefone || null, id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async remover(id: number): Promise<boolean> {
        const query = 'DELETE FROM clientes WHERE id = $1';
        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
