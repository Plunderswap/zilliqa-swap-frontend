import { expect, it } from "vitest";
import { Spinner } from "../../components/Spinner";
import { renderWithProvider } from "../../testHelpers";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Spinner />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      width: 75px;
      height: 75px;
      border-radius: 50%;
      border: 6px solid var(--colors-inputSecondary);
      border-top-color: var(--colors-primary);
      animation: k0 0.9s linear infinite;
    }

    @keyframes k0 {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    <div
        aria-label="Loading"
        class="c0"
        role="status"
      />
    </DocumentFragment>
  `);
});
