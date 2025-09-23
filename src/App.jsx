import './App.css'
import CanvasComponent from './components/CanvasComponent'
import AnimPlayer from './components/AnimPlayer'
import SidePanel from './components/SidePanel'
import AbsoluteButtons from './components/AbsoluteButtons'
import Slider from './components/Slider'

function App() {

  return (
    <>
      <div className='main-container'>
        <CanvasComponent/>
        <AnimPlayer/>
      </div>
      <Slider/>
      <SidePanel/>
      <AbsoluteButtons/>
    </>
  )
}

export default App
