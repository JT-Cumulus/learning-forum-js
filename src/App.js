import { useEffect, useState } from 'react';
import supabase from './supabase';
import './style.css';

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

/*
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span style={{ fontSize: "40px" }}>{count}</span>
      <button className='btn btn-large' onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
    </div>
  )
}
*/ 

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(function() {
    async function getFacts() {
      setIsLoading(true);
      let { data: facts, error } = await supabase
      .from('facts')
      .select('*')
      .eq("category", )
      .order('votesInteresting', {ascending: false })
      .limit(1000);

      if(!error) setFacts(facts);
      else alert('There was a problem getting data');

      setIsLoading(false);
    }
    getFacts();
    }, [])

  return (
    <>
    {/* HEADER */}
    <Header showForm={showForm} setShowForm={setShowForm} />

    {showForm ? (<NewFactForm setFacts={setFacts} setShowForm={setShowForm}/>) : null}

    <main className='main'>
    <CategoryFilter />
      {isLoading ? <Loader /> : <FactList facts={facts}/>
      }
    </main>
    
    </>
  );
}

function Loader() {
  return <p className='message'>Loading...</p>;
}

function Header({showForm, setShowForm}) {
  const appTitle = "Today I learned";

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68"/>
        <h1>{appTitle}</h1>
      </div>
          
      <button className="btn btn-large btn-open" 
      onClick={() => setShowForm((show) => !show)}>
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  )
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({setFacts, setShowForm}){
  const [text, setText] = useState("");
  const [source, setSource] = useState("http://example.com");
  const [category, setCategory] = useState("");
  const textLength = text.length;

  function handleSubmit(e) {
    // 1. Prevent browser reload
    e.preventDefault();

    // 2. Check if data is valid. If so, create a new fact
    if (text && source && category && textLength <= 200 && isValidHttpUrl(source)) console.log("valid data");

    // 3. Create a new fact object
    const newFact = {
      id: Math.random() * 1000000,
      text,
      source,
      category,
      votesInteresting: 0,
      votesMindblowing: 0,
      votesFalse: 0,
      createdIn: new Date().getFullYear(),
    };

    // 4. Add the new fact to the UI: add the fact to the state
    setFacts((facts) => [newFact, ...facts]);


    // 5. Reset input fields
    setText('');
    setSource('');
    setCategory('');

    // 6. Close the form
    setShowForm(false);
  }

  return (
  <form className="fact-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Share a fact with the world..." value={text}
      onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - text.length}</span>
      <input value={source} type="text" placeholder="Trustworthy source..." onChange={(e) => setSource(e.target.value)}/>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => <option value={cat.name}>{cat.name.toUpperCase()}</option>)}
      </select>
      <button className="btn btn-large">Post</button>
    </form>
  );
}

function CategoryFilter() {
  return (
    <aside>
        <ul>
          <li className='category'>
            <button className="btn btn-all-categories">All</button>
          </li>

          {CATEGORIES.map((cat) => (
            <li key={cat.name} className='category'>
              <button className="btn btn-category" style={ {backgroundColor: cat.color}}>{cat.name}</button>
            </li>
          ))}
        </ul>
      </aside>
  );
}

function FactList({facts, setFacts}) {

  return (
    <section>
      <ul className='facts-list'>
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts}/>
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}

function Fact({ fact }) {

  return (
    <li className="fact">
    <p>
      {fact.text}
      <a className="source" href={fact.source} target="_blank">(Source)</a>
    </p>
    <span className="tag" style={{backgroundColor: CATEGORIES.find((cat) => cat.name ===
      fact.category).color}}>{fact.category}</span>
      <div className="vote-buttons">
        <button>🤔 {fact.votesFalse}</button>
        <button>👍 {fact.votesInteresting}</button>
        <button>🤯 {fact.votesMindblowing}</button>
      </div>
  </li>
  );
}

export default App;