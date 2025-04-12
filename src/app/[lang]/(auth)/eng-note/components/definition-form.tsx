import { createWord } from "@/app/feature/english-note/actions";
import { Vocabulary } from "@/app/feature/english-note/english-note";
import { ValidateErrors } from "@/app/utils/validate/model";
import {
  ChangeEvent,
  MouseEvent,
  useActionState,
  useEffect,
  useState,
} from "react";

export type EnglishNoteActionState = {
  definition?: string;
  fieldErrs?: ValidateErrors;
};

const initialActionState: EnglishNoteActionState = {
};

type Props = {
  handleAddWord: () => void;
  keyword: string;
  addFormVisible: boolean;
  handleClose: () => void;
};

type InternalState = {
  newWord: Vocabulary;
};

const initialState: InternalState = {
  newWord: {
    definition: "",
    word: "",
    searchCount: 0,
  },
};

function DefinitionForm({
  handleAddWord,
  keyword,
  addFormVisible,
  handleClose,
}: Props) {
  const [state, setState] = useState<InternalState>(initialState);

  const createWordAction = async (
    prevState: EnglishNoteActionState,
    formData: FormData
  ) => {
    try {
      const res = await createWord(prevState, formData);
      setState({
        ...state,
        newWord: { definition: "", word: "", searchCount: 0 },
      });

      if (!res.fieldErrs) {
        
        handleAddWord();
        handleClose();
      }

      return res;
    } catch (error) {
      throw error;
    }
  };

  const [actionState, formAction, pending] = useActionState<
    EnglishNoteActionState,
    FormData
  >(createWordAction, initialActionState);

  const handleCancelClick = (e: MouseEvent) => {
    e.preventDefault();
    handleClose();
  };

  const handleOnWordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      newWord: { ...prev.newWord, word: e.target.value },
    }));
  };

  const handleOnDefinitionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setState((prev) => ({
      ...prev,
      newWord: { ...prev.newWord, definition: e.target.value },
    }));
  };

  useEffect(() => {
    setState({ ...state, newWord: { ...state.newWord, word: keyword } });
  }, [keyword]);

  return (
    <form
      action={formAction}
      className={`flex flex-col gap-2 w-[600px] bg-layer-2 shadow rounded-md p-4 ${
        addFormVisible ? "" : "hidden"
      }`}
    >
      <h1 className="self-center font-semibold text-2xl text-center">
        Define New Word
      </h1>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center w-0.5 text-sm">
          <label htmlFor="text" className="font-semibold">
            Word:
          </label>
          <input
            type="text"
            name="word"
            className="field-color-app border-app flex-auto rounded-md p-1"
            placeholder="Word"
            value={state.newWord.word}
            onChange={(e) => handleOnWordChange(e)}
          />
        </div>
        { actionState.fieldErrs && actionState.fieldErrs["text"] && (
          <span className={`text-red-500 text-sm h-5 px-2`}>
            {actionState.fieldErrs["word"]}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="definition" className="font-semibold">
          Definition:
        </label>
        <textarea
          name="definition"
          className="field-color-app border-app rounded-md p-2 resize-none h-[200px]"
          value={state.newWord.definition}
          placeholder="Define something here ..."
          onChange={(e) => handleOnDefinitionChange(e)}
        />
        {actionState.fieldErrs && actionState.fieldErrs["definition"] && (
          <span className={`text-red-500 text-sm h-5 px-2`}>
            {actionState.fieldErrs["definition"]}
          </span>
        )}
      </div>
      <div className="flex flex-row justify-end gap-2">
        <button
          className="btn btn-sm btn-primary flex-1/2"
          type="submit"
          disabled={pending}
        >
          Add
        </button>
        <button
          className="btn btn-sm btn-outline-primary flex-1/2"
          onClick={(e) => handleCancelClick(e)}
          disabled={pending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default DefinitionForm;
