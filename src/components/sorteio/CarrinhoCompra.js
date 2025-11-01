import React from 'react';

export default function CarrinhoCompra({
  numerosSelecionados,
  precoPorNumero,
  onRemoverNumero,
  onLimparCarrinho,
  onFinalizar,
}) {
  const total = numerosSelecionados.length * precoPorNumero;

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-2xl p-4 shadow-lg w-54">
      <h4 className="font-semibold mb-2">Carrinho</h4>
      {numerosSelecionados.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum número selecionado</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            {numerosSelecionados.map(n => (
              <button key={n} onClick={() => onRemoverNumero(n)} className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                {n} ✕
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Total</div>
              <div className="font-bold">R$ {total.toFixed(2)}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={onLimparCarrinho} className="text-sm text-gray-600">Limpar</button>
              <button onClick={onFinalizar} className="bg-emerald-500 text-white px-3 py-2 rounded-md">Finalizar</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
