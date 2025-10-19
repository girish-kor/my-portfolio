import { useEffect, useState } from 'react';

type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; celsius: number };

export function HeroSection() {
  // Render time only on the client to avoid SSR/CSR hydration mismatches.
  const [now, setNow] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [headline, setHeadline] = useState<string | null>(null);
  const [headlineLoading, setHeadlineLoading] = useState(false);
  const [headlineError, setHeadlineError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<WeatherState>({ status: 'idle' });
  const [city, setCity] = useState<string>('');

  // Clock
  useEffect(() => {
    // Mark mounted and initialize clock on the client only.
    setMounted(true);
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch headline
  useEffect(() => {
    let abort = false;
    const fetchHeadline = async () => {
      setHeadlineLoading(true);
      setHeadlineError(null);
      try {
        const proxy = 'https://api.allorigins.win/raw?url=';
        const feedUrl = encodeURIComponent(
          'https://rss.nytimes.com/services/xml/rss/nyt/World.xml'
        );
        const res = await fetch(proxy + feedUrl);
        if (!res.ok) throw new Error(`Network error ${res.status}`);
        const text = await res.text();
        const match = text.match(/<item>[\s\S]*?<title>([\s\S]*?)<\/title>/i);
        const firstTitle = match ? match[1].replace(/<[^>]+>/g, '').trim() : null;
        if (!abort) setHeadline(firstTitle);
      } catch (err: any) {
        if (!abort) setHeadlineError(err?.message ?? 'Failed to load headline');
      } finally {
        if (!abort) setHeadlineLoading(false);
      }
    };
    fetchHeadline();
    const id = setInterval(fetchHeadline, 1000 * 60 * 5);
    return () => clearInterval(id);
  }, []);

  // Geolocation
  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    const onError = () => {
      setCoords(null);
      if (weather.status === 'idle') setWeather({ status: 'error', message: 'Location denied' });
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      onError,
      { maximumAge: 1000 * 60 * 5 }
    );

    const watcher = navigator.geolocation.watchPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      onError,
      { maximumAge: 1000 * 60 * 5 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  // Fetch weather
  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    const fetchWeather = async () => {
      setWeather({ status: 'loading' });
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&temperature_unit=celsius`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Weather network ${res.status}`);
        const data = await res.json();
        const c = data?.current_weather?.temperature;
        if (typeof c !== 'number') throw new Error('No temperature in response');
        if (!cancelled) setWeather({ status: 'ready', celsius: Math.round(c) });
      } catch (err: any) {
        if (!cancelled)
          setWeather({ status: 'error', message: err?.message ?? 'Weather fetch failed' });
      }
    };
    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [coords]);

  // Fetch city name using OpenStreetMap
  useEffect(() => {
    if (!coords) return;
    const fetchCity = async () => {
      try {
        // Nominatim doesn't always send CORS headers and may block direct browser requests.
        // Use AllOrigins as a lightweight proxy for development. For production, proxy via
        // your server or a proper proxy to respect Nominatim's usage policy.
        const proxy = 'https://api.allorigins.win/raw?url=';
        const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lon}`;
        const res = await fetch(proxy + encodeURIComponent(nomUrl));
        const data = await res.json();
        setCity(data.address?.city || data.address?.town || data.address?.village || '');
      } catch {
        // Don't set a visible fallback message; leave city empty so nothing is shown.
        setCity('');
      }
    };
    fetchCity();
  }, [coords]);

  // Formatting
  // Only format dates/times when running on the client and the clock has been initialized.
  const locale =
    mounted && typeof navigator !== 'undefined' ? navigator.language || 'en-US' : 'en-US';
  const weekday = now ? new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(now) : '';
  const dateStr = now
    ? new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
      }).format(now)
    : '';
  const timeStr = now
    ? new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(now)
    : '';

  return (
    <div className="flex flex-col justify-between h-full w-full gap-4">
      {/* Headline */}
      <div className="flex items-center">
        <div
          title={headline ?? undefined}
          aria-live="polite"
          aria-atomic="true"
          className="text-justify"
        >
          {headlineLoading && <span className="opacity-60">Loading headline…</span>}
          {headlineError && <span className="text-rose-600">{headlineError}</span>}
          {!headlineLoading && !headlineError && (headline ?? 'No headline available')}
        </div>
      </div>

      {/* Status row */}
      <div className="flex justify-between items-center gap-4">
        {/* Date & Time */}
        <div>
          <time
            dateTime={now ? now.toISOString() : undefined}
            aria-live="polite"
            aria-atomic="true"
            className="font-mono"
          >
            {mounted && now ? timeStr : ''}
          </time>
          <div className="">{mounted && now ? `${weekday}, ${dateStr}` : ''}</div>
        </div>

        <div>
          {/* Temperature */}
          <div>
            {weather.status === 'loading' && <span className="opacity-60">Loading…</span>}
            {weather.status === 'error' && <span className="text-rose-600">{weather.message}</span>}
            {weather.status === 'ready' && <span>{weather.celsius}°C</span>}
          </div>

          {/* City */}
          <div>{city}</div>
        </div>
      </div>
    </div>
  );
}
