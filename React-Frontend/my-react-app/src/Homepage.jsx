import { Link } from 'react-router-dom';
import {useState, useEffect} from 'react';
import { API_TOKEN } from './config';

function Homepage() {
    const [playerImage, setPlayerImage] = useState('');

    useEffect(() => {
        async function fetchPlayers() {
          try {
            const activeGet = await fetch('/api/active_players', {
              method: 'GET',
              headers: {
              'X-API-Token': API_TOKEN,
            },
            })
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