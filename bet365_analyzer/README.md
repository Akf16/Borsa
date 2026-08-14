# Bet365 AI Oran Analiz API

FastAPI + SQLite (SQLAlchemy) tabanlı oran eşleştirme ve form analiz motoru.

## Proje Yapısı

```
bet365_analyzer/
├── database.py    # SQLite bağlantısı ve session yönetimi
├── models.py      # Veritabanı tabloları
├── schemas.py     # Pydantic şemaları
├── services.py    # Oran eşleştirme ve istatistik motoru
├── main.py        # FastAPI rotaları
├── seed.py        # Örnek veri yükleme
└── requirements.txt
```

## Kurulum

```bash
cd bet365_analyzer
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload
```

Swagger UI: http://127.0.0.1:8000/docs

## API Uç Noktaları

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/matches/upcoming` | Yaklaşan maç listesi |
| POST | `/api/matches/upcoming` | Yeni maç ekle |
| PATCH | `/api/matches/upcoming/{id}/odds` | Güncel oranları güncelle |
| GET | `/api/matches/historical` | Geçmiş maç listesi |
| POST | `/api/matches/historical` | Geçmiş maç ekle |
| POST | `/api/analysis/custom-odds` | Toleranslı oran analizi |
| GET | `/api/teams/{team_name}/form` | Son 10 maç formu |
| GET | `/api/matches/{id}/detail` | Tam maç analizi |

## Oran Analizi

`tolerance=0.03` ile %3 toleranslı eşleştirme yapılır.
- `odds_type=open` → Açılış oranları
- `odds_type=close` → Kapanış oranları

## Veritabanı

SQLite dosyası: `bet365_analysis.db` (proje klasöründe oluşturulur)
