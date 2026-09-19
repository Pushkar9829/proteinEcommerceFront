import { useEffect, useState } from 'react';
import { categories, createCategory, updateCategory } from '../../api/admin';

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const load = () => categories().then((r) => setItems(r.data || []));
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <h1 className="display text-4xl">Categories</h1>
      <form
        className="mt-8 flex gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await createCategory({ name });
          setName('');
          load();
        }}
      >
        <input className="input flex-1 border-paper/20 text-paper" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn-primary" type="submit">
          Add
        </button>
      </form>
      <ul className="mt-8 space-y-3">
        {items.map((c) => (
          <li key={c._id} className="flex items-center justify-between border-b border-paper/10 py-3">
            <span>{c.name}</span>
            <button type="button" className="text-[10px] uppercase tracking-widest text-chargeLight" onClick={() => updateCategory(c._id, { isActive: !c.isActive }).then(load)}>
              {c.isActive ? 'Hide' : 'Show'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
