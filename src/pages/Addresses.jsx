import { useEffect, useState } from 'react';
import { addAddress, deleteAddress, listAddresses } from '../api/user';
import AccountNav from '../components/AccountNav.jsx';

const empty = { name: '', phone: '', line1: '', city: '', state: '', pincode: '', isDefault: false };

export default function Addresses() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const load = () => listAddresses().then((r) => setList(r.data || []));
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-store px-6 py-16 md:px-10">
      <AccountNav />
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          {list.map((a) => (
            <div key={a._id} className="border border-ink/10 p-5">
              <p className="font-medium">{a.name}</p>
              <p className="text-sm text-ink/65">
                {a.line1}, {a.city}, {a.state} {a.pincode}
              </p>
              <button type="button" className="mt-3 text-[10px] uppercase tracking-widest" onClick={() => deleteAddress(a._id).then(load)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await addAddress(form);
            setForm(empty);
            load();
          }}
        >
          <p className="eyebrow">New address</p>
          {Object.keys(empty)
            .filter((k) => k !== 'isDefault')
            .map((k) => (
              <input
                key={k}
                required
                className="input"
                placeholder={k}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            ))}
          <button className="btn-primary" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
