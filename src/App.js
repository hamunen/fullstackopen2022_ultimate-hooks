import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  const getAll = async () => {
    const response = await axios.get(baseUrl)
    console.log(response.data)
    return response.data
  }

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource)
    const newResource = response.data
    setResources([...resources, newResource])
  }

  const service = {
    create
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(baseUrl)
        setResources(response.data)
      } catch (err) {} /* seems to always print the 404 to console anyways :/ */
    }
    fetchData()
  }, [baseUrl])


  return [
    resources, service
  ]
}

const App = () => {
  const {reset: resetContent, ...content} = useField('text')
  const {reset: resetName, ...name} = useField('text')
  const {reset: resetNumber, ...number} = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
    resetContent()
  }

  //sit pitäis kai formin submit hoitaa? toimii jo mut ei tyhjennä tai reloadaa 
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
    resetName()
    resetNumber()
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App