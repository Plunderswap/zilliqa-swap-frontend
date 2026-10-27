type CSSObject = Record<string, any>;

export const base: CSSObject = {
  margin: 0,
  padding: 0,
  border: 0,
  minWidth: 0,
  boxSizing: "border-box",
  fontSize: "100%",
  font: "inherit",
  verticalAlign: "baseline",
};

export const button: CSSObject = {
  background: 0,
  border: 0,
  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
};

const block: CSSObject = { display: "block" };
const list: CSSObject = { listStyle: "none" };
const quote: CSSObject = { quotes: "none", "&:before, &:after": { content: "''" } };
const select: CSSObject = { appearance: "none", "&::-ms-expand": { display: "none" } };

export const element: Record<string, CSSObject> = {
  article: block,
  aside: block,
  button,
  details: block,
  figcaption: block,
  figure: block,
  footer: block,
  header: block,
  hgroup: block,
  menu: block,
  nav: block,
  section: block,
  textarea: block,
  ul: list,
  ol: list,
  blockquote: quote,
  q: quote,
  body: { lineHeight: 1 },
  table: { borderCollapse: "collapse", borderSpacing: 0 },
  mark: { backgroundColor: "transparent", color: "inherit" },
  select,
};
