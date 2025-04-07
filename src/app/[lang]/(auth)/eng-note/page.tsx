"use client";
import CustomSwitch from "@/app/components/ThemeToggle";
import { ThemeContext } from "@/app/core/client/context/theme/ThemeContext";
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";

interface Props {
  params: { lang: string };
}

type Word = {
  text: string;
  definition: string;
  searchCount: number;
};
export default function EngNotePage(props: Props) {
  const { theme, changeTheme } = useContext(ThemeContext);
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [word, setWord] = useState<Word>({
    definition: "",
    text: "",
    searchCount: 0,
  });
  const [words, setWords] = useState<Word[]>([]);
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [searchedWord, setSearchedWord] = useState<Word>();
  const handleShowAddWordClick = (e: MouseEvent) => {
    e.preventDefault();
    setWord((prev) => ({ ...prev, text: debouncedKeyword }));
    setAddFormVisible(true);
  };

  const handleCancelClick = (e: MouseEvent) => {
    e.preventDefault();
    setAddFormVisible(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setKeyword(e.target.value);
  };

  const handleOnWordChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setWord((prev) => ({ ...prev, text: e.target.value.trim() }));
  };

  const handleOnDefinitionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setWord((prev) => ({ ...prev, definition: e.target.value.trim() }));
  };

  const handleAddClick = (e: MouseEvent) => {
    e.preventDefault();
    if (word.text.length > 0 && word.definition.length > 0) {
      setWords([...words, word]);
    }
    clear();
  };

  const clear = () => {
    setWord({ definition: "", text: "", searchCount: 0 });
    setAddFormVisible(false);
    setDebouncedKeyword("");
    setKeyword("");
  };

  const renderSearchResult = () => {
    const handleItemClick = (e: MouseEvent, word: Word) => {
      e.preventDefault();
      if (searchedWord && searchedWord.text == word.text) return;
      const idx = words.findIndex((i) => word.text == i.text);
      if (idx >= 0) {
        words[idx].searchCount += 1;
        setWords(words);
        setSearchedWord(words[idx]);
      } else {
        alert("Không tìm thấy từ " + word.text);
      }
    };

    const res = words.filter((item) => item.text.startsWith(debouncedKeyword));
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
              debouncedKeyword.length > 0 ? "visible" : "invisible"
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
      setDebouncedKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

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
            value={keyword}
            onChange={(e) => handleSearchChange(e)}
          />
          {debouncedKeyword.length > 0 && (
            <ul className="flex flex-col gap-2 field-color-app bg-layer-1">
              {renderSearchResult()}
            </ul>
          )}
        </div>
      </div>
      <div
        className={`flex flex-col gap-2 w-[600px] bg-layer-2 shadow rounded-md p-4 ${
          addFormVisible ? "" : "hidden"
        }`}
      >
        <h1 className="self-center font-semibold text-2xl text-center">
          Define New Word
        </h1>
        <div className="flex flex-row gap-2 items-center w-0.5 text-sm">
          <label htmlFor="word" className="font-semibold">
            Word:
          </label>
          <input
            type="text"
            name="word"
            className="field-color-app border-app flex-auto rounded-md p-1"
            placeholder="Word"
            value={word.text}
            onChange={(e) => handleOnWordChange(e)}
          />
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <label htmlFor="definition" className="font-semibold">
            Definition:
          </label>
          <textarea
            name="definition"
            className="field-color-app border-app rounded-md p-2 resize-none h-[200px]"
            value={word.definition}
            placeholder="Define something here ..."
            onChange={(e) => handleOnDefinitionChange(e)}
          />
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
        </div>
      </div>
      {searchedWord && (
        <div className="w-[800px] bg-layer-2 shadow rounded-md p-4">
          <h1 className="self-center font-semibold text-2xl text-center">
            {searchedWord.text}
          </h1>
          <div>
            <p className="text-sm">{searchedWord.definition}</p>
            <br />
            <span className="italic text-sm">
              {`Bạn đã search từ này ${searchedWord.searchCount} lần!`}{" "}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
