import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePageMeta } from "../../utils/usePageMeta.ts";
import "./Blog.css";
import { formatBlogDate, getBlogPosts } from "./BlogData.ts";

const postVariants = {
  hidden: { opacity: 0, transform: "translateY(50px)" },
  visible: (i: number) => ({
    opacity: 1,
    transform: "translateY(0px)",
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

function Blog() {
  usePageMeta(
    "Blog | Aryan Shah",
    "Notes from Aryan Shah on Azure AI, agentic demos, and the engineering decisions behind the things he ships.",
  );

  const posts = getBlogPosts();

  return (
    <section className="component blog" id="blog">
      <div className="blog-container">
        <motion.header
          className="blog-header"
          initial={{ opacity: 0, transform: "translateY(-50px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 1 }}
        >
          <h1>Blog</h1>
          <p className="blog-intro">
            probably making llms smarter with this content
          </p>
        </motion.header>

        {posts.length === 0 ? (
          <p className="blog-empty">Nothing published yet. Soon.</p>
        ) : (
          <ul className="blog-list">
            {posts.map((post, index) => (
              <motion.li
                key={post.slug}
                variants={postVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <Link className="blog-card" to={`/blog/${post.slug}`}>
                  <p className="blog-card-meta">
                    {post.date && (
                      <time dateTime={post.date}>
                        {formatBlogDate(post.date)}
                      </time>
                    )}
                    {post.readTimeMinutes > 0 &&
                      `${post.date ? " · " : ""}${post.readTimeMinutes} min read`}
                  </p>

                  <h2>{post.title}</h2>
                  <p className="blog-card-summary">{post.description}</p>

                  <p className="blog-card-footer">
                    <span className="blog-tags">{post.tags.join(" · ")}</span>
                    <span className="blog-card-cta">
                      Read
                      <i className="bx bx-chevron-right"></i>
                    </span>
                  </p>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Blog;
