export interface Livro {
    id?: number;
    titulo: string;
    autor_id: number;
    ano_publicacao?: number;
    quantidade_disponivel: number;
}
