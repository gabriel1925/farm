function salida(entrada){
	var menus = Array.prototype.slice.apply(document.querySelectorAll('.nav-item'));
	// console.log(menus);
	menus.map(function(menu){
		return menu.classList.remove('active');
	});
	menus[entrada].classList.add('active');
	return "ya esta";
	alert("hola");
	


}