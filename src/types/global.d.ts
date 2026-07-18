declare global {
  interface Window {
    __snapGoTo?: (index: number) => void;
    __snapGoToId?: (id: string) => void;
    __snapEnabled?: boolean;
    // Permite que uma seção "prenda" o scroll e avance passos internos
    // antes de liberar a troca de seção. Registro por índice de seção; o guard
    // recebe a direção (+1 desce / -1 sobe) e retorna true se consumiu o gesto.
    __snapStepGuards?: Record<number, (dir: number) => boolean>;
  }
}

export {};
