const COMPANIES = 
['Microsoft', 'Walmart', 'Accenture', 'Samsung', 'Amazon', 'Adobe'];

export default function TrustedBy() {
  return (
    <div className="trusted-by card">
      <span className="trusted-label">Trusted by :-</span>
      <div className="trusted-logos">
        {COMPANIES.map((name) => (
          <span key={name} className={`truste d-logo logo-${name.toLowerCase()}`}>{name}</span>
        ))}
      </div>
    </div>
  );
}
