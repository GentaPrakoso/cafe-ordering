import Link from 'next/link';

export default function Home() {
  return (
    <>
      <section className="relative h-[80vh] flex items-center justify-center text-center bg-gradient-to-br from-amber-100 to-amber-300 dark:from-gray-800 dark:to-gray-700">
        <div className="z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">Kopi Premium,<br/>Suasana Hati</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-200">Nikmati pengalaman ngopi modern dengan sentuhan personal</p>
          <Link href="/menu" className="bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-700 transition">
            Pesan Sekarang
          </Link>
        </div>
      </section>
      // Best seller, kategori, testimoni, lokasi bisa ditambahkan dummy
    </>
  );
}