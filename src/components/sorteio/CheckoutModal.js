import React from 'react';

export default function CheckoutModal({
  isOpen,
  onClose,
  numerosSelecionados,
  valorTotal,
  sorteioId,
  onConfirmarCompra,
}) {
  const handleConfirmar = () => {
    const dados = {
      sorteioId,
      numerosSelecionados,
      nome: "Usuário Teste",
      email: "teste@exemplo.com",
      telefone: "999999999",
      valorTotal,
    };
    onConfirmarCompra(dados);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h3 className="text-lg font-semibold mb-2">Confirmar Compra</h3>
        <p className="text-sm text-gray-600 mb-4">
          Números: {numerosSelecionados.join(', ')}
        </p>
        <p className="mb-4"><strong>Total:</strong> R$ {valorTotal.toFixed(2)}</p>
        <div className="flex justify-between">
          <button onClick={onClose} className="px-3 py-2 rounded-md border">Cancelar</button>
          <button onClick={handleConfirmar} className="px-3 py-2 rounded-md bg-emerald-500 text-white">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
