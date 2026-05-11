import Image from 'next/image';

export default function MenuCard({ menu, onDetail }) {
  return (
    <div
      onClick={() => onDetail(menu)}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl cursor-pointer"
    >
      <div className="relative w-full h-40 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
        {menu.image ? (
          <Image src={menu.image} alt={menu.name} fill className="object-cover" />
        ) : (
          <span className="text-4xl">☕</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{menu.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {menu.description}
        </p>
        <p className="mt-2 font-bold text-amber-600">
          Rp {menu.price?.toLocaleString() ?? '0'}
        </p>
      </div>
    </div>
  );
}