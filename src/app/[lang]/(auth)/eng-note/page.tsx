"use client";
import CustomSwitch from "@/app/components/ThemeToggle";
import { ThemeContext } from "@/app/core/client/context/theme/ThemeContext";
import { createWord } from "@/app/feature/english-note/actions";
import { Word } from "@/app/feature/english-note/english-note";
import { ValidateErrors } from "@/app/utils/validate/model";
import {
  ChangeEvent,
  MouseEvent,
  useActionState,
  useContext,
  useEffect,
  useState,
} from "react";

interface Props {
  params: { lang: string };
}

interface InternalState {
  keyword: string;
  debouncedKeyword: string;
  addFormVisible: boolean;
  searchedWord?: Word;
  newWord: Word;
}

const initialState: InternalState = {
  keyword: "",
  debouncedKeyword: "",
  addFormVisible: false,
  newWord: {
    definition: "",
    text: "",
    searchCount: 0,
  },
};

export type EnglishNoteActionState = {
  text?: string;
  definition?: string;
  fieldErrs: ValidateErrors;
};

const initialActionState: EnglishNoteActionState = {
  fieldErrs: {},
};

export default function EngNotePage(props: Props) {
  const { theme, changeTheme } = useContext(ThemeContext);
  const [state, setState] = useState<InternalState>(initialState);
  const [words, setWords] = useState<Word[]>([]);
  const [actionState, formAction, isPending] = useActionState<
    EnglishNoteActionState,
    FormData
  >(createWord, initialActionState);
  const handleShowAddWordClick = (e: MouseEvent) => {
    e.preventDefault();
    setState((prev) => ({
      ...prev,
      addFormVisible: true,
      newWord: { ...prev.newWord, text: state.debouncedKeyword },
    }));
  };

  const handleCancelClick = (e: MouseEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, addFormVisible: false }));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, keyword: e.target.value }));
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
      setWords([...words, state.newWord]);
    }
    clear();
  };

  const clear = () => {
    setState({
      ...state,
      newWord: { definition: "", text: "", searchCount: 0 },
      addFormVisible: false,
      debouncedKeyword: "",
      keyword: "",
    });
  };

  const renderSearchResult = () => {
    const handleItemClick = (e: MouseEvent, word: Word) => {
      e.preventDefault();
      if (state.searchedWord && state.searchedWord.text == word.text) return;
      const idx = words.findIndex((i) => word.text == i.text);
      if (idx >= 0 && words[idx].searchCount) {
        words[idx].searchCount += 1;
        setWords(words);
        setState({ ...state, searchedWord: words[idx] });
      } else {
        alert("Không tìm thấy từ " + word.text);
      }
    };

    const res = words.filter((item) =>
      item.text.startsWith(state.debouncedKeyword)
    );
    if (res.length > 0) {
      return res.map((i) => (
        <li
          className="hover:bg-[var(--bg-layer-2)] cursor-pointer bg-transparent p-2"
          key={i.text}
          onClick={(e) => handleItemClick(e, i)}
        >
          {`${i.text}`}
          <span className="text-sm italic">{`(${i.searchCount})`}</span>
        </li>
      ));
    } else {
      return (
        <li className="text-sm bg-transparent flex flex-row justify-between p-2">
          <i className="cursor-none">0 results</i>
          <span
            className={`underline cursor-pointer italic text-sm ${
              state.debouncedKeyword.length > 0 ? "visible" : "invisible"
            }`}
            onClick={(e) => handleShowAddWordClick(e)}
          >
            Add new word ?
          </span>
        </li>
      );
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setState({ ...state, debouncedKeyword: state.keyword });
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [state.keyword]);

  return (
    <div className="p-4 flex flex-col items-center gap-6">
      <div className="w-[600px] bg-layer-2 shadow rounded-md p-3 flex flex-col gap-4">
        <h1 className="self-center font-semibold text-2xl text-center">
          English Note
        </h1>
        <CustomSwitch
          onToggle={() => {
            changeTheme(theme === "dark-theme" ? "light-theme" : "dark-theme");
          }}
          checked={theme !== "dark-theme"}
        />
        <div className="flex flex-col rounded-md overflow-hidden border-app">
          <input
            type="text"
            name="search"
            className="p-1 field-color-app placeholder:italic"
            placeholder="input text ..."
            value={state.keyword}
            onChange={(e) => handleSearchChange(e)}
          />
          {state.debouncedKeyword.length > 0 && (
            <ul className="flex flex-col gap-2 field-color-app bg-layer-1">
              {renderSearchResult()}
            </ul>
          )}
        </div>
      </div>
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
      {state.searchedWord && (
        <div className="w-[800px] bg-layer-2 shadow rounded-md p-4">
          <h1 className="self-center font-semibold text-2xl text-center">
            {state.searchedWord.text}
          </h1>
          <div>
            <p className="text-sm">{state.searchedWord.definition}</p>
            <br />
            <span className="italic text-sm">
              {`Bạn đã search từ này ${state.searchedWord.searchCount} lần!`}{" "}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
