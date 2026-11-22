import type { InformationElement, QuadraName, SocionicsCode } from '../types/dynamap';

export interface InformationElementSpec {
  code: InformationElement;
  name: string;
  indonesianName: string;
  dichotomy: string;
  theoreticalDefinition: string;
  mainFocus: string;
  processingManifestation: string;
  communicationApplication: string;
  potentialMisunderstanding: string;
  everydayExamples: string[];
  interpretationLimitations: string;
}

export const INFORMATION_ELEMENTS: Record<InformationElement, InformationElementSpec> = {
  Te: {
    code: 'Te',
    name: 'Extraverted Logic',
    indonesianName: 'Logika Ekstrovert (Logika Pragmatis / Faktual)',
    dichotomy: 'Dinamis · Ekstrovert · Rasional · Objektif',
    theoreticalDefinition:
      'Elemen informasi yang berfokus pada fakta objektif, efisiensi kerja, prosedur yang dapat diuji, keterukuran hasil, dan bagaimana suatu sistem atau tindakan bekerja secara nyata di dunia luar.',
    mainFocus:
      'Kegunaan praktis, keakuratan data empiris, produktivitas langkah kerja, alokasi sumber daya, serta ketercapaian target yang teramati.',
    processingManifestation:
      'Individu cenderung mengevaluasi informasi berdasarkan bukti nyata, membandingkan metode mana yang paling efektif, dan langsung mengidentifikasi hambatan operasional.',
    communicationApplication:
      'Berbicara lugas, berorientasi pada solusi atau langkah tindak lanjut, menyukai argumen yang disertai data, indikator, atau contoh hasil konkret.',
    potentialMisunderstanding:
      'Gaya bicara yang langsung dan fokus pada perbaikan efisiensi dapat disalahpahami sebagai sikap dingin, terburu-buru, atau kurang menghargai perasaan orang lain.',
    everydayExamples: [
      'Menyusun pembagian tugas kelompok beserta tenggat waktu dan indikator selesai yang jelas.',
      'Mengecek apakah suatu metode belajar benar-benar meningkatkan pemahaman saat latihan soal.',
    ],
    interpretationLimitations:
      'Preferensi Te tidak berarti seseorang selalu disiplin, menyukai semua pekerjaan administratif, atau tidak memiliki kepekaan emosional.',
  },
  Ti: {
    code: 'Ti',
    name: 'Introverted Logic',
    indonesianName: 'Logika Introvert (Logika Struktural / Konsistensi)',
    dichotomy: 'Statis · Introvert · Rasional · Struktural',
    theoreticalDefinition:
      'Elemen informasi yang berfokus pada struktur konseptual internal, konsistensi logis antarprinsip, definisi yang presisi, klasifikasi, serta hubungan sebab-akibat teoretis.',
    mainFocus:
      'Koherensi sistem berpikir, kejelasan definisi istilah, aturan dasar, dan apakah suatu pernyataan konsisten dengan kerangka logika yang dipegang.',
    processingManifestation:
      'Membedah informasi menjadi kategori atau prinsip dasar, mencari celah kontradiksi dalam argumen, serta membangun peta konsep internal sebelum menerima kesimpulan.',
    communicationApplication:
      'Menjelaskan secara runtut dari premis ke kesimpulan, meminta kejelasan definisi saat diskusi rancu, dan menguji keabsahan logika sebuah gagasan.',
    potentialMisunderstanding:
      'Kebiasaan mengkritisi inkonsistensi atau meminta definisi presisi sering disalahartikan sebagai sikap keras kepala, suka berdebat, atau terlalu teoretis.',
    everydayExamples: [
      'Menyusun rangkuman materi pelajaran dalam bentuk taksonomi atau bagan prinsip dasar.',
      'Mempertanyakan aturan penilaian tugas jika kriterianya dianggap tidak konsisten.',
    ],
    interpretationLimitations:
      'Preferensi Ti tidak menjamin seseorang selalu unggul di matematika formal atau selalu bersikap kaku dalam situasi sosial.',
  },
  Fe: {
    code: 'Fe',
    name: 'Extraverted Ethics',
    indonesianName: 'Etika Ekstrovert (Dinamika Emosional & Atmosfer Sosial)',
    dichotomy: 'Dinamis · Ekstrovert · Rasional · Ekspresif',
    theoreticalDefinition:
      'Elemen informasi yang berfokus pada atmosfer emosional bersama, ekspresi perasaan yang terlihat, resonansi antarmanusia, antusiasme, dan dampak emosional suatu ucapan terhadap suasana kelompok.',
    mainFocus:
      'Iklim emosional kolektif, keterlibatan sosial, nada bicara, ekspresi non-verbal, serta semangat atau ketegangan yang beredar dalam ruangan.',
    processingManifestation:
      'Cepat menangkap perubahan suasana hati kelompok, menyesuaikan intonasi untuk mencairkan atau menghidupkan diskusi, dan peka terhadap keterbukaan ekspresi.',
    communicationApplication:
      'Menggunakan ekspresi yang hangat atau dramatis untuk menggugah keterlibatan, menjaga moral kelompok, dan membaca apakah orang lain merasa nyaman berpartisipasi.',
    potentialMisunderstanding:
      'Ekspresivitas emosional dapat dianggap berlebihan atau manipulatif oleh orang yang lebih tenang, sementara keinginan menjaga suasana bisa disalahpahami sebagai kurang objektif.',
    everydayExamples: [
      'Membuka presentasi dengan nada yang menghidupkan perhatian audiens kelas.',
      'Merasakan bahwa diskusi kelompok mulai canggung lalu berinisiatif mencairkan suasana.',
    ],
    interpretationLimitations:
      'Preferensi Fe tidak selalu berarti seseorang ekstrovert dalam arti populer atau selalu pandai bergaul di setiap konteks.',
  },
  Fi: {
    code: 'Fi',
    name: 'Introverted Ethics',
    indonesianName: 'Etika Introvert (Relasi Personal & Nilai Batin)',
    dichotomy: 'Statis · Introvert · Rasional · Relasional',
    theoreticalDefinition:
      'Elemen informasi yang berfokus pada kedalaman nilai moral pribadi, jarak psikologis antarindividu, kesetiaan, empati personal, serta penilaian batin mengenai ketulusan dan kelayakan sikap.',
    mainFocus:
      'Kualitas ikatan satu-lawan-satu, keselarasan tindakan dengan nilai hati nurani, kepercayaan personal, dan batas kedekatan relasional.',
    processingManifestation:
      'Menilai situasi melalui lensa integritas pribadi, merasakan secara tenang apakah suatu interaksi terasa tulus atau melanggar batas moral, dan memelihara komitmen personal.',
    communicationApplication:
      'Lebih nyaman berbicara secara personal dan mendalam daripada di forum ramai; peka terhadap nada ketulusan serta menjaga etika hubungan antarteman.',
    potentialMisunderstanding:
      'Sikap tenang dan selektif dalam kedekatan dapat disalahpahami sebagai dingin, menjaga jarak, atau menghakimi secara diam-diam.',
    everydayExamples: [
      'Menghampiri teman secara pribadi setelah rapat kelas karena menyadari ia tersinggung.',
      'Menolak cara kerja kelompok yang dianggap tidak adil meski hasilnya cepat selesai.',
    ],
    interpretationLimitations:
      'Preferensi Fi tidak berarti seseorang selalu pasif, tertutup, atau tidak mampu menyampaikan kritik secara tegas.',
  },
  Se: {
    code: 'Se',
    name: 'Extraverted Sensing',
    indonesianName: 'Penginderaan Ekstrovert (Realitas Langsung & Daya Pengaruh)',
    dichotomy: 'Statis · Ekstrovert · Irasional · Mobilisasi',
    theoreticalDefinition:
      'Elemen informasi yang berfokus pada realitas fisik saat ini, ketegasan kehendak, daya dorong tindakan, kesiapan menghadapi tekanan langsung, serta pengamatan tajam atas situasi konkret.',
    mainFocus:
      'Kehadiran nyata di momen sekarang, kejelasan batas pengaruh, keberanian mengambil inisiatif langsung, dan kondisi fisik lingkungan sekitar.',
    processingManifestation:
      'Melihat situasi secara apa adanya tanpa berbelit-belit, cepat mendeteksi siapa memegang kendali atau peluang konkret yang tersedia saat itu juga.',
    communicationApplication:
      'Berbicara tegas, langsung ke inti persoalan, siap mengambil keputusan cepat saat kelompok ragu-ragu, dan menghargai ketangguhan serta kejelasan sikap.',
    potentialMisunderstanding:
      'Ketegasan dan fokus pada tindakan segera bisa terasa menekan, mendominasi, atau terlalu keras bagi rekan yang membutuhkan waktu refleksi.',
    everydayExamples: [
      'Mengambil alih koordinasi saat kelompok bingung menentukan siapa yang memulai presentasi.',
      'Mengamati detail visual dan kualitas tampilan produk proyek secara langsung.',
    ],
    interpretationLimitations:
      'Preferensi Se tidak identik dengan sikap agresif, suka berkonflik, atau tidak menyukai konsep abstrak.',
  },
  Si: {
    code: 'Si',
    name: 'Introverted Sensing',
    indonesianName: 'Penginderaan Introvert (Kenyamanan Internal & Keseimbangan Sensorik)',
    dichotomy: 'Dinamis · Introvert · Irasional · Homeostasis',
    theoreticalDefinition:
      'Elemen informasi yang berfokus pada sensasi internal tubuh, rasa nyaman, ketenangan ritme kerja, kualitas pengalaman sehari-hari, serta keselarasan lingkungan fisik dengan kondisi diri.',
    mainFocus:
      'Keseimbangan fisik dan mental, kepraktisan yang menenangkan, detail pengalaman sensorik, serta keberlanjutan ritme aktivitas tanpa kelelahan berlebih.',
    processingManifestation:
      'Memperhatikan kenyamanan suasana belajar, mengevaluasi ide baru berdasarkan apakah hal itu terasa nyaman dan dapat dijalani dengan baik dalam keseharian.',
    communicationApplication:
      'Menghadirkan nada bicara yang menenangkan, memperhatikan kesejahteraan anggota kelompok (misalnya istirahat atau beban kerja), dan memberi masukan berbasis pengalaman nyata.',
    potentialMisunderstanding:
      'Kebutuhan akan ritme yang stabil dan nyaman dapat disalahpahami sebagai kurang ambisius, lamban, atau menolak perubahan mendadak.',
    everydayExamples: [
      'Menata ruang belajar yang rapi dan nyaman agar kelompok dapat berdiskusi lebih fokus.',
      'Mengingatkan teman kelompok agar membagi jadwal pengerjaan sehingga tidak menumpuk di malam terakhir.',
    ],
    interpretationLimitations:
      'Preferensi Si tidak berarti seseorang selalu rapi dalam segala hal atau takut pada tantangan baru.',
  },
  Ne: {
    code: 'Ne',
    name: 'Extraverted Intuition',
    indonesianName: 'Intuisi Ekstrovert (Potensi, Kemungkinan & Keterkaitan Ide)',
    dichotomy: 'Statis · Ekstrovert · Irasional · Eksploratif',
    theoreticalDefinition:
      'Elemen informasi yang berfokus pada beragam kemungkinan, potensi tersembunyi suatu gagasan atau individu, pola alternatif, dan asosiasi lintas topik yang tak terduga.',
    mainFocus:
      'Alternatif baru, sudut pandang berbeda, pertanyaan "bagaimana jika", dan ruang eksplorasi sebelum keputusan dikunci.',
    processingManifestation:
      'Otak cepat melompat dari satu gagasan ke gagasan lain, melihat banyak opsi sekaligus, serta mudah menemukan analogi atau pendekatan kreatif.',
    communicationApplication:
      'Memperkaya curah pendapat (brainstorming), membuka perspektif baru saat diskusi buntu, dan antusias membahas kemungkinan yang belum dicoba.',
    potentialMisunderstanding:
      'Gaya berpikir yang bercabang dan cepat berpindah topik dapat dianggap tidak fokus, kurang realistis, atau sulit diajak menyepakati satu keputusan final.',
    everydayExamples: [
      'Mengusulkan tiga konsep alternatif untuk tugas proyek sebelum memilih satu yang paling tepat.',
      'Menghubungkan materi biologi dengan contoh fenomena sosial secara kreatif dalam diskusi.',
    ],
    interpretationLimitations:
      'Preferensi Ne tidak otomatis berarti seseorang selalu kreatif dalam seni atau selalu ceroboh terhadap detail.',
  },
  Ni: {
    code: 'Ni',
    name: 'Introverted Intuition',
    indonesianName: 'Intuisi Introvert (Alur Waktu, Esensi & Proyeksi Tren)',
    dichotomy: 'Dinamis · Introvert · Irasional · Konvergen',
    theoreticalDefinition:
      'Elemen informasi yang berfokus pada perkembangan proses dari waktu ke waktu, arah kecenderungan masa depan, makna mendasar di balik peristiwa, serta konsekuensi jangka panjang.',
    mainFocus:
      'Kesinambungan waktu, pola besar yang menyatukan berbagai kejadian, momentum yang tepat, dan antisipasi dampak ke depan.',
    processingManifestation:
      'Merenungkan bagaimana situasi sekarang terbentuk dari masa lalu dan ke mana arahnya nanti, lalu menyaring inti makna dari detail yang tampak tersebar.',
    communicationApplication:
      'Mengajak kelompok melihat gambaran jangka panjang, memperingatkan potensi risiko sebelum terjadi, atau menyimpulkan benang merah dari diskusi panjang.',
    potentialMisunderstanding:
      'Kecenderungan berbicara secara simbolis, fokus pada antisipasi, atau lambat bertindak di situasi mendadak bisa dianggap terlalu abstrak, pesimis, atau pasif.',
    everydayExamples: [
      'Memperkirakan bahwa penundaan di minggu pertama akan membuat minggu ujian terlalu padat.',
      'Menyaring puluhan halaman bacaan menjadi satu tema sentral untuk esai.',
    ],
    interpretationLimitations:
      'Preferensi Ni bukanlah kemampuan meramal secara mistis, melainkan pola perhatian terhadap kecenderungan dan kesinambungan waktu.',
  },
};

export interface ModelABlockSpec {
  id: 'Ego' | 'Super-Ego' | 'Super-Id' | 'Id';
  name: string;
  indonesianLabel: string;
  nature: string;
  description: string;
  positions: number[];
}

export const MODEL_A_BLOCKS: ModelABlockSpec[] = [
  {
    id: 'Ego',
    name: 'Ego Block',
    indonesianLabel: 'Blok Ego (Kesadaran & Arah Utama)',
    nature: 'Disadari · Kuat · Bernilai (Valued)',
    description:
      'Inti kesadaran dan cara paling alami individu memandang dunia, mengambil keputusan utama, serta berkontribusi kepada orang lain dengan rasa percaya diri.',
    positions: [1, 2],
  },
  {
    id: 'Super-Ego',
    name: 'Super-Ego Block',
    indonesianLabel: 'Blok Super-Ego (Norma Sosial & Area Rentan)',
    nature: 'Disadari · Lemah · Kurang Bernilai (Subdued)',
    description:
      'Area yang dipahami sebagai tuntutan sosial atau standar luar, tetapi membutuhkan energi besar untuk dijalankan dan sensitif terhadap kritik langsung.',
    positions: [3, 4],
  },
  {
    id: 'Super-Id',
    name: 'Super-Id Block',
    indonesianLabel: 'Blok Super-Id (Kebutuhan Dukungan & Motivasi)',
    nature: 'Kurang Disadari (Vital) · Lemah · Bernilai (Valued)',
    description:
      'Area tempat seseorang menghargai dan merespons positif masukan dari lingkungan karena merasa terbantu, terinspirasi, atau terlengkapi.',
    positions: [5, 6],
  },
  {
    id: 'Id',
    name: 'Id Block',
    indonesianLabel: 'Blok Id (Kapasitas Otomatis & Latar Belakang)',
    nature: 'Kurang Disadari (Vital) · Kuat · Kurang Bernilai (Subdued)',
    description:
      'Fungsi yang sebenarnya dikuasai dengan baik secara otomatis, tetapi tidak dijadikan fokus utama atau ekspresi identitas sadar dalam interaksi.',
    positions: [7, 8],
  },
];

export interface ModelAPositionSpec {
  position: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  name: string;
  indonesianName: string;
  block: 'Ego' | 'Super-Ego' | 'Super-Id' | 'Id';
  dimensionality: string;
  theoreticalRole: string;
  informationProcessingFunction: string;
  relativeStructurePosition: string;
  interpersonalImplications: string;
  distinctionFromOthers: string;
}

export const MODEL_A_POSITIONS: ModelAPositionSpec[] = [
  {
    position: 1,
    name: 'Leading',
    indonesianName: '1. Leading (Program)',
    block: 'Ego',
    dimensionality: '4D · Kuat · Inert · Mental · Valued',
    theoreticalRole:
      'Menjadi lensa utama dalam menafsirkan realitas dan menetapkan tujuan jangka panjang atau prinsip dasar tindakan.',
    informationProcessingFunction:
      'Memproses informasi secara mendalam, mandiri, dan konstan; hampir segala situasi terlebih dahulu diterjemahkan melalui elemen ini.',
    relativeStructurePosition:
      'Posisi puncak di Blok Ego yang menjadi titik awal seluruh orientasi tipe.',
    interpersonalImplications:
      'Individu tampak konsisten dan tegas di ranah ini, tetapi terkadang menganggap sudut pandang elemen ini sebagai hal yang "seharusnya jelas bagi semua orang".',
    distinctionFromOthers:
      'Berbeda dari Creative (2) yang bersifat situasional dan fleksibel, Leading bersifat konstan dan lebih sulit berkompromi soal prinsip dasarnya.',
  },
  {
    position: 2,
    name: 'Creative',
    indonesianName: '2. Creative (Implementasi)',
    block: 'Ego',
    dimensionality: '3D · Kuat · Kontak · Mental · Valued',
    theoreticalRole:
      'Menjadi alat fleksibel untuk mewujudkan tujuan posisi Leading sesuai situasi nyata dan kebutuhan lawan bicara.',
    informationProcessingFunction:
      'Mengolah informasi secara adaptif dan taktis; mudah menyalakan atau menyesuaikan pendekatannya sesuai konteks.',
    relativeStructurePosition:
      'Posisi kedua di Blok Ego yang menjembatani prinsip Leading dengan interaksi eksternal.',
    interpersonalImplications:
      'Sering menjadi kekuatan paling terasa dalam diskusi karena aktif dipakai untuk berkomunikasi, membantu, atau membujuk.',
    distinctionFromOthers:
      'Lebih luwes daripada Leading (1) dan jauh lebih disadari daripada Demonstrative (8).',
  },
  {
    position: 3,
    name: 'Role',
    indonesianName: '3. Role (Peran Sosial)',
    block: 'Super-Ego',
    dimensionality: '2D · Lemah · Kontak · Mental · Subdued',
    theoreticalRole:
      'Cara adaptasi awal untuk memenuhi norma kesopanan atau kesan pertama, namun cepat melelahkan bila dipaksakan terus-menerus.',
    informationProcessingFunction:
      'Mengandalkan norma dan aturan yang pernah dipelajari daripada keluwesan situasional yang mendalam.',
    relativeStructurePosition:
      'Posisi pertama di Blok Super-Ego yang berhadapan langsung dengan ekspektasi awal lingkungan.',
    interpersonalImplications:
      'Orang lain mungkin mengira posisi ini adalah kekuatan utama pada pertemuan pertama, padahal individu lebih suka kembali ke Blok Ego-nya.',
    distinctionFromOthers:
      'Berbeda dengan Leading (1) yang terasa alami tanpa beban, Role mudah memicu rasa lelah jika terus dituntut.',
  },
  {
    position: 4,
    name: 'PoLR',
    indonesianName: '4. Vulnerable / PoLR (Titik Peka)',
    block: 'Super-Ego',
    dimensionality: '1D · Paling Lemah · Inert · Mental · Subdued',
    theoreticalRole:
      'Area yang paling kurang memiliki keluwesan informasi dan terasa membebani jika terus dievaluasi atau ditekan secara terbuka.',
    informationProcessingFunction:
      'Bergantung hampir sepenuhnya pada pengalaman pribadi langsung; sulit menyaring mana tuntutan yang wajar dan mana yang berlebihan.',
    relativeStructurePosition:
      'Posisi kedua di Blok Super-Ego yang berseberangan dengan kekuatan utama Blok Ego.',
    interpersonalImplications:
      'Kritik tajam atau tuntutan tinggi pada elemen ini mudah memicu sikap defensif, canggung, atau menarik diri.',
    distinctionFromOthers:
      'Berbeda dari Suggestive (5) yang sama-sama lemah (1D) namun disambut baik bila dibantu, PoLR cenderung ingin dihindari tekanannya dan tidak dijadikan ukuran utama.',
  },
  {
    position: 5,
    name: 'Suggestive',
    indonesianName: '5. Suggestive (Dual-Seeking)',
    block: 'Super-Id',
    dimensionality: '1D · Lemah · Kontak · Vital · Valued',
    theoreticalRole:
      'Area tempat individu secara alami membutuhkan perspektif, ketenangan, atau masukan dari orang lain untuk merasa utuh.',
    informationProcessingFunction:
      'Menerima informasi dengan terbuka tanpa filter rumit apabila disampaikan dengan tenang dan mendukung, bukan menggurui.',
    relativeStructurePosition:
      'Posisi pertama di Blok Super-Id yang melengkapi posisi Leading milik tipe Dual-nya.',
    interpersonalImplications:
      'Dukungan tulus di elemen ini membangun kepercayaan cepat, sedangkan ketidakhadiran elemen ini dalam jangka panjang bisa membuat individu merasa buntu.',
    distinctionFromOthers:
      'Sama-sama 1D seperti PoLR (4), tetapi Suggestive terasa menyegarkan dan bernilai saat hadir, bukan mengancam.',
  },
  {
    position: 6,
    name: 'Mobilizing',
    indonesianName: '6. Mobilizing (Aktivasi)',
    block: 'Super-Id',
    dimensionality: '2D · Lemah · Inert · Vital · Valued',
    theoreticalRole:
      'Pemicu semangat dan rasa mampu saat mendapat dorongan positif, meski kapasitasnya tetap perlu dijaga agar tidak berlebihan.',
    informationProcessingFunction:
      'Mengikuti norma yang dipelajari dan antusias berlatih di ranah ini, tetapi belum sekuat fungsi Blok Ego atau Id.',
    relativeStructurePosition:
      'Posisi kedua di Blok Super-Id yang berpasangan dengan Creative milik tipe Dual-nya.',
    interpersonalImplications:
      'Apresiasi kecil di ranah ini sering sangat memotivasi siswa, namun ekspektasi berlebihan tetap dapat membuat mereka kewalahan.',
    distinctionFromOthers:
      'Lebih aktif dikejar sendiri daripada Suggestive (5), namun lebih sensitif terhadap kelelahan daripada Creative (2).',
  },
  {
    position: 7,
    name: 'Ignoring',
    indonesianName: '7. Ignoring (Pengamat)',
    block: 'Id',
    dimensionality: '3D · Kuat · Kontak · Vital · Subdued',
    theoreticalRole:
      'Kapasitas tinggi pada orientasi lawan dari fungsi Leading; dipahami dengan baik tetapi dianggap kurang relevan atau membatasi tujuan utama.',
    informationProcessingFunction:
      'Mampu menganalisis dan membantu orang lain sesekali di ranah ini, namun enggan menjadikannya standar utama.',
    relativeStructurePosition:
      'Posisi pertama di Blok Id yang berjalan diam-diam di latar belakang.',
    interpersonalImplications:
      'Jika orang lain terus-menerus memaksakan sudut pandang elemen ini, individu dapat merasa bosan atau terkekang.',
    distinctionFromOthers:
      'Sama kuatnya (3D) dengan Creative (2), tetapi tidak diprioritaskan secara nilai.',
  },
  {
    position: 8,
    name: 'Demonstrative',
    indonesianName: '8. Demonstrative (Pendukung Latar)',
    block: 'Id',
    dimensionality: '4D · Kuat · Inert · Vital · Subdued',
    theoreticalRole:
      'Kemampuan alami yang bekerja otomatis untuk melindungi Blok Ego dan membantu situasi praktis tanpa perlu banyak sorotan.',
    informationProcessingFunction:
      'Dipakai secara spontan dan konsisten di latar belakang, sering kali tanpa dianggap sebagai keahlian istimewa oleh pemiliknya.',
    relativeStructurePosition:
      'Posisi kedelapan di Blok Id yang memiliki dimensi kekuatan setara Leading namun berada pada ranah Vital.',
    interpersonalImplications:
      'Sering tampak nyata dalam tindakan sehari-hari dan membantu orang lain merasa aman tanpa banyak drama.',
    distinctionFromOthers:
      'Setara kuatnya (4D) dengan Leading (1), tetapi tidak diucapkan sebagai fokus utama identitas diri.',
  },
];

export interface SocionicsPositionDetail {
  position: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  positionName: string;
  block: 'Ego' | 'Super-Ego' | 'Super-Id' | 'Id';
  element: InformationElement;
  explanation: string;
}

export interface SocionicsTypeSpec {
  code: SocionicsCode;
  fullName: string;
  indonesianTitle: string;
  quadra: QuadraName;
  club: string;
  temperament: string;
  summary: string;
  modelA: [
    InformationElement,
    InformationElement,
    InformationElement,
    InformationElement,
    InformationElement,
    InformationElement,
    InformationElement,
    InformationElement,
  ];
  theoreticalStrengths: string[];
  theoreticalLimitations: string[];
  communicationPreferences: string[];
  interpersonalImplications: string[];
  learningApproaches: {
    abstractMaterial: string;
    organizingInfo: string;
    practicalExamples: string;
    problemSolving: string;
    reviewing: string;
    managingAssignments: string;
    discussions: string;
    presentations: string;
    groupWork: string;
  };
}

const POSITION_TEMPLATES: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, (el: InformationElementSpec, typeCode: SocionicsCode) => string> = {
  1: (el, t) =>
    `Sebagai Leading pada tipe ${t}, ${el.code} (${el.indonesianName}) menjadi pusat orientasi utama. Fokus perhatian otomatis tertuju pada ${el.mainFocus.toLowerCase()} sehingga sudut pandang ini memandu keputusan inti.`,
  2: (el, t) =>
    `Sebagai Creative pada tipe ${t}, ${el.code} (${el.indonesianName}) berperan sebagai instrumen fleksibel untuk mewujudkan arah Leading. Dalam interaksi, ${el.code} digunakan secara adaptif sesuai konteks lawan bicara.`,
  3: (el, t) =>
    `Sebagai Role pada tipe ${t}, ${el.code} (${el.indonesianName}) muncul pada adaptasi awal atau saat memenuhi norma sosial tertentu. Pemakaiannya bersifat situasional dan menguras energi jika dituntut terus-menerus.`,
  4: (el, t) =>
    `Sebagai Vulnerable / PoLR pada tipe ${t}, ${el.code} (${el.indonesianName}) merupakan area yang paling peka terhadap tekanan eksternal. Tuntutan atau kritik tajam terkait ${el.mainFocus.toLowerCase()} berisiko memicu kelelahan atau sikap defensif.`,
  5: (el, t) =>
    `Sebagai Suggestive pada tipe ${t}, ${el.code} (${el.indonesianName}) adalah kebutuhan dukungan yang diterima dengan sangat terbuka ketika hadir secara tenang dan tidak menggurui. Perspektif ${el.code} membantu menyeimbangkan orientasi Ego.`,
  6: (el, t) =>
    `Sebagai Mobilizing pada tipe ${t}, ${el.code} (${el.indonesianName}) berfungsi sebagai pemicu motivasi dan semangat belajar. Umpan balik positif pada ranah ini mendorong antusiasme, selama bebannya tetap proporsional.`,
  7: (el, t) =>
    `Sebagai Ignoring pada tipe ${t}, ${el.code} (${el.indonesianName}) sebenarnya dipahami secara kompeten, tetapi jarang dipilih sebagai fokus utama karena dianggap menghambat atau membatasi prioritas fungsi Leading.`,
  8: (el, t) =>
    `Sebagai Demonstrative pada tipe ${t}, ${el.code} (${el.indonesianName}) bekerja secara otomatis dan konsisten di latar belakang untuk menunjang aktivitas nyata tanpa perlu banyak dibicarakan.`,
};

export function getTypeModelADetails(code: SocionicsCode): SocionicsPositionDetail[] {
  const spec = SOCIONICS_TYPES[code];
  return MODEL_A_POSITIONS.map((posSpec, idx) => {
    const el = spec.modelA[idx];
    const elSpec = INFORMATION_ELEMENTS[el];
    return {
      position: posSpec.position,
      positionName: posSpec.name,
      block: posSpec.block,
      element: el,
      explanation: POSITION_TEMPLATES[posSpec.position](elSpec, code),
    };
  });
}

export const SOCIONICS_TYPES: Record<SocionicsCode, SocionicsTypeSpec> = {
  // ================= ALPHA =================
  ILE: {
    code: 'ILE',
    fullName: 'Intuitive-Logical Extravert',
    indonesianTitle: 'Eksplorator Konseptual & Kemungkinan (ENTp)',
    quadra: 'Alpha',
    club: 'Researchers (NT)',
    temperament: 'Extraverted Irrational (EP)',
    summary:
      'Memadukan eksplorasi kemungkinan baru (Ne) dengan analisis kerangka logika struktural (Ti). Tertarik pada ide lintas bidang, eksperimen konsep, dan diskusi terbuka.',
    modelA: ['Ne', 'Ti', 'Se', 'Fi', 'Si', 'Fe', 'Ni', 'Te'],
    theoreticalStrengths: [
      'Cepat melihat banyak alternatif solusi dan pola keterhubungan antarkonsep.',
      'Mampu merumuskan struktur logis secara fleksibel untuk menjelaskan gagasan baru.',
      'Terbuka terhadap sudut pandang segar dalam pemecahan masalah kelompok.',
    ],
    theoreticalLimitations: [
      'Rentan berpindah minat sebelum eksekusi detail atau tindak lanjut rutin selesai.',
      'Kurang peka terhadap nuansa jarak relasional personal (Fi PoLR) ketika berargumen secara objektif.',
      'Dapat mengalami kesulitan menjaga kenyamanan ritme fisik harian jika terlalu larut dalam ide.',
    ],
    communicationPreferences: [
      'Menyukai diskusi eksploratif, pertukaran ide bebas, dan pertanyaan terbuka.',
      'Menghargai kejelasan definisi logis tanpa aturan birokratis yang kaku.',
    ],
    interpersonalImplications: [
      'Dalam diskusi kelas, sering memicu ide baru tetapi bisa dianggap terlalu cepat melompat topik.',
      'Perlu kehati-hatian agar kritik intelektual tidak ditafsirkan sebagai penolakan personal.',
    ],
    learningApproaches: {
      abstractMaterial: 'Memetakan keterkaitan antarkonsep dan menguji variasi skenario "bagaimana jika".',
      organizingInfo: 'Menggunakan peta konsep (mind map) bercabang sebelum merapikannya menjadi poin ringkas.',
      practicalExamples: 'Menghubungkan teori dengan eksperimen mini atau studi kasus tak terduga.',
      problemSolving: 'Mengumpulkan beberapa pendekatan alternatif lalu menyaring yang paling konsisten secara logis.',
      reviewing: 'Mengajar balik atau berdiskusi lisan untuk menguji pemahaman prinsip dasar.',
      managingAssignments: 'Membagi proyek besar menjadi tonggak singkat dengan variasi tugas agar tidak jenuh.',
      discussions: 'Aktif melontarkan gagasan dan menghubungkan argumen teman yang tampak terpisah.',
      presentations: 'Menyiapkan struktur alur utama yang jelas agar antusiasme ide tetap mudah diikuti audiens.',
      groupWork: 'Cocok menjadi perumus konsep awal yang bermitra dengan anggota yang kuat di tindak lanjut.',
    },
  },
  SEI: {
    code: 'SEI',
    fullName: 'Sensing-Ethical Introvert',
    indonesianTitle: 'Penjaga Harmoni Sensorik & Atmosfer (ISFp)',
    quadra: 'Alpha',
    club: 'Socials (SF)',
    temperament: 'Introverted Irrational (IP)',
    summary:
      'Mengutamakan keseimbangan pengalaman nyata dan kenyamanan (Si) disertai kepekaan terhadap suasana emosional kelompok (Fe). Menghargai interaksi hangat dan ritme kerja yang manusiawi.',
    modelA: ['Si', 'Fe', 'Ni', 'Te', 'Ne', 'Ti', 'Se', 'Fi'],
    theoreticalStrengths: [
      'Mampu menciptakan suasana kerja kelompok yang tenang, ramah, dan inklusif.',
      'Peka terhadap kelelahan, kenyamanan, serta pengalaman konkret anggota kelompok.',
      'Fleksibel dalam mencairkan ketegangan melalui pendekatan emosional yang hangat.',
    ],
    theoreticalLimitations: [
      'Rentan merasa tertekan oleh tuntutan efisiensi prosedural atau target kuantitatif yang kaku (Te PoLR).',
      'Terkadang menunda keputusan sulit demi menjaga keharmonisan suasana.',
      'Memerlukan kejelasan struktur atau ide pemicu agar langkah kerja tidak mengambang.',
    ],
    communicationPreferences: [
      'Menyukai komunikasi hangat, tidak agresif, dan menghargai pengalaman pribadi.',
      'Lebih responsif pada ajakan kolaborasi yang menenangkan daripada perintah mendadak.',
    ],
    interpersonalImplications: [
      'Menjadi penyeimbang suasana di kelas, tetapi dapat merasa terkuras jika terus diminta mengejar target tanpa jeda.',
      'Perbedaan gaya dengan rekan berorientasi Te dapat dijembatani dengan membagi peran kenyamanan proses dan kejelasan target.',
    ],
    learningApproaches: {
      abstractMaterial: 'Mengaitkan konsep abstrak dengan pengalaman nyata atau analogi sehari-hari yang akrab.',
      organizingInfo: 'Menyusun catatan yang rapi, bersih secara visual, dan nyaman dibaca ulang.',
      practicalExamples: 'Belajar melalui demonstrasi langsung dan contoh kontekstual yang bertahap.',
      problemSolving: 'Menelusuri langkah demi langkah dengan suasana belajar yang tenang tanpa tekanan panik.',
      reviewing: 'Mengulang materi dalam sesi santai yang terjadwal teratur.',
      managingAssignments: 'Menetapkan ruang kerja nyaman dan mencicil tugas agar terhindar dari beban mendadak.',
      discussions: 'Berperan menjaga dialog tetap santun serta membantu anggota pendiam ikut bersuara.',
      presentations: 'Menggunakan alur bertahap dan contoh visual yang mudah dicerna pendengar.',
      groupWork: 'Membantu koordinasi kesejahteraan tim dan memastikan pembagian beban tidak timpang.',
    },
  },
  ESE: {
    code: 'ESE',
    fullName: 'Ethical-Sensing Extravert',
    indonesianTitle: 'Penggerak Antusiasme & Kebersamaan (ESFj)',
    quadra: 'Alpha',
    club: 'Socials (SF)',
    temperament: 'Extraverted Rational (EJ)',
    summary:
      'Menghidupkan atmosfer emosional bersama (Fe) dan menopangnya melalui perhatian praktis pada kenyamanan serta kebutuhan nyata (Si). Aktif membangun keterlibatan sosial.',
    modelA: ['Fe', 'Si', 'Te', 'Ni', 'Ti', 'Ne', 'Fi', 'Se'],
    theoreticalStrengths: [
      'Cepat menggerakkan semangat kelompok dan mengajak anggota merasa dilibatkan.',
      'Menggabungkan kehangatan ekspresif dengan kepedulian praktis terhadap situasi sekitar.',
      'Konsisten menjaga kelancaran interaksi sosial dalam aktivitas kelas.',
    ],
    theoreticalLimitations: [
      'Dapat merasa cemas terhadap ketidakpastian jangka panjang atau jadwal yang terus berubah (Ni PoLR).',
      'Berisiko mengambil terlalu banyak tanggung jawab sosial hingga mengabaikan prioritas pribadi.',
      'Cenderung mengutamakan respons emosional langsung sebelum menganalisis akar konseptual.',
    ],
    communicationPreferences: [
      'Menyukai komunikasi ekspresif, responsif, dan saling menyemangati.',
      'Menghargai kejelasan kapan sesuatu terjadi agar tidak timbul ketidakpastian.',
    ],
    interpersonalImplications: [
      'Mudah menjadi penghubung antarteman, namun perlu ruang untuk rekan yang lebih pendiam atau lambat berekspresi.',
      'Kritik tanpa kehangatan nada bicara berpotensi terasa sangat personal.',
    ],
    learningApproaches: {
      abstractMaterial: 'Mendiskusikan makna konsep bersama teman agar materi terasa hidup.',
      organizingInfo: 'Mengelompokkan materi dalam daftar terstruktur dengan contoh penerapan nyata.',
      practicalExamples: 'Menggunakan studi kasus interaksi manusia atau aktivitas simulasi.',
      problemSolving: 'Berdiskusi secara aktif dan mengecek apakah setiap langkah masuk akal secara praktis.',
      reviewing: 'Belajar kelompok dengan sesi tanya jawab singkat yang interaktif.',
      managingAssignments: 'Menetapkan jadwal pasti sejak awal untuk menghindari kecemasan menjelang tenggat.',
      discussions: 'Mendorong partisipasi aktif dan meringkas suasana kesepakatan kelompok.',
      presentations: 'Menonjolkan penyampaian yang komunikatif, jelas, dan melibatkan audiens.',
      groupWork: 'Efektif membangun semangat tim ketika berpasangan dengan perencana struktur jangka panjang.',
    },
  },
  LII: {
    code: 'LII',
    fullName: 'Logical-Intuitive Introvert',
    indonesianTitle: 'Arsitek Sistem Logis & Konseptual (INTj)',
    quadra: 'Alpha',
    club: 'Researchers (NT)',
    temperament: 'Introverted Rational (IJ)',
    summary:
      'Membangun kerangka logika yang konsisten dan terpadu (Ti) sambil mengeksplorasi kemungkinan teoretis serta alternatif makna (Ne). Mengutamakan kejelasan prinsip dan keadilan konseptual.',
    modelA: ['Ti', 'Ne', 'Fi', 'Se', 'Fe', 'Si', 'Te', 'Ni'],
    theoreticalStrengths: [
      'Mampu merapikan gagasan kompleks menjadi sistem prinsip yang jernih dan konsisten.',
      'Objektif dalam mengevaluasi argumen serta terbuka terhadap alternatif ide yang masuk akal.',
      'Tenang dalam menganalisis persoalan teoretis maupun struktur tugas.',
    ],
    theoreticalLimitations: [
      'Kurang nyaman dengan tekanan konfrontasi langsung atau desakan tindakan fisik mendadak (Se PoLR).',
      'Terlalu lama menyempurnakan kerangka konseptual sebelum melangkah ke eksekusi.',
      'Terkadang tampak datar secara emosional meski sebenarnya berniat kooperatif.',
    ],
    communicationPreferences: [
      'Menyukai penjelasan runtut, jujur secara intelektual, dan tidak memaksakan kehendak secara keras.',
      'Terbantu oleh suasana diskusi yang ramah namun tetap fokus pada substansi.',
    ],
    interpersonalImplications: [
      'Memerlukan mitra yang tidak mengintimidasi secara langsung agar mau membuka gagasan secara penuh.',
      'Ketelitian pada konsistensi aturan bisa dianggap kaku jika tidak disertai penjelasan tujuannya.',
    ],
    learningApproaches: {
      abstractMaterial: 'Membangun struktur konsep dari prinsip inti lalu menurunkan sub-topiknya.',
      organizingInfo: 'Membuat ringkasan sistematis berupa tabel perbandingan, bagan definisi, atau alur logika.',
      practicalExamples: 'Memahami aturan umum terlebih dahulu sebelum mengujinya pada variasi soal.',
      problemSolving: 'Mengidentifikasi variabel inti dan memeriksa asumsi tersembunyi di balik soal.',
      reviewing: 'Menguji diri dengan membuat soal variasi atau merumuskan ulang definisi dengan kata sendiri.',
      managingAssignments: 'Memulai riset konsep lebih awal dengan target bertahap yang tenang.',
      discussions: 'Menyumbangkan klarifikasi definisi dan menguji konsistensi gagasan kelompok.',
      presentations: 'Menyusun slide dengan alur argumen yang rapi dan minim hiasan berlebihan.',
      groupWork: 'Cocok menangani penyusunan kerangka analisis, metodologi, atau pemeriksaan logika laporan.',
    },
  },

  // ================= BETA =================
  EIE: {
    code: 'EIE',
    fullName: 'Ethical-Intuitive Extravert',
    indonesianTitle: 'Komunikator Visioner & Dinamika Makna (ENFj)',
    quadra: 'Beta',
    club: 'Humanitarians (NF)',
    temperament: 'Extraverted Rational (EJ)',
    summary:
      'Menggerakkan ekspresi emosional dan nilai kolektif (Fe) yang diarahkan oleh pemahaman alur waktu, visi, dan makna peristiwa (Ni). Pemetaan Model A EIE dipertahankan persis sesuai acuan proyek.',
    modelA: ['Fe', 'Ni', 'Te', 'Si', 'Ti', 'Se', 'Fi', 'Ne'],
    theoreticalStrengths: [
      'Mampu menyampaikan gagasan secara menggugah sehingga orang lain memahami relevansi maknanya.',
      'Peka terhadap kecenderungan jangka panjang serta momentum perubahan suasana kelompok.',
      'Cakap memimpin diskusi bertema nilai, narasi, dan tujuan bersama.',
    ],
    theoreticalLimitations: [
      'Rentan mengabaikan sinyal kelelahan fisik atau detail kenyamanan sehari-hari (Si PoLR).',
      'Dapat membesar-besarkan urgensi emosional ketika melihat potensi risiko di masa depan.',
      'Membutuhkan kerangka logis yang teratur (Ti Suggestive) agar narasi tidak terasa meluas tanpa batas.',
    ],
    communicationPreferences: [
      'Menyukai percakapan bermakna tentang visi, tujuan, dan dampak manusiawi dari suatu keputusan.',
      'Menghargai kejelasan struktur argumen yang disampaikan tanpa meremehkan semangat.',
    ],
    interpersonalImplications: [
      'Ekspresi yang intens dapat menginspirasi sebagian teman, tetapi terasa terlalu berat bagi tipe yang menyukai nada datar.',
      'Perlu pengingat berkala agar menjaga istirahat dan keseimbangan teknis pelaksanaan.',
    ],
    learningApproaches: {
      abstractMaterial: 'Mencari tema besar, narasi historis, atau dampak jangka panjang dari materi yang dipelajari.',
      organizingInfo: 'Menyusun alur cerita konseptual sebelum mengisi detail teknis.',
      practicalExamples: 'Mengaitkan materi dengan dilema sosial, studi kasus tokoh, atau simulasi peran.',
      problemSolving: 'Membahas konteks besar terlebih dahulu lalu meminta bantuan struktur langkah yang terukur.',
      reviewing: 'Menjelaskan ulang materi seolah-olah sedang mempresentasikannya di depan kelas.',
      managingAssignments: 'Menetapkan tenggat antara agar tidak kehabisan tenaga di akhir waktu.',
      discussions: 'Menghubungkan suara kelompok dengan tujuan bersama dan membaca dinamika emosi.',
      presentations: 'Kekuatan alami dalam penyampaian retorika, penekanan makna, dan alur klimaks materi.',
      groupWork: 'Efektif sebagai penyampai pesan atau penghubung visi ketika didukung oleh perapih struktur dan detail.',
    },
  },
  LSI: {
    code: 'LSI',
    fullName: 'Logical-Sensing Introvert',
    indonesianTitle: 'Penata Sistem Disiplin & Ketepatan (ISTj)',
    quadra: 'Beta',
    club: 'Pragmatists / Inspectors (ST)',
    temperament: 'Introverted Rational (IJ)',
    summary:
      'Memadukan ketelitian sistem aturan dan konsistensi logika (Ti) dengan kesadaran realitas langsung serta ketegasan pelaksanaan (Se). Mengutamakan kejelasan peran dan keandalan prosedur.',
    modelA: ['Ti', 'Se', 'Fi', 'Ne', 'Fe', 'Ni', 'Te', 'Si'],
    theoreticalStrengths: [
      'Konsisten menjaga standar kerja, aturan main, dan ketertiban pelaksanaan tugas.',
      'Mampu bertindak tegas di situasi nyata untuk memastikan rencana tidak berhenti di wacana.',
      'Cermat mendeteksi ketidaksesuaian prosedur maupun rincian teknis.',
    ],
    theoreticalLimitations: [
      'Kurang nyaman menghadapi perubahan mendadak atau terlalu banyak opsi spekulatif tanpa kejelasan (Ne PoLR).',
      'Sikap tegas dan fokus pada aturan dapat terlihat kaku atau terlalu mengontrol.',
      'Dapat merasa canggung jika suasana kelompok terlalu dingin tanpa kejelasan ekspresi kebersamaan (Fe Suggestive).',
    ],
    communicationPreferences: [
      'Menyukai instruksi yang jelas, pasti, jujur, dan tidak berubah-ubah di tengah jalan.',
      'Terbantu oleh suasana kelompok yang hangat namun tetap menghormati komitmen waktu.',
    ],
    interpersonalImplications: [
      'Sangat dapat diandalkan dalam menjaga keteraturan proyek, tetapi berpotensi berselisih dengan tipe eksploratif jika tidak ada kesepakatan ruang eksperimen.',
      'Penting membedakan antara "aturan membantu kerja tim" dengan "keinginan semua harus persis sama".',
    ],
    learningApproaches: {
      abstractMaterial: 'Memecah teori menjadi aturan main, langkah terurut, dan definisi tegas.',
      organizingInfo: 'Membuat daftar periksa, tabel terklasifikasi, dan catatan terstruktur berhierarki.',
      practicalExamples: 'Menguasai satu pola contoh standar lalu mengulang latihan dengan tingkat kesulitan meningkat.',
      problemSolving: 'Mengikuti algoritma atau prosedur terverifikasi secara disiplin.',
      reviewing: 'Mengerjakan latihan soal terstruktur dan mengevaluasi kesalahan per langkah.',
      managingAssignments: 'Menyusun jadwal tetap dengan pembagian peran jelas sejak hari pertama.',
      discussions: 'Membantu menjaga fokus agar diskusi tidak keluar dari topik dan kesepakatan awal.',
      presentations: 'Menyampaikan poin secara runtut, tegas, dan berpegang pada data yang diverifikasi.',
      groupWork: 'Andal dalam eksekusi terstruktur dan pengawasan kualitas dokumen atau ketepatan tenggat.',
    },
  },
  SLE: {
    code: 'SLE',
    fullName: 'Sensing-Logical Extravert',
    indonesianTitle: 'Penggerak Taktis & Pengambil Keputusan Cepat (ESTp)',
    quadra: 'Beta',
    club: 'Pragmatists / Conquerors (ST)',
    temperament: 'Extraverted Irrational (EP)',
    summary:
      'Mengandalkan kepekaan tajam terhadap situasi konkret dan daya dorong tindakan (Se) yang ditopang logika taktis serta pemetaan struktur kekuatan situasi (Ti).',
    modelA: ['Se', 'Ti', 'Ne', 'Fi', 'Ni', 'Fe', 'Si', 'Te'],
    theoreticalStrengths: [
      'Berani mengambil keputusan cepat di tengah situasi buntu atau mendesak.',
      'Melihat peluang konkret secara realistis dan mampu memobilisasi langkah tim.',
      'Tegas dalam menegosiasikan batas dan pembagian wewenang.',
    ],
    theoreticalLimitations: [
      'Rentan kurang memperhatikan nuansa kedekatan emosional pribadi atau perasaan tersinggung diam-diam (Fi PoLR).',
      'Cenderung langsung bertindak sebelum mempertimbangkan implikasi jangka panjang (Ni Suggestive).',
      'Gaya bicara yang terlalu lugas dan menantang bisa terasa mengintimidasi rekan yang sensitif.',
    ],
    communicationPreferences: [
      'Menyukai komunikasi langsung, tanpa basa-basi berbelit, dan jelas tujuannya.',
      'Menghargai keberanian menyatakan pendapat secara terbuka daripada sindiran terselubung.',
    ],
    interpersonalImplications: [
      'Efektif memecah kebuntuan kelompok, namun perlu memastikan anggota lain tidak sekadar diam karena segan.',
      'Klarifikasi niat membantu mencegah kesan bahwa ketegasan adalah serangan personal.',
    ],
    learningApproaches: {
      abstractMaterial: 'Menantang konsep dengan pertanyaan "apa dampaknya di dunia nyata dan bagaimana mekanismenya?".',
      organizingInfo: 'Menyusun ringkasan taktis berupa poin aksi dan struktur kunci.',
      practicalExamples: 'Belajar melalui simulasi kasus nyata, kompetisi sehat, atau praktik langsung.',
      problemSolving: 'Langsung mencoba memecahkan inti masalah lalu mengoreksi strategi berdasarkan hasil.',
      reviewing: 'Menguji kecepatan dan ketepatan jawaban dalam simulasi berbatas waktu.',
      managingAssignments: 'Menetapkan tantangan konkret dan target pendek yang memacu fokus.',
      discussions: 'Mendorong kelompok cepat beralih dari wacana panjang ke keputusan aksi.',
      presentations: 'Tampil percaya diri dan tegas dengan fokus pada poin dampak utama.',
      groupWork: 'Cocok memimpin koordinasi lapangan atau pengambilan keputusan saat tenggat mepet.',
    },
  },
  IEI: {
    code: 'IEI',
    fullName: 'Intuitive-Ethical Introvert',
    indonesianTitle: 'Pengamat Alur Makna & Nuansa Batin (INFp)',
    quadra: 'Beta',
    club: 'Humanitarians (NF)',
    temperament: 'Introverted Irrational (IP)',
    summary:
      'Memadukan kepekaan terhadap alur perkembangan waktu, simbol, dan makna batin (Ni) dengan kemampuan menyesuaikan ekspresi emosional serta empati sosial (Fe).',
    modelA: ['Ni', 'Fe', 'Si', 'Te', 'Se', 'Ti', 'Ne', 'Fi'],
    theoreticalStrengths: [
      'Mampu membaca suasana hati di balik kata-kata dan melihat arah perkembangan konflik secara halus.',
      'Kreatif dalam merangkai narasi, refleksi, dan sudut pandang kemanusiaan.',
      'Dapat menjadi penenang atau penengah yang peka terhadap kondisi psikologis teman.',
    ],
    theoreticalLimitations: [
      'Rentan merasa terbebani oleh tuntutan produktivitas mekanis, metrik kaku, atau urusan teknis rutin (Te PoLR).',
      'Dapat menunda tindakan nyata karena terlalu lama menimbang momentum yang dirasa belum tepat.',
      'Memerlukan dorongan ketegasan yang suportif (Se Suggestive) agar tidak ragu-ragu mengambil sikap.',
    ],
    communicationPreferences: [
      'Menyukai komunikasi penuh empati, reflektif, dan tidak dipaksa dengan nada teknis yang kering.',
      'Menghargai ketegasan yang hangat sekaligus memberi ruang memahami konteks.',
    ],
    interpersonalImplications: [
      'Mudah memahami pergulatan batin teman, tetapi perlu berlatih menyampaikan batas dan kebutuhan diri secara eksplisit.',
      'Perbedaan dengan tipe Te-dominant sering muncul antara fokus pada "kecepatan hasil" vs "kesiapan batin".',
    ],
    learningApproaches: {
      abstractMaterial: 'Menggali makna filosofis, alur sejarah, atau benang merah di balik fakta.',
      organizingInfo: 'Membuat catatan reflektif berbasis tema besar dan hubungan sebab-akibat waktu.',
      practicalExamples: 'Menggunakan cerita, metafora, atau contoh kasus manusiawi untuk memahami konsep.',
      problemSolving: 'Memberi waktu hening untuk merenungkan pola sebelum mendiskusikan langkah teknis.',
      reviewing: 'Menulis ulang inti pemahaman dengan gaya bahasa pribadi.',
      managingAssignments: 'Memecah langkah teknis yang terasa berat menjadi aksi kecil dengan dukungan jadwal teman.',
      discussions: 'Menghadirkan perspektif jangka panjang dan menengahi ketegangan nada bicara.',
      presentations: 'Menyusun alur presentasi yang mengalir secara naratif dan menyentuh relevansi audiens.',
      groupWork: 'Membantu refleksi tim, penyusunan narasi, dan membaca potensi kesalahpahaman sebelum membesar.',
    },
  },

  // ================= GAMMA =================
  SEE: {
    code: 'SEE',
    fullName: 'Sensing-Ethical Extravert',
    indonesianTitle: 'Inisiator Sosial & Penggerak Relasi Nyata (ESFp)',
    quadra: 'Gamma',
    club: 'Socials / Politicians (SF)',
    temperament: 'Extraverted Irrational (EP)',
    summary:
      'Menggabungkan kesigapan merespons situasi nyata dan daya pengaruh langsung (Se) dengan kepekaan membaca jarak relasi, loyalitas, serta nilai personal individu (Fi).',
    modelA: ['Se', 'Fi', 'Te', 'Ti', 'Ni', 'Te', 'Si', 'Fe'], // WAIT! Let's fix SEE Model A immediately!
    theoreticalStrengths: [],
    theoreticalLimitations: [],
    communicationPreferences: [],
    interpersonalImplications: [],
    learningApproaches: {
      abstractMaterial: '',
      organizingInfo: '',
      practicalExamples: '',
      problemSolving: '',
      reviewing: '',
      managingAssignments: '',
      discussions: '',
      presentations: '',
      groupWork: '',
    },
  },
  ILI: {
    code: 'ILI',
    fullName: 'Intuitive-Logical Introvert',
    indonesianTitle: 'Analis Tren, Risiko & Efisiensi Jangka Panjang (INTp)',
    quadra: 'Gamma',
    club: 'Researchers (NT)',
    temperament: 'Introverted Irrational (IP)',
    summary:
      'Memadukan pengamatan mendalam atas konsekuensi waktu dan pola risiko (Ni) dengan penilaian logika pragmatis berbasis fakta serta efektivitas hasil (Te).',
    modelA: ['Ni', 'Te', 'Si', 'Fe', 'Se', 'Fi', 'Ne', 'Ti'],
    theoreticalStrengths: [
      'Tajam memprediksi celah kegagalan rencana sebelum eksekusi berjalan terlalu jauh.',
      'Mampu menyaring informasi berlebih menjadi kesimpulan pragmatis dan realistis.',
      'Tenang dan tidak mudah terbawa kepanikan emosional kelompok.',
    ],
    theoreticalLimitations: [
      'Kurang nyaman berada dalam atmosfer ekspresi emosional yang sangat intens atau tuntutan tampil ceria terus-menerus (Fe PoLR).',
      'Kecenderungan menyoroti potensi hambatan sering dianggap pesimistis atau sinis.',
      'Dapat menunda aksi langsung bila menunggu kondisi sempurna tanpa dorongan inisiatif.',
    ],
    communicationPreferences: [
      'Menyukai argumen ringkas, berbasis bukti, realistis, dan tanpa drama emosional.',
      'Menghargai ruang berpikir pribadi sebelum dimintai respons.',
    ],
    interpersonalImplications: [
      'Masukan kritisnya sering sangat berguna untuk mencegah kesalahan proyek, asalkan disampaikan dengan konteks solusi.',
      'Meski tidak ada anggota kelas awal di dataset 37 siswa untuk ILI, memahami ILI membantu melengkapi dinamika Quadra Gamma.',
    ],
    learningApproaches: {
      abstractMaterial: 'Menelusuri evolusi konsep dan menganalisis implikasi praktis dari sebuah teori.',
      organizingInfo: 'Menyusun ringkasan padat berisi inti prinsip, bukti kunci, dan catatan pengecualian.',
      practicalExamples: 'Menguji apakah contoh benar-benar relevan dengan skenario nyata.',
      problemSolving: 'Mengeliminasi langkah yang tidak efisien lalu fokus pada akar penyebab.',
      reviewing: 'Meninjau ulang kesalahan umum agar tidak terulang saat evaluasi.',
      managingAssignments: 'Bekerja paling efektif dalam sesi tenang mandiri dengan target hasil yang jelas.',
      discussions: 'Memberi koreksi realistis dan memperkirakan dampak jangka panjang usulan tim.',
      presentations: 'Menyajikan fakta terverifikasi secara lugas dan analitis.',
      groupWork: 'Cocok menjadi analis risiko, penyunting fakta, atau perancang strategi efisiensi.',
    },
  },
  LIE: {
    code: 'LIE',
    fullName: 'Logical-Intuitive Extravert',
    indonesianTitle: 'Perancang Strategi Efektif & Eksekutor Progresif (ENTj)',
    quadra: 'Gamma',
    club: 'Researchers (NT)',
    temperament: 'Extraverted Rational (EJ)',
    summary:
      'Mengutamakan efektivitas nyata, fakta terukur, dan optimalisasi proses (Te) yang dipandu oleh proyeksi arah masa depan serta strategi jangka panjang (Ni). Pemetaan Model A LIE dipertahankan persis sesuai acuan proyek.',
    modelA: ['Te', 'Ni', 'Fe', 'Si', 'Fi', 'Se', 'Ti', 'Ne'],
    theoreticalStrengths: [
      'Cakap merancang strategi kerja berorientasi hasil dengan memperhitungkan tren waktu.',
      'Sigap mengidentifikasi proses yang tidak efektif dan mengusulkan perbaikan konkret.',
      'Berani mengambil tanggung jawab target serta mendorong progres kelompok.',
    ],
    theoreticalLimitations: [
      'Rentan mengabaikan batas kelelahan fisik, kenyamanan proses, dan kebutuhan jeda (Si PoLR).',
      'Terlalu fokus pada hasil cepat sehingga kurang peka terhadap ritme atau nilai personal anggota lain (Fi Suggestive).',
      'Gaya bicara lugas tentang kesalahan prosedur bisa disalahpahami sebagai ketidaksabaran.',
    ],
    communicationPreferences: [
      'Menyukai komunikasi langsung ke inti masalah, berorientasi solusi, dan menghargai waktu.',
      'Terbuka terhadap masukan nilai atau relasi pribadi apabila disampaikan secara tulus dan tidak berbelit.',
    ],
    interpersonalImplications: [
      'Berpotensi menjadi penggerak produktivitas kelompok, namun perlu menjaga kesepakatan agar tidak melewati ritme nyaman anggota lain.',
      'Ketidaksepahaman dengan tipe berorientasi Si atau Fi sering berakar pada perbedaan antara urgensi hasil vs kenyamanan dan kepercayaan personal.',
    ],
    learningApproaches: {
      abstractMaterial: 'Mencari tahu bagaimana teori dapat diterapkan untuk memecahkan masalah nyata ke depan.',
      organizingInfo: 'Mengelompokkan informasi berdasarkan prioritas kegunaan, alur kerja, dan indikator capaian.',
      practicalExamples: 'Menggunakan studi kasus optimasi, eksperimen terukur, atau proyek nyata.',
      problemSolving: 'Menentukan sasaran akhir terlebih dahulu lalu menyusun jalur tindakan paling efisien.',
      reviewing: 'Latihan aktif dengan target waktu dan evaluasi hasil terukur.',
      managingAssignments: 'Menetapkan jadwal milestone progresif sambil sengaja menyisipkan waktu istirahat.',
      discussions: 'Mengarahkan pembicaraan menuju keputusan konkret dan pembagian tugas yang jelas.',
      presentations: 'Menekankan alur strategis, bukti data, dan kesimpulan yang dapat ditindaklanjuti.',
      groupWork: 'Efektif memimpin eksekusi strategi sambil mendengarkan masukan ritme kerja dari anggota tim.',
    },
  },
  ESI: {
    code: 'ESI',
    fullName: 'Ethical-Sensing Introvert',
    indonesianTitle: 'Penjaga Integritas Nilai & Batas Relasional (ISFj)',
    quadra: 'Gamma',
    club: 'Socials / Guardians (SF)',
    temperament: 'Introverted Rational (IJ)',
    summary:
      'Berpegang kuat pada nilai etika pribadi, ketulusan hubungan, dan komitmen personal (Fi) yang didukung ketegasan menjaga batas serta pengamatan realitas langsung (Se).',
    modelA: ['Fi', 'Se', 'Ti', 'Ne', 'Te', 'Ni', 'Fe', 'Si'],
    theoreticalStrengths: [
      'Memiliki kompas etika dan kepekaan tinggi terhadap keadilan serta ketulusan perlakuan.',
      'Setia menjaga komitmen kepada orang yang dipercaya dan tegas mempertahankan batasan.',
      'Mampu bersikap realistis dan praktis dalam mendukung orang terdekat.',
    ],
    theoreticalLimitations: [
      'Kurang nyaman dengan spekulasi ambigu, niat yang terasa tidak jelas, atau terlalu banyak alternatif tak teruji (Ne PoLR).',
      'Cenderung menarik diri atau bersikap sangat waspada bila merasa nilai atau kepercayaannya dilanggar.',
      'Memerlukan kejelasan data praktis dan tujuan langkah kerja (Te Suggestive) agar tidak terjebak prasangka.',
    ],
    communicationPreferences: [
      'Menyukai komunikasi jujur, konsisten antara ucapan dan tindakan, serta menghargai batas pribadi.',
      'Lebih terbuka berdiskusi secara personal atau kelompok kecil yang saling percaya.',
    ],
    interpersonalImplications: [
      'Sangat peka terhadap ketidakadilan dalam kontribusi kelompok, meski terkadang menyimpannya terlebih dahulu sebelum menegur.',
      'Penjelasan yang transparan tentang alasan dan data kerja sangat membantu meredakan kecurigaan.',
    ],
    learningApproaches: {
      abstractMaterial: 'Menghubungkan materi dengan nilai kemanusiaan, tanggung jawab etis, atau dampak nyata.',
      organizingInfo: 'Menyusun catatan rapi berbasis pokok penting dan contoh penerapan yang jelas.',
      practicalExamples: 'Belajar dari kasus konkret yang menunjukkan konsekuensi nyata bagi individu.',
      problemSolving: 'Menilai kelayakan solusi secara realistis sebelum menerima alternatif yang belum terbukti.',
      reviewing: 'Mengulang materi secara teratur dalam suasana tenang dan minim gangguan.',
      managingAssignments: 'Menyukai kejelasan aturan dan pembagian tugas adil tanpa perubahan mendadak.',
      discussions: 'Berbicara saat merasa isu menyangkut prinsip penting atau keadilan anggota.',
      presentations: 'Menyampaikan materi dengan persiapan matang dan sikap yang tenang serta meyakinkan.',
      groupWork: 'Menjaga akuntabilitas etis kelompok dan ketuntasan tugas yang sudah disepakati.',
    },
  },

  // ================= DELTA =================
  LSE: {
    code: 'LSE',
    fullName: 'Logical-Sensing Extravert',
    indonesianTitle: 'Manajer Operasional & Standar Kualitas (ESTj)',
    quadra: 'Delta',
    club: 'Pragmatists / Administrators (ST)',
    temperament: 'Extraverted Rational (EJ)',
    summary:
      'Mengutamakan keteraturan fakta, prosedur kerja berkualitas, dan efisiensi nyata (Te) yang dipadukan dengan perhatian terhadap kenyamanan, ketelitian detail, serta stabilitas kondisi fisik (Si).',
    modelA: ['Te', 'Si', 'Fe', 'Ni', 'Fi', 'Ne', 'Ti', 'Se'],
    theoreticalStrengths: [
      'Sangat andal dalam mengelola jadwal, alur kerja praktis, dan memastikan standar mutu tercapai.',
      'Memperhatikan kelayakan teknis dan kenyamanan nyata dalam pelaksanaan tugas.',
      'Bertanggung jawab tinggi terhadap janji dan hasil kerja bersama.',
    ],
    theoreticalLimitations: [
      'Rentan merasa cemas atau frustrasi ketika tenggat dan perubahan jangka panjang tidak terprediksi (Ni PoLR).',
      'Terkadang terlalu fokus memperbaiki kesalahan teknis sehingga nada bicara terdengar mengkritik.',
      'Memerlukan kejelasan nilai personal yang tulus (Fi Suggestive) agar kerja keras terasa bermakna secara relasional.',
    ],
    communicationPreferences: [
      'Menyukai komunikasi jelas, faktual, terstruktur, dan menepati komitmen yang dibuat.',
      'Menghargai kesopanan tulus serta kejelasan alasan di balik perubahan rencana.',
    ],
    interpersonalImplications: [
      'Menjadi penopang keteraturan kelompok, tetapi perlu memberi ruang agar rekan yang lebih konseptual tidak merasa dikekang detail.',
      'Menjelaskan bahwa koreksi ditujukan pada tugas—bukan pribadi—membantu mencegah kesalahpahaman.',
    ],
    learningApproaches: {
      abstractMaterial: 'Meminta contoh konkret bagaimana teori diterapkan dalam prosedur atau situasi nyata.',
      organizingInfo: 'Membuat daftar periksa, jadwal belajar terperinci, dan ringkasan langkah kerja.',
      practicalExamples: 'Menguasai contoh soal terapan langkah demi langkah.',
      problemSolving: 'Mengidentifikasi fakta yang tersedia lalu menerapkan metode yang paling teruji.',
      reviewing: 'Latihan soal berulang secara terjadwal dan memeriksa ketelitian tiap bagian.',
      managingAssignments: 'Mengatur kalender kerja sejak awal untuk menghindari penumpukan di akhir.',
      discussions: 'Mengingatkan kelompok pada realitas waktu, sumber daya, dan langkah pelaksanaan.',
      presentations: 'Menyajikan materi terstruktur rapi dengan contoh konkret yang mudah diverifikasi.',
      groupWork: 'Sangat efektif mengoordinasikan jadwal, kualitas teknis, dan kepastian tindak lanjut.',
    },
  },
  EII: {
    code: 'EII',
    fullName: 'Ethical-Intuitive Introvert',
    indonesianTitle: 'Pendengar Empatik & Penjaga Potensi Manusia (INFj)',
    quadra: 'Delta',
    club: 'Humanitarians (NF)',
    temperament: 'Introverted Rational (IJ)',
    summary:
      'Memadukan kedalaman nilai moral, empati personal, dan ketulusan relasi (Fi) dengan kepekaan melihat potensi perkembangan serta perspektif berbeda pada setiap orang (Ne).',
    modelA: ['Fi', 'Ne', 'Ti', 'Se', 'Te', 'Si', 'Fe', 'Ni'],
    theoreticalStrengths: [
      'Mampu memahami motif dan perasaan orang lain secara mendalam tanpa cepat menghakimi.',
      'Melihat potensi kebaikan dan beragam sudut pandang alternatif untuk meredakan konflik.',
      'Konsisten memegang prinsip etika pribadi dan menghargai martabat setiap individu.',
    ],
    theoreticalLimitations: [
      'Kurang nyaman dengan desakan konfrontatif, nada keras, atau kompetisi kekuatan langsung (Se PoLR).',
      'Cenderung memendam ketidaksetujuan demi menjaga hubungan hingga beban batin menumpuk.',
      'Membutuhkan kejelasan fakta praktis dan arahan langkah konkret (Te Suggestive) agar niat baik berwujud tindakan.',
    ],
    communicationPreferences: [
      'Menyukai dialog empatik, tenang, personal, dan memberi ruang mendengarkan secara utuh.',
      'Sangat terbantu oleh saran praktis yang disampaikan tanpa tekanan keras.',
    ],
    interpersonalImplications: [
      'Sering menjadi tempat curhat dan penengah halus di kelas, tetapi perlu berlatih menyampaikan batas diri secara asertif.',
      'Dengan rekan yang lugas dan keras (misalnya Se-leading/Te-leading), penting menyepakati gaya bicara yang tidak terasa menekan.',
    ],
    learningApproaches: {
      abstractMaterial: 'Mengeksplorasi makna humanistik, keterkaitan ide, dan alasan etis di balik konsep.',
      organizingInfo: 'Menulis catatan naratif yang rapi dengan penanda konsep inti dan contoh reflektif.',
      practicalExamples: 'Mengaitkan pelajaran dengan pengalaman manusia atau dampak sosialnya.',
      problemSolving: 'Menelaah berbagai kemungkinan sudut pandang dalam suasana tenang sebelum memilih langkah.',
      reviewing: 'Membaca ulang catatan sambil menghubungkan kembali inti makna antarbab.',
      managingAssignments: 'Membuat daftar langkah praktis kecil agar tugas besar terasa realistis dijalankan.',
      discussions: 'Membantu memastikan sudut pandang anggota yang pendiam tetap didengar.',
      presentations: 'Menyiapkan naskah atau poin inti yang terstruktur agar nyaman berbicara di forum besar.',
      groupWork: 'Menguatkan rasa saling percaya, menjaga keadilan proses, dan merumuskan perspektif alternatif.',
    },
  },
  SLI: {
    code: 'SLI',
    fullName: 'Sensing-Logical Introvert',
    indonesianTitle: 'Pengrajin Praktis & Pengoptimal Keseimbangan (ISTp)',
    quadra: 'Delta',
    club: 'Pragmatists / Artisans (ST)',
    temperament: 'Introverted Irrational (IP)',
    summary:
      'Mengutamakan kenyamanan fungsional, keseimbangan pengalaman nyata (Si), dan efisiensi teknis yang tenang serta praktis tanpa keributan yang tidak perlu (Te).',
    modelA: ['Si', 'Te', 'Ni', 'Fe', 'Ne', 'Fi', 'Se', 'Ti'],
    theoreticalStrengths: [
      'Tenang dan ekonomis dalam menyelesaikan masalah teknis secara langsung dan efektif.',
      'Peka terhadap kualitas material, kenyamanan alat kerja, serta kepraktisan solusi.',
      'Tidak mudah terpancing drama sosial yang tidak produktif.',
    ],
    theoreticalLimitations: [
      'Kurang nyaman dengan tekanan ekspresi emosional tinggi atau keharusan tampil antusias secara sosial (Fe PoLR).',
      'Tampak acuh tak acuh saat sebenarnya sedang berkonsentrasi mencari cara kerja paling nyaman.',
      'Memerlukan rangsangan ide baru yang menarik (Ne Suggestive) agar tidak terjebak rutinitas pasif.',
    ],
    communicationPreferences: [
      'Menyukai percakapan tenang, ringkas, tidak memaksa secara emosional, dan relevan dengan hal nyata.',
      'Terbantu oleh ajakan kolaborasi yang santai namun membuka peluang ide segar.',
    ],
    interpersonalImplications: [
      'Dapat diandalkan mengerjakan bagian teknis secara tenang, namun rekan yang ekspresif bisa keliru menafsirkan sikap hemat kata sebagai ketidakpedulian.',
      'Memberi sinyal singkat soal progres sangat membantu menjaga kepercayaan tim.',
    ],
    learningApproaches: {
      abstractMaterial: 'Menerjemahkan teori menjadi cara kerja nyata atau analogi mekanis yang terbayang.',
      organizingInfo: 'Menyimpan ringkasan padat, bersih, dan langsung merujuk pada langkah guna.',
      practicalExamples: 'Belajar paling cepat melalui praktik langsung, alat peraga, atau uji coba mandiri.',
      problemSolving: 'Memangkas langkah rumit dan memilih solusi yang paling hemat energi serta berhasil.',
      reviewing: 'Mencoba langsung beberapa soal atau proyek kecil tanpa terlalu banyak hafalan kosong.',
      managingAssignments: 'Memilih lingkungan kerja kondusif dengan target mandiri yang jelas dan bebas gangguan.',
      discussions: 'Berbicara seperlunya saat memiliki solusi konkret atau koreksi kepraktisan.',
      presentations: 'Menampilkan demonstrasi, visual bersih, atau ringkasan hasil tanpa bertele-tele.',
      groupWork: 'Ideal menangani pengerjaan teknis, desain fungsional, atau penyelesaian bagian praktis.',
    },
  },
  IEE: {
    code: 'IEE',
    fullName: 'Intuitive-Ethical Extravert',
    indonesianTitle: 'Penemu Potensi Manusia & Katalis Ide (ENFp)',
    quadra: 'Delta',
    club: 'Humanitarians (NF)',
    temperament: 'Extraverted Irrational (EP)',
    summary:
      'Memadukan antusiasme mengeksplorasi peluang dan potensi tersembunyi (Ne) dengan kepekaan membaca karakter, motivasi, dan kedekatan nilai antarmanusia (Fi).',
    modelA: ['Ne', 'Fi', 'Se', 'Ti', 'Si', 'Te', 'Ni', 'Fe'],
    theoreticalStrengths: [
      'Cepat melihat bakat unik tiap orang dan memicu ide kolaborasi yang kreatif.',
      'Mampu membangun kedekatan personal yang hangat dan mendorong keterbukaan.',
      'Fleksibel mencari jalan keluar kreatif saat situasi buntu.',
    ],
    theoreticalLimitations: [
      'Rentan merasa terkekang atau bosan oleh sistem aturan hierarkis yang kaku dan sangat formal (Ti PoLR).',
      'Cenderung memulai banyak gagasan menarik tetapi kesulitan menyelesaikan bagian rutinnya.',
      'Memerlukan dukungan ritme tenang dan contoh cara kerja efisien (Si Suggestive, Te Mobilizing).',
    ],
    communicationPreferences: [
      'Menyukai komunikasi hangat, terbuka terhadap eksplorasi gagasan, dan menghargai keunikan pribadi.',
      'Lebih termotivasi oleh tujuan bermakna daripada perintah birokratis.',
    ],
    interpersonalImplications: [
      'Membantu menyatukan beragam anggota tim dengan pendekatan personal, namun perlu disiplin menjaga komitmen jadwal.',
      'Perlu menjelaskan konteks di balik ide-ide cepat agar rekan yang menyukai struktur tidak merasa bingung.',
    ],
    learningApproaches: {
      abstractMaterial: 'Mencari sisi unik, keterkaitan antarmanusia, dan peluang penerapan kreatif dari teori.',
      organizingInfo: 'Menggunakan catatan visual berwarna atau peta ide sebelum merangkum poin kunci.',
      practicalExamples: 'Menghubungkan materi dengan kisah nyata, karakter tokoh, atau proyek kreatif.',
      problemSolving: 'Curah pendapat lintas sudut pandang lalu memvalidasi ide terbaik dengan langkah praktis.',
      reviewing: 'Berdiskusi santai dengan teman atau mengaitkan topik dengan hal yang diminati.',
      managingAssignments: 'Menetapkan batas lingkup proyek sejak awal agar ide tidak melebar terlalu jauh.',
      discussions: 'Menggali pendapat tiap anggota dan menghubungkan potensi ide satu sama lain.',
      presentations: 'Menyampaikan materi secara antusias, personal, dan penuh contoh inspiratif.',
      groupWork: 'Cocok sebagai penghubung antaranggota dan pencetus konsep kreatif yang dibantu rekan penata struktur.',
    },
  },
};

// Fix SEE Model A accurately: Se (1), Fi (2), Fe (3)? Wait — let's double check SEE Model A!
// SEE (ESFp, Gamma):
// 1 Leading: Se (Extraverted Sensing)
// 2 Creative: Fi (Introverted Ethics)
// 3 Role: Ne (Extraverted Intuition — same Irrationality & Extraversion as Se)
// 4 PoLR: Ti (Introverted Logic — opposite attitude to Creative Fi, same Rationality)
// 5 Suggestive: Ni (Introverted Intuition — Dual ILI Leading)
// 6 Mobilizing: Te (Extraverted Logic — Dual ILI Creative)
// 7 Ignoring: Si (Introverted Sensing — opposite attitude to Leading Se)
// 8 Demonstrative: Fe (Extraverted Ethics — opposite attitude to Creative Fi)
// Let's assign the exact verified SEE details right here:
SOCIONICS_TYPES.SEE = {
  code: 'SEE',
  fullName: 'Sensing-Ethical Extravert',
  indonesianTitle: 'Inisiator Sosial & Penggerak Relasi Nyata (ESFp)',
  quadra: 'Gamma',
  club: 'Socials / Politicians (SF)',
  temperament: 'Extraverted Irrational (EP)',
  summary:
    'Menggabungkan kesigapan merespons situasi nyata dan daya pengaruh langsung (Se) dengan kepekaan membaca jarak relasi, loyalitas, serta nilai personal individu (Fi).',
  modelA: ['Se', 'Fi', 'Ne', 'Ti', 'Ni', 'Te', 'Si', 'Fe'],
  theoreticalStrengths: [
    'Cepat membaca dinamika pengaruh sosial dan membangun jaringan kedekatan secara aktif.',
    'Tegas bertindak di momen sekarang sambil tetap peka terhadap loyalitas personal.',
    'Mampu memotivasi dan melibatkan orang lain dalam aksi nyata.',
  ],
  theoreticalLimitations: [
    'Kurang menyukai sistem aturan teoretis yang kaku, bertele-tele, atau analisis definisi abstrak yang terpisah dari realitas (Ti PoLR).',
    'Berisiko bertindak impulsif sebelum mempertimbangkan dampak jangka panjang (Ni Suggestive).',
    'Mudah merasa bosan dengan prosedur administratif tanpa hasil nyata yang cepat terlihat.',
  ],
  communicationPreferences: [
    'Menyukai komunikasi langsung, hangat secara personal, dinamis, dan menghargai inisiatif.',
    'Lebih responsif pada contoh praktis dan hubungan saling percaya daripada ceramah aturan.',
  ],
  interpersonalImplications: [
    'Aktif menggerakkan kegiatan kelas, namun dapat berbenturan dengan tipe analitis kaku jika tidak ada kesepakatan tujuan praktis.',
    'Mengapresiasi kemauan mereka bertindak sambil mengajak menimbang dampak ke depan sangat efektif.',
  ],
  learningApproaches: {
    abstractMaterial: 'Mengubah konsep abstrak menjadi simulasi peran, contoh nyata, atau relevansi sosial langsung.',
    organizingInfo: 'Mengelompokkan poin penting secara ringkas dan berbasis kegunaan langsung.',
    practicalExamples: 'Belajar terbaik lewat praktik lapangan, studi kasus nyata, dan interaksi aktif.',
    problemSolving: 'Menguji opsi secara langsung lalu menyesuaikan strategi berdasarkan umpan balik situasi.',
    reviewing: 'Diskusi interaktif singkat dan latihan terarah bersama teman.',
    managingAssignments: 'Menjaga fokus dengan target jangka pendek yang nyata dan dukungan jadwal jelas.',
    discussions: 'Mendorong keterlibatan anggota dan mengarahkan gagasan agar dapat dijalankan.',
    presentations: 'Kuat dalam membangun kontak mata, energi panggung, dan interaksi langsung dengan audiens.',
    groupWork: 'Efektif sebagai penggerak jaringan dan eksekutor lapangan bersama rekan analis jangka panjang.',
  },
};

export interface QuadraSpec {
  name: QuadraName;
  indonesianTitle: string;
  colorName: string;
  accentHex: string;
  softBgClass: string;
  borderClass: string;
  textClass: string;
  badgeDotClass: string;
  valuedElements: InformationElement[];
  subduedElements: InformationElement[];
  types: SocionicsCode[];
  coreValues: string[];
  communicationTendencies: string[];
  internalDifferences: string;
  potentialMisunderstandings: string;
  commonMisconceptions: string[];
  limitations: string;
  summary: string;
}

export const QUADRAS: Record<QuadraName, QuadraSpec> = {
  Alpha: {
    name: 'Alpha',
    indonesianTitle: 'Quadra Alpha (Kuning)',
    colorName: 'Kuning',
    accentHex: '#CA8A04',
    softBgClass: 'bg-yellow-50',
    borderClass: 'border-yellow-300',
    textClass: 'text-yellow-800',
    badgeDotClass: 'bg-yellow-500',
    valuedElements: ['Ne', 'Si', 'Fe', 'Ti'],
    subduedElements: ['Se', 'Ni', 'Fi', 'Te'],
    types: ['ILE', 'SEI', 'ESE', 'LII'],
    summary:
      'Menghargai eksplorasi gagasan baru (Ne), kejelasan kerangka logika (Ti), suasana emosional yang hangat serta inklusif (Fe), dan kenyamanan pengalaman nyata (Si).',
    coreValues: [
      'Keterbukaan curah pendapat, rasa ingin tahu intelektual, dan kegembiraan belajar.',
      'Penjelasan konsep yang runtut tanpa tekanan hierarki yang kaku.',
      'Suasana kebersamaan yang ramah serta kenyamanan lingkungan diskusi.',
    ],
    communicationTendencies: [
      'Cenderung menyukai diskusi demokratis di mana semua orang boleh melempar ide.',
      'Mengombinasikan candaan hangat dengan pembahasan konsep atau prinsip.',
    ],
    internalDifferences:
      'Keempat tipe Alpha tidak seragam: ILE dan LII berfokus pada ide serta struktur logika (NT), sedangkan ESE dan SEI berfokus pada atmosfer emosional dan kenyamanan (SF). Perbedaan kecepatan antara ILE (eksploratif cepat) dan SEI (tenang bertahap) tetap bisa menimbulkan salah paham.',
    potentialMisunderstandings:
      'Diskusi dapat berputar di eksplorasi ide tanpa segera mengunci keputusan eksekusi, atau tampak terlalu santai bagi Quadra yang menuntut ketegasan cepat.',
    commonMisconceptions: [
      'Mengira semua anggota Alpha selalu ceria, santai, atau tidak serius terhadap tugas.',
      'Menganggap dua orang Alpha pasti langsung sepakat saat kerja kelompok.',
    ],
    limitations:
      'Teori Quadra hanya menggambarkan preferensi nilai informasi bersama, bukan jaminan kesamaan minat, kedewasaan komunikasi, atau kemampuan kerja sama.',
  },
  Beta: {
    name: 'Beta',
    indonesianTitle: 'Quadra Beta (Merah Muda)',
    colorName: 'Merah Muda',
    accentHex: '#DB2777',
    softBgClass: 'bg-pink-50',
    borderClass: 'border-pink-300',
    textClass: 'text-pink-800',
    badgeDotClass: 'bg-pink-500',
    valuedElements: ['Se', 'Ni', 'Fe', 'Ti'],
    subduedElements: ['Ne', 'Si', 'Fi', 'Te'],
    types: ['SLE', 'IEI', 'LSI', 'EIE'],
    summary:
      'Menghargai ketegasan tindakan dan struktur peran (Se + Ti), visi arah jangka panjang (Ni), serta kekuatan ekspresi dan solidaritas emosional bersama (Fe).',
    coreValues: [
      'Keberanian mengambil sikap, kejelasan hierarki tanggung jawab, dan loyalitas pada tujuan bersama.',
      'Makna perjuangan kolektif, momentum waktu, dan ketegasan prinsip.',
      'Ekspresi semangat yang menggerakkan solidaritas kelompok.',
    ],
    communicationTendencies: [
      'Lebih menghargai kejelasan posisi dan ketegasan komitmen daripada keraguan yang berlarut.',
      'Dapat memadukan analisis sistem aturan yang ketat (LSI) dengan penyampaian visi yang menggugah (EIE).',
    ],
    internalDifferences:
      'SLE dan LSI menonjolkan ketegasan praktis serta aturan (ST), sedangkan EIE dan IEI menonjolkan makna simbolis dan dinamika emosional (NF). LSI yang menyukai keteraturan kaku bisa berbeda ritme dengan IEI yang reflektif.',
    potentialMisunderstandings:
      'Gaya bicara tegas dan intens mudah dianggap mengintimidasi oleh pihak luar, atau memicu konflik peran internal jika dua anggota sama-sama ingin memegang kendali arah.',
    commonMisconceptions: [
      'Menganggap Quadra Beta selalu otoriter, agresif, atau menyukai konflik.',
      'Menyangka tipe IEI atau LSI bersikap identik dengan SLE.',
    ],
    limitations:
      'Keanggotaan dalam Quadra Beta tidak menentukan perilaku dominan atau otoriter seseorang; norma sekolah, empati pribadi, dan keterampilan komunikasi jauh lebih menentukan.',
  },
  Gamma: {
    name: 'Gamma',
    indonesianTitle: 'Quadra Gamma (Hijau)',
    colorName: 'Hijau',
    accentHex: '#059669',
    softBgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    textClass: 'text-emerald-800',
    badgeDotClass: 'bg-emerald-500',
    valuedElements: ['Se', 'Ni', 'Fi', 'Te'],
    subduedElements: ['Ne', 'Si', 'Fe', 'Ti'],
    types: ['SEE', 'ILI', 'LIE', 'ESI'],
    summary:
      'Menghargai pragmatisme hasil nyata dan akuntabilitas fakta (Te), ketegasan tindakan (Se), kepekaan nilai etika personal serta kepercayaan (Fi), dan antisipasi konsekuensi jangka panjang (Ni).',
    coreValues: [
      'Tanggung jawab personal, ketulusan hubungan satu-lawan-satu, dan bukti tindakan nyata.',
      'Kemandirian berpendapat dan efisiensi strategi menghadapi tantangan konkret.',
      'Penilaian yang tegas mengenai integritas serta hasil kerja.',
    ],
    communicationTendencies: [
      'Cenderung berbicara langsung ke inti persoalan (tidak bertele-tele) dan menjaga batas personal.',
      'Menilai orang lain dari konsistensi tindakan dan ketulusan personal, bukan sekadar keramahan permukaan.',
    ],
    internalDifferences:
      'Di dataset awal kelas ini terdapat LIE (strategi pragmatis), ESI (penjaga nilai personal, 4 siswa), dan SEE (penggerak relasi nyata, 3 siswa). ESI yang berhati-hati dan menjaga nilai bisa berbenturan dengan tempo cepat LIE atau spontanitas SEE bila ekspektasi tidak dibicarakan.',
    potentialMisunderstandings:
      'Komunikasi yang sangat lugas (Te/Se) dapat melukai kepekaan relasional, sementara penjagaan jarak personal (Fi) bisa disalahartikan sebagai sikap tertutup atau dingin.',
    commonMisconceptions: [
      'Menganggap Quadra Gamma semata-mata materialistis, individualis, atau hanya mengejar keuntungan.',
      'Mengira sesama Gamma bebas dari salah paham tentang cara menegur.',
    ],
    limitations:
      'Nilai Gamma tidak menghalangi seseorang untuk bersikap hangat secara kolektif, sebagaimana tipe lain pun dapat bersikap pragmatis dan berintegritas.',
  },
  Delta: {
    name: 'Delta',
    indonesianTitle: 'Quadra Delta (Biru)',
    colorName: 'Biru',
    accentHex: '#2563EB',
    softBgClass: 'bg-blue-50',
    borderClass: 'border-blue-300',
    textClass: 'text-blue-800',
    badgeDotClass: 'bg-blue-500',
    valuedElements: ['Ne', 'Si', 'Fi', 'Te'],
    subduedElements: ['Se', 'Ni', 'Fe', 'Ti'],
    types: ['LSE', 'EII', 'SLI', 'IEE'],
    summary:
      'Menghargai kualitas kerja nyata yang manusiawi (Te + Si), kebebasan menggali potensi pribadi (Ne), serta keaslian relasi moral tanpa pemaksaan (Fi).',
    coreValues: [
      'Pengerjaan tugas yang bermutu, berkelanjutan, dan menghormati ritme manusia.',
      'Ketulusan personal, kesetiaan pada nilai kemanusiaan, dan pengembangan potensi unik individu.',
      'Kolaborasi tanpa tekanan agresif atau drama emosional berlebihan.',
    ],
    communicationTendencies: [
      'Lebih nyaman berkomunikasi secara tenang, personal, konstruktif, dan berorientasi perbaikan nyata.',
      'Menghargai kesabaran mendengar serta solusi yang langsung dapat dipraktikkan.',
    ],
    internalDifferences:
      'Delta memadukan fokus etika-potensi manusia (EII dan IEE, 7 siswa di dataset awal) dengan fokus keahlian praktis-keseimbangan (LSE dan SLI, 4 siswa). EII/IEE dapat merasa LSE terlalu menuntut detail prosedur, sementara LSE/SLI dapat merasa EII/IEE kurang konkret.',
    potentialMisunderstandings:
      'Penghindaran konflik terbuka demi menjaga rasa nyaman sering membuat ketidakpuasan menumpuk diam-diam dan baru terasa saat tugas hampir selesai.',
    commonMisconceptions: [
      'Mengira Quadra Delta selalu pasif, selalu setuju, atau tidak berani bersikap tegas.',
      'Menganggap semua anggota Delta memiliki gaya belajar yang lembut dan lambat.',
    ],
    limitations:
      'Preferensi Delta tidak otomatis membuat kelompok bebas konflik; kejelasan ekspektasi dan pembagian tanggung jawab tetap mutlak dibutuhkan.',
  },
};

export interface JungianNotationSpec {
  code: string;
  dominant: string;
  accompanying: string;
  orientation: 'Ekstrovert' | 'Introvert';
  processingPreferences: string;
  communicationImplications: string;
  learningHypothesis: string;
}

export const JUNGIAN_NOTATIONS: Record<string, JungianNotationSpec> = {
  'ET(N)': {
    code: 'ET(N)',
    dominant: 'Extraverted Thinking (Berpikir Ekstrovert)',
    accompanying: 'Intuition (Intuisi — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Ekstrovert',
    processingPreferences:
      'Mengorganisasi fakta objektif, kriteria terukur, dan struktur kerja secara eksternal, sambil dibantu oleh pengamatan pola konseptual atau arah kemungkinan (Intuisi).',
    communicationImplications:
      'Cenderung berkomunikasi secara sistematis, terarah pada hasil, dan menghargai kejelasan alasan konseptual maupun bukti nyata.',
    learningHypothesis:
      'Dapat mencoba menyusun peta target belajar terukur lalu memadukannya dengan gambaran besar keterkaitan antarbab.',
  },
  'ET(S)': {
    code: 'ET(S)',
    dominant: 'Extraverted Thinking (Berpikir Ekstrovert)',
    accompanying: 'Sensing (Penginderaan — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Ekstrovert',
    processingPreferences:
      'Mengorganisasi fakta dan prosedur eksternal dengan dukungan perhatian terhadap detail konkret, data nyata, dan langkah teknis terperinci.',
    communicationImplications:
      'Mengutamakan kejelasan fakta, langkah yang dapat diverifikasi, dan contoh konkret yang langsung relevan.',
    learningHypothesis:
      'Dapat mencoba daftar periksa terstruktur dengan contoh soal terapan yang berurutan.',
  },
  'IT(N)': {
    code: 'IT(N)',
    dominant: 'Introverted Thinking (Berpikir Introvert)',
    accompanying: 'Intuition (Intuisi — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Introvert',
    processingPreferences:
      'Membangun konsistensi prinsip logika internal dan definisi konsep, didukung oleh pembacaan pola abstrak atau kemungkinan teoretis.',
    communicationImplications:
      'Membutuhkan kejelasan kerangka berpikir sebelum menyepakati kesimpulan; cenderung tenang dan analitis.',
    learningHypothesis:
      'Dapat mencoba merangkum prinsip dasar terlebih dahulu lalu mengeksplorasi variasi penerapannya.',
  },
  'IT(S)': {
    code: 'IT(S)',
    dominant: 'Introverted Thinking (Berpikir Introvert)',
    accompanying: 'Sensing (Penginderaan — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Introvert',
    processingPreferences:
      'Menekankan keteraturan sistem internal, aturan yang konsisten, serta verifikasi berdasarkan fakta dan pengalaman konkret.',
    communicationImplications:
      'Lebih nyaman pada penyampaian yang presisi, teratur, jujur pada fakta, dan tidak berubah-ubah.',
    learningHypothesis:
      'Dapat mencoba metode latihan bertahap berbasis prosedur jelas dan evaluasi ketelitian tiap langkah.',
  },
  'EF(N)': {
    code: 'EF(N)',
    dominant: 'Extraverted Feeling (Merasa Ekstrovert)',
    accompanying: 'Intuition (Intuisi — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Ekstrovert',
    processingPreferences:
      'Menyelaraskan diri dengan nilai sosial bersama dan dinamika emosional lingkungan, didukung kepekaan terhadap makna serta arah perkembangan.',
    communicationImplications:
      'Ekspresif, memperhatikan respons audiens atau kelompok, dan suka membahas tujuan bersama yang bermakna.',
    learningHypothesis:
      'Dapat mencoba belajar melalui diskusi makna dan presentasi ulang secara lisan.',
  },
  'EF(S)': {
    code: 'EF(S)',
    dominant: 'Extraverted Feeling (Merasa Ekstrovert)',
    accompanying: 'Sensing (Penginderaan — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Ekstrovert',
    processingPreferences:
      'Berfokus pada keharmonisan suasana sosial dan keterlibatan bersama, ditopang oleh perhatian pada pengalaman nyata serta kenyamanan praktis.',
    communicationImplications:
      'Hangat, kooperatif, peka terhadap etika sosial sehari-hari, dan mendorong keterlibatan kelompok.',
    learningHypothesis:
      'Dapat mencoba sesi belajar kelompok terarah dengan contoh kehidupan sehari-hari.',
  },
  'IF(S)': {
    code: 'IF(S)',
    dominant: 'Introverted Feeling (Merasa Introvert)',
    accompanying: 'Sensing (Penginderaan — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Introvert',
    processingPreferences:
      'Menilai situasi berdasarkan nilai moral batin dan ketulusan personal, dibantu pengamatan realitas konkret di lingkungan sekitar.',
    communicationImplications:
      'Tenang di permukaan namun tegas dalam nilai pribadi; menghargai ketulusan, rasa hormat, dan bukti nyata.',
    learningHypothesis:
      'Dapat mencoba menghubungkan materi dengan contoh konkret yang bermakna secara personal.',
  },
  'IF(N)': {
    code: 'IF(N)',
    dominant: 'Introverted Feeling (Merasa Introvert)',
    accompanying: 'Intuition (Intuisi — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Introvert',
    processingPreferences:
      'Menghayati nilai personal dan keaslian relasi batin secara mendalam, didampingi kepekaan terhadap makna simbolis serta kemungkinan perkembangan manusia.',
    communicationImplications:
      'Empatik, reflektif, menghargai percakapan mendalam, dan menghindari nada yang memaksa.',
    learningHypothesis:
      'Dapat mencoba penulisan catatan reflektif atau peta keterkaitan makna konseptual.',
  },
  'ES(F)': {
    code: 'ES(F)',
    dominant: 'Extraverted Sensing (Penginderaan Ekstrovert)',
    accompanying: 'Feeling (Merasa — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Ekstrovert',
    processingPreferences:
      'Sigap menangkap realitas objektif saat ini dan merespons peluang nyata di sekitar, didampingi pertimbangan nilai relasional atau suasana manusia.',
    communicationImplications:
      'Hidup, langsung, berorientasi interaksi nyata, dan peka pada dinamika hubungan dengan lawan bicara.',
    learningHypothesis:
      'Dapat mencoba simulasi praktik langsung atau studi kasus interaksi nyata.',
  },
  'ES(T)': {
    code: 'ES(T)',
    dominant: 'Extraverted Sensing (Penginderaan Ekstrovert)',
    accompanying: 'Thinking (Berpikir — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Ekstrovert',
    processingPreferences:
      'Berfokus pada realitas fisik dan tindakan langsung saat ini, didukung analisis logika praktis mengenai mekanisme dan strategi situasi.',
    communicationImplications:
      'Lugas, tegas, cepat mengambil inisiatif, dan menilai ide dari apakah hal itu bisa berjalan nyata.',
    learningHypothesis:
      'Dapat mencoba latihan berbasis tantangan, simulasi kasus, dan praktik langsung.',
  },
  'IS(F)': {
    code: 'IS(F)',
    dominant: 'Introverted Sensing (Penginderaan Introvert)',
    accompanying: 'Feeling (Merasa — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Introvert',
    processingPreferences:
      'Memperhatikan kesan pengalaman internal, kenyamanan lingkungan, serta kestabilan ritme, didukung kepekaan terhadap harmoni manusiawi.',
    communicationImplications:
      'Tenang, ramah, menghargai nada bicara yang bersahabat dan suasana kerja tanpa tekanan mendadak.',
    learningHypothesis:
      'Dapat mencoba belajar bertahap dalam suasana nyaman dengan contoh akrab sehari-hari.',
  },
  'IS(T)': {
    code: 'IS(T)',
    dominant: 'Introverted Sensing (Penginderaan Introvert)',
    accompanying: 'Thinking (Berpikir — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Introvert',
    processingPreferences:
      'Mengamati detail pengalaman nyata dan keseimbangan praktis secara tenang, didukung analisis logika tentang cara kerja sesuatu.',
    communicationImplications:
      'Hemat kata, realistis, fokus pada solusi fungsional yang tidak berbelit-belit.',
    learningHypothesis:
      'Dapat mencoba demonstrasi langsung, diagram bersih, dan latihan mandiri terstruktur.',
  },
  'EN(T)': {
    code: 'EN(T)',
    dominant: 'Extraverted Intuition (Intuisi Ekstrovert)',
    accompanying: 'Thinking (Berpikir — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Ekstrovert',
    processingPreferences:
      'Mengeksplorasi ragam kemungkinan dan gagasan baru di dunia luar, didukung kerangka analisis logika untuk memetakan hubungannya.',
    communicationImplications:
      'Antusias membahas ide, suka bertanya "mengapa" dan "bagaimana jika", serta menghargai debat gagasan yang sehat.',
    learningHypothesis:
      'Dapat mencoba brainstorming lintas konsep sebelum menguncinya ke rangkuman inti.',
  },
  'EN(F)': {
    code: 'EN(F)',
    dominant: 'Extraverted Intuition (Intuisi Ekstrovert)',
    accompanying: 'Feeling (Merasa — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Ekstrovert',
    processingPreferences:
      'Mencari potensi baru, ide kreatif, dan kemungkinan perkembangan, didampingi penilaian nilai kemanusiaan serta ketertarikan pada motivasi individu.',
    communicationImplications:
      'Antusias, hangat, terbuka terhadap berbagai cerita dan perspektif unik teman.',
    learningHypothesis:
      'Dapat mencoba peta ide visual dan diskusi kelompok eksploratif dengan batas lingkup yang jelas.',
  },
  'IN(F)': {
    code: 'IN(F)',
    dominant: 'Introverted Intuition (Intuisi Introvert)',
    accompanying: 'Feeling (Merasa — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Introvert',
    processingPreferences:
      'Merenungkan makna terdalam, alur perkembangan waktu, dan pola batin, didampingi pertimbangan nilai kemanusiaan serta empati.',
    communicationImplications:
      'Reflektif, peka terhadap nuansa tersirat, dan membutuhkan waktu sejenak sebelum merespons persoalan kompleks.',
    learningHypothesis:
      'Dapat mencoba merangkum benang merah tema dan menulis refleksi konsep dengan bahasa sendiri.',
  },
  'IN(T)': {
    code: 'IN(T)',
    dominant: 'Introverted Intuition (Intuisi Introvert)',
    accompanying: 'Thinking (Berpikir — orientasi tidak diasumsikan tanpa klarifikasi)',
    orientation: 'Introvert',
    processingPreferences:
      'Menganalisis pola perkembangan jangka panjang dan esensi fenomena secara internal, didukung kerangka logika konseptual.',
    communicationImplications:
      'Analitis, ringkas, fokus pada implikasi jangka panjang dan kejelasan sebab-akibat.',
    learningHypothesis:
      'Dapat mencoba analisis tren, ringkasan prinsip inti, dan evaluasi risiko konsep.',
  },
};

export function parseJungianNotation(notation: string): {
  valid: boolean;
  dominantOrientation: string;
  dominantFunction: string;
  accompanyingFunction: string;
  explanation: string;
} {
  const clean = notation.trim().toUpperCase();
  const match = clean.match(/^([EI])([TFNS])\(([TFNS])\)$/);
  if (!match) {
    return {
      valid: false,
      dominantOrientation: '',
      dominantFunction: '',
      accompanyingFunction: '',
      explanation:
        'Format notasi konvensi proyek belum sesuai pola XY(Z), misalnya ET(N) atau IF(S).',
    };
  }
  const [, att, dom, acc] = match;
  const attLabel = att === 'E' ? 'Extraverted' : 'Introverted';
  const fnMap: Record<string, string> = {
    T: 'Thinking',
    F: 'Feeling',
    N: 'Intuition',
    S: 'Sensing',
  };
  const fnIdMap: Record<string, string> = {
    T: 'Berpikir',
    F: 'Merasa / Evaluasi Nilai',
    N: 'Intuisi',
    S: 'Penginderaan',
  };
  return {
    valid: true,
    dominantOrientation: att === 'E' ? 'Ekstrovert' : 'Introvert',
    dominantFunction: `${attLabel} ${fnMap[dom]} (${fnIdMap[dom]})`,
    accompanyingFunction: `${fnMap[acc]} (${fnIdMap[acc]})`,
    explanation: `Sesuai konvensi notasi proyek DYNAMAP (bukan konversi MBTI otomatis), ${clean} dibaca sebagai ${attLabel} ${fnMap[dom]} sebagai fungsi dominan dengan ${fnMap[acc]} sebagai fungsi pendamping (tanpa mengasumsikan orientasi E/I fungsi pendamping kecuali dinyatakan secara eksplisit).`,
  };
}
