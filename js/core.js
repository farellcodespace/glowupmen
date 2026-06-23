/* =========================================================
   GlowUp Men — core.js (loaded FIRST)
   Data constants, storage, state, date utils, icons, theme,
   navigation/router meta, showToast.
========================================================= */

/* ============ DATA ============ */
const TYPES = {
  pull:  {label:'Pull',  focus:'Back & Biceps',                   cls:'b-pull',  tcls:'t-pull'},
  push:  {label:'Push',  focus:'Chest, Shoulders & Triceps',      cls:'b-push',  tcls:'t-push'},
  upper: {label:'Upper', focus:'Full Upper Body',                 cls:'b-upper', tcls:'t-upper'},
  lower: {label:'Lower', focus:'Quad Heavy, Hamstrings & Core',   cls:'b-lower', tcls:'t-lower'},
  legs:  {label:'Legs & Abs', focus:'Quad Heavy',                 cls:'b-legs',  tcls:'t-legs'},
};
// weekday: 0 Sun ... 6 Sat
const SCHEDULE = {0:'rest',1:'upper',2:'lower',3:'rest',4:'push',5:'pull',6:'legs'};
const DAY_ID = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

const uni = "Mulai kanan dulu, lalu kiri dengan beban sama.";
const WORKOUTS = {

  upper:[
    {n:"Iso-Lateral Chest Press",eq:"Machine",m:"Middle Chest",c:true,rec:"1 warmup + 3×8–10 rep",u:false,sw:20,
     how:"Duduk tegak di mesin, dorong handle ke depan hingga hampir lurus lalu kembali perlahan sampai stretch terasa di dada. Setiap tangan bekerja sendiri-sendiri.",
     tip:"Turunkan perlahan 2–3 detik. Rasakan stretch di dada bawah sebelum dorong balik. Jaga bahu tetap menempel di sandaran.",
     why:"Mesin iso-lateral memberi stretch dada yang dalam sambil menjaga gerakan stabil — ideal untuk pemula bangun mind-muscle connection dada. EMG studies menunjukkan chest press machine aktivasi pec major setara barbell press."},
    {n:"Lat Pulldown",eq:"Cable machine",m:"Lats & Upperback",c:true,rec:"1 warmup + 3×8–10 rep",u:false,sw:35,
     how:"Duduk dengan paha dikunci di bawah pad. Tarik bar ke dada atas sambil membuka dada ke depan. Turunkan perlahan dengan kontrol penuh — biarkan lengan lurus sempurna di atas untuk stretch lat maksimal.",
     tip:"Bayangkan 'siku ke saku celana' bukan menarik dengan tangan. Jangan potong range of motion di atas — stretch penuh di posisi atas adalah kunci hipertrofi lat.",
     why:"Vertical pull adalah cara terbaik membangun lebar lat (V-taper). Research terbaru (Maeo 2023) menunjukkan otot yang dilatih di posisi stretch paling panjang menghasilkan hipertrofi signifikan lebih besar."},
    {n:"Incline Dumbbell Press",eq:"Dumbbell + incline bench 30°",m:"Upper Chest",c:true,rec:"3×10 rep",u:false,sw:10,
     how:"Set bangku 30 derajat (bukan lebih tinggi). Baring, dorong dumbell ke atas hingga hampir bertemu, turunkan sampai stretch terasa di dada atas.",
     tip:"30° adalah sudut optimal — lebih tinggi dari itu beban pindah ke bahu (front delt). Dumbell lebih baik dari barbell karena ROM lebih dalam di bawah.",
     why:"EMG studies membuktikan incline press di 30° aktivasi upper pec paling tinggi. Upper chest sering tertinggal — ini mengisi celah yang tidak bisa dijangkau flat press."},
    {n:"Seated Cable Row",eq:"Cable machine",m:"Mid Back & Rhomboid",c:true,rec:"3×10 rep",u:false,sw:35,
     how:"Duduk tegak, biarkan lengan fully extend ke depan (stretch penuh), tarik handle ke perut bawah sambil meremas tulang belikat, tahan 1 detik, kembali perlahan.",
     tip:"Jangan ayun punggung bawah. Range full dari stretch di depan hingga kontraksi di belakang — jangan potong salah satu sisi. Ini yang membedakan efektivitasnya.",
     why:"Horizontal row membangun ketebalan mid-back. Cable memberi tension konstan di seluruh range — termasuk di posisi stretch penuh yang sering hilang pada dumbbell row."},
    {n:"Shoulder Press Machine (Plates)",eq:"Machine",m:"Front & Side Delts",c:true,rec:"1 warmup + 3×10 rep",u:false,sw:20,
     how:"Duduk tegak, dorong handle ke atas hingga hampir lurus, turunkan setinggi telinga atau sampai bahu sedikit stretch.",
     tip:"Jangan kunci siku keras di puncak — jaga tension. Machine lebih aman dari dumbbell untuk pemula karena gerakan terpandu sehingga bisa fokus ke progressive overload.",
     why:"Overhead press adalah driver terbaik untuk volume front delt. Versi machine memungkinkan progressive overload aman tanpa butuh stabilisasi ekstra yang menguras energi."},
    {n:"Pec Deck",eq:"Machine",m:"Full Chest — isolation",c:false,rec:"3×12–15 rep",u:false,sw:30,
     how:"Atur handle setinggi dada, dekatkan kedua lengan di depan dada seperti memeluk, tahan 1 detik, buka perlahan untuk stretch maksimal.",
     tip:"Siku sedikit menekuk sepanjang gerakan. Tahan di posisi tertutup untuk kontraksi puncak. Buka perlahan — fase eksentrik ini yang paling penting untuk pertumbuhan.",
     why:"Landmark EMG study (Schanke 2012) membuktikan Pec Deck mengaktivasi pectoralis major setara barbell bench press — dengan risiko cedera jauh lebih rendah. Stretch penuh di posisi terbuka adalah driver utama hipertrofi."},
    {n:"Single Arm Cable Lateral Raise",eq:"Cable machine",m:"Side Delts",c:false,rec:"3×15 rep",u:true,sw:5,
     how:"Berdiri menyamping ke mesin, kabel melewati depan tubuh. Angkat handle ke samping setinggi bahu dengan siku sedikit menekuk. Turunkan perlahan. Kanan dulu lalu kiri beban sama.",
     tip:"Mulai dari posisi kabel menyilang tubuh — ini memberi stretch side delt di bawah yang tidak bisa didapat dari dumbbell lateral raise. Pimpin dengan siku, bukan tangan.",
     why:"Cable lateral raise dengan posisi kabel menyilang memberi tension di posisi stretch (bawah) yang hilang pada dumbbell. Research menunjukkan ini superior untuk hipertrofi side delt — side delt adalah kunci lebar bahu."},
    {n:"Facepull",eq:"Cable machine",m:"Rear Delts & Rotator Cuff",c:false,rec:"3×15 rep",u:false,sw:15,
     how:"Set kabel setinggi wajah, pakai rope attachment. Tarik ke arah dahi sambil memutar pergelangan keluar (jempol ke arah telinga). Tahan 1 detik di kontraksi.",
     tip:"Pakai beban ringan — ini bukan tentang berat. Prioritaskan external rotation di puncak gerakan. Rear delt dan rotator cuff butuh volume tinggi dengan beban terkontrol.",
     why:"Rear delt adalah otot yang paling sering tertinggal dan paling penting untuk keseimbangan bahu jangka panjang. Facepull juga melatih rotator cuff — proteksi sendi bahu dari cedera overuse."},
    {n:"Overhead Cable Triceps Extension",eq:"Cable machine",m:"Triceps Long Head",c:false,rec:"3×10–12 rep",u:false,sw:15,
     how:"Hadap menjauh dari cable rendah, pakai rope. Bawa tali ke belakang kepala, luruskan lengan ke atas-depan. Turunkan sampai stretch terasa di bagian dalam lengan atas.",
     tip:"Jaga siku tetap tinggi dan sempit — jangan biarkan melebar. Turunkan perlahan untuk stretch maksimal. Ini adalah posisi di mana long head triceps paling ter-stretch.",
     why:"European Journal of Sport Science 2023: triceps hypertrophy jauh lebih besar pada overhead extension vs neutral position. Long head (terbesar dari 3 kepala triceps) hanya bisa dilatih optimal dalam posisi overhead karena melewati sendi bahu."},
    {n:"Behind the Back Dumbbell Curl",eq:"Dumbbell",m:"Biceps Long Head (lengthened position)",c:false,rec:"3×10–12 rep",u:true,sw:8,
     how:"Berdiri tegak, biarkan lengan menggantung ke belakang badan sepenuhnya hingga biceps terasa stretch maksimal. Curl perlahan ke atas tanpa menggerakkan siku ke depan, tahan sebentar di puncak, turunkan dengan kontrol. Kerjakan kanan dulu, lalu kiri dengan beban sama.",
     tip:"Posisi lengan di belakang badan sebelum mulai curl adalah kuncinya — semakin ke belakang posisi start, semakin dalam stretchnya. Jangan terburu-buru naik, rasakan stretch biceps di posisi bawah dulu sebelum curl.",
     why:"Gerakan ini menempatkan biceps di posisi stretched pada shoulder joint (shoulder hyperextension), identik dengan prinsip Bayesian curl namun menggunakan dumbbell. Penelitian terbaru menunjukkan biceps yang dilatih di posisi stretched menghasilkan hipertrofi signifikan lebih besar dibanding curl biasa karena stimulus mekanik pada posisi elongasi lebih tinggi."},
  ],

  lower:[
    {n:"Hack Squat",eq:"Machine",m:"Quads dominant",c:true,rec:"1 warmup + 3×8–10 rep",u:false,sw:40,
     how:"Sandar di pad, kaki selebar bahu di posisi tengah atau bawah platform. Turun hingga paha sejajar lantai atau lebih dalam jika mobilitas memungkinkan, dorong naik tanpa mengunci lutut.",
     tip:"Kedalaman lebih = stretch quad lebih dalam = lebih banyak hipertrofi. Kaki lebih rendah di platform menekankan quad. Turunkan perlahan 2–3 detik.",
     why:"Hack squat mensimulasikan squat dengan punggung terlindungi — memungkinkan overload quad berat secara aman. Semakin dalam squatnya, semakin banyak stretch quad yang menghasilkan pertumbuhan."},
    {n:"Leg Press Lying (kaki rendah)",eq:"Machine",m:"Quads & Glutes",c:true,rec:"3×10–12 rep",u:false,sw:60,
     how:"Kaki posisi rendah di platform, turunkan hingga lutut 90° atau lebih, dorong kuat tanpa mengunci lutut di atas.",
     tip:"Kaki rendah menggeser fokus ke quad. Turunkan sejauh mobilitas memungkinkan — range penuh lebih baik dari setengah range dengan beban lebih berat.",
     why:"Volume tambahan untuk quad setelah hack squat. Leg press memungkinkan overload berat dengan aman dan bisa diatur range sesuai kemampuan mobilitas pemula."},
    {n:"Lying Leg Curl",eq:"Machine",m:"Hamstrings isolation",c:false,rec:"3×12 rep",u:false,sw:25,
     how:"Telungkup di mesin, biarkan kaki fully extended untuk stretch hamstring maksimal. Tekuk tumit ke arah bokong dengan kontrol, tahan sebentar, turunkan PERLAHAN.",
     tip:"Fase menurun (eksentrik) adalah yang paling penting. Turunkan 3–4 detik. Jangan angkat pinggul dari pad — itu artinya beban terlalu berat.",
     why:"Lying leg curl melatih hamstring di posisi yang paling di-stretch (posisi lutut lurus). Penelitian menunjukkan latihan hamstring di posisi stretched (lutut lurus) menghasilkan hipertrofi lebih besar dari posisi semi-fleksi."},
    {n:"Hip Abductor Machine (open)",eq:"Machine",m:"Glute Medius & Outer Hip",c:false,rec:"3×15 rep",u:false,sw:30,
     how:"Duduk di mesin, condong sedikit ke depan dari pinggang. Buka kedua kaki melawan pad secara terkontrol, tahan 1 detik di posisi terbuka, kembali perlahan.",
     tip:"Condong ke depan penting — posisi ini mengaktifkan glute medius lebih dari duduk tegak. Kontrol fase kembali (menutup) sama pentingnya.",
     why:"Glute medius adalah otot yang memberi bentuk pinggul dan stabilitas panggul saat latihan kaki berat. Sering terabaikan tapi penting untuk keseimbangan estetis dan performa."},
    {n:"Standing Calf Raise (Leg Press Berdiri)",eq:"Standing leg press machine",m:"Gastrocnemius & Soleus",c:false,rec:"4×15–20 rep",u:false,sw:40,
     how:"Posisikan ujung kaki di edge platform. Turunkan tumit sejauh mungkin untuk stretch maksimal, lalu dorong naik sampai jinjit penuh, tahan 1 detik di atas.",
     tip:"Dua titik kritis: stretch penuh di bawah dan kontraksi penuh di atas. Tanpa keduanya, calf tidak akan tumbuh. Gunakan beban yang memungkinkan full range.",
     why:"Standing position merekrut gastrocnemius optimal karena lutut lurus. Full range of motion dengan pause di stretch dan kontraksi adalah metode yang terbukti paling efektif untuk calf hypertrophy."},
    {n:"Weighted Sit Up",eq:"Decline bench + plate",m:"Rectus Abdominis",c:false,rec:"3×15 rep",u:false,sw:0,
     how:"Posisikan diri di decline bench, kaki terkunci. Pegang plate di dada atau di belakang kepala. Naik dengan melengkungkan tulang belakang dari bawah ke atas — bukan dengan menarik leher. Turunkan perlahan dengan kontrol penuh sampai punggung hampir menyentuh bench.",
     tip:"Fase turun (eksentrik) sama pentingnya dengan naik — jangan biarkan jatuh bebas. Untuk menambah intensitas, pindahkan plate ke belakang kepala. Sesi pertama coba tanpa plate dulu — tambah beban setelah bisa 15 rep dengan kontrol penuh.",
     why:"Weighted sit up di decline bench memungkinkan progressive overload pada abs — kunci untuk hipertrofi otot perut jangka panjang. Dengan menambah berat plate tiap beberapa minggu, stimulus terus meningkat jauh melampaui bodyweight crunch biasa."},
    {n:"Rotary Torso Machine",eq:"Machine",m:"Obliques",c:false,rec:"3×15 rep per sisi",u:false,sw:20,
     how:"Duduk tegak, putar torso melawan tahanan dengan kontrol penuh. Kembali perlahan — jangan biarkan beban menarik balik terlalu cepat.",
     tip:"Gerakan lambat, hindari momentum. Kedua sisi sama jumlah setnya.",
     why:"Oblique terlatih langsung memberikan definisi samping perut dan melindungi tulang belakang saat gerakan compound berat."},
  ],

  push:[
    {n:"Iso-Lateral Chest Press",eq:"Machine",m:"Middle Chest",c:true,rec:"1 warmup + 3×8–10 rep",u:false,sw:20,
     how:"Duduk tegak, dorong handle ke depan hingga hampir lurus, turunkan perlahan sampai stretch terasa. Setiap tangan independen.",
     tip:"Ini gerakan compound utama Push day. Fokus pada stretch di bawah dan kontraksi penuh. Progressive overload tiap minggu.",
     why:"Primary chest compound untuk Push day — sama seperti Upper tapi dengan volume lebih dan intensitas lebih tinggi karena ini dedicated push session."},
    {n:"Smith Machine Bench Press",eq:"Smith Machine + flat bench",m:"Full Chest — compound",c:true,rec:"1 warmup + 3×8–10 rep",u:false,sw:40,
     how:"Berbaring di flat bench di bawah Smith Machine. Atur bar setinggi lengan sedikit ditekuk saat dipegang. Turunkan bar ke dada tengah-bawah dengan kontrol 2–3 detik, rasakan stretch dada, dorong kembali ke atas hingga hampir lurus. Kunci safety sebelum mulai.",
     tip:"Smith Machine memberi jalur gerakan terpandu — manfaatkan ini untuk fokus ke kontraksi dada tanpa khawatir keseimbangan. Lebar grip sedikit lebih lebar dari bahu. Turunkan sampai bar hampir menyentuh dada untuk ROM penuh.",
     why:"Bench press adalah compound movement terbaik untuk volume chest secara keseluruhan. Versi Smith Machine memungkinkan progressive overload aman dan konsisten untuk pemula karena gerakan terpandu — tanpa butuh spotter dan risiko drop bar jauh lebih kecil dari free barbell."},
    {n:"Pec Deck",eq:"Machine",m:"Full Chest — isolation",c:false,rec:"3×12–15 rep",u:false,sw:30,
     how:"Atur handle setinggi dada, dekatkan kedua lengan di depan, tahan 1 detik, buka perlahan untuk stretch. Rasakan stretch di setiap rep.",
     tip:"Jangan terlalu cepat. Fase eksentrik (membuka) adalah yang paling penting untuk pertumbuhan dada.",
     why:"Pec Deck menyempurnakan volume dada dengan isolasi murni — stretch dalam tanpa tekanan sendi yang berlebihan seperti pada press."},
    {n:"Shoulder Press Machine (Plates)",eq:"Machine",m:"Front & Side Delts",c:true,rec:"1 warmup + 3×10 rep",u:false,sw:20,
     how:"Duduk tegak, dorong handle ke atas, turunkan setinggi telinga. Kontrol penuh naik dan turun.",
     tip:"Compound shoulder untuk Push day. Focus ke progressive overload mingguan.",
     why:"Overhead press mengaktivasi front delt dan upper trap secara langsung — kunci volume bahu pada Push day."},
    {n:"Single Arm Cable Lateral Raise",eq:"Cable machine",m:"Side Delts",c:false,rec:"3×15 rep",u:true,sw:5,
     how:"Kabel menyilang depan tubuh. Angkat handle ke samping setinggi bahu, turunkan perlahan. Kanan dulu lalu kiri.",
     tip:"Posisi kabel menyilang memberi stretch side delt di bawah. Ini yang membuat cable superior dari dumbbell untuk lateral raise.",
     why:"Side delt adalah otot terpenting untuk lebar bahu visual. Cable mempertahankan tension di seluruh range termasuk posisi stretch — dumbbell kehilangan tension di bawah."},
    {n:"Overhead Cable Triceps Extension",eq:"Cable machine",m:"Triceps Long Head (stretch)",c:false,rec:"3×10–12 rep",u:false,sw:15,
     how:"Hadap menjauh, rope di belakang kepala. Luruskan ke atas-depan, turunkan sampai stretch dalam di belakang lengan atas. Jaga siku sempit.",
     tip:"Overhead = long head ter-stretch = pertumbuhan triceps maksimal. Ini adalah gerakan triceps paling penting berdasarkan science.",
     why:"European Journal of Sport Science 2023: overhead triceps extension menghasilkan hipertrofi triceps jauh lebih besar karena long head dilatih di posisi stretched."},
    {n:"Triceps Pushdown",eq:"Cable machine",m:"Triceps Lateral & Medial Head",c:false,rec:"3×12 rep",u:false,sw:20,
     how:"Berdiri tegak, siku menempel di sisi badan. Dorong bar ke bawah hingga siku lurus penuh, tahan kontraksi, kembali perlahan.",
     tip:"Siku tidak boleh bergerak — hanya lengan bawah yang bergerak. Ini melengkapi overhead extension untuk coverage triceps penuh.",
     why:"Melengkapi overhead extension — keduanya dibutuhkan untuk melatih semua 3 kepala triceps. Pushdown fokus ke lateral dan medial head yang tidak ter-covered optimal oleh overhead."},
  ],

  pull:[
    {n:"Lat Pulldown Wide Grip",eq:"Cable machine",m:"Lats — width",c:true,rec:"1 warmup + 3×8–10 rep",u:false,sw:35,
     how:"Grip lebih lebar dari bahu, tarik bar ke dada atas. Biarkan lengan fully extended di atas untuk stretch lat penuh sebelum setiap tarikan.",
     tip:"Wide grip lebih menekankan lebar lat. Stretch penuh di atas adalah kunci — jangan potong range. Bayangkan siku menuju lantai, bukan ke belakang.",
     why:"Variasi grip lebar memberikan penekanan berbeda pada lat luar — melengkapi lat pulldown normal di Upper untuk coverage lat lebih lengkap."},
    {n:"Seated Cable Row (Close Grip)",eq:"Cable machine",m:"Mid Back & Lower Trap",c:true,rec:"1 warmup + 3×10 rep",u:false,sw:35,
     how:"Duduk tegak, lengan fully extend ke depan (stretch penuh di mid back), tarik handle V ke perut bawah, remas tulang belikat, tahan 1 detik, kembali perlahan.",
     tip:"Full stretch di depan dan full kontraksi di belakang — dua-duanya sama pentingnya. Close grip (V-handle) lebih menekankan lower trap dan mid back.",
     why:"Horizontal row untuk ketebalan punggung. Close grip menekankan sudut berbeda dari wide grip row di Upper — bersama-sama memberi coverage mid back lengkap."},
    {n:"Cable Pullover",eq:"Cable machine",m:"Lower Lats & Serratus",c:false,rec:"3×12 rep",u:false,sw:20,
     how:"Berdiri menghadap mesin, sedikit membungkuk. Pegang bar dengan tangan lurus, tarik dari atas ke bawah menyusuri depan tubuh hingga setinggi paha. Kembali perlahan dengan kontrol.",
     tip:"Jaga lengan hampir lurus — sedikit tekuk siku saja. Rasakan lower lat bekerja, bukan triceps. Ini gerakan yang unik karena lat bekerja tanpa keterlibatan bisep.",
     why:"Pullover mengaktivasi lower lat melalui shoulder extension — bukan elbow flexion seperti row dan pulldown. Ini melengkapi punggung dari sudut yang tidak bisa dicapai gerakan lain."},
    {n:"Facepull",eq:"Cable machine",m:"Rear Delts & External Rotators",c:false,rec:"3×15 rep",u:false,sw:15,
     how:"Rope attachment, kabel setinggi wajah. Tarik ke dahi sambil memutar pergelangan keluar — jempol menuju telinga. Tahan 1 detik, kembali perlahan.",
     tip:"External rotation di puncak adalah kunci gerakan ini. Beban ringan, fokus kualitas. Volume tinggi (15 rep) lebih baik untuk rear delt dan rotator cuff.",
     why:"Rear delt dilatih 2x seminggu (Pull + Upper) karena sering tertinggal. Facepull juga melatih rotator cuff — penjaga kesehatan sendi bahu jangka panjang."},
    {n:"Bayesian Curl",eq:"Cable machine",m:"Biceps (lengthened position)",c:false,rec:"3×12 rep",u:true,sw:8,
     how:"Hadap menjauh dari cable rendah. Biarkan lengan tertarik ke belakang badan sepenuhnya untuk stretch bisep di bawah. Curl ke atas dengan kontrol. Kanan dulu lalu kiri.",
     tip:"Posisi tangan di belakang badan sebelum curl adalah kunci. Ini membedakannya dari curl biasa. Semakin ke belakang posisi start, semakin besar stretchnya.",
     why:"Bayesian curl melatih biceps di posisi stretch paling panjang (shoulder hyperextension) sekaligus memberikan tension konstan dari cable. Research terbaru: biceps dilatih di posisi stretched menghasilkan 2x lebih banyak hipertrofi."},
    {n:"Cable Hammer Curl",eq:"Cable machine",m:"Brachialis & Biceps",c:false,rec:"3×12 rep",u:true,sw:10,
     how:"Pegang handle dengan pegangan netral (jempol ke atas seperti palu). Curl ke atas tanpa memutar pergelangan. Kanan dulu lalu kiri.",
     tip:"Netral grip mengaktivasi brachialis lebih dari supinated grip. Brachialis adalah otot yang mendorong bisep ke atas — melatihnya membuat lengan terlihat lebih besar dari semua angle.",
     why:"Brachialis adalah arm-thickener yang sesungguhnya. Melatihnya dengan hammer curl melengkapi biceps brachii yang dilatih dengan Bayesian curl untuk ukuran lengan maksimal."},
    {n:"Cable Wrist Curl",eq:"Cable machine",m:"Forearm Flexors",c:false,rec:"2×15 rep",u:false,sw:10,
     how:"Duduk atau berdiri, pegang bar dengan pegangan bawah. Tekuk pergelangan ke atas melawan beban, tahan, turunkan perlahan.",
     tip:"Range kecil tapi penuh. Forearm tumbuh baik dengan volume tinggi dan rep tinggi. Beban ringan, fokus pada burn.",
     why:"Forearm yang tebal memberi lengan tampilan yang lebih berisi dan kuat bahkan dalam kondisi santai. Penting untuk estetika lengan keseluruhan."},
    {n:"Reverse Cable Curl",eq:"Cable machine",m:"Brachioradialis & Forearm Extensors",c:false,rec:"2 set failure · 6–12 rep",u:false,sw:8,
     how:"Berdiri menghadap cable rendah, pegang bar dengan pegangan overhand (punggung tangan ke atas). Curl bar ke atas tanpa memutar pergelangan, jaga siku tetap di sisi badan, turunkan perlahan dengan kontrol penuh.",
     tip:"Reverse grip menggeser fokus ke brachioradialis dan otot forearm atas yang tidak terlatih oleh curl biasa. Beban akan terasa jauh lebih ringan dari curl normal — itu wajar. Prioritaskan ROM penuh dan kontrol.",
     why:"Brachioradialis adalah otot paling tebal di forearm atas, berkontribusi besar pada tampilan lengan dari semua sudut. Reverse curl adalah satu-satunya cara melatihnya secara langsung dan optimal."},
    {n:"Sam Sulek Curl",eq:"Cable machine",m:"Forearm & Biceps",c:false,rec:"2 set failure · 6–12 rep",u:false,sw:8,
     how:"Gunakan cable dengan attachment sesuai. Lakukan curl dengan fokus pada kontraksi penuh dan eksentrik yang sangat terkontrol. Kerjakan dengan intensitas tinggi hingga failure di rep terakhir.",
     tip:"Karena ini set failure, pilih beban yang membuat rep ke 10–12 benar-benar sangat berat. Jangan kompromikan form di rep terakhir — kalau form mulai rusak, itu sudah cukup sebagai stopping point.",
     why:"Volume forearm tinggi dengan rep moderate dan intensitas failure terbukti efektif untuk hipertrofi otot forearm yang membutuhkan stimulasi frekuensi dan volume lebih besar dari otot besar lainnya."},
  ],

  legs:[
    {n:"Hack Squat",eq:"Machine",m:"Quads dominant",c:true,rec:"1 warmup + 3×8–10 rep",u:false,sw:40,
     how:"Sandar di pad, kaki selebar bahu di posisi bawah platform. Turun sedalam mungkin — idealnya paha melewati sejajar lantai. Dorong naik tanpa mengunci lutut.",
     tip:"Legs day adalah Quad heavy day. Hack squat adalah prioritas utama — pergi sejauh mobilitas memungkinkan. Kedalaman adalah kunci pertumbuhan quad.",
     why:"Hack squat dengan kedalaman penuh mensimulasikan squat dengan beban bisa sangat berat dan aman. Deep squat mengaktivasi quad di posisi stretch yang ekstrem — paling efektif untuk hipertrofi quad berdasarkan EMG research."},
    {n:"Leg Press Lying (kaki rendah)",eq:"Machine",m:"Quads & Glutes",c:true,rec:"3×10–12 rep",u:false,sw:60,
     how:"Kaki rendah di platform, turunkan hingga lutut hampir menyentuh dada jika mobilitas memungkinkan. Dorong tanpa mengunci lutut.",
     tip:"Volume tambahan untuk quad. Kaki rendah = lebih banyak quad. Kedalaman penuh lebih penting dari beban berat.",
     why:"Melengkapi hack squat dengan volume quad tambahan. Posisi tiduran memungkinkan isolasi kaki lebih bersih tanpa faktor keseimbangan."},
    {n:"Lying Leg Curl",eq:"Machine",m:"Hamstrings",c:false,rec:"3×12 rep",u:false,sw:25,
     how:"Kaki fully extended untuk stretch hamstring. Tekuk tumit ke bokong dengan kontrol. Turunkan SANGAT PERLAHAN — 3–4 detik. Jangan angkat pinggul.",
     tip:"Eksentrik (menurunkan) adalah yang terpenting untuk hamstring. Jangan biarkan beban jatuh — kontrol penuh ke bawah.",
     why:"Lying leg curl melatih hamstring dalam posisi stretched (lutut lurus). Posisi ini menghasilkan hipertrofi hamstring terbesar berdasarkan penelitian terbaru."},
    {n:"Hip Adductor Machine (close)",eq:"Machine",m:"Inner Thigh (Adductors)",c:false,rec:"3×15 rep",u:false,sw:30,
     how:"Duduk, rapatkan kedua kaki melawan pad secara terkontrol, tahan, kembali perlahan untuk stretch inner thigh.",
     tip:"Kontrol fase negatif (membuka) — ini yang memberikan stretch adductor. Adductor juga berkontribusi pada glute development.",
     why:"Adductor training melengkapi paha secara penuh. Research menunjukkan adductor magnus juga berkontribusi pada glute growth — otot yang sering diabaikan pemula."},
    {n:"Hip Abductor Machine (open)",eq:"Machine",m:"Glute Medius & Hip",c:false,rec:"3×15 rep",u:false,sw:30,
     how:"Duduk, condong sedikit ke depan. Buka kaki melawan pad, tahan, kembali perlahan. Kerjakan dengan kontrol penuh.",
     tip:"Condong ke depan adalah kunci aktivasi glute medius. Posisi tegak lebih ke TFL yang bukan target utama.",
     why:"Glute medius memberikan bentuk pinggul lateral dan stabilitas panggul yang krusial untuk semua gerakan kaki berat."},
    {n:"Standing Calf Raise (Leg Press Berdiri)",eq:"Standing leg press machine",m:"Gastrocnemius",c:false,rec:"4×15–20 rep",u:false,sw:40,
     how:"Ujung kaki di edge platform. Turunkan tumit sejauh mungkin (stretch penuh), dorong naik ke jinjit maksimal, tahan 1 detik di atas. Gerak perlahan.",
     tip:"Full range adalah non-negotiable untuk calf. Pause di stretch bawah dan kontraksi atas. Tanpa keduanya pertumbuhan calf minimal.",
     why:"Standing calf raise merekrut gastrocnemius optimal karena lutut lurus. Full ROM dengan tempo lambat adalah metode paling evidence-based untuk calf hypertrophy."},
    {n:"Weighted Sit Up",eq:"Decline bench + plate",m:"Rectus Abdominis",c:false,rec:"3×15 rep",u:false,sw:0,
     how:"Posisikan diri di decline bench, kaki terkunci. Pegang plate di dada atau di belakang kepala. Naik dengan melengkungkan tulang belakang dari bawah ke atas — bukan dengan menarik leher. Turunkan perlahan dengan kontrol penuh sampai punggung hampir menyentuh bench.",
     tip:"Fase turun (eksentrik) sama pentingnya dengan naik — jangan biarkan jatuh bebas. Untuk menambah intensitas, pindahkan plate ke belakang kepala. Sesi pertama coba tanpa plate dulu — tambah beban setelah bisa 15 rep dengan kontrol penuh.",
     why:"Weighted sit up di decline bench memungkinkan progressive overload pada abs — kunci untuk hipertrofi otot perut jangka panjang. Dengan menambah berat plate tiap beberapa minggu, stimulus terus meningkat jauh melampaui bodyweight crunch biasa."},
    {n:"Rotary Torso Machine",eq:"Machine",m:"Obliques",c:false,rec:"3×15 rep per sisi",u:false,sw:20,
     how:"Putar torso melawan tahanan dengan kontrol. Kembali perlahan — hindari momentum. Kerjakan kedua sisi.",
     tip:"Gerakan lambat adalah kunci. Oblique merespons baik pada volume tinggi dengan kontrol penuh.",
     why:"Oblique untuk definisi samping perut dan proteksi tulang belakang saat angkat berat. Dilatih 2x seminggu (Lower + Legs) untuk frekuensi optimal."},
  ],
};

const MEALS = [
  {t:"07.00",n:"Sarapan",d:"Nasi + 3 telur orak-arik + tempe"},
  {t:"10.00",n:"Snack",d:"2 pisang + susu full cream"},
  {t:"12.30",n:"Makan siang",d:"Nasi + dada ayam rebus + sayur"},
  {t:"17.30",n:"Pre-workout",d:"Nasi + 2 telur rebus + tahu"},
  {t:"20.30",n:"Post-workout",d:"Nasi + tongkol/ayam + tempe"},
  {t:"22.00",n:"Sebelum tidur",d:"2 telur rebus + susu full cream"},
];
const PROTEINS = [
  {n:"Telur",v:"~6g / butir"},
  {n:"Dada ayam",v:"~25g / 100g"},
  {n:"Tempe",v:"~18g / 100g"},
  {n:"Tahu",v:"~8g / 100g"},
  {n:"Tongkol",v:"~26g / 100g"},
];

/* =========================================================
   STATE / STORAGE
========================================================= */
const LS = {
  get:(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v===null?d:v;}catch(e){return d;}},
  set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),
};
const START_W=69, TARGET_W=78;
let sessions = LS.get('gum_sessions',[]);
let weights  = LS.get('gum_weights',[]);
let measures = LS.get('gum_measures',[]);
let drafts   = LS.get('gum_drafts',{}); // draft catat-latihan per tanggal (auto-save)
let exOrder  = LS.get('gum_order',{});  // urutan exercise custom per jenis sesi {type:[nama,…]}
let restAuto = LS.get('gum_rest_auto',true); // auto-jalankan rest timer saat working set lengkap
let journal  = LS.get('gum_journal',{});     // jurnal harian per tanggal {date:{mood,energy,sleepH,note}}
let finance  = LS.get('gum_finance',[]);     // transaksi keuangan [{id,date,type:'in'|'out',amount,category,note}]
let financeBudget = LS.get('gum_finance_budget',0); // budget pengeluaran/bulan (0=nonaktif)
let calRef   = new Date();
let selDate  = null;

function fmtKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function parseKey(s){const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c);}
const todayStr = ()=>fmtKey(new Date());
const MON=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
function fmtNice(s){const d=parseKey(s);return DAY_ID[d.getDay()]+', '+d.getDate()+' '+MON[d.getMonth()]+' '+d.getFullYear();}
function fmtShort(s){const d=parseKey(s);return d.getDate()+' '+MON[d.getMonth()];}
// escape user-provided text before inserting into innerHTML (prevents XSS from custom names/notes)
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

/* =========================================================
   IKON (SVG stroke, mengikuti currentColor)
========================================================= */
const ICON_PATHS={
  jadwal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  tracker:'<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="7" rx="1"/><rect x="12" y="7" width="3" height="11" rx="1"/><rect x="17" y="4" width="3" height="14" rx="1"/>',
  panduan:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  gizi:'<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
  glow:'<path d="M12 3l1.55 4.45L18 9l-4.45 1.55L12 15l-1.55-4.45L6 9l4.45-1.55z"/><path d="M19 14l.7 2L22 16.8l-2 .7L19.4 20l-.7-2L16.3 17.5l2-.7z"/>',
  bantuan:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  scale:'<path d="M12 3v18M5 7h14M7 7l-4 7a4 4 0 0 0 8 0zM17 7l4 7a4 4 0 0 1-8 0zM8 21h8"/>',
  trend:'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  dumbbell:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
  ruler:'<path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4Z"/><path d="m7.5 10.5 2 2M10.5 7.5l2 2M13.5 4.5l2 2M4.5 13.5l2 2"/>',
  save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  calc:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
  utensils:'<path d="M4 3v6a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3M6 11v10M18 3c-1.5 1-2.5 4-2.5 7H18v11"/>',
  egg:'<path d="M12 22c4.2 0 7-3.13 7-7 0-4.97-3.5-13-7-13S5 10.03 5 15c0 3.87 2.8 7 7 7z"/>',
  bulb:'<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.5.4.8 1 .8 1.6V17h6.4v-.7c0-.6.3-1.2.8-1.6A7 7 0 0 0 12 2z"/>',
  beaker:'<path d="M4.5 3h15M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3M6 14h12"/>',
  clipboard:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  trash:'<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
  timer:'<path d="M10 2h4M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
  zap:'<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  alert:'<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
  arrowUp:'<path d="M12 19V5M5 12l7-7 7 7"/>',
  arrowDown:'<path d="M12 5v14M19 12l-7 7-7-7"/>',
  droplet:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  bottle:'<path d="M9 3h6v3l1 2v12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V8l1-2z"/><path d="M9 13h6"/>',
  scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>',
  shirt:'<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
  footprints:'<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/>',
  palette:'<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.83-.44-1.12-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67H16c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z"/>',
  bag:'<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
  leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
  smile:'<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  banknote:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  person:'<circle cx="12" cy="6" r="3"/><path d="M12 9v8M8 21l4-5 4 5"/>',
  // ---- module nav icons (7 modul + Lainnya) ----
  beranda:'<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  latihan:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
  glowup:'<path d="M12 3l1.55 4.45L18 9l-4.45 1.55L12 15l-1.55-4.45L6 9l4.45-1.55z"/><path d="M19 14l.7 2L22 16.8l-2 .7L19.4 20l-.7-2L16.3 17.5l2-.7z"/>',
  jurnal:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 7h7M9 11h7"/>',
  keuangan:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  pengaturan:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
};
function svg(name,size){const p=ICON_PATHS[name]; if(!p)return''; return `<svg class="ic-svg" width="${size||18}" height="${size||18}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;}
function paintIcons(){
  document.querySelectorAll('.nav-btn').forEach(b=>{const i=b.querySelector('.ni'); if(i&&ICON_PATHS[b.dataset.page])i.innerHTML=svg(b.dataset.page,22);});
  document.querySelectorAll('.side-btn').forEach(b=>{const i=b.querySelector('.ni'); if(i&&ICON_PATHS[b.dataset.page])i.innerHTML=svg(b.dataset.page,20);});
  const hb=document.getElementById('helpBtn'); if(hb)hb.innerHTML=svg('bantuan',19);
  document.querySelectorAll('[data-ic]').forEach(el=>{el.innerHTML=svg(el.dataset.ic,+el.dataset.sz||18);});
}

/* =========================================================
   NAVIGATION / ROUTER (7 modul, hybrid sidebar + bottom-nav)
========================================================= */
const PAGE_META={
  beranda:    ['Beranda',    'Ringkasan harianmu'],
  latihan:    ['Latihan',    'Jadwal, catat & progres'],
  gizi:       ['Gizi & Berat','Target makan & berat badan'],
  glowup:     ['Glow Up',    'Skincare, rambut & kebiasaan'],
  jurnal:     ['Jurnal',     'Mood, tidur & catatan harian'],
  keuangan:   ['Keuangan',   'Catatan & anggaran'],
  pengaturan: ['Pengaturan', 'Tema, notifikasi & backup'],
};
// modul yang TIDAK ada di bottom-nav → diakses lewat tombol "Lainnya" (⋯)
const MORE_PAGES=['glowup','keuangan','pengaturan'];
function go(page){
  if(!PAGE_META[page])page='beranda';
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const sec=document.getElementById('page-'+page); if(sec)sec.classList.add('active');
  // sidebar (semua 7 modul) — sorot yang aktif
  document.querySelectorAll('.side-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  // bottom-nav (5 item): sorot item langsung, atau "Lainnya" bila modul ada di overflow
  const inMore=MORE_PAGES.includes(page);
  document.querySelectorAll('.nav-btn').forEach(b=>{
    if(b.dataset.more!=null)b.classList.toggle('active',inMore);
    else b.classList.toggle('active',b.dataset.page===page);
  });
  const[t,s]=PAGE_META[page];
  document.getElementById('pageTitle').textContent=t;
  document.getElementById('pageSub').textContent=s;
  window.scrollTo({top:0});
  LS.set('gum_page',page); // ingat halaman aktif agar bertahan setelah refresh
  // hook render saat masuk modul (fungsi didefinisikan di file modul masing-masing)
  if(page==='beranda'&&typeof renderBeranda==='function')renderBeranda();
  if(page==='jurnal'&&typeof renderJurnal==='function')renderJurnal();
  if(page==='keuangan'&&typeof renderKeuangan==='function')renderKeuangan();
  if(page==='gizi'&&typeof renderWeight==='function'&&document.getElementById('gt-weight')&&document.getElementById('gt-weight').style.display!=='none')renderWeight();
}
// ---- "Lainnya" bottom sheet ----
function openMoreSheet(){const o=document.getElementById('moreSheet'); if(o)o.classList.add('show');}
function closeMoreSheet(){const o=document.getElementById('moreSheet'); if(o)o.classList.remove('show');}
document.querySelectorAll('.nav-btn,.side-btn').forEach(b=>b.addEventListener('click',()=>{
  if(b.dataset.more!=null){openMoreSheet();return;}
  go(b.dataset.page);
}));
document.querySelectorAll('.more-item').forEach(b=>b.addEventListener('click',()=>{go(b.dataset.page);closeMoreSheet();}));
(function(){const o=document.getElementById('moreSheet'); if(o)o.addEventListener('click',e=>{if(e.target===o)closeMoreSheet();});})();

/* =========================================================
   THEME
========================================================= */
function applyTheme(){
  const t=LS.get('gum_theme',null);
  const root=document.documentElement;
  if(t){root.setAttribute('data-theme',t);}else{root.removeAttribute('data-theme');}
  const isDark = t ? t==='dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  const ico=svg(isDark?'sun':'moon',18);
  const ti=document.getElementById('themeIco'); if(ti)ti.innerHTML=ico;
  const si=document.getElementById('themeIcoSide'); if(si)si.innerHTML=ico;
  const ps=document.getElementById('setThemeIco'); if(ps)ps.innerHTML=ico; // tombol tema di Pengaturan
  const pl=document.getElementById('setThemeLabel'); if(pl)pl.textContent=isDark?'Mode terang':'Mode gelap';
}
function toggleTheme(){
  const cur=LS.get('gum_theme',null);
  const isDark = cur ? cur==='dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  LS.set('gum_theme', isDark?'light':'dark');
  applyTheme();
  if(typeof drawWeightChart==='function')drawWeightChart(); // sesuaikan warna chart dgn tema
  const mv=document.getElementById('lt-measures'); if(mv&&mv.style.display!=='none'&&typeof renderMeasures==='function')renderMeasures(); // sparkline ikut warna tema
}
(function(){
  const tb=document.getElementById('themeBtn'); if(tb)tb.addEventListener('click',toggleTheme);
  const tbs=document.getElementById('themeBtnSide'); if(tbs)tbs.addEventListener('click',toggleTheme);
  const hb=document.getElementById('helpBtn'); if(hb)hb.addEventListener('click',()=>go('pengaturan'));
})();

/* =========================================================
   TOAST (melayang, auto-hilang)
========================================================= */
function showToast(html){
  let t=document.getElementById('prToast');
  if(!t){
    t=document.createElement('div'); t.id='prToast';
    t.style.cssText='position:fixed;left:50%;bottom:calc(var(--nav-h) + 16px + env(safe-area-inset-bottom));transform:translateX(-50%) translateY(12px);z-index:120;max-width:92%;width:max-content;background:var(--surface);border:1px solid var(--border-2);border-radius:14px;box-shadow:var(--shadow-lg);padding:12px 16px;font-size:13px;line-height:1.5;opacity:0;transition:opacity .25s,transform .25s;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.innerHTML=html;
  requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; });
  clearTimeout(t._h);
  t._h=setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(12px)'; },4200);
}
