import { Candidat, OBJECTIVES, TRAININGS } from '@/types/candidat';

const noms = ['Bennani', 'El Amrani', 'Chraibi', 'Fassi', 'Berrada', 'Alaoui', 'Tazi', 'Benjelloun', 'Idrissi', 'Kettani', 'Tahiri', 'Mansouri', 'El Ouazzani', 'Benhima', 'Filali'];
const prenoms = ['Fatima', 'Mohammed', 'Aicha', 'Youssef', 'Khadija', 'Omar', 'Salma', 'Hassan', 'Zineb', 'Ahmed', 'Layla', 'Karim', 'Nadia', 'Rachid', 'Samira'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCIN(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const numbers = Math.floor(Math.random() * 900000) + 100000;
  return `${letter}${numbers}`;
}

function generateDate(): string {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

export function generateMockCandidats(count: number = 50): Candidat[] {
  return Array.from({ length: count }, (_, i) => {
    const objectif = randomItem(OBJECTIVES);
    return {
      id: `c-${i + 1}`,
      numero: i + 1,
      date: generateDate(),
      nom: randomItem(noms),
      prenom: randomItem(prenoms),
      cin: generateCIN(),
      objectif,
      formation: objectif === 'Formation' ? randomItem(TRAININGS) : '',
      observation: Math.random() > 0.7 ? 'RAS' : '',
    };
  });
}
