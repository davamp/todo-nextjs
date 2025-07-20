"use client";

import {useEffect, useState} from "react";
import {debounce} from "next/dist/server/utils";
import {FaCheck, FaEdit} from "react-icons/fa";
import {FaTrashCan} from "react-icons/fa6";

interface Todo {
    id: string;
    todo: string;
    isCompleted: boolean;
    createdAt: boolean;
}

export default function Home() {
    const [data, setData] = useState<Todo[] | []>([]);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [editValue, setEditValue] = useState<Todo>(null);

    const fetchData = async (value = "") => {
        setLoading(true);
        const response = await fetch('/api/todo?search=' + value);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: Todo[] = await response.json();
        setData(result)
        setLoading(false);
    };
    const searchText = debounce(async (e) => {
        const text = e.target.value;
        await fetchData(text);
    }, 500)
    useEffect(() => {
        fetchData();
    }, []);
    const dialogSubmit = async (val: string) => {
        if (editValue) {
            await editData(val);
            return;
        }
        await insertNewData(val)
    }
    const editData = async (val: string) => {
        if (!val) return;
        if (val == editValue.todo) return;
        setShowDialog(false);
        await updateDataRequest(editValue.id, val);
        await fetchData();
    }
    const insertNewData = async (val: string) => {
        if (!val) return;
        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    todo: val,
                    isCompleted: false
                })
            };
            const response = await fetch(`/api/todo`, options);
            if (response.ok) {
                console.log(response);
                setShowDialog(false);
                await fetchData();
            } else if (response.status == 409) {
                alert("Todo is already existed !!")
            } else {
                alert("fail to insert !!")
            }
        } catch (e) {
            console.error(e);
        }
    };
    const removeItem = async (id: string) => {
        try {

            if (!confirm("Are you sure you want to delete this item ?")) return;

            const options = {
                method: 'DELETE'
            };
            const response = await fetch(`/api/todo/${id}`, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(response);
            await fetchData();
        } catch (e) {
            console.error(e);
        }
    }
    const editTodo = async (id: string) => {
        const res = data.filter((item: Todo) => (item.id === id));
        if (res.length == 0) return;
        setEditValue(res[0]);
        setShowDialog(true);
    }
    const setTodoCompleted = async (id: string) => {
        await updateDataRequest(id, null, true);
        await fetchData();
    };
    const updateDataRequest = async (id: string, todo?: string, isCompleted?: boolean) => {
        let body = {};
        if (todo) {
            body = {
                todo: todo
            }
        }
        if (isCompleted != null) {
            body = {
                ...body,
                isCompleted: true
            }
        }
        const options = {
            method: 'PATCH',
            body: JSON.stringify(body)
        };
        const response = await fetch(`/api/todo/${id}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(response);
    }

    return (
        <div className="font-sans bg-gray-100 min-h-screen p-8 rounded-lg">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10 rounded-lg">
                Todo List
            </h1>
            <div className="text-center">
                <input
                    type="text"
                    onChange={searchText}
                    placeholder="Search Here !!"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-lg"
                />
            </div>
            <br/>
            {
                loading ?
                    (<div className=" mt-5 text-center text-gray-500 mb-10 rounded-lg">Loading...</div>) :
                    (<div>
                        {data.length > 0 ? (
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto rounded-lg">
                                {
                                    data.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between rounded-lg"
                                        >
                                            <div>
                                                <p style={{
                                                    lineBreak: 'anywhere',
                                                    textDecoration: item.isCompleted ? 'line-through' : 'none'
                                                }}
                                                   className="text-gray-600 rounded-lg">{item.todo}</p>
                                            </div>
                                            <div className="text-right">
                                                <button
                                                    onClick={() => editTodo(item.id)}
                                                    className="mr-2 mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 self-end">

                                                    <FaEdit/>
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="mr-2 mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 self-end">

                                                    <FaTrashCan/>
                                                </button>
                                                {item.isCompleted ? ("") : (
                                                    <button
                                                        onClick={() => setTodoCompleted(item.id)}
                                                        className="mr-2 mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 self-end">

                                                        <FaCheck/>
                                                    </button>)}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="mt-5 text-center text-gray-500 mb-10 rounded-lg">No data available !!</div>
                        )}
                    </div>)
            }

            <button
                onClick={() => setShowDialog(true)}
                className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
                style={{fontFamily: 'Inter, sans-serif'}}
            >
                Create
            </button>
            {showDialog && (
                <InputDialog
                    value={editValue == null ? "" : editValue.todo}
                    onSubmit={(value: string) => dialogSubmit(value)}
                    onCancel={() => setShowDialog(false)}
                    onClose={() => setShowDialog(false)}
                    title="Input your todo"
                    placeholder="Todo"
                />
            )}
        </div>

    );
}

const InputDialog = ({value = "", onClose, onSubmit, onCancel, title, placeholder}) => {
    const [inputValue, setInputValue] = useState(value);
    const handleChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleSubmitClick = () => {
        onSubmit(inputValue);
    };
    const handleCancelClick = () => {
        onCancel();
    };
    return (
        // Overlay backdrop for the dialog
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
            {/* Dialog container */}
            <div
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
                {/* Dialog Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none"
                        aria-label="Close dialog"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-lg"
                    />
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleCancelClick}
                        className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmitClick}
                        className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
