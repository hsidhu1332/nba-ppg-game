import Card from './Card.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Input from './Input.jsx'
import ScoreCheck from './ScoreCheck.jsx'
import {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_TOKEN } from './config';


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
          const activeGet = await fetch('/api/active_players', {
            method: 'GET',
            headers: {
            'X-API-Token': API_TOKEN,
          },
          })
          const activeData = await activeGet.json();
          setRandomPlayer(activeData);
        }
        else if (listType === 'inactive') {
          const inactiveGet = await fetch('/api/inactive_players', {
            method: 'GET',
            headers: {
            'X-API-Token': API_TOKEN,
          },
          })
          const inactiveData = await inactiveGet.json();
          setRandomPlayer(inactiveData);
        }
        else if (listType === 'prolific') {
          const prolificGet = await fetch('/api/prolific_scorers', {
            method: 'GET',
            headers: {
            'X-API-Token': API_TOKEN,
          },
          })
          const prolificData = await prolificGet.json()
          setRandomPlayer(prolificData);
        }
        else if (listType === 'all') {
          const allGet = await fetch('/api/all_players', {
            method: 'GET',
            headers: {
            'X-API-Token': API_TOKEN,
          },
          })
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
      const imageUrl = `/api/image/${pid}`;
          const response = await fetch(imageUrl, {
            method: 'GET',
            headers: {
              'X-API-Token': API_TOKEN,  // Include the API token in the headers
            },
          });

          const imageBlob = await response.blob();
          const imageObjectURL = URL.createObjectURL(imageBlob);


          setPlayerImage(imageObjectURL);
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
          const activeGet = await fetch('/api/active_players', {
            method: 'GET',
            headers: {
            'X-API-Token': API_TOKEN,
          },
          })
          const activeData = await activeGet.json();
          setRandomPlayer(activeData);
        }
        else if (listType === 'inactive') {
          const inactiveGet = await fetch('/api/inactive_players', {
            method: 'GET',
            headers: {
            'X-API-Token': API_TOKEN,
          },
          })
          const inactiveData = await inactiveGet.json();
          setRandomPlayer(inactiveData);
        }
        else if (listType === 'prolific') {
          const prolificGet = await fetch('/api/prolific_scorers', {
            method: 'GET',
            headers: {
            'X-API-Token': API_TOKEN,
          },
          })
          const prolificData = await prolificGet.json()
          setRandomPlayer(prolificData);
        }
        else if (listType === 'all') {
          const allGet = await fetch('/api/all_players', {
            method: 'GET',
            headers: {
            'X-API-Token': API_TOKEN,
          },
          })
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
          const activeGet = await fetch('/api/active_players', {
            method: 'GET',
            headers: {
            'X-API-Token': API_TOKEN,
          },
          })
          const activeData = await activeGet.json();
          setRandomPlayer(activeData);
        }
        else if (listType === 'inactive') {
          const inactiveGet = await fetch('/api/inactive_players', {
            method: 'GET',
            headers: {
            'X-API-Token': API_TOKEN,
          },
          })
          const inactiveData = await inactiveGet.json();
          setRandomPlayer(inactiveData);
        }
        else if (listType === 'prolific') {
          const prolificGet = await fetch('/api/prolific_scorers', {
            method: 'GET',
            headers: {
            'X-API-Token': API_TOKEN,
          },
          })
          const prolificData = await prolificGet.json()
          setRandomPlayer(prolificData);
        }
        else if (listType === 'all') {
          const allGet = await fetch('/api/all_players', {
            method: 'GET',
            headers: {
            'X-API-Token': API_TOKEN,
          },
          })
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
