import { AutorController } from '../controllers/AutorController';
import { LivroController } from '../controllers/LivroController';
import { ClienteController } from '../controllers/ClienteController';
import { EmprestimoController } from '../controllers/EmprestimoController';
import { RelatorioController } from '../controllers/RelatorioController';
import { askQuestion, waitEnter } from '../utils/consoleUtils';

export class MainMenu {
    private autorController = new AutorController();
    private livroController = new LivroController();
    private clienteController = new ClienteController();
    private emprestimoController = new EmprestimoController();
    private relatorioController = new RelatorioController();

    async iniciar(): Promise<void> {
        let sair = false;
        while (!sair) {
            console.clear();
            console.log('====================================');
            console.log('       BOOKSTORE MANAGER CLI        ');
            console.log('====================================');
            console.log('1. Autores');
            console.log('2. Livros');
            console.log('3. Clientes');
            console.log('4. Empréstimos');
            console.log('5. Relatórios');
            console.log('0. Encerrar aplicação');
            console.log('====================================');
            
            const opcao = await askQuestion('Selecione um módulo: ');

            try {
                switch (opcao) {
                    case '1': await this.autorController.menu(); break;
                    case '2': await this.livroController.menu(); break;
                    case '3': await this.clienteController.menu(); break;
                    case '4': await this.emprestimoController.menu(); break;
                    case '5': await this.relatorioController.menu(); break;
                    case '0': 
                        console.log('Encerrando a aplicação...');
                        sair = true; 
                        break;
                    default: 
                        console.log('Opção inválida!'); 
                        await waitEnter();
                }
            } catch (error: any) {
                // RF15: Tratamento de Erro genérico de borda para não quebrar o loop principal
                console.error(`Ocorreu um erro crítico no sistema: ${error.message}`);
                await waitEnter();
            }
        }
    }
}
