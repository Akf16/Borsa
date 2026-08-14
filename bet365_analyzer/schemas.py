from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class OddsInput(BaseModel):
    ms1: float = Field(..., gt=1.0)
    ms0: float = Field(..., gt=1.0)
    ms2: float = Field(..., gt=1.0)
    kg_var: Optional[float] = Field(None, gt=1.0)
    kg_yok: Optional[float] = Field(None, gt=1.0)
    iy_05_ust: Optional[float] = Field(None, gt=1.0)
    iy_05_alt: Optional[float] = Field(None, gt=1.0)
    ms_15_ust: Optional[float] = Field(None, gt=1.0)
    ms_15_alt: Optional[float] = Field(None, gt=1.0)


class AnalysisResult(BaseModel):
    odds_type: str
    matched_count: int
    tolerance_applied: float
    ms1_percentage: float
    ms0_percentage: float
    ms2_percentage: float
    kg_var_percentage: float
    iy_05_ust_percentage: float
    ms_15_ust_percentage: float
    recommended_prediction: str
    confidence_score: float


class TeamMatchHistory(BaseModel):
    match_date: datetime
    opponent: str
    is_home: bool
    score: str
    ht_score: str
    result: str
    kg_var: bool
    ms_15_ust: bool


class TeamFormSummary(BaseModel):
    team_name: str
    last_10_matches: List[TeamMatchHistory]
    wins: int
    draws: int
    losses: int
    avg_goals_scored: float
    avg_goals_conceded: float
    kg_var_ratio: float
    ms_15_ust_ratio: float


class MatchDetailResponse(BaseModel):
    match_id: int
    home_team: str
    away_team: str
    league: str
    match_date: datetime
    opening_analysis: Optional[AnalysisResult]
    closing_analysis: Optional[AnalysisResult]
    home_form: TeamFormSummary
    away_form: TeamFormSummary


class UpcomingMatchResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    match_date: datetime
    league: str
    home_team: str
    away_team: str
    open_ms1: float
    open_ms0: float
    open_ms2: float
    open_kg_var: Optional[float] = None
    open_kg_yok: Optional[float] = None
    open_iy_05_ust: Optional[float] = None
    open_iy_05_alt: Optional[float] = None
    open_ms_15_ust: Optional[float] = None
    open_ms_15_alt: Optional[float] = None
    current_ms1: Optional[float] = None
    current_ms0: Optional[float] = None
    current_ms2: Optional[float] = None
    current_kg_var: Optional[float] = None
    current_kg_yok: Optional[float] = None
    current_iy_05_ust: Optional[float] = None
    current_iy_05_alt: Optional[float] = None
    current_ms_15_ust: Optional[float] = None
    current_ms_15_alt: Optional[float] = None


class UpcomingMatchCreate(BaseModel):
    match_date: datetime
    league: str
    home_team: str
    away_team: str
    open_ms1: float
    open_ms0: float
    open_ms2: float
    open_kg_var: Optional[float] = None
    open_kg_yok: Optional[float] = None
    open_iy_05_ust: Optional[float] = None
    open_iy_05_alt: Optional[float] = None
    open_ms_15_ust: Optional[float] = None
    open_ms_15_alt: Optional[float] = None
    current_ms1: Optional[float] = None
    current_ms0: Optional[float] = None
    current_ms2: Optional[float] = None
    current_kg_var: Optional[float] = None
    current_kg_yok: Optional[float] = None
    current_iy_05_ust: Optional[float] = None
    current_iy_05_alt: Optional[float] = None
    current_ms_15_ust: Optional[float] = None
    current_ms_15_alt: Optional[float] = None


class HistoricalMatchCreate(BaseModel):
    match_date: datetime
    league: str
    home_team: str
    away_team: str
    open_ms1: float
    open_ms0: float
    open_ms2: float
    open_kg_var: Optional[float] = None
    open_kg_yok: Optional[float] = None
    open_iy_05_ust: Optional[float] = None
    open_iy_05_alt: Optional[float] = None
    open_ms_15_ust: Optional[float] = None
    open_ms_15_alt: Optional[float] = None
    close_ms1: float
    close_ms0: float
    close_ms2: float
    close_kg_var: Optional[float] = None
    close_kg_yok: Optional[float] = None
    close_iy_05_ust: Optional[float] = None
    close_iy_05_alt: Optional[float] = None
    close_ms_15_ust: Optional[float] = None
    close_ms_15_alt: Optional[float] = None
    ht_home_goals: int = Field(..., ge=0)
    ht_away_goals: int = Field(..., ge=0)
    ft_home_goals: int = Field(..., ge=0)
    ft_away_goals: int = Field(..., ge=0)


class HistoricalMatchResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    match_date: datetime
    league: str
    home_team: str
    away_team: str
    res_ms: str
    res_kg_var: bool
    res_iy_05_ust: bool
    res_ms_15_ust: bool
    ft_home_goals: int
    ft_away_goals: int
