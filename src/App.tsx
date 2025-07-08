import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Camera from './pages/Camera'
import RegisterMemo from './pages/RegisterMemo'
import MemoDisplay from './pages/MemoDisplay'
import SharedMemo from './pages/SharedMemo'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/register" element={<RegisterMemo />} />
        <Route path="/memo/:objectId" element={<MemoDisplay />} />
        <Route path="/shared/:memoId" element={<SharedMemo />} />
      </Routes>
    </Router>
  )
}

export default App