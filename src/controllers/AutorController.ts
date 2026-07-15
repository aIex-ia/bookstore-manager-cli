import { AutorService } from '../services/AutorService';
import { askQuestion, waitEnter } from '../utils/consoleUtils';

export class AutorController {
    private autorService: AutorService;

    constructor() {
        this.autorService = new AutorService();
    }

    async menu(): Promise<void> {
        let sair = false;
        while (!sair) {
            console.clear();
            console.log('=== GERENCIAMENTO DE AUTORES ===');
            console.log('1. Cadastrar Autor');
            console.log('2. Listar Autores');
            console.log('3. Consultar Autor por ID');
            console.log('4. Atualizar Autor');
            console.log('5. Remover Autor');
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
        console.log('\n-- Cadastrar Autor --');
        const nome = await askQuestion('Nome do Autor: ');
        const nacionalidade = await askQuestion('Nacionalidade (opcional): ');
        
        await this.autorService.cadastrarAutor(nome, nacionalidade);
        console.log('Autor cadastrado com sucesso!');
        await waitEnter();
    }

    private async listar(): Promise<void> {
        console.log('\n-- Lista de Autores --');
        const autores = await this.autorService.listarAutores();
        
        if (autores.length === 0) {
            console.log('Nenhum autor cadastrado.');
        } else {
            console.table(autores);
        }
        await waitEnter();
    }

    private async consultar(): Promise<void> {
        console.log('\n-- Consultar Autor --');
        const idStr = await askQuestion('ID do Autor: ');
        const id = parseInt(idStr);
        
        if (isNaN(id)) throw new Error('ID deve ser um número.');

        const autor = await this.autorService.consultarAutor(id);
        console.log('\nDados do Autor:');
        console.table([autor]);
        await waitEnter();
    }

    private async atualizar(): Promise<void> {
        console.log('\n-- Atualizar Autor --');
        const idStr = await askQuestion('ID do Autor que deseja atualizar: ');
        const id = parseInt(idStr);
        
        if (isNaN(id)) throw new Error('ID deve ser um número.');

        const autorExistente = await this.autorService.consultarAutor(id);

        console.log('\n(Deixe em branco para manter o valor atual)');
        const nomeInput = await askQuestion(`Novo Nome [${autorExistente.nome}]: `);
        const nacionalidadeInput = await askQuestion(`Nova Nacionalidade [${autorExistente.nacionalidade || 'Não informada'}]: `);

        const nome = nomeInput.trim() !== '' ? nomeInput : autorExistente.nome;
        const nacionalidade = nacionalidadeInput.trim() !== '' ? nacionalidadeInput : autorExistente.nacionalidade;

        await this.autorService.atualizarAutor(id, nome, nacionalidade);
        console.log('Autor atualizado com sucesso!');
        await waitEnter();
    }

    private async remover(): Promise<void> {
        console.log('\n-- Remover Autor --');
        const idStr = await askQuestion('ID do Autor que deseja remover: ');
        const id = parseInt(idStr);
        
        if (isNaN(id)) throw new Error('ID deve ser um número.');

        await this.autorService.removerAutor(id);
        console.log('Autor removido com sucesso!');
        await waitEnter();
    }
}
