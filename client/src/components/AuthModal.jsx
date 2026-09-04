import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Lock,
  Mail,
  User,
  GraduationCap,
  Shield,
  Building,
  KeyRound,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onQuickDemoLogin,
  demoAccounts = []
}) {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'demo'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    student_id: '',
    password: '',
    department: 'Department of CSE'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onRegister(regData);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Department of CSE',
    'Department of EEE',
    'Department of Software Engineering',
    'Department of Business Administration',
    'Department of Pharmacy',
    'Department of Architecture'
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="modal-container auth-modal-container"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <Lock size={18} className="text-lime" />
            </div>
            <div>
              <h2>CAMPUS PULSE PORTAL ACCESS</h2>
              <p>Sign in to lodge formal objections, endorse petitions & track SLAs</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="auth-tab-bar">
          <button
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Student Register
          </button>
          <button
            className={`auth-tab-btn tab-demo ${mode === 'demo' ? 'active' : ''}`}
            onClick={() => { setMode('demo'); setError(''); }}
          >
            <Sparkles size={12} className="text-lime" />
            <span>1-Click Demo Accounts</span>
          </button>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="modal-form">
            <div className="form-group">
              <label>University Email (DIU Email)</label>
              <div className="input-with-icon">
                <Mail size={14} className="text-dim" />
                <input
                  type="email"
                  required
                  placeholder="student@diu.edu.bd or admin@diu.edu.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <KeyRound size={14} className="text-dim" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary full" disabled={loading}>
              <span>{loading ? 'Authenticating...' : 'Secure Sign In'}</span>
              <ArrowRight size={14} />
            </button>

            <div className="auth-switch-hint">
              <span>Need a demo account for instant testing?</span>
              <button type="button" onClick={() => setMode('demo')}>
                Open 1-Click Demo Accounts →
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTRATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="modal-form">
            <div className="form-group">
              <label>Full Name *</label>
              <div className="input-with-icon">
                <User size={14} className="text-dim" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Shreya Golder"
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Student ID *</label>
                <div className="input-with-icon">
                  <GraduationCap size={14} className="text-dim" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 251-15-467"
                    value={regData.student_id}
                    onChange={(e) => setRegData({ ...regData, student_id: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Academic Department</label>
                <select
                  value={regData.department}
                  onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>University Email *</label>
              <div className="input-with-icon">
                <Mail size={14} className="text-dim" />
                <input
                  type="email"
                  required
                  placeholder="name@diu.edu.bd"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password (min 6 characters) *</label>
              <div className="input-with-icon">
                <KeyRound size={14} className="text-dim" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary full" disabled={loading}>
              <span>{loading ? 'Creating Student Account...' : 'Register & Access Portal'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {/* 3. 1-CLICK DEMO ACCOUNTS */}
        {mode === 'demo' && (
          <div className="demo-accounts-list">
            <p className="demo-list-hint">
              Select any verified campus role below for instant presentation and grading demo:
            </p>

            {demoAccounts.map((account) => (
              <div
                key={account.email}
                className="demo-account-card"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await onQuickDemoLogin(account.email, account.password);
                    onClose();
                  } catch (err) {
                    setError('Demo login failed');
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div className="demo-card-top">
                  <span className={`role-badge ${account.role === 'admin' ? 'role-admin' : account.role === 'staff' ? 'role-staff' : 'role-student'}`}>
                    {account.label}
                  </span>
                  <span className="demo-id-tag">{account.student_id}</span>
                </div>

                <div className="demo-name-line">
                  <strong>{account.name}</strong>
                  <span className="demo-dept">{account.department}</span>
                </div>

                <p className="demo-desc">{account.description}</p>

                <div className="demo-click-action">
                  <span>Sign in as {account.name.split(' ')[0]}</span>
                  <ArrowRight size={13} className="text-lime" />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
