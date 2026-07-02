export interface Note {
  id: string | number;
  title: string;
  content: string;
  tag: string;
}

export interface NOTEHUBResponse {
  totalPages: number;
  notes: [];
  results: Note[];
  page: number;
  perPage: number;
  total_pages: number;
  total_results: number;
}
