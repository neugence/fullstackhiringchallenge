import Hero from '@/components/Hero';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 font-sans cursor-default">
      <Hero />

      {/* Extra Content Section */}
      <section className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center border-t border-zinc-800 px-6 py-20 relative z-10 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-[128px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[128px]"></div>
        </div>

        <div className="text-center max-w-4xl relative z-20">
          <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 mb-8 font-heading tracking-wide uppercase">
            Drive the Future.
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 mx-auto leading-relaxed mb-16 max-w-2xl">
            Keep scrolling back up to see the GSAP ScrollTrigger seamlessly reverse the animation. This fluid scroll behavior avoids layout thrashing by using will-change and transform properties directly. We have now upgraded our entire visual framework, bringing neon cyber-aesthetics and F1 speeds.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700 backdrop-blur-sm">
              <div className="text-fuchsia-400 mb-4 text-3xl">✦</div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">Unmatched Speed</h3>
              <p className="text-zinc-500">Optimized to its absolute limits, ensuring 60fps animations across all modern devices.</p>
            </div>
            <div className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700 backdrop-blur-sm">
              <div className="text-cyan-400 mb-4 text-3xl">❖</div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">Immersive Design</h3>
              <p className="text-zinc-500">We utilize cutting-edge WebGL and CSS features to blur the line between code and reality.</p>
            </div>
            <div className="bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700 backdrop-blur-sm">
              <div className="text-violet-400 mb-4 text-3xl">✧</div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">Next-Gen Tech</h3>
              <p className="text-zinc-500">Built on React, Next.js 14, and GSAP ScrollTrigger for a robust frontend experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Another section for extra scroll room */}
      <section className="h-[25vh] bg-zinc-950 flex shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-zinc-900 relative z-20 items-center justify-center">
        <p className="text-zinc-600 font-medium">© 2026 ITZFIZZ NEXT-GEN LABS</p>
      </section>
    </main>
  );
}