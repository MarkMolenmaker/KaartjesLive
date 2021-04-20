document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.nav');
    var instances = M.FloatingActionButton.init(elems, {
        direction: 'left',
        hoverEnabled: false
    });
    document.querySelector('#menu-btn').addEventListener('click', () => {
        const count = document.querySelector('#count');
        count.textContent = "" + kaartjes.length;
    });
});