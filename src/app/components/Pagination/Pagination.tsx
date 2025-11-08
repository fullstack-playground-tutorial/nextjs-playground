import Arrow from "./single_arrow.svg";
import DoubleArrow from "./double_arrow.svg";
import { useMemo } from "react";
type Props = {
  pageTotal: number;
  currentPage: number;
  truncate?: boolean;
  sideCurrentNumber?: number; // number of page displayed on two side of the current one.
  onPageChanged: (n: number) => void;
};

export default function Pagination({
  pageTotal: total = 10,
  truncate = true,
  sideCurrentNumber = 1,
  currentPage = 5,
  onPageChanged,
}: Props) {
  const handlePageClick = (n: number) => {
    onPageChanged(n);
  };

  const handlePageStartClick = () => {
    onPageChanged(1);
  };

  const handlePagePrevClick = () => {
    onPageChanged(currentPage - 1);
  };

  const handlePageNextClick = () => {
    onPageChanged(currentPage + 1);
  };

  const handlePageEndClick = () => {
    onPageChanged(total);
  };

  const renderPage = (i: number) => {
    return (
      <div
        key={i}
        className={`size-8 flex truncate items-center justify-center outline-0 rounded-full transition cursor-pointer ${
          currentPage == i
            ? "dark:bg-white/10"
            : "dark:bg-transparent dark:hover:bg-white/10 dark:active:bg-white/20"
        }`}
        onClick={() => handlePageClick(i)}
      >
        {i}
      </div>
    );
  };

  const renderNoTruncate = (key: string) => {
    return (
      <button
        key={key}
        className="size-8 flex items-center justify-center outline-0 rounded-full"
      >
        ...
      </button>
    );
  };
  const renderPages = useMemo(() => {
    const pageList = [];
    // leftRange and rightRange will show truncate if both of them having value grester than 3, example: @currentPage=5, @total>10 => 3: 1...4,5,6...10)
    const numberTruncateLeft = currentPage - sideCurrentNumber;
    const numberTruncateRight = currentPage + sideCurrentNumber;
    const range = sideCurrentNumber + 4; // minimum page number on oneside need to have truncate: start(end) page + 2 space beween start(end) to pages side (truncate) + current page + side current page

    if (total < range * 2 - 1 || truncate == false) {
      for (let i = 1; i <= total; i++) {
        pageList.push(renderPage(i));
      }
    } else if (numberTruncateLeft <= 3 && numberTruncateRight + 3 <= total) {
      // no truncate left
      for (let i = 1; i < currentPage; i++) {
        pageList.push(renderPage(i));
      }

      for (let i = currentPage; i <= numberTruncateRight; i++) {
        if (i <= numberTruncateRight) {
          pageList.push(renderPage(i));
        }
      }
      pageList.push(renderNoTruncate("truncate-1"));
      pageList.push(renderPage(total));
    } else if (numberTruncateRight + 3 > total && numberTruncateLeft > 3) {
      // no truncate right
      pageList.push(renderPage(1));
      pageList.push(renderNoTruncate("truncate-1"));
      for (let index = numberTruncateLeft; index <= total; index++) {
        pageList.push(renderPage(index));
      }
    } else if (numberTruncateRight + 3 <= total && numberTruncateLeft > 3) {
      // truncate 2 sides

      pageList.push(renderPage(1));
      pageList.push(renderNoTruncate("truncate-1"));
      for (
        let index = numberTruncateLeft;
        index <= numberTruncateRight;
        index++
      ) {
        pageList.push(renderPage(index));
      }
      pageList.push(renderNoTruncate("truncate-2"));
      pageList.push(renderPage(total));
    }

    return (
      <>
        {pageList.map((el) => {
          return el;
        })}
      </>
    );
  }, [currentPage, total]);

  return (
    <div className="p-2 flex flex-row justify-center items-center dark:bg-surface-0 min-w-128 gap-4 rounded-md font-semibold text-sm dark:text-accent-0">
      {currentPage > 1 && (
        <button
          className="transition size-8 flex items-center justify-center outline-0 bg-transparent rounded-full dark:hover:bg-white/10 dark:active:bg-white/20"
          onClick={handlePageStartClick}
        >
          <DoubleArrow className="mr-1 rotate-180 size-5" />
        </button>
      )}
      {currentPage > 1 && (
        <button
          className="transition size-8 flex items-center justify-center outline-0 bg-transparent rounded-full dark:hover:bg-white/10 dark:active:bg-white/20 cursor-pointer"
          onClick={handlePagePrevClick}
        >
          <Arrow className="size-5 rotate-180" />
        </button>
      )}

      {renderPages}
      {currentPage < total && (
        <button
          className="size-8 flex items-center justify-center outline-0 rounded-full bg-transparent transition dark:hover:bg-white/10 dark:active:bg-white/20"
          onClick={handlePageNextClick}
        >
          <Arrow className="size-5" />
        </button>
      )}
      {currentPage < total && (
        <button
          className={`size-8 flex items-center justify-center outline-0 rounded-full bg-transparent transition dark:hover:bg-white/10 dark:active:bg-white/20`}
          onClick={handlePageEndClick}
        >
          <DoubleArrow className="ml-1 size-5" />
        </button>
      )}
    </div>
  );
}