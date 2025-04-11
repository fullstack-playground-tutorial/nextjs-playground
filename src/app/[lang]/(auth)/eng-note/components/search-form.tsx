"use client";
import CustomSwitch from "@/app/components/ThemeToggle";
import { ThemeContext } from "@/app/core/client/context/theme/ThemeContext";
import { Word } from "@/app/feature/english-note/english-note";
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import DefinitionForm from "./definition-form";
import WordDetail from "./word-detail";
import appContext from "@/app/core/server/context";
import { search } from "@/app/feature/english-note/actions";

type InternalState = {
  searchedWord?: Word;
  keyword: string;
  debouncedKeyword: string;
  words: Word[];
};

export const SearchFrom = () => {
  const { theme, changeTheme } = useContext(ThemeContext);

  const [state, setState] = useState<InternalState>({
    keyword: "",
    debouncedKeyword: "",
    words: [],
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, keyword: e.target.value }));
  };

  const handleShowDefinitionWord = (e: MouseEvent) => {
    e.preventDefault();
    setState((prev) => ({
      ...prev,
      addFormVisible: true,
    }));
  };

  const renderSearchResult = () => {
    const handleItemClick = (e: MouseEvent, word: Word) => {
      e.preventDefault();
      if (state.searchedWord && state.searchedWord.text == word.text) return;
      const idx = state.words.findIndex((i) => word.text == i.text);
      if (idx >= 0 && state.words[idx].searchCount) {
        state.words[idx].searchCount += 1;
        setState({
          ...state,
          searchedWord: state.words[idx],
          words: state.words,
        });
      } else {
        alert("Không tìm thấy từ " + word.text);
      }
    };

    if (state.words.length > 0) {
      return state.words.map((i) => (
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
            onClick={(e) => handleShowDefinitionWord(e)}
          >
            Add new word ?
          </span>
        </li>
      );
    }
  };

  const handleAddWord = () => {
    setState({ ...state, debouncedKeyword: "", keyword: "" });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setState({ ...state, debouncedKeyword: state.keyword });
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [state.keyword]);

  useEffect(() => {
    const searchWords = async () => {
      if (
        state.debouncedKeyword.length <= 2 &&
        state.debouncedKeyword.length > 0
      ) {
        return search(state.debouncedKeyword).then((words) => {
          setState({ ...state, words: words });
        });
      } else {

      }
    };
    searchWords();
  }, [state.debouncedKeyword]);
  return (
    <>
      <div className="w-[600px] bg-layer-2 shadow rounded-md p-3 flex flex-col gap-4">
        <h1 className="self-center font-semibold text-2xl text-center">
          English Note
        </h1>

        <div>
          <CustomSwitch
            onToggle={() => {
              changeTheme(
                theme === "dark-theme" ? "light-theme" : "dark-theme"
              );
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
      </div>
      <DefinitionForm
        handleAddWord={handleAddWord}
        keyword={state.debouncedKeyword}
      />
      <WordDetail searchedWord={state.searchedWord} />
    </>
  );
};
