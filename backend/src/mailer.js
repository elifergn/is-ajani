const nodemailer = require('nodemailer');

// GMAIL UYGULAMA ŞİFRESİ (APP PASSWORD) NASIL ALINIR?
//
// 1. Google Hesabınıza gidin (https://myaccount.google.com/).
// 2. Sol taraftaki menüden "Güvenlik" (Security) sekmesine geçin.
// 3. "Google'da oturum açma" (Signing in to Google) altındaki "2 Adımlı Doğrulama" (2-Step Verification) özelliğini aktif edin (açık olmalıdır).
// 4. "2 Adımlı Doğrulama" seçeneğinin içine tıklayın ve sayfanın en altına inin.
// 5. "Uygulama şifreleri" (App Passwords) seçeneğini seçin.
// 6. Uygulamanıza bir isim verin (örneğin "İş Ajanı Bitirme Projesi") ve "Oluştur" (Create) butonuna tıklayın.
// 7. Ekranda beliren 16 haneli sarı alandaki şifreyi kopyalayın.
// 8. Bu şifreyi .env dosyanızdaki "GMAIL_PASS" alanına aradaki boşlukları silerek yapıştırın.
//

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS için false (PORT 587), SSL için true (PORT 465)
  auth: {
    user: process.env.GMAIL_USER, // E-posta adresiniz (Örn: adiniz@gmail.com)
    pass: process.env.GMAIL_PASS  // Google'dan aldığınız 16 haneli Uygulama Şifresi
  }
});

/**
 * İş başvurusu başarılı olduğunda kullanıcıya onay e-postası gönderir.
 * 
 * @param {string} userEmail Alıcı e-posta adresi
 * @param {string} userName Alıcı Adı-Soyadı
 * @param {string} jobTitle Başvurulan iş ilanının başlığı
 * @param {string} companyName Başvurulan şirketin adı
 */
const sendApplicationEmail = async (userEmail, userName, jobTitle, companyName) => {
  // E-posta bilgileri eksikse gönderme işlemini atla (hata vermemesi için)
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.warn('[Nodemailer] .env dosyasında GMAIL_USER veya GMAIL_PASS tanımlanmamış. E-posta gönderimi atlanıyor.');
    return;
  }

  const mailOptions = {
    from: `"İş Ajanı" <${process.env.GMAIL_USER}>`,
    to: userEmail,
    subject: `Gizli Görev Başvurusu Onaylandı: ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0b0f19;
            color: #f1f5f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #111827;
            border: 1px solid #1f2937;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          }
          .header {
            text-align: center;
            border-bottom: 1px solid #374151;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #38bdf8;
            letter-spacing: 1px;
            margin: 0;
          }
          .content {
            font-size: 16px;
            line-height: 1.6;
            color: #d1d5db;
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #f9fafb;
            margin-bottom: 15px;
          }
          .job-info {
            background: rgba(56, 189, 248, 0.05);
            border-left: 4px solid #38bdf8;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            color: #e5e7eb;
          }
          .job-title {
            font-weight: bold;
            color: #38bdf8;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #374151;
            font-size: 13px;
            color: #9ca3af;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🕵️‍♂️ İŞ AJANI AĞI</h1>
          </div>
          <div class="content">
            <div class="greeting">Tebrikler ${userName},</div>
            <p><strong>${companyName}</strong> bünyesindeki <strong>${jobTitle}</strong> pozisyonu için başvurunuz başarıyla alınmıştır.</p>
            
            <div class="job-info">
              <strong>Başvuru Durumu:</strong> Onaylandı / Aktif Takipte<br>
              <strong>Pozisyon:</strong> <span class="job-title">${jobTitle}</span><br>
              <strong>Şirket:</strong> ${companyName}
            </div>
            
            <p>Ajanlarımız veritabanlarını sızdırmaya ve başvurunuzu canlandırmaya devam ediyor. Süreçle ilgili bilgilendirme yapılacaktır.</p>
          </div>
          <div class="footer">
            <p>Bu e-posta, İş Ajanı bitirme tezi kapsamında otomatik olarak oluşturulmuştur.</p>
            <p>&copy; ${new Date().getFullYear()} İş Ajanı Ağı</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer] Başvuru onay e-postası başarıyla gönderildi: ${userEmail}`);
  } catch (error) {
    console.error('[Nodemailer] E-posta gönderme hatası:', error);
  }
};

module.exports = {
  sendApplicationEmail
};
