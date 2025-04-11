import { createWord } from "@/app/feature/english-note/actions";
import { Word } from "@/app/feature/english-note/english-note";
import { ValidateErrors } from "@/app/utils/validate/model";
import {
  ChangeEvent,
  MouseEvent,
  useActionState,
  useEffect,
  useState,
} from "react";

export type EnglishNoteActionState = {
  text?: string;
  definition?: string;
  fieldErrs: ValidateErrors;
};

const initialActionState: EnglishNoteActionState = {
  fieldErrs: {},
};

type Props = {
  handleAddWord: () => void;
  keyword: string;
};

type InternalState = {
  addFormVisible: boolean;
  newWord: Word;
};

const initialState: InternalState = {
  addFormVisible: false,
  newWord: {
    definition: "",
    text: "",
    searchCount: 0,
  },
};

function DefinitionForm({ handleAddWord, keyword }: Props) {
  const [state, setState] = useState<InternalState>(initialState);

  const clear = () => {
    setState({
      ...state,
      newWord: { definition: "", text: "", searchCount: 0 },
      addFormVisible: false,
    });
  };

  const handleCancelClick = (e: MouseEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, addFormVisible: false }));
  };

  const handleOnWordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      newWord: { ...prev.newWord, text: e.target.value.trim() },
    }));
  };

  const handleOnDefinitionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setState((prev) => ({
      ...prev,
      newWord: { ...prev.newWord, definition: e.target.value.trim() },
    }));
  };

  const handleAddClick = (e: MouseEvent) => {
    e.preventDefault();
    if (state.newWord.text.length > 0 && state.newWord.definition.length > 0) {
    //   setWords([...words, state.newWord]);
    }
    clear();
    handleAddWord();
  };

  useEffect(() => {
    setState({ ...state, newWord: { ...state.newWord, text: keyword } });
  }, [keyword]);
  const [actionState, formAction] = useActionState<
    EnglishNoteActionState,
    FormData
  >(createWord, initialActionState);
  return (
    <form
      action={formAction}
      className={`flex flex-col gap-2 w-[600px] bg-layer-2 shadow rounded-md p-4 ${
        state.addFormVisible ? "" : "hidden"
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
            name="text"
            className="field-color-app border-app flex-auto rounded-md p-1"
            placeholder="Word"
            value={state.newWord.text}
            onChange={(e) => handleOnWordChange(e)}
          />
        </div>
        {actionState.fieldErrs["text"] && (
          <span className={`text-red-500 text-sm h-5 px-2`}>
            {actionState.fieldErrs["text"]}
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
        {actionState.fieldErrs["definition"] && (
          <span className={`text-red-500 text-sm h-5 px-2`}>
            {actionState.fieldErrs["definition"]}
          </span>
        )}
      </div>
      <div className="flex flex-row justify-end gap-2">
        <button
          className="btn btn-sm btn-primary flex-1/2"
          onClick={(e) => handleAddClick(e)}
        >
          Add
        </button>
        <button
          className="btn btn-sm btn-outline-primary flex-1/2"
          onClick={(e) => handleCancelClick(e)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default DefinitionForm;
