import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Greška na serveru, pokušaj ponovo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F5F5F0' }}>
      <div className="w-full max-w-sm">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #FFB800)' }}>
            <span className="text-white font-black text-lg">K</span>
          </div>
          <span className="font-bold text-xl text-gray-900">KOLEGA</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email poslan!</h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Ako postoji nalog sa tim emailom, poslan je link za reset passworda. Provjeri inbox i spam folder.
            </p>
            <Link to="/login"
              className="text-sm font-semibold hover:opacity-80 transition"
              style={{ color: '#FF6B35' }}>
              Nazad na prijavu
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Zaboravljen password?</h1>
            <p className="text-gray-500 mb-8 text-sm">Unesi email i poslaćemo ti link za reset.</p>

            {error && (
              <div className="px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
                style={{ background: '#FFF0ED', color: '#FF3B30', border: '1px solid #FFCCC7' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition"
                  style={{ background: 'white', border: '1.5px solid #E5E5EA', color: '#1C1C1E' }}
                  placeholder="email@gmail.com"
                  onFocus={e => e.target.style.borderColor = '#FF6B35'}
                  onBlur={e => e.target.style.borderColor = '#E5E5EA'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #FFB800)' }}
              >
                {loading ? 'Slanje...' : 'Pošalji link za reset'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              <Link to="/login" className="font-semibold hover:opacity-80 transition" style={{ color: '#FF6B35' }}>
                Nazad na prijavu
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
