export default function DemoPixels({ ads }) {
  if (!ads) return null;
  const google = ads.google || '';
  const facebook = ads.facebook || '';
  const instagram = ads.instagram || '';
  if (!google && !facebook && !instagram) return null;
  return (
    <div
      className="sr-only"
      data-demo-google={google}
      data-demo-facebook={facebook}
      data-demo-instagram={instagram}
      aria-hidden="true"
    >
      Demo ad pixels only — no live Google/Facebook/Instagram scripts are loaded.
    </div>
  );
}
