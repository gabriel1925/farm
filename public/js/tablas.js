$(document).ready( function () {
    $('#table').dataTable( {
    	"colReorder": false,
    	"lengthMenu": [ 8, 25, 50, 75, 100 ],
		"language": {
		    "search": "Buscar:",
		    "lengthMenu":"De a cuantos remedios mostrar: _MENU_",
		    "info":"Mostrando de _START_ a _END_ de _TOTAL_ remedios",
		    "paginate":{
		    	"previous":"Anterior",
		    	"next":"Siguiente"
	    	}
		},
		"autofill":true,
		"ordering": false,
		"dom": 'lfrtip<"cambiodelinea"><"text-center botonesblock"B>',
		"buttons": [
			{
				extend:"colvis",
				text:"Selecionar columnas",
				className: 'borrame btn btn-success' 
			},
			{
				extend:"copy",
				text:"Copiar al portapapeles",
				exportOptions: {
					columns: [0,":visible"]
				},
				className: 'borrame btn btn-success'
			},
			{
				extend:"excel",
				text:"Excel",
				exportOptions: {
					columns: [0,1,2,3]
				},
				className: 'borrame btn btn-success'
			},
			{
				extend:'print',
				text:'Imprimir',
				exportOptions: {
					columns: [0,1,2,3]
				},
				className: 'borrame btn btn-success'
			}
		]



	});
	$("#tablavencido").dataTable({
		"language": {
			"search": "Buscar:",
			"lengthMenu":"De a cuantos remedios mostrar: _MENU_",
			"info":"Mostrando de _START_ a _END_ de _TOTAL_ remedios",
			"paginate":{
				"previous":"Anterior",
				"next":"Siguiente"
			}
		},
		// "autofill":true,
		"ordering": false,
		"dom": 'lfrtip<".cambiodelinea"><"text-center botonesblock"B>',
		"buttons": [
			{
				extend:"colvis",
				text:"Selecionar columnas",
				className: 'borrame btn btn-success' 
			},
			{
				extend:"copy",
				text:"Copiar al portapapeles",
				exportOptions: {
					columns: [0,":visible"]
				},
				className: 'borrame btn btn-success'
			},
			{
				extend:"excel",
				text:"Excel",
				exportOptions: {
					columns: [0,1,2,3]
				},
				className: 'borrame btn btn-success'
			},
			{
				extend:'print',
				text:'Imprimir',
				exportOptions: {
					columns: [0,1,2,3]
				},
				className: 'borrame btn btn-success'
			}
		]

	});

	$(".cambiodelinea").html("<br />");
	$(".borrame").removeClass("dt-button buttons-collection buttons-colvis");

} );