import { expect, it } from "vitest";
import { Card, CardBody, CardFooter } from "../../components/Card";
import { renderWithProvider } from "../../testHelpers";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(
    <Card>
      <CardBody>Body</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>,
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      background: var(--colors-cardBorder);
      border-radius: var(--radii-card);
      color: var(--colors-text);
      overflow: hidden;
      position: relative;
      padding: 1px 1px 3px 1px;
    }

    .c1 {
      width: 100%;
      height: 100%;
      overflow: inherit;
      background: var(--colors-backgroundAlt);
      border-radius: var(--radii-card);
    }

    .c2 {
      padding: 16px;
    }

    .c3 {
      border-top: 1px solid var(--colors-cardBorder);
      padding: 24px;
    }

    @media screen and (min-width: 576px) {
      .c2 {
        padding: 24px;
      }
    }

    <div
        class="c0"
      >
        <div
          class="c1"
        >
          <div
            class="c2"
          >
            Body
          </div>
          <div
            class="c3"
          >
            Footer
          </div>
        </div>
      </div>
    </DocumentFragment>
  `);
});
