import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './RegisterMemo.css'

function RegisterMemo() {
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [memoText, setMemoText] = useState('')
  const [memoImage, setMemoImage] = useState<string>('')
  const [memoAudio, setMemoAudio] = useState<string>('')
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  const objectName = location.state?.objectName || '新しい物体'
  const capturedImage = location.state?.capturedImage

  useEffect(() => {
    if (capturedImage) {
      setMemoImage(capturedImage)
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error)
        }
      )
    }
  }, [capturedImage])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMemoImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => {
          setMemoAudio(reader.result as string)
        }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error('音声録音の開始に失敗しました:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const handleSave = () => {
    const memo = {
      id: Date.now().toString(),
      objectName,
      text: memoText,
      image: memoImage,
      audio: memoAudio,
      location: currentLocation,
      createdAt: new Date(),
      completed: false
    }

    const existingMemos = JSON.parse(localStorage.getItem('memos') || '[]')
    existingMemos.push(memo)
    localStorage.setItem('memos', JSON.stringify(existingMemos))

    alert('メモを保存しました！')
    navigate('/')
  }

  return (
    <div className="register-container">
      <div className="register-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <h2>{objectName}のメモを登録</h2>
      </div>

      <div className="register-content">
        <div className="form-group">
          <label>メモ内容</label>
          <textarea
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            placeholder="例：彼女にもらったやつ"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>写真を添付</label>
          <div className="image-upload-area">
            {memoImage ? (
              <div className="image-preview">
                <img src={memoImage} alt="メモ画像" />
                <button 
                  className="remove-image"
                  onClick={() => setMemoImage('')}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button 
                className="upload-button"
                onClick={() => fileInputRef.current?.click()}
              >
                📷 写真を選択
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>音声を録音</label>
          <div className="audio-controls">
            {!memoAudio ? (
              <button
                className={`record-button ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? '⏹ 録音停止' : '🎤 録音開始'}
              </button>
            ) : (
              <div className="audio-preview">
                <audio ref={audioRef} src={memoAudio} controls />
                <button 
                  className="remove-audio"
                  onClick={() => setMemoAudio('')}
                >
                  削除
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>現在位置</label>
          <div className="location-display">
            {currentLocation ? (
              <div className="location-info">
                📍 位置情報を取得しました
                <div className="coordinates">
                  緯度: {currentLocation.lat.toFixed(6)}<br />
                  経度: {currentLocation.lng.toFixed(6)}
                </div>
              </div>
            ) : (
              <div className="location-loading">
                位置情報を取得中...
              </div>
            )}
          </div>
        </div>

        <button 
          className="save-button"
          onClick={handleSave}
          disabled={!memoText.trim()}
        >
          💾 保存
        </button>
      </div>
    </div>
  )
}

export default RegisterMemo