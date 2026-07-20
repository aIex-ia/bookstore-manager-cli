import { ClienteRepository } from '../repositories/ClienteRepository';
import { Cliente } from '../models/Cliente';

export class ClienteService {
    private clienteRepository: ClienteRepository;

    constructor() {
        this.clienteRepository = new ClienteRepository();
    }

    async cadastrarCliente(nome: string, email: string, telefone?: string): Promise<Cliente> {
        if (!nome || !email) {
            throw new Error('Nome e email são obrigatórios.');
        }

        // RF13: registros duplicados quando aplicável (Email UNIQUE)
        const clienteExistente = await this.clienteRepository.findByEmail(email);
        if (clienteExistente) {
            throw new Error('Já existe um cliente cadastrado com este e-mail.');
        }

        return await this.clienteRepository.cadastrar(nome, email, telefone);
    }

    async listarClientes(): Promise<Cliente[]> {
        return await this.clienteRepository.listarTodos();
    }

    async consultarCliente(id: number): Promise<Cliente> {
        const cliente = await this.clienteRepository.buscarPorId(id);
        if (!cliente) {
            throw new Error('Cliente inexistente.'); // RF13
        }
        return cliente;
    }

    async atualizarCliente(id: number, nome: string, email: string, telefone?: string): Promise<Cliente> {
        if (!nome || !email) {
            throw new Error('Nome e email são obrigatórios.');
        }

        const clienteAtual = await this.consultarCliente(id);

        // Verifica duplicidade de email apenas se o email estiver sendo alterado
        if (clienteAtual.email !== email) {
            const clienteExistente = await this.clienteRepository.findByEmail(email);
            if (clienteExistente) {
                throw new Error('Já existe outro cliente cadastrado com este e-mail.');
            }
        }

        const clienteAtualizado = await this.clienteRepository.atualizar(id, nome, email, telefone);
        if (!clienteAtualizado) {
            throw new Error('Erro ao atualizar o cliente.');
        }
        return clienteAtualizado;
    }

    async removerCliente(id: number): Promise<void> {
        await this.consultarCliente(id);

        const { pool } = await import('../database/connection');
        const query = 'SELECT id FROM emprestimos WHERE cliente_id = $1 AND data_devolucao IS NULL';
        const result = await pool.query(query, [id]);
        if (result.rows.length > 0) {
            throw new Error('Não é possível remover um cliente que possui livros não devolvidos.');
        }

        const deletado = await this.clienteRepository.remover(id);
        if (!deletado) {
            throw new Error('Erro ao remover o cliente.');
        }
    }
}
