document.addEventListener('DOMContentLoaded', function() {
  const surveyForm = document.getElementById('surveyForm');
  const resultsContainer = document.getElementById('results');
  const chartContainer = document.getElementById('chartContainer');
  const otherTextInput = document.getElementById('otherText');
  const otherRadio = document.getElementById('other');
  const questionDiv = document.querySelector('.question');
  const submitButton = document.querySelector('button');
  const radioButtons = document.querySelectorAll('input[name="fruit"]');

  let responses = {
    apple: 0,
    banana: 0
  };

  surveyForm.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  });

  otherTextInput.addEventListener('input', function() {
    if (otherTextInput.value.trim() !== '') {
      otherRadio.checked = true;
    }
  });

  radioButtons.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this !== otherRadio) {
        otherTextInput.value = '';
      }
    });
  });

  submitButton.addEventListener('click', function(event) {
    event.preventDefault();

    const formData = new FormData(surveyForm);
    let selectedOption = formData.get('fruit');
    let otherText = otherTextInput.value.trim();

    if (selectedOption === 'other' && otherText !== '') {
      if (!responses[otherText]) {
        responses[otherText] = 0;

        const newRadio = document.createElement('input');
        newRadio.type = 'radio';
        newRadio.name = 'fruit';
        newRadio.value = otherText;
        newRadio.id = otherText;

        const newLabel = document.createElement('label');
        newLabel.htmlFor = otherText;
        newLabel.textContent = otherText;

        questionDiv.appendChild(document.createElement('br'));
        questionDiv.appendChild(newRadio);
        questionDiv.appendChild(newLabel);
      }
      selectedOption = otherText;
    }

    if (selectedOption) {
      responses[selectedOption]++;
      
      // === ここでGASへデータを送信 ===
      fetch("https://script.google.com/a/macros/mro.co.jp/s/AKfycbzEnIyyHyRXm0dkqOtf84JS335HQtVVrH-vmQEuogpJuQ7pEOztuYsOK9Fgomhf2cviig/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: selectedOption })
      })
      .then(response => response.text())
      .then(data => console.log("送信成功: " + data))
      .catch(error => console.error("送信エラー: ", error));
      // ============================

    }

    updateResults();
    surveyForm.reset();

    alert("回答が送信されました");
  });

  function updateResults() {
    resultsContainer.style.display = 'block';

    const totalResponses = Object.values(responses).reduce((a, b) => a + b, 0);
    let resultHTML = '';

    for (const key in responses) {
      const percentage = ((responses[key] / totalResponses) * 100).toFixed(1);
      resultHTML += `<p>${key}: ${percentage}%</p>`;
    }

    chartContainer.innerHTML = resultHTML;
  }
});
