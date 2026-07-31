# Hizli Kurulum Rehberi

## SUPABASE BAGLANTISI

### 1. Proje Olustur
- https://supabase.com/dashboard → **New Project**
- Proje adi: `borsa-dashboard`
- Region: `Frankfurt (eu-central-1)`

### 2. SQL Calistir
- Dashboard → **SQL Editor**
- `supabase/migrations/001_initial.sql` icerigini yapistirip **Run**

### 3. Anahtarlari Al
**Project Settings → API** sayfasindan:

```
VITE_SUPABASE_URL=https://XXXXXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

### 4. Yerel .env Olustur
```powershell
copy .env.example .env
# .env dosyasina yukaridaki degerleri yapistirin
```

---

## VERCEL BAGLANTISI

### 1. GitHub'a Push (asagiya bakin)

### 2. Vercel'e Bagla
- https://vercel.com/new
- GitHub reposunu sec: `borsa-dashboard`
- Framework: **Vite** (otomatik)

### 3. Environment Variables (Vercel)
| Degisken | Deger |
|----------|-------|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

### 4. Deploy
Deploy sonrasi canli URL: `https://borsa-dashboard-xxx.vercel.app`

---

## GITHUB BAGLANTISI

Terminalde su komutlari calistirin:

```powershell
# GitHub CLI ile giris (tarayici acilir)
gh auth login

# Repo olustur ve push et
gh repo create borsa-dashboard --public --source=. --remote=origin --push
```

**Alternatif (manuel):**
1. https://github.com/new → Repo adi: `borsa-dashboard`
2. Asagidaki komutlar:
```powershell
git remote add origin https://github.com/KULLANICI_ADINIZ/borsa-dashboard.git
git push -u origin main
```

---

## Baglanti Ozeti

| Servis | Panel |
|--------|-------|
| Supabase | https://supabase.com/dashboard |
| Vercel | https://vercel.com/dashboard |
| GitHub | https://github.com/KULLANICI_ADINIZ/borsa-dashboard |
| Yerel Dev | http://localhost:5173 |
