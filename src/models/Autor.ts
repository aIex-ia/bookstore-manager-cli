export interface Autor {
    id?: number; // Opcional pois é serial (gerado pelo DB)
    nome: string;
    nacionalidade?: string;
}
