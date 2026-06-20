import { useState } from "react";

export default function ScanResults({ results }) {
  const [revealedPort, setRevealedPort] = useState(null);
  const [riskResults, setRiskResults] = useState({});
  const [riskLoading, setRiskLoading] = useState({});
  const [riskViewHost, setRiskViewHost] = useState(null);

  function revealScripts(resultIndex, portIndex) {
    setRevealedPort({ resultIndex, portIndex });
  }

  function unrevealScripts() {
    setRevealedPort(null);
  }

  async function runRiskScan(result, index) {
    console.log("Button clicked");

    setRiskLoading((prev) => ({
      ...prev,
      [index]: true,
    }));

    try {
      const response = await fetch(`http://localhost:8000/risk/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: result,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Risk scan failed");
      }

      setRiskResults((prev) => ({
        ...prev,
        [index]: data,
      }));

      setRiskViewHost(index);
    } catch (error) {
      console.error("Risk scan error:", error);
    } finally {
      setRiskLoading((prev) => ({
        ...prev,
        [index]: false,
      }));
    }
  }

  return (
    <div className="flex flex-wrap justify-center text-[15px] gap-4 mt-[1vh]">
      {results.map((result, index) => {
        const selectedPort =
          revealedPort?.resultIndex === index
            ? result.ports?.[revealedPort.portIndex]
            : null;

        if (riskViewHost === index && riskResults[index]) {
          return (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-4 w-full md:w-[48%] mb-[3%] lg:w-[65vw] border border-gray-200"
            >
              <button
                type="button"
                onClick={() => setRiskViewHost(null)}
                className="mb-4 rounded-lg border border-black bg-gray-200 px-4 py-2"
              >
                ← Back to Open Ports
              </button>

              <h2 className="text-2xl font-bold mb-2 text-center">
                Vulnerability Scan: {riskResults[index].host}
              </h2>

              <div className="mt-4 border rounded-lg p-3 bg-gray-100">

                {riskResults[index].ports?.map((port, portIndex) => (
                  <div key={portIndex} className="mt-3 border-t pt-2">
                    <p>
                      <strong>Port:</strong> {port.port}/{port.protocol}:{" "}
                      {port.product} {port.version}
                    </p>

                    {port.cves?.length > 0 ? (
                      <div className="mt-2">

                        {port.cves.map((cve) => (
                          <div
                            key={cve.id}
                            className="mt-2 rounded-lg border bg-white p-2 text-sm"
                          >
                            <div className="font-bold">
                              {cve.id} — {cve.severity}
                            </div>

                            <div>CVSS Score: {cve.score ?? "N/A"}</div>

                            <p className="mt-1">{cve.description}</p>

                            <p className="mt-1 text-gray-500">
                              Published: {cve.published}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No CVEs found.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

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
              {result.ports?.length > 0 && <strong>Open ports:</strong>}

              <div className="mt-2 flex flex-row flex-wrap gap-2">
                {result.ports?.map((port, portIndex) => {
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
                            <button
                              type="button"
                              onClick={() => revealScripts(index, portIndex)}
                            >
                              <div className="mb-[4px] rounded-3xl bg-green-300 border border-black w-[130px]">
                                Show Scripts Results
                              </div>
                            </button>
                          )}

                          {isRevealed && (
                            <button type="button" onClick={unrevealScripts}>
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
                    Scripts for port {selectedPort.port}/
                    {selectedPort.protocol}:
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
              <button
                type="button"
                onClick={() => runRiskScan(result, index)}
                className="text-xl border p-3 mt-[2%] black bg-yellow-300"
              >
                {riskLoading[index] ? "Scanning..." : "Run Vulnerability Scan"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}