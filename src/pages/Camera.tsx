import { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
import './Camera.css'

function Camera() {
  const navigate = useNavigate()
  const webcamRef = useRef<Webcam>(null)
  const [detectedObject, setDetectedObject] = useState<string>('')
  const [isDetecting, setIsDetecting] = useState(false)

  const simulateObjectDetection = useCallback(() => {
    setIsDetecting(true)
    
    setTimeout(() => {
      const objects = ['コーヒーカップ', 'ノート', 'ペン', 'スマートフォン', '本', '時計']
      const randomObject = objects[Math.floor(Math.random() * objects.length)]
      setDetectedObject(randomObject)
      setIsDetecting(false)
    }, 2000)
  }, [])

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      simulateObjectDetection()
    }
  }, [simulateObjectDetection])

  const handleMemoRegister = () => {
    navigate('/register', { 
      state: { 
        objectName: detectedObject,
        capturedImage: webcamRef.current?.getScreenshot()
      } 
    })
  }

  const handleObjectClick = () => {
    if (detectedObject) {
      const existingMemo = Math.random() > 0.5
      if (existingMemo) {
        navigate(`/memo/${detectedObject}`)
      } else {
        handleMemoRegister()
      }
    }
  }

  return (
    <div className="camera-container">
      <div className="camera-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 戻る
        </button>
        <h2>カメラをかざす</h2>
      </div>

      <div className="camera-view">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="webcam"
          videoConstraints={{
            facingMode: { ideal: "environment" }
          }}
        />
        
        {detectedObject && (
          <div className="detection-overlay" onClick={handleObjectClick}>
            <div className="detection-box">
              <div className="detection-label">
                {detectedObject}
              </div>
              <div className="detection-hint">
                タップしてメモを確認・登録
              </div>
            </div>
          </div>
        )}

        {isDetecting && (
          <div className="detecting-overlay">
            <div className="detecting-spinner"></div>
            <div className="detecting-text">物体を検出中...</div>
          </div>
        )}
      </div>

      <div className="camera-controls">
        <button 
          className="capture-button"
          onClick={handleCapture}
          disabled={isDetecting}
        >
          📷 撮影して検出
        </button>
        
        <button 
          className="register-button"
          onClick={handleMemoRegister}
        >
          📝 メモ登録画面へ
        </button>
      </div>
    </div>
  )
}

export default Camera