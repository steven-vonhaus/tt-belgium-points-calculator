export interface CompetitionConfig {
  coef: number;
  code: string;
}

export interface Coefficients {
  interclub: Record<string, CompetitionConfig>;
  tournament: Record<string, CompetitionConfig>;
}

export const COEFFICIENTS: Coefficients = {
  interclub: {
    'Super Division': { coef: 2.2, code: 'R2' },
    'N1 & N2': { coef: 1, code: 'R5' },
    'N3 & IWB & Landelijk': { coef: 0.95, code: 'R6' },
    'P1': { coef: 0.9, code: 'R7' },
    'Autres provinciales': { coef: 0.85, code: 'R8' },
    'Interclubs vétérans': { coef: 0.65, code: 'R9' },
  },
  tournament: {
    'Tournoi Série A': { coef: 1.5, code: 'R5' },
    'Tournoi Série B & C': { coef: 1, code: 'R9' },
    'Tournois vétérans': { coef: 0.65, code: 'R9' },
    'Champ. Belgique A (Final)': { coef: 2.5, code: 'R1' },
    'Champ. Belgique A (Poules)': { coef: 2.2, code: 'R2' },
    'Champ. A AFTT': { coef: 1.5, code: 'R3' },
    'Coupe Belgique (1/2 & finale)': { coef: 1.5, code: 'R3' },
    'Champ. Belgique (Jeunes/Vétérans/BCDE)': { coef: 1.5, code: 'R4' },
    'Champ. BCDE AFTT': { coef: 1.2, code: 'R5' },
    "Coupe Belgique (jusqu'à 1/4)": { coef: 1.2, code: 'R5' },
    'Champ. Provinciaux': { coef: 1.2, code: 'R9' },
  },
};

export const DEFAULT_COMPETITION_TYPE = 'interclub';
export const DEFAULT_COMPETITION = 'Autres provinciales';
export const DEFAULT_TOURNAMENT_COMPETITION = 'Tournoi Série B & C';

