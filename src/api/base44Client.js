export const base44 = {
  entities: {
    Sorteio: {
      async filter(params) {
        // mock: retorna um sorteio ativo
        return [
          {
            id: 1,
            titulo: "Sorteio DSW - Demo",
            descricao: "Sorteio de demonstração com interface local (mock).",
            preco_por_numero: 5,
            total_numeros: 300,
            status: "ativo",
            data_sorteio: "2025-12-20T20:00:00Z",
            imagem_url: "https://picsum.photos/300/200?random=1",
          },
        ];
      },
    },
    Ticket: {
      async filter(params) {
        // mock: nenhum ticket vendido inicialmente
        return [];
      },
      async create(ticket) {
        console.log('Ticket criado (mock):', ticket);
        // em um back real você retornaria o ticket com id etc.
        return { id: Date.now(), ...ticket };
      },
    },
  },
};
