import { pool } from '../database/connection';
import { Livro } from '../models/Livro';

export class LivroRepository {
    async cadastrar(titulo: string, autor_id: number, ano_publicacao: number | undefined, quantidade_disponivel: number): Promise<Livro> {
        const query = 'INSERT INTO livros (titulo, autor_id, ano_publicacao, quantidade_disponivel) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await pool.query(query, [titulo, autor_id, ano_publicacao || null, quantidade_disponivel]);
        return result.rows[0];
    }

    async listarTodos(): Promise<Livro[]> {
        const query = `
            SELECT l.*, a.nome as autor_nome 
            FROM livros l 
            JOIN autores a ON l.autor_id = a.id 
            ORDER BY l.id ASC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    async buscarPorId(id: number): Promise<Livro | null> {
        const query = 'SELECT * FROM livros WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async atualizar(id: number, titulo: string, autor_id: number, ano_publicacao: number | undefined, quantidade_disponivel: number): Promise<Livro | null> {
        const query = 'UPDATE livros SET titulo = $1, autor_id = $2, ano_publicacao = $3, quantidade_disponivel = $4 WHERE id = $5 RETURNING *';
        const result = await pool.query(query, [titulo, autor_id, ano_publicacao || null, quantidade_disponivel, id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async remover(id: number): Promise<boolean> {
        const query = 'DELETE FROM livros WHERE id = $1';
        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
