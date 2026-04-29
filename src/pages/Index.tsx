import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import birthdayPhoto from "@/assets/birthday-photo.jpg";
import greetingCard from "@/assets/greeting-card.png";
import { useClickConfetti } from "@/hooks/useClickConfetti";

const floatingItems = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  emoji: ["💖", "✨", "🤍", "🎂", "🎈", "🎉"][i % 6],
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 10}s`,
  duration: `${8 + Math.random() * 12}s`,
  size: `${0.7 + Math.random() * 1.3}rem`,
}));

const particles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${10 + Math.random() * 80}%`,
  top: `${10 + Math.random() * 80}%`,
  delay: `${Math.random() * 5}s`,
  size: `${3 + Math.random() * 5}px`,
}));

const buntingFlags = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  color: ["hsl(330 60% 75%)", "hsl(270 50% 80%)", "hsl(45 80% 75%)", "hsl(180 40% 75%)", "hsl(330 50% 85%)", "hsl(200 50% 78%)", "hsl(15 70% 78%)", "hsl(270 40% 85%)", "hsl(45 70% 80%)"][i],
  delay: `${i * 0.1}s`,
}));

const confettiEmojis = ["🎉", "🎊", "✨", "💖", "🌟", "🎀", "💫", "🤍"];

const flipSparkleEmojis = ["✨", "💖", "🌟", "💫", "✨", "💖", "🌟", "💫"];

const Index = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [giftClicked, setGiftClicked] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [isMuted, setIsMuted] = useState(true);
  const [showFlipSparkle, setShowFlipSparkle] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useClickConfetti();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    if (isMuted) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
    setIsMuted(!isMuted);
  };

  const handleFlip = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    if (newFlipped) {
      setShowFlipSparkle(true);
      setTimeout(() => setShowFlipSparkle(false), 1000);
    }
  };

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(330 50% 92%), hsl(270 40% 92%), hsl(300 20% 97%), hsl(0 0% 100%))",
      }}
    >
      {/* Bunting / triangle flags decoration */}
      <div className="fixed top-0 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <svg viewBox="0 0 900 80" className="w-full max-w-3xl" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>
          <path d="M0 10 Q450 50 900 10" stroke="hsl(330 40% 70%)" strokeWidth="2" fill="none" />
          {buntingFlags.map((flag, i) => {
            const x = 50 + i * 100;
            return (
              <polygon
                key={flag.id}
                points={`${x - 18},12 ${x + 18},12 ${x},55`}
                fill={flag.color}
                opacity="0.85"
                className="animate-gentle-sway"
                style={{ animationDelay: flag.delay, transformOrigin: `${x}px 12px` }}
              />
            );
          })}
        </svg>
      </div>

      {/* Floating emojis */}
      {floatingItems.map((item) => (
        <span
          key={item.id}
          className="fixed pointer-events-none z-30 animate-float-up"
          style={{
            left: item.left,
            bottom: "-20px",
            animationDelay: item.delay,
            animationDuration: item.duration,
            fontSize: item.size,
          }}
        >
          {item.emoji}
        </span>
      ))}

      {/* Dreamy particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-0 rounded-full animate-gentle-pulse"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            background: "hsl(330 60% 75% / 0.4)",
            boxShadow: "0 0 10px hsl(330 60% 75% / 0.3)",
          }}
        />
      ))}

      {/* Candle decorations */}
      <div className="fixed top-16 left-4 z-10 pointer-events-none opacity-60 text-2xl sm:text-3xl animate-gentle-pulse">🕯️</div>
      <div className="fixed top-24 right-6 z-10 pointer-events-none opacity-60 text-2xl sm:text-3xl animate-gentle-pulse" style={{ animationDelay: "1s" }}>🕯️</div>
      <div className="fixed bottom-20 left-8 z-10 pointer-events-none opacity-50 text-xl animate-gentle-pulse" style={{ animationDelay: "2s" }}>🕯️</div>
      <div className="fixed bottom-32 right-4 z-10 pointer-events-none opacity-50 text-xl animate-gentle-pulse" style={{ animationDelay: "0.5s" }}>🕯️</div>

      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 glass rounded-full p-3 transition-all duration-300 hover:scale-110 text-foreground/70 hover:text-foreground"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-10 sm:py-16 md:py-20 max-w-2xl mx-auto">
        {/* Cake decoration at top */}
        <div className="text-4xl sm:text-5xl mb-2 animate-gentle-pulse">🎂</div>

        {/* Hero heading */}
        <div
          id="hero"
          data-animate
          className={`transition-all duration-1000 ${isVisible("hero") ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <h1 className="font-dancing text-5xl sm:text-6xl md:text-7xl font-bold text-primary animate-text-glow text-center leading-tight">
            Happy Birthday Vismayaa 👑
          </h1>
        </div>

        {/* Flip photo section */}
        <div
          id="photo"
          data-animate
          className={`mt-10 sm:mt-14 transition-all duration-1000 ${isVisible("photo") ? "animate-zoom-in" : "opacity-0"}`}
        >
          <div
            className="relative cursor-pointer perspective-800"
            onClick={handleFlip}
            title="Tap to flip!"
          >
            <div
              className={`w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 transition-transform duration-700 preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
            >
              {/* Front: Cake */}
              <div className="absolute inset-0 backface-hidden rounded-full overflow-hidden animate-glow-pulse border-4 border-primary/30 shadow-xl">
                <div className="w-full h-full flex items-center justify-center bg-secondary text-5xl sm:text-6xl">
                  🎂
                </div>
              </div>
              {/* Back: Photo */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-full overflow-hidden animate-glow-pulse border-4 border-primary/30 shadow-xl">
                <img
                  src={birthdayPhoto}
                  alt="Birthday photo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Flip sparkle effect */}
            {showFlipSparkle && (
              <>
                <div className="absolute inset-0 rounded-full animate-flip-sparkle border-2 border-primary/40 pointer-events-none" />
                {flipSparkleEmojis.map((emoji, i) => {
                  const angle = (i / flipSparkleEmojis.length) * 360;
                  const rad = (angle * Math.PI) / 180;
                  const radius = 90;
                  return (
                    <span
                      key={i}
                      className="absolute pointer-events-none text-lg animate-confetti-pop"
                      style={{
                        left: `calc(50% + ${Math.cos(rad) * radius}px - 10px)`,
                        top: `calc(50% + ${Math.sin(rad) * radius}px - 10px)`,
                        animationDelay: `${i * 0.05}s`,
                        animationDuration: "0.8s",
                      }}
                    >
                      {emoji}
                    </span>
                  );
                })}
              </>
            )}

            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/10 scale-110 animate-gentle-pulse" />
            <p className="text-xs text-muted-foreground mt-3 text-center">
              {isFlipped ? "tap to flip back" : "tap the cake! 🎂"}
            </p>
          </div>
        </div>

        {/* Glass card with message */}
        <div
          id="message"
          data-animate
          className={`mt-10 sm:mt-14 w-full glass rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg transition-all duration-1000 ${isVisible("message") ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <div className="space-y-4 text-foreground/80 text-sm sm:text-base leading-relaxed">
            <p>
              Happiest birthday my dear <s className="text-muted-foreground">best friend</s>…
            </p>
            <p>
              ohh I'm sorry 😄 I know you don't like "best friends"…
            </p>
            <p>
              Happy birthday my dear friend 🤍
            </p>
            <p>
              Have a great day and an amazing year ahead.
            </p>
            <p>
              God bless you ✨
            </p>
            <p>
              Stay happy and stay beautiful…
            </p>
            <p>
              I'm really glad that I got to know you.
            </p>
          </div>
        </div>

        {/* Extra lines */}
        <div
          id="extra"
          data-animate
          className={`mt-8 sm:mt-10 w-full glass rounded-2xl p-6 sm:p-8 text-foreground/70 text-sm sm:text-base space-y-3 transition-all duration-1000 delay-200 ${isVisible("extra") ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <p>I hope you always find reasons to smile, even on tough days ✨</p>
          <p>You deserve good things, always.</p>
          <p>Your simplicity is something really special 🙏</p>
          <p>Just a reminder that I'm always here if you ever need anything.</p>
          <p className="font-medium text-foreground/90 pt-2">
            And whatever you may call me,
            <br />
            you are my best friend 💖💎
          </p>
        </div>

        {/* Gift button */}
        <div
          id="gift"
          data-animate
          className={`mt-10 sm:mt-14 transition-all duration-1000 ${isVisible("gift") ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <button
            onClick={() => {
              setGiftClicked(true);
              setTimeout(() => setShowGift(true), 600);
            }}
            className={`px-8 py-3 sm:px-10 sm:py-4 rounded-full bg-primary text-primary-foreground font-medium text-base sm:text-lg shadow-lg transition-all duration-300 hover:scale-105 animate-glow-pulse hover:shadow-2xl active:scale-95 ${giftClicked ? "animate-gift-unwrap" : ""}`}
          >
            Click here 🎁
          </button>
        </div>

        {/* Confetti burst */}
        {giftClicked && (
          <div className="relative w-full flex justify-center -mt-4 pointer-events-none">
            {confettiEmojis.map((emoji, i) => (
              <span
                key={i}
                className="absolute text-xl sm:text-2xl animate-confetti-pop"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  animationDelay: `${i * 0.08}s`,
                  animationDuration: `${0.8 + Math.random() * 0.5}s`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}

        {/* Hidden greeting card reveal */}
        {showGift && (
          <div className="mt-10 w-full flex justify-center animate-reveal">
            <img
              src={greetingCard}
              alt="Birthday greeting card"
              className="w-full max-w-md rounded-2xl shadow-2xl animate-paper-float"
            />
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  );
};

export default Index;
