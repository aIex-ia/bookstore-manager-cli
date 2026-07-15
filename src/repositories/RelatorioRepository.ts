import { pool } from '../database/connection';

export class RelatorioRepository {
    async getLivrosDisponiveis(): Promise<any[]> {
        const query = `
            SELECT l.id, l.titulo, a.nome as autor, l.quantidade_disponivel
            FROM livros l
            INNER JOIN autores a ON l.autor_id = a.id
            WHERE l.quantidade_disponivel > 0
            ORDER BY l.titulo;
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    async getLivrosEmprestados(): Promise<any[]> {
        const query = `
            SELECT e.id as emprestimo_id, l.titulo, c.nome as cliente, e.data_emprestimo
            FROM emprestimos e
            INNER JOIN livros l ON e.livro_id = l.id
            INNER JOIN clientes c ON e.cliente_id = c.id
            WHERE e.data_devolucao IS NULL
            ORDER BY e.data_emprestimo ASC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    async getLivrosPorAutor(): Promise<any[]> {
        const query = `
            SELECT a.nome as autor, COUNT(l.id) as total_livros
            FROM autores a
            LEFT JOIN livros l ON a.id = l.autor_id
            GROUP BY a.nome
            ORDER BY total_livros DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    async getQuantidadeEmprestimosPorLivro(): Promise<any[]> {
        const query = `
            SELECT l.titulo, COUNT(e.id) as total_emprestimos
            FROM livros l
            LEFT JOIN emprestimos e ON l.id = e.livro_id
            GROUP BY l.titulo
            ORDER BY total_emprestimos DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    async getClientesComEmprestimosAtivos(): Promise<any[]> {
        const query = `
            SELECT c.nome as cliente, c.email, COUNT(e.id) as emprestimos_ativos
            FROM clientes c
            INNER JOIN emprestimos e ON c.id = e.cliente_id
            WHERE e.data_devolucao IS NULL
            GROUP BY c.nome, c.email
            ORDER BY emprestimos_ativos DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }
}
