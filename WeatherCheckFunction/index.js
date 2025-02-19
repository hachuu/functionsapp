const axios = require("axios");

module.exports = async function (context, myTimer) {
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
    const CITY = "분당"; // 원하는 도시 입력
    const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

    try {
        // OpenWeather API 호출
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=37.4&lon=127.1&appid=${OPENWEATHER_API_KEY}`);

        const weather = response.data.weather[0].main;

        // 응답 확인 로그
        context.log('Weather data received: ', response.data);

        // 눈 또는 비가 내리면 Slack 알림 전송
        if (weather !== "Rain" || weather === "Snow") {
            await axios.post(SLACK_WEBHOOK_URL, {
                text: `🚨 [날씨 알림] 현재 ${CITY}에 ${weather === "Rain" ? "비가" : "눈이"} 내리고 있습니다. ☔❄`
            });
            context.log(`Slack 알림 전송: ${weather}`);
        } else if (weather === "Clear") {
            await axios.post(SLACK_WEBHOOK_URL, {
                "text": ":sunny: *오늘은 맑고 화창한 날씨입니다!* :sunny: \n\n푸른 하늘과 부드러운 바람이 기분 좋게 해주는 하루입니다. 햇살을 만끽하세요! :sun_behind_small_cloud:"
            });
        } else {
            context.log(`날씨 상태: ${weather} (알림 없음)`);

        }
    } catch (error) {
        context.log(`오류 발생: ${error.message}`);
    }
};

// const axios = require('axios');
// const fs = require('fs');

// module.exports = async function (context, myTimer) {
//     context.log('Function triggered at', new Date().toISOString());

//     try {
//         const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
//         const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
//         const CITY = "분당"; // 원하는 도시 입력

//         // OpenWeather API 호출
//         const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=37.4&lon=127.1&appid=${OPENWEATHER_API_KEY}`);

//         // 현재 날씨 상태
//         const currentWeather = response.data.weather[0].main;  // 예: 'Clear', 'Rain', 'Snow' 등

//         // 이전 날씨 상태 로드 (파일에서 저장된 이전 날씨 정보를 읽어옴)
//         const previousWeather = getPreviousWeather();

//         if (!previousWeather) {
//             if (currentWeather === "Rain" || currentWeather === "Snow") {
//                 await axios.post(SLACK_WEBHOOK_URL, {
//                     text: `🚨 [날씨 알림] 현재 ${CITY}에 ${weather === "Rain" ? "비" : "눈"}가 내리고 있습니다. ☔❄`
//                 });
//                 context.log(`Slack 알림 전송: ${weather}`);
//             } else if (currentWeather === "Clear") {
//                 await axios.post(SLACK_WEBHOOK_URL, {
//                     "text": ":sunny: *오늘은 맑고 화창한 날씨입니다!* :sunny: \n\n푸른 하늘과 부드러운 바람이 기분 좋게 해주는 하루입니다. 햇살을 만끽하세요! :sun_behind_small_cloud:"
//                 });
//             } else {
//                 context.log(`날씨 상태: ${currentWeather} (알림 없음)`);
//             }
//             // 새로운 날씨 상태를 저장
//             saveCurrentWeather(currentWeather);
//             return;
//         }

//         // 날씨가 변화한 경우에만 Slack 알림을 보내기
//         if (previousWeather !== currentWeather) {
//             context.log(`Weather changed from ${previousWeather} to ${currentWeather}`);
            
//             if (currentWeather === "Rain" || currentWeather === "Snow") {
//                 await axios.post(SLACK_WEBHOOK_URL, {
//                     text: `🚨 [날씨 알림] 현재 ${CITY}에 ${currentWeather === "Rain" ? "비" : "눈"}가 내리고 있습니다. 조심히 출근 하세요!! ☔❄`
//                 });
//                 context.log(`Slack 알림 전송: ${currentWeather}`);
//             } else if (currentWeather === "Clear") {
//                 await axios.post(SLACK_WEBHOOK_URL, {
//                     "text": ":sunny: *오늘은 맑고 화창한 날씨입니다!* :sunny: \n\n햇살을 만끽하세요! :얼굴이_있는_태양:"
//                 });
//             } else {
//                 context.log(`날씨 상태: ${currentWeather} (알림 없음)`);
//             }
//             // 새로운 날씨 상태를 저장
//             saveCurrentWeather(currentWeather);
//         } else {
//             context.log('Weather did not change, no Slack notification sent');
//         }
//     } catch (error) {
//         context.log('Error occurred:', error);
//     }
// };

// // 이전 날씨 상태를 파일에서 읽어오는 함수
// function getPreviousWeather() {
//     try {
//         if (fs.existsSync('previousWeather.json')) {
//             const data = fs.readFileSync('previousWeather.json', 'utf8');
//             const parsedData = JSON.parse(data);
//             return parsedData.weather;
//         }
//     } catch (error) {
//         console.log('Error reading previous weather:', error);
//     }
//     return null;  // 이전 날씨가 없으면 null 반환
// }

// // 현재 날씨 상태를 파일에 저장하는 함수
// function saveCurrentWeather(weather) {
//     try {
//         const data = JSON.stringify({ weather });
//         fs.writeFileSync('previousWeather.json', data, 'utf8');
//     } catch (error) {
//         console.log('Error saving current weather:', error);
//     }
// }
