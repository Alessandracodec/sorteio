
import React, { useState } from 'react';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Droplets, Calendar, Users, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import NumeradorCentenas from '../components/sorteio/NumeradorCentenas';
import CartelaNumeros from '../components/sorteio/CartelaNumeros';
import CarrinhoCompra from '../components/sorteio/CarrinhoCompra';
import CheckoutModal from '../components/sorteio/CheckoutModal';

export default function SorteioPage() {
  const [centena, setCentena] = useState(0);
  const [numerosSelecionados, setNumerosSelecionados] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: sorteios = [], isLoading: loadingSorteios } = useQuery({
    queryKey: ['sorteios'],
    queryFn: () => base44.entities.Sorteio.filter({ status: 'ativo' }),
    initialData: [],
  });

  const sorteioAtivo = sorteios[0];

  const { data: tickets = [], isLoading: loadingTickets } = useQuery({
    queryKey: ['tickets', sorteioAtivo?.id],
    queryFn: () =>
      sorteioAtivo
        ? base44.entities.Ticket.filter({
            sorteio_id: sorteioAtivo.id,
            status_pagamento: 'aprovado'
          })
        : [],
    enabled: !!sorteioAtivo,
    initialData: [],
  });

  const numerosVendidos = tickets.flatMap(ticket => ticket.numeros || []);

  const criarTicketMutation = useMutation({
    mutationFn: async (dadosCompra) => {
      const ticket = await base44.entities.Ticket.create({
        sorteio_id: dadosCompra.sorteioId,
        numeros: dadosCompra.numerosSelecionados,
        comprador_nome: dadosCompra.nome,
        comprador_email: dadosCompra.email,
        comprador_telefone: dadosCompra.telefone,
        valor_total: dadosCompra.valorTotal,
        status_pagamento: 'pendente'
      });

      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setNumerosSelecionados([]);
      setCheckoutOpen(false);
      alert('Compra registrada (mock). Em produção, redirecionaria ao Mercado Pago.');
    },
  });

  const handleToggleNumero = (numero) => {
    setNumerosSelecionados(prev =>
      prev.includes(numero)
        ? prev.filter(n => n !== numero)
        : [...prev, numero]
    );
  };

  const handleRemoverNumero = (numero) => {
    setNumerosSelecionados(prev => prev.filter(n => n !== numero));
  };

  const handleConfirmarCompra = async (dadosCompra) => {
    await criarTicketMutation.mutateAsync(dadosCompra);
  };

  if (loadingSorteios) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!sorteioAtivo) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-xl shadow-lg p-6 max-w-md">
          <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Nenhum Sorteio Ativo
          </h2>
          <p className="text-sm text-gray-600">
            Volte em breve!
          </p>
        </div>
      </div>
    );
  }

  const numerosDisponiveis = sorteioAtivo.total_numeros - numerosVendidos.length;
  const percentualVendido = (numerosVendidos.length / sorteioAtivo.total_numeros) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Sorteio Ativo</span>
              </div>

              <h1 className="text-2xl font-bold mb-1">
                {sorteioAtivo.titulo}
              </h1>

              <p className="text-sm opacity-90 line-clamp-1">
                {sorteioAtivo.descricao}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[80px] text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-[10px] opacity-75">Preço</span>
                </div>
                <p className="text-lg font-bold">R$ {sorteioAtivo.preco_por_numero?.toFixed(2)}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[80px] text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Users className="w-3 h-3" />
                  <span className="text-[10px] opacity-75">Livres</span>
                </div>
                <p className="text-lg font-bold">{numerosDisponiveis}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[80px] text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Calendar className="w-3 h-3" />
                  <span className="text-[10px] opacity-75">Sorteio</span>
                </div>
                <p className="text-sm font-bold">
                  {sorteioAtivo.data_sorteio
                    ? format(new Date(sorteioAtivo.data_sorteio), 'dd/MM HH:mm', { locale: ptBR })
                    : 'Em breve'}
                </p>
              </div>
            </div>

            {sorteioAtivo.imagem_url && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={sorteioAtivo.imagem_url}
                  alt={sorteioAtivo.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="opacity-90">Vendidos</span>
              <span className="font-bold">{percentualVendido.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${percentualVendido}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 h-full">
          <div className="grid grid-cols-[200px,1fr] gap-4 h-full">
              <NumeradorCentenas
                centena={centena}
                onChange={setCentena}
                totalCentenas={Math.ceil(sorteioAtivo.total_numeros / 100)}
              />
            </div>

            <div className="w-full">
              <CartelaNumeros
                centena={centena}
                numerosSelecionados={numerosSelecionados}
                numerosVendidos={numerosVendidos}
                onToggleNumero={handleToggleNumero}
              />
            </div>
          </div>
        </div>
      </div>

      <CarrinhoCompra
        numerosSelecionados={numerosSelecionados}
        precoPorNumero={sorteioAtivo.preco_por_numero || 0}
        onRemoverNumero={handleRemoverNumero}
        onLimparCarrinho={() => setNumerosSelecionados([])}
        onFinalizar={() => setCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        numerosSelecionados={numerosSelecionados}
        valorTotal={numerosSelecionados.length * (sorteioAtivo.preco_por_numero || 0)}
        sorteioId={sorteioAtivo.id}
        onConfirmarCompra={handleConfirmarCompra}
      />
    </div>
  );
}
