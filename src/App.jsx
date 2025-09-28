import './App.css'
import CanvasComponent from './components/CanvasComponent'
import AnimPlayer from './components/AnimPlayer'
import SidePanel from './components/SidePanel'
import AbsoluteButtons from './components/AbsoluteButtons'
import Slider from './components/Slider'
import { ContextProvider } from './context API/ContextProvider'

function App() {

  return (
    <>
      <ContextProvider>
        <div className='main-container'>
          <CanvasComponent />
          <AnimPlayer />
        </div>
        {/* <Slider /> */}
        <SidePanel />
        <AbsoluteButtons />
      </ContextProvider>
    </>
  )
}

export default App
