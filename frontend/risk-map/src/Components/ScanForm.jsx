import { useState } from 'react';
import ScanResults from "./ScanResults.jsx";
import "../App.css";

export default function ScanForm() {
  const [ip, setIp] = useState("");
  const [count, setCount] = useState(0);
  const [result, setResult] = useState(null);
  const [results, setResults] = useState([]);

  const scanVulnerability = async (ip) => {
    try {
      console.log("Trying");

      const response = await fetch(`http://localhost:8000/scan/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: ip }),
      });

      console.log("API Hit");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);

      setResults(data);
      return data;

    } catch (error) {
      return { error: error.message };
    }
  };

  const handleSubmit = async (e) => {
    console.log("Submitted");

    e.preventDefault();

    if (!ip.trim()) return;

    setCount(0);

    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    try {
      const data = await scanVulnerability(ip.trim());
      setResults(data);

    } catch (error) {
      console.error(error);

    } finally {
      clearInterval(timer);
    }
  };

  return (
    <>
      <div className="border-t-[2px] text-[25px]">
        <form
          id="ip-form"
          className="mt-[2vh] w-[60%]"
          onSubmit={handleSubmit}
        >
          <div className="flex-col">
            <div className="mb-[1vh]">
              <label htmlFor="ip">Target IP: </label>

              <input
                id="ip"
                type="text"
                name="text"
                className="gray-input pl-4 w-[180px] h-[35px] rounded-[200px]"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
              />
            </div>

            <div className="w-[290px] h-[30px] flex flex-col justify-center submit-button bg-gray-200 border border-black">
              <button
                type="submit"
                className="tracking-[2px]"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>

      <div id="scan-results" className="text-[25px] mt-[1vh] w-[65vw]">
        <h1>
          Results: (Time Elapsed: {count}s)
        </h1>

        <ScanResults results={results} />
      </div>
    </>
  );
}