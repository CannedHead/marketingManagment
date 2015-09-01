var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var VendorSchema   = new Schema({	
	distribuidor: String,
	nit: String, 
	nombre: String, 
    apellido: String,
    identificacion: String, 
	cargo: String, 
	email: String, 
	celular: String, 
	ciudad: String,
	direccion: String,	
	pa: Number
});

module.exports = mongoose.model('Vendor', VendorSchema);
