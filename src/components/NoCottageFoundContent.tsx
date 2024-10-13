interface Props {
  handleResetFilters: () => void;
}

export const NoCottageFoundContent = ({ handleResetFilters }: Props) => {
  return (
    <div className="flex flex-col items-center space-y-4 py-8 text-center">
      <h2 className="text-2xl font-bold text-gray-700">Žiadne výsledky</h2>
      <p className="text-gray-500">
        Nenašli sme žiadne chaty, ktoré by vyhovovali vašim kritériám. Skúste
        zmeniť filtre alebo upraviť vyhľadávanie.
      </p>
      <button
        onClick={handleResetFilters}
        className="rounded-lg bg-slate-600 px-4 py-2 text-white"
      >
        Resetovať filtre
      </button>
    </div>
  );
};
