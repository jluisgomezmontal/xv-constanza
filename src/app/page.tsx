"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Church,
  Heart,
  Mail,
  MailOpen,
  MapPin,
  Martini,
  Music2,
  Pause,
  Play,
  Sparkles,
  Utensils,
} from "lucide-react";
import data from "@/data/invitation.json";
import { buildCalendar } from "@/lib/calendar";

function DiscoBall({ id = "invitation" }: { id?: string }) {
  const tiles = [];
  const round = (value: number) => Number(value.toFixed(4));
  for (let row = 0; row < 24; row++) {
    const latitude = ((row + 0.5) / 24) * Math.PI;
    const radius = Math.sin(latitude) * 147;
    const y = 150 - Math.cos(latitude) * 147;
    const height = Math.sin(latitude) * 19 + 1;
    for (let col = 0; col < 30; col++) {
      const longitude = (col / 30) * Math.PI;
      const next = ((col + 1) / 30) * Math.PI;
      const x = 150 - Math.cos(longitude) * radius;
      const width = (Math.cos(longitude) - Math.cos(next)) * radius;
      const light =
        24 + Math.sin(col * 1.7 + row * 3.2) * 15 + Math.sin(longitude) * 32;
      tiles.push(
        <rect
          key={`${row}-${col}`}
          x={round(x)}
          y={round(y - height / 2)}
          width={round(Math.max(0, width - 1.1))}
          height={round(height - 1.3)}
          fill={`hsl(226 ${5 + ((row * col) % 12)}% ${round(light + 10)}%)`}
        />,
      );
    }
  }
  return (
    <div className="disco-scene" aria-hidden="true">
      <div className="disco-rays" />
      <div className="disco-cord" />
      <svg className="disco-ball" viewBox="0 0 300 300">
        <defs>
          <clipPath id={`${id}-sphere`}>
            <circle cx="150" cy="150" r="147" />
          </clipPath>
          <radialGradient id={`${id}-shine`} cx="34%" cy="29%">
            <stop stopColor="#ffffff" stopOpacity=".72" />
            <stop offset=".44" stopColor="#eef1fa" stopOpacity=".07" />
            <stop offset="1" stopColor="#222536" stopOpacity=".48" />
          </radialGradient>
        </defs>
        <g clipPath={`url(#${id}-sphere)`}>
          <circle cx="150" cy="150" r="148" fill="#444755" />
          {tiles}
          <circle cx="150" cy="150" r="148" fill={`url(#${id}-shine)`} />
        </g>
      </svg>
      <span className="glint glint-one">✦</span>
      <span className="glint glint-two">✦</span>
      <span className="glint glint-three">✧</span>
    </div>
  );
}

function GiftEnvelopes() {
  const decoration = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = decoration.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={decoration}
      className={`envelope-rain${visible ? " is-visible" : ""}`}
      aria-hidden="true"
    >
      <MailOpen
        aria-hidden="true"
        className="envelope-main"
        size={44}
        strokeWidth={1}
      />
      {[0, 1, 2].map((index) => (
        <Mail
          aria-hidden="true"
          key={index}
          className="envelope-drop"
          size={24}
          strokeWidth={1.2}
        />
      ))}
    </div>
  );
}

function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const tick = () =>
      setRemaining(
        Math.max(0, new Date(data.event.date).getTime() - Date.now()),
      );
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  const seconds = Math.floor((remaining ?? 0) / 1000);
  const values = [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
  return (
    <section className="countdown" aria-label={data.countdown.title}>
      <p>{remaining === 0 ? data.countdown.finished : data.countdown.title}</p>
      <div className="countdown-grid">
        {values.map((value, i) => (
          <div key={i}>
            <span>
              {remaining === null ? "—" : String(value).padStart(2, "0")}
            </span>
            <small>{data.countdown.labels[i]}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

type MusicHandle = { play: () => void };

function MusicControl({
  ref,
  visible,
}: {
  ref: Ref<MusicHandle>;
  visible: boolean;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  function handleAudioError() {
    setPlaying(false);
    setError(true);
  }
  async function playMusic() {
    if (!audio.current || !data.music.enabled) return;
    try {
      audio.current.volume = Math.min(1, Math.max(0, data.music.volume));
      await audio.current.play();
      setError(false);
    } catch {
      handleAudioError();
    }
  }
  useImperativeHandle(ref, () => ({
    play: () => {
      void playMusic();
    },
  }));
  function toggle() {
    if (playing) audio.current?.pause();
    else void playMusic();
  }
  if (!data.music.enabled) return null;
  return (
    <div className="music-control" hidden={!visible}>
      <audio
        ref={audio}
        src={data.music.src}
        loop
        playsInline
        preload="none"
        onError={handleAudioError}
        onPlay={() => {
          setPlaying(true);
          setError(false);
        }}
        onPause={() => setPlaying(false)}
      />
      <button
        onClick={toggle}
        className={playing ? "music-button playing" : "music-button"}
        aria-label={playing ? data.music.pause : data.music.play}
        aria-pressed={playing}
      >
        {playing ? (
          <Pause aria-hidden="true" size={16} />
        ) : (
          <Play aria-hidden="true" size={16} />
        )}
        <span>{playing ? data.music.pause : data.music.play}</span>
        <span className="equalizer" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      </button>
      {error && <p role="status">{data.music.unavailable}</p>}
    </div>
  );
}

function saveDate() {
  const ceremony = data.venues.items.find((venue) => venue.type === "ceremony");
  const calendar = buildCalendar({
    title: data.event.calendarTitle,
    description: [
      data.event.calendarDescription,
      ...data.venues.items.map(
        (venue) => `${venue.name}: ${venue.address}\n${venue.mapUrl}`,
      ),
    ].join("\n\n"),
    start: data.event.date,
    end: data.event.endDate,
    location: ceremony
      ? `${ceremony.name}, ${ceremony.address}`
      : data.event.city,
    uid: `${data.calendar.filename}-${data.event.date}@invitation.local`,
  });
  const url = URL.createObjectURL(
    new Blob([calendar], { type: "text/calendar;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = data.calendar.filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const icons = {
  church: Church,
  glass: Martini,
  dinner: Utensils,
  heart: Heart,
  music: Music2,
};

export default function Home() {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const music = useRef<MusicHandle>(null);
  const invitationTitle = useRef<HTMLHeadingElement>(null);
  const isOpen = phase === "open";

  useEffect(() => {
    if (isOpen) return;
    document.documentElement.classList.add("invitation-locked");
    return () => document.documentElement.classList.remove("invitation-locked");
  }, [isOpen]);

  useEffect(() => {
    if (phase !== "opening") return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = window.setTimeout(
      () => setPhase("open"),
      reducedMotion ? 0 : 1100,
    );
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (!isOpen) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    invitationTitle.current?.focus({ preventScroll: true });
  }, [isOpen]);

  function openInvitation() {
    if (phase !== "closed") return;
    // Call play in the click handler, before any timer, to retain mobile audio permission.
    music.current?.play();
    setPhase("opening");
  }

  return (
    <>
      {!isOpen && (
        <main
          className={`entry-gate${phase === "opening" ? " is-opening" : ""}`}
          aria-labelledby="entry-title"
          aria-busy={phase === "opening"}
        >
          <div className="entry-frame" aria-hidden="true" />
          <div className="entry-topline">
            <span>{data.celebrant.occasion}</span>
            <span>{data.event.shortDate}</span>
          </div>
          <div className="entry-art">
            <DiscoBall id="entry" />
          </div>
          <div className="entry-copy">
            <p className="entry-intro">{data.entrance.intro}</p>
            <h1 id="entry-title">{data.celebrant.name}</h1>
            <p className="entry-tagline">
              <span className="entry-age-line">
                {data.entrance.tagline.prefix}{" "}
                <strong>{data.entrance.tagline.emphasis}</strong>
                {data.entrance.tagline.suffix}
              </span>
              <span>{data.entrance.tagline.description}</span>
            </p>
            <div className="entry-rule" aria-hidden="true">
              <span />✦<span />
            </div>
            <button
              className="button entry-button"
              type="button"
              onClick={openInvitation}
              disabled={phase !== "closed"}
            >
              <span className="entry-play" aria-hidden="true">
                {phase === "opening" ? (
                  <Sparkles aria-hidden="true" size={16} strokeWidth={1.5} />
                ) : (
                  <Play
                    aria-hidden="true"
                    size={14}
                    fill="currentColor"
                    strokeWidth={1}
                  />
                )}
              </span>
              <span>
                {phase === "opening" ? data.entrance.opening : data.hero.cta}
              </span>
            </button>
            {data.music.enabled && (
              <small className="entry-music-hint">
                <Music2 aria-hidden="true" size={12} />
                {data.entrance.musicHint}
              </small>
            )}
          </div>
          <p className="entry-location">{data.event.city}</p>
        </main>
      )}
      <div
        className={`invitation-content${phase === "opening" ? " is-revealing" : ""}`}
        hidden={phase === "closed"}
        inert={!isOpen}
        aria-hidden={!isOpen}
      >
        {data.navigation.enabled && (
          <header className="header">
            <a
              className="wordmark"
              href="#inicio"
              aria-label={data.celebrant.name}
            >
              {data.celebrant.monogram}
              <span>{data.celebrant.age}</span>
            </a>
            <nav aria-label={data.navigation.menuLabel}>
              <a href="#celebracion">{data.navigation.details}</a>
            </nav>
          </header>
        )}
        <a className="skip-link" href="#invitation-title">
          {data.navigation.skip}
        </a>
        <main id="invitation-main">
          <section className="hero" id="inicio">
            <div className="hero-grain" />
            <div className="hero-topline">
              <span>{data.celebrant.occasion}</span>
              <span>{data.event.shortDate}</span>
            </div>
            <DiscoBall />
            <div className="hero-copy">
              <p className="eyebrow">{data.hero.eyebrow}</p>
              <h1 id="invitation-title" ref={invitationTitle} tabIndex={-1}>
                {data.hero.title}
                <br />
                <em>{data.hero.accent}</em>
              </h1>
              <div className="name-line">
                <span />
                {data.celebrant.name}
                <span />
              </div>
              <p className="hero-description">{data.hero.description}</p>
              <a className="button primary" href="#celebracion">
                {data.hero.detailsCta}
                <ArrowDown aria-hidden="true" size={16} />
              </a>
              <div className="hero-date">
                <CalendarDays aria-hidden="true" size={15} />
                <span>{data.event.dateLabel}</span>
                <span className="date-dot">·</span>
                <span>{data.event.city}</span>
              </div>
            </div>
            <div className="hero-bottom">
              <span>{data.hero.edition}</span>
              <a href="#celebracion">
                {data.hero.scroll}
                <ArrowDown aria-hidden="true" size={13} />
              </a>
              <Sparkles aria-hidden="true" size={18} />
            </div>
          </section>
          <div id="celebracion" className="celebration-anchor">
            <Countdown />
          </div>
          <section className="welcome section">
            <Sparkles
              aria-hidden="true"
              className="section-spark"
              size={26}
              strokeWidth={1}
            />
            <h2>{data.welcome.heading}</h2>
            <p>{data.welcome.message}</p>
            <span className="signature">{data.welcome.signature}</span>
            <div className="family">
              {[
                [data.family.parentsLabel, data.family.parents],
                [data.family.godparentsLabel, data.family.godparents],
              ].map(([label, names]) => (
                <div key={label as string}>
                  <p>{label}</p>
                  <h3>{(names as string[]).join(" y ")}</h3>
                </div>
              ))}
            </div>
          </section>
          <section className="venues section">
            <div className="section-heading">
              <span className="tiny-star">✦</span>
              <h2>{data.venues.heading}</h2>
              <p>{data.venues.intro}</p>
            </div>
            <div className="venue-grid">
              {data.venues.items.map((venue) => {
                const Icon = venue.type === "ceremony" ? Church : Martini;
                return (
                  <article className="venue" key={venue.name}>
                    <div className="venue-top">
                      <Icon aria-hidden="true" size={30} strokeWidth={1} />
                    </div>
                    <p className="venue-label">{venue.label}</p>
                    <h3>{venue.name}</h3>
                    <span className="venue-time">{venue.time}</span>
                    <p className="address">
                      <MapPin aria-hidden="true" size={15} />
                      {venue.address}
                    </p>
                    {venue.note && <p className="venue-note">{venue.note}</p>}
                    <a
                      className="text-link"
                      href={venue.mapUrl}
                      aria-label={data.venues.mapLabel + " " + venue.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.venues.mapLabel}
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </a>
                  </article>
                );
              })}
            </div>
            <button className="button outline calendar" onClick={saveDate}>
              <CalendarDays aria-hidden="true" size={16} />
              {data.calendar.button}
            </button>
          </section>
          <section className="schedule section">
            <h2>{data.schedule.heading}</h2>
            <ol className="timeline">
              {data.schedule.items.map((item) => {
                const Icon = icons[item.icon as keyof typeof icons];
                return (
                  <li className="timeline-item" key={item.title}>
                    <span className="timeline-time">{item.time}</span>
                    <div className="timeline-icon">
                      <Icon aria-hidden="true" size={21} strokeWidth={1.2} />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </li>
                );
              })}
            </ol>
          </section>
          <section className="details section">
            <article className="dress">
              <Sparkles aria-hidden="true" size={27} strokeWidth={1} />
              <h2>{data.dressCode.heading}</h2>
              {data.dressCode.style && <h3>{data.dressCode.style}</h3>}
              {data.dressCode.description && (
                <p>{data.dressCode.description}</p>
              )}
              {data.dressCode.colors.length > 0 && (
                <div
                  className="swatches"
                  role="img"
                  aria-label={data.dressCode.colorsLabel}
                >
                  {data.dressCode.colors.map((color) => (
                    <span key={color} style={{ backgroundColor: color }} />
                  ))}
                </div>
              )}
              <small>{data.dressCode.note}</small>
            </article>
            <article className="gifts">
              <GiftEnvelopes />
              <h2>{data.gifts.heading}</h2>
              <p>{data.gifts.description}</p>
              <span className="gift-label">{data.gifts.label}</span>
              <p className="gift-note">{data.gifts.note}</p>
            </article>
          </section>
        </main>
        <footer>
          <span className="footer-name">{data.celebrant.name}</span>
          <p>{data.footer.message}</p>
          <span>{data.footer.closing}</span>
          <div className="footer-bottom">
            <span>
              {data.celebrant.occasion} · {data.event.shortDate}
            </span>
            {data.footer.demo && <small>{data.footer.demo}</small>}
            <Heart aria-hidden="true" size={14} />
          </div>
        </footer>
      </div>
      <MusicControl ref={music} visible={isOpen} />
    </>
  );
}
