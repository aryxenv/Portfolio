import { richText } from "../../utils/highlight.tsx";
import type { BlogBlock } from "./BlogData.ts";

/**
 * Renders the typed content blocks of a post. Every block type here has a
 * matching style in Blog.css — adding a type means designing it once.
 */
function BlogContent({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="blog-post-body">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return <h2 key={index}>{block.text}</h2>;

          case "list":
            return block.ordered ? (
              <ol key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{richText(item)}</li>
                ))}
              </ol>
            ) : (
              <ul key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{richText(item)}</li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <blockquote key={index}>
                <p>{richText(block.text)}</p>
              </blockquote>
            );

          case "code":
            return (
              <figure key={index} className="blog-code">
                {block.label && (
                  <figcaption className="blog-code-label">
                    {block.label}
                  </figcaption>
                )}
                <pre>
                  <code>{block.code}</code>
                </pre>
              </figure>
            );

          default:
            return <p key={index}>{richText(block.text)}</p>;
        }
      })}
    </div>
  );
}

export default BlogContent;
