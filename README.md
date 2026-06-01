# 🕵️‍♀️ İş Ajanı - Akıllı İş İlanı Bildirim Sistemi

**İş Ajanı**, kullanıcıların belirledikleri sektörlerdeki iş ilanlarını takip etmelerini ve ilanlara başvurduklarında anında e-posta ile bilgilendirilmelerini sağlayan, Fırat Üniversitesi bitirme projesi kapsamında geliştirilmiş full-stack bir web uygulamasıdır.

Proje, modern bir kullanıcı deneyimi sunmak üzere karanlık tema (dark theme) ve cam tasarımı (glassmorphism) prensipleriyle tasarlanmış olup, Docker üzerinde tamamen izole ve paylaşımlı SQLite veritabanı mimarisiyle çalışmaktadır.

---

## 🚀 Öne Çıkan Özellikler

* **Sektörel Filtreleme:** İlanların kategorilere göre listelenmesi ve kolay gezinme.
* **Hızlı Kullanıcı Kaydı:** Ad-Soyad ve E-posta tabanlı, şifreleri bcrypt ile korunan güvenli kimlik doğrulama (auth) sistemi.
* **Otomatik E-Posta Bildirimleri:** Başvuru yapıldığı anda `Nodemailer` üzerinden kullanıcının gelen kutusuna anında onay e-postası iletimi.
* **Modern ve Responsive Arayüz:** Sabit (sticky) navbar, sorunsuz çalışan dropdown menüler ve tüm cihazlarla uyumlu tasarım.
* **Konteynerize Mimari:** `Docker Compose` ile harici bir veritabanı sunucusuna ihtiyaç duymadan, paylaşımlı SQLite volume üzerinden tek tıkla ayağa kalkabilen yapı.

---

## 🛠️ Kullanılan Teknolojiler

* **Frontend:** React.js, React Router DOM, Glassmorphism UI
* **Backend:** Node.js, Express.js
* **Veritabanı:** SQLite3
* **Arka Plan İşlemleri (Worker):** Node.js (Otomatik İlan Tarayıcı)
* **Bildirim Sistemi:** Nodemailer (Gmail SMTP Entegrasyonu)
* **DevOps:** Docker & Docker Compose

---

## 🏗️ Sistem Mimarisi

Aşağıdaki diyagram, sistemin Frontend, Backend, Worker, Veritabanı ve Bildirim servisleri arasındaki veri akışını ve etkileşimi göstermektedir:

```mermaid
graph TD
    subgraph Client [Kullanıcı Arayüzü]
        UI[React Frontend]
    end

    subgraph Server [Arka Uç ve İşlemler]
        API[Node.js / Express Backend]
        Worker[Node.js Worker Servisi]
        Mailer[Nodemailer SMTP]
    end

    subgraph Database [Veri Depolama]
        DB[(SQLite - Paylaşımlı Docker Volume)]
    end

    %% Bağlantılar
    User((Kullanıcı)) -->|Kayıt & Başvuru| UI
    UI -->|REST API İstekleri| API
    API -->|Okuma / Yazma| DB
    Worker -->|Periyodik Tarama| DB
    API -->|E-Posta Tetikleme| Mailer
    Mailer -->|Onay E-Postası Gönderimi| User

    classDef react fill:#61dafb,stroke:#333,stroke-width:2px,color:#000;
    classDef node fill:#339933,stroke:#333,stroke-width:2px,color:#fff;
    classDef db fill:#003B57,stroke:#333,stroke-width:2px,color:#fff;
    
    class UI react;
    class API,Worker,Mailer node;
    class DB db;
