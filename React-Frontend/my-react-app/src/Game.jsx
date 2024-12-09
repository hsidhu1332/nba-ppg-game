import Card from './Card.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Input from './Input.jsx'
import ScoreCheck from './ScoreCheck.jsx'
import {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';


function Game() {
  const { listType } = useParams();
  const navigate = useNavigate();
  const [guess, setGuess] = useState(null);
  const [health, setHealth] = useState(20);
  const [maxHealth, setMaxHealth] = useState(20);
  const [score, setScore] = useState(0);
  const [targetValue, setTargetValue] = useState(null);
  const [targetName, setTargetName] = useState('');
  const [resultShown, setResultShown] = useState(false);
  const [playerImage, setPlayerImage] = useState('');
  // const prevTargetValueRef = useRef(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [clearInput, setClearInput] = useState(false);
  const [guessReadOnly, setGuessReadOnly] = useState(false);
  // console.log({targetValue})

  useEffect(() => {
    async function fetchPlayers() {
      try {
        if (listType === 'active') {
          const activeGet = await fetch('http://localhost:7000/api/active_players')
          const activeData = await activeGet.json();
          setRandomPlayer(activeData);
        }
        else if (listType === 'inactive') {
          const inactiveGet = await fetch('http://localhost:7000/api/inactive_players')
          const inactiveData = await inactiveGet.json();
          setRandomPlayer(inactiveData);
        }
        else if (listType === 'prolific') {
          const prolificGet = await fetch('http://localhost:7000/api/prolific_scorers')
          const prolificData = await prolificGet.json()
          setRandomPlayer(prolificData);
        }
        else if (listType === 'all') {
          const allGet = await fetch('http://localhost:7000/api/all_players')
          const allData = await allGet.json()
          setRandomPlayer(allData);
        }
        
        
      }
      catch (error) {
        console.error('Error fetching player lists', error);
      }
    }
    fetchPlayers();
  }, [listType]);

  function setRandomPlayer(list) {

    if (list.length > 0) {
      const randomPlayer = list[Math.floor(Math.random() * list.length)];
      setTargetValue(randomPlayer.ppg);
      setTargetName(randomPlayer.name);
      fetchPlayerImage(randomPlayer.id);
      // prevTargetValueRef.current = randomPlayer.ppg;
    }
  }

  async function fetchPlayerImage(pid) {
    try {
      const imageUrl = `http://localhost:7000/api/image/${pid}`;
      setPlayerImage(imageUrl);
    }
    catch (error) {
      console.error('Error fetching image', error)
    }
  }


//   function generateRandomTarget() {
//     return (Math.random() * 100).toFixed(1);
// }

  const handleScoreSubmit = (guess) => {
    if (health <= 0 || hasGuessed) return;
    const difference = (Math.abs(guess - targetValue));
    const newHealth = Math.max(0, health - difference);
    const roundedNewHealth = Math.round(newHealth * 10) / 10;

    setGuess(guess);
    setHealth(roundedNewHealth);
    setScore(score => score + 1);
    setResultShown(true);
    setGuessReadOnly(true);

    // prevTargetValueRef.current = targetValue;
    // setRandomPlayer(activePlayers, inactivePlayers);
    setHasGuessed(true);


  };

  const goHome = () => {
    navigate('/');
  };

  const handleNextPlayer = () => {
    if (!resultShown) return;
    setResultShown(false);
    setGuess(null);
    setHasGuessed(false);
    setGuessReadOnly(false);

    setClearInput(true);


    async function fetchPlayers() {
      try {
        if (listType === 'active') {
          const activeGet = await fetch('http://localhost:7000/api/active_players')
          const activeData = await activeGet.json();
          setRandomPlayer(activeData);
        }
        else if (listType === 'inactive') {
          const inactiveGet = await fetch('http://localhost:7000/api/inactive_players')
          const inactiveData = await inactiveGet.json();
          setRandomPlayer(inactiveData);
        }
        else if (listType === 'prolific') {
          const prolificGet = await fetch('http://localhost:7000/api/prolific_scorers')
          const prolificData = await prolificGet.json()
          setRandomPlayer(prolificData);
        }
        else if (listType === 'all') {
          const allGet = await fetch('http://localhost:7000/api/all_players')
          const allData = await allGet.json()
          setRandomPlayer(allData);
        }
        
        
      }
      catch (error) {
        console.error('Error fetching player lists', error);
      }
    }
    
    
    fetchPlayers();

  };

  

  const resetGame = () => {
    setHealth(20);
    setScore(0)
    setGuess(null);
    setHasGuessed(false);
    setGuessReadOnly(false);
    setClearInput(true);
    async function fetchPlayers() {
      try {
        if (listType === 'active') {
          const activeGet = await fetch('http://localhost:7000/api/active_players')
          const activeData = await activeGet.json();
          setRandomPlayer(activeData);
        }
        else if (listType === 'inactive') {
          const inactiveGet = await fetch('http://localhost:7000/api/inactive_players')
          const inactiveData = await inactiveGet.json();
          setRandomPlayer(inactiveData);
        }
        else if (listType === 'prolific') {
          const prolificGet = await fetch('http://localhost:7000/api/prolific_scorers')
          const prolificData = await prolificGet.json()
          setRandomPlayer(prolificData);
        }
        else if (listType === 'all') {
          const allGet = await fetch('http://localhost:7000/api/all_players')
          const allData = await allGet.json()
          setRandomPlayer(allData);
        }
        
        
      }
      catch (error) {
        console.error('Error fetching player lists', error);
      }
    }

    
    fetchPlayers();
    setResultShown(false);
  };

  useEffect(() => {
    if (clearInput) {
      setClearInput(false);
    }
  }, [clearInput]); 


    
  
  return(
    <>
    <button onClick={goHome} id="go_home">CHANGE GAME MODE</button>
    <div class="game">
    <h2>{targetName.toUpperCase()}</h2>
    {playerImage && <img src={playerImage} alt={targetName} />}
    <Input onMessageSubmit={handleScoreSubmit} clearInput={clearInput} guessReadOnly={guessReadOnly} onNextPlayer={handleNextPlayer} health={health} resetGame={resetGame}/>
    <ScoreCheck guess={guess}
                health={health}
                maxHealth={maxHealth}
                score={score}
                targetValue={resultShown ? targetValue : null}
                />
    {health > 0 && resultShown && (
      <button onClick={handleNextPlayer}>NEXT PLAYER</button>
    )}
    {health === 0 && (
      <div>
        <h2>GAME OVER</h2>
        <button onClick={resetGame}>RESET GAME</button>
      </div>
    )}
    </div>
    </>
  );
}

export default Game
