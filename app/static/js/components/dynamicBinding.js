(function () {
  // Load jQuery if not already loaded
  if (typeof jQuery == 'undefined') {
    var script = document.createElement('script');
    // script.src = 'https://code.jquery.com/jquery-3.2.1.slim.min.js';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js';
    document.head.appendChild(script);
    script.onload = initChatWidget;
  } else {
    initChatWidget();
  }

  // Code to append Js links to webpage
  function include(file) {
    const script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;
    document.head.appendChild(script);
  }

  // Code to append CSS links to webpage
  function includeCSS(file) {
    var link = document.createElement('link');
    link.href = file;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  /* include all the components js file */
  // include('http://172.30.36.211:8000/hrchatbot/static/js/components/chat.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/constants.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/components/cardsCarousel.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/components/botTyping.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/components/charts.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/components/collapsible.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/components/dropDown.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/components/location.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/components/pdfAttachment.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/components/quickReplies.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/components/suggestionButtons.js');

  // include('http://172.30.36.211:8000/hrchatbot/static/js/lib/uuid.min.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/lib/showdown.min.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/components/index.js');
  // include('http://172.30.36.211:8000/hrchatbot/static/js/lib/uuid.min.js');.
  
  include('http://172.30.36.211:8000/hrchatbot/static/js/components/bootstrap-datepicker.js');
  include('http://172.30.36.211:8000/hrchatbot/static/js/script.js');
  include('http://172.30.36.211:8000/hrchatbot/static/js/lib/materialize.min.js');
  include('https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js');
  include('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js');



  // /* include all the components CSs file */
  includeCSS('http://172.30.36.211:8000/hrchatbot/static/css/style.css');
  includeCSS('http://172.30.36.211:8000/hrchatbot/static/css/materialize.min.css');
  includeCSS('http://172.30.36.211:8000/hrchatbot/static/css/bootstrap-datepicker.css');
  includeCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');  
  includeCSS('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css');

  includeCSS('https://fonts.googleapis.com/icon?family=Material+Icons');
  includeCSS('https://fonts.gstatic.com');
  includeCSS('https://fonts.googleapis.com');
  includeCSS('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
  includeCSS('https://fonts.googleapis.com/css?family=Raleway:500&display=swap');
  includeCSS('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
  includeCSS('https://fonts.googleapis.com/css2?family=Lato&display=swap');
  includeCSS('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400&display=swap');
  includeCSS('https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap');
  includeCSS('');

    

  function initChatWidget() {
    debugger
    // Add HTML for the chat widget
    var chatboxHtml = `
          <div class="container">
  <!-- Modal for rendering the charts, declare this if you want to render charts, 
       else you remove the modal -->
  <div id="modal1" class="modal">
    <canvas id="modal-chart"></canvas>
  </div>
  <!--chatbot widget -->
  <div class="widget">
    <div class="chat_header d-flex">
      <!--Add the name of the bot here -->
      <img class="ml-1" src="http://172.30.36.211:8000/hrchatbot/static/img/Epicenter_White_Logo.png" style="width: 130px;height: 50px;margin-top: -6px;" />
      <!-- <img class="" src="static/img/epicenter-logo.png" style="width: 20%;"/> -->
      <span class="chat_header_title ml-5" style="font-family: 'Poppins', sans-serif;font-size: 24px;">HR
        Chatbot</span>
        <i id="close" class="fa fa-angle-down minimize-btn text-light mr-2 ml-auto" style="font-size: 28px !important;margin-top: 15px;" title="Minimize"></i>
        <i id="restart" class="fa fa-refresh restart-btn text-light mr-2 ml-1" style="font-size: 17px !important;margin-top: 21px;" title="Close"></i>
        <i id="logoutbtn" class="fa fa-power-off logout-btn ml-1 mr-2 text-light d-none" style="font-size: 18px !important;margin-top: 22px;" title="Logout"></i>
        
      <!-- <a data-toggle="dropdown" class=""><i class="fa fa-ellipsis-v mr-3 pt-3 text-light ml-2"></i></a> -->
      <!-- <ul class="dropdown-menu p-0">
        <li class="top-li" id="restart"><a class="pl-4 top-a text-light">Restart <i class="fa fa-refresh"></i></a>
        </li>
        <li class="top-li" id="close"><a class="pl-4 top-a text-light">Close <i class="fa fa-window-close"></i></a>
        </li>
        <li class="top-li" id="clear"><a class="pl-4 top-a text-light">Clear <i class="fa fa-eraser"></i></a></li>
      </ul> -->
    </div>

    <!--Chatbot contents goes here -->
    <div class="chats" class="glyphicon glyphicon-remove" id="chats">


      <div class="clearfix mb-2"></div>
      <div id="salary_month" style="display:none">
        <img class="botAvatar" src="http://172.30.36.211:8000/hrchatbot/static/img/botAvatar.png" styles="">
        <p class="botMsg">Please select month and year for the salary slip.</p>
        <div class="clearfix"></div>
        <div class="singleCard">
          <div class="suggestions">
            <div class="menu">
              <div class="menuChips"><input type="month" id="SalarySlipDate" name=""></div>
              <div class="menuChips" data-payload="/current_employee">submit</div>
            </div>
          </div>
        </div>
      </div>

      <div class="clearfix"></div>
      <!-- <div class="loginBTN text-center mb-2 mt-1 rounded">
        <button class="btn btn-sm" id="chatbotLoginBtn">Login</button>
      </div> -->

      <!-- <div class="col-12 d-none" id="loginModal">
        <h4 class="text-center mt-0">Login</h4>
        <form class="col-10 mx-auto">
          <div class="form-group">
            <input type="text" class="form-control" id="ecn" aria-describedby="emailHelp" placeholder="Enter ECN"
              required>
          </div>
          <div class="form-group">
            <input type="password" class="form-control" id="ecnpassword" placeholder="Password" required>
          </div>
          <div id="login-message">
          </div>
          <div class=" text-center d-flex">
            <button type="submit" id="submitbutton" class="mt-2">SUBMIT<i class="fa fa-check ml-2" style="font-size: 16px;"></i></button>
            <button type="" id="closeModal" class="ml-2 mt-2">CANCEL<i class="fa fa-times ml-2" style="font-size: 16px;"></i></button>
          </div>
        </form>
      </div> -->

    </div>

    <!--keypad for user to type the message -->
    <div class="keypad d-none">
      <textarea id="userInput" placeholder="Type a message..." class="usrInput"></textarea>
      <!--<input type='text' id="userInput" placeholder="Type a message..." class="usrInput" />-->
      <div id="sendButton">
        <i class="fa fa-paper-plane" style="color: #b7414d;" aria-hidden="true"></i>
      </div>
    </div>
  </div>

  <!--bot profile-->
  <div class="profile_div" id="profile_div" title='HR Chatbot'>
    <!-- <img class="imgProfile" src="static/img/botAvatar.png" /> -->
    <img class="imgProfile" src="http://172.30.36.211:8000/hrchatbot/static/img/botAvatar.png" />
  </div>

  <!-- LOGIN MODAL -->
  <div class="modal fade" id="modalLoginForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
    aria-hidden="false">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h4 class="modal-title w-100 font-weight-bold">Sign in</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body mx-3">
          <div class="md-form mb-5">
            <i class="fas fa-envelope prefix grey-text"></i>
            <input type="email" id="defaultForm-email" class="form-control validate">
            <label data-error="wrong" data-success="right" for="defaultForm-email">Your email</label>
          </div>

          <div class="md-form mb-4">
            <i class="fas fa-lock prefix grey-text"></i>
            <input type="password" id="defaultForm-pass" class="form-control validate">
            <label data-error="wrong" data-success="right" for="defaultForm-pass">Your password</label>
          </div>

        </div>
        <div class="modal-footer d-flex justify-content-center">
          <button class="btn btn-default">Login</button>
        </div>
      </div>
    </div>
  </div>
  <!-- LOGIN MODAL END-->
          </div>
      `;
    setTimeout(() => {
      document.body.insertAdjacentHTML('beforeend', chatboxHtml);
    }, 1000)

    // Add JavaScript for the chat widget functionality
    $(document).ready(function () {
      // debugger
      // localStorage.setItem('accessPath', 'http://172.30.36.211:8000/hrchatbot/')
      localStorage.setItem('accessPath', 'http://172.30.36.211:8000/hrchatbot/')
      localStorage.setItem('keyBordWR', 'false');
      localStorage.setItem('isModalClose', 'false');
      // Code by Kunal to add file accessing path on 24-07-2024
      var path = localStorage.getItem('accessPath');
      $(document).on('mouseup', '.login-btn', function(){
        debugger
        $('.signin_logo').removeClass('d-none');
      })
      $(document).on('click', '#chatbotLoginBtn', () => {
        debugger
        localStorage.setItem('keyBordWR', 'true');
        $('#ecnpassword, #ecn').val('');
        $('#login-message').addClass('d-none');
        $('#chatbotLoginBtn').addClass('d-none');
        $('#loginModal').removeClass('d-none');
        // $('#chats').css('background-color', '#8080806b');
        // $('.keypad').css('background-color', '#8080806b');
        $('.keypad').addClass('pointerNone');
      })
      $(document).on('click', '#closeModal', function (e) {
        debugger;
        $('#chatbotLoginBtn').removeClass('d-none');
        $('#loginModal').addClass('d-none');
        // $('#chats').css('background-color', '#fff');
        // $('.keypad').css('background-color', '#fff');
        // $('.keypad').css('background-color', '#fff');
        $('.keypad').removeClass('pointerNone');
        e.preventDefault();
      })
      $(document).on('click', '#submitbutton', function (e) {
        debugger
        var ecn = $('#ecn').val()
        var pass = $('#ecnpassword').val()
        //$('#loginModal').addClass('d-none');
        $('#chats').css('background-color', '#fff');
        $('.keypad').css('background-color', '#fff');
        $('.keypad').removeClass('pointerNone');
        e.preventDefault();
        //if(localStorage.getItem("islogedIn") == 'true'){
        Login(ecn, pass);
        // }
        getDOJ(ecn);
      })
      function Login(ecn, pass) {
        debugger
        $("#userInput").prop('disabled', true);
        $.ajax({
          url: path + "userlogin",
          type: "POST",
          data: {
            ecn: ecn,
            password: pass,
          },
          success: function (data) {
            debugger
            if (data.success) {
              localStorage.setItem("islogedIn", "true");
              send(ecn + "-" + "LLqyl40Hxdj@ZC#2@PJGYg%0OEz#F");
              setUserResponse(ecn);
              $("#userInput").prop("disabled", false);
              $('.widget #chats #loginModal').addClass('d-none');
              $('.chat_header .logout-btn').removeClass('d-none');
              $('.keypad').removeClass('d-none');
            }
            else {
              $('#login-message').text(' ECN/Password is Incorrect!');
              $('#login-message').removeClass('d-none');
              $('#ecnpassword').val('');
              $('.keypad').addClass('d-none');
            }
            $('#userInput').css('pointer-events', 'all')
          },
          error(xhr, textStatus,) {
            debugger
            $('#login-message').text(' ECN/Password is Incorrect!');
            $('#login-message').removeClass('d-none');
            $('#ecnpassword').val('');
          },
        })
      }
      function getDOJ(ecn) {
        $.ajax({
          url: path + "userDOJ",
          type: "GET",
          data: {
            ecn: ecn,
          },
          success: function (data) {
            debugger
            var DOJ = data.data;
            var month = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
            DOJ = DOJ.replace(DOJ.slice(3, 6), month[DOJ.slice(3, 6)])
            var year = DOJ.slice(6)
            var month_ = DOJ.slice(3, 5)
            DOJ = month_ + '-' + year
            localStorage.setItem('UserDOJ', DOJ)
          },
          error(xhr, textStatus,) {
            debugger
            console.log('Some error occurs while faching DOJ!')
          },
        })
      }
      // Code by Nikita 20-11-2023
      $(document).on('click', '#logoutbtn', function () {
        debugger
        $('#chats').empty();
        $(this).addClass('d-none');
        send('goodbye');
        $('.keypad').addClass('d-none');
      });
      // Code end by Nikita
    });
  }
})();
