import { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.REACT_APP_API_URL || "http://localhost:8000/api";

function App({ socket }) {
  const [content, setContent] = useState("");
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/data/get-all`);
        setDataList(res.data.data);
      } catch (error) {
        console.error("Error while fetching all data from database!");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    socket.on("newData", (data) => {
      console.log("New data added: ", data);
      setDataList((pre) => [...pre, data]);
    });

    return () => {
      socket.off("newData");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/data/add`, {
        content,
      });
      console.log("Data added successfully: ", response.data);
      setContent("");
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  };
  return (
    <div className="w-full h-screen mx-auto p-4 bg-neutral-950 text-teal-300">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 border-2 border-teal-950">
        <div className="w-full mx-auto p-4 border-b md:border-r md:border-b-0 md:border-teal-950">
          <h2 className="font-bold mb-4">
            All the data list out from the database in realtime
          </h2>
          <ul className="pl-5 py-3 border border-teal-950 h-[calc(100vh-6.875rem)] overflow-y-auto rounded-md">
            {dataList.map((data, index) => (
              <li key={index} className={`pb-2`}>
                {index} - {data.content}
              </li>
            ))}
          </ul>
          <div>
            {/*
            <table className="table-fixed border-collapse border border-gray-300 w-full">
            <tbody>
              {dataList.map((data, index) => {
                if (index % 3 === 0) {
                  return (
                    <tr key={index}>
                      {dataList
                        .slice(index, index + 3)
                        .map((item, subIndex) => (
                          <td
                            key={subIndex}
                            className="border border-gray-300 p-4 text-center w-1/3"
                          >
                            {item.content}
                          </td>
                        ))}
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
          */}
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          method="post"
          className="flex flex-col justify-center items-center gap-8 border-t md:border-l md:border-t-0 border-teal-950"
        >
          <input
            placeholder="Enter the message..."
            type="text"
            className="min-w-72 sm:min-w-96 border-2 border-teal-950 rounded-md px-4 py-2 bg-black placeholder:text-teal-400 focus:outline-none focus:border-teal-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="w-fit bg-teal-950 hover:bg-teal-500 text-white hover:text-black px-4 py-2 hover:shadow-md rounded-md font-semibold"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
