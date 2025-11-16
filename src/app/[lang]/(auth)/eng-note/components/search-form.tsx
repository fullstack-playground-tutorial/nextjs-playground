"use client";
import CustomSwitch from "@/app/components/ThemeToggle";
import { Vocabulary } from "@/app/feature/english-note/english-note";
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import DefinitionForm from "./definition-form";
import WordDetail from "./word-detail";
import { search } from "@/app/feature/english-note/actions";

type InternalState = {
  searchedWord?: Vocabulary;
  keyword: string;
  debouncedKeyword: string;
  vocals: Vocabulary[];
  addFormVisible: boolean;
};

export const SearchFrom = () => {

  const [state, setState] = useState<InternalState>({
    keyword: "",
    debouncedKeyword: "",
    vocals: [],
    addFormVisible: false,
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

  const handleItemClick = (e: MouseEvent, word: Vocabulary) => {
    e.preventDefault();
    if (state.searchedWord && state.searchedWord.word == word.word) return;
    const idx = state.vocals.findIndex((i) => word.word == i.word);
    if (idx >= 0 && state.vocals[idx].searchCount) {
      state.vocals[idx].searchCount += 1;
      setState({
        ...state,
        searchedWord: state.vocals[idx],
        vocals: state.vocals,
      });
    } else {
      alert("Cannot found this word:  " + word.word);
    }
  };

  const handleAddWord = () => {
    setState({ ...state, debouncedKeyword: "", keyword: "" });
  };

  const handleClose = () => {
    setState({ ...state, addFormVisible: false });
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
        return search(state.debouncedKeyword)
          .then((words) => {
            setState({ ...state, vocals: words });
          })
          .catch((e) => {
            throw e;
          });
      } else {
        // Note: case reuse caching data will handle after ...
        return search(state.debouncedKeyword)
          .then((words) => {
            setState({ ...state, vocals: words });
          })
          .catch((e) => {
            throw e;
          });
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

        <div className="flex-col flex gap-2">
          
          <div className="flex flex-col rounded-md overflow-hidden border-app">
            <input
              type="text"
              name="search"
              className="p-1 field-color-app placeholder:italic"
              placeholder="input text ..."
              value={state.keyword}
              onChange={(e) => handleSearchChange(e)}
              disabled={state.addFormVisible}
            />
            {state.debouncedKeyword.length > 0 && (
              <ul className="flex flex-col gap-2 field-color-app bg-layer-1">
                {state.vocals.length > 0 ? (
                  state.vocals.map((i) => (
                    <li
                      className="hover:bg-[var(--bg-layer-2)] cursor-pointer bg-transparent p-2"
                      key={i.word}
                      onClick={(e) => handleItemClick(e, i)}
                    >
                      {`${i.word}`}
                      <span className="text-sm italic">{`(${i.searchCount})`}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm bg-transparent flex flex-row justify-between p-2">
                    <i className="cursor-none">0 results</i>
                    <span
                      className={`underline cursor-pointer italic text-sm ${
                        state.debouncedKeyword.length > 0
                          ? "visible"
                          : "invisible"
                      }`}
                      onClick={(e) => handleShowDefinitionWord(e)}
                    >
                      Add new word ?
                    </span>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
      <DefinitionForm
        handleAddWord={handleAddWord}
        keyword={state.debouncedKeyword}
        addFormVisible={state.addFormVisible}
        handleClose={handleClose}
      />
      <WordDetail searchedWord={state.searchedWord} />
    </>
  );
};
