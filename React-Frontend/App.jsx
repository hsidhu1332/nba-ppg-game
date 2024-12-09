import Input from './Input.jsx'
import ScoreCheck from './ScoreCheck.jsx'
import {useState, useParams, useEffect, act} from 'react';


function Game() {
  const [activePlayers, setActivePlayers] = useState([]);
  const [inactivePlayers, setInactivePlayers] = useState([]);
  const [guess, setGuess] = useState(null);
  const [health, setHealth] = useState(20);
  const [score, setScore] = useState(0);
  const [targetValue, setTargetValue] = useState(null);
  const [targetName, setTargetName] = useState('');
  const [resultShown, setResultShown] = useState(false);
  const [playerImage, setPlayerImage] = useState('');
  // const prevTargetValueRef = useRef(null);
  // const [hasGuessed, setHasGuessed] = useState(false);
  // console.log({targetValue})

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const activeGet = await fetch('http://localhost:7000/api/prolific_scorers')
        const inactiveGet = await fetch('http://localhost:7000/api/prolific_scorers')
        const activeData = await activeGet.json();
        const inactiveData = await inactiveGet.json();

        setActivePlayers(activeData);
        setInactivePlayers(inactiveData);
        setRandomPlayer(activeData, inactiveData);
      }
      catch (error) {
        console.error('Error fetching player lists', error);
      }
    }
    fetchPlayers();
  }, []);

  function setRandomPlayer(activeList, inactiveList) {
    const isActive = Math.random() < 0.5;
    const selectedList = isActive ? activeList : inactiveList;

    if (selectedList.length > 0) {
      const randomPlayer = selectedList[Math.floor(Math.random() * selectedList.length)];
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
    if (health <= 0) return;
    const difference = (Math.abs(guess - targetValue));
    const newHealth = Math.max(0, health - difference);
    const roundedNewHealth = Math.round(newHealth * 10) / 10;

    setGuess(guess);
    setHealth(roundedNewHealth);
    setScore(score => score + 1);
    setResultShown(true);

    // prevTargetValueRef.current = targetValue;
    // setRandomPlayer(activePlayers, inactivePlayers);
    // setHasGuessed(true);


  };

  const handleNextPlayer = () => {
    if (!resultShown) return;
    setRandomPlayer(activePlayers, inactivePlayers);
    setResultShown(false);
    setGuess(null);
  };

  const resetGame = () => {
    setHealth(20);
    setScore(0)
    setGuess(null);
    setRandomPlayer(activePlayers, inactivePlayers);
    setResultShown(false);
  };


    
  
  return(
    <>
    <h2>{targetName}</h2>
    {playerImage && <img src={playerImage} alt={targetName} />}
    <Input onMessageSubmit={handleScoreSubmit}/>
    <ScoreCheck guess={guess}
                health={health}
                score={score}
                targetValue={resultShown ? targetValue : null}
                />
    {health > 0 && resultShown && (
      <button onClick={handleNextPlayer}>Next Player</button>
    )}
    {health === 0 && (
      <div>
        <h2>Game Over! Click Below to Reset.</h2>
        <button onClick={resetGame}>Reset Game</button>
      </div>
    )}
    </>
  );
}

export default Game
