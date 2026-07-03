import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import NoteForm from "../NoteForm/NoteForm";
import { Modal } from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";
import type { Note } from "../../types/note";
import { fetchNotes } from "../../services/noteService";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 12;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedSearchQuery, page],
    queryFn: () => fetchNotes(debouncedSearchQuery, page + 1, perPage),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(0);
  };

  const handleSelectNote = (note: Note) => {
    console.log("Selected note:", note);
  };

  const notes = data?.notes || data?.results || [];
  const totalPages =
    data?.totalPages || Math.ceil((data?.total_results || 0) / perPage) || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            forcePage={page}
            onPageChange={setPage}
          />
        )}
      </header>

      <main>
        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Error loading notes. Please try again.</p>}
        {!isLoading && !isError && notes.length > 0 && (
          <NoteList notes={notes} onSelect={handleSelectNote} />
        )}
        {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default App;
