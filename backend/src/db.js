const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// SQLite veritabanı dosya yolu (ortak Docker volume veya local backend klasörü)
const dbPath = process.env.DATABASE_FILE || path.join(__dirname, '..', 'is_ajani.db');

// Gerekirse veri klasörünü oluştur
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite veritabanı bağlantı hatası:', err);
  } else {
    console.log('SQLite veritabanı bağlandı:', dbPath);
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // 1. Users Tablosu
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullname TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        telegram_chat_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Jobs Tablosu (İş İlanları)
    db.run(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        notified BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Subscriptions Tablosu (Abonelikler)
    db.run(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, category)
      )
    `);

    // 4. Applications Tablosu (Başvurular)
    db.run(`
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, job_id)
      )
    `);

    // Eğer iş ilanları tablosu boşsa örnek verileri yükle (Seed)
    db.get("SELECT COUNT(*) as count FROM jobs", [], (err, row) => {
      if (err) {
        console.error('İş ilanları sayımı sırasında hata:', err);
        return;
      }
      if (row && row.count === 0) {
        console.log('Veritabanına örnek iş ilanları ekleniyor (Seeding)...');
        const stmt = db.prepare(`
          INSERT INTO jobs (title, company, category, description, notified)
          VALUES (?, ?, ?, ?, 1)
        `);

        // YAZILIM
        stmt.run('Senior Frontend Developer', 'TechNova Solutions', 'Yazılım', 'Görev Tanımı:\nŞirketimizin amiral gemisi olan SaaS platformunun web arayüzlerini React ve TypeScript kullanarak geliştirmek. Performans optimizasyonları yapmak ve UI/UX ekibiyle yakından çalışmak.\n\nAranan Nitelikler:\n- En az 5 yıl React ve modern JavaScript tecrübesi\n- State management (Redux, Zustand) konularına hakimiyet\n- Responsive tasarım ve CSS mimarileri (Tailwind, SASS) tecrübesi\n\nBaşvuru Şartları:\n- Github portfolyosu sunabilmek\n- Remote çalışmaya uygun olmak.');
        stmt.run('Backend Node.js Engineer', 'CodeBase Labs', 'Yazılım', 'Görev Tanımı:\nYüksek trafikli e-ticaret altyapımız için ölçeklenebilir mikroservisler tasarlamak ve geliştirmek. Veritabanı sorgularını optimize etmek ve API güvenliğini sağlamak.\n\nAranan Nitelikler:\n- Node.js ve Express/NestJS frameworklerinde derin bilgi\n- PostgreSQL/SQLite ve Redis ile çalışma tecrübesi\n- Docker hakkında bilgi sahibi olmak');
        stmt.run('Fullstack Yazılım Mühendisi', 'StartupX', 'Yazılım', 'Görev Tanımı:\nUçtan uca ürün geliştirme süreçlerinde aktif rol almak. Next.js ile frontend, Node.js/Python ile backend sistemlerini entegre etmek.\n\nAranan Nitelikler:\n- Hem Frontend hem Backend ekosistemlerine hakimiyet\n- RESTful API geliştirme tecrübesi');

        // TASARIM
        stmt.run('Kıdemli UI/UX Designer', 'Creative Studio', 'Tasarım', 'Görev Tanımı:\nWeb ve mobil uygulamalarımız için kullanıcı deneyimini merkeze alan, estetik ve işlevsel arayüzler tasarlamak. Kullanıcı testleri organize edip veriye dayalı tasarım kararları almak.\n\nAranan Nitelikler:\n- Figma konularında ileri düzey yetkinlik\n- Kullanıcı araştırma metodolojileri ve A/B testi tecrübesi\n- Prototipleme ve wireframing becerileri');
        stmt.run('Grafik Tasarım Uzmanı', 'AdAgency', 'Tasarım', 'Görev Tanımı:\nMarkalarımız için sosyal medya görselleri, dijital reklam materyalleri (banner, afiş) ve kurumsal kimlik tasarımları üretmek.\n\nAranan Nitelikler:\n- Adobe Photoshop, Illustrator ve InDesign programlarına hakimiyet\n- Tipografi, renk teorisi ve kompozisyon prensiplerini iyi bilmek');

        // SAĞLIK
        stmt.run('Klinik Araştırma Hemşiresi', 'Şifa Hastanesi', 'Sağlık', 'Görev Tanımı:\nKlinik araştırma fazlarında görev almak, hastaların takibini yapmak, araştırma verilerini doğru şekilde raporlamak ve hekimlere asistanlık yapmak.\n\nAranan Nitelikler:\n- İyi Klinik Uygulamaları (GCP) sertifikasına sahip olmak\n- İleri düzeyde hasta iletişim becerileri');

        // EĞİTİM
        stmt.run('İngilizce Öğretmeni', 'Global English Academy', 'Eğitim', 'Görev Tanımı:\nYetişkinlere ve kurumsal firmalara yönelik online ve yüz yüze İngilizce konuşma/dil bilgisi dersleri vermek. Öğrencilerin gelişimini takip etmek.\n\nAranan Nitelikler:\n- CELTA, TESOL veya TEFL sertifikalarından birine sahip olmak\n- Enerjik ve interaktif ders işleme yeteneği');

        // FİNANS
        stmt.run('Kıdemli Finansal Analist', 'Global Bank', 'Finans', 'Görev Tanımı:\nŞirketin bütçe gerçekleşmelerini analiz etmek, finansal modelleme yapmak, nakit akışı tabloları hazırlamak ve üst yönetime raporlamak.\n\nAranan Nitelikler:\n- İleri düzey MS Excel ve PowerBI kullanımı\n- Finansal tablo okuma ve analiz etme uzmanlığı');

        stmt.finalize();
        console.log('Örnek iş ilanları veritabanına başarıyla eklendi.');
      }
    });
  });
}

// Postgres query metodunu taklit eden SQLite sarmalayıcısı (Promisified Wrapper)
// SQL içindeki Postgres formatındaki $1, $2 gibi parametreleri SQLite uyumlu ? karakterine çevirir.
const query = (sql, params = []) => {
  const sqliteSql = sql.replace(/\$\d+/g, '?');
  return new Promise((resolve, reject) => {
    db.all(sqliteSql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve({ rows });
      }
    });
  });
};

module.exports = {
  query,
  dbInstance: db // Gerekirse direkt sqlite3 bağlantısına erişmek için
};
