import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Memo } from '../types'
import './MemoDisplay.css'

function MemoDisplay() {
  const navigate = useNavigate()
  const { objectId } = useParams()
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const [memo, setMemo] = useState<Memo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState('')

  useEffect(() => {
    const memos = JSON.parse(localStorage.getItem('memos') || '[]')
    const foundMemo = memos.find((m: Memo) => 
      m.id === objectId || m.objectName === objectId
    )
    
    if (foundMemo) {
      setMemo(foundMemo)
      setEditedText(foundMemo.text)
    } else {
      const mockMemo: Memo = {
        id: objectId || '1',
        objectId: objectId || '1',
        objectName: 'コーヒーカップ',
        text: '彼女にもらったお気に入りのカップ。朝のコーヒータイムに使ってる。',
        image: '',
        audio: '',
        location: { lat: 35.6812, lng: 139.7671 },
        createdAt: new Date('2024-01-20'),
        completed: false
      }
      setMemo(mockMemo)
      setEditedText(mockMemo.text)
    }
  }, [objectId])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (memo) {
      const updatedMemo = { ...memo, text: editedText }
      const memos = JSON.parse(localStorage.getItem('memos') || '[]')
      const index = memos.findIndex((m: Memo) => m.id === memo.id)
      
      if (index !== -1) {
        memos[index] = updatedMemo
      } else {
        memos.push(updatedMemo)
      }
      
      localStorage.setItem('memos', JSON.stringify(memos))
      setMemo(updatedMemo)
      setIsEditing(false)
    }
  }

  const handleComplete = () => {
    if (memo) {
      const updatedMemo = { ...memo, completed: !memo.completed }
      const memos = JSON.parse(localStorage.getItem('memos') || '[]')
      const index = memos.findIndex((m: Memo) => m.id === memo.id)
      
      if (index !== -1) {
        memos[index] = updatedMemo
        localStorage.setItem('memos', JSON.stringify(memos))
        setMemo(updatedMemo)
      }
    }
  }

  const handleShare = () => {
    if (memo) {
      const shareUrl = `${window.location.origin}/shared/${memo.id}`
      navigator.clipboard.writeText(shareUrl)
      alert('シェアリンクをコピーしました！')
    }
  }

  if (!memo) {
    return <div>Loading...</div>
  }

  return (
    <div className="memo-display-container">
      <div className="memo-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 戻る
        </button>
        <h2>{memo.objectName}のメモ</h2>
      </div>

      <div className="memo-content">
        <div className="memo-section">
          <h3>メモ</h3>
          {isEditing ? (
            <div className="edit-area">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={4}
              />
              <div className="edit-buttons">
                <button onClick={handleSave} className="save-edit-button">
                  保存
                </button>
                <button onClick={() => setIsEditing(false)} className="cancel-button">
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div className={`memo-text ${memo.completed ? 'completed' : ''}`}>
              {memo.text}
            </div>
          )}
        </div>

        {memo.image && (
          <div className="memo-section">
            <h3>写真</h3>
            <div className="memo-image">
              <img src={memo.image} alt="メモの画像" />
            </div>
          </div>
        )}

        {memo.audio && (
          <div className="memo-section">
            <h3>音声</h3>
            <audio ref={audioRef} src={memo.audio} controls />
          </div>
        )}

        {memo.location && (
          <div className="memo-section">
            <h3>場所</h3>
            <div className="location-map">
              📍 緯度: {memo.location.lat.toFixed(6)}, 経度: {memo.location.lng.toFixed(6)}
              <div className="map-placeholder">
                地図表示エリア（Google Maps APIが必要）
              </div>
            </div>
          </div>
        )}

        <div className="memo-meta">
          作成日: {new Date(memo.createdAt).toLocaleDateString('ja-JP')}
        </div>

        <div className="action-buttons">
          <button onClick={handleEdit} className="edit-button">
            ✏️ 編集
          </button>
          <button 
            onClick={handleComplete} 
            className={`complete-button ${memo.completed ? 'completed' : ''}`}
          >
            {memo.completed ? '✅ 完了済み' : '⭕ 完了にする'}
          </button>
          <button onClick={handleShare} className="share-button">
            🔗 シェアリンクを作成
          </button>
        </div>
      </div>
    </div>
  )
}

export default MemoDisplay