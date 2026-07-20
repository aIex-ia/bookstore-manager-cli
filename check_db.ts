import { pool } from './src/database/connection';

async function checkDatabase() {
    try {
        console.log('Testando conexão com o PostgreSQL...');
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        
        const tabelas = res.rows.map(r => r.table_name);
        
        if (tabelas.length > 0) {
            console.log('✅ Conexão bem-sucedida! Tabelas criadas:');
            console.log(tabelas);
        } else {
            console.log('⚠️ Conexão funcionou, mas NENHUMA tabela foi encontrada. Você rodou o schema.sql?');
        }
        
    } catch (error: any) {
        console.log('❌ Erro ao conectar no banco de dados:');
        console.log(error.message);
        console.log('\nVerifique se o PostgreSQL está rodando e se a senha no arquivo .env está correta.');
    } finally {
        await pool.end();
    }
}

checkDatabase();
