import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroService } from './LivroService';
import { ClienteService } from './ClienteService';
import { Emprestimo } from '../models/Emprestimo';
import { pool } from '../database/connection';

export class EmprestimoService {
    private emprestimoRepository: EmprestimoRepository;
    private livroService: LivroService;
    private clienteService: ClienteService;

    constructor() {
        this.emprestimoRepository = new EmprestimoRepository();
        this.livroService = new LivroService();
        this.clienteService = new ClienteService();
    }

    async realizarEmprestimo(livro_id: number, cliente_id: number): Promise<Emprestimo> {
        // RF10 / RF13: Validações antes de registrar
        const livro = await this.livroService.consultarLivro(livro_id); // Verifica existência do livro
        await this.clienteService.consultarCliente(cliente_id); // Verifica existência do cliente

        if (livro.quantidade_disponivel <= 0) {
            throw new Error('Livro indisponível para empréstimo no momento.');
        }

        // Utilizando a conexão para gerenciar a transação se quiséssemos, 
        // mas faremos via Service layer para manter a arquitetura simples:
        
        // Decrementa a disponibilidade
        await this.livroService.atualizarLivro(
            livro.id!, 
            livro.titulo, 
            livro.autor_id, 
            livro.ano_publicacao, 
            livro.quantidade_disponivel - 1
        );

        // Registra o empréstimo
        return await this.emprestimoRepository.cadastrar(livro_id, cliente_id);
    }

    async registrarDevolucao(id: number): Promise<Emprestimo> {
        const emprestimo = await this.emprestimoRepository.buscarPorId(id);
        
        if (!emprestimo) {
            throw new Error('Empréstimo inexistente.'); // RF13
        }

        if (emprestimo.data_devolucao) {
            throw new Error('Este empréstimo já foi devolvido.');
        }

        // RF11: Atualizar quantidade disponível do livro
        const livro = await this.livroService.consultarLivro(emprestimo.livro_id);
        await this.livroService.atualizarLivro(
            livro.id!, 
            livro.titulo, 
            livro.autor_id, 
            livro.ano_publicacao, 
            livro.quantidade_disponivel + 1
        );

        const emprestimoDevolvido = await this.emprestimoRepository.updateDevolucao(id);
        if (!emprestimoDevolvido) {
            throw new Error('Erro ao registrar a devolução.');
        }

        return emprestimoDevolvido;
    }

    async listarEmprestimos(): Promise<any[]> {
        // Retorna a listagem rica com JOIN (RF12)
        return await this.emprestimoRepository.listarTodos();
    }
}
