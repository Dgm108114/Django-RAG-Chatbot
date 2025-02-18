debugger
// Code by Kunal to add file accessing path on 24-07-2024
var path = localStorage.getItem('accessPath');

function include(file) {
    const script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;

    document.getElementsByTagName('head').item(0).appendChild(script);
}

/* include all the components js file */

include(path + 'static/js/components/chat.js');
include(path + 'static/js/constants.js');
include(path + 'static/js/components/cardsCarousel.js');
include(path + 'static/js/components/botTyping.js');
include(path + 'static/js/components/charts.js');
include(path + 'static/js/components/collapsible.js');
include(path + 'static/js/components/dropDown.js');
include(path + 'static/js/components/location.js');
include(path + 'static/js/components/pdfAttachment.js');
include(path + 'static/js/components/quickReplies.js');
include(path + 'static/js/components/suggestionButtons.js');
