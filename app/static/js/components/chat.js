debugger
// Code by Kunal to add file accessing path on 24-07-2024
var path = localStorage.getItem('accessPath');


// Code by Kunal on 06-02-2024
$.getScript(path + 'static/js/components/bootstrap-datepicker.js');
$.getScript(path + 'static/css/bootstrap-datepicker.css');

const converter = new showdown.Converter();
function scrollToBottomOfResults() {
  const terminalResultsDiv = document.getElementById("chats");
  terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}

/**
 * Set user response on the chat screen
 * @param {String} message user message
 */
function setUserResponse(message) {
   // Code by Kunal 21-11-2023
//   debugger
//   if(message.toLowerCase().includes('logout') || message.toLowerCase().includes('end') || message.toLowerCase().includes('exit') || message.toLowerCase().includes('bye')){
//     $(".chats").fadeOut("normal", () => {
//       $(".chats").html("");
//       $(".chats").fadeIn();
//     });
//   }
   // Code end by Kunal
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
  const user_response = `<img class="userAvatar d-none" src='${path}static/img/userAvatar.jpg'><p class="userMsg mr-2">${message} </br><span class='time-field float-right pt-1 pb-1 text-light' style="font-size: 10px;">${currentTime}</span></p><div class="clearfix"></div>`;
  $(user_response).appendTo(".chats").show("slow");

  $(".usrInput").val("");
  scrollToBottomOfResults();
  showBotTyping();
  //  $(".suggestions").remove();
  //    $(".suggestions").hide()
}

/**
 * returns formatted bot response
 * @param {String} text bot message response's text
 *
 */
function getBotResponse(text) {
  botResponse = `<img class="botAvatar" src="${path}static/img/botAvatar.png"/><span class="botMsg">${text}</span><div class="clearfix"></div>`;
  return botResponse;
}

/**
 * renders bot response on to the chat screen
 * @param {Array} response json array containing different types of bot response
 *
 * for more info: `https://rasa.com/docs/rasa/connectors/your-own-website#request-and-response-format`
 */
function setBotResponse(response) {
  debugger
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
  //debugger
  // renders bot response after 500 milliseconds
  setTimeout(() => {
    hideBotTyping();
    if (response.length < 1) {
      // if there is no response from Rasa, send  fallback message to the user
      const fallbackMsg = "I am facing some issues, please try again later!!!";

      const BotResponse = `<img class="botAvatar" src="${path}static/img/botAvatar.png"/><p class="botMsg">${fallbackMsg}</p><div class="clearfix"></div>`;

      $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
      scrollToBottomOfResults();
    } else {
      // if we get response from Rasa
      for (let i = 0; i < response.length; i += 1) {
        // check if the response contains "text"
        if (Object.hasOwnProperty.call(response[i], "text")) {
          if (response[i].text != null) {
            // convert the text to mardown format using showdown.js(https://github.com/showdownjs/showdown);            
            let botResponse;
            let html = converter.makeHtml(response[i].text);
            html = html
              .replaceAll("<p>", "")
              .replaceAll("</p>", "")
              .replaceAll("<strong>", "<b>")
              .replaceAll("</strong>", "</b>");
            html = html.replace(/(?:\r\n|\r|\n)/g, "<br>");
            console.log(html);
            // check for blockquotes
            if (html.includes("<blockquote>")) {
              html = html.replaceAll("<br>", "");
              botResponse = getBotResponse(html);
            }
            // check for image
            if (html.includes("<img")) {
              html = html.replaceAll("<img", '<img class="imgcard_mrkdwn" ');
              botResponse = getBotResponse(html);
            }
            // check for preformatted text
            if (html.includes("<pre") || html.includes("<code>")) {
              botResponse = getBotResponse(html);
            }
            // check for list text
            if (html.includes("<ul") || html.includes("<ol") || html.includes("<li") || html.includes("<h3")) {
              html = html.replaceAll("<br>", "");
              // botResponse = `<img class="botAvatar" src="${path}static/img/Epilogo.png"/><span class="botMsg">${html}</span><div class="clearfix"></div>`;
              botResponse = getBotResponse(html);
            }
            // Code added for handle table binding issue on bot
            if (html.includes('<table') || html.includes('<div')) {
              botResponse = `<img class="botAvatar" src="${path}static/img/botAvatar.png"/><div class="botMsg">${html}</div><div class="clearfix"></div>`;
              // botResponse = `<img class="botAvatar" src="${path}static/img/botAvatar.png"/><p class="botMsg">${response[i].text}</p><div class="clearfix"></div>`;
              // $(botResponse).appendTo(".chats").hide().fadeIn(1000);
            }
            else {
              debugger
              // if no markdown formatting found, render the text as it is.  
              if (!botResponse) {
                botResponse = `<img class="botAvatar" src="${path}static/img/botAvatar.png"/><p class="botMsg">${response[i].text} </br><span class='time-field float-right pt-1 pb-1' style="font-size: 10px;">${currentTime}</span></p><div class="clearfix"></div>`;
              }
            }

            var loginBtn = `<div class="loginBTN mb-2 ml-5 mt-1 pl-1">
            <button class="login-btn" id="chatbotLoginBtn">Login<i class='fa fa-sign-in d-none signin_logo ml-1' style="font-size: 15px;"></i></button>
            </div>`

            var loginModal = `<div class="col-12 d-none" id="loginModal">
            <h4 class="text-center mt-0">Login</h4>
            <form class="col-10 mx-auto">
              <div class="form-group mb-0">
                <!-- <label for="exampleInputEmail1">Enter ECN</label> -->
                <input type="text" class="form-control mb-0" id="ecn" aria-describedby="emailHelp" placeholder="e01234<ECN No.>"
                  required>
                <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
              </div>
              <div class="form-group mb-0">
                <!-- <label for="exampleInputPassword1">Password</label> -->
                <input type="password" class="form-control mb-0" id="ecnpassword" placeholder="Win Domain Password" required>
              </div>
              <div id="login-message">
              </div>
              <div class="text-center d-flex pl-1 mt-3">
                <button type="submit" id="submitbutton" class="mt-2 submit-BTN">SUBMIT<i class="fa fa-check ml-2" style="font-size: 16px;"></i></button>
                <button type="" id="closeModal" class="ml-2 mt-2">CANCEL<i class="fa fa-times ml-2" style="font-size: 16px;"></i></button>
              </div>
            </form>
          </div>`
            //            var chkDtPicker = ['enter a valid month/year', 'Month-Year']
            // Code by Nikita 16-11-2023
            var rating_model = ` <div class="container" style="width: 70%">
            <div class="feedback">
              <div class="rating">    
               <input type="radio" name="rating" class="star" id="rating-5" data-rating="5">
                <label for="rating-5"></label>s
                <input type="radio" name="rating" class="star" id="rating-4" data-rating="4">
                <label for="rating-4"></label>
                <input type="radio" name="rating" class="star" id="rating-3" data-rating="3">
                <label for="rating-3"></label>
                <input type="radio" name="rating" class="star" id="rating-2" data-rating="2">
                <label for="rating-2"></label>
                <input type="radio" name="rating" class="star" id="rating-1" data-rating="1">
                <label for="rating-1"></label>
    
                <div class="emoji-wrapper ml-3">
                  <div class="emoji">
                    <svg class="rating-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <circle cx="256" cy="256" r="256" fill="#ffd93b"/>
                    <path d="M512 256c0 141.44-114.64 256-256 256-80.48 0-152.32-37.12-199.28-95.28 43.92 35.52 99.84 56.72 160.72 56.72 141.36 0 256-114.56 256-256 0-60.88-21.2-116.8-56.72-160.72C474.8 103.68 512 175.52 512 256z" fill="#f4c534"/>
                    <ellipse transform="scale(-1) rotate(31.21 715.433 -595.455)" cx="166.318" cy="199.829" rx="56.146" ry="56.13" fill="#fff"/>
                    <ellipse transform="rotate(-148.804 180.87 175.82)" cx="180.871" cy="175.822" rx="28.048" ry="28.08" fill="#3e4347"/>
                    <ellipse transform="rotate(-113.778 194.434 165.995)" cx="194.433" cy="165.993" rx="8.016" ry="5.296" fill="#5a5f63"/>
                    <ellipse transform="scale(-1) rotate(31.21 715.397 -1237.664)" cx="345.695" cy="199.819" rx="56.146" ry="56.13" fill="#fff"/>
                    <ellipse transform="rotate(-148.804 360.25 175.837)" cx="360.252" cy="175.84" rx="28.048" ry="28.08" fill="#3e4347"/>
                    <ellipse transform="scale(-1) rotate(66.227 254.508 -573.138)" cx="373.794" cy="165.987" rx="8.016" ry="5.296" fill="#5a5f63"/>
                    <path d="M370.56 344.4c0 7.696-6.224 13.92-13.92 13.92H155.36c-7.616 0-13.92-6.224-13.92-13.92s6.304-13.92 13.92-13.92h201.296c7.696.016 13.904 6.224 13.904 13.92z" fill="#3e4347"/>
                  </svg>
                    <svg class="rating-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <circle cx="256" cy="256" r="256" fill="#ffd93b"/>
                    <path d="M512 256A256 256 0 0 1 56.7 416.7a256 256 0 0 0 360-360c58.1 47 95.3 118.8 95.3 199.3z" fill="#f4c534"/>
                    <path d="M328.4 428a92.8 92.8 0 0 0-145-.1 6.8 6.8 0 0 1-12-5.8 86.6 86.6 0 0 1 84.5-69 86.6 86.6 0 0 1 84.7 69.8c1.3 6.9-7.7 10.6-12.2 5.1z" fill="#3e4347"/>
                    <path d="M269.2 222.3c5.3 62.8 52 113.9 104.8 113.9 52.3 0 90.8-51.1 85.6-113.9-2-25-10.8-47.9-23.7-66.7-4.1-6.1-12.2-8-18.5-4.2a111.8 111.8 0 0 1-60.1 16.2c-22.8 0-42.1-5.6-57.8-14.8-6.8-4-15.4-1.5-18.9 5.4-9 18.2-13.2 40.3-11.4 64.1z" fill="#f4c534"/>
                    <path d="M357 189.5c25.8 0 47-7.1 63.7-18.7 10 14.6 17 32.1 18.7 51.6 4 49.6-26.1 89.7-67.5 89.7-41.6 0-78.4-40.1-82.5-89.7A95 95 0 0 1 298 174c16 9.7 35.6 15.5 59 15.5z" fill="#fff"/>
                    <path d="M396.2 246.1a38.5 38.5 0 0 1-38.7 38.6 38.5 38.5 0 0 1-38.6-38.6 38.6 38.6 0 1 1 77.3 0z" fill="#3e4347"/>
                    <path d="M380.4 241.1c-3.2 3.2-9.9 1.7-14.9-3.2-4.8-4.8-6.2-11.5-3-14.7 3.3-3.4 10-2 14.9 2.9 4.9 5 6.4 11.7 3 15z" fill="#fff"/>
                    <path d="M242.8 222.3c-5.3 62.8-52 113.9-104.8 113.9-52.3 0-90.8-51.1-85.6-113.9 2-25 10.8-47.9 23.7-66.7 4.1-6.1 12.2-8 18.5-4.2 16.2 10.1 36.2 16.2 60.1 16.2 22.8 0 42.1-5.6 57.8-14.8 6.8-4 15.4-1.5 18.9 5.4 9 18.2 13.2 40.3 11.4 64.1z" fill="#f4c534"/>
                    <path d="M155 189.5c-25.8 0-47-7.1-63.7-18.7-10 14.6-17 32.1-18.7 51.6-4 49.6 26.1 89.7 67.5 89.7 41.6 0 78.4-40.1 82.5-89.7A95 95 0 0 0 214 174c-16 9.7-35.6 15.5-59 15.5z" fill="#fff"/>
                    <path d="M115.8 246.1a38.5 38.5 0 0 0 38.7 38.6 38.5 38.5 0 0 0 38.6-38.6 38.6 38.6 0 1 0-77.3 0z" fill="#3e4347"/>
                    <path d="M131.6 241.1c3.2 3.2 9.9 1.7 14.9-3.2 4.8-4.8 6.2-11.5 3-14.7-3.3-3.4-10-2-14.9 2.9-4.9 5-6.4 11.7-3 15z" fill="#fff"/>
                  </svg>
                    <svg class="rating-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <circle cx="256" cy="256" r="256" fill="#ffd93b"/>
                    <path d="M512 256A256 256 0 0 1 56.7 416.7a256 256 0 0 0 360-360c58.1 47 95.3 118.8 95.3 199.3z" fill="#f4c534"/>
                    <path d="M336.6 403.2c-6.5 8-16 10-25.5 5.2a117.6 117.6 0 0 0-110.2 0c-9.4 4.9-19 3.3-25.6-4.6-6.5-7.7-4.7-21.1 8.4-28 45.1-24 99.5-24 144.6 0 13 7 14.8 19.7 8.3 27.4z" fill="#3e4347"/>
                    <path d="M276.6 244.3a79.3 79.3 0 1 1 158.8 0 79.5 79.5 0 1 1-158.8 0z" fill="#fff"/>
                    <circle cx="340" cy="260.4" r="36.2" fill="#3e4347"/>
                    <g fill="#fff">
                      <ellipse transform="rotate(-135 326.4 246.6)" cx="326.4" cy="246.6" rx="6.5" ry="10"/>
                      <path d="M231.9 244.3a79.3 79.3 0 1 0-158.8 0 79.5 79.5 0 1 0 158.8 0z"/>
                    </g>
                    <circle cx="168.5" cy="260.4" r="36.2" fill="#3e4347"/>
                    <ellipse transform="rotate(-135 182.1 246.7)" cx="182.1" cy="246.7" rx="10" ry="6.5" fill="#fff"/>
                  </svg>
                    <svg class="rating-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <circle cx="256" cy="256" r="256" fill="#ffd93b"/>
              <path d="M407.7 352.8a163.9 163.9 0 0 1-303.5 0c-2.3-5.5 1.5-12 7.5-13.2a780.8 780.8 0 0 1 288.4 0c6 1.2 9.9 7.7 7.6 13.2z" fill="#3e4347"/>
              <path d="M512 256A256 256 0 0 1 56.7 416.7a256 256 0 0 0 360-360c58.1 47 95.3 118.8 95.3 199.3z" fill="#f4c534"/>
              <g fill="#fff">
                <path d="M115.3 339c18.2 29.6 75.1 32.8 143.1 32.8 67.1 0 124.2-3.2 143.2-31.6l-1.5-.6a780.6 780.6 0 0 0-284.8-.6z"/>
                <ellipse cx="356.4" cy="205.3" rx="81.1" ry="81"/>
              </g>
              <ellipse cx="356.4" cy="205.3" rx="44.2" ry="44.2" fill="#3e4347"/>
              <g fill="#fff">
                <ellipse transform="scale(-1) rotate(45 454 -906)" cx="375.3" cy="188.1" rx="12" ry="8.1"/>
                <ellipse cx="155.6" cy="205.3" rx="81.1" ry="81"/>
              </g>
              <ellipse cx="155.6" cy="205.3" rx="44.2" ry="44.2" fill="#3e4347"/>
              <ellipse transform="scale(-1) rotate(45 454 -421.3)" cx="174.5" cy="188" rx="12" ry="8.1" fill="#fff"/>
            </svg>
                    <svg class="rating-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <circle cx="256" cy="256" r="256" fill="#ffd93b"/>
                    <path d="M512 256A256 256 0 0 1 56.7 416.7a256 256 0 0 0 360-360c58.1 47 95.3 118.8 95.3 199.3z" fill="#f4c534"/>
                    <path d="M232.3 201.3c0 49.2-74.3 94.2-74.3 94.2s-74.4-45-74.4-94.2a38 38 0 0 1 74.4-11.1 38 38 0 0 1 74.3 11.1z" fill="#e24b4b"/>
                    <path d="M96.1 173.3a37.7 37.7 0 0 0-12.4 28c0 49.2 74.3 94.2 74.3 94.2C80.2 229.8 95.6 175.2 96 173.3z" fill="#d03f3f"/>
                    <path d="M215.2 200c-3.6 3-9.8 1-13.8-4.1-4.2-5.2-4.6-11.5-1.2-14.1 3.6-2.8 9.7-.7 13.9 4.4 4 5.2 4.6 11.4 1.1 13.8z" fill="#fff"/>
                    <path d="M428.4 201.3c0 49.2-74.4 94.2-74.4 94.2s-74.3-45-74.3-94.2a38 38 0 0 1 74.4-11.1 38 38 0 0 1 74.3 11.1z" fill="#e24b4b"/>
                    <path d="M292.2 173.3a37.7 37.7 0 0 0-12.4 28c0 49.2 74.3 94.2 74.3 94.2-77.8-65.7-62.4-120.3-61.9-122.2z" fill="#d03f3f"/>
                    <path d="M411.3 200c-3.6 3-9.8 1-13.8-4.1-4.2-5.2-4.6-11.5-1.2-14.1 3.6-2.8 9.7-.7 13.9 4.4 4 5.2 4.6 11.4 1.1 13.8z" fill="#fff"/>
                    <path d="M381.7 374.1c-30.2 35.9-75.3 64.4-125.7 64.4s-95.4-28.5-125.8-64.2a17.6 17.6 0 0 1 16.5-28.7 627.7 627.7 0 0 0 218.7-.1c16.2-2.7 27 16.1 16.3 28.6z" fill="#3e4347"/>
                    <path d="M256 438.5c25.7 0 50-7.5 71.7-19.5-9-33.7-40.7-43.3-62.6-31.7-29.7 15.8-62.8-4.7-75.6 34.3 20.3 10.4 42.8 17 66.5 17z" fill="#e24b4b"/>
                  </svg>
                    <svg class="rating-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <g fill="#ffd93b">
                      <circle cx="256" cy="256" r="256"/>
                      <path d="M512 256A256 256 0 0 1 56.8 416.7a256 256 0 0 0 360-360c58 47 95.2 118.8 95.2 199.3z"/>
                    </g>
                    <path d="M512 99.4v165.1c0 11-8.9 19.9-19.7 19.9h-187c-13 0-23.5-10.5-23.5-23.5v-21.3c0-12.9-8.9-24.8-21.6-26.7-16.2-2.5-30 10-30 25.5V261c0 13-10.5 23.5-23.5 23.5h-187A19.7 19.7 0 0 1 0 264.7V99.4c0-10.9 8.8-19.7 19.7-19.7h472.6c10.8 0 19.7 8.7 19.7 19.7z" fill="#e9eff4"/>
                    <path d="M204.6 138v88.2a23 23 0 0 1-23 23H58.2a23 23 0 0 1-23-23v-88.3a23 23 0 0 1 23-23h123.4a23 23 0 0 1 23 23z" fill="#45cbea"/>
                    <path d="M476.9 138v88.2a23 23 0 0 1-23 23H330.3a23 23 0 0 1-23-23v-88.3a23 23 0 0 1 23-23h123.4a23 23 0 0 1 23 23z" fill="#e84d88"/>
                    <g fill="#38c0dc">
                      <path d="M95.2 114.9l-60 60v15.2l75.2-75.2zM123.3 114.9L35.1 203v23.2c0 1.8.3 3.7.7 5.4l116.8-116.7h-29.3z"/>
                    </g>
                    <g fill="#d23f77">
                      <path d="M373.3 114.9l-66 66V196l81.3-81.2zM401.5 114.9l-94.1 94v17.3c0 3.5.8 6.8 2.2 9.8l121.1-121.1h-29.2z"/>
                    </g>
                    <path d="M329.5 395.2c0 44.7-33 81-73.4 81-40.7 0-73.5-36.3-73.5-81s32.8-81 73.5-81c40.5 0 73.4 36.3 73.4 81z" fill="#3e4347"/>
                    <path d="M256 476.2a70 70 0 0 0 53.3-25.5 34.6 34.6 0 0 0-58-25 34.4 34.4 0 0 0-47.8 26 69.9 69.9 0 0 0 52.6 24.5z" fill="#e24b4b"/>
                    <path d="M290.3 434.8c-1 3.4-5.8 5.2-11 3.9s-8.4-5.1-7.4-8.7c.8-3.3 5.7-5 10.7-3.8 5.1 1.4 8.5 5.3 7.7 8.6z" fill="#fff" opacity=".2"/>
                  </svg>
                  </div>
                </div>
              </div>
                <button type="submit" id="submitRatingBTN" class="mt-1 ml-2 mb-2 submit-BTN">SUBMIT<i class="fa fa-check ml-2" style="font-size: 16px;"></i></button>
            </div>
          </div>`;

            document.addEventListener('click', function (event) {
              const clickedStar = event.target.closest('.star');
              if (clickedStar) {
                const selectedRating = clickedStar.getAttribute('data-rating');
                localStorage.setItem('selectedRating', selectedRating);
                console.log('Selected Rating:', selectedRating);
              }
            });
            // Code end by Nikita

            if (botResponse.includes('please log in')) {
              $('#ecnpassword, #ecn').val('');
              $(botResponse).appendTo(".chats").hide().fadeIn(1000);
              $(loginBtn).appendTo(".chats").hide().fadeIn(1000);
              $(loginModal).appendTo(".chats").hide().fadeIn(1000);              
            }
            else if (botResponse.includes('enter a valid month/year') || botResponse.includes('Mar-2023') || botResponse.includes('Month-Year')) {
              debugger
              $(botResponse).appendTo(".chats").hide().fadeIn(1000);
              if (!$('#DtPicker').is(':visible')) {
                // botResponse = `<input type="text" class="mt-2" value="Select Date and Time" id="datetimepicker" autocomplete="off" /><i class="fa fa-calendar dt-cal-icon"></i>`
                // botResponse = `<input class='mt-1' type="month" id="DtTmPicker" name="start" min="${localStorage.getItem('UserDOJ')}" max="${MaxMntYrs }" value="${MaxMntYrs}" 
                // onchange=DtTmPickerChangeHandler(event) style="margin-left: 46px; border: 2px solid #d2d3d6; border-radius: 5px;" />`

                // Code by Kunal on 06-02-2024 for Month Picker
                botResponse = `<input type="text" class="ml-5 mt-1" id="DtPicker" placeholder="Select Month" autocomplete="false">
                <i class='fa fa-calendar' style="font-size: 21px; position: relative; left: -6%; top: 1.5px; color: #b7414d;"></i></input>`
                $(botResponse).empty().appendTo(".chats").hide().fadeIn(1000);
                $('#DtPicker').datepicker({
                  format: "mm/yyyy",
                  startDate: localStorage.getItem('UserDOJ'),
                  endDate: '-1m',
                  minViewMode: 1,
                  maxViewMode: 2,
                });
                // Code end by Kunal
                scrollToBottomOfResults();
              }
              else {
                debugger
                $('#DtPicker').remove();
                // botResponse = `<input type="text" class="mt-2" value="Select Date and Time" id="datetimepicker" autocomplete="off" /><i class="fa fa-calendar dt-cal-icon"></i>`
                // botResponse = `<input class='mt-1' type="month" id="DtTmPicker" name="start" min="${localStorage.getItem('UserDOJ')}" max="${MaxMntYrs}" value="${MaxMntYrs}" 
                // onchange=DtTmPickerChangeHandler(event) style="margin-left: 46px; border: 2px solid #d2d3d6; border-radius: 5px;" />`

                // Code by Kunal on 06-02-2024 for Month Picker
                botResponse = `<input type="text" class="ml-5 mt-1" id="DtPicker" placeholder="Select Month" autocomplete="false">
                <i class='fa fa-calendar' style="font-size: 21px; position: relative; left: -6%; top: 1.5px; color: #b7414d;"></i></input>`
                $(botResponse).empty().appendTo(".chats").hide().fadeIn(1000);
                $('#DtPicker').datepicker({
                  format: "mm/yyyy",
                  startDate: localStorage.getItem('UserDOJ'),
                  endDate: '-1m',
                  minViewMode: 1,
                  maxViewMode: 2,
                });
                scrollToBottomOfResults();
                // Code end by Kunal
              }
            }
            else if (botResponse.includes('with your review')) {
              // Write code for rating the bot
              // Code by Nikita 15-11-2023
              $(botResponse).appendTo(".chats").hide().fadeIn(1000);
              $(rating_model).appendTo(".chats").hide().fadeIn(1000);
              $('.menuChips').css('pointer-events', 'none')
              $('.keypad').addClass('d-none');
              // Code end by Nikita
            }
            else if(botResponse.includes('please click on login')){
              $('#ecnpassword, #ecn').val('');
              $(botResponse).appendTo(".chats").hide().fadeIn(1000);
              $(loginBtn).appendTo(".chats").hide().fadeIn(1000);
              $(loginModal).appendTo(".chats").hide().fadeIn(1000); 
            }
            else if (botResponse.includes('Please do visit again')) {
              //            Code  by Kunal 23-11-2023
              $(botResponse).appendTo(".chats").hide().fadeIn(1000);
              $('#logoutbtn').addClass('d-none');
              localStorage.setItem('islogedIn', 'false');
              $('#userInput').css('pointer-events' , 'none')
              //               Code end by Kunal
            }
            else {
              // append the bot response on to the chat screen        
              // if(!tableStuc){
                $(botResponse).appendTo(".chats").hide().fadeIn(1000);
              // }
              // else{
              //   $('.appendTable').append(tableStucture);
              // }
            }
          }
        }

        // check if the response contains "images"
        if (Object.hasOwnProperty.call(response[i], "image")) {
          if (response[i].image !== null) {
            const BotResponse = `<div class="singleCard"><img class="imgcard" src="${response[i].image}"></div><div class="clearfix">`;
            $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
          }
        }

        // check if the response contains "buttons"
        if (Object.hasOwnProperty.call(response[i], "buttons")) {
          if (response[i].buttons.length > 0) {
            addSuggestion(response[i].buttons);
          }
        }

        // check if the response contains "attachment"
        if (Object.hasOwnProperty.call(response[i], "attachment")) {
          if (response[i].attachment != null) {
            if (response[i].attachment.type === "video") {
              // check if the attachment type is "video"
              const video_url = response[i].attachment.payload.src;

              const BotResponse = `<div class="video-container"> <iframe src="${video_url}" frameborder="0" allowfullscreen></iframe> </div>`;
              $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
            }
          }
        }
        // check if the response contains "custom" message
        if (Object.hasOwnProperty.call(response[i], "custom")) {
          const { payload } = response[i].custom;

          if (response[i].custom.type === "video") {
            const fallbackMsg = '<!DOCTYPE html> <html> <head> <meta name="viewport" content="width=device-width, initial-scale=1"> <link rel="stylesheet" type="text/css" href="D:/Rasa_update/template/login_min.css" /> </head> <body>  <form id="login_form">  <div class="container"> <input type="text" placeholder="Enter ECN" id="Id_ecn" name="ecn" required> <input type="password" placeholder="Enter Password" id="Id_pass" name="password" required> <button type="button" name="butn" id="Btn_Login">Login</button> </div> </form> </body> </html>';

            const BotResponse = `<img id="lgid" class="botAvatar" src="${path}static/img/botAvatar.png"/><class="botMsg">${fallbackMsg}<div class="clearfix"></div>`;

            $(BotResponse).appendTo(".chats").hide().fadeIn(500);
            // check if the custom payload type is "quickReplies"
            //            const quickRepliesData = response[i].custom.data;
            //            showQuickReplies(quickRepliesData);
            //            return;
          }

          // check if the custom payload type is "pdf_attachment"
          if (payload === "pdf_attachment") {
            renderPdfAttachment(response[i]);
            return;
          }

          // check if the custom payload type is "dropDown"
          if (payload === "dropDown") {
            const dropDownData = response[i].custom.data;
            renderDropDwon(dropDownData);
            return;
          }

          // check if the custom payload type is "location"
          if (payload === "location") {
            $("#userInput").prop("disabled", true);
            getLocation();
            scrollToBottomOfResults();
            return;
          }

          // check if the custom payload type is "cardsCarousel"
          if (payload === "cardsCarousel") {
            const restaurantsData = response[i].custom.data;
            showCardsCarousel(restaurantsData);
            return;
          }

          // check if the custom payload type is "chart"
          if (payload === "chart") {
            /**
             * sample format of the charts data:
             *  var chartData =  { "title": "Leaves", "labels": ["Sick Leave", "Casual Leave", "Earned Leave", "Flexi Leave"], "backgroundColor": ["#36a2eb", "#ffcd56", "#ff6384", "#009688", "#c45850"], "chartsData": [5, 10, 22, 3], "chartType": "pie", "displayLegend": "true" }
             */

            const chartData = response[i].custom.data;
            const {
              title,
              labels,
              backgroundColor,
              chartsData,
              chartType,
              displayLegend,
            } = chartData;

            // pass the above variable to createChart function
            createChart(
              title,
              labels,
              backgroundColor,
              chartsData,
              chartType,
              displayLegend
            );

            // on click of expand button, render the chart in the charts modal
            $(document).on("click", "#expand", () => {
              createChartinModal(
                title,
                labels,
                backgroundColor,
                chartsData,
                chartType,
                displayLegend
              );
            });
            return;
          }

          // check of the custom payload type is "collapsible"
          if (payload === "collapsible") {
            const { data } = response[i].custom;
            // pass the data variable to createCollapsible function
            createCollapsible(data);
          }
        }
      }
      scrollToBottomOfResults();
    }
    $(".usrInput").focus();
  }, 50);
}

/**
 * sends the user message to the rasa server,
 * @param {String} message user message
 */
async function send(message) {
  debugger
  localStorage.setItem('sender_id', sender_id);
  await new Promise((r) => setTimeout(r, 100));
  $.ajax({
    url: 'chat',
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ message: message, sender: sender_id }),
    success(botResponse, status) {
      console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

      // if user wants to restart the chat and clear the existing chat contents
      if (message.toLowerCase() === "/restart") {
        $("#userInput").prop("disabled", false);

        // if you want the bot to start the conversation after restart
        // customActionTrigger();
        return;
      }
      if(localStorage.getItem("islogedIn") == 'true'){
        setBotResponse(botResponse);
      }
      else{
        send('getstarted');
        localStorage.setItem("islogedIn", "true");
      }
    },
    error(xhr, textStatus) {
      if (message.toLowerCase() === "/restart") {
        $("#userInput").prop("disabled", false);
        // if you want the bot to start the conversation after the restart action.
        // actionTrigger();
        // return;
      }

      // if there is no response from rasa server, set error bot response
      setBotResponse("");
      console.log("Error from bot end: ", textStatus);
    },
  });
}
/**
 * sends an event to the bot,
 *  so that bot can start the conversation by greeting the user
 *
 * `Note: this method will only work in Rasa 1.x`
 */
// eslint-disable-next-line no-unused-vars
function actionTrigger() {
  //debugger;
  $.ajax({
    url: `http://localhost:5005/conversations/${sender_id}/execute`,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      name: action_name,
      policy: "MappingPolicy",
      confidence: "0.98",
    }),
    success(botResponse, status) {

      console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

      if (Object.hasOwnProperty.call(botResponse, "messages")) {
        setBotResponse(botResponse.messages);
      }
      $("#userInput").prop("disabled", false);
    },
    error(xhr, textStatus) {
      // if there is no response from rasa server
      setBotResponse("");
      console.log("Error from bot end: ", textStatus);
      $("#userInput").prop("disabled", false);
    },
  });
}

/**
 * sends an event to the custom action server,
 *  so that bot can start the conversation by greeting the user
 *
 * Make sure you run action server using the command
 * `rasa run actions --cors "*"`
 *
 * `Note: this method will only work in Rasa 2.x`
 */
// eslint-disable-next-line no-unused-vars
function customActionTrigger() {
  //debugger
  $.ajax({
    url: "http://localhost:5055/webhook/",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      next_action: action_name,
      tracker: {
        sender_id,
      },
    }),
    success(botResponse, status) {
      console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

      if (Object.hasOwnProperty.call(botResponse, "responses")) {
        setBotResponse(botResponse.responses);
      }
      $("#userInput").prop("disabled", false);
    },
    error(xhr, textStatus) {
      // if there is no response from rasa server
      setBotResponse("");
      console.log("Error from bot end: ", textStatus);
      $("#userInput").prop("disabled", false);
    },
  });
}


function validateSuccess(ecn, password) {
  //debugger
  $.ajax({
    url: "http://localhost:5055/webhook/",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      //next_action: "action_show_curr_emp_options", Ashraf
      next_action: "action_user_login",
      tracker: {
        sender_id,
        ecn,
        password,
      },
    }),
    success(botResponse, status) {
      console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

      if (Object.hasOwnProperty.call(botResponse, "responses")) {
        setBotResponse(botResponse.responses);
      }
      $("#userInput").prop("disabled", false);
    },
    error(xhr, textStatus) {
      // if there is no response from rasa server
      setBotResponse("");
      console.log("Error from bot end: ", textStatus);
      $("#userInput").prop("disabled", false);
    },
  });
}


// Created for initpayload AR

//$("#profile_div").on("click", (e) => {
//
//  // Greeting message to be sent by the bot
//  const greetingMessage = "Welcome to Epicenter HR Chatbot";
//  // Set the bot's response with the greeting message
//  const botResponse = [
//    {
//
//      text: greetingMessage
//
//    }
//  ];
//  // Display the bot's response on the chat screen
//  setBotResponse(botResponse);
//  // Enable the user input field
//  $("#userInput").prop("disabled", false);
//});
// Created for initpayload AR

$(document).on("click", "#profile_div", function(e){
  debugger
  if (localStorage.getItem('isModalClose') == 'false') {
    const greetingMessage = "Welcome to our <b>Epicenter HR Chatbot!</b> </br>To assist you with HR-related queries, please log in.";
    // Set the bot's response with the greeting message
    const botResponse = [
      {
        text: greetingMessage
      }
    ];
    //   Display the bot's response on the chat screen
    setBotResponse(botResponse);
    //   Enable the user input field
    $("#userInput").prop("disabled", true);
  }
});


//$("#profile_div").on("click", (e) => {
//  //debugger
//  $.ajax({
//    url: "http://localhost:5055/webhook/",
//    type: "POST",
//    contentType: "application/json",
//    data: JSON.stringify({
//      next_action: "first_action",
//      tracker: {
//        sender_id,
//      },
//    }),
//    success(botResponse, status) {
//      console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);
//
//      if (Object.hasOwnProperty.call(botResponse, "responses")) {
//        setBotResponse(botResponse.responses);
//      }
//      $("#userInput").prop("disabled", false);
//    },
//    error(xhr, textStatus) {
//      // if there is no response from rasa server
//      setBotResponse("");
//      console.log("Error from bot end: ", textStatus);
//      $("#userInput").prop("disabled", false);
//    },
//  });
//});


/**
 * clears the conversation from the chat screen
 * & sends the `/resart` event to the Rasa server
 */
function restartConversation() {
  $("#userInput").prop("disabled", true);
  // destroy the existing chart
  $(".collapsible").remove();

  if (typeof chatChart !== "undefined") {
    chatChart.destroy();
  }

  $(".chart-container").remove();
  if (typeof modalChart !== "undefined") {
    modalChart.destroy();
  }
  $(".chats").html("");
  $(".usrInput").val("");
  send("/restart");
}
// triggers restartConversation function.
$(document).on('click', "#restart", function(){
  debugger
  restartConversation();
  send('getstarted');
  $('#userInput').blur();
  $('#userInput').css('pointer-events', 'none');
  $('.keypad').addClass('d-none');
});

/**
 * if user hits enter or send button
 * */
$(document).on("keyup keypress",".usrInput", function(e){
  debugger
  const keyCode = e.keyCode || e.which;

  const text = $(".usrInput").val();
  if (keyCode === 13) {
    if (text === "" || $.trim(text) === "") {
      e.preventDefault();
      return false;
    }
    // destroy the existing chart, if yu are not using charts, then comment the below lines
    $(".collapsible").remove();
    $(".dropDownMsg").remove();
    if (typeof chatChart !== "undefined") {
      chatChart.destroy();
    }

    $(".chart-container").remove();
    if (typeof modalChart !== "undefined") {
      modalChart.destroy();
    }

    $("#paginated_cards").remove();
    $(".suggestions").remove();
    $(".quickReplies").remove();
    $(".usrInput").blur();
    setUserResponse(text);
    send(text);
    e.preventDefault();
    return false;
  }
  return true;
});

$(document).on("click", "#sendButton", function(){
  debugger
  const text = $(".usrInput").val();
  if (text === "" || $.trim(text) === "") {
    e.preventDefault();
    return false;
  }
  // destroy the existing chart
  if (typeof chatChart !== "undefined") {
    chatChart.destroy();
  }

  $(".chart-container").remove();
  if (typeof modalChart !== "undefined") {
    modalChart.destroy();
  }

  $(".suggestions").remove();
  $("#paginated_cards").remove();
  $(".quickReplies").remove();
  $(".usrInput").blur();
  $(".dropDownMsg").remove();
  setUserResponse(text);
  send(text);
  e.preventDefault();
  return false;
});


$(document).on('mouseover', '.login-btn', () => {
  debugger
  $('.signin_logo').removeClass('d-none');
});

$(document).on('mouseleave', '.login-btn', () => {
  debugger
  $('.signin_logo').addClass('d-none');
});

function DtPickerChangeHandler(Date) {
  debugger
  Dt = Date
  var month = { '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' }
  Dt = Dt.replace(Dt.slice(0,2), month[Dt.slice(0,2)]);
  var yr = Dt.slice(4);
  var mnth = Dt.slice(0,3);
  Dt = mnth + '-' + yr
  setUserResponse(Dt);
  send(Dt);
}


// Code by Kunal 23-11-2023
$(document).on('click', '#submitRatingBTN', function () {
  debugger
  setTimeout(()=>{
    localStorage.setItem("islogedIn", "false");
    localStorage.setItem('keyBordWR', 'false');
  }, 500)
  restartConversation();
  send('getstarted');
  submitRatingAjax(localStorage.getItem('sender_id'), localStorage.getItem('selectedRating'));
})
// Code end by Kunal

// Code by Kunal on 07-02-2024 for disabled keybord key press
document.addEventListener('keydown', event => {
  debugger
  if(localStorage.getItem("islogedIn") == 'false' && localStorage.getItem('keyBordWR') == 'false'){
    event.preventDefault();
    return false;
  }
});
// Code end by Kunal

function submitRatingAjax(senderID, rating){
  $.ajax({
    url: path + "storeRating",
    type: "POST",
    data: {
      senderID: senderID,
      rating: rating,
    },
    success: function (data) {
      debugger
      if (data.success) { 
        console.log('Rating stored successfully');
      }
      else{
        console.log('Issue with storing of Rating');
      }
    },
    error(xhr, textStatus,) {
      console.log(textStatus);
    },
  });
}