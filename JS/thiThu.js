// Bộ câu hỏi
// Hàm để lấy dữ liệu từ API dựa trên số đề thi
function getTest(testNumber) {
  return axios
    .get(`http://sathachlaixe.cntt.yenbai.vn/api/getcauhoi/${testNumber}`)
    .then((res) => {
      console.log(res.data.data);
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

function getTime(testNumber) {
  return axios
    .get(`http://sathachlaixe.cntt.yenbai.vn/api/gettime/${testNumber}`)
    .then((res) => {
      return res.data.thoi_gian_tra_loi;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getQuestions(topic) {
  if (topic === "A1 - Đề 1") return await getTest(1);
  else if (topic === "A1 - Đề 2") return await getTest(2);
}

let currentQuestionIndex = 0;
let isQuizSubmitted = false;

//! DISABLED KHI NGƯỜI DÙNG CHƯA CHỌN ĐỀ TÀI
document.getElementById("topic-select").addEventListener("change", function () {
  const startButton = document.getElementById("start-quiz");
  startButton.disabled = !this.value;
});

//! Số lượng câu cần trả lời đúng và số lượng câu hỏi
let quantity = 3;

// KHI CLICK VÀO NÚT BẮT ĐẦU THÌ LÀM CÁC CÔNG VIỆC SAU
document
  .getElementById("start-quiz")
  .addEventListener("click", async function () {
    // reset bien isQuizSubmitted

    isQuizSubmitted = false;

    const quizContent = document.getElementById("quiz-content");
    // const selectionScreen = document.getElementById("selection-screen");
    const infoScreen = document.getElementById("info-screen");

    // THỜI GIAN THI
    startCountdown(20);

    // KHI CLICK VÀO NÚT BẮT ĐẦU THÌ NẾU ĐÃ CHỌN ĐỀ TÀI
    // 1. HIỂN THỊ QUIZ CONTENT (cha của answers-container và questions-container)
    // 2. HIỂN THỊ INFO SCREEN
    const selectedTopic = document.getElementById("topic-select").value;
    if (selectedTopic) {
      // !1. HIỂN THỊ QUIZ CONTENT
      quizContent.style.display = "block";
      // !2. HIỂN THỊ INFO SCREEN
      // Xử lý infoccreen trước khi hiển thị
      showInfoScreen();
      infoScreen.style.display = "block";
      //! 3. HIỂN THỊ CÂU HỎI ĐẦU TIÊN VÀ CÁC CÂU TRẢ LỜI BÊN PHẢI
      // const questions = getQuestions(selectedTopic).then((questions) => {
      //   return questions;
      // });
      const questions = await getQuestions(selectedTopic);
      showSelectAnswer(questions);
      showQuestionDetails(0, questions);
    }
  });

// --------------------  *  --------------------  *  ----------------------

//! XỬ LÝ HIỂN THỊ LÊN INFO SCREEN VÀ THÊM INFO SCREEN FINISH VÀ THAY ĐỔI CÁC TRẠNG THÁI CỦA INFO SCREEN
const showInfoScreen = async () => {
  // info-screen-finish
  const infoScreenFinish = document.getElementById("info-screen-finish");
  if (infoScreenFinish) {
    infoScreenFinish.style.display = "none";
  }

  // THAY ĐỔI CÁC TRẠNG THÁI CỦA INFO SCREEN
  let selectedTopic = document.getElementById("topic-select").value;

  document.getElementById("info-name").textContent =
    "Họ và tên: " + document.getElementById("user-name").value;
  document.getElementById("info-test").textContent =
    "Đề tài: " + selectedTopic + " |";
  document.getElementById("info-day").textContent =
    "Ngày: " + new Date().toLocaleDateString();
  document.getElementById("info-status").textContent = "Trạng thái: Đang thi  ";

  let questions = await getQuestions(selectedTopic);
  let quantityLength = questions.length;

  document.getElementById(
    "info-quantity"
  ).textContent = `Bạn cần trả lời đúng ${quantity}/${quantityLength} câu hỏi`;
};

//! TẠO VÀ XỬ LÝ BUTTON SUBMIT
// TẠO BUTTON BUTTON SUBMIT
const createSubmitButton = () => {
  const submitButton = document.createElement("button");
  submitButton.id = "submit-button";
  submitButton.classList = "btn btn-danger";
  submitButton.textContent = "KẾT THÚC";
  return submitButton;
};

//! TẠO VÀ XỬ LÝ BUTTON SUBMIT END************************************

//! ADD BUTTON VÀO ANSWER CONTAINER
const addSubmitButton = () => {
  const submitButton = createSubmitButton();
  const answersContainer = document.getElementById("answers-container");
  answersContainer.appendChild(submitButton);

  // XỬ LÝ KHI CLICK VÀO BUTTON SUBMIT
  submitButton.addEventListener("click", function () {
    isQuizSubmitted = true;
    const confirmation = confirm("Bạn có chắc chắn muốn nộp bài không?");

    // Nếu nhấn ok thì làm các cái sau:
    // 1. kiểm tra đáp án,
    // 2. show modal kết quả,
    // 3. tạo nội dung cho info-screen-finish,
    // 4. ẩn nút submit,
    // 5. hiển thị câu đầu tiên có đổi màu bg
    // 6. clear countdown

    if (confirmation) {
      clearInterval(countdownInterval);
      handleClickSubmitButton();
    }
  });
};

const handleClickSubmitButton = async () => {
  //! 1. kiểm tra đáp án
  let selectedTopic = document.getElementById("topic-select").value;
  let questions = await getQuestions(selectedTopic);
  const { correctCount, incorrectCount, unselectedCount } =
    checkAnswers(questions);

  // Cập nhật thông tin trạng thái thi
  document.getElementById("info-status").textContent = "Trạng thái: Đã thi";

  //! 2. tạo và show modal kết quả,
  // code for modal
  // Prepare the result content for Modal
  // đúng màu xanh đậu, trượt màu đỏ
  const resultContent = `
        <hr>
        <h5 class="pt-1">Kết quả thi:</h5>
        <p style="color: black; font-weight: 700;">Số câu đúng: ${correctCount} câu.</p>
        <p style="color: black; font-weight: 700;">Số câu sai: ${incorrectCount} câu.</p>
        <p style="color: black; font-weight: 700;">Số câu chưa chọn: ${unselectedCount} câu.</p>
        <p>Bạn cần trả lời đúng ${quantity} câu hỏi thì đậu.</p>
        <p style="color: white; background-color: ${
          correctCount >= quantity ? "#92b12d" : "#DD4470"
        }; border-radius: 8px; padding: 10px; text-align: center;"> ${
    correctCount < quantity ? "Bạn đã trượt." : "Bạn đã đậu."
  }
        </p>
        <hr>
    `;
  // Insert result content into modal body
  document.getElementById("resultModalBody").innerHTML = resultContent;
  // Display the modal
  $("#resultModal").modal("show");

  //! 3. tạo nội dung cho info-screen-finish,
  const infoScreenFinish = document.getElementById("info-screen-finish");
  infoScreenFinish.style.display = "block";
  while (infoScreenFinish.firstChild) {
    infoScreenFinish.removeChild(infoScreenFinish.firstChild);
  }
  const resultDiv = document.createElement("div");
  resultDiv.innerHTML = `
      <hr>
      <h5 class="pt-1">Kết quả thi:</h5>
      <p style="color: black; font-weight: 700;">Số câu đúng: ${correctCount} câu.</p>
      <p style="color: black; font-weight: 700;">Số câu sai: ${incorrectCount} câu.</p>
      <p style="color: black; font-weight: 700;">Số câu chưa chọn: ${unselectedCount} câu.</p>
      <p>Bạn cần trả lời đúng ${quantity} câu hỏi thì đậu.</p>
      <p style="color: white; background-color: ${
        correctCount >= quantity ? "#92b12d" : "#DD4470"
      };
      border-radius: 8px; padding: 10px; text-align: center;">
      ${correctCount < quantity ? "Bạn đã trượt." : "Bạn đã đậu."}
      </p>
      <hr>
      `;
  infoScreenFinish.appendChild(resultDiv);

  //! 4. ẩn nút submit,
  document.querySelector("#submit-button").style.display = "none";

  //! 5. hiển thị câu đầu tiên có đổi màu bg
  showQuestionDetails(0, questions);
};

//! SHOW ANSWER CONTAINER LỰA CHỌN CÁC CÂU TRẢ LỜI BÊN PHẢI
const showSelectAnswer = (questions) => {
  // TẠO ANSWERS CONTAINER
  const answersContainer = document.getElementById("answers-container");
  answersContainer.innerHTML = "";
  // TẠO 2 thẻ div col-6
  const col1 = document.createElement("div");
  col1.classList.add("col-6");
  const col2 = document.createElement("div");
  col2.classList.add("col-6");

  // TẠO 1 thẻ div row
  const rowContainer = document.createElement("div");
  rowContainer.classList.add("row");

  // ADD col1 và col2 vào rowContainer
  rowContainer.appendChild(col1);
  rowContainer.appendChild(col2);

  // THÊM ROW VÀO ANSWERS CONTAINER
  answersContainer.appendChild(rowContainer);
  // -------------------------------------------

  // quét qua mảng các câu trả lời, col div là cha của questionDiv
  questions.forEach((question, index) => {
    const colDiv = document.createElement("div");
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-detail");
    questionDiv.dataset.index = index;
    // colDiv là thẻ cha ở ngoài tác dụng là để hiển thị khi click vào câu hỏi
    questionDiv.addEventListener("click", () =>
      showQuestionDetails(index, questions)
    );
    colDiv.appendChild(questionDiv);

    // TẠO ANSWER DIV
    const answerDiv = document.createElement("div");
    answerDiv.classList.add("answer-option");
    answerDiv.dataset.index = index;
    answerDiv.innerHTML = `
    <strong>C${index + 1} </strong>
    ${question.dap_an
      .map(
        (answer, answerIndex) => `
          <label style="margin: 0;">
            ${answerIndex + 1}
            <input type="checkbox" name="answer-${index}" value="${
          answerIndex + 1
        }" style="width: 15px; height: 15px; margin: 0 2px 0 0;"
            >
          </label>`
      )
      .join("")}
  `;
    // xử lý answerdiv khi click vào
    answerDiv.addEventListener("click", (event) => {
      if (isQuizSubmitted) {
        const clickedIndex = Number(event.currentTarget.dataset.index);
        showQuestionDetails(clickedIndex, questions);
      } else {
        currentQuestionIndex = Number(event.currentTarget.dataset.index);
        const allAnswerDivs = document.querySelectorAll(".answer-option");
        allAnswerDivs.forEach((div) => (div.style.backgroundColor = ""));
        const clickedIndex = Number(event.currentTarget.dataset.index);
        showQuestionDetails(clickedIndex, questions);
        //click màu vàng nhạt
        event.currentTarget.style.backgroundColor = "#FFE3B3";
        event.currentTarget.style.borderRadius = "5px";
      }
    });

    colDiv.appendChild(answerDiv);

    if (index < 13) {
      col1.appendChild(colDiv);
    } else {
      col2.appendChild(colDiv);
    }
  });

  // ! THÊM BUTTON SUBMIT VÀO ANSWER CONTAINER
  addSubmitButton();
};

//! HIỂN THỊ 1 CÂU HỎI BÊN TRÁI ĐẦU VÀO LÀ INDEX VÀ QUESTIONS THẺ QUESTION-CONTAINER
function showQuestionDetails(index, questions) {
  const questionDetails = questions[index];
  const questionsContainer = document.getElementById("questions-container");
  //In ra màu xanh cho câu trả lời đúng ở phần câu hỏi
  questionsContainer.innerHTML = `
            <div class="question-number">
              <strong>
                Câu ${Number(index + 1)}: ${questionDetails.noi_dung}
              </strong>
            </div>

            ${questionDetails.dap_an
              .map(
                (answer, i) => `
            <div class="answer p-2"
            style="${
              isQuizSubmitted && questionDetails.dap_an_dung.includes(i + 1)
                ? "background-color: green; color: white; border-radius: 5px;"
                : ""
            };"
            >${i + 1}. ${answer}
            </div>`
              )
              .join("")}
        `;
}

// event.currentTarget.style.backgroundColor = "#FFE3B3";
// event.currentTarget.style.borderRadius = "5px";
//! HIỂN THỊ 1 CÂU HỎI BÊN TRÁI ĐẦU VÀO LÀ INDEX VÀ QUESTIONS THẺ QUESTION-CONTAINER END************************************

//! KIỂM TRA ĐÚNG SAI KHI NỘP BÀI TRẢ VỀ KẾT QUẢ correctCount, incorrectCount, unselectedCount
function checkAnswers(questions) {
  let correctCount = 0;
  let incorrectCount = 0;
  let unselectedCount = 0;
  const answersContainer = document.getElementById("answers-container");
  const answerDivs = answersContainer.querySelectorAll(".answer-option");
  isQuizSubmitted = true;
  questions.forEach((question, index) => {
    const checkboxes = document.querySelectorAll(
      `input[name="answer-${index}"]`
    );
    const selectedAnswers = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => parseInt(checkbox.value));

    const answerDiv = answerDivs[index];

    if (
      selectedAnswers.length === question.dap_an_dung.length &&
      question.dap_an_dung.every((answer) => selectedAnswers.includes(answer))
    ) {
      correctCount++;
      answerDiv.style.backgroundColor = "#C6DF76"; // nền câu hỏi xanh: trả lời đúng
    } else if (selectedAnswers.length === 0) {
      unselectedCount++;
      answerDiv.style.backgroundColor = "#FFE3B3"; // nền câu hỏi vàng: chưa trả lời
    } else {
      incorrectCount++;
      answerDiv.style.backgroundColor = "#DD4470"; // nền câu hỏi đỏ: trả lời sai
    }
    answerDiv.style.borderRadius = "5px";

    // Highlight correct answers in green
    answerDiv.querySelectorAll("label").forEach((label, labelIndex) => {
      if (question.dap_an_dung.includes(labelIndex + 1)) {
        // chỉnh màu text sang xanh nếu đúng
        label.style.borderRadius = "5px";
        label.style.padding = "3px";
        label.style.color = "white";
        label.style.backgroundColor = "#92b12d";
      }
    });
  });

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.disabled = true;
  });

  // isQuizSubmitted = true

  return { correctCount, incorrectCount, unselectedCount };
}
//! KIỂM TRA ĐÚNG SAI KHI NỘP BÀI TRẢ VỀ KẾT QUẢ correctCount, incorrectCount, unselectedCount END************************************

// ! SỬ DỤNG CÁC PHÍM TẮT
// --------------------  *  --------------------  *  ----------------------

// Sử dụng phím lên xuống trái phải

let questions = [];

document.addEventListener("keydown", async function (event) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
  }
  const allAnswerDivs = document.querySelectorAll(".answer-option");

  switch (event.key) {
    case "ArrowUp":
    case "ArrowLeft": {
      // Load questions if not loaded
      if (questions.length === 0) {
        const topic = document.getElementById("topic-select").value;
        questions = await getQuestions(topic);
      }

      // Move to the previous question
      currentQuestionIndex =
        (currentQuestionIndex - 1 + questions.length) % questions.length;
      showQuestionDetails(currentQuestionIndex, questions);

      if (!isQuizSubmitted) {
        allAnswerDivs.forEach((div) => (div.style.backgroundColor = ""));
        allAnswerDivs[currentQuestionIndex].style.backgroundColor = "#FFE3B3";
      } else {
        allAnswerDivs.forEach((div) => (div.style.border = ""));
        allAnswerDivs[currentQuestionIndex].style.border = " 2px solid blue";
      }
      break;
    }
    case "ArrowRight":
    case "ArrowDown": {
      // Load questions if not loaded
      if (questions.length === 0) {
        const topic = document.getElementById("topic-select").value;
        questions = await getQuestions(topic);
      }

      // Move to the next question
      currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
      showQuestionDetails(currentQuestionIndex, questions);

      // NẾU CHƯA NỘP BÀI THÌ KHI DI CHUYỂN CÂU HỎI SẼ HIỆN MÀU VÀNG
      if (!isQuizSubmitted) {
        allAnswerDivs.forEach((div) => (div.style.backgroundColor = ""));
        allAnswerDivs[currentQuestionIndex].style.backgroundColor = "#FFE3B3";
      }
      // NẾU ĐÃ NỘP BÀI THÌ KHI DI CHUYỂN CÂU HỎI SẼ HIỆN BORDER MÀU XANH
      else {
        allAnswerDivs.forEach((div) => (div.style.border = ""));
        allAnswerDivs[currentQuestionIndex].style.border = " 2px solid blue";
      }
      break;
    }
  }
});

// --------------------  *  --------------------  *  ----------------------

// Sử dụng phím 1 2 3 4

document.addEventListener("keydown", function (event) {
  const key = event.key;
  const validKeys = ["1", "2", "3", "4"];
  if (isQuizSubmitted) return;

  if (validKeys.includes(key)) {
    const questionIndex = currentQuestionIndex;
    const answerIndex = parseInt(key) - 1; // subtract 1 because array index starts from 0

    const checkbox = document.querySelector(
      `input[name="answer-${questionIndex}"][value="${answerIndex + 1}"]`
    );

    if (checkbox) {
      checkbox.checked = !checkbox.checked;
    }
  }
});

// --------------------  *  --------------------  *  ----------------------

// Sử dụng phím ESC để nộp bài
window.addEventListener("keydown", function (event) {
  if (isQuizSubmitted) return;
  if (event.key === "Escape") {
    const submitButton = document.getElementById("submit-button");
    if (submitButton) {
      submitButton.click();
      isQuizSubmitted = true;
    }
  }
});

// Sử dụng phím Enter để nộp bài
window.addEventListener("keydown", function (event) {
  if (isQuizSubmitted) return;

  if (event.key === "Enter") {
    const submitButton = document.getElementById("submit-button");
    if (submitButton) {
      submitButton.click();
    }
  }
});

let countdownInterval;
function startCountdown(duration) {
  let countdownElement = document.getElementById("countdown");
  countdownElement = " ";
  let remainingTime = duration;

  countdownInterval = setInterval(() => {
    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;

    countdownElement.textContent = `THỜI GIAN THI CÒN LẠI: ${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;

    remainingTime--;

    if (remainingTime < 0) {
      clearInterval(countdownInterval);
      const submitButton = document.getElementById("submit-button");
      if (submitButton) {
        handleClickSubmitButton();
      }
    }
  }, 1000);
}
