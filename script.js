// アンケート送信
function submitSurvey() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');

  if (!selectedAnswer) {
      alert('1つの選択肢を選んでください');
      return;
  }

  // 結果を保存
  let results = JSON.parse(localStorage.getItem("surveyResults")) || { "選択肢1": 0, "選択肢2": 0, "選択肢3": 0 };
  
  if (results[selectedAnswer.value] !== undefined) {
      results[selectedAnswer.value]++;  // 選択肢のカウントを増やす
  } else {
      results[selectedAnswer.value] = 1;  // 初回なら1にする
  }

  localStorage.setItem("surveyResults", JSON.stringify(results));

  alert("アンケートが送信されました");
  document.getElementById('surveyForm').reset();
  updateAdminResults(); // 送信直後に更新
}

// 管理者ページの投票結果をリアルタイムで更新
function updateAdminResults() {
  let results = JSON.parse(localStorage.getItem("surveyResults")) || { "選択肢1": 0, "選択肢2": 0, "選択肢3": 0 };

  // 投票結果を更新
  if (document.getElementById("count1")) {
      document.getElementById("count1").textContent = results["選択肢1"];
      document.getElementById("count2").textContent = results["選択肢2"];
      document.getElementById("count3").textContent = results["選択肢3"];
  }
}

// **自動更新を設定（3秒ごとに結果を更新）**
setInterval(updateAdminResults, 10000);

// ページ読み込み時に管理者ページを更新
window.onload = function() {
  updateAdminResults();
};
