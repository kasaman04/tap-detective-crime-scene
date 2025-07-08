export interface Memo {
  id: string
  objectId: string
  objectName: string
  text: string
  image?: string
  audio?: string
  location?: {
    lat: number
    lng: number
  }
  createdAt: Date
  completed: boolean
}

export interface RecentObject {
  id: string
  name: string
  lastMemoExcerpt: string
  lastAccessedAt: Date
}