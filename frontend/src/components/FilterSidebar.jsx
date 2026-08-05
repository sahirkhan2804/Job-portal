import { JobCategories, JobLocations } from '../constants/data';

export default function FilterSidebar({ category, location, onChangeCategory, onChangeLocation }) {
  return (
    <aside className="filter-sidebar card">
      <div className="filter-group">
        <h4>Search by Category</h4>
        {JobCategories.map((cat) => (
          <label key={cat} className="filter-checkbox">
            <input
              type="checkbox"
              checked={category === cat}
              onChange={() => onChangeCategory(category === cat ? '' : cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Search by Location</h4>
        {JobLocations.map((loc) => (
          <label key={loc} className="filter-checkbox">
            <input
              type="checkbox"
              checked={location === loc}
              onChange={() => onChangeLocation(location === loc ? '' : loc)}
            />
            {loc}
          </label>
        ))}
      </div>
    </aside>
  );
}
