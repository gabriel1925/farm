var hora = new Date();
$("table").tableExport({
formats: ["xlsx"], //Tipo de archivos a exportar ("xlsx","txt", "csv", "xls") ,"txt", "csv"
position: 'button',  // Posicion que se muestran los botones puedes ser: (top, bottom)
bootstrap: true,//Usar lo estilos de css de bootstrap para los botones (true, false)
fileName: "Reporte Fin de mes "+hora,    //Nombre del archivo
});