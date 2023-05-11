/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import CardBeranda from '../components/organisms/Beranda/CardBeranda';
import SidemenuBeranda from '../components/organisms/Beranda/SidemenuBeranda';
import Footer from '../components/organisms/Footer';
import Navbar from '../components/organisms/Navbar';

const Beranda = () => {
  return (
    <div>
      <Head>
        <title>REKSI PNC</title>
      </Head>

      <div className="w-full min-h-screen flex flex-col justify-between">
        <div>
          <Navbar active="beranda" />

          <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
            <div className="mb-4 lg:hidden">
              <h2 className="text-2xl font-semibold">Selamat Datang,</h2>
              <p>Berikut merupakan karya tulis ilmiah berdasarkan unggahan terbaru.</p>
            </div>

            <CardBeranda />

            <SidemenuBeranda />
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Beranda;
