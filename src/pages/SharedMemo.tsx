import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Memo } from '../types'
import './SharedMemo.css'

function SharedMemo() {
  const { memoId } = useParams()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [memo, setMemo] = useState<Memo | null>(null)

  useEffect(() => {
    const memos = JSON.parse(localStorage.getItem('memos') || '[]')
    const foundMemo = memos.find((m: Memo) => m.id === memoId)
    
    if (foundMemo) {
      setMemo(foundMemo)
    } else {
      const mockMemo: Memo = {
        id: memoId || '1',
        objectId: '1',
        objectName: 'プレゼントの箱',
        text: '誕生日にもらった特別なプレゼント。大切に保管しています。',
        image: '',
        audio: '',
        location: { lat: 35.6812, lng: 139.7671 },
        createdAt: new Date('2024-01-15'),
        completed: false
      }
      setMemo(mockMemo)
    }
  }, [memoId])

  if (!memo) {
    return (
      <div className="shared-loading">
        <div className="loading-spinner"></div>
        <p>メモを読み込んでいます...</p>
      </div>
    )
  }

  return (
    <div className="shared-memo-container">
      <div className="shared-header">
        <h1>しょーもモリー</h1>
        <p className="shared-subtitle">シェアされたメモ</p>
      </div>

      <div className="shared-content">
        <div className="shared-object-info">
          <h2>{memo.objectName}</h2>
          <div className="shared-date">
            {new Date(memo.createdAt).toLocaleDateString('ja-JP')} に作成
          </div>
        </div>

        <div className="shared-section">
          <h3>📝 メモ</h3>
          <div className="shared-text">
            {memo.text}
          </div>
        </div>

        {memo.image && (
          <div className="shared-section">
            <h3>📷 写真</h3>
            <div className="shared-image">
              <img src={memo.image} alt="メモの画像" />
            </div>
          </div>
        )}

        {memo.audio && (
          <div className="shared-section">
            <h3>🎤 音声</h3>
            <audio ref={audioRef} src={memo.audio} controls />
          </div>
        )}

        {memo.location && (
          <div className="shared-section">
            <h3>📍 位置情報</h3>
            <div className="shared-location">
              緯度: {memo.location.lat.toFixed(6)}<br />
              経度: {memo.location.lng.toFixed(6)}
              <div className="map-placeholder">
                地図表示エリア
              </div>
            </div>
          </div>
        )}

        <div className="shared-footer">
          <p className="app-promotion">
            このメモは「しょーもモリー」で作成されました
          </p>
          <p className="app-tagline">
            しょーもないけど、ちょっと便利。
          </p>
        </div>
      </div>
    </div>
  )
}

export default SharedMemo