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
    let alive = true;
    const controller = new AbortController();

    const parseTitleFromXml = (xmlText: string): string | null => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'application/xml');
        // Try RSS <item><title>
        const item = doc.querySelector('item');
        if (item) {
          const t = item.querySelector('title')?.textContent;
          if (t) return t.trim();
        }
        // Try Atom <entry><title>
        const entryTitle = doc.querySelector('entry > title')?.textContent;
        if (entryTitle) return entryTitle.trim();
        // Fallback to channel title
        const channelTitle = doc.querySelector('channel > title')?.textContent;
        return channelTitle ? channelTitle.trim() : null;
      } catch {
        return null;
      }
    };

    const fetchHeadline = async () => {
      const feedUrl = 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml';
      // Try direct fetch first (some proxies are blocked on mobile); fall back to AllOrigins
      const candidates = [
        feedUrl,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`,
      ];

      for (const url of candidates) {
        try {
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) throw new Error('bad response');
          const text = await res.text();
          const firstTitle = parseTitleFromXml(text);
          if (!alive) return;
          setHeadline(firstTitle);
          return;
        } catch (e) {
          if (controller.signal.aborted) return;
          // try next candidate
        }
      }

      if (alive) setHeadline(null);
    };

    fetchHeadline();
    const id = setInterval(fetchHeadline, 1000 * 60 * 5);
    return () => {
      alive = false;
      controller.abort();
      clearInterval(id);
    };
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

  // Quick IP-based geolocation fallback (approximate) to avoid waiting for user geolocation
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const fetchIpLocation = async () => {
      try {
        // ipapi.co provides a quick, public JSON endpoint with lat/lon
        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const lat = Number(data.latitude ?? data.lat);
        const lon = Number(data.longitude ?? data.lon);
        if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
          // only set if we don't already have a more accurate position
          setCoords((prev) => (prev ? prev : { lat, lon }));
        }
      } catch {
        // ignore IP fallback failures silently
      }
    };
    fetchIpLocation();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  // Fetch weather and city in parallel as soon as we have coords
  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    const controller = new AbortController();

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&temperature_unit=celsius`;
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lon}`;

    setWeather({ status: 'loading' });

    const weatherFetch = fetch(weatherUrl, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        const c = data?.current_weather?.temperature;
        if (typeof c !== 'number') throw new Error();
        if (!cancelled) setWeather({ status: 'ready', celsius: Math.round(c) });
      })
      .catch(() => {
        if (!cancelled) setWeather({ status: 'idle' });
      });

    const cityFetch = fetch(nomUrl, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
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
      })
      .catch(() => {
        if (!cancelled) setCity('');
      });

    // run both concurrently
    Promise.allSettled([weatherFetch, cityFetch]).catch(() => {});

    return () => {
      cancelled = true;
      controller.abort();
    };
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
  const coordsStr = coords ? `${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}` : '';

  return (
    <div className="flex flex-col justify-between h-full w-full gap-4 ">
      {/* Headline */}
      <div className="flex items-center">
        {headline && (
          <div title={headline} aria-live="polite" aria-atomic="true" className="text-justify">
            {headline}
          </div>
        )}
      </div>

      {/* Status row */}
      <div className="flex justify-between items-center gap-4 opacity-80">
        <div>
          <time
            dateTime={now ? now.toISOString() : undefined}
            aria-live="polite"
            aria-atomic="true"
            className="text-xs"
          >
            {mounted && now ? timeStr : ''}
          </time>
          <div className=" text-sm">{mounted && now ? `${weekday}, ${dateStr}` : ''}</div>
        </div>

        <div className="text-right">
          <div>{weather.status === 'ready' ? `${weather.celsius}°C` : ''}</div>
          <div className="text-sm opacity-90">
            <div>{city ? city : coords ? coordsStr : 'Location ?'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
