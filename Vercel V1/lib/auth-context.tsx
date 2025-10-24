"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loginWithAuth0: () => void
  updateUserName: (name: string) => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => false,
  logout: () => {},
  loginWithAuth0: () => {},
  updateUserName: () => {},
})

// Student database from the provided data
const studentDatabase = [
  { id: "23P61A6701", name: "A ABHIRAM REDDY", email: "23p61a6701@vbithyd.ac.in" },
  { id: "23P61A6702", name: "ABDUL AKMAL ALLAM", email: "23p61a6702@vbithyd.ac.in" },
  { id: "23P61A6703", name: "ABHIJEET OZA", email: "23p61a6703@vbithyd.ac.in" },
  { id: "23P61A6704", name: "ADAMA KOUSHIK REDDY", email: "23p61a6704@vbithyd.ac.in" },
  { id: "23P61A6705", name: "ADELLI GANAPATHI", email: "23p61a6705@vbithyd.ac.in" },
  { id: "23P61A6706", name: "ADIDALA NIDVITHA", email: "23p61a6706@vbithyd.ac.in" },
  { id: "23P61A6707", name: "AKKINEPALLY VIJAY KUMAR", email: "23p61a6707@vbithyd.ac.in" },
  { id: "23P61A6708", name: "ALLAKA HAINDHAVI", email: "23p61a6708@vbithyd.ac.in" },
  { id: "23P61A6709", name: "ALLURI KIRAN", email: "23p61a6709@vbithyd.ac.in" },
  { id: "23P61A6710", name: "AMBATI SAIKARTHIK", email: "23p61a6710@vbithyd.ac.in" },
  { id: "23P61A6711", name: "AMGOTH MANISHA", email: "23p61a6711@vbithyd.ac.in" },
  { id: "23P61A6712", name: "AMIRISHETTI RAJESH", email: "23p61a6712@vbithyd.ac.in" },
  { id: "23P61A6713", name: "ANKITH GOUD PANUGATLA", email: "23p61a6713@vbithyd.ac.in" },
  { id: "23P61A6714", name: "ARRA MANICHANDU", email: "23p61a6714@vbithyd.ac.in" },
  { id: "23P61A6715", name: "ARUTLA SOWMYA", email: "23p61a6715@vbithyd.ac.in" },
  { id: "23P61A6716", name: "ARVAPALLI SAI GANESH", email: "23p61a6716@vbithyd.ac.in" },
  { id: "23P61A6717", name: "AVULA ANIL", email: "23p61a6717@vbithyd.ac.in" },
  { id: "23P61A6718", name: "B V PRANAV TEJ", email: "23p61a6718@vbithyd.ac.in" },
  { id: "23P61A6719", name: "BADAMI AMARNATH", email: "23p61a6719@vbithyd.ac.in" },
  { id: "23P61A6720", name: "BADDAM HARSHITH REDDY", email: "23p61a6720@vbithyd.ac.in" },
  { id: "23P61A6721", name: "BADDAM LATHIKA", email: "23p61a6721@vbithyd.ac.in" },
  { id: "23P61A6722", name: "BAMANI GANGOTHRI", email: "23p61a6722@vbithyd.ac.in" },
  { id: "23P61A6723", name: "BANJA NIPUNDHAR", email: "23p61a6723@vbithyd.ac.in" },
  { id: "23P61A6724", name: "BANOTHU NANDU", email: "23p61a6724@vbithyd.ac.in" },
  { id: "23P61A6725", name: "BASANGARI VAMSHIKRISHNA", email: "23p61a6725@vbithyd.ac.in" },
  { id: "23P61A6726", name: "BATTU BINDU", email: "23p61a6726@vbithyd.ac.in" },
  { id: "23P61A6727", name: "BATTU HEMANTH", email: "23p61a6727@vbithyd.ac.in" },
  { id: "23P61A6728", name: "BATTULA DEEPTHI PRIYA", email: "23p61a6728@vbithyd.ac.in" },
  { id: "23P61A6729", name: "BH SAI SURYA SRAVANI KRISHNA PRIYA", email: "23p61a6729@vbithyd.ac.in" },
  { id: "23P61A6730", name: "BHUKYA HARIDAS", email: "23p61a6730@vbithyd.ac.in" },
  { id: "23P61A6731", name: "BHUKYA SUNITHA", email: "23p61a6731@vbithyd.ac.in" },
  { id: "23P61A6732", name: "BODA ASMITHA SRI", email: "23p61a6732@vbithyd.ac.in" },
  { id: "23P61A6733", name: "BOGAPURAPU ANJALI", email: "23p61a6733@vbithyd.ac.in" },
  { id: "23P61A6734", name: "BOLLIKONDA PRAVALLIKA", email: "23p61a6734@vbithyd.ac.in" },
  { id: "23P61A6735", name: "BONGURAM ASHRITHA", email: "23p61a6735@vbithyd.ac.in" },
  { id: "23P61A6736", name: "BURRI ASHWINI", email: "23p61a6736@vbithyd.ac.in" },
  { id: "23P61A6737", name: "CHADALA AKSHAY", email: "23p61a6737@vbithyd.ac.in" },
  { id: "23P61A6738", name: "CHAMAKURI BRAHMANI", email: "23p61a6738@vbithyd.ac.in" },
  { id: "23P61A6739", name: "CHEDHULURI SHARAN RAJU", email: "23p61a6739@vbithyd.ac.in" },
  { id: "23P61A6740", name: "CHENNURI SRINITH", email: "23p61a6740@vbithyd.ac.in" },
  { id: "23P61A6741", name: "CHILUKURI RUDRA RAJU", email: "23p61a6741@vbithyd.ac.in" },
  { id: "23P61A6742", name: "CHIRIVELLA ABHINAYA", email: "23p61a6742@vbithyd.ac.in" },
  { id: "23P61A6743", name: "DACHEPALLY ROHITH", email: "23p61a6743@vbithyd.ac.in" },
  { id: "23P61A6744", name: "DANDEBOINA SHIRISHA", email: "23p61a6744@vbithyd.ac.in" },
  { id: "23P61A6745", name: "DANTHAMALA GOPI CHANDU", email: "23p61a6745@vbithyd.ac.in" },
  { id: "23P61A6746", name: "", email: "23p61a6746@vbithyd.ac.in" },
  { id: "23P61A6747", name: "DASARI HARSHAVARDHAN", email: "23p61a6747@vbithyd.ac.in" },
  { id: "23P61A6748", name: "DASU TEJASHWINI", email: "23p61a6748@vbithyd.ac.in" },
  { id: "23P61A6749", name: "DODLA VAMSHI KRISHNA", email: "23p61a6749@vbithyd.ac.in" },
  { id: "23P61A6750", name: "DOLI ABHINAVA SAI", email: "23p61a6750@vbithyd.ac.in" },
  { id: "24P65A6701", name: "ADIMULAM VINAY", email: "24p65a6701@vbithyd.ac.in" },
  { id: "24P65A6702", name: "AGRARAM KEERTHANA", email: "24p65a6702@vbithyd.ac.in" },
  { id: "24P65A6703", name: "NITHIN", email: "24p65a6703@vbithyd.ac.in" },
  { id: "24P65A6704", name: "ROHITH NAYAK", email: "24p65a6704@vbithyd.ac.in" },
  { id: "24P65A6705", name: "VAMSHI KRISHNA", email: "24p65a6705@vbithyd.ac.in" },
  { id: "24P65A6706", name: "GANJI ABHISHEK", email: "24p65a6706@vbithyd.ac.in" },
  { id: "24P65A6707", name: "GUDUGUNTLA KEERTHANA", email: "24p65a6707@vbithyd.ac.in" },
  { id: "24P65A6708", name: "JANGA KARTHIK YADAV", email: "24p65a6708@vbithyd.ac.in" },
  // Tester account
  { id: "TESTER", name: "Tester", email: "tester@tester.com" },
]

// Default password as fallback
const DEFAULT_PASSWORD = "123456"

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0()

  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [tempUserEmail, setTempUserEmail] = useState("")
  const [tempUserName, setTempUserName] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated with Auth0
    if (!auth0IsLoading) {
      if (auth0IsAuthenticated && auth0User) {
        setUser(auth0User)
        localStorage.setItem("user", JSON.stringify(auth0User))

        // If user just logged in with Auth0, redirect to chat
        const isRedirecting = sessionStorage.getItem("auth0Redirecting")
        if (isRedirecting) {
          sessionStorage.removeItem("auth0Redirecting")

          // Add a small delay to ensure proper loading
          setTimeout(() => {
            router.push("/chat")
            toast({
              title: "Login successful",
              description: `Welcome to Mio AI, ${auth0User.name || auth0User.email}!`,
            })
          }, 500)
        }
      } else {
        // Check if we have a user in localStorage (for non-Auth0 login)
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      }
      setIsLoading(false)
    }
  }, [auth0IsAuthenticated, auth0IsLoading, auth0User, router, toast])

  const login = async (email: string, password: string) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address")
      }

      // Find student in database
      const student = studentDatabase.find((s) => s.email.toLowerCase() === email.toLowerCase())

      // For testing purposes, allow login with any email and password "123456"
      if (password === DEFAULT_PASSWORD) {
        const userObj: any = {
          id: student?.id || `user-${Date.now()}`,
          name: student?.name || email.split("@")[0],
          email: email,
          picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || "User")}&background=random`,
        }

        setUser(userObj)
        localStorage.setItem("user", JSON.stringify(userObj))
        return true
      } else {
        throw new Error(`Invalid credentials. Your password is "${DEFAULT_PASSWORD}".`)
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const updateUserName = (name: string) => {
    if (!tempUserEmail) return

    // Find the student
    const student = studentDatabase.find((s) => s.email.toLowerCase() === tempUserEmail.toLowerCase())

    if (student) {
      const userObj = {
        id: student.id,
        name: name,
        email: student.email,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      }

      setUser(userObj)
      localStorage.setItem("user", JSON.stringify(userObj))
      setShowNameDialog(false)
      setTempUserEmail("")
      setTempUserName("")

      // Redirect to chat with a small delay to ensure proper state update
      setTimeout(() => {
        router.push("/chat")

        // Welcome toast
        toast({
          title: "Welcome to Mio AI",
          description: `Hello, ${name}! Your profile has been updated.`,
        })
      }, 300)
    }
  }

  const logout = () => {
    if (auth0IsAuthenticated) {
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      })
    } else {
      setUser(null)
      localStorage.removeItem("user")
      router.push("/")
    }
  }

  const loginWithAuth0 = () => {
    sessionStorage.setItem("auth0Redirecting", "true")
    loginWithRedirect({
      appState: { returnTo: "/chat" },
      authorizationParams: {
        redirect_uri: `${typeof window !== "undefined" ? window.location.origin : ""}/callback`,
      },
    })
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        login,
        logout,
        loginWithAuth0,
        updateUserName,
      }}
    >
      {children}

      {/* Name Input Dialog */}
      <Dialog open={showNameDialog} onOpenChange={(open) => !open && setShowNameDialog(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to Mio AI</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Please enter your name to complete your profile:</p>
            <Input
              value={tempUserName}
              onChange={(e) => setTempUserName(e.target.value)}
              placeholder="Your name"
              className="mb-2"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button onClick={() => updateUserName(tempUserName || "User")} disabled={!tempUserName.trim()}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const getApiKey = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("gemini-api-key")
}
