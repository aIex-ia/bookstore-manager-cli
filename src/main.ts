import { MainMenu } from './menus/MainMenu';
import { pool } from './database/connection';

export async function main() {
    try {
        const mainMenu = new MainMenu();
        await mainMenu.iniciar();
    } catch (error) {
        console.error('Falha fatal na inicialização:', error);
    } finally {
        // Encerra as conexões com o banco ao fechar o app
        await pool.end();
        process.exit(0);
    }
}

if (require.main === module) {
    main();
}
