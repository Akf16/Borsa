from typing import List

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
import services
from database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bet365 AI Oran Analiz API",
    description="Açılış/Kapanış oranları eşleştirme ve geçmiş form analiz motoru.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Bet365 AI Oran Analiz API",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/api/matches/upcoming", response_model=List[schemas.UpcomingMatchResponse])
def get_upcoming_matches(db: Session = Depends(get_db)):
    """Güncel maç listesini getirir."""
    return (
        db.query(models.UpcomingMatch)
        .order_by(models.UpcomingMatch.match_date.asc())
        .all()
    )


@app.post("/api/matches/upcoming", response_model=schemas.UpcomingMatchResponse, status_code=201)
def create_upcoming_match(
    payload: schemas.UpcomingMatchCreate,
    db: Session = Depends(get_db),
):
    """Yaklaşan maç bültenine yeni maç ekler."""
    return services.create_upcoming_match(db, payload)


@app.patch("/api/matches/upcoming/{match_id}/odds", response_model=schemas.UpcomingMatchResponse)
def update_upcoming_match_odds(
    match_id: int,
    odds: schemas.OddsInput,
    db: Session = Depends(get_db),
):
    """Yaklaşan maçın güncel/kapanış oranlarını günceller."""
    try:
        return services.update_upcoming_odds(db, match_id, odds)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/api/matches/historical", response_model=List[schemas.HistoricalMatchResponse])
def get_historical_matches(
    limit: int = Query(50, ge=1, le=500),
    league: str | None = None,
    db: Session = Depends(get_db),
):
    """Geçmiş maç veritabanını listeler."""
    query = db.query(models.HistoricalMatch).order_by(models.HistoricalMatch.match_date.desc())
    if league:
        query = query.filter(models.HistoricalMatch.league == league)
    return query.limit(limit).all()


@app.post("/api/matches/historical", response_model=schemas.HistoricalMatchResponse, status_code=201)
def create_historical_match(
    payload: schemas.HistoricalMatchCreate,
    db: Session = Depends(get_db),
):
    """Geçmiş maç verisi ekler (oranlar + skor + otomatik flag hesabı)."""
    return services.create_historical_match(db, payload)


@app.post("/api/analysis/custom-odds", response_model=schemas.AnalysisResult)
def analyze_custom_odds(
    odds: schemas.OddsInput,
    odds_type: str = Query("open", pattern="^(open|close)$", description="open = Açılış, close = Kapanış"),
    tolerance: float = Query(0.03, ge=0.0, le=0.2, description="Oran eşleşme toleransı örn: 0.03 (%3)"),
    db: Session = Depends(get_db),
):
    """Manuel girilen oranlar için geçmiş eşleşme ve olasılık hesabı yapar."""
    return services.run_odds_backtest(db=db, odds=odds, odds_type=odds_type, tolerance=tolerance)


@app.get("/api/teams/{team_name}/form", response_model=schemas.TeamFormSummary)
def get_team_form(team_name: str, db: Session = Depends(get_db)):
    """Takımın son 10 maçlık detaylı form istatistiklerini döner."""
    return services.get_team_last_10(db, team_name)


@app.get("/api/matches/{match_id}/detail", response_model=schemas.MatchDetailResponse)
def get_match_detail(
    match_id: int,
    tolerance: float = Query(0.03, ge=0.0, le=0.2),
    db: Session = Depends(get_db),
):
    """
    Maç detayı:
    - Açılış oran analizi
    - Kapanış / Güncel oran analizi
    - Ev sahibi ve deplasman son 10 maç formu
    """
    match = db.query(models.UpcomingMatch).filter(models.UpcomingMatch.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Maç bulunamadı.")

    open_odds = schemas.OddsInput(
        ms1=match.open_ms1,
        ms0=match.open_ms0,
        ms2=match.open_ms2,
        kg_var=match.open_kg_var,
        kg_yok=match.open_kg_yok,
        iy_05_ust=match.open_iy_05_ust,
        iy_05_alt=match.open_iy_05_alt,
        ms_15_ust=match.open_ms_15_ust,
        ms_15_alt=match.open_ms_15_alt,
    )
    opening_res = services.run_odds_backtest(db, open_odds, odds_type="open", tolerance=tolerance)

    closing_res = None
    if match.current_ms1 and match.current_ms0 and match.current_ms2:
        close_odds = schemas.OddsInput(
            ms1=match.current_ms1,
            ms0=match.current_ms0,
            ms2=match.current_ms2,
            kg_var=match.current_kg_var,
            kg_yok=match.current_kg_yok,
            iy_05_ust=match.current_iy_05_ust,
            iy_05_alt=match.current_iy_05_alt,
            ms_15_ust=match.current_ms_15_ust,
            ms_15_alt=match.current_ms_15_alt,
        )
        closing_res = services.run_odds_backtest(db, close_odds, odds_type="close", tolerance=tolerance)

    home_form = services.get_team_last_10(db, match.home_team)
    away_form = services.get_team_last_10(db, match.away_team)

    return schemas.MatchDetailResponse(
        match_id=match.id,
        home_team=match.home_team,
        away_team=match.away_team,
        league=match.league,
        match_date=match.match_date,
        opening_analysis=opening_res,
        closing_analysis=closing_res,
        home_form=home_form,
        away_form=away_form,
    )
