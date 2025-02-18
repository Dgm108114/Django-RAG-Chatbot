
// Code by Kunal to add file accessing path on 24-07-2024
var path = localStorage.getItem('accessPath');

/* module for importing other js files */
function include(file) {
    const script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;

    document.getElementsByTagName('head').item(0).appendChild(script);
}

// include('./static/js/lib/jquery.min.js');
include(path + 'static/js/lib/materialize.min.js');
include(path + 'static/js/lib/chart.min.js');
include(path + 'static/js/lib/uuid.min.js');
