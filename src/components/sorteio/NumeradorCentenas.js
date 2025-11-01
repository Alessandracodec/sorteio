import React from 'react';

export default function NumeradorCentenas({ centena, onChange, totalCentenas }) {
  return (
    <div className="p-3 bg-white rounded-xl shadow-sm w-full">
      <h3 className="text-sm font-semibold mb-2">Centenas</h3>
      <div className="flex flex-col gap-2">
        {[...Array(totalCentenas)].map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`text-sm py-2 rounded-md ${i === centena ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
          >
            {i * 100}+
          </button>
        ))}
      </div>
    </div>
  );
}
