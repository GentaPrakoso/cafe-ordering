import Image from 'next/image';

export default function MenuCard({ menu, onAddToCart }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl">
      <div className="relative w-full h-40">
        <Image src={menu.image || '/placeholder.jpg'} alt={menu.name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{menu.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{menu.description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="font-bold text-amber-600">Rp {menu.price.toLocaleString()}</span>
          <button
            onClick={() => onAddToCart(menu)}
            disabled={!menu.available}
            className="bg-amber-600 text-white px-3 py-1 rounded-lg disabled:opacity-50 text-sm"
          >
            + Pesan
          </button>
        </div>
      </div>
    </div>
  );
}