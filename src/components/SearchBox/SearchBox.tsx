import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (text: string) => void;
}

const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  return (
    <input
      className={css.input}
      type="text"
      name="query"
      placeholder="Search notes"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
export default SearchBox;
