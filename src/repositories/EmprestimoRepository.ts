import { pool } from '../database/connection';
import { Emprestimo } from '../models/Emprestimo';

export class EmprestimoRepository {
    async cadastrar(livro_id: number, cliente_id: number): Promise<Emprestimo> {
        // A data_emprestimo usa o default (CURRENT_DATE) do banco
        const query = 'INSERT INTO emprestimos (livro_id, cliente_id) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(query, [livro_id, cliente_id]);
        return result.rows[0];
    }

    async listarTodos(): Promise<any[]> {
        const query = `
            SELECT e.id, e.data_emprestimo, e.data_devolucao,
                   l.titulo as livro_titulo,
                   c.nome as cliente_nome
            FROM emprestimos e
            JOIN livros l ON e.livro_id = l.id
            JOIN clientes c ON e.cliente_id = c.id
            ORDER BY e.id ASC
        `;
        const result = await pool.query(query);
        return result.rows; // RF12: Consulta com informações do livro, cliente e datas (JOIN)
    }

    async buscarPorId(id: number): Promise<Emprestimo | null> {
        const query = 'SELECT * FROM emprestimos WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async buscarEmprestimoAtivo(livro_id: number, cliente_id: number): Promise<Emprestimo | null> {
        const query = 'SELECT * FROM emprestimos WHERE livro_id = $1 AND cliente_id = $2 AND data_devolucao IS NULL';
        const result = await pool.query(query, [livro_id, cliente_id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async updateDevolucao(id: number): Promise<Emprestimo | null> {
        // Atualiza preenchendo a data de devolução com o dia atual
        const query = 'UPDATE emprestimos SET data_devolucao = CURRENT_DATE WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows.length ? result.rows[0] : null;
    }
}
