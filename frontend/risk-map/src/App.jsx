import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ScanForm from "./Components/ScanForm.jsx"

function App() {
  return (
    <>
      <section id="homepage" className="min-h-screen flex flex-col">
        <div className="flex flex-col page ml-[20vw] w-[60%]">

          <div className="mt-[5vh]">
            <h1 id="title" className="text-[45px]">
              Risk Mapper
            </h1>
          </div>

          <div className="w-[60vw]">
            <ScanForm />
          </div>
          
        </div>
      </section>
    </>
  )
}

export default App