"use client";

import {useEffect, useState} from "react";

interface Todo {
    id: string;
    todo: string;
    isCompleted: boolean;
    createdAt: boolean;
}

export default function Home() {

    const [data, setData] = useState<Todo[] | []>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/todo'); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: Todo[] = await response.json();
            setData(result)
        } catch (err) {
            // setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const setTodoCompleted = async (id: string) => {
        try {
            const options = {
                method: 'PATCH',
                body: JSON.stringify({
                    todo: null,
                    isCompleted: true
                })
            };
            const response = await fetch(`/api/todo/${id}`, options); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(response);
            await fetchData();
        } catch (e) {
            console.error(e);
        }
    };


    if (data.length > 0) {
        return (
            // Main container with Inter font and a pleasant background
            <div className="font-sans bg-gray-100 min-h-screen p-8 rounded-lg">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10 rounded-lg">
                    Todo List
                </h1>

                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto rounded-lg">
                    {data.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between rounded-lg"
                        >
                            <div>
                                {/*<h2 className="text-right text-2xl font-semibold text-blue-600 mb-2 rounded-lg">{item.isCompleted ? "Completed" : "OnGoing"}</h2>*/}
                                <p style={{
                                    lineBreak: 'anywhere',
                                    textDecoration: item.isCompleted ? 'line-through' : 'none'
                                }}
                                   className="text-gray-600 rounded-lg">{item.todo}</p>
                            </div>
                            {item.isCompleted ? ("") : (
                                <button
                                    onClick={() => setTodoCompleted(item.id)}
                                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 self-end">
                                    Mark as Complete
                                </button>)}
                        </div>
                    ))}
                </div>

            </div>
        );
    }
    return (<div className="font-sans bg-gray-100 min-h-screen p-8 rounded-lg">
        {loading ? (<div>Loading...</div>) : (<div>Loading...</div>)}
    </div>)
    // return (
    //     <div className="relative min-h-screen bg-gray-100 flex items-center justify-center font-sans">
    //         {/* Main content area - for demonstration purposes */}
    //         <div className="text-center p-8 bg-white rounded-lg shadow-lg">
    //             {data}
    //         </div>
    //
    //         <button
    //             onClick={handleClick}
    //             className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
    //             style={{fontFamily: 'Inter, sans-serif'}}
    //         >
    //             Create
    //         </button>
    //     </div>
    // );
}
