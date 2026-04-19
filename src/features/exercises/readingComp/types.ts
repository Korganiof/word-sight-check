export interface ReadingCompQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ReadingCompPassage {
  id: string;
  title: string;
  paragraphs: string[];
  questions: ReadingCompQuestion[];
}
