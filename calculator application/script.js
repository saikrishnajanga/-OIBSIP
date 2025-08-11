   const display = document.getElementById('display');

    function appendToDisplay(value) {
      if (display.innerText === '0' && value !== '.' && value !== '(' && value !== '√(') {
        display.innerText = value;
      } else {
        display.innerText += value;
      }
    }

    function clearDisplay() {
      display.innerText = '0';
    }

    function deleteLast() {
      display.innerText = display.innerText.slice(0, -1) || '0';
    }

    function calculateResult() {
      try {
        let expression = display.innerText
          .replace(/×/g,'*')
          .replace(/÷/g,'/')
          .replace(/√\(/g, 'Math.sqrt(');
        
        display.innerText = eval(expression).toString();
      } catch {
        display.innerText = 'Error';
      }
    }

    document.addEventListener('keydown', (event) => {
      const key = event.key;
      if (!isNaN(key) || ['+', '-', '*', '/', '.', '%', '(', ')'].includes(key)) {
        appendToDisplay(key);
      } else if (key === 'Enter' || key === '=') {
        calculateResult();
      } else if (key === 'Backspace') {
        deleteLast();
      } else if (key.toLowerCase() === 'c' || key === 'Escape') {
        clearDisplay();
      }
    });