(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()


window.onload = function () {
    var myModal = document.getElementById('myModal');
    var myInput = document.getElementById('myInput');

    if (myModal && myInput) {
        myModal.addEventListener('shown.bs.modal', function () {
            myInput.focus();
        });
    }
}

var searchNav = document.getElementById('search-nav');
var parent = searchNav.parentNode;
var refChild = document.querySelector('.nav-item a[href="/listings"]').parentNode;

window.addEventListener('resize', function () {
    if (window.innerWidth <= 856) {
        if (searchNav && searchNav.parentNode) {
            searchNav.parentNode.removeChild(searchNav);
        }
    } else {
        if (parent && !document.getElementById('search-nav')) {
            parent.insertBefore(searchNav, refChild.nextSibling);
        }
    }
});