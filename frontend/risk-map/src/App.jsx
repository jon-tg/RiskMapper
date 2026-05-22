import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const scanVulnerability = async (ip) => {
    try {
      console.log("Trying");

      const response = await fetch("http://127.0.0.1:8000/scan/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({target: ip}),
      });

      console.log("API Hit");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return { error: error.message };
    }
  };

  const handleSubmit = async (e) => {
    console.log("Submitted");
    e.preventDefault();
    if (!ip.trim()) return;

    setLoading(true);
    setResult(null);

    const data = await scanVulnerability(ip.trim());
    setResult(data);
    setLoading(false);
  };

  return (
    <>
      <section id="homepage">
        <div class="flex flex-col ml-[20vw] w-[60%] h-[30vh]">
          <div class='mt-[5vh]'>
          <h1 id='title' class='text-[55px] '>Risk Mapper</h1>
        </div>
          <div class='border-t-[2px] '>
            <form id='ip-form' class='mt-[2vh] text-[30px]' onSubmit={handleSubmit}>
              <div className='flex-col'>
                <div class='mb-[-.5vh]'>
                <label for='ip' >Target IP: </label>
                <input
                  id="ip"
                  type="text"
                  name="text"
                  className=" gray-input pl-4 w-[170px] text-[30px] h-[40px] rounded-[200px]"
                  value={ip}
                onChange={(e) => setIp(e.target.value)}/>
                </div>
              <button type='submit' class='ml-[5vw] tracking-[2px] text-[30px]'>Submit</button>
              </div>
            </form>
          </div>
          

      </div>
      </section>
    </>
  )
}

export default App
