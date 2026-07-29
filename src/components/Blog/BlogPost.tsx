import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import "./Blog.css";
import BlogContent from "./BlogContent.tsx";
import {
  blogReadingMinutes,
  formatBlogDate,
  getAdjacentPosts,
  getBlogPost,
} from "./BlogData.ts";
import { usePageMeta } from "../../utils/usePageMeta.ts";

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPost(slug);

  usePageMeta(
    post ? `${post.title} | Aryan Shah` : "Post not found | Aryan Shah",
    post?.summary,
  );

  if (!post) {
    return (
      <section className="component blog-post">
        <div className="blog-post-container blog-missing">
          <h1>Post not found</h1>
          <p>
            There is no post at{" "}
            <code className="inline-code">/blog/{slug}</code>. It may have been
            renamed.
          </p>
          <Link className="blog-back" to="/blog">
            <i className="bx bx-chevron-left"></i>
            All posts
          </Link>
        </div>
      </section>
    );
  }

  const { newer, older } = getAdjacentPosts(post.slug);

  return (
    <article className="component blog-post">
      <motion.div
        className="blog-post-container"
        initial={{ opacity: 0, transform: "translateY(50px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Link className="blog-back" to="/blog">
          <i className="bx bx-chevron-left"></i>
          All posts
        </Link>

        <header className="blog-post-header">
          <h1>{post.title}</h1>
          <p className="blog-post-meta">
            <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
            {` · ${blogReadingMinutes(post)} min read`}
            {post.tags.length > 0 && ` · ${post.tags.join(" · ")}`}
          </p>
        </header>

        <BlogContent blocks={post.content} />

        {(older || newer) && (
          <nav className="blog-post-nav" aria-label="More posts">
            {older && (
              <Link className="blog-post-nav-link" to={`/blog/${older.slug}`}>
                <span className="blog-post-nav-label">
                  <i className="bx bx-chevron-left"></i>
                  Older
                </span>
                <span className="blog-post-nav-title">{older.title}</span>
              </Link>
            )}

            {newer && (
              <Link
                className="blog-post-nav-link blog-post-nav-link-newer"
                to={`/blog/${newer.slug}`}
              >
                <span className="blog-post-nav-label">
                  Newer
                  <i className="bx bx-chevron-right"></i>
                </span>
                <span className="blog-post-nav-title">{newer.title}</span>
              </Link>
            )}
          </nav>
        )}
      </motion.div>
    </article>
  );
}

export default BlogPost;
