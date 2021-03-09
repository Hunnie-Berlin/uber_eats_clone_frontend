import React from "react";
import { render } from "@testing-library/react";
import Pagination from "../pagination";

describe("<Pagination />", () => {
  it("renders OK with props", () => {
    const { getByText } = render(
      <Pagination
        page={1}
        totalPages={3}
        onPreviousPageClick={() => jest.fn()}
        onNextPageClick={() => jest.fn()}
      />
    );
    getByText("Page 1 of 3");
  });
});
