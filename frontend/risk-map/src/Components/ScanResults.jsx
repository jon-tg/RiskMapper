// ScanResults.jsx

export default function ScanResults({ results }) {
  return (
    <div className="flex flex-wrap  text-[15px] gap-4 mt-[1vh]">
      {results.map((result, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-xl p-4 w-full md:w-[48%] lg:w-[400px] border border-gray-200"
        >
          <h2 className="text-2xl text-center font-bold mb-2">
            {result.host} | {result.hostnames.join(", ")}
          </h2>

          {result.os_matches?.length > 0 && (
            <div className="mb-3">
              <strong>OS Matches:</strong>

              {result.os_matches.map((os, osIndex) => (
                <div
                  key={osIndex}
                  className="ml-2 text-sm text-gray-700"
                >
                  {os.name} ({os.accuracy}%)
                </div>
              ))}
            </div>
          )}

          <div>
            <strong>Ports:</strong>

            <div className="mt-2 flex flex-row flex-wrap gap-2">
              {result.ports.map((port, portIndex) => (
                <div
                  key={portIndex}
                  className="border w-[150px] rounded-lg p-2 bg-gray-50"
                >
                  <p>
                    <strong>Port:</strong>{" "}
                    {port.port}/{port.protocol}
                  </p>

                  <p>
                    <strong>State:</strong>{" "}
                    {port.state}
                  </p>

                  <p>
                    <strong>Service:</strong>{" "}
                    {port.service}
                  </p>

                  {port.product && (
                    <p>
                      <strong>Product:</strong>{" "}
                      {port.product}
                    </p>
                  )}

                  {port.version && (
                    <p>
                      <strong>Version:</strong>{" "}
                      {port.version}
                    </p>
                  )}

                  {Object.keys(port.scripts || {}).length > 0 && (
                    <div className="mt-2">
                      <strong>Scripts:</strong>

                      <div className="ml-2 text-sm">
                        {Object.entries(port.scripts).map(
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
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}