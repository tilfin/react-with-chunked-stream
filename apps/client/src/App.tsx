import { useChat } from 'ai/react';
 
import './App.css'

function App() {
  const { messages, handleSubmit, input, handleInputChange } = useChat({
    api: '/chat/:id'
  });

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="input">Prompt</label>
      <input
        name="prompt"
        value={input}
        onChange={handleInputChange}
        id="input"
      />
      <button type="submit">Submit</button>
      {messages.map((message, i) => (
        <div key={i}>{message.content}</div>
      ))}
    </form>
  )
}

export default App
