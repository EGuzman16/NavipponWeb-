import React from "react";
import { usePagination, DOTS } from "../hooks/usePagination";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Pagination = ({
  onPageChange,
  currentPage,
  siblingCount = 1,
  totalPageCount,
}) => {
  const theme = useTheme();
  const paginationRange = usePagination({
    currentPage,
    siblingCount,
    totalPageCount,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };
  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="flex flex-col items-center px-5 py-5  xs:flex-row xs:justify-between">
      <div className="flex items-center">
        <button
          disabled={currentPage === 1}
          type="button"
          className="w-full p-4 text-base text-gray-600 border rounded-full mr-3 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-90"
          onClick={onPrevious}
        >
          <svg
            width="9"
            fill="currentColor"
            height="8"
            className=""
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
          </svg>
        </button>
        {paginationRange.map((pageNumber) => {
          if (pageNumber === DOTS) {
            return (
              <button className="cursor-default w-full px-4 py-2 text-base bg-white border">
                &#8230;
              </button>
            );
          }

          return (
            <Button
              key={pageNumber}
              type="button"
              variant={pageNumber === currentPage ? "contained" : "outlined"}
              onClick={() => onPageChange(pageNumber)}
              sx={{
                width: "100%",
                px: 2,
                py: "6px",
                fontSize: "1rem",
                borderRadius: "30rem",
                borderColor:
                  pageNumber === currentPage
                    ? theme.palette.secondary.medium
                    : theme.palette.grey[300],
                bgcolor:
                  pageNumber === currentPage
                    ? theme.palette.secondary.medium
                    : "white",
                color:
                  pageNumber === currentPage
                    ? theme.palette.primary.white
                    : theme.palette.grey[600],
                "&:hover": {
                  bgcolor:
                    pageNumber === currentPage
                      ? theme.palette.secondary.main
                      : theme.palette.grey[100],
                },
              }}
            >
              {pageNumber}
            </Button>
          );
        })}

        <button
          disabled={currentPage === lastPage}
          type="button"
          className="w-full p-4 text-base text-gray-600 border rounded-full ml-3 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onNext}
        >
          <svg
            width="9"
            fill="currentColor"
            height="8"
            className=""
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
