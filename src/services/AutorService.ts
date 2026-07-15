import { AutorRepository } from '../repositories/AutorRepository';
import { Autor } from '../models/Autor';

export class AutorService {
    private autorRepository: AutorRepository;

    constructor() {
        this.autorRepository = new AutorRepository();
    }

    async cadastrarAutor(nome: string, nacionalidade?: string): Promise<Autor> {
        if (!nome) {
            throw new Error('O nome do autor é obrigatório.');
        }
        return await this.autorRepository.cadastrar(nome, nacionalidade);
    }

    async listarAutores(): Promise<Autor[]> {
        return await this.autorRepository.listarTodos();
    }

    async consultarAutor(id: number): Promise<Autor> {
        const autor = await this.autorRepository.buscarPorId(id);
        if (!autor) {
            throw new Error('Autor inexistente.');
        }
        return autor;
    }

    async atualizarAutor(id: number, nome: string, nacionalidade?: string): Promise<Autor> {
        if (!nome) {
            throw new Error('O nome do autor é obrigatório.');
        }
        
        // Verifica se existe antes
        await this.consultarAutor(id);

        const autorAtualizado = await this.autorRepository.atualizar(id, nome, nacionalidade);
        if (!autorAtualizado) {
            throw new Error('Erro ao atualizar o autor.');
        }
        return autorAtualizado;
    }

    async removerAutor(id: number): Promise<void> {
        await this.consultarAutor(id); // Garante que existe (RF13)
        const deletado = await this.autorRepository.remover(id);
        if (!deletado) {
            throw new Error('Erro ao remover o autor.');
        }
    }
}
