import { Link } from 'react-router-dom';
import {useState, useEffect} from 'react';

function Homepage() {
    const [playerImage, setPlayerImage] = useState('');

    useEffect(() => {
        async function fetchPlayers() {
          try {
            const activeGet = await fetch('http://localhost:7000/api/active_players')
            const activeData = await activeGet.json();
            setRandomPlayer(activeData);
          }
          catch (error) {
            console.error('Error fetching player lists', error);
          }
        }
        fetchPlayers();
      }, []);

    

    function setRandomPlayer(list) {

        if (list.length > 0) {
          const randomPlayer = list[Math.floor(Math.random() * list.length)];
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

    return (
        <div class="homepage">
            {playerImage && <img src={playerImage} alt='image' />}
            <h1>NBA PPG Guesser</h1>
            <h2>Guess the random NBA players career PPG, you will take damage for how far off you are.<br /> See how many you can get right before you die!</h2>
            <div class="homepage-buttons">
                <Link to="/game/prolific">
                    <button>Play with only prolific scorers (Recommended)</button>
                </Link>
                <Link to="/game/active">
                    <button>Play with only Active Players</button>
                </Link>
                <Link to="/game/inactive">
                    <button>Play with only Inactive Players</button>
                </Link>
                <Link to="/game/all">
                    <button>Play with all players</button>
                </Link>
            </div>
        </div>
    );
}

export default Homepage;