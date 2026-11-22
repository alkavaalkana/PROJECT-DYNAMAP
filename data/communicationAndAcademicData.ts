export interface ScenarioResponseOption {
  id: string;
  label: string;
  tone: 'Defensif / Terburu-buru' | 'Menghindar' | 'Kolaboratif / Asertif';
  implication: string;
  recommendedAdjustment: string;
}

export interface CommunicationScenario {
  id: string;
  topic: string;
  situation: string;
  personAPerspective: string;
  personBPerspective: string;
  communicationDifferences: string;
  potentialMisunderstanding: string;
  alternativeInterpretations: string[];
  clarifyingQuestions: string[];
  practicalStrategies: string[];
  suggestedDialogue: {
    avoid: string;
    trySaying: string;
  };
  followUpReflection: string[];
  responseChoices: ScenarioResponseOption[];
}

export const COMMUNICATION_SCENARIOS: CommunicationScenario[] = [
  {
    id: 'scen-kritik',
    topic: 'Kritik dan penerimaan kritik',
    situation:
      'Setelah simulasi presentasi kelompok, Siswa A langsung menunjuk tiga bagian slide Siswa B yang datanya kurang akurat dengan nada lugas tanpa basa-basi. Siswa B langsung terdiam sepanjang sisa rapat.',
    personAPerspective:
      'Siswa A merasa ia hanya membantu menyelamatkan nilai kelompok dengan menunjukkan kesalahan faktual secepat mungkin.',
    personBPerspective:
      'Siswa B merasa kerja kerasnya semalam diremehkan di depan teman-teman karena langsung disalahkan tanpa melihat upayanya.',
    communicationDifferences:
      'Perbedaan antara fokus pada koreksi objektif cepat (sering terkait preferensi Te/Ti atau Competency) dan kebutuhan pengakuan usaha serta keamanan relasi personal (sering terkait Fi/Fe atau Heart center).',
    potentialMisunderstanding:
      'Koreksi teknis ditafsirkan sebagai serangan pribadi, sementara respons diam ditafsirkan sebagai sikap tidak profesional atau menolak perbaikan.',
    alternativeInterpretations: [
      'Siswa A kemungkinan tidak bermaksud menjatuhkan, melainkan panik mengejar ketepatan sebelum dinilai guru.',
      'Siswa B mungkin bukan menolak revisi, tetapi butuh waktu mencerna nada penyampaian yang terasa mendadak.',
    ],
    clarifyingQuestions: [
      'Apakah koreksi ini sebaiknya kita bahas berdua dulu atau langsung di grup?',
      'Bagian mana dari slide yang menurutmu sudah kuat, dan bagian mana yang memang butuh data tambahan?',
    ],
    practicalStrategies: [
      'Pisahkan apresiasi atas usaha dengan koreksi spesifik pada bagian data.',
      'Gunakan kalimat berbasis objek tugas ("Angka di grafik 2 belum cocok dengan tabel"), bukan label personal.',
      'Jika suasana telanjur canggung, tindak lanjuti secara personal setelah rapat selesai.',
    ],
    suggestedDialogue: {
      avoid: 'Slide kamu ini salah semua datanya, kok nggak dicek dulu sih sebelum rapat?',
      trySaying:
        'Terima kasih sudah menyusun alur slidenya sampai rapi. Aku cek ada tiga angka di grafik halaman 4 yang belum sinkron dengan tabel sumber; mau kita sesuaikan bareng sekarang atau nanti sore?',
    },
    followUpReflection: [
      'Saat memberi masukan nanti, apakah aku sudah membedakan kualitas draf dengan harga diri pembuatnya?',
      'Saat menerima kritik tajam, pertanyaan klarifikasi apa yang bisa kuajukan sebelum menarik kesimpulan niat orang lain?',
    ],
    responseChoices: [
      {
        id: 'opt-1',
        label: 'Membalas: "Kalau kamu merasa lebih pintar, kerjakan saja sendiri!"',
        tone: 'Defensif / Terburu-buru',
        implication: 'Mengalihkan fokus dari perbaikan data menjadi pertarungan ego, membuat diskusi terhenti.',
        recommendedAdjustment: 'Tahan respons emosional 10 detik, lalu minta poin spesifik mana yang perlu diperbaiki.',
      },
      {
        id: 'opt-2',
        label: 'Diam dan menghapus semua bagian sendiri tanpa menjelaskan kendalanya',
        tone: 'Menghindar',
        implication: 'Masalah nada bicara tidak pernah dibahas dan berisiko terulang di proyek berikutnya.',
        recommendedAdjustment: 'Sampaikan secara tenang bahwa koreksinya diterima, lalu beri tahu cara penyampaian yang lebih nyaman.',
      },
      {
        id: 'opt-3',
        label: 'Menanyakan detail revisinya lalu mengajak menyepakati cara memberi masukan di tim',
        tone: 'Kolaboratif / Asertif',
        implication: 'Data slide tetap akurat sekaligus menjaga rasa saling menghormati antaranggota.',
        recommendedAdjustment: 'Pertahankan komunikasi langsung namun ramah terhadap batas psikologis.',
      },
    ],
  },
  {
    id: 'scen-kepedulian',
    topic: 'Perbedaan ekspresi kepedulian',
    situation:
      'Menjelang ujian akhir, Siswa A stres berat karena nilai praktikumnya turun. Siswa B langsung membuatkan daftar jadwal belajar dan solusi teknis, padahal Siswa A sebenarnya hanya ingin didengarkan sejenak.',
    personAPerspective:
      'Siswa A merasa perasaannya diabaikan seolah masalahnya hanya dianggap soal kurang disiplin.',
    personBPerspective:
      'Siswa B merasa ia menunjukkan kepedulian paling nyata dengan menyusun rencana konkret agar temannya tidak terus cemas.',
    communicationDifferences:
      'Perbedaan antara kebutuhan validasi emosional lebih dulu (empati afektif) dan ekspresi kepedulian melalui pemecahan masalah praktis.',
    potentialMisunderstanding:
      'Pemberian solusi cepat terlihat dingin dan menggurui, sedangkan penolakan solusi terlihat seperti tidak mau berusaha.',
    alternativeInterpretations: [
      'Siswa B sebenarnya sangat peduli, hanya bahasa bantuannya berbentuk tindakan terstruktur.',
      'Siswa A bukan menolak perbaikan jadwal, ia hanya perlu menenangkan emosi dulu sebelum bisa berpikir jernih.',
    ],
    clarifyingQuestions: [
      'Saat ini kamu lebih butuh didengarkan dulu, atau mau langsung kita susun rencana belajarnya?',
      'Bagian mana yang paling membuatmu terbebani hari ini?',
    ],
    practicalStrategies: [
      'Tanyakan preferensi dukungan secara eksplisit sebelum langsung memberi nasihat.',
      'Jika ingin didengarkan saja, nyatakan dengan ramah agar teman tidak salah mengira butuh solusi segera.',
    ],
    suggestedDialogue: {
      avoid: 'Makanya jangan ditunda-tunda, nih ikutin jadwal yang kubuat saja.',
      trySaying:
        'Kelihatannya minggu ini berat banget buat kamu. Kamu mau cerita dulu biar lega, atau mau kita barengan bikin rencana ngejar materinya?',
    },
    followUpReflection: [
      'Apakah aku sering menyamakan "cara aku ingin dibantu" dengan "cara teman ingin dibantu"?',
    ],
    responseChoices: [
      {
        id: 'k1',
        label: 'Langsung mengoreksi: "Kamu terlalu emosional, fokus saja ke solusi!"',
        tone: 'Defensif / Terburu-buru',
        implication: 'Membuat teman merasa dihakimi dan enggan terbuka lagi di masa depan.',
        recommendedAdjustment: 'Validasi perasaannya lebih dulu sebelum masuk ke rencana aksi.',
      },
      {
        id: 'k2',
        label: 'Menerima jadwalnya sambil memendam rasa tidak dipahami',
        tone: 'Menghindar',
        implication: 'Beban batin tidak berkurang dan teman mengira pendekatannya sudah tepat.',
        recommendedAdjustment: 'Ucapkan terima kasih atas jadwalnya, lalu minta waktu 5 menit untuk didengarkan dulu.',
      },
      {
        id: 'k3',
        label: 'Mengapresiasi niat baiknya dan meminta ruang didengarkan sebelum menyusun rencana',
        tone: 'Kolaboratif / Asertif',
        implication: 'Kedua bentuk kepedulian saling melengkapi tanpa salah paham.',
        recommendedAdjustment: 'Lanjutkan dengan menyepakati satu langkah kecil yang realistis.',
      },
    ],
  },
  {
    id: 'scen-kesalahpahaman',
    topic: 'Kesalahpahaman',
    situation:
      'Di grup chat proyek, pesan Siswa A yang berbunyi "Oke, kerjakan saja bagianmu dulu" dibaca oleh Siswa B sebagai nada kesal karena tidak memakai tanda seru atau emotikon.',
    personAPerspective:
      'Siswa A sedang mengetik cepat di sela kegiatan ekskul dan maksudnya murni menyetujui pembagian tugas.',
    personBPerspective:
      'Siswa B menduga Siswa A marah karena progresnya dianggap lambat.',
    communicationDifferences:
      'Teks tertulis menghilangkan intonasi suara dan ekspresi wajah; gaya pesan ringkas-informatif sering berbenturan dengan gaya pesan relasional-ekspresif.',
    potentialMisunderstanding:
      'Kekosongan ekspresi di chat diisi oleh asumsi terburuk pembaca.',
    alternativeInterpretations: [
      'Pengirim pesan mungkin sedang terburu-buru atau memang terbiasa mengetik singkat.',
    ],
    clarifyingQuestions: [
      'Biar aku nggak salah tangkap nada chat tadi, maksudnya aman semua ya atau ada bagian yang perlu dibenahi?',
    ],
    practicalStrategies: [
      'Hindari menebak emosi dari panjang-pendeknya balasan teks.',
      'Biasakan klarifikasi singkat atau pindah ke obrolan suara/tatap muka saat menyangkut isu sensitif.',
    ],
    suggestedDialogue: {
      avoid: 'Kenapa sih jutek banget di grup? Aku salah ya?',
      trySaying:
        'Aku mau pastikan saja soal pesan tadi—apakah bagianku sudah sesuai arah diskusi kita kemarin, atau ada yang perlu kusesuaikan?',
    },
    followUpReflection: [
      'Berapa banyak ketegangan minggu ini yang sebenarnya bersumber dari membaca nada chat tanpa klarifikasi?',
    ],
    responseChoices: [
      {
        id: 'm1',
        label: 'Membalas dengan sindiran dingin "Ya sudah terserah."',
        tone: 'Defensif / Terburu-buru',
        implication: 'Menciptakan konflik nyata dari asumsi yang awalnya belum tentu benar.',
        recommendedAdjustment: 'Tunda membalas saat emosi terpancing dan ajukan pertanyaan klarifikasi netral.',
      },
      {
        id: 'm2',
        label: 'Menghindari grup chat seharian karena takut salah lagi',
        tone: 'Menghindar',
        implication: 'Koordinasi kelompok melambat dan kecemasan makin besar.',
        recommendedAdjustment: 'Kirim pertanyaan singkat yang memverifikasi fakta kerja.',
      },
      {
        id: 'm3',
        label: 'Mengonfirmasi langsung secara netral tanpa menuduh nada',
        tone: 'Kolaboratif / Asertif',
        implication: 'Salah paham cepat selesai dan kepercayaan tetap terjaga.',
        recommendedAdjustment: 'Biasakan memberi konteks singkat pada pesan penting.',
      },
    ],
  },
  {
    id: 'scen-konflik-kelompok',
    topic: 'Konflik kerja kelompok',
    situation:
      'Dua anggota kelompok berdebat keras di meja diskusi: satu ingin langsung menentukan format laporan standar agar cepat selesai, satu lagi ingin mengubah konsep menjadi video interaktif.',
    personAPerspective:
      'Ingin kepastian alur, efisiensi waktu, dan risiko gagal teknis minimal.',
    personBPerspective:
      'Ingin hasil yang kreatif, berkesan, dan memanfaatkan potensi visual tim.',
    communicationDifferences:
      'Ketegangan antara orientasi stabilitas/eksekusi terukur dan orientasi eksplorasi inovasi.',
    potentialMisunderstanding:
      'Pihak pertama dianggap menghambat kreativitas, pihak kedua dianggap tidak realistis terhadap tenggat.',
    alternativeInterpretations: [
      'Keduanya sama-sama ingin kelompok mendapat hasil terbaik, hanya berbeda jalur mitigasi risiko.',
    ],
    clarifyingQuestions: [
      'Apa syarat rubrik wajib dari guru, dan berapa jam waktu realistis yang kita punya sebelum pengumpulan?',
    ],
    practicalStrategies: [
      'Evaluasi opsi berdasarkan kriteria bersama: rubrik penilaian, waktu tersedia, dan keahlian anggota.',
      'Cari titik tengah (misalnya laporan rapi sebagai inti wajib, disertai satu segmen visual ringkas).',
    ],
    suggestedDialogue: {
      avoid: 'Ide kamu ribet banget dan nggak bakal kelar, pakai format biasa aja!',
      trySaying:
        'Ide video itu menarik untuk poin presentasi, tapi aku khawatir waktunya mepet di proses edit. Bagaimana kalau teks laporan inti kita kunci dulu hari ini, lalu kita cek apakah cukup waktu menambah klip ringkas 2 menit?',
    },
    followUpReflection: [
      'Saat berbeda pendapat, apakah kita sudah membandingkan kriteria objektif, bukan sekadar mempertahankan preferensi pribadi?',
    ],
    responseChoices: [
      {
        id: 'kg1',
        label: 'Memaksakan voting cepat tanpa mendengar alasan masing-masing',
        tone: 'Defensif / Terburu-buru',
        implication: 'Pihak yang kalah suara cenderung bekerja setengah hati.',
        recommendedAdjustment: 'Petakan syarat rubrik dan kapasitas waktu bersama selama 5 menit sebelum memilih.',
      },
      {
        id: 'kg2',
        label: 'Mengalah pasif lalu mengeluh di belakang',
        tone: 'Menghindar',
        implication: 'Menggerus kekompakan tim saat pengerjaan berlangsung.',
        recommendedAdjustment: 'Suarakan kekhawatiran teknis secara terbuka sebagai bahan pertimbangan tim.',
      },
      {
        id: 'kg3',
        label: 'Mengajak menguji kedua ide terhadap rubrik tugas dan batas waktu tim',
        tone: 'Kolaboratif / Asertif',
        implication: 'Keputusan menjadi milik bersama berbasis realitas, bukan menang-kalah pribadi.',
        recommendedAdjustment: 'Catat kesepakatan peran setelah keputusan diambil.',
      },
    ],
  },
  {
    id: 'scen-penyelesaian-masalah',
    topic: 'Perbedaan pendekatan penyelesaian masalah',
    situation:
      'Dalam tugas penelitian biologi, Siswa A ingin langsung mencoba eksperimen di laboratorium untuk melihat hasilnya, sementara Siswa B ingin merampungkan seluruh kerangka teori dan variabel kontrol terlebih dahulu.',
    personAPerspective:
      'Belajar lebih cepat lewat uji coba nyata dan memperbaiki kesalahan sambil jalan.',
    personBPerspective:
      'Khawatir percobaan sia-sia dan bahan habis jika kerangka variabelnya belum matang.',
    communicationDifferences:
      'Perbedaan pendekatan empiris-iteratif (action-first) vs deduktif-sistematis (structure-first).',
    potentialMisunderstanding:
      'Gaya coba-langsung tampak ceroboh, gaya perencanaan matang tampak lamban dan berbelit.',
    alternativeInterpretations: [
      'Keduanya saling melengkapi jika dibagi fasenya: kerangka variabel inti cepat -> uji coba skala kecil -> penyempurnaan.',
    ],
    clarifyingQuestions: [
      'Variabel minimal apa yang harus pasti sebelum kita mulai uji coba pertama?',
    ],
    practicalStrategies: [
      'Sepakati "daftar periksa prasyarat minimum" agar perencanaan tidak berlarut dan uji coba tidak ceroboh.',
    ],
    suggestedDialogue: {
      avoid: 'Kamu kebanyakan teori, kapan mulainya kalau mikir terus?',
      trySaying:
        'Aku siap langsung uji coba supaya kita punya data awal, tapi biar tidak mengulang dari nol, boleh bantu tentukan 3 variabel kunci yang wajib kita jaga sebelum mulai?',
    },
    followUpReflection: [
      'Bagaimana cara memadukan kecepatan eksperimen dengan ketelitian perencanaan di kelompokku?',
    ],
    responseChoices: [
      {
        id: 'pm1',
        label: 'Jalan sendiri ke lab tanpa memberi tahu rekan yang masih menyusun rancangan',
        tone: 'Defensif / Terburu-buru',
        implication: 'Data hasil percobaan bisa ditolak karena tidak sesuai desain kontrol.',
        recommendedAdjustment: 'Minta 15 menit menyepakati parameter minimal bersama.',
      },
      {
        id: 'pm2',
        label: 'Menunda eksperimen berminggu-minggu sampai seluruh laporan bab 1-3 sempurna',
        tone: 'Menghindar',
        implication: 'Kehabisan waktu saat hasil lab ternyata memerlukan pengulangan.',
        recommendedAdjustment: 'Bedakan syarat minimum untuk mulai praktik dengan dokumen akhir.',
      },
      {
        id: 'pm3',
        label: 'Membuat kesepakatan prasyarat inti lalu melakukan pilot test kecil bersama',
        tone: 'Kolaboratif / Asertif',
        implication: 'Ketelitian dan momentum kerja berjalan beriringan.',
        recommendedAdjustment: 'Evaluasi hasil pilot test bersama-sama.',
      },
    ],
  },
  {
    id: 'scen-ekspektasi',
    topic: 'Perbedaan ekspektasi',
    situation:
      'Siswa A mengira tugas kelompok cukup dikerjakan sebatas syarat lulus karena jadwal ekskul padat, sedangkan Siswa B menargetkan nilai maksimal untuk portofolio SNBP.',
    personAPerspective:
      'Realistis membagi energi untuk berbagai mata pelajaran dan kegiatan lain.',
    personBPerspective:
      'Menganggap proyek ini sangat menentukan dan berharap komitmen setara dari semua anggota.',
    communicationDifferences:
      'Ekspektasi standar mutu yang tidak pernah diucapkan di awal pembentukan kelompok.',
    potentialMisunderstanding:
      'Siswa A dianggap pemalas; Siswa B dianggap terlalu ambisius dan menuntut.',
    alternativeInterpretations: [
      'Keduanya memiliki prioritas akademik yang sah, hanya tidak menyelaraskannya sejak awal.',
    ],
    clarifyingQuestions: [
      'Target mutu dan waktu kerja seperti apa yang realistis kita sepakati untuk tugas ini?',
    ],
    practicalStrategies: [
      'Bahas ekspektasi target (standar cukup vs sangat mendalam) di rapat pertama.',
      'Jika target berbeda, bagi tugas secara adil sehingga anggota bertarget tinggi tidak memikul porsi dasar sendirian dan anggota sibuk tetap menuntaskan porsi wajib secara tepat waktu.',
    ],
    suggestedDialogue: {
      avoid: 'Kok kamu santai banget sih, nggak peduli nilai ya?',
      trySaying:
        'Aku menargetkan nilai maksimal untuk tugas ini buat portofolio. Menurutmu, pembagian waktu dan porsi seperti apa yang realistis buat kamu di tengah jadwal minggu ini?',
    },
    followUpReflection: [
      'Apakah aku sering mengharapkan standar tertentu tanpa pernah menyatakannya di awal kerja sama?',
    ],
    responseChoices: [
      {
        id: 'ek1',
        label: 'Mengerjakan semuanya diam-diam lalu marah di hari pengumpulan',
        tone: 'Defensif / Terburu-buru',
        implication: 'Melahirkan kelelahan fisik dan dendam interpersonal.',
        recommendedAdjustment: 'Diskusikan ekspektasi porsi secara eksplisit di awal atau pertengahan proses.',
      },
      {
        id: 'ek2',
        label: 'Menurunkan target tanpa diskusi karena sungkan',
        tone: 'Menghindar',
        implication: 'Menyesal kemudian karena tidak memperjuangkan kebutuhan sendiri secara terbuka.',
        recommendedAdjustment: 'Sampaikan target pribadi dengan jujur tanpa memaksa teman menjadi identik.',
      },
      {
        id: 'ek3',
        label: 'Menyelaraskan target standar wajib tim dan menyepakati kontribusi spesifik tiap orang',
        tone: 'Kolaboratif / Asertif',
        implication: 'Kejelasan ekspektasi mengurangi kekecewaan sepihak.',
        recommendedAdjustment: 'Evaluasi progres di tengah jalan.',
      },
    ],
  },
  {
    id: 'scen-emosional',
    topic: 'Komunikasi emosional',
    situation:
      'Salah satu anggota kelompok tampak murung dan menjawab singkat saat rapat. Anggota lain bingung apakah harus menanyakan masalahnya di forum atau membiarkannya saja.',
    personAPerspective:
      'Sedang menghadapi masalah pribadi di rumah dan merasa kewalahan jika ditanya di depan banyak orang.',
    personBPerspective:
      'Khawatir suasana rapat menjadi tidak nyaman dan ingin memastikan apakah suasana murung itu terkait tugas kelompok.',
    communicationDifferences:
      'Perbedaan antara ekspresi emosi terbuka dan pemrosesan emosi secara privat.',
    potentialMisunderstanding:
      'Diam karena lelah pribadi dikira sebagai kemarahan terhadap anggota kelompok.',
    alternativeInterpretations: [
      'Suasana hati seseorang tidak selalu berkaitan dengan interaksi saat itu.',
    ],
    clarifyingQuestions: [
      'Apakah kamu sedang nyaman berdiskusi sekarang, atau butuh jeda sebentar dan nanti kita selaraskan lewat chat pribadi?',
    ],
    practicalStrategies: [
      'Tanyakan secara pribadi dengan nada lembut tanpa memaksa pengungkapan masalah personal.',
    ],
    suggestedDialogue: {
      avoid: 'Kenapa muka kamu ditekuk terus dari tadi? Merusak mood rapat saja.',
      trySaying:
        'Aku perhatikan kamu kelihatan agak capek hari ini. Nggak usah cerita detail kalau belum nyaman—apakah ada beban bagian tugas yang perlu kita bantu atur ulang?',
    },
    followUpReflection: [
      'Bagaimana cara menawarkan empati tanpa melanggar batas privasi teman?',
    ],
    responseChoices: [
      {
        id: 'em1',
        label: 'Mendesak di tengah forum: "Ayo cerita sekarang ada masalah apa!"',
        tone: 'Defensif / Terburu-buru',
        implication: 'Membuat rekan merasa dipermalukan dan makin menutup diri.',
        recommendedAdjustment: 'Tunda pertanyaan personal sampai selesai rapat dan ajak bicara berdua.',
      },
      {
        id: 'em2',
        label: 'Mendiamkan dan mengasumsikan dia marah pada kelompok',
        tone: 'Menghindar',
        implication: 'Melahirkan kecanggungan yang berlarut.',
        recommendedAdjustment: 'Sampaikan pesan singkat yang hangat dan netral setelah rapat.',
      },
      {
        id: 'em3',
        label: 'Menjaga forum tetap tenang lalu mengecek kondisinya secara pribadi dan penuh hormat',
        tone: 'Kolaboratif / Asertif',
        implication: 'Menjaga martabat pribadi sekaligus keberlangsungan kerja tim.',
        recommendedAdjustment: 'Hormati pilihannya jika memang hanya butuh waktu sendiri.',
      },
    ],
  },
  {
    id: 'scen-keputusan',
    topic: 'Pengambilan keputusan bersama',
    situation:
      'Kelompok harus memilih topik karya ilmiah. Dua orang yang paling vokal langsung menyepakati topik A, sementara tiga anggota pendiam sebenarnya punya keberatan teknis.',
    personAPerspective:
      'Anggota vokal mengira kesunyian anggota lain berarti setuju.',
    personBPerspective:
      'Anggota pendiam merasa diskusi bergerak terlalu cepat dan sungkan memotong.',
    communicationDifferences:
      'Perbedaan kecepatan memproses pikiran (berpikir sambil bicara vs berpikir dalam diam sebelum berbicara).',
    potentialMisunderstanding:
      'Kesepakatan semu yang rapuh saat memasuki tahap pelaksanaan.',
    alternativeInterpretations: [
      'Anggota pendiam bukan tidak peduli; mereka sering membutuhkan waktu jeda 1–2 menit atau giliran bicara eksplisit.',
    ],
    clarifyingQuestions: [
      'Sebelum kita kunci topik A, apakah semua sudah sempat melihat risiko teknisnya? Boleh dengar pendapat satu per satu?',
    ],
    practicalStrategies: [
      'Gunakan teknik "round-robin" singkat atau jeda 5 menit penulisan poin sebelum keputusan final dikunci.',
    ],
    suggestedDialogue: {
      avoid: 'Oke fix ya topik A, nggak ada yang keberatan kan?',
      trySaying:
        'Topik A terdengar menjanjikan, tapi sebelum dikunci, ayo kita dengar satu catatan atau pertimbangan singkat dari masing-masing orang.',
    },
    followUpReflection: [
      'Dalam rapat kelompok, apakah aku memberi ruang jeda bagi teman yang memproses ide secara internal?',
    ],
    responseChoices: [
      {
        id: 'kp1',
        label: 'Langsung mencatat topik A karena "yang diam dianggap setuju"',
        tone: 'Defensif / Terburu-buru',
        implication: 'Keberatan muncul belakangan saat pekerjaan sudah setengah jalan.',
        recommendedAdjustment: 'Minta konfirmasi aktif tiap anggota sebelum menutup keputusan.',
      },
      {
        id: 'kp2',
        label: 'Sebagai anggota pendiam, tetap diam lalu mengeluhkan topiknya sulit',
        tone: 'Menghindar',
        implication: 'Tim kehilangan masukan berharga sebelum eksekusi dimulai.',
        recommendedAdjustment: 'Ajukan satu pertanyaan teknis sederhana atau kirim catatan singkat di grup.',
      },
      {
        id: 'kp3',
        label: 'Membuka putaran pendapat singkat 1 menit per anggota sebelum mengetok keputusan',
        tone: 'Kolaboratif / Asertif',
        implication: 'Semua suara terwakili dan komitmen eksekusi jauh lebih kuat.',
        recommendedAdjustment: 'Tuliskan keputusan final beserta alasannya agar jelas bagi semua.',
      },
    ],
  },
  {
    id: 'scen-kontribusi',
    topic: 'Ketidakseimbangan kontribusi',
    situation:
      'Dua hari menjelang pengumpulan makalah, satu anggota baru mengirim satu paragraf singkat sementara anggota lain sudah mengerjakan 80% isi dokumen.',
    personAPerspective:
      'Merasa dibiarkan bekerja sendirian dan menanggung beban ketidakadilan.',
    personBPerspective:
      'Mungkin bingung mulai dari mana, kewalahan materi, atau tidak paham bahwa standar porsinya lebih besar.',
    communicationDifferences:
      'Ketidakjelasan standar kontribusi dan penundaan teguran hingga mendekati tenggat.',
    potentialMisunderstanding:
      'Langsung melabeli teman sebagai "pemalas" tanpa memeriksa apakah ada kebingungan instruksi atau kendala nyata.',
    alternativeInterpretations: [
      'Bisa jadi pembagian bagian awal terlalu kabur ("kamu bagian pembahasan ya") tanpa rincian sub-poin.',
    ],
    clarifyingQuestions: [
      'Bagian mana dari sub-topik ini yang terasa paling membingungkan atau menghambatmu menyelesaikannya?',
    ],
    practicalStrategies: [
      'Tetapkan cek poin tengah (mid-point check-in) dan ubah pembagian tugas menjadi sub-poin konkret lengkap dengan target panjang atau cakupan.',
    ],
    suggestedDialogue: {
      avoid: 'Enak banget ya cuma kirim satu paragraf, kamu niat sekolah nggak sih?',
      trySaying:
        'Aku lihat bagianmu baru satu paragraf, padahal deadline tinggal dua hari. Ada kendala mencari sumbernya? Biar adil buat semua, sore ini kita perlu tambahan 3 poin analisis di bagian B—kamu sanggup selesaikan jam berapa?',
    },
    followUpReflection: [
      'Apakah kelompok kami sudah membuat rincian tugas cukup jelas sejak awal sebelum menilai niat anggota?',
    ],
    responseChoices: [
      {
        id: 'kk1',
        label: 'Mencoret namanya dari sampul tanpa konfirmasi apa pun',
        tone: 'Defensif / Terburu-buru',
        implication: 'Memicu konflik terbuka besar yang sering merembet di luar tugas.',
        recommendedAdjustment: 'Beri peringatan batas waktu jelas dan kesempatan menuntaskan porsi spesifik terlebih dahulu.',
      },
      {
        id: 'kk2',
        label: 'Diam-diam mengerjakan bagiannya agar cepat beres',
        tone: 'Menghindar',
        implication: 'Menormalisasi ketimpangan kontribusi dan memicu kekecewaan terpendam.',
        recommendedAdjustment: 'Sampaikan secara tegas namun tenang porsi minimum yang harus ia kerjakan.',
      },
      {
        id: 'kk3',
        label: 'Mengonfirmasi kendala dan menetapkan target konkret berbatas waktu yang jelas',
        tone: 'Kolaboratif / Asertif',
        implication: 'Memberi kesempatan perbaikan yang adil dengan akuntabilitas terukur.',
        recommendedAdjustment: 'Catat kontribusi nyata setiap anggota secara transparan.',
      },
    ],
  },
  {
    id: 'scen-batasan',
    topic: 'Kesulitan menetapkan batasan',
    situation:
      'Siswa A selalu mengiyakan permintaan tolong mengedit video dan merapikan slide kelompok lain hingga jam tidurnya terganggu dan tugas mandirinya terbengkalai.',
    personAPerspective:
      'Takut dianggap egois, tidak kompak, atau mengecewakan teman jika menolak.',
    personBPerspective:
      'Mengira Siswa A memang senang membantu karena tidak pernah terdengar keberatan.',
    communicationDifferences:
      'Kesulitan mengatakan "tidak" secara asertif berhadapan dengan teman yang menganggap ketersediaan itu nyata.',
    potentialMisunderstanding:
      'Teman mengira bantuan diberikan dengan lapang dada, padahal Siswa A mulai merasa dimanfaatkan.',
    alternativeInterpretations: [
      'Menolak permintaan tambahan bukanlah penolakan terhadap pertemanan, melainkan penjagaan tanggung jawab pribadi.',
    ],
    clarifyingQuestions: [
      'Kalau aku hanya sanggup membantu bagian X atau memberi template-nya saja, apakah itu cukup membantu?',
    ],
    practicalStrategies: [
      'Latih penolakan yang hangat namun jelas: apresiasi kepercayaan teman, nyatakan batas kapasitas dengan jujur, dan tawarkan alternatif terbatas jika memungkinkan.',
    ],
    suggestedDialogue: {
      avoid: 'Iya deh sini aku kerjain lagi... (sambil kesal di dalam hati).',
      trySaying:
        'Terima kasih sudah percaya sama hasil editku. Minggu ini tugasku sendiri lagi padat banget, jadi aku belum bisa bantu ngerjain penuh; paling aku bisa bagikan template-nya supaya kalian bisa langsung pakai.',
    },
    followUpReflection: [
      'Batas sehat apa yang perlu kujaga minggu ini agar aku tetap bisa hadir tulus saat membantu teman?',
    ],
    responseChoices: [
      {
        id: 'bt1',
        label: 'Mengiyakan lagi lalu mendadak menghilang saat kelelahan',
        tone: 'Menghindar',
        implication: 'Justru mengecewakan teman lebih besar daripada menolak sejak awal.',
        recommendedAdjustment: 'Tolak secara jujur di awal ketika kapasitas memang tidak cukup.',
      },
      {
        id: 'bt2',
        label: 'Menolak dengan marah: "Kalian pikir aku tukang edit gratis?"',
        tone: 'Defensif / Terburu-buru',
        implication: 'Memutus hubungan baik karena ledakan emosi yang lama dipendam.',
        recommendedAdjustment: 'Sampaikan batas sebelum rasa kesal menumpuk.',
      },
      {
        id: 'bt3',
        label: 'Menolak porsi penuh dengan sopan sambil menjelaskan batas waktu pribadi',
        tone: 'Kolaboratif / Asertif',
        implication: 'Menjaga kesehatan diri sekaligus tetap menghormati teman.',
        recommendedAdjustment: 'Konsisten pada batas yang sudah diucapkan.',
      },
    ],
  },
  {
    id: 'scen-ruang-pribadi',
    topic: 'Perbedaan kebutuhan akan ruang pribadi',
    situation:
      'Setelah seharian kegiatan sekolah, Siswa A ingin langsung pulang dan menenangkan diri tanpa mengobrol, sedangkan Siswa B (sahabatnya) ingin terus menelepon membahas acara tadi.',
    personAPerspective:
      'Mengisi ulang energi membutuhkan ketenangan fisik dan jeda sosial sejenak.',
    personBPerspective:
      'Mengisi ulang energi justru lewat berbagi cerita langsung; penolakan telepon terasa seperti dijauhi.',
    communicationDifferences:
      'Perbedaan kebutuhan pemulihan energi sosial (jeda tenang vs pemrosesan interaktif).',
    potentialMisunderstanding:
      'Kebutuhan ruang pribadi ditafsirkan sebagai kehilangan ketertarikan atau marah kepada sahabat.',
    alternativeInterpretations: [
      'Menjaga jarak sejenak bukan berarti kualitas kedekatan berkurang.',
    ],
    clarifyingQuestions: [
      'Kalau aku istirahat dulu sampai jam 8 malam lalu kita ngobrol lagi, nyaman buat kamu?',
    ],
    practicalStrategies: [
      'Sertakan kepastian waktu kembali berkomunikasi saat meminta ruang pribadi agar pihak lain merasa aman.',
    ],
    suggestedDialogue: {
      avoid: 'Jangan telepon dulu ah, berisik.',
      trySaying:
        'Hari ini acaranya seru banget tapi energiku lagi habis. Aku butuh tenang sekitar dua jam buat istirahat dulu ya—nanti jam 8 aku chat lagi buat dengerin ceritamu!',
    },
    followUpReflection: [
      'Apakah aku sudah menjelaskan kebutuhan ruang pribadiku dengan kalimat yang menenangkan kepastian hubungan?',
    ],
    responseChoices: [
      {
        id: 'rp1',
        label: 'Mematikan ponsel tanpa kabar seharian',
        tone: 'Menghindar',
        implication: 'Membuat teman cemas atau menduga ada kesalahan yang ia lakukan.',
        recommendedAdjustment: 'Kirim pesan 1 kalimat singkat tentang kebutuhan istirahat dan kapan akan kembali.',
      },
      {
        id: 'rp2',
        label: 'Memaksa diri menelepon sambil kesal dan menjawab singkat',
        tone: 'Defensif / Terburu-buru',
        implication: 'Percakapan menjadi tidak hangat dan energi makin terkuras.',
        recommendedAdjustment: 'Pilih jeda singkat lebih dulu demi kualitas obrolan yang lebih baik.',
      },
      {
        id: 'rp3',
        label: 'Meminta jeda pemulihan energi disertai janji waktu menyambung kembali',
        tone: 'Kolaboratif / Asertif',
        implication: 'Kebutuhan kedua pihak sama-sama dihormati.',
        recommendedAdjustment: 'Tepati janji waktu menghubungi kembali.',
      },
    ],
  },
  {
    id: 'scen-dukungan',
    topic: 'Perbedaan cara memberikan dukungan',
    situation:
      'Menjelang lomba debat, Siswa A gugup dan menyemangati tim dengan bercanda agar rileks, sementara Siswa B justru menganggap candaan itu tanda kurang serius dan butuh latihan ulang materi.',
    personAPerspective:
      'Berusaha menurunkan ketegangan agar tim tidak kaku saat tampil.',
    personBPerspective:
      'Merasa tenang justru ketika kesiapan argumen dan data sudah dipastikan ulang.',
    communicationDifferences:
      'Cara membangun rasa percaya diri berbeda: regulasi suasana santai vs kesiapan penguasaan teknis.',
    potentialMisunderstanding:
      'Candaan dicap menyepelekan lomba; ajakan latihan ulang dicap menambah kepanikan.',
    alternativeInterpretations: [
      'Keduanya sedang berusaha mengatasi rasa gugup menjelang tampil dengan strategi yang berbeda.',
    ],
    clarifyingQuestions: [
      'Menjelang tampil nanti, apa yang paling bikin kamu tenang: latihan cek poin 10 menit atau santai dulu?',
    ],
    practicalStrategies: [
      'Sepakati sesi ganda singkat: 10 menit cek poin inti untuk menenangkan sisi persiapan, diikuti 5 menit peregangan santai.',
    ],
    suggestedDialogue: {
      avoid: 'Serius dikit kenapa sih, bentar lagi lomba masih aja bercanda!',
      trySaying:
        'Senang lihat suasananya jadi nggak kaku. Biar aku juga lebih tenang sebelum naik panggung, boleh kita cek ulang tiga argumen inti selama 10 menit dulu, habis itu kita santai bareng?',
    },
    followUpReflection: [
      'Bagaimana cara tim kami menyatukan kesiapan teknis dan ketenangan suasana sebelum momen penting?',
    ],
    responseChoices: [
      {
        id: 'dk1',
        label: 'Menegur keras di depan tim bahwa teman tidak punya tanggung jawab',
        tone: 'Defensif / Terburu-buru',
        implication: 'Meningkatkan kecemasan seluruh tim tepat sebelum tampil.',
        recommendedAdjustment: 'Ajak menyepakati durasi cek poin singkat secara tenang.',
      },
      {
        id: 'dk2',
        label: 'Menjauh ke sudut ruangan karena merasa tim tidak satu visi',
        tone: 'Menghindar',
        implication: 'Mengurangi kekompakan tim saat diskusi pembuka.',
        recommendedAdjustment: 'Sampaikan kebutuhan kesiapan pribadi secara sederhana.',
      },
      {
        id: 'dk3',
        label: 'Menggabungkan sesi cek inti singkat dengan jeda relaksasi bersama',
        tone: 'Kolaboratif / Asertif',
        implication: 'Mengakomodasi kebutuhan persiapan teknis dan ketenangan suasana sekaligus.',
        recommendedAdjustment: 'Hormati cara regulasi gugup tiap anggota.',
      },
    ],
  },
];

export interface SubjectStudyGuide {
  subject: string;
  coreChallenges: string[];
  recommendedMethods: {
    method: string;
    whyItWorks: string;
    howToApply: string;
  }[];
  groupCollaborationIdea: string;
}

export const SMA_SUBJECT_GUIDES: SubjectStudyGuide[] = [
  {
    subject: 'Matematika',
    coreChallenges: ['Menghafal rumus tanpa memahami penurunan konsep', 'Panik saat bentuk soal divariasikan'],
    recommendedMethods: [
      {
        method: 'Worked Examples (Analisis Contoh Terpecah)',
        whyItWorks: 'Mengurangi beban kognitif awal sebelum mengerjakan soal mandiri (Sweller & Dunlosky).',
        howToApply: 'Pelajari 2 contoh soal dengan menutup langkah demi langkah dan jelaskan mengapa tiap langkah sah secara aljabar/logika.',
      },
      {
        method: 'Interleaved Practice Problems',
        whyItWorks: 'Melatih otak memilih strategi yang tepat, bukan sekadar meniru pola satu bab.',
        howToApply: 'Campurkan 5–8 soal dari sub-bab berbeda dalam satu sesi latihan lalu catat pemicu pemilihan rumusnya.',
      },
    ],
    groupCollaborationIdea: 'Pasangkan siswa untuk saling menjelaskan alasan memilih rumus tertentu sebelum menghitung angka akhir.',
  },
  {
    subject: 'Fisika',
    coreChallenges: ['Kesulitan menerjemahkan soal cerita ke diagram fisis', 'Tertukar antar-satuan dan vektor'],
    recommendedMethods: [
      {
        method: 'Visual Diagrams (Diagram Bebas Benda / Sketsa)',
        whyItWorks: 'Memperjelas hubungan gaya, arah gerak, dan variabel sebelum masuk ke persamaan matematis.',
        howToApply: 'Selalu gambar sketsa situasi, arah panah gaya/kecepatan, dan daftar besaran diketahui sebelum menulis rumus.',
      },
      {
        method: 'Teaching-Back Konseptual',
        whyItWorks: 'Menguji pemahaman prinsip fisis (mengapa terjadi), bukan sekadar substitusi angka.',
        howToApply: 'Jelaskan fenomena soal dengan kalimat sehari-hari tanpa menyebut satu rumus pun selama 1 menit.',
      },
    ],
    groupCollaborationIdea: 'Satu anggota menggambar diagram fisis, anggota lain memverifikasi asumsi hukum fisika yang berlaku.',
  },
  {
    subject: 'Kimia',
    coreChallenges: ['Menghubungkan level makroskopik, submikroskopik (molekul), dan simbolik (persamaan reaksi)'],
    recommendedMethods: [
      {
        method: 'Concept Mapping Reaksi & Stoikiometri',
        whyItWorks: 'Membantu melihat keterkaitan antar konsep mol, konsentrasi, laju reaksi, dan kesetimbangan.',
        howToApply: 'Buat peta alur konversi mol di satu halaman lalu uji pada tiga tipe reaksi berbeda.',
      },
      {
        method: 'Spaced Repetition Tabel & Tren Periodik',
        whyItWorks: 'Menguatkan retensi jangka panjang konsep dasar tanpa sistem kebut semalam.',
        howToApply: 'Uji diri singkat 10 menit pada hari ke-1, ke-3, dan ke-7 menggunakan kartu konsep.',
      },
    ],
    groupCollaborationIdea: 'Diskusikan prediksi perubahan kesetimbangan atau reaksi asam-basa melalui studi kasus sehari-hari.',
  },
  {
    subject: 'Biologi',
    coreChallenges: ['Banyaknya istilah teknis dan alur proses fisiologis bertahap'],
    recommendedMethods: [
      {
        method: 'Active Recall Berbasis Diagram Proses',
        whyItWorks: 'Jauh lebih efektif daripada sekadar membaca ulang atau menggarisbawahi buku teks.',
        howToApply: 'Tutup label pada diagram organ/siklus metabolisme, lalu gambar ulang alurnya dari ingatan dan cek kekurangannya.',
      },
      {
        method: 'Structured Notes (Sebab -> Mekanisme -> Dampak)',
        whyItWorks: 'Mengubah daftar istilah terpisah menjadi cerita mekanisme biologis yang masuk akal.',
        howToApply: 'Ringkas setiap sistem tubuh dalam tiga kolom: Pemicu, Mekanisme Seluler/Organ, dan Dampak Homeostasis.',
      },
    ],
    groupCollaborationIdea: 'Bagi sub-sistem proses antaranggota kelompok lalu lakukan sesi saling mengajar selama 5 menit per orang.',
  },
  {
    subject: 'Ekonomi',
    coreChallenges: ['Menghubungkan grafik permintaan/penawaran atau neraca akuntansi dengan berita aktual'],
    recommendedMethods: [
      {
        method: 'Worked Examples Akuntansi & Kurva Kausal',
        whyItWorks: 'Mencegah kesalahan pencatatan debit-kredit serta pergeseran kurva vs pergerakan di sepanjang kurva.',
        howToApply: 'Untuk setiap berita kebijakan ekonomi, gambar pergeseran kurvanya dan jelaskan tiga dampaknya.',
      },
      {
        method: 'Discussion Studi Kasus Aktual',
        whyItWorks: 'Membiasakan analisis dampak ganda suatu kebijakan pada produsen, konsumen, dan pemerintah.',
        howToApply: 'Ambil satu isu inflasi atau UMKM, lalu debat dampak positif dan risikonya dari sudut data.',
      },
    ],
    groupCollaborationIdea: 'Simulasikan peran pemangku kepentingan berbeda saat menganalisis kebijakan anggaran atau pasar.',
  },
  {
    subject: 'Sejarah',
    coreChallenges: ['Mengingat kronologi tanpa memahami hubungan sebab-akibat dan konteks sosial'],
    recommendedMethods: [
      {
        method: 'Garis Waktu Visual & Peta Konsep Kausalitas',
        whyItWorks: 'Menempatkan peristiwa dalam jaringan sebab-akibat struktural, bukan tanggal terisolasi.',
        howToApply: 'Buat garis waktu tematik yang memisahkan faktor pemicu jangka panjang, pemicu langsung, dan dampak.',
      },
      {
        method: 'Teaching-Back Multi-Perspektif',
        whyItWorks: 'Melatih berpikir historis dengan melihat sudut pandang berbagai kelompok pelaku sejarah.',
        howToApply: 'Ceritakan ulang satu peristiwa penting dalam 3 menit dengan menyoroti motif para tokohnya.',
      },
    ],
    groupCollaborationIdea: 'Susun lini masa kolaboratif dan uji keakuratan sumber primer/sekunder bersama.',
  },
  {
    subject: 'Bahasa Indonesia',
    coreChallenges: ['Menyusun argumen esai yang runtut, kalimat efektif, dan memahami makna tersirat teks'],
    recommendedMethods: [
      {
        method: 'Structured Notes Kerangka Paragraf (Klaim-Bukti-Penalaran)',
        whyItWorks: 'Menghindari tulisan melebar dan memperkuat kohesi antarparagraf.',
        howToApply: 'Sebelum menulis esai utuh, tulis kalimat topik tiap paragraf dalam 5 baris untuk diuji alurnya.',
      },
      {
        method: 'Peer Discussion & Umpan Balik Pembaca',
        whyItWorks: 'Mengetahui apakah maksud tulisan benar-benar terbaca jelas oleh orang lain.',
        howToApply: 'Tukarkan draf tulisan dengan satu teman lalu minta ia merangkum gagasan utamamu dalam dua kalimat.',
      },
    ],
    groupCollaborationIdea: 'Lakukan sesi penyuntingan silang untuk memeriksa koherensi argumen dan kejelasan ejaan.',
  },
  {
    subject: 'Bahasa Inggris',
    coreChallenges: ['Kesenjangan antara pemahaman pasif (membaca) dan produksi aktif (berbicara/menulis)'],
    recommendedMethods: [
      {
        method: 'Active Recall Kosakata dalam Kalimat Kontekstual',
        whyItWorks: 'Memori bertahan jauh lebih kuat ketika kata dipelajari dalam konteks penggunaan nyata.',
        howToApply: 'Alih-alih menghafal daftar kata tunggal, buat dua kalimat orisinal yang relevan dengan keseharian sekolah.',
      },
      {
        method: 'Spaced Repetition + Short Speaking Discussion',
        whyItWorks: 'Mengurangi rasa gugup berbicara melalui paparan rutin berisiko rendah.',
        howToApply: 'Latihan ringkas 10 menit merangkum artikel pendek secara lisan bersama rekan belajar.',
      },
    ],
    groupCollaborationIdea: 'Bentuk pasangan latihan dialog tematik dengan umpan balik konstruktif pada kejelasan pesan, bukan sekadar aksen.',
  },
  {
    subject: 'Mata Pelajaran Lainnya (Informatika, Sosiologi, Geografi, Seni)',
    coreChallenges: ['Menyeimbangkan pemahaman konsep teori dengan praktik proyek atau pemodelan'],
    recommendedMethods: [
      {
        method: 'Active Recall & Proyek Mini Bertahap',
        whyItWorks: 'Menguji pemahaman secara nyata lewat penerapan langsung dan evaluasi mandiri.',
        howToApply: 'Setiap selesai mempelajari 1 konsep, buat contoh terapan mini atau soal buatan sendiri beserta kunci penjelasannya.',
      },
      {
        method: 'Visual Diagrams & Structured Notes',
        whyItWorks: 'Memperjelas keterkaitan antarkomponen sistem atau fenomena spasial/sosial.',
        howToApply: 'Gabungkan sketsa alur atau peta keterkaitan dengan ringkasan poin kunci 1 halaman.',
      },
    ],
    groupCollaborationIdea: 'Rancang pembagian peran kelompok berdasarkan minat keterampilan, kapasitas beban kerja, dan kesepakatan bersama.',
  },
];

export interface AcademicChallengeGuide {
  id: string;
  challenge: string;
  rootCauses: string[];
  practicalStrategies: string[];
}

export const ACADEMIC_COLLABORATION_CHALLENGES: AcademicChallengeGuide[] = [
  {
    id: 'ac-1',
    challenge: 'Ketidakseimbangan kontribusi anggota',
    rootCauses: [
      'Pembagian tugas terlalu umum sehingga beberapa orang bingung harus mulai dari mana.',
      'Tidak adanya titik pengecekan progres di tengah pengerjaan.',
    ],
    practicalStrategies: [
      'Ubah tugas besar menjadi daftar tugas spesifik dengan penanggung jawab dan indikator selesai.',
      'Lakukan pengecekan progres singkat di pertengahan waktu, bukan baru memeriksa H-1.',
    ],
  },
  {
    id: 'ac-2',
    challenge: 'Perbedaan pendekatan belajar dalam satu tim',
    rootCauses: [
      'Sebagian anggota butuh baca mandiri dulu, sementara sebagian lain langsung belajar lewat diskusi lisan.',
    ],
    practicalStrategies: [
      'Berikan waktu baca mandiri 15 menit di awal pertemuan sebelum sesi diskusi kelompok dimulai.',
      'Gabungkan ringkasan tertulis singkat untuk pembaca visual dan penjelasan lisan singkat untuk pembelajar verbal.',
    ],
  },
  {
    id: 'ac-3',
    challenge: 'Konflik pengambilan keputusan topik atau metode',
    rootCauses: [
      'Keputusan diambil berdasarkan siapa paling keras bersuara, bukan kriteria tugas.',
    ],
    practicalStrategies: [
      'Gunakan matriks kriteria sederhana: kesesuaian rubrik guru, ketersediaan waktu, dan kecukupan sumber daya.',
    ],
  },
  {
    id: 'ac-4',
    challenge: 'Kesalahpahaman akibat gaya komunikasi berbeda',
    rootCauses: [
      'Gaya lugas dikira marah; gaya tenang/diam dikira tidak peduli.',
    ],
    practicalStrategies: [
      'Sepakati aturan umpan balik: fokus pada isi karya, bukan penilaian pribadi, dan biasakan klarifikasi.',
    ],
  },
  {
    id: 'ac-5',
    challenge: 'Perbedaan kecepatan kerja',
    rootCauses: [
      'Anggota yang cepat selesai merasa terhambat oleh anggota yang masih meneliti detail atau sibuk di jadwal lain.',
    ],
    practicalStrategies: [
      'Buat struktur tugas modular sehingga bagian yang tidak saling menunggu bisa diselesaikan paralel dengan tenggat antara yang jelas.',
    ],
  },
  {
    id: 'ac-6',
    challenge: 'Ketidakjelasan tanggung jawab',
    rootCauses: [
      'Banyak tugas dikira "dikerjakan bersama" sehingga akhirnya tidak ada yang merasa bertanggung jawab penuh.',
    ],
    practicalStrategies: [
      'Tetapkan satu penanggung jawab utama (PIC) per tugas beserta satu peninjau (reviewer). Peran didasarkan pada kompetensi, minat, beban kerja, dan persetujuan—bukan tipe kepribadian.',
    ],
  },
  {
    id: 'ac-7',
    challenge: 'Kesulitan koordinasi tenggat waktu',
    rootCauses: [
      'Seluruh pengerjaan ditumpuk ke tenggat akhir guru tanpa menyisakan waktu penyuntingan dan penggabungan.',
    ],
    practicalStrategies: [
      'Tetapkan tenggat internal tim minimal 2 hari lebih awal dari tenggat guru khusus untuk integrasi dan pemeriksaan mutu.',
    ],
  },
];
