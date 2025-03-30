import { NavLink } from 'react-router-dom'
import {
  Home,
  LayoutDashboard, 
  Database, 
  Users, 
  Bell, 
  Settings as SettingsIcon,
  Search,
  LogOut,
  ChevronUp
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const CollapsibleNav = ({ isCollapsed, menuItems }) => {
  return (
    <div className={`flex items-center gap-2 transition-all duration-300 ${
      isCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'
    }`}>
      {menuItems.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => (
            `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-black/5 text-black font-medium' 
              : 'text-black/70 hover:text-black'
            }`
          )}
        >
          {({ isActive }) => (
            <>
              <Icon size={20} className={isActive ? 'text-black' : 'text-black/70'} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}

const UserButton = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center text-black hover:bg-black/10 transition"
      >
        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
      </button>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl z-20">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              <div className="font-medium">{user.user_metadata?.full_name || 'Utilisateur'}</div>
              <div className="text-gray-500 text-xs truncate">{user.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <LogOut size={16} />
              Se déconnecter
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const menuItems = [
  { path: '/', label: 'Accueil', icon: Home },
  { path: '/feeds', label: 'Mes Feeds', icon: LayoutDashboard },
  { path: '/sources', label: 'Mes Refs', icon: Database },
  // { path: '/collaborations', label: 'Collaborations', icon: Users },
  // { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/settings', label: 'Paramètres', icon: SettingsIcon },
]

function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)
  const [isCollapsed, setIsCollapsed] = useState(true)
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  return (
    <nav className={`bg-white border-b px-6 transition-all duration-300 ${
      isCollapsed ? 'py-2' : 'py-4'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-black">News Age</h1>
          <CollapsibleNav isCollapsed={isCollapsed} menuItems={menuItems} />
        </div>
        <div className="flex items-center gap-4">
          {user && <UserButton user={user} />}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-full hover:bg-black/5 text-black/70 hover:text-black transition-all duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          >
            <ChevronUp size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Sidebar