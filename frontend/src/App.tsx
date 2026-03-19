import  { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import JournalEntry from './pages/JournalEntry';
import GeneralLedger from './pages/GeneralLedger';

const navItems = [
  { path: '/', label: 'DASHBOARD' },
  { path: '/journal', label: 'JOURNAL ENTRY' },
  { path: '/ledger', label: 'GENERAL LEDGER' },
];

export default function App() {
  return (
    <BrowserRouter>
      <div className='flex h-screen overflow-hidden bg-terminal-bg text-terminal-text font-mono'>
        <aside className='w-52 border-r border-terminal-border flex flex-col p-4 skrink-0'>
          <div className='mb-8'>
            <p className='text-terminal-green text-xs tracking-widest'>THE LEDGER</p>
            <p className='text-terminal-muted text-xs'>v1.0.0</p>
          </div>
          <nav className='space-y-1'>
            {navItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) => 
                  `block text-xs px-3 py-2 rounded transotions-colors ${
                    isActive
                      ? 'bg-terminal-surface text-terminal-green border-1-2 border-terminal-green'
                      : 'text-terminal-muted hover:text-terminal-text'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className='flex-1 overflow-y-auto'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/journal' element={<JournalEntry />} />
            <Route path='/ledger' element={<GeneralLedger />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}