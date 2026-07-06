import { useState, useEffect } from 'react'

export default function CountdownTimer({ targetDate, className = '' }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  function calculateTimeLeft(target) {
    const diff = new Date(target).getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className={`flex items-center gap-3 text-sm font-medium ${className}`}>
      <span className="text-gray-500 uppercase tracking-wider">Flash Sale Ends In</span>
      <div className="flex items-center gap-1.5">
        <span className="bg-ink text-white px-2 py-1 rounded font-mono text-base">{pad(timeLeft.days)}<span className="text-xs ml-0.5">d</span></span>
        <span className="text-gray-400">:</span>
        <span className="bg-ink text-white px-2 py-1 rounded font-mono text-base">{pad(timeLeft.hours)}<span className="text-xs ml-0.5">h</span></span>
        <span className="text-gray-400">:</span>
        <span className="bg-ink text-white px-2 py-1 rounded font-mono text-base">{pad(timeLeft.minutes)}<span className="text-xs ml-0.5">m</span></span>
        <span className="text-gray-400">:</span>
        <span className="bg-ink text-white px-2 py-1 rounded font-mono text-base">{pad(timeLeft.seconds)}<span className="text-xs ml-0.5">s</span></span>
      </div>
    </div>
  )
}
