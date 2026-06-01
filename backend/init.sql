CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telegram_chat_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    notified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category)
);

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

-- Demo Data
INSERT INTO jobs (title, company, category, description, notified) VALUES
-- YAZILIM
('Senior Frontend Developer', 'TechNova Solutions', 'Yazılım', 'Görev Tanımı:
Şirketimizin amiral gemisi olan SaaS platformunun web arayüzlerini React ve TypeScript kullanarak geliştirmek. Performans optimizasyonları yapmak ve UI/UX ekibiyle yakından çalışmak.

Aranan Nitelikler:
- En az 5 yıl React ve modern JavaScript (ES6+) tecrübesi
- State management (Redux, Zustand) konularına hakimiyet
- Responsive tasarım ve CSS mimarileri (Tailwind, SASS) konusunda uzmanlık

Başvuru Şartları:
- Github portfolyosu sunabilmek
- Remote çalışmaya uygun iletişim becerilerine sahip olmak.', TRUE),

('Backend Node.js Engineer', 'CodeBase Labs', 'Yazılım', 'Görev Tanımı:
Yüksek trafikli e-ticaret altyapımız için ölçeklenebilir mikroservisler tasarlamak ve geliştirmek. Veritabanı sorgularını optimize etmek ve API güvenliğini sağlamak.

Aranan Nitelikler:
- Node.js ve Express/NestJS frameworklerinde derin bilgi
- PostgreSQL ve Redis ile çalışma tecrübesi
- Docker ve Kubernetes hakkında bilgi sahibi olmak

Başvuru Şartları:
- Bilgisayar Mühendisliği veya ilgili bölümlerden mezun
- İngilizce dökümantasyon okuma ve yazma becerisi', TRUE),

('Fullstack Yazılım Mühendisi', 'StartupX', 'Yazılım', 'Görev Tanımı:
Uçtan uca ürün geliştirme süreçlerinde aktif rol almak. Next.js ile frontend, Node.js/Python ile backend sistemlerini entegre etmek.

Aranan Nitelikler:
- Hem Frontend hem Backend ekosistemlerine hakimiyet
- RESTful ve GraphQL API geliştirme tecrübesi
- Çevik (Agile) geliştirme metodolojilerine yatkınlık

Başvuru Şartları:
- Daha önce en az 2 tam teşekküllü projeyi canlıya almış olmak', TRUE),

('DevOps & Cloud Uzmanı', 'CloudNet', 'Yazılım', 'Görev Tanımı:
CI/CD süreçlerini yönetmek, AWS altyapımızı optimize etmek ve sistem güvenliğini sağlamak.

Aranan Nitelikler:
- AWS (EC2, S3, RDS, Lambda) servislerinde uzmanlık
- Terraform veya Ansible gibi IaC araçlarını kullanabilme
- Linux sistem yönetimi ve ağ güvenliği bilgisi

Başvuru Şartları:
- 7/24 nöbet sistemine (on-call) uyum sağlayabilmek
- Tercihen AWS Certified Solutions Architect sertifikasına sahip olmak', TRUE),

('Mobile App Developer (Flutter)', 'Appify TR', 'Yazılım', 'Görev Tanımı:
IOS ve Android platformları için çapraz platform (cross-platform) mobil uygulamalar geliştirmek, test etmek ve mağaza yayın süreçlerini yönetmek.

Aranan Nitelikler:
- Dart dili ve Flutter frameworkü ile en az 2 yıl tecrübe
- State Management (Provider, Bloc) kullanımı
- Firebase ve REST API entegrasyonu tecrübesi

Başvuru Şartları:
- Yayında olan en az 1 mobil uygulama referansı gösterebilmek', TRUE),

-- TASARIM
('Kıdemli UI/UX Designer', 'Creative Studio', 'Tasarım', 'Görev Tanımı:
Web ve mobil uygulamalarımız için kullanıcı deneyimini merkeze alan, estetik ve işlevsel arayüzler tasarlamak. Kullanıcı testleri organize edip veriye dayalı tasarım kararları almak.

Aranan Nitelikler:
- Figma, Sketch veya Adobe XD konularında ileri düzey yetkinlik
- Kullanıcı araştırma metodolojileri ve A/B testi tecrübesi
- Prototipleme ve wireframing becerileri

Başvuru Şartları:
- Kapsamlı bir tasarım portfolyosu (Behance, Dribbble vb.) sunmak', TRUE),

('Grafik Tasarım Uzmanı', 'AdAgency', 'Tasarım', 'Görev Tanımı:
Markalarımız için sosyal medya görselleri, dijital reklam materyalleri (banner, afiş) ve kurumsal kimlik tasarımları üretmek.

Aranan Nitelikler:
- Adobe Photoshop, Illustrator ve InDesign programlarına hakimiyet
- Tipografi, renk teorisi ve kompozisyon prensiplerini iyi bilmek
- Trendleri takip eden, vizyoner bakış açısı

Başvuru Şartları:
- Ajans deneyimi (minimum 2 yıl)
- Baskı hazırlık süreçlerine hakim olmak', TRUE),

('Motion Graphics Designer', 'VideoPro', 'Tasarım', 'Görev Tanımı:
Sosyal medya reklamları ve tanıtım videoları için 2D/3D hareketli grafikler, animasyonlar ve video kurguları hazırlamak.

Aranan Nitelikler:
- After Effects, Premiere Pro uzmanlığı
- Tercihen Cinema 4D veya Blender bilgisi
- Ses kurgusu ve ritmik video kurgusu yeteneği

Başvuru Şartları:
- Video showreel sunumu zorunludur', TRUE),

('Oyun Tasarımcısı (Game Designer)', 'Pixel Play', 'Tasarım', 'Görev Tanımı:
Mobil hyper-casual ve casual oyunlar için bölüm (level) tasarımı, oyun mekanikleri kurgulama ve karakter konseptleri oluşturmak.

Aranan Nitelikler:
- Unity 3D ekosistemine aşinalık
- Oyun ekonomisi ve kullanıcı tutundurma (retention) metrikleri hakkında bilgi
- Yaratıcı hikaye anlatımı becerisi

Başvuru Şartları:
- Oyun sektörüne tutkuyla bağlı olmak ve aktif bir oyuncu olmak', TRUE),

('Endüstriyel Ürün Tasarımcısı', 'TechHardware', 'Tasarım', 'Görev Tanımı:
Yeni nesil akıllı ev aletleri için ergonomik, estetik ve üretilebilir donanım tasarımları (CAD modelleme) yapmak.

Aranan Nitelikler:
- SolidWorks, Rhino veya Fusion 360 programlarına tam hakimiyet
- Malzeme bilgisi ve üretim teknikleri (enjeksiyon vb.) konusunda deneyim
- Prototipleme (3D baskı) süreçlerine hakimiyet

Başvuru Şartları:
- Endüstriyel Tasarım bölümü mezunu olmak', TRUE),

-- SAĞLIK
('Klinik Araştırma Hemşiresi', 'Şifa Hastanesi', 'Sağlık', 'Görev Tanımı:
Klinik araştırma fazlarında görev almak, hastaların takibini yapmak, araştırma verilerini doğru şekilde raporlamak ve hekimlere asistanlık yapmak.

Aranan Nitelikler:
- İyi Klinik Uygulamaları (GCP) sertifikasına sahip olmak
- İleri düzeyde hasta iletişim becerileri
- Detay odaklı ve titiz veri girişi yeteneği

Başvuru Şartları:
- Üniversitelerin Hemşirelik bölümünden mezuniyet
- İlgili alanda minimum 3 yıl deneyim', TRUE),

('Uzman Psikolog', 'Zihin Terapi Merkezi', 'Sağlık', 'Görev Tanımı:
Danışanlara bireysel psikoterapi desteği sağlamak, psikolojik testler (MMPI vb.) uygulamak ve gelişim takibi raporları hazırlamak.

Aranan Nitelikler:
- Bilişsel Davranışçı Terapi (BDT) veya EMDR eğitimi almış olmak
- Empati yeteneği yüksek, etik değerlere bağlı çalışma prensibi
- Etkili dinleme ve iletişim becerileri

Başvuru Şartları:
- Psikoloji lisans ve Klinik Psikoloji yüksek lisans derecesi
- Terapi uygulamak için gerekli sertifikasyonlar', TRUE),

('Fizyoterapist', 'Sağlıklı Yaşam', 'Sağlık', 'Görev Tanımı:
Ortopedik ve nörolojik rehabilitasyon hastalarının fizyoterapi programlarını planlamak ve uygulamak. Manuel terapi ve egzersiz danışmanlığı vermek.

Aranan Nitelikler:
- Manuel terapi, dry needling gibi tekniklerde sertifika sahibi olmak
- İnsan anatomisi ve kinezyolojisine ileri derecede hakimiyet
- Güleryüzlü ve motive edici yaklaşım

Başvuru Şartları:
- Fizyoterapi ve Rehabilitasyon bölümü lisans mezuniyeti
- Tam zamanlı çalışmaya uygunluk', TRUE),

('Diş Hekimi (Ortodonti)', 'Gülüş Estetiği', 'Sağlık', 'Görev Tanımı:
Çene ve diş bozukluklarının teşhis, planlama ve tedavisini (tel, şeffaf plak uygulamaları) gerçekleştirmek. Hastalara ağız sağlığı eğitimi vermek.

Aranan Nitelikler:
- Dijital diş hekimliği (CAD/CAM, ağız içi tarayıcılar) tecrübesi
- Invisalign veya benzeri şeffaf plak sistemlerinde sertifikasyon
- Yüksek hasta memnuniyeti odaklı çalışma

Başvuru Şartları:
- Diş Hekimliği Fakültesi mezuniyeti ve Ortodonti alanında uzmanlık
- İlgili meslek odasına kayıtlı olmak', TRUE),

('Diyetisyen ve Beslenme Uzmanı', 'FitLife Klinik', 'Sağlık', 'Görev Tanımı:
Danışanların sağlık durumlarına ve hedeflerine uygun kişiselleştirilmiş beslenme programları hazırlamak, kilo kontrolü süreçlerini takip etmek.

Aranan Nitelikler:
- Vücut analiz cihazlarını (InBody vb.) etkin kullanabilme
- Güncel beslenme trendlerini ve literatürü takip etme
- Etkili ikna ve motivasyon becerileri

Başvuru Şartları:
- Beslenme ve Diyetetik bölümü lisans derecesi
- Klinik veya sporcu beslenmesi alanında en az 1 yıl tecrübe', TRUE),

-- EĞİTİM
('İngilizce Öğretmeni', 'Global English Academy', 'Eğitim', 'Görev Tanımı:
Yetişkinlere ve kurumsal firmalara yönelik online ve yüz yüze İngilizce konuşma/dil bilgisi dersleri vermek. Öğrencilerin gelişimini takip etmek.

Aranan Nitelikler:
- CELTA, TESOL veya TEFL sertifikalarından birine sahip olmak
- Modern öğretim metodolojilerine hakimiyet
- Enerjik, interaktif ve konuşma odaklı ders işleme yeteneği

Başvuru Şartları:
- İngilizce Öğretmenliği veya İngiliz Dili ve Edebiyatı mezunu
- Minimum 2 yıl aktif eğitmenlik tecrübesi', TRUE),

('E-Öğrenme (E-Learning) Uzmanı', 'EdTech TR', 'Eğitim', 'Görev Tanımı:
Şirket içi eğitim akademileri için etkileşimli dijital eğitim içerikleri ve LMS (Learning Management System) altyapıları hazırlamak.

Aranan Nitelikler:
- Articulate Storyline, Adobe Captivate gibi araçlara hakimiyet
- Öğretim tasarımı (Instructional Design) modellerini bilmek
- Temel düzeyde video/ses kurgu (Premiere, Audition) becerisi

Başvuru Şartları:
- Eğitim Teknolojileri veya BÖTE (Bilgisayar ve Öğretim Teknolojileri) mezuniyeti', TRUE),

('Sınav Hazırlık Rehber Öğretmeni', 'Başarı Dershaneleri', 'Eğitim', 'Görev Tanımı:
YKS/LGS dönemindeki öğrencilere kariyer danışmanlığı yapmak, çalışma programları hazırlamak ve sınav kaygısına yönelik motivasyon çalışmaları yürütmek.

Aranan Nitelikler:
- Eğitim psikolojisi ve ergenlik dönemi gelişim özellikleri hakkında bilgi
- Güçlü iletişim ve veli/öğrenci ikna kabiliyeti
- ÖSYM sınav sistemleri ve tercih dönemi süreçlerine uzmanlık seviyesinde hakimiyet

Başvuru Şartları:
- PDR (Psikolojik Danışmanlık ve Rehberlik) lisans mezunu olmak', TRUE),

('Kurumsal Eğitmen (Soft Skills)', 'HR Solutions', 'Eğitim', 'Görev Tanımı:
Kurumsal firmaların çalışanlarına yönelik Liderlik, İletişim, Zaman Yönetimi, ve Takım Çalışması konularında interaktif workshoplar düzenlemek.

Aranan Nitelikler:
- Yetişkin eğitimi (Andragoji) prensiplerine hakimiyet
- Mükemmel sunum ve topluluk önünde konuşma becerisi
- Eğitim ihtiyaç analizi yapabilme yetkinliği

Başvuru Şartları:
- Alanında en az 5 yıl kurumsal eğitim verme deneyimi
- Tercihen ICF onaylı koçluk sertifikası', TRUE),

('Kodlama Eğitmeni (Çocuklar İçin)', 'Geleceğin Yıldızları', 'Eğitim', 'Görev Tanımı:
7-14 yaş arası çocuklara Scratch, Roblox Studio, Python ve temel robotik kodlama eğitimleri vermek. Proje tabanlı öğrenme etkinlikleri düzenlemek.

Aranan Nitelikler:
- Çocuklarla iletişimi kuvvetli, sabırlı ve eğlenceli öğretim tarzı
- Blok tabanlı kodlama ve temel algoritmik düşünce becerileri
- STEM eğitim yaklaşımına ilgi duymak

Başvuru Şartları:
- Pedagojik formasyon eğitimi almış olmak
- Hafta sonu çalışma programına uyum sağlayabilmek', TRUE),

-- FİNANS
('Kıdemli Finansal Analist', 'Global Bank', 'Finans', 'Görev Tanımı:
Şirketin bütçe gerçekleşmelerini analiz etmek, finansal modelleme yapmak, nakit akışı tabloları hazırlamak ve üst yönetime raporlamak.

Aranan Nitelikler:
- İleri düzey MS Excel (Makro, Power Query) ve PowerBI kullanımı
- Finansal tablo okuma ve analiz etme (rasyo analizi) uzmanlığı
- ERP sistemleri (SAP FI/CO) tecrübesi

Başvuru Şartları:
- Ekonomi, İşletme, Maliye bölümlerinden mezuniyet
- Tercihen CFA veya CPA sertifikası yolunda olmak', TRUE),

('Kripto Varlık Uzmanı', 'CoinMarket TR', 'Finans', 'Görev Tanımı:
Kripto para piyasalarını (DeFi, Web3) yakından takip etmek, token ekonomileri (tokenomics) üzerine araştırmalar yapmak ve kullanıcılara yatırım stratejileri geliştirmek.

Aranan Nitelikler:
- Blockchain teknolojisi ve akıllı sözleşmeler hakkında teknik bilgi
- Temel ve teknik piyasa analizi yeteneği
- Risk yönetimi prensiplerine tam hakimiyet

Başvuru Şartları:
- Finansal piyasalarda (Geleneksel veya Kripto) aktif ticaret tecrübesi
- İleri düzey finansal İngilizce bilgisi', TRUE),

('Mali Müşavir (SMMM)', 'HesapUzmanları', 'Finans', 'Görev Tanımı:
Müşteri portföyünün aylık KDV, Muhtasar, Kurumlar Vergisi beyannamelerini hazırlamak. SGK bildirgelerini ve bordrolama süreçlerini yönetmek.

Aranan Nitelikler:
- Vergi mevzuatı, TTK ve İş Kanunu mevzuatlarına güncel olarak hakim olmak
- Zirve, Luca veya Logo muhasebe programlarını aktif kullanabilme
- E-Defter, e-Fatura süreçleri tecrübesi

Başvuru Şartları:
- Serbest Muhasebeci Mali Müşavir (SMMM) ruhsatına sahip olmak
- Minimum 3 yıl aktif büro deneyimi', TRUE),

('Yatırım Portföy Yöneticisi', 'InvestPro', 'Finans', 'Görev Tanımı:
Yüksek net değere sahip (HNWI) bireysel ve kurumsal müşterilerin yatırım portföylerini risk/getiri beklentilerine göre yönetmek ve çeşitlendirmek.

Aranan Nitelikler:
- Sermaye piyasaları (Hisse senedi, tahvil, fon) hakkında derin bilgi
- Güçlü müşteri ilişkileri yönetimi ve satış becerileri
- Makroekonomik gelişmeleri okuma yeteneği

Başvuru Şartları:
- SPK Düzey 3 ve Türev Araçlar Lisansına sahip olmak
- Bankaların veya Aracı Kurumların ilgili bölümlerinde minimum 5 yıl tecrübe', TRUE),

('Ticari Krediler Tahsis Uzmanı', 'Premium Bank', 'Finans', 'Görev Tanımı:
KOBİ ve ticari segmentteki firmaların kredi taleplerini incelemek, finansal analizlerini yaparak kredi risk raporlarını hazırlamak ve tahsis onayı vermek.

Aranan Nitelikler:
- Bilanço ve gelir tablosu analizi konusunda uzmanlık
- İstihbarat ve kredi risk derecelendirme (rating) yöntemlerine hakimiyet
- Analitik düşünme ve hızlı karar verebilme yeteneği

Başvuru Şartları:
- Bankacılık sektöründe ticari krediler tahsis bölümünde en az 4 yıl tecrübe', TRUE);
