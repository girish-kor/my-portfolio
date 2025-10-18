import { useEffect, useState } from 'react';

type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; celsius: number };

export function HeroSection() {
  const [now, setNow] = useState<Date>(new Date());
  const [headline, setHeadline] = useState<string | null>(null);
  const [headlineLoading, setHeadlineLoading] = useState(false);
  const [headlineError, setHeadlineError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<WeatherState>({ status: 'idle' });
  const [city, setCity] = useState<string>('Unknown location');

  // Clock
  useEffect(() => {
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
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lon}`
        );
        const data = await res.json();
        setCity(
          data.address?.city || data.address?.town || data.address?.village || 'Unknown location'
        );
      } catch {
        setCity('City lookup failed');
      }
    };
    fetchCity();
  }, [coords]);

  // Formatting
  const locale = typeof navigator !== 'undefined' ? navigator.language || 'en-US' : 'en-US';
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(now);
  const dateStr = new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(now);
  const timeStr = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now);

  return (
    <div className="flex flex-col justify-between h-full w-full gap-4">
      {/* Headline */}
      <div className="flex items-center">
        <div title={headline ?? undefined} aria-live="polite" aria-atomic="true">
          {headlineLoading && <span className="opacity-60">Loading headline…</span>}
          {headlineError && <span className="text-rose-400">{headlineError}</span>}
          {!headlineLoading && !headlineError && (headline ?? 'No headline available')}
        </div>
      </div>

      {/* Status row */}
      <div className="flex justify-between items-center gap-4">
        {/* Date & Time */}
        <div>
          <time
            dateTime={now.toISOString()}
            aria-live="polite"
            aria-atomic="true"
            className="font-mono"
          >
            {timeStr}
          </time>
          <div className="">
            {weekday}, {dateStr}
          </div>
        </div>

        <div>
          {/* Temperature */}
          <div>
            {weather.status === 'idle' && <span className="opacity-60">Weather unknown</span>}
            {weather.status === 'loading' && <span className="opacity-60">Loading…</span>}
            {weather.status === 'error' && <span className="text-rose-400">{weather.message}</span>}
            {weather.status === 'ready' && <span>{weather.celsius}°C</span>}
          </div>

          {/* City */}
          <div>{city}</div>
        </div>
      </div>
    </div>
  );
}
