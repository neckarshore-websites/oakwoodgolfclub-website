export type SearchDoc = {
  id: string;                 // `blog:<slug>` | `faq:<slug>`
  type: "blog" | "faq";
  title: string;              // post title | FAQ question
  text: string;               // excerpt+body (blog) | answer (faq), plaintext
  category: string;           // post category | FAQ category label
  url: string;                // /blog/<slug> | /faq#<slug>
};
