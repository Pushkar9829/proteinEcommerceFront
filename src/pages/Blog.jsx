import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listBlog } from '../api/cms';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    listBlog().then((r) => setPosts(r.data || []));
  }, []);

  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <p className="eyebrow">Journal</p>
      <h1 className="display mt-3 text-5xl">Training and nutrition guides</h1>
      <div className="mt-16 space-y-12">
        {posts.map((p) => (
          <Link key={p._id} to={`/blog/${p.slug}`} className="block border-b border-ink/10 pb-10">
            <h2 className="font-display text-3xl">{p.title}</h2>
            <p className="mt-3 max-w-xl text-sm text-ink/65">{p.excerpt || p.seoDescription}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
