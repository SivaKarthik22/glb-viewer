import './App.css'
import CanvasComponent from './components/CanvasComponent'
import AnimPlayer from './components/AnimPlayer'
import SidePanel from './components/SidePanel'
import AbsoluteButtons from './components/AbsoluteButtons'
//import Slider from './components/Slider'
import { ContextProvider } from './context API/ContextProvider'
import Toaster from './components/Toaster'
import HomePage from './components/HomePage'

function App() {

  return (
    <>
      <ContextProvider>
        <div className='main-container'>
          <div className="canvas-container">
            <CanvasComponent />
            <HomePage/>
          </div>
          <AnimPlayer />
        </div>
        {/* <Slider /> */}
        <SidePanel />
        <AbsoluteButtons />
        <Toaster/>
      </ContextProvider>
    </>
  )
}

export default App
