import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type NoteTag } from "../../services/noteService";
import css from "./NoteForm.module.css";

const NoteValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Мінімум 3 символи")
    .max(50, "Максимум 50 символів")
    .required("Це поле є обовʼязковим"),
  content: Yup.string().max(500, "Максимум 500 символів"),
  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Некоректний тег",
    )
    .required("Виберіть тег"),
});

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  onCancel: () => void;
}

const NoteForm = ({ onCancel }: NoteFormProps) => {
  const queryClient = useQueryClient();

  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  const mutation = useMutation({
    mutationFn: (newNote: NoteFormValues) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
    onError: (error) => {
      console.error("Error creating note via TanStack Query:", error);
      alert("Failed to create note. Please try again.");
    },
  });

  const handleSubmit = (
    values: NoteFormValues,
    { resetForm }: FormikHelpers<NoteFormValues>,
  ) => {
    mutation.mutate(values);
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteValidationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            id="content"
            name="content"
            as="textarea"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field id="tag" name="tag" as="select" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;
