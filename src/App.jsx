import { useEffect, useRef, useState } from 'react';

export default function App() {
  const canvasRef = useRef(null);
  const [scene, setScene] = useState('heart');
  const [showUi, setShowUi] = useState(false);
  const audioRef = useRef(null);
  
  const currentTrackIndexRef = useRef(0);

  const playlist = [
    'Potential.mp3',
    'Slow Down.mp3',
    'Бальзам.mp3',
    'WRONG.mp3',
    'Залежність [9cX5pbktgf8].mp3',
    'Friends.mp3',
    'Вкрали (Мамо).mp3',
    'НА КИЛИМІ.mp3',
    'Спитай у чата джипіті.mp3',
    'ТАНУТАНУТА.mp3',
    'ТЕХНО.mp3',
    'ШИПИ.mp3',
    'ШОВКОВИЦЯ.mp3',
    'якщо це не по-справжньому у.mp3',
    'São Paulo.mp3'
  ];

  const handleStart = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(playlist[currentTrackIndexRef.current]);
      audioRef.current.volume = 0.03;

      audioRef.current.addEventListener('ended', () => {
        currentTrackIndexRef.current = (currentTrackIndexRef.current + 1) % playlist.length;
        audioRef.current.src = playlist[currentTrackIndexRef.current];
        audioRef.current.play().catch((err) => console.log(err));
      });
    }
    
    audioRef.current.play().catch((err) => {
      console.log(err);
    });
    setScene('words');
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    let bgStars = [];
    let floatingItems = [];
    const particleCount = 900;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class BgStar {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.0 + 0.3;
        this.speed = Math.random() * 0.25 + 0.05;
        this.alpha = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.y -= this.speed;
        if (this.y < -10) {
          this.y = canvas.height + 10;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#ffb3c1';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Particle {
      constructor(hx, hy) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.heartX = hx;
        this.heartY = hy;
        
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.size = Math.random() * 1.6 + 0.5;
        this.speed = Math.random() * 0.04 + 0.02;

        const colors = ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#fff0f3'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.6 + 0.4;
      }

      update(currentScene) {
        if (currentScene === 'heart') {
          const cx = canvas.width / 2;
          const cy = canvas.height / 2 - 40; 
          const responsiveScale = Math.min(canvas.width, canvas.height) * 0.035;

          const tx = cx + this.heartX * responsiveScale;
          const ty = cy + this.heartY * responsiveScale;

          this.x += (tx - this.x) * this.speed;
          this.y += (ty - this.y) * this.speed;
        } else {
          this.x += this.vx;
          this.y += this.vy - 1.2;
          this.alpha -= 0.01;
        }
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    class FloatingItem {
      constructor() {
        const words = [
          'Мила', 'Сонечко', 'Кохана', 'Гарнюня', '❤️', '💖', '✨', '🥰', 
          'Неймовірна', 'Наймиліша', 'Милий чортик 💜', 'Щира', 'Смішна', 'Весела', 
          'Добра', 'Моя', '💕', '🌸', 'Сексуальна' 
        ];
        this.text = words[Math.floor(Math.random() * words.length)];
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50 + 10; 
        this.speed = Math.random() * 1.0 + 0.6;
        this.size = this.text.length <= 2 ? Math.random() * 6 + 18 : Math.random() * 4 + 14;
        this.alpha = Math.random() * 0.3 + 0.25;
        this.angle = Math.random() * Math.PI * 2;
        
        const colors = ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y -= this.speed;
        this.angle += 0.012;
        this.x += Math.sin(this.angle) * 0.3;
      }

      draw() {
        if (this.y < -50) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.font = `600 ${this.size}px 'Montserrat', sans-serif`;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      bgStars = [];
      
      for (let i = 0; i < 40; i++) {
        bgStars.push(new BgStar());
      }
      
      for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        particles.push(new Particle(hx, hy));
      }
    };

    initParticles();
    const uiTimeout = setTimeout(() => setShowUi(true), 2000);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bgStars.forEach(star => {
        star.update();
        star.draw();
      });

      particles.forEach(p => {
        p.update(scene);
        p.draw();
      });

      if (scene === 'words') {
        if (floatingItems.length < 25 && Math.random() < 0.1) {
          floatingItems.push(new FloatingItem());
        }
        floatingItems.forEach((item, index) => {
          item.update();
          item.draw();
          if (item.y < -50) floatingItems.splice(index, 1);
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(uiTimeout);
    };
  }, [scene]);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100dvh', 
      backgroundImage: 'linear-gradient(rgba(10, 6, 12, 0.82), rgba(10, 6, 12, 0.9)), url(fav.jpg)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden' 
    }}>
      
      <style>{`
        @keyframes glowPulse {
          0% { box-shadow: 0 0 10px rgba(255, 77, 109, 0.2); border-color: rgba(255, 77, 109, 0.3); }
          50% { box-shadow: 0 0 20px rgba(255, 77, 109, 0.6); border-color: rgba(255, 117, 143, 0.7); }
          100% { box-shadow: 0 0 10px rgba(255, 77, 109, 0.2); border-color: rgba(255, 77, 109, 0.3); }
        }
        @keyframes scaleUpInMobile {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .premium-btn {
          animation: glowPulse 2.5s infinite ease-in-out;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />

      {scene === 'heart' && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center', opacity: showUi ? 1 : 0, transition: 'opacity 1.2s ease',
          fontFamily: "'Montserrat', sans-serif", zIndex: 20, width: '90%', maxWidth: '280px',
          marginTop: '-20px'
        }}>
          <h1 style={{ 
            color: '#ffffff', fontSize: '2.2rem', margin: 0, 
            textShadow: '0 0 10px rgba(255, 77, 109, 0.6)', 
            fontWeight: '600', letterSpacing: '1px'
          }}>
            З днем народження кохана 😚
          </h1>
          
          <button 
            onClick={handleStart}
            className="premium-btn"
            style={{
              marginTop: '35px',
              background: 'rgba(255, 255, 255, 0.05)', 
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 77, 109, 0.4)',
              padding: '14px 40px',
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Жмякни 👉👈
          </button>
        </div>
      )}

      {}
      {scene === 'words' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 30, overflowY: 'auto', display: 'flex', justifyContent: 'center',
          padding: '40px 0', boxSizing: 'border-box', WebkitOverflowScrolling: 'touch'
        }}>
          <div style={{
            width: '88%', maxWidth: '420px', margin: 'auto',
            fontFamily: "'Montserrat', sans-serif",
            animation: 'scaleUpInMobile 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards'
          }}>
            <div style={{
              backgroundImage: 'linear-gradient(rgba(10, 6, 12, 0.6), rgba(10, 6, 12, 0.75)), url(fov.jpg)',
              backgroundSize: 'auto', 
              backgroundPosition: 'center', 
              backgroundRepeat: 'no-repeat',
              padding: '40px 25px', borderRadius: '35px', 
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 0 15px rgba(255,255,255,0.3)',
              border: '2px solid rgba(255, 255, 255, 0.15)', 
              textAlign: 'center',
              overflow: 'hidden' 
            }}>
              <h2 style={{ 
                fontSize: '2.5rem', 
                color: '#ffffff', 
                margin: '0 0 5px 0', 
                fontFamily: "'Great Vibes', cursive",
                textShadow: '0 2px 10px rgba(255, 77, 109, 0.8)'
              }}>
                Я тебе дуже сильно люблю сонечко 😘❤️🥰
              </h2>
              <div style={{ color: '#ffb3c1', fontSize: '0.85rem', marginBottom: '20px', letterSpacing: '4px' }}>
                ✨ 🤍 ✨
              </div>
              <p style={{
                color: '#fff0f3', 
                fontSize: '1rem', lineHeight: '1.65',
                whiteSpace: 'pre-line', fontWeight: '500', textAlign: 'left', margin: 0,
                textShadow: '0 1px 3px rgba(0,0,0,0.5)'
              }}>
                ❣️🩷 З днем народження кохана! ❤️‍🔥❣️ {"\n\n"}
                Я вітаю з твоїми 20 роками і ніколи не забувай наскільки ти особлива, чарівна, гарна, неймовірна, сексуальна, добра, щира, весела, приємна і що саме головне ти є ти!🤗😊 Залишайся попри все собою!😚💝 Я тебе завжди підтримаю і буду на твоїй стороні, я тебе люблю всім серцем і хочу щоб твої бажання завжди виконувалися та любі складності в житті приносили не сум чи печаль, а тільки розуміння, що це новий досвід який знадобиться в житті!🫶❤️ І побуду трішки винятковістю і попрошу ніколи не здаватися заради себе і заради мене 😂😘 {"\n\n"}
                Я дуже вдячний, що ти є в моєму житті і я дуже щасливий, що ми разом!🥰💖 Я тебе дуже дуже дуже дуже дуже дуже сильно люблю сонечко 😘❤️❤️
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}