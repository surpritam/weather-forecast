$(document).ready((function(){const t="910b453d51e158407efef3c191df7dd5";function e(e){fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e}&appid=${t}&units=imperial`).then((t=>{if(!t.ok)throw new Error("City not found");return t.json()})).then((e=>{const n=`\n                    <h3>${e.name} (${(new Date).toLocaleDateString()}) <img src="http://openweathermap.org/img/w/${e.weather[0].icon}.png" alt="Weather icon"></h3>\n                    <p>Temp: ${e.main.temp} °F</p>\n                    <p>Humidity: ${e.main.humidity}%</p>\n                    <p>Wind Speed: ${e.wind.speed} MPH</p>\n                `;var a,r;$("#weather-result").html(n),a=e.coord.lat,r=e.coord.lon,fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${a}&lon=${r}&appid=${t}&units=imperial`).then((t=>t.json())).then((t=>{let e="<h3>5-Day Forecast:</h3>";for(let n=0;n<t.list.length;n+=8){const a=t.list[n];e+=`\n                        <div class="forecast-card col-md-2">\n                            <h5>${new Date(a.dt_txt).toLocaleDateString()}</h5>\n                            <img src="http://openweathermap.org/img/w/${a.weather[0].icon}.png" alt="Weather icon">\n                            <p>Temp: ${a.main.temp} °F</p>\n                            <p>Humidity: ${a.main.humidity}%</p>\n                            <p>Wind: ${a.wind.speed} MPH</p>\n                        </div>\n                    `}$("#forecast-cards").html(e)}))})).catch((t=>{$("#weather-result").html(`<p class="text-danger">${t.message}. Please try again.</p>`)}))}function n(){let t=JSON.parse(localStorage.getItem("searchHistory"))||[],e="<h4>Search History:</h4>";t.forEach((t=>{e+=`<button class="history-btn">${t}</button>`})),$("#search-history").html(e)}$("#weather-form").submit((function(t){t.preventDefault();const a=$("#city").val();e(a),function(t){let e=JSON.parse(localStorage.getItem("searchHistory"))||[];e.includes(t)||(e.push(t),localStorage.setItem("searchHistory",JSON.stringify(e))),n()}(a)})),$("#search-history").on("click",".history-btn",(function(){e($(this).text())})),n()}));