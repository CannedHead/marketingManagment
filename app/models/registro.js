var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var RegistroSchema   = new Schema({ 
  nit: String, 
  distribuidorfirst: String, 
  distribuidorlast: String, 
  cc: String,
  nombre: String, 
  apellido: String,
  cargo: String,
  email: String,
  celular: String,
  direccion: String, 
  ccvendedor:String,
  ciudad: String,
  pa: String  
});

module.exports = mongoose.model('Registro', RegistroSchema);
