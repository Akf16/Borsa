# Global Yapay Zeka Sinyalleri — Borsa Dashboard

Kripto, Forex ve Değerli Madenler için Türkçe yapay zeka sinyal ve piyasa takip dashboard'u.

## Teknolojiler

- **React 19** + TypeScript + Vite
- **TailwindCSS v4** — karanlık tema
- **Binance API** — 15 saniyede bir canlı fiyat
- **Supabase** — piyasa verisi ve sinyal geçmişi
- **Vercel** — production deploy

---

## 1. Supabase Kurulumu

### Adım 1: Proje Oluştur
1. [supabase.com/dashboard](https://supabase.com/dashboard) adresine gidin
2. **New Project** → Proje adı: `borsa-dashboard`
3. Region: `Frankfurt (eu-central-1)` (Türkiye'ye en yakın)
4. Database password belirleyin ve projeyi oluşturun

### Adım 2: Veritabanı Tablolarını Oluştur
1. Supabase Dashboard → **SQL Editor**
2. `supabase/migrations/001_initial.sql` dosyasının içeriğini yapıştırın
3. **Run** ile çalıştırın

### Adım 3: Bağlantı Bilgilerini Al
1. **Project Settings** → **API**
2. Şu değerleri kopyalayın:

| Alan | Nereden |
|------|---------|
| `VITE_SUPABASE_URL` | Project URL → `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Project API keys → `anon` `public` |

### Adım 4: Yerel Ortam Değişkenleri
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. Vercel Kurulumu

### Adım 1: GitHub'a Push (aşağıdaki bölüm)
Önce kodu GitHub'a yükleyin.

### Adım 2: Vercel'e Bağla
1. [vercel.com/new](https://vercel.com/new) adresine gidin
2. GitHub hesabınızı bağlayın
3. `borsa-dashboard` reposunu seçin
4. Framework: **Vite** (otomatik algılanır)

### Adım 3: Environment Variables (Vercel Dashboard)
**Settings → Environment Variables** bölümüne ekleyin:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key |

### Adım 4: Deploy
- **Deploy** butonuna tıklayın
- Canlı URL: `https://borsa-dashboard.vercel.app` (veya size atanan domain)

### Vercel CLI (isteğe bağlı)
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 3. GitHub Kurulumu

```bash
git init
git add .
git commit -m "feat: Global YZ Sinyal Dashboard - Supabase + Vercel hazır"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/borsa-dashboard.git
git push -u origin main
```

---

## Yerel Geliştirme

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production build
npm run preview  # Build önizleme
```

---

## Proje Yapısı

```
src/
├── components/     UI bileşenleri
├── hooks/          useMarketData (Binance 15sn polling)
├── services/       binanceApi, supabaseSync
├── lib/            supabase client
├── data/           parite tanımları
└── types/          TypeScript tipleri
supabase/
└── migrations/     SQL şema dosyaları
```

---

## Desteklenen Pariteler

| Parite | Kaynak |
|--------|--------|
| BTC/USDT | Binance BTCUSDT |
| EUR/USD | Binance EURUSDT |
| USD/TRY | Binance USDTTRY |
| GBP/USD | Binance GBPUSDT |
| XAU/USD | Binance PAXGUSDT |
| EUR/TRY | Türetilmiş |
| USD/JPY | Türetilmiş (BTCJPY/BTCUSDT) |
| XAU/EUR | Türetilmiş |
| GRAM/TL | Türetilmiş |

---

## Bağlantı Özeti

| Servis | URL |
|--------|-----|
| Supabase Dashboard | https://supabase.com/dashboard/project/YOUR_PROJECT_ID |
| Vercel Dashboard | https://vercel.com/dashboard |
| GitHub Repo | https://github.com/KULLANICI_ADINIZ/borsa-dashboard |
| Canlı Site | https://borsa-dashboard.vercel.app |
