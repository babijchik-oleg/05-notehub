import { type Note } from "../types/note";
import axios from "axios";

const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

interface NOTEHUBResponse {
  totalPages: number;
  notes: Note[];
}

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
  },
});
if (!NOTEHUB_TOKEN) {
  console.error("NOTEHUB  Access Token is missing! Check your .env file.");
}

export async function fetchNotes(
  query: string,
  page: number = 1,
  perPage: number = 12,
): Promise<NOTEHUBResponse | null> {
  if (!NOTEHUB_TOKEN) return null;

  try {
    const response = await api.get<NOTEHUBResponse>("/notes", {
      params: { search: query, page, perPage },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return null;
  }
}

export async function createNote(noteData: {
  title: string;
  content: string | null;
  tag: NoteTag;
}): Promise<Note | null> {
  if (!NOTEHUB_TOKEN) return null;

  try {
    const response = await api.post<Note>("/notes", noteData);
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    return null;
  }
}

export async function deleteNote(id: string): Promise<Note | null> {
  if (!NOTEHUB_TOKEN) {
    console.error("NOTEHUB  Access Token is missing! Check your .env file.");
    return null;
  }
  try {
    const response = await api.delete<Note>(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting note with id ${id}:`, error);
    return null;
  }
}
