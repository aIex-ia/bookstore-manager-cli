import { pool } from '../database/connection';
import { Autor } from '../models/Autor';

export class AutorRepository {
    async cadastrar(nome: string, nacionalidade?: string): Promise<Autor> {
        const query = 'INSERT INTO autores (nome, nacionalidade) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(query, [nome, nacionalidade || null]);
        return result.rows[0];
    }

    async listarTodos(): Promise<Autor[]> {
        const query = 'SELECT * FROM autores ORDER BY id ASC';
        const result = await pool.query(query);
        return result.rows;
    }

    async buscarPorId(id: number): Promise<Autor | null> {
        const query = 'SELECT * FROM autores WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async atualizar(id: number, nome: string, nacionalidade?: string): Promise<Autor | null> {
        const query = 'UPDATE autores SET nome = $1, nacionalidade = $2 WHERE id = $3 RETURNING *';
        const result = await pool.query(query, [nome, nacionalidade || null, id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async remover(id: number): Promise<boolean> {
        const query = 'DELETE FROM autores WHERE id = $1';
        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
