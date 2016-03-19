$(document).foundation().ready(function() {
    console.log( "ready!" );

    $('#hackbaseball').DataTable( {
	    "ajax": '/js/salary.json',
	    "columns": [
            { "data": "NAME" },
            { "data": "TEAM" },
            { "data": "POS" },
            { "data": "SALARY" },
            { "data": "np" },
            { "data": "dollar_per_pitch" }
        ]
    });

});