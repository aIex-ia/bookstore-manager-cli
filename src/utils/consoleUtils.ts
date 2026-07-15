import * as readline from 'readline';

// Função auxiliar para leitura de dados no terminal de forma síncrona/await (RNF01)
export function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans.trim());
    }));
}

// Pausa a execução até o usuário pressionar Enter
export async function waitEnter(): Promise<void> {
    await askQuestion('\nPressione ENTER para continuar...');
}
