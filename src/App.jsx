import './App.css'
import CanvasComponent from './components/CanvasComponent'
import AnimPlayer from './components/AnimPlayer'
import SidePanel from './components/SidePanel'
import AbsoluteButtons from './components/AbsoluteButtons'

function App() {

  return (
    <>
      <div id='flex-comp'>
        <CanvasComponent/>
        <AnimPlayer/>
      </div>
      <SidePanel/>
      <AbsoluteButtons/>
    </>
  )
}

export default App
