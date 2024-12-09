import {useState, useEffect, useRef} from 'react';

function Input({ onMessageSubmit, clearInput, guessReadOnly, onNextPlayer, health, resetGame}){
    const [message, setMessage] = useState(''); 
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect (() => {
        if (clearInput) {
            setMessage('');
            if (inputRef. current) {
                inputRef.current.focus();
            }
        }
    }, [clearInput]);


    const handleChange = event => {
        const value = event.target.value;
        const numericValue = value.replace(/[^0-9.]/g, "");

        if (
            numericValue === "" || // Allow empty input for deletions
            /^[0-9]$/.test(numericValue) || // Single digit (e.g., "0-9")
            /^[0-9]\.$/.test(numericValue) || // Single digit followed by a decimal (e.g., "9.")
            /^[0-9]\.[0-9]$/.test(numericValue) || // Single digit with a decimal and one digit (e.g., "9.9")
            /^[1-9][0-9]$/.test(numericValue) || // Two digits (e.g., "10-99")
            /^[1-9][0-9]\.$/.test(numericValue) || // Two digits followed by a decimal (e.g., "99.")
            /^[1-9][0-9]\.[0-9]$/.test(numericValue) // Two digits with a decimal and one digit (e.g., "99.9")
          ) {
                setMessage(numericValue)
            }
        

    };

    const handleClick = event => {
        event.preventDefault();
        if (!message) {
            return;
        }
        onMessageSubmit(parseFloat(message))
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (guessReadOnly) {
                if (health === 0) {
                    resetGame();
                }
                else {
                    onNextPlayer();
                }    
            }
            else {
                handleClick(event);
            }
            
        }
    };

    return (
        <div class="text_box">
            <input
                ref={inputRef}
                type="text"
                onChange={handleChange}
                value={message}
                placeholder=""
                readOnly={guessReadOnly}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleClick} id="guess">GUESS</button>
        </div>
    );
}

export default Input