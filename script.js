const API_URL = `https://cbr-xml-daily.ru`;
const form = document.getElementById("formGet$");

const timeElement = document.getElementById("time");
const eurElement = document.getElementById("eur");
const usdElement = document.getElementById("usd");
const resElement = document.getElementById("res");
const resultBox = document.getElementById("resultBox");
const absoluteMaxInfo = document.getElementById("absoluteMaxInfo");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const EUR = data.Valute.EUR.Value;
    const USD = data.Valute.USD.Value;
    const rawDate = data.Date;

    // Критический потолок ровно под $10 000
    const absoluteMaxEur = (10000 * USD) / EUR;

    // Безопасный максимум с запасом в $350 на курсовые скачки
    const safeMaxEur = (9650 * USD) / EUR;

    // Форматируем дату ЦБ
    const formattedDate = new Date(rawDate).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Отрисовка данных (округляем строго вниз Math.floor)
    timeElement.textContent = `Курсы ЦБ на: ${formattedDate}`;
    eurElement.textContent = `${EUR.toFixed(2)} ₽`;
    usdElement.textContent = `${USD.toFixed(2)} ₽`;

    resultBox.style.display = "block";
    resElement.textContent = `${(Math.floor(safeMaxEur * 100) / 100).toLocaleString("ru-RU")} EUR`;

    absoluteMaxInfo.innerHTML = `Критический максимум: ${(Math.floor(absoluteMaxEur * 100) / 100).toLocaleString("ru-RU")} EUR.<br>Оставлен запас $350 на колебания курсов ФТС.`;
  } catch (error) {
    alert("Не удалось загрузить актуальные курсы валют.");
  }
});
