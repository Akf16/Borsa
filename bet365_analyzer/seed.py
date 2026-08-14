"""Örnek veri ile veritabanını doldurur."""

import datetime

from database import Base, SessionLocal, engine
import models
import schemas
import services

Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        if db.query(models.HistoricalMatch).count() > 0:
            print("Veritabanı zaten dolu, seed atlandı.")
            return

        sample_matches = [
            {
                "match_date": datetime.datetime(2025, 1, 10, 20, 0),
                "league": "Premier League",
                "home_team": "Arsenal",
                "away_team": "Chelsea",
                "open_ms1": 1.85, "open_ms0": 3.60, "open_ms2": 4.20,
                "open_kg_var": 1.70, "open_kg_yok": 2.10,
                "open_iy_05_ust": 1.45, "open_iy_05_alt": 2.65,
                "open_ms_15_ust": 1.30, "open_ms_15_alt": 3.40,
                "close_ms1": 1.80, "close_ms0": 3.70, "close_ms2": 4.40,
                "close_kg_var": 1.72, "close_kg_yok": 2.05,
                "close_iy_05_ust": 1.48, "close_iy_05_alt": 2.60,
                "close_ms_15_ust": 1.32, "close_ms_15_alt": 3.30,
                "ht_home_goals": 1, "ht_away_goals": 0,
                "ft_home_goals": 2, "ft_away_goals": 1,
            },
            {
                "match_date": datetime.datetime(2025, 1, 12, 17, 30),
                "league": "Premier League",
                "home_team": "Liverpool",
                "away_team": "Arsenal",
                "open_ms1": 2.10, "open_ms0": 3.40, "open_ms2": 3.30,
                "open_kg_var": 1.65, "open_kg_yok": 2.20,
                "open_iy_05_ust": 1.40, "open_iy_05_alt": 2.80,
                "open_ms_15_ust": 1.28, "open_ms_15_alt": 3.50,
                "close_ms1": 2.05, "close_ms0": 3.45, "close_ms2": 3.40,
                "close_kg_var": 1.68, "close_kg_yok": 2.15,
                "close_iy_05_ust": 1.42, "close_iy_05_alt": 2.75,
                "close_ms_15_ust": 1.30, "close_ms_15_alt": 3.45,
                "ht_home_goals": 0, "ht_away_goals": 1,
                "ft_home_goals": 1, "ft_away_goals": 2,
            },
            {
                "match_date": datetime.datetime(2025, 1, 15, 21, 0),
                "league": "La Liga",
                "home_team": "Real Madrid",
                "away_team": "Barcelona",
                "open_ms1": 1.90, "open_ms0": 3.80, "open_ms2": 3.60,
                "open_kg_var": 1.55, "open_kg_yok": 2.35,
                "open_iy_05_ust": 1.35, "open_iy_05_alt": 3.00,
                "open_ms_15_ust": 1.22, "open_ms_15_alt": 3.80,
                "close_ms1": 1.88, "close_ms0": 3.85, "close_ms2": 3.65,
                "close_kg_var": 1.58, "close_kg_yok": 2.30,
                "close_iy_05_ust": 1.38, "close_iy_05_alt": 2.95,
                "close_ms_15_ust": 1.25, "close_ms_15_alt": 3.70,
                "ht_home_goals": 1, "ht_away_goals": 1,
                "ft_home_goals": 2, "ft_away_goals": 2,
            },
            {
                "match_date": datetime.datetime(2025, 2, 1, 16, 0),
                "league": "Premier League",
                "home_team": "Arsenal",
                "away_team": "Liverpool",
                "open_ms1": 1.82, "open_ms0": 3.65, "open_ms2": 4.10,
                "open_kg_var": 1.68, "open_kg_yok": 2.12,
                "open_iy_05_ust": 1.44, "open_iy_05_alt": 2.68,
                "open_ms_15_ust": 1.29, "open_ms_15_alt": 3.42,
                "close_ms1": 1.79, "close_ms0": 3.72, "close_ms2": 4.25,
                "close_kg_var": 1.71, "close_kg_yok": 2.08,
                "close_iy_05_ust": 1.47, "close_iy_05_alt": 2.62,
                "close_ms_15_ust": 1.31, "close_ms_15_alt": 3.35,
                "ht_home_goals": 2, "ht_away_goals": 0,
                "ft_home_goals": 3, "ft_away_goals": 1,
            },
            {
                "match_date": datetime.datetime(2025, 2, 5, 19, 45),
                "league": "Premier League",
                "home_team": "Chelsea",
                "away_team": "Arsenal",
                "open_ms1": 2.40, "open_ms0": 3.30, "open_ms2": 2.90,
                "open_kg_var": 1.62, "open_kg_yok": 2.25,
                "open_iy_05_ust": 1.38, "open_iy_05_alt": 2.85,
                "open_ms_15_ust": 1.26, "open_ms_15_alt": 3.55,
                "close_ms1": 2.45, "close_ms0": 3.25, "close_ms2": 2.85,
                "close_kg_var": 1.64, "close_kg_yok": 2.22,
                "close_iy_05_ust": 1.40, "close_iy_05_alt": 2.80,
                "close_ms_15_ust": 1.28, "close_ms_15_alt": 3.48,
                "ht_home_goals": 0, "ht_away_goals": 0,
                "ft_home_goals": 0, "ft_away_goals": 1,
            },
        ]

        for item in sample_matches:
            services.create_historical_match(db, schemas.HistoricalMatchCreate(**item))

        upcoming = schemas.UpcomingMatchCreate(
            match_date=datetime.datetime.utcnow() + datetime.timedelta(days=1),
            league="Premier League",
            home_team="Arsenal",
            away_team="Chelsea",
            open_ms1=1.87,
            open_ms0=3.55,
            open_ms2=4.15,
            open_kg_var=1.69,
            open_kg_yok=2.12,
            open_iy_05_ust=1.46,
            open_iy_05_alt=2.62,
            open_ms_15_ust=1.31,
            open_ms_15_alt=3.38,
            current_ms1=1.83,
            current_ms0=3.62,
            current_ms2=4.30,
            current_kg_var=1.73,
            current_kg_yok=2.06,
            current_iy_05_ust=1.49,
            current_iy_05_alt=2.58,
            current_ms_15_ust=1.33,
            current_ms_15_alt=3.28,
        )
        services.create_upcoming_match(db, upcoming)

        print(f"Seed tamamlandı: {len(sample_matches)} geçmiş maç, 1 yaklaşan maç.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
