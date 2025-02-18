/**
 *  adds vertically stacked buttons as a bot response
 * @param {Array} suggestions buttons json array
 */
var n=0;
function addSuggestion(suggestions) {
    setTimeout(() => {
        const suggLength = suggestions.length;
        $(
            ' <div class='+"singleCard"+n+'> <div class='+"suggestions"+n.toString()+'><div class='+"menu"+n.toString()+'></div></div></diV>',
        )
            .appendTo(".chats")
            .hide()
            .fadeIn(1000);
        // Loop through suggestions
        for (let i = 0; i < suggLength; i += 1) {
            $(
                `<div class="menuChips" data-payload='${suggestions[i].payload}'>${suggestions[i].title}</div>`,
            ).appendTo(".menu"+n.toString());            
        }
        $('.menuChips').parent().css({width : '420px', marginLeft : '45px'});
        if(n==1){
               $().appendTo(".menu1");
        }
        n=n+1;
        scrollToBottomOfResults();
    }, 1000);
}

$(document).on("click", ".menuChips", function () {
    debugger    
    const text = this.innerText;    
    if(text.toLowerCase() == 'correct' || text.toLowerCase() == 'incorrect' || text.toLowerCase() == 'proceed' || text.toLowerCase() == 'cancel'){
        $(this).siblings().css({border: '2px solid #80808042', color: '#80808042', pointerEvents: 'none'});
    }
    const payload = this.getAttribute("data-payload");
    console.log("payload: ", this.getAttribute("data-payload"));
    setUserResponse(text);
    send(payload);
});

// on click of suggestion's button, get the title value and send it to rasa
$(document).on("click", ".container #Btn_Login", function () {

    var ecn=$(document).find("input[name=ecn]").val();
    var password=$(document).find("input[name=password]").val();
    if(ecn.length == 0){
        $('#Id_ecn').after('<div class="red">ecn is Required</div>');
    }
    else {
        $('#Id_ecn').next(".red").remove(); // *** this line have been added ***
        return true;
    }
    if(password.length == 0){
        $('#Id_pass').after('<div class="red">password is Required</div>');
    }
    else {
        $('#Id_pass').next(".red").remove(); // *** this line have been added ***
        return true;
    }

    if (ecn.length != 0 && password.length != 0){
        validateSuccess(ecn, password);
            $("#lgid").hide()
            $("#login_form").hide()
    } else {
        console.log("Username and password wrong")
    }

});

$(document).on('mouseover', '#datetimepicker',function(){
    debugger;
    $('.dt-cal-icon').css('color', 'white');
});