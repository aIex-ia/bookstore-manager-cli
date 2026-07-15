import { LivroService } from '../services/LivroService';
import { askQuestion, waitEnter } from '../utils/consoleUtils';

export class LivroController {
    private livroService: LivroService;

    constructor() {
        this.livroService = new LivroService();
    }

    async menu(): Promise<void> {
        let sair = false;
        while (!sair) {
            console.clear();
            console.log('=== GERENCIAMENTO DE LIVROS ===');
            console.log('1. Cadastrar Livro');
            console.log('2. Listar Livros');
            console.log('3. Consultar Livro por ID');
            console.log('4. Atualizar Livro');
            console.log('5. Remover Livro');
            console.log('0. Voltar ao Menu Principal');
            
            const opcao = await askQuestion('Escolha uma opção: ');

            try {
                switch (opcao) {
                    case '1': await this.cadastrar(); break;
                    case '2': await this.listar(); break;
                    case '3': await this.consultar(); break;
                    case '4': await this.atualizar(); break;
                    case '5': await this.remover(); break;
                    case '0': sair = true; break;
                    default: console.log('Opção inválida!'); await waitEnter();
                }
            } catch (error: any) {
                console.log(`\nErro: ${error.message}`);
                await waitEnter();
            }
        }
    }

    private async cadastrar(): Promise<void> {
        console.log('\n-- Cadastrar Livro --');
        const titulo = await askQuestion('Título do Livro: ');
        const autor_id = parseInt(await askQuestion('ID do Autor: '));
        const anoStr = await askQuestion('Ano de Publicação (opcional): ');
        const ano_publicacao = anoStr ? parseInt(anoStr) : undefined;
        const quantidade = parseInt(await askQuestion('Quantidade Disponível: '));
        
        if (isNaN(autor_id) || isNaN(quantidade)) throw new Error('ID do Autor e Quantidade devem ser números válidos.');

        await this.livroService.cadastrarLivro(titulo, autor_id, ano_publicacao, quantidade);
        console.log('Livro cadastrado com sucesso!');
        await waitEnter();
    }

    private async listar(): Promise<void> {
        console.log('\n-- Lista de Livros --');
        const livros = await this.livroService.listarLivros();
        
        if (livros.length === 0) {
            console.log('Nenhum livro cadastrado.');
        } else {
            console.table(livros);
        }
        await waitEnter();
    }

    private async consultar(): Promise<void> {
        console.log('\n-- Consultar Livro --');
        const id = parseInt(await askQuestion('ID do Livro: '));
        if (isNaN(id)) throw new Error('ID deve ser um número.');

        const livro = await this.livroService.consultarLivro(id);
        console.log('\nDados do Livro:');
        console.table([livro]);
        await waitEnter();
    }

    private async atualizar(): Promise<void> {
        console.log('\n-- Atualizar Livro --');
        const id = parseInt(await askQuestion('ID do Livro que deseja atualizar: '));
        if (isNaN(id)) throw new Error('ID deve ser um número.');

        await this.livroService.consultarLivro(id);

        const titulo = await askQuestion('Novo Título: ');
        const autor_id = parseInt(await askQuestion('Novo ID do Autor: '));
        const anoStr = await askQuestion('Novo Ano de Publicação (opcional): ');
        const ano_publicacao = anoStr ? parseInt(anoStr) : undefined;
        const quantidade = parseInt(await askQuestion('Nova Quantidade Disponível: '));

        if (isNaN(autor_id) || isNaN(quantidade)) throw new Error('ID e Quantidade devem ser números.');

        await this.livroService.atualizarLivro(id, titulo, autor_id, ano_publicacao, quantidade);
        console.log('Livro atualizado com sucesso!');
        await waitEnter();
    }

    private async remover(): Promise<void> {
        console.log('\n-- Remover Livro --');
        const id = parseInt(await askQuestion('ID do Livro que deseja remover: '));
        if (isNaN(id)) throw new Error('ID deve ser um número.');

        await this.livroService.removerLivro(id);
        console.log('Livro removido com sucesso!');
        await waitEnter();
    }
}
