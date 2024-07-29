import { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './components/Note.jsx';
import HandleSerachChange from './components/HandleSerachChange.jsx';
import noteService from './services/notes'

const App = () => {
    const [persons, setPersons] = useState([]);
    const [search, setSearch] = useState('');
    const [newSearch, setNewSearch] = useState('');
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [infoMessage, setInfoMessage] = useState(null)


    useEffect(() => {
        console.log("Fetching data from server...");
        noteService
            .getAll('http://localhost:3001/api/persons')
            .then(response => {
                setPersons(response.data);
                console.log(response.data[0]);
            })
    }, []);


    const ShowingSearch = (event) => {
        event.preventDefault();
        setSearch(newSearch);
        console.log(search, ' wow');
        setNewSearch('');
    };

    // const HandleSearchChange = (event) => {
    //     setNewSearch(event.target.value);
    // };

    const Notification =({message})=>{
        if (message===null){
            return null
        }
        const {type,text}=message;

        return (
                <div className={type}>
                    {text}
                </div>
        )

    }

    const addNewName = (event) => {
        event.preventDefault();

        const nameExist = persons.some(person => person.name === newName);

        const id_of_match = persons.find(person=> person.name === newName)?.id;

        const newNameConstructor = {
            name: newName,
            number: newNumber,
        };

        if (nameExist) {
            if(window.confirm(`${newName} already exist, do you wanna update?`)) {
                noteService
                    .update(id_of_match, newNameConstructor)
                    .then(response => {
                        setPersons(persons.map(person => person.id !== id_of_match ? person : response.data));
                        setInfoMessage({text:`${newName} was updated`, type: 'success'})
                        setTimeout(()=>{
                            setInfoMessage(null), 5000
                        });
                        setNewName('');
                        setNewNumber('');

                    })
                    .catch(err=>{
                        setInfoMessage({text:`Info of ${newName} was already removed`,type: 'error'});
                        setTimeout(()=> {setInfoMessage(null)}, 5000);
                    })
                ;



        }}
        noteService
            .create(newNameConstructor)
            .then(response => {
                setPersons(persons.concat(response.data));
                setInfoMessage({
                   text: `Added '${newName}'`, type:'success'
            })
                setTimeout(()=>{
                    setInfoMessage(null)
                }, 5000)
                setNewName('');
                setNewNumber('');

            })


    };

    const handleNameChanged = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const handleDelete = (id) =>{
        const person = persons.find(p => p.id === id);
        if(window.confirm(`Do you really want to delete ${person.name}`)){
            noteService.remove(id)
                .then(()=>{
                    setPersons(persons.filter(p => p.id!== id));
                })
                .catch(error=>{
                    setInfoMessage({text:`${person.name} already deleted`,type:'success'});
                });
        }
    };

    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(search.toLowerCase())
    );



    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={infoMessage}/>
            <form onSubmit={ShowingSearch}>
                <div>
                    <p>debug: {newSearch}</p>
                    filter: <input value={newSearch} onChange={(event) => setNewSearch(event.target.value)} />
                </div>
                <div>
                    <button type="submit">search</button>
                </div>
            </form>
            <h2>add a new</h2>
            <form onSubmit={addNewName}>
                <div>
                    name: <input value={newName} onChange={handleNameChanged} />
                </div>
                <div>
                    number: <input value={newNumber} onChange={handleNumberChange} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            <ul>
                {filteredPersons.map(person => (
                    <Note key={person.id} name={person.name} number={person.number} onDelete={() => handleDelete(person.id)}/>
                ))}
            </ul>

        </div>
    );
};

export default App;
