import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import api from '../api/axios'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F5F5F0' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Nevažeći link</h2>
          <p className="text-gray-500 mb-4 text-sm">Ovaj link za reset nije validan.</p>
          <Link to="/forgot-password" className="font-semibold text-sm hover:opacity-80" style={{ color: '#FF6B35' }}>
            Zatraži novi link
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      return setError('Password mora imati najmanje 6 karaktera.')
    }
    if (password !== confirm) {
      return setError('Passwordi se ne podudaraju.')
    }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password })
      navigate('/login', { state: { message: 'Password uspješno resetovan! Prijavi se.' } })
    } catch (err) {
      setError(err.response?.data?.message || 'Token nije validan ili je istekao.')
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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Novi password</h1>
        <p className="text-gray-500 mb-8 text-sm">Unesi novi password za tvoj nalog.</p>

        {error && (
          <div className="px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
            style={{ background: '#FFF0ED', color: '#FF3B30', border: '1px solid #FFCCC7' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Novi password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition"
              style={{ background: 'white', border: '1.5px solid #E5E5EA', color: '#1C1C1E' }}
              placeholder="••••••••"
              onFocus={e => e.target.style.borderColor = '#FF6B35'}
              onBlur={e => e.target.style.borderColor = '#E5E5EA'}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Potvrdi password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition"
              style={{ background: 'white', border: '1.5px solid #E5E5EA', color: '#1C1C1E' }}
              placeholder="••••••••"
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
            {loading ? 'Resetovanje...' : 'Resetuj password'}
          </button>
        </form>
      </div>
    </div>
  )
}
