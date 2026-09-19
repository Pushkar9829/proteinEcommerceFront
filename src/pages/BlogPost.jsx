import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPage } from '../api/cms';

export default function BlogPost() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  useEffect(() => {
    getPage(slug).then((r) => setPage(r.data)).catch(() => setPage(null));
  }, [slug]);
  if (!page) return <div className="px-10 py-32">…</div>;
  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <p className="eyebrow">Essay</p>
      <h1 className="display mt-3 text-5xl">{page.title}</h1>
      <div className="mt-10 whitespace-pre-wrap leading-8 text-ink/75">{page.content}</div>
    </article>
  );
}
