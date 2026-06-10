import { useState } from "react";

export default function ScanResults({ results }) {
  const [revealedPort, setRevealedPort] = useState(null);

  function revealScripts(resultIndex, portIndex) {
    setRevealedPort({ resultIndex, portIndex });
  }

  function unrevealScripts() {
    setRevealedPort(null);
  }

  return (
    <div className="flex flex-wrap justify-center text-[15px] gap-4 mt-[1vh]">
      {results.map((result, index) => {
        const selectedPort =
          revealedPort?.resultIndex === index
            ? result.ports?.[revealedPort.portIndex]
            : null;

        return (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-4 w-full md:w-[48%] mb-[3%] lg:w-[65vw] border border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-2">
              {result.host && (
                <p className="text-center">
                  {result.host}
                  {result.hostnames?.length > 0 &&
                    ` | ${result.hostnames.join(", ")}`}
                </p>
              )}
            </h2>

            {result.os_matches?.length > 0 && (
              <div className="mb-1">
                <strong>OS Matches:</strong>

                {result.os_matches.map((os, osIndex) => (
                  <div key={osIndex} className="ml-2 text-sm text-gray-700">
                    {os.name} ({os.accuracy}%)
                  </div>
                ))}
              </div>
            )}

            <div>
              {result.ports?.length > 0 && <strong>Ports:</strong>}

              <div className="mt-2 flex flex-row flex-wrap gap-2">
                {result.ports.map((port, portIndex) => {
                  const isRevealed =
                    revealedPort?.resultIndex === index &&
                    revealedPort?.portIndex === portIndex;

                  return (
                    <div
                      key={portIndex}
                      className="border w-[150px] rounded-lg p-2 bg-gray-50"
                    >
                      {Object.keys(port.scripts || {}).length > 0 && (
                        <div>
                          {!isRevealed && (
                            <button onClick={() => revealScripts(index, portIndex)}>
                              <div className="mb-[4px] rounded-3xl bg-green-300 border border-black w-[130px]">
                                Show Scripts Results
                              </div>
                            </button>
                          )}

                          {isRevealed && (
                            <button onClick={unrevealScripts}>
                              <div className="mb-[4px] rounded-3xl bg-red-300 border border-black w-[130px]">
                                Hide Scripts Results
                              </div>
                            </button>
                          )}
                        </div>
                      )}

                      <p>
                        <strong>Port:</strong> {port.port}/{port.protocol}
                      </p>

                      <p>
                        <strong>State:</strong> {port.state}
                      </p>

                      <p>
                        <strong>Service:</strong> {port.service}
                      </p>

                      {port.product && (
                        <p>
                          <strong>Product:</strong> {port.product}
                        </p>
                      )}

                      {port.version && (
                        <p>
                          <strong>Version:</strong> {port.version}
                        </p>
                      )}

                      
                    </div>
                  );
                })}
              </div>

              {selectedPort && (
                <div className="mt-4 border rounded-lg p-3 bg-gray-100">
                  <strong>
                    Scripts for port {selectedPort.port}/{selectedPort.protocol}:
                  </strong>

                  <div className="ml-2 text-sm">
                    {Object.entries(selectedPort.scripts || {}).map(
                      ([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong>{" "}
                          {typeof value === "string"
                            ? value
                            : JSON.stringify(value)}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <button className='text-xl border p-3 mt-[2%] black bg-yellow-300'>Run Vulnerability Scan</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}