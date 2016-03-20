$(document).foundation().ready(function() {

    $('#hackbaseball').DataTable( {
	    "ajax": '/js/salary.json',
	    "columns": [
            { "data": "NAME" },
            { "data": "TEAM" },
            { "data": "POS" },
            { "data": "SALARY" },
            { "data": "np" },
            { "data": "dollar_per_pitch" }
        ],
        paging: false
    }).order( [ 5, 'desc' ] )
    .draw();

    $('#did-not-pitch').DataTable( {
	    "ajax": '/js/did-not-pitch.json',
	    "columns": [
            { "data": "NAME" },
            { "data": "TEAM" },
            { "data": "POS" },
            { "data": "SALARY" }
        ],
        paging: false
    }).order( [ 3, 'desc' ] )
    .draw();

});