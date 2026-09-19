import { useEffect, useState } from 'react';
import { blocks, cmsPages, createPage, media, menus, saveBlock, saveMenu, updatePage, uploadMedia } from '../../api/admin';

export default function AdminCms() {
  const [pages, setPages] = useState([]);
  const [cmsBlocks, setCmsBlocks] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [files, setFiles] = useState([]);
  const [pageForm, setPageForm] = useState({ title: '', content: '', type: 'page', status: 'published' });
  const [menuKey, setMenuKey] = useState('header');
  const [menuJson, setMenuJson] = useState('[]');
  const load = () => {
    cmsPages().then((r) => setPages(r.data || []));
    blocks().then((r) => setCmsBlocks(r.data || []));
    menus().then((r) => {
      const list = r.data || [];
      setMenuList(list);
      const current = list.find((m) => m.key === menuKey) || list[0];
      if (current) {
        setMenuKey(current.key);
        setMenuJson(JSON.stringify(current.items || [], null, 2));
      }
    });
    media().then((r) => setFiles(r.data || [])).catch(() => {});
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">CMS</h1>
      <form
        className="mt-8 space-y-3 border border-paper/10 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          await createPage(pageForm);
          load();
        }}
      >
        <input className="input border-paper/20 text-paper" placeholder="Title" value={pageForm.title} onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })} />
        <textarea className="input min-h-[80px] border-paper/20 text-paper" placeholder="Content" value={pageForm.content} onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })} />
        <select className="input" value={pageForm.type} onChange={(e) => setPageForm({ ...pageForm, type: e.target.value })}>
          {['page', 'blog', 'faq', 'campaign'].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button className="btn-primary" type="submit">
          Add page
        </button>
      </form>
      <h2 className="mt-12 text-[11px] uppercase tracking-widest text-chargeLight">Pages</h2>
      <ul className="mt-4 space-y-2">
        {pages.map((p) => (
          <li key={p._id} className="flex justify-between border-b border-paper/10 py-2">
            <span>
              {p.title} · {p.status}
            </span>
            <button type="button" onClick={() => updatePage(p._id, { status: p.status === 'published' ? 'draft' : 'published' }).then(load)}>
              Toggle
            </button>
          </li>
        ))}
      </ul>
      <h2 className="mt-12 text-[11px] uppercase tracking-widest text-chargeLight">Menus</h2>
      <div className="mt-4 flex gap-2">
        {['header', 'footer', 'mobile'].map((k) => (
          <button
            key={k}
            type="button"
            className={`chip ${menuKey === k ? 'chip-on' : ''}`}
            onClick={() => {
              setMenuKey(k);
              const found = menuList.find((m) => m.key === k);
              setMenuJson(JSON.stringify(found?.items || [], null, 2));
            }}
          >
            {k}
          </button>
        ))}
      </div>
      <textarea className="input mt-4 min-h-[140px]" value={menuJson} onChange={(e) => setMenuJson(e.target.value)} />
      <button
        type="button"
        className="btn-primary mt-3"
        onClick={async () => {
          await saveMenu(menuKey, { items: JSON.parse(menuJson), status: 'published' });
          load();
        }}
      >
        Save menu
      </button>
      <h2 className="mt-12 text-[11px] uppercase tracking-widest text-chargeLight">Media</h2>
      <input
        type="file"
        className="mt-3 block"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          await uploadMedia(file, file.name);
          load();
        }}
      />
      <ul className="mt-4 grid gap-3 md:grid-cols-4">
        {files.map((f) => (
          <li key={f._id} className="border border-paper/10 p-2 text-xs">
            <p>{f.originalName || f.alt}</p>
            <p className="mt-1 break-all text-paper/40">{f.url}</p>
          </li>
        ))}
      </ul>
      <h2 className="mt-12 text-[11px] uppercase tracking-widest text-chargeLight">Home blocks</h2>
      <ul className="mt-4 space-y-3">
        {cmsBlocks.map((b) => (
          <li key={b._id} className="border border-paper/10 p-4">
            <p className="text-xs uppercase tracking-widest text-chargeLight">
              {b.type} · {b.key}
            </p>
            <p className="mt-1">{b.title}</p>
            <button
              type="button"
              className="mt-2 text-[10px] uppercase tracking-widest"
              onClick={() =>
                saveBlock({
                  type: b.type,
                  key: b.key,
                  title: b.title,
                  body: b.body,
                  image: b.image,
                  ctaLabel: b.ctaLabel,
                  ctaUrl: b.ctaUrl,
                  config: b.config,
                  sort: b.sort,
                  status: b.status,
                  isActive: !b.isActive,
                }).then(load)
              }
            >
              {b.isActive ? 'Hide' : 'Show'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
