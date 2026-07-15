import { ClienteService } from '../services/ClienteService';
import { askQuestion, waitEnter } from '../utils/consoleUtils';

export class ClienteController {
    private clienteService: ClienteService;

    constructor() {
        this.clienteService = new ClienteService();
    }

    async menu(): Promise<void> {
        let sair = false;
        while (!sair) {
            console.clear();
            console.log('=== GERENCIAMENTO DE CLIENTES ===');
            console.log('1. Cadastrar Cliente');
            console.log('2. Listar Clientes');
            console.log('3. Consultar Cliente por ID');
            console.log('4. Atualizar Cliente');
            console.log('5. Remover Cliente');
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
        console.log('\n-- Cadastrar Cliente --');
        const nome = await askQuestion('Nome do Cliente: ');
        const email = await askQuestion('E-mail do Cliente: ');
        const telefone = await askQuestion('Telefone (opcional): ');
        
        await this.clienteService.cadastrarCliente(nome, email, telefone);
        console.log('Cliente cadastrado com sucesso!');
        await waitEnter();
    }

    private async listar(): Promise<void> {
        console.log('\n-- Lista de Clientes --');
        const clientes = await this.clienteService.listarClientes();
        
        if (clientes.length === 0) {
            console.log('Nenhum cliente cadastrado.');
        } else {
            console.table(clientes);
        }
        await waitEnter();
    }

    private async consultar(): Promise<void> {
        console.log('\n-- Consultar Cliente --');
        const id = parseInt(await askQuestion('ID do Cliente: '));
        if (isNaN(id)) throw new Error('ID deve ser um número.');

        const cliente = await this.clienteService.consultarCliente(id);
        console.log('\nDados do Cliente:');
        console.table([cliente]);
        await waitEnter();
    }

    private async atualizar(): Promise<void> {
        console.log('\n-- Atualizar Cliente --');
        const id = parseInt(await askQuestion('ID do Cliente que deseja atualizar: '));
        if (isNaN(id)) throw new Error('ID deve ser um número.');

        const clienteExistente = await this.clienteService.consultarCliente(id);

        console.log('\n(Deixe em branco para manter o valor atual)');
        const nomeInput = await askQuestion(`Novo Nome [${clienteExistente.nome}]: `);
        const emailInput = await askQuestion(`Novo E-mail [${clienteExistente.email}]: `);
        const telefoneInput = await askQuestion(`Novo Telefone [${clienteExistente.telefone || 'Não informado'}]: `);

        const nome = nomeInput.trim() !== '' ? nomeInput : clienteExistente.nome;
        const email = emailInput.trim() !== '' ? emailInput : clienteExistente.email;
        const telefone = telefoneInput.trim() !== '' ? telefoneInput : clienteExistente.telefone;

        await this.clienteService.atualizarCliente(id, nome, email, telefone);
        console.log('Cliente atualizado com sucesso!');
        await waitEnter();
    }

    private async remover(): Promise<void> {
        console.log('\n-- Remover Cliente --');
        const id = parseInt(await askQuestion('ID do Cliente que deseja remover: '));
        if (isNaN(id)) throw new Error('ID deve ser um número.');

        await this.clienteService.removerCliente(id);
        console.log('Cliente removido com sucesso!');
        await waitEnter();
    }
}
