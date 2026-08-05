import { companyColor, companyInitials } from '../constants/data';

export default function CompanyAvatar({ name, size = 44 }) {
  return (
    <div
      className="company-avatar"
      style={{
        width: size,
        height: size,
        background: companyColor(name),
        fontSize: size * 0.38,
      }}
    >
      {companyInitials(name)}
    </div>
  );
}
