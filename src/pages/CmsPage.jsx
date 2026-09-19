import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPage } from '../api/cms';

export default function CmsPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    setErr('');
    getPage(slug).then((r) => setPage(r.data)).catch((e) => setErr(e.message));
  }, [slug]);

  if (err) return <div className="px-10 py-32 text-center text-sm text-ink/65">{err}</div>;
  if (!page) return <div className="px-10 py-32 text-sm text-ink/65">Opening the page…</div>;

  return (
    <article className="mx-auto max-w-3xl px-6 py-20 md:px-10">
      <p className="eyebrow">{page.type}</p>
      <h1 className="display mt-3 text-5xl">{page.title}</h1>
      <div className="rule my-10" />
      <div className="whitespace-pre-wrap text-base leading-8 text-ink/75">{page.content}</div>
    </article>
  );
}
