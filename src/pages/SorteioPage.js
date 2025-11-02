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

