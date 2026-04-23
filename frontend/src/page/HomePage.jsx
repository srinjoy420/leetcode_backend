import React from 'react'
import { Link } from 'react-router-dom'
import { Code2, Zap, Trophy, ArrowRight } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-base-100 overflow-hidden">

      {/* Ambient glow blobs — decorative only, behind content */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-[-10%] w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-[-5%] w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 max-w-4xl mx-auto">

        {/* Badge */}
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 rounded-full mb-6">
          <Zap className="w-3 h-3" />
          Level up your coding skills
        </span>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-white mb-6">
          Master{' '}
          <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Algorithms
          </span>
          <br />
          Ace Interviews
        </h1>

        {/* Subtext */}
        <p className="max-w-xl text-base md:text-lg text-gray-400 leading-relaxed mb-10">
          A platform inspired by LeetCode — solve curated problems, track your
          progress, and build the skills that land top engineering roles.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/problems"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-violet-700/30"
          >
            Start Solving
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/leaderboard"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Leaderboard
          </Link>
        </div>
      </section>

      {/* Stats row */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Problems', value: '500+', icon: <Code2 className="w-5 h-5 text-violet-400" /> },
            { label: 'Active Users', value: '12k+', icon: <Zap className="w-5 h-5 text-cyan-400" /> },
            { label: 'Solutions Submitted', value: '80k+', icon: <Trophy className="w-5 h-5 text-amber-400" /> },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-2xl py-6 px-4 backdrop-blur-sm"
            >
              {icon}
              <span className="text-3xl font-extrabold text-white">{value}</span>
              <span className="text-sm text-gray-400 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default HomePage