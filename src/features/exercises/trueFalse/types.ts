export interface TrueFalseStatement {
  id: string;
  statement: string;
  isTrue: boolean;
}

export interface TrueFalsePassage {
  id: string;
  title: string;
  paragraphs: string[];
  statements: TrueFalseStatement[];
}
