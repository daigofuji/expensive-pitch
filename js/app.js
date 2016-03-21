$(document).foundation().ready(function() {

  //D3 chart! Globals
  var salaryData, 
    jsonurl  = "js/salary.json",
    diameter = 960;

  // references 
  // 

  $.getJSON( jsonurl, function( response ) {
    salaryData = response.data;

    // we need to clean up the data
    // find the dollar_per_pitch and convert it to radius

    $.each(salaryData, function(i,v) {
      var radius = v.dollar_per_pitch.replace('$','').replace(/,/g,'');
      // normalize data a little
      radius = radius / 1000;
      //console.log(radius);
      salaryData[i].size = radius;
    });



    var svg = d3.select('#d3force').append('svg')
            .attr('width', diameter)
            .attr('height', diameter)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 "+ diameter + " " + diameter);

    var bubble = d3.layout.pack()
          .sort(null)
          .size([diameter, diameter])
          .value(function(d) {return d.size;})
          // .sort(function(a, b) {
          //  return -(a.value - b.value)
          // }) 
          .padding(3);
    


    // generate data with calculated layout values
    var nodes = bubble.nodes(processData(salaryData))
             .filter(function(d) { return !d.children; }); // filter out the outer bubble
    
    console.log(nodes);
    
    var vis = svg.selectAll('circle')
            .data(nodes);
    
    vis.enter().append('circle')
      .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
      .attr('r', function(d) { return d.r; })
      .attr('aria-haspopup', 'true')
      .attr('data-disable-hover', 'false')
      .attr('tabindex', function(d) { return parseInt(d.i, 10) + 1; })
      .attr('class', function(d) { return d.className + ' has-tip'; })
      .attr('data-tooltip', '')
      .attr('title', function(d) { return d.salaryDetail; });
  

      // Foundation tool tip
      //<span data-tooltip aria-haspopup="true" class="has-tip" data-disable-hover="false" tabindex="1" title="Fancy word for a beetle.">scarabaeus</span>

    // var circles =  svgContainer.selectAll("circle")
    // .data(salaryData)
    // .enter()
    // .append("circle")
    //   .attr("class", function(d) { return d.TEAM; })
    //   .attr("data-id", function(d) { return d.player_id; })
    //   .attr("data-name", function(d) { return d.NAME; })
    //   .attr("data-salary", function(d) { return d.SALARY; })
    //   .attr("data-dpp", function(d) { return d.dollar_per_pitch; })
    //   .attr("cx", function(d) { return d.x; })
    //   .attr("cy", function(d) { return d.y; })
    //   .attr("r", function(d) { return d.radius; });

   
    
    function processData(data) {

      var newDataSet = [];

      for(var i in data) {
        //console.log(data[i]);

        var salaryDetail = data[i].NAME + ", " + data[i].TEAM + ". Dollars Per Pitch: " + data[i].dollar_per_pitch + ". Pitch count: " + data[i].np +". Made " + data[i].SALARY + " in 2015, part of " + data[i].TOTAL_VALUE + " " + data[i].YEARS + " year deal, which ranked #" + data[i].RANK + " among MLB pitchers.";

        newDataSet.push({
          i:i,
          name: data[i].NAME, 
          player_id: data[i].player_id,
          className: data[i].TEAM,
          size: data[i].size,
          np: data[i].np,
          dollar_per_pitch: data[i].dollar_per_pitch,
          salary: data[i].SALARY,
          salaryDetail: salaryDetail
        });

      }
      return {children: newDataSet};
    }
  
  });


  // make it responsive 
  // http://stackoverflow.com/questions/9400615/whats-the-best-way-to-make-a-d3-js-visualisation-layout-responsive
  var aspect = 1,
    chart = d3.select('#d3force');
  d3.select(window)
    .on("resize", function() {
      var targetWidth = chart.node().getBoundingClientRect().width;
      chart.attr("width", targetWidth);
      chart.attr("height", targetWidth / aspect);
    });



    //DataTable stuff

    $('#hackbaseball').DataTable( {
	    "ajax": jsonurl,
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