export interface UserSession {
  id: string
  name: string
  email: string
  loginTime: string
  isTester: boolean
}

class AnalyticsStore {
  private sessions: UserSession[] = []

  addSession(session: UserSession) {
    this.sessions.push(session)
  }

  getSessions(): UserSession[] {
    return this.sessions
  }

  clearSessions() {
    this.sessions = []
  }
}

export const analyticsStore = new AnalyticsStore()
