import { LivroRepository } from '../repositories/LivroRepository';
import { AutorService } from './AutorService';
import { Livro } from '../models/Livro';

export class LivroService {
    private livroRepository: LivroRepository;
    private autorService: AutorService;

    constructor() {
        this.livroRepository = new LivroRepository();
        this.autorService = new AutorService();
    }

    async cadastrarLivro(titulo: string, autor_id: number, ano_publicacao: number | undefined, quantidade_disponivel: number): Promise<Livro> {
        if (!titulo) throw new Error('O título do livro é obrigatório.');
        if (quantidade_disponivel < 0) throw new Error('A quantidade não pode ser negativa.');

        // RF08: Livro deve estar vinculado a um autor previamente cadastrado. 
        // RF13: Impedir autor inexistente.
        await this.autorService.consultarAutor(autor_id); 

        return await this.livroRepository.cadastrar(titulo, autor_id, ano_publicacao, quantidade_disponivel);
    }

    async listarLivros(): Promise<Livro[]> {
        return await this.livroRepository.listarTodos();
    }

    async consultarLivro(id: number): Promise<Livro> {
        const livro = await this.livroRepository.buscarPorId(id);
        if (!livro) {
            throw new Error('Livro inexistente.'); // RF13
        }
        return livro;
    }

    async atualizarLivro(id: number, titulo: string, autor_id: number, ano_publicacao: number | undefined, quantidade_disponivel: number): Promise<Livro> {
        if (!titulo) throw new Error('O título do livro é obrigatório.');
        if (quantidade_disponivel < 0) throw new Error('A quantidade não pode ser negativa.');

        await this.consultarLivro(id);
        await this.autorService.consultarAutor(autor_id); // Autor novo ou existente deve ser válido

        const livroAtualizado = await this.livroRepository.atualizar(id, titulo, autor_id, ano_publicacao, quantidade_disponivel);
        if (!livroAtualizado) {
            throw new Error('Erro ao atualizar o livro.');
        }
        return livroAtualizado;
    }

    async removerLivro(id: number): Promise<void> {
        await this.consultarLivro(id);
        const deletado = await this.livroRepository.remover(id);
        if (!deletado) {
            throw new Error('Erro ao remover o livro.');
        }
    }
}
