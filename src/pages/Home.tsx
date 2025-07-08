import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { RecentObject } from '../types'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [recentObjects, setRecentObjects] = useState<RecentObject[]>([])

  useEffect(() => {
    const mockData: RecentObject[] = [
      {
        id: '1',
        name: 'コーヒーカップ',
        lastMemoExcerpt: '彼女にもらったお気に入り',
        lastAccessedAt: new Date('2024-01-20')
      },
      {
        id: '2', 
        name: '家の鍵',
        lastMemoExcerpt: '玄関の棚の上に置く',
        lastAccessedAt: new Date('2024-01-19')
      },
      {
        id: '3',
        name: 'ノート',
        lastMemoExcerpt: '会議のメモはここに',
        lastAccessedAt: new Date('2024-01-18')
      }
    ]
    setRecentObjects(mockData)
  }, [])

  const handleCameraClick = () => {
    navigate('/camera')
  }

  const handleObjectClick = (objectId: string) => {
    navigate(`/memo/${objectId}`)
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>メモるんです。</h1>
        <p className="tagline">しょーもないけど、ちょっと便利。</p>
      </header>

      <main className="home-main">
        <button 
          className="camera-button"
          onClick={handleCameraClick}
        >
          📷 カメラをかざす
        </button>

        <section className="recent-objects">
          <h2>最近かざした物体</h2>
          <ul className="object-list">
            {recentObjects.map((obj) => (
              <li 
                key={obj.id}
                className="object-item"
                onClick={() => handleObjectClick(obj.id)}
              >
                <div className="object-name">{obj.name}</div>
                <div className="object-memo">{obj.lastMemoExcerpt}</div>
                <div className="object-date">
                  {obj.lastAccessedAt.toLocaleDateString('ja-JP')}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default Home