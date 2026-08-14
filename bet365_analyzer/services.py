from sqlalchemy.orm import Session

import models
import schemas


def compute_match_flags(
    ht_home: int,
    ht_away: int,
    ft_home: int,
    ft_away: int,
) -> dict:
    """Maç skorlarından analiz flaglerini üretir."""
    total_goals = ft_home + ft_away
    ht_total = ht_home + ht_away

    if ft_home > ft_away:
        res_ms = "1"
    elif ft_home < ft_away:
        res_ms = "2"
    else:
        res_ms = "0"

    return {
        "res_ms": res_ms,
        "res_kg_var": ft_home > 0 and ft_away > 0,
        "res_iy_05_ust": ht_total > 0,
        "res_ms_15_ust": total_goals > 1,
    }


def create_historical_match(db: Session, data: schemas.HistoricalMatchCreate) -> models.HistoricalMatch:
    flags = compute_match_flags(
        data.ht_home_goals,
        data.ht_away_goals,
        data.ft_home_goals,
        data.ft_away_goals,
    )

    match = models.HistoricalMatch(
        **data.model_dump(),
        **flags,
    )
    db.add(match)
    db.commit()
    db.refresh(match)
    return match


def run_odds_backtest(
    db: Session,
    odds: schemas.OddsInput,
    odds_type: str = "open",
    tolerance: float = 0.03,
) -> schemas.AnalysisResult:
    """
    Geçmiş oranları toleransla filtreler ve olasılıkları hesaplar.
    odds_type: 'open' (Açılış) veya 'close' (Kapanış)
    """
    prefix = "open_" if odds_type == "open" else "close_"

    ms1_col = getattr(models.HistoricalMatch, f"{prefix}ms1")
    ms0_col = getattr(models.HistoricalMatch, f"{prefix}ms0")
    ms2_col = getattr(models.HistoricalMatch, f"{prefix}ms2")

    query = db.query(models.HistoricalMatch).filter(
        ms1_col.between(odds.ms1 * (1 - tolerance), odds.ms1 * (1 + tolerance)),
        ms0_col.between(odds.ms0 * (1 - tolerance), odds.ms0 * (1 + tolerance)),
        ms2_col.between(odds.ms2 * (1 - tolerance), odds.ms2 * (1 + tolerance)),
    )

    if odds.kg_var is not None:
        kg_col = getattr(models.HistoricalMatch, f"{prefix}kg_var")
        query = query.filter(
            kg_col.between(odds.kg_var * (1 - tolerance), odds.kg_var * (1 + tolerance))
        )

    if odds.iy_05_ust is not None:
        iy_col = getattr(models.HistoricalMatch, f"{prefix}iy_05_ust")
        query = query.filter(
            iy_col.between(odds.iy_05_ust * (1 - tolerance), odds.iy_05_ust * (1 + tolerance))
        )

    if odds.ms_15_ust is not None:
        ms15_col = getattr(models.HistoricalMatch, f"{prefix}ms_15_ust")
        query = query.filter(
            ms15_col.between(odds.ms_15_ust * (1 - tolerance), odds.ms_15_ust * (1 + tolerance))
        )

    matches = query.all()
    total = len(matches)
    odds_label = "Açılış" if odds_type == "open" else "Kapanış"

    if total == 0:
        return schemas.AnalysisResult(
            odds_type=odds_label,
            matched_count=0,
            tolerance_applied=tolerance,
            ms1_percentage=0.0,
            ms0_percentage=0.0,
            ms2_percentage=0.0,
            kg_var_percentage=0.0,
            iy_05_ust_percentage=0.0,
            ms_15_ust_percentage=0.0,
            recommended_prediction="Yetersiz Veri",
            confidence_score=0.0,
        )

    ms1_pct = round((sum(1 for m in matches if m.res_ms == "1") / total) * 100, 2)
    ms0_pct = round((sum(1 for m in matches if m.res_ms == "0") / total) * 100, 2)
    ms2_pct = round((sum(1 for m in matches if m.res_ms == "2") / total) * 100, 2)
    kg_var_pct = round((sum(1 for m in matches if m.res_kg_var) / total) * 100, 2)
    iy_05_pct = round((sum(1 for m in matches if m.res_iy_05_ust) / total) * 100, 2)
    ms_15_pct = round((sum(1 for m in matches if m.res_ms_15_ust) / total) * 100, 2)

    predictions = [
        ("MS 1", ms1_pct),
        ("MS 0", ms0_pct),
        ("MS 2", ms2_pct),
        ("KG VAR", kg_var_pct),
        ("İY 0.5 ÜST", iy_05_pct),
        ("MS 1.5 ÜST", ms_15_pct),
    ]
    best_pred = max(predictions, key=lambda x: x[1])

    return schemas.AnalysisResult(
        odds_type=odds_label,
        matched_count=total,
        tolerance_applied=tolerance,
        ms1_percentage=ms1_pct,
        ms0_percentage=ms0_pct,
        ms2_percentage=ms2_pct,
        kg_var_percentage=kg_var_pct,
        iy_05_ust_percentage=iy_05_pct,
        ms_15_ust_percentage=ms_15_pct,
        recommended_prediction=best_pred[0],
        confidence_score=best_pred[1],
    )


def get_team_last_10(db: Session, team_name: str) -> schemas.TeamFormSummary:
    """Takımın geçmişteki son 10 maçını ve istatistiki özetini üretir."""
    matches = (
        db.query(models.HistoricalMatch)
        .filter(
            (models.HistoricalMatch.home_team == team_name)
            | (models.HistoricalMatch.away_team == team_name)
        )
        .order_by(models.HistoricalMatch.match_date.desc())
        .limit(10)
        .all()
    )

    history: list[schemas.TeamMatchHistory] = []
    wins = draws = losses = 0
    scored = conceded = 0
    kg_var_count = ms_15_count = 0

    for m in matches:
        is_home = m.home_team == team_name
        team_goals = m.ft_home_goals if is_home else m.ft_away_goals
        opp_goals = m.ft_away_goals if is_home else m.ft_home_goals
        opponent = m.away_team if is_home else m.home_team

        scored += team_goals
        conceded += opp_goals

        if team_goals > opp_goals:
            res = "G"
            wins += 1
        elif team_goals == opp_goals:
            res = "B"
            draws += 1
        else:
            res = "M"
            losses += 1

        if m.res_kg_var:
            kg_var_count += 1
        if m.res_ms_15_ust:
            ms_15_count += 1

        history.append(
            schemas.TeamMatchHistory(
                match_date=m.match_date,
                opponent=opponent,
                is_home=is_home,
                score=f"{m.ft_home_goals}-{m.ft_away_goals}",
                ht_score=f"{m.ht_home_goals}-{m.ht_away_goals}",
                result=res,
                kg_var=bool(m.res_kg_var),
                ms_15_ust=bool(m.res_ms_15_ust),
            )
        )

    total = len(matches) if matches else 1

    return schemas.TeamFormSummary(
        team_name=team_name,
        last_10_matches=history,
        wins=wins,
        draws=draws,
        losses=losses,
        avg_goals_scored=round(scored / total, 2),
        avg_goals_conceded=round(conceded / total, 2),
        kg_var_ratio=round((kg_var_count / total) * 100, 2),
        ms_15_ust_ratio=round((ms_15_count / total) * 100, 2),
    )


def create_upcoming_match(db: Session, data: schemas.UpcomingMatchCreate) -> models.UpcomingMatch:
    match = models.UpcomingMatch(**data.model_dump())
    db.add(match)
    db.commit()
    db.refresh(match)
    return match


def update_upcoming_odds(
    db: Session,
    match_id: int,
    odds: schemas.OddsInput,
) -> models.UpcomingMatch:
    match = db.query(models.UpcomingMatch).filter(models.UpcomingMatch.id == match_id).first()
    if not match:
        raise ValueError("Maç bulunamadı.")

    match.current_ms1 = odds.ms1
    match.current_ms0 = odds.ms0
    match.current_ms2 = odds.ms2
    match.current_kg_var = odds.kg_var
    match.current_kg_yok = odds.kg_yok
    match.current_iy_05_ust = odds.iy_05_ust
    match.current_iy_05_alt = odds.iy_05_alt
    match.current_ms_15_ust = odds.ms_15_ust
    match.current_ms_15_alt = odds.ms_15_alt

    db.commit()
    db.refresh(match)
    return match
