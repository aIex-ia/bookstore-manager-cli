export interface Emprestimo {
    id?: number;
    livro_id: number;
    cliente_id: number;
    data_emprestimo?: Date; // Geralmente assumido como a data atual
    data_devolucao?: Date | null;
}
