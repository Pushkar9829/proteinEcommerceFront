import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="px-6 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-4 text-5xl">Page not found</h1>
      <Link to="/" className="btn-primary mt-10 inline-flex">
        Return home
      </Link>
    </div>
  );
}
