import { EmprestimoService } from '../services/EmprestimoService';
import { askQuestion, waitEnter } from '../utils/consoleUtils';
import * as util from 'util'; // Usado para formatar datas, se necessário

export class EmprestimoController {
    private emprestimoService: EmprestimoService;

    constructor() {
        this.emprestimoService = new EmprestimoService();
    }

    async menu(): Promise<void> {
        let sair = false;
        while (!sair) {
            console.clear();
            console.log('=== GERENCIAMENTO DE EMPRÉSTIMOS ===');
            console.log('1. Realizar Empréstimo');
            console.log('2. Registrar Devolução');
            console.log('3. Consultar Histórico de Empréstimos');
            console.log('0. Voltar ao Menu Principal');
            
            const opcao = await askQuestion('Escolha uma opção: ');

            try {
                switch (opcao) {
                    case '1': await this.realizar(); break;
                    case '2': await this.devolver(); break;
                    case '3': await this.consultar(); break;
                    case '0': sair = true; break;
                    default: console.log('Opção inválida!'); await waitEnter();
                }
            } catch (error: any) {
                console.log(`\nErro: ${error.message}`);
                await waitEnter();
            }
        }
    }

    private async realizar(): Promise<void> {
        console.log('\n-- Realizar Empréstimo --');
        const livro_id = parseInt(await askQuestion('ID do Livro: '));
        const cliente_id = parseInt(await askQuestion('ID do Cliente: '));
        
        if (isNaN(livro_id) || isNaN(cliente_id)) {
            throw new Error('IDs devem ser numéricos.');
        }

        await this.emprestimoService.realizarEmprestimo(livro_id, cliente_id);
        console.log('Empréstimo registrado com sucesso! A disponibilidade do livro foi atualizada.');
        await waitEnter();
    }

    private async devolver(): Promise<void> {
        console.log('\n-- Registrar Devolução --');
        const emprestimo_id = parseInt(await askQuestion('ID do Empréstimo: '));
        
        if (isNaN(emprestimo_id)) {
            throw new Error('ID deve ser numérico.');
        }

        await this.emprestimoService.registrarDevolucao(emprestimo_id);
        console.log('Devolução registrada com sucesso! A disponibilidade do livro foi restaurada.');
        await waitEnter();
    }

    private async consultar(): Promise<void> {
        console.log('\n-- Histórico de Empréstimos --');
        const emprestimos = await this.emprestimoService.listarEmprestimos();
        
        if (emprestimos.length === 0) {
            console.log('Nenhum empréstimo registrado.');
        } else {
            // Formatar visualização simplificada para console
            const listaFormatada = emprestimos.map(e => ({
                ID: e.id,
                Livro: e.livro_titulo,
                Cliente: e.cliente_nome,
                'Emprestado em': e.data_emprestimo ? new Date(e.data_emprestimo).toLocaleDateString('pt-BR') : 'N/A',
                'Devolvido em': e.data_devolucao ? new Date(e.data_devolucao).toLocaleDateString('pt-BR') : 'Pendente'
            }));
            console.table(listaFormatada);
        }
        await waitEnter();
    }
}
