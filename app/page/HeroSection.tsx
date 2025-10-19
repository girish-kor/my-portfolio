import { useEffect, useState } from 'react';

type WeatherState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; celsius: number };

export function HeroSection() {
  const [now, setNow] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [headline, setHeadline] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<WeatherState>({ status: 'idle' });
  const [city, setCity] = useState<string>('');

  // Clock
  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Headline
  useEffect(() => {
    let abort = false;
    const fetchHeadline = async () => {
      try {
        const proxy = 'https://api.allorigins.win/raw?url=';
        const feedUrl = encodeURIComponent(
          'https://rss.nytimes.com/services/xml/rss/nyt/World.xml'
        );
        const res = await fetch(proxy + feedUrl);
        if (!res.ok) throw new Error();
        const text = await res.text();
        const match = text.match(/<item>[\s\S]*?<title>([\s\S]*?)<\/title>/i);
        const firstTitle = match ? match[1].replace(/<[^>]+>/g, '').trim() : null;
        if (!abort) setHeadline(firstTitle);
      } catch {
        if (!abort) setHeadline(null);
      }
    };
    fetchHeadline();
    const id = setInterval(fetchHeadline, 1000 * 60 * 5);
    return () => clearInterval(id);
  }, []);

  // Geolocation
  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    const onError = () => setCoords(null);
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

  // Weather
  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&temperature_unit=celsius`;
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const c = data?.current_weather?.temperature;
        if (typeof c !== 'number') throw new Error();
        if (!cancelled) setWeather({ status: 'ready', celsius: Math.round(c) });
      } catch {
        if (!cancelled) setWeather({ status: 'idle' });
      }
    };
    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [coords]);

  // ✅ Fixed City Fetch
  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    const fetchCity = async () => {
      try {
        // Use raw endpoint for cleaner response
        const proxy = 'https://api.allorigins.win/raw?url=';
        const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lon}`;
        const res = await fetch(proxy + encodeURIComponent(nomUrl), {
          headers: { 'User-Agent': 'HeroSectionApp/1.0' },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (cancelled) return;
        const addr = data?.address || {};
        const cityName =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.municipality ||
          addr.hamlet ||
          addr.county ||
          addr.state ||
          (data?.display_name ? String(data.display_name).split(',')[0].trim() : '') ||
          '';
        setCity(cityName);
      } catch {
        if (!cancelled) setCity('');
      }
    };
    fetchCity();
  }, [coords]);

  // Time & date formatting
  const locale =
    mounted && typeof navigator !== 'undefined' ? navigator.language || 'en-US' : 'en-US';
  const weekday = now ? new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(now) : '';
  const dateStr = now
    ? new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(now)
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
        {headline && (
          <div
            title={headline}
            aria-live="polite"
            aria-atomic="true"
            className="text-justify text-black/85 dark:text-white/85"
          >
            {headline}
          </div>
        )}
      </div>

      {/* Status row */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <time
            dateTime={now ? now.toISOString() : undefined}
            aria-live="polite"
            aria-atomic="true"
            className="font-mono text-black/85 dark:text-white/85"
          >
            {mounted && now ? timeStr : ''}
          </time>
          <div className="text-black/70 dark:text-white/70">
            {mounted && now ? `${weekday}, ${dateStr}` : ''}
          </div>
        </div>

        <div className="text-right">
          <div className="text-black/85 dark:text-white/85">
            {weather.status === 'ready' ? `${weather.celsius}°C` : ''}
          </div>
          <div className="text-black/70 dark:text-white/70">{city}</div>
        </div>
      </div>
    </div>
  );
}
