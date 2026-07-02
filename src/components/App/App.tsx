import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import NoteForm from "../NoteForm/NoteForm";
import { Modal } from "../Modal/Modal";
import Paginate from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";
import type { Note } from "../../types/note";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const perPage = 12;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadNotes = async (search = "", currentPage = 1) => {
    const data = await fetchNotes(search, currentPage, perPage);
    if (data) {
      setNotes(data.notes || data.results || []);
      setTotalPages(data.totalPages || data.total_results / perPage || 0);
    }
  };

  const debouncedFetchNotes = useDebouncedCallback((query, currentPage) => {
    loadNotes(query, currentPage);
  }, 500);

  useEffect(() => {
    debouncedFetchNotes(searchQuery, page);
  }, [searchQuery, page, debouncedFetchNotes]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleCreateNote = async (noteData: Partial<Note>) => {
    const newNote = await createNote(noteData);
    if (newNote) {
      setIsModalOpen(false);
      setPage(1);
      loadNotes(searchQuery, 1);
    } else {
      alert("Failed to create note. Please try again.");
    }
  };

  // Функція для видалення нотатки з сервера та стану
  const handleDeleteNote = async (id: string | number) => {
    const deleted = await deleteNote(id);
    if (deleted) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      if (notes.length === 1 && page > 1) {
        setPage((prevPage) => prevPage - 1);
      } else {
        loadNotes(searchQuery, page);
      }
    } else {
      alert("Failed to delete note. Please try again.");
    }
  };

  const handleSelectNote = (note: Note) => {
    console.log("Selected note:", note);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {totalPages > 1 && (
          <Paginate
            pageCount={totalPages}
            forcePage={page}
            perPage={perPage}
            onPageChange={setPage}
          />
        )}
        <SearchBox value={searchQuery} onChange={handleSearchChange} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        <NoteList
          notes={notes}
          onSelect={handleSelectNote}
          onDelete={handleDeleteNote}
        />
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSubmitSuccess={handleCreateNote}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
