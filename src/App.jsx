import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import "./App.css";

export default function App() {
    const url = 'https://pigeoncoin.ru';
    const tg = window.Telegram.WebApp;

    const [fio, setFio] = useState(tg.initDataUnsafe?.user?.first_name);
    const [type, setType] = useState('profile');
    const [userData, setUserData] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        tg.ready();

        const fetchUserData = async () => {
            try {
                const response = await fetch(`${url}/api/user/get?tgID=${tg.initDataUnsafe?.user?.id}`);
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const data = await response.json();
                if (data.status === "Error") {
                    alert("Пользователь не найден в базе данных. Пожалуйста, зарегистрируйтесь.");
                    tg.close();
                } else {
                    setUserData(data);
                    setFio(`${data.name} ${data.surname}`);
                }
            } catch (err) {
                console.log(err);
                alert(err);
            }
        };

        const fetchTasks = async () => {
            try {
                const response = await fetch(`${url}/api/task/get?userID=${tg.initDataUnsafe?.user?.id}`);
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const data = await response.json();
                if (data.status === "Ok") {
                    setTasks(data.tasks.map((task, index) => ({ id: index + 1, text: task.tittle, completed: false })));
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.log(err);
                alert(err);
            }
        };

        fetchUserData();
        fetchTasks();
    }, [tg]);

    const addTask = async () => {
        try {
            const response = await fetch(`${url}/api/task/add?userID=${tg.initDataUnsafe?.user?.id}&title=${newTask}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            const data = await response.json();
            if (data.status === "ok") {
                setTasks([...tasks, { id: tasks.length + 1, text: newTask, completed: false }]);
                setNewTask('');
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.log(err);
            alert(err);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`${url}/api/task/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskID: taskId }),
            });
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            const data = await response.json();
            if (data.status === "ok") {
                setTasks(tasks.filter(task => task.id !== taskId));
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.log(err);
            alert(err);
        }
    };

    return (
        <div className='App'>
            <Header username={fio}/>
            <Block1 type={type} newTask={newTask} setNewTask={setNewTask} addTask={addTask}/>
            <Block2 type={type} tasks={tasks} deleteTask={deleteTask}/>
            <Footer setType={setType}/>
        </div>
    );
}

function Block1({ type, newTask, setNewTask, addTask }) {
    return (
        <div className='block1'>
            {type === 'profile' && (
                <>
                    <div className='block1__square blue_square'>
                        <p className='block1__square-group'>Курс 2 Backend Группа 9</p>
                    </div>
                    <div className='block1__square orange_square'>
                        <p className='block1__square-quote'>Цитата</p>
                    </div>
                </>
            )}

            {type === 'todo' && (
                <>
                    <input className='block1__input' type='text' value={newTask} onChange={(e) => setNewTask(e.target.value)}/>
                    <button className='block1__addButton' onClick={addTask}>Добавить</button>
                </>
            )}
        </div>
    );
}

function Block2({ type, tasks, deleteTask }) {
    // Фильтруем задачи, оставляя только те, которые не выполнены
    const filteredTasks = tasks.filter(task => !task.completed);

    return (
        <div className='block2'>
            {type === 'profile' && (
                <div className='block2__square'>
                    <p>Место в рейтинге: 3</p>
                    <p>Образовательная активность: 34</p>
                    <p>Дополнительная активность: 6</p>
                </div>
            )}

            {type === 'todo' && (
                <>
                    {filteredTasks.map(task => (
                        <TodoTask key={task.id} text={task.text} onDelete={() => deleteTask(task.id)}/>
                    ))}
                </>
            )}
        </div>
    );
}

function TodoTask({ text, onDelete }) {
    return (
        <div className='block2__todo'>
            <button className='block2__todo-button' onClick={onDelete}>Удалить</button>
            <p className='block2__todo-text'>{text}</p>
        </div>
    );
}