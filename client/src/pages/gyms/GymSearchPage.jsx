import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react';
import api from '../../api/axios';
import GymCard from '../../components/gyms/GymCard';
import GymCardSkeleton from '../../components/gyms/GymCardSkeleton';

const FACILITIES = ['Free Weights', 'Cardio Zone', 'Pool', 'Sauna', 'Spin Studio', 'Yoga Studio', 'CrossFit Rig', 'Olympic Lifting', 'Pilates', 'Boxing'];
const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
const RATINGS = [4, 4.5, 4.8];

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function GymSearchPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ state: '', minRating: '', facilities: [] });
  const [gyms, setGyms] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedQuery = useDebounce(query);

  const fetchGyms = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (debouncedQuery) params.append('q', debouncedQuery);
      if (filters.state) params.append('state', filters.state);
      if (filters.minRating) params.append('minRating', filters.minRating);
      filters.facilities.forEach((f) => params.append('facilities', f));

      const { data } = await api.get(`/gyms?${params}`);
      setGyms(data.data.gyms);
      setPagination(data.data.pagination);
    } catch {
      setGyms([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filters]);

  useEffect(() => { fetchGyms(1); }, [fetchGyms]);

  const toggleFacility = (f) => {
    setFilters((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter((x) => x !== f)
        : [...prev.facilities, f],
    }));
  };

  const clearFilters = () => setFilters({ state: '', minRating: '', facilities: [] });
  const activeFilterCount = [filters.state, filters.minRating, ...filters.facilities].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find a Gym</h1>
        <p className="text-[rgb(var(--color-muted))]">Search across 500+ partner gyms in Australia</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-muted))]" />
          <input
            id="gym-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gyms by name, suburb, or city..."
            className="input pl-10"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          id="gym-filter-toggle"
          onClick={() => setShowFilters((v) => !v)}
          className={`btn-secondary relative ${showFilters ? 'ring-2 ring-violet-500' : ''}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-violet-600 text-white text-[10px] rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="label">State</label>
            <select id="filter-state" value={filters.state} onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))} className="input">
              <option value="">All states</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Minimum Rating</label>
            <select id="filter-rating" value={filters.minRating} onChange={(e) => setFilters((f) => ({ ...f, minRating: e.target.value }))} className="input">
              <option value="">Any rating</option>
              {RATINGS.map((r) => <option key={r} value={r}>{r}+ ⭐</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={clearFilters} className="btn-secondary text-sm w-full">
              <X className="w-3 h-3" /> Clear filters
            </button>
          </div>
          <div className="sm:col-span-3">
            <label className="label">Facilities</label>
            <div className="flex flex-wrap gap-2">
              {FACILITIES.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleFacility(f)}
                  className={`badge cursor-pointer border transition-colors ${
                    filters.facilities.includes(f)
                      ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300'
                      : 'bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[rgb(var(--color-muted))]">
          {loading ? 'Searching...' : `${pagination.total} gyms found`}
        </p>
        {pagination.pages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchGyms(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-50"
            >Previous</button>
            <span className="text-sm">{pagination.page} / {pagination.pages}</span>
            <button
              onClick={() => fetchGyms(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-50"
            >Next</button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <GymCardSkeleton key={i} />)
          : gyms.length === 0
          ? (
            <div className="col-span-3 text-center py-16 text-[rgb(var(--color-muted))]">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No gyms found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )
          : gyms.map((gym) => <GymCard key={gym._id} gym={gym} />)
        }
      </div>
    </div>
  );
}
