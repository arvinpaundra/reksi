import Card from '../../atoms/Card';
import CardBody from '../../atoms/Card/CardBody';
import CardHeader from '../../atoms/Card/CardHeader';
import Divider from '../../atoms/Divider';

const services = [
  {
    id: 1,
    label: 'Web Perpustakaan PNC',
    link: 'https://perpustakaan.pnc.ac.id/',
  },
  {
    id: 2,
    label: 'Jam Pelayanan',
    link: 'https://perpustakaan.pnc.ac.id/jam-pelayanan/',
  },
  {
    id: 3,
    label: 'Sistem Peminjaman',
    link: 'https://perpustakaan.pnc.ac.id/sistem-peminjaman/',
  },
  {
    id: 4,
    label: 'Keanggotaan',
    link: 'https://perpustakaan.pnc.ac.id/keanggotaan-perpustakaan-pnc/',
  },
  {
    id: 5,
    label: 'Cek Plagiarisme',
    link: 'https://perpustakaan.pnc.ac.id/cek-plagiarism/',
  },
  {
    id: 6,
    label: 'Template Jurnal',
    link: 'https://perpustakaan.pnc.ac.id/wp-content/uploads/2019/08/template-jurnal-perpustakaan-PNC-2019.doc',
  },
];

const SidemenuBeranda = (props) => {
  return (
    <aside className="hidden xl:flex xl:flex-col gap-4 xl:col-span-3">
      <Card className="rounded-lg overflow-hidden">
        <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
          <h2 className="text-white text-lg md:text-xl">Layanan lainnya</h2>
        </CardHeader>

        <CardBody className="w-full bg-white flex flex-col gap-2 py-2 text-sm font-medium">
          {services?.map((item, index) => (
            <div className="flex flex-col gap-2" key={item.id}>
              <a href={item.link}>
                <div className="hover:text-orange hover:transition hover:ease-in-out hover:duration-200 py-2 p-4">
                  {item.label}
                </div>
              </a>

              {services?.length - 1 != index && <Divider />}
            </div>
          ))}
        </CardBody>
      </Card>
    </aside>
  );
};

export default SidemenuBeranda;
