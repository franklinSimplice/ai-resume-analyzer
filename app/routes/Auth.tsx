import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import { useApiStore } from "~/lib/api"
import { useTranslation } from 'react-i18next'

const meta = () => {
    [
        { title: 'ResumeEly | Auth' },
        { name: 'description', content: 'Log into your account.' }
    ]
}

function Auth() {

    const { isLoading, auth, error, clearError } = useApiStore()
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()
    const next = location.search.split('next=')[1] || '/'

    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [localError, setLocalError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next)
        }
    }, [auth.isAuthenticated, next])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError('')
        setSuccessMsg('')
        clearError()

        if (!email || !password) {
            setLocalError('Please enter your email and password.')
            return
        }

        if (isSignUp && password !== confirmPassword) {
            setLocalError('Passwords do not match.')
            return
        }

        if (isSignUp && password.length < 6) {
            setLocalError('Password must be at least 6 characters.')
            return
        }

        try {
            if (isSignUp) {
                const res = await auth.signUp(email, password)
                if (res?.emailConfirmationRequired) {
                    setSuccessMsg('Account created successfully! Please check your email inbox to confirm your account before signing in.')
                    setIsSignUp(false)
                    setPassword('')
                    setConfirmPassword('')
                }
            } else {
                await auth.signIn(email, password)
            }
        } catch (err: any) {
            setLocalError(err.message || 'Authentication failed.')
        }
    }

    const displayError = localError || error

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex justify-center items-center">
            <div className='gradient-border shadow-lg w-full max-w-[500px] mx-4'>
                <section className='flex flex-col items-center gap-6 bg-white rounded-2xl p-8 sm:p-10 w-full'>
                    <div className='flex flex-col items-center justify-center gap-2 text-center'>
                        <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
                        <h2>{isSignUp ? 'Sign up to start your Job Journey.' : 'Log in to continue your Job Journey.'}</h2>
                    </div>

                    {successMsg && (
                        <div className="w-full p-3 rounded-xl text-sm font-medium text-center border bg-green-50 border-green-200 text-green-600">
                            {successMsg}
                        </div>
                    )}

                    {displayError && !successMsg && (
                        <div className="w-full p-3 rounded-xl text-sm font-medium text-center border bg-red-50 border-red-200 text-red-600">
                            {displayError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <div className="form-div">
                            <label htmlFor="auth-email">Email</label>
                            <input
                                type="email"
                                id="auth-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-div">
                            <label htmlFor="auth-password">Password</label>
                            <input
                                type="password"
                                id="auth-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete={isSignUp ? "new-password" : "current-password"}
                                minLength={6}
                            />
                        </div>

                        {isSignUp && (
                            <div className="form-div">
                                <label htmlFor="auth-confirm-password">Confirm Password</label>
                                <input
                                    type="password"
                                    id="auth-confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="new-password"
                                    minLength={6}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className='auth-button mt-2'
                            disabled={isLoading}
                        >
                            {isLoading
                                ? (isSignUp ? 'Creating account...' : 'Signing in...')
                                : (isSignUp ? 'Sign Up' : 'Sign In')
                            }
                        </button>
                    </form>

                    <div className="text-sm text-slate-500">
                        {isSignUp ? (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={() => { setIsSignUp(false); setLocalError(''); setSuccessMsg(''); clearError(); }}
                                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                                >
                                    Sign In
                                </button>
                            </>
                        ) : (
                            <>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => { setIsSignUp(true); setLocalError(''); setSuccessMsg(''); clearError(); }}
                                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth