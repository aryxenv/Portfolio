import { Link } from "react-router-dom";
import "./NotFound.css";
import { usePageMeta } from "../../utils/usePageMeta.ts";

function NotFound() {
  usePageMeta("Page not found | Aryan Shah");

  return (
    <section className="component not-found">
      <div className="not-found-container">
        <h1>404</h1>
        <p>That page does not exist here.</p>
        <div className="not-found-links">
          <Link to="/">Portfolio</Link>
          <Link to="/blog">Blog</Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
