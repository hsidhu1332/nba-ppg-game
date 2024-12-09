import React, {useState, useEffect} from 'react';


function ScoreCheck({guess, health, maxHealth, score, targetValue}) {
    const [blink, setBlink] = useState(false);
    const difference = guess !== null ? Math.abs(guess - targetValue) : null;
    const roundedDifference = difference !== null ? Math.round(difference * 10) / 10 : null;
    const healthPercentage = (health / maxHealth) * 100;
    
    console.log("target value", {targetValue});

    useEffect(() => {
        if (roundedDifference != null) {
            setBlink(true);

        const timer = setTimeout(() => setBlink(false), 1500);
        return () => clearTimeout(timer);
        }
    }, [roundedDifference]);


    return(
        <div>
        {/* <h2>Score Check</h2> */}
        {/* <p>Name: {targetName}</p> */}
        <p>CAREER PPG: {targetValue}</p>
        <p className={blink ? 'blink' : ''}>DAMAGE: {roundedDifference}</p>
        {/* <p id="health">HEALTH: {health}</p> */}
        <p>SCORE: {score}</p>
        <div className="health-bar-container">
                <div className='health-bar' style={{ width : `${healthPercentage}%`}}>
                <div className='health-text'>{health} HP</div>
                </div>
            </div>
        </div>
    );
}

export default ScoreCheck