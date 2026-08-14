import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String

from database import Base


class HistoricalMatch(Base):
    """Geçmiş maçların oranlarını ve sonuçlarını saklayan tablo."""

    __tablename__ = "historical_matches"

    id = Column(Integer, primary_key=True, index=True)
    match_date = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    league = Column(String, index=True)
    home_team = Column(String, index=True)
    away_team = Column(String, index=True)

    # Açılış Oranları (Opening Odds)
    open_ms1 = Column(Float, index=True)
    open_ms0 = Column(Float, index=True)
    open_ms2 = Column(Float, index=True)
    open_kg_var = Column(Float)
    open_kg_yok = Column(Float)
    open_iy_05_ust = Column(Float)
    open_iy_05_alt = Column(Float)
    open_ms_15_ust = Column(Float)
    open_ms_15_alt = Column(Float)

    # Kapanış Oranları (Closing Odds)
    close_ms1 = Column(Float, index=True)
    close_ms0 = Column(Float, index=True)
    close_ms2 = Column(Float, index=True)
    close_kg_var = Column(Float)
    close_kg_yok = Column(Float)
    close_iy_05_ust = Column(Float)
    close_iy_05_alt = Column(Float)
    close_ms_15_ust = Column(Float)
    close_ms_15_alt = Column(Float)

    # Maç Sonu Skor ve Sonuçları
    ht_home_goals = Column(Integer)
    ht_away_goals = Column(Integer)
    ft_home_goals = Column(Integer)
    ft_away_goals = Column(Integer)

    # Analiz Flagleri (Hızlı sorgulama için)
    res_ms = Column(String, index=True)
    res_kg_var = Column(Boolean)
    res_iy_05_ust = Column(Boolean)
    res_ms_15_ust = Column(Boolean)


class UpcomingMatch(Base):
    """Bugünün / yaklaşan bültendeki maçları saklayan tablo."""

    __tablename__ = "upcoming_matches"

    id = Column(Integer, primary_key=True, index=True)
    match_date = Column(DateTime, index=True)
    league = Column(String)
    home_team = Column(String, index=True)
    away_team = Column(String, index=True)

    # Açılış Oranları
    open_ms1 = Column(Float)
    open_ms0 = Column(Float)
    open_ms2 = Column(Float)
    open_kg_var = Column(Float)
    open_kg_yok = Column(Float)
    open_iy_05_ust = Column(Float)
    open_iy_05_alt = Column(Float)
    open_ms_15_ust = Column(Float)
    open_ms_15_alt = Column(Float)

    # Güncel / Kapanış Oranları
    current_ms1 = Column(Float, nullable=True)
    current_ms0 = Column(Float, nullable=True)
    current_ms2 = Column(Float, nullable=True)
    current_kg_var = Column(Float, nullable=True)
    current_kg_yok = Column(Float, nullable=True)
    current_iy_05_ust = Column(Float, nullable=True)
    current_iy_05_alt = Column(Float, nullable=True)
    current_ms_15_ust = Column(Float, nullable=True)
    current_ms_15_alt = Column(Float, nullable=True)
