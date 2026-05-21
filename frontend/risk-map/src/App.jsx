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
      const response = await fetch("http://localhost:8000/scan/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ip }),
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
      <section id="center">
        <div class="flex flex-col w-[100%] h-[80vh] justify-center ">
          <div class=''>
          <h1 id='title' class=' text-[100px] text-center'>Risk Mapper</h1>
          </div>
          <div>
            <form id='ip-form' class='text-center text-[30px]' onSubmit={handleSubmit}>
              <label for='ip' >Target IP: </label>
              <input
                id="ip"
                type="text"
                name="text"
                className="border border-red-800 pl-4 w-[170px] rounded-[200px]"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
            />
              <br/><br/>
              <button type='submit' class='border'>Submit</button>
            </form>
          </div>
          

      </div>
      </section>
    </>
  )
}

export default App
