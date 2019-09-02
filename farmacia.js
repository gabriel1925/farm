var express = require('express');
var farm = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var method_override = require('method-override');
var user = "carolina";
var contra = "1925";
var sesion=false;

// coneccion de Mongosse
var mongooseOptions={
	useNewUrlParser: true
};
mongoose.connect('mongodb://localhost/farmacia2',mongooseOptions);

// creacion del Schema
var remedioSchema={
codigo:Number,
descripcion: String,
qr:String ,
cantidad:Number,
vencimiento:String
};
var stockfarmaciaSchema={
	fecha:String,
	cosas:Object,
	codigos:Array,
	total:Array
};
// Esquema para hacer la tabla final de cuentas


// no te olvides de hacer un conteo de transacciones.
// var tablaSchema={
// 	hora:String,
// 	codigos:Array,
// 	cantidades:Array

// }
var stockfarmacia = mongoose.model("stockFarmacia", stockfarmaciaSchema);
var Remedio = mongoose.model("Remedio", remedioSchema);
// var Tabla = mongoose.model("Tabla", tablaSchema);

farm.use(bodyParser.json());
farm.use(bodyParser.urlencoded({ extended: true }));

farm.set('view engine',"pug");
farm.use(express.static("public"));
farm.use(method_override("_method"));
// Aca esta el el / con inicio de sesion 
farm.get("/",(sol,res)=>{
	if (sesion) {
		// var tiempo = new Date();
		// console.log(tiempo);
		res.render("inicio");
	}else{
		res.render("index");
	}
});



farm.post("/", (sol,res)=>{
	if (sol.body.usuario==user && sol.body.contraseña == contra) {
		sesion = true;
		res.render("inicio")
	}else{
		sesion = false;
		res.redirect("/");
	}

});

farm.get("/entradamed",(sol,res)=>{
	if(sesion){
		res.render("entradamed/index");

	}else{
		res.redirect("/");
	}
});
// Agregar medicamentoos lo paso por post y me lo trae body parser
farm.post("/agregar",(sol,res)=>{
	var datos={
		codigo:sol.body.codigo,
		descripcion: sol.body.descripcion,
		qr:sol.body.qr ,
		cantidad:sol.body.cantidad,
		vencimiento:sol.body.vencimiento
	}
	Remedio.find({"qr":datos.qr},(err,docs)=>{
		if (docs=="") {
			var remedio = new Remedio(datos);
			remedio.save((err)=>{
				res.redirect("/entradamed");
			})
			console.log(datos);
		}else{
			console.log(docs.length);
			if (docs.length==1) {

				console.log("la solicitud es de tipo "+ typeof(parseInt(sol.body.vencimiento))+ "\n el dato de la base de datos es "+ typeof(docs[0].vencimiento));
				var resta = parseInt(sol.body.cantidad) + docs[0].cantidad;

				var datoss={
						// codigo:sol.body.codigo,
						// descripcion: sol.body.descripcion,
						// qr:sol.body.qr ,
						cantidad:resta,
						// vencimiento:sol.body.vencimiento
					}
				// var remedio = new Remedio(datoss);
				Remedio.updateOne({'_id':docs[0].id},datoss,()=>{
					console.log("entro "+datos);
					res.redirect("/entradamed");
				});
			}			
		}
	})

});
farm.post("/salidaqr",(sol,res)=>{
	if (sesion) {
		var qrsalida = sol.body.qr;
		Remedio.findOne({'qr':qrsalida},(err,doc)=>{
			// console.log("este es el err"+err+"\n\n\n\n");
			// console.log("\n\n\n\n\neste es el doc"+doc);
			if(doc==null){
			// console.log("este es el err\n\n\n\n\n\n\n\n\n\n\n"+err+"\n\n\n\n\n\n\n\n\n\n")
			// console.log(doc);
			// console.log("este es el err"+err);
			res.render("errornoencontrado",{alerta:"No se encontro el medicamento",volver:"/"});
			}else{
			// console.log(doc);
			var edicion = {
				qr:doc.qr ,
				cantidad:doc.cantidad-sol.body.cantidad,
			}
			// console.log("esto es la edicion \n"+edicion.cantidad);
			Remedio.updateOne({'qr':qrsalida},edicion,function(){
				res.redirect("/");
			});
			// res.redirect("/");
		}});
	}else{
		res.redirect("/");
	}
});
farm.post("/salidamano",(sol,res)=>{
	if(sesion){
		var salidamano = [sol.body.codigo,sol.body.vencimiento];
		Remedio.find({"codigo":salidamano[0],"vencimiento":salidamano[1]},function(err,docs){
			// console.log("\n\n\n\n error encontrado \n"+err+"\n\n\n\n\n\n\ndocs encontrado=\n"+docs+"\n\n\n");
			if(docs==""){
				res.render("errornoencontrado",{alerta:"No se encontro el medicamento",volver:"/"});
			}else{
				var cont=0,posicioncon=0,iden;
				for (var i = docs.length - 1; i >= 0; i--) {
					if(docs[i].cantidad>=cont){
						cont = docs[i].cantidad;
						posicioncon=i;
						iden=docs[posicioncon]._id;
					}
				};
				var edicionamano={
					_id:iden,
					codigo:salidamano[0],
					vencimiento:salidamano[1],
					cantidad:docs[posicioncon].cantidad-sol.body.cantidad
				};
				Remedio.updateOne({"_id":iden},edicionamano,function(){
					res.redirect("/");
				});
			}
		})
	}
});


// cerrar session
farm.get("/cerrarsesion",(sol,res)=>{
	sesion=false;
	res.redirect("/");
});

farm.get("/stock",(sol,res)=>{
	if (sesion) {
		Remedio.find(function(err,documento){
			//console.log(documento);
			res.render("stock",{remedios: documento});

		});
	}else{
		res.redirect("/");
	}
});

farm.get("/editar/:id",(sol,res)=>{
	if (sesion) {
		var identificacion= sol.params.id;
		Remedio.findOne({"_id":identificacion},(err,producto)=>{
			if (producto==undefined) {
				res.redirect("/stock");
			}else{
				res.render("editar",{remedio:producto});
			};
			})
		
	}else{
		res.redirect("/");
	}
});
farm.put("/editar/:id",(sol,res)=>{
	if(sesion){
		var datos = {
			codigo:sol.body.codigo,
			descripcion: sol.body.descripcion,
			qr:sol.body.qr,
			cantidad:sol.body.cantidad,
			vencimiento:sol.body.vencimiento
		};
		Remedio.updateOne({"_id":sol.params.id},datos,function(){
			res.redirect("/stock");
		})
	}else{
		res.redirect("/");
	}
})
farm.get("/borrar/:id",(sol,res)=>{
	if(sesion){
		var identificacion = sol.params.id;
		Remedio.findOne({"_id":identificacion},(err,producto)=>{
			if(producto==undefined){
				res.redirect("/stock");
			}else{
				// console.log("\n\n\n\n\n\n\n"+producto+"\n\n\n\n\n\n\n\n\n");
				// console.log("\n\n\n\n\n\n\n"+err+"\n\n\n\n\n\n\n\n\n");
				res.render("borrar",{remedio:producto});
			}
		});
	}else{
		res.redirect("/");
	}

});
farm.delete("/borrar/:id",(sol,res)=>{
	if (sesion) {
		var identificacion = sol.params.id;
		Remedio.deleteOne({"_id":identificacion},function(err){
			res.render("removido");
		})
	}else{
		res.redirect("/");
	}
});
farm.get("/fechavencimiento",(sol,res)=>{
	if(sesion){
		res.render("verfecha");
	}else{
		res.redirect("/");
	}
})
farm.post("/fechavencimiento",(sol,res)=>{
	if(sesion){
		var fechavencimiento = sol.body.vencimiento;
		// console.log(fechavencimiento);
		Remedio.find({"vencimiento":fechavencimiento},(err,docs)=>{
			if (docs=="") {
				res.render("errornoencontrado",{alerta:"No hay medicamentos con ese vencimiento",volver:"/fechavencimiento"});
			}else{
				res.render("consultavencidos",{cosas:docs});
			}

		});
	}else{
		res.redirect("/");
	}
});
farm.get("/mesames",(sol,res)=>{
	if (sesion) {
		var variablecodigo = [],intercambio,ident=[],total=[],totales=[],suma=0,prueba=[],ahorita=new Date(),cod=[];
		Remedio.find((err,docs)=>{
			for (var i = docs.length - 1; i >= 0; i--) {
				variablecodigo.push(docs[i].codigo);
			}
			variablecodigo = variablecodigo.unique();
			for (var i = variablecodigo.length - 1; i >= 0; i--) {
				suma=0;
				for (var j = docs.length - 1; j >= 0; j--) {
					if (variablecodigo[i]==docs[j].codigo) {
						suma=suma+docs[j].cantidad;
						total.push(docs[j]);
					}
					cod[i]=variablecodigo[i];
					totales[i]=suma;
				}
				ident.push(total);
				total=[];
			}
			var stockfarm={
			fecha:new Date(),
			cosas:ident,
			codigos:cod,
			total:totales
			};
			var tamañocod = stockfarm.codigos.length - 1;
			var numerocod = tamañocod;
			var tamcod=[];
			for (var i = 0; i <= stockfarm.codigos.length-1; i++) {
				tamcod.push(i);
			}
			//console.log(tamcod);
			var obtamcod = {cosas:tamcod};
		var stock = new stockfarmacia(stockfarm);
		stock.save((err)=>{
			res.render("mesamesm",{remedios:stockfarm , tamaños:numerocod});
			// res.redirect("/");
		})


			// console.log(ident);
			
		});


	}else{
		res.redirect("/");
	}
});
// farm.get("mesamesm"(sol,res)=>{
	
// })
// farm.get("/pruebas",(sol,res)=>{
// 	Remedio.find({"codigo":12},(err,docs)=>{
// 		var remedioos={
// 			codigo:12,
// 			cosas:docs
// 		};
// 		var prueba = new stockPrueba(remedioos);
// 		prueba.save((err)=>{
// 			console.log("pase");
// 			res.redirect("http://ajax.googleapis.com");
// 		})

// 	})

// })
// aca definimos una funcion para eliminar a los elementos repetidos y los coneccta en un array
Array.prototype.unique=function(a){return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0});
farm.listen(80);

// console.log(typeof(docs));
// 			for (var i = docs.length - 1; i >= 0; i--){
// 				// console.log(docs[i].codigo);
// 				intercambio = docs[i].codigo;
// 				variablecodigo.push(intercambio);
				

// 			}
// 			variablecodigo = variablecodigo.unique();
			// for (var x = variablecodigo.length - 1; x >= 0; x--) {
			// 	suma=0;
			// 	for (var y = docs.length - 1; y >= 0; y--) {
			// 		if (variablecodigo[x]==docs[y].codigo) {
			// 			suma=suma+docs[y].cantidad;

			// 		}
			// 		cod[x]=variablecodigo[x];
			// 		total[x]=suma;
			// 	}
			// }
			// var tablita = {
			// 	hora:ahorita,
			// 	codigos:cod,
			// 	cantidades:total

			// }
			// var tabla = new Tabla(tablita);
// 			tabla.save((err)=>{
// 				res.redirect("/");
// 			});