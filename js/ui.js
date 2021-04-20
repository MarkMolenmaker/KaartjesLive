document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.nav');
    var instances = M.FloatingActionButton.init(elems, {
        direction: 'left',
        hoverEnabled: false
    });
});