#include <stdio.h>
#include <stdlib.h>

/* ==========================================================================
   PROGRAMA DE TESTE DO ULTRON — ENGENHARIA DE SOFTWARE
   Demonstração de Alocação de Memória Dinâmica em C99
   ========================================================================== */

typedef struct {
    char* nome;
    char* faculdade;
    int periodo;
    char* status;
} EstudanteDev;

int main(void) {
    printf("=========================================\n");
    printf(" ULTRON C99 ENVIRONMENT: COMPILATION OK  \n");
    printf("=========================================\n\n");

    // Alocação dinâmica com validação de ponteiro nulo
    EstudanteDev* brendo = (EstudanteDev*) malloc(sizeof(EstudanteDev));
    if (brendo == NULL) {
        fprintf(stderr, "Erro critico: Falha de alocacao de memoria (RAM cheia).\n");
        return 1;
    }

    brendo->nome = "Brendo Lima";
    brendo->faculdade = "Universidade Estacio de Sa";
    brendo->periodo = 1;
    brendo->status = "Bolsista pH 100% | Focado em C & Agentes de IA";

    printf("[+] Desenvolvedor: %s\n", brendo->nome);
    printf("[+] Instituicao:   %s (%d periodo)\n", brendo->faculdade, brendo->periodo);
    printf("[+] Perfil:        %s\n\n", brendo->status);

    // Boas práticas: desalocação explícita de memória para zero vazamentos
    free(brendo);
    brendo = NULL;

    printf("[OK] Memoria desalocada com sucesso (0 leaks).\n");
    return 0;
}
