$(document).foundation().ready(function() {

    $('#hackbaseball').DataTable( {
	    "ajax": 'js/salary.json',
	    "columns": [
            { "data": "NAME" },
            { "data": "TEAM" },
            { "data": "POS" },
            { "data": "SALARY" },
            { "data": "np" },
            { "data": "dollar_per_pitch" }
        ],
        paging: false,
        initComplete: function () {

            this.api().columns().every( function () {
                var column = this;
                if (column.selector.cols == 1 || column.selector.cols == 2) {
                    
                    var select = $('<select><option value=""></option></select>')
                        .appendTo( $(column.header()) )
                        .on( 'change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
     
                            column
                                .search( val ? '^'+val+'$' : '', true, false )
                                .draw();
                        } );
     
                    column.data().unique().sort().each( function ( d, j ) {
                        select.append( '<option value="'+d+'">'+d+'</option>' )
                    } );
                }
            } );
        }
    }).order( [ 5, 'desc' ] )
    .draw();

    $('#did-not-pitch').DataTable( {
	    "ajax": 'js/did-not-pitch.json',
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