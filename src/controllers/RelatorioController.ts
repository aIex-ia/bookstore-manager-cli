import { RelatorioRepository } from '../repositories/RelatorioRepository';
import { askQuestion, waitEnter } from '../utils/consoleUtils';

export class RelatorioController {
    private relatorioRepository: RelatorioRepository;

    constructor() {
        this.relatorioRepository = new RelatorioRepository();
    }

    async menu(): Promise<void> {
        let sair = false;
        while (!sair) {
            console.clear();
            console.log('=== MENU DE RELATÓRIOS ===');
            console.log('1. Livros Disponíveis');
            console.log('2. Livros Emprestados (não devolvidos)');
            console.log('3. Quantidade de Livros Cadastrados por Autor');
            console.log('4. Quantidade de Empréstimos por Livro');
            console.log('5. Clientes com Empréstimos Ativos');
            console.log('0. Voltar ao Menu Principal');
            
            const opcao = await askQuestion('Escolha uma opção: ');

            try {
                switch (opcao) {
                    case '1': await this.listarLivrosDisponiveis(); break;
                    case '2': await this.listarLivrosEmprestados(); break;
                    case '3': await this.listarLivrosPorAutor(); break;
                    case '4': await this.listarEmprestimosPorLivro(); break;
                    case '5': await this.listarClientesAtivos(); break;
                    case '0': sair = true; break;
                    default: console.log('Opção inválida!'); await waitEnter();
                }
            } catch (error: any) {
                console.log(`\nErro: ${error.message}`);
                await waitEnter();
            }
        }
    }

    private async listarLivrosDisponiveis(): Promise<void> {
        console.log('\n-- Livros Disponíveis --');
        const resultados = await this.relatorioRepository.getLivrosDisponiveis();
        if (resultados.length === 0) console.log('Nenhum dado encontrado.');
        else console.table(resultados);
        await waitEnter();
    }

    private async listarLivrosEmprestados(): Promise<void> {
        console.log('\n-- Livros Atualmente Emprestados --');
        const resultados = await this.relatorioRepository.getLivrosEmprestados();
        
        // Formatando datas para a exibição no terminal
        const formatados = resultados.map(r => ({
            ID_Emprestimo: r.emprestimo_id,
            Titulo: r.titulo,
            Cliente: r.cliente,
            Emprestado_em: r.data_emprestimo.toLocaleDateString('pt-BR')
        }));
        
        if (formatados.length === 0) console.log('Nenhum dado encontrado.');
        else console.table(formatados);
        await waitEnter();
    }

    private async listarLivrosPorAutor(): Promise<void> {
        console.log('\n-- Quantidade de Livros por Autor --');
        const resultados = await this.relatorioRepository.getLivrosPorAutor();
        if (resultados.length === 0) console.log('Nenhum dado encontrado.');
        else console.table(resultados);
        await waitEnter();
    }

    private async listarEmprestimosPorLivro(): Promise<void> {
        console.log('\n-- Quantidade de Empréstimos Históricos por Livro --');
        const resultados = await this.relatorioRepository.getQuantidadeEmprestimosPorLivro();
        if (resultados.length === 0) console.log('Nenhum dado encontrado.');
        else console.table(resultados);
        await waitEnter();
    }

    private async listarClientesAtivos(): Promise<void> {
        console.log('\n-- Clientes com Empréstimos Ativos --');
        const resultados = await this.relatorioRepository.getClientesComEmprestimosAtivos();
        if (resultados.length === 0) console.log('Nenhum dado encontrado.');
        else console.table(resultados);
        await waitEnter();
    }
}
