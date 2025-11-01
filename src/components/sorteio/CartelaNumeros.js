import React from 'react';

export default function CartelaNumeros({
  centena,
  numerosSelecionados,
  numerosVendidos,
  onToggleNumero,
}) {
  const inicio = centena * 100;
  const numeros = Array.from({ length: 100 }, (_, i) => i + inicio);

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm w-full overflow-auto">
      <div className="grid grid-cols-10 gap-2">
        {numeros.map((n) => {
          const vendido = numerosVendidos.includes(n);
          const selecionado = numerosSelecionados.includes(n);

          return (
            <button
              key={n}
              onClick={() => !vendido && onToggleNumero(n)}
              className={`py-2 rounded-md text-sm border ${vendido ? 'bg-red-400 text-white cursor-not-allowed border-red-400' : selecionado ? 'bg-blue-400 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
              disabled={vendido}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
