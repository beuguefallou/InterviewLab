'use client'

import { useState } from 'react'
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { logout } from '@/lib/actions/auth.action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { auth } from '@/firebase/client'
import { signOut } from 'firebase/auth'

const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      
      // Sign out from Firebase
      await signOut(auth)
      
      // Clear server-side session
      const result = await logout()
      
      if (!result.success) {
        toast.error('Logout failed')
        return
      }
      
      toast.success('Logged out successfully')
      router.push('/sign-in')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      className="flex items-center gap-2 hover:bg-destructive-100 hover:text-white transition-colors" 
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut size={18} />
      <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
    </Button>
  )
}

export default LogoutButton