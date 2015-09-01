var mongoose= require('mongoose');
var Schema= mongoose.Schema;
var moment = require('moment');
moment.lang('es');

var saleFieldSchema = new Schema({name: String, value: Number }, { noId: true });

var SaleSchema   = new Schema({	
	campana: String,
	fecha: { type: Date, default: Date.now },
	//distribuidorid: String, [distribuidor-> Ya Guarda el ID ] 
	distribuidor: String,
	nit: String, 
	nomDist: String,
	ciudad: String,
	vendedor: String,
	nomVend: String,
	cargoVend: String,
	emailVend: String,
	celularVend: String,
	fields: [saleFieldSchema],
});

SaleSchema.virtual('fechainformat').get(function () {
   var dateWrapper = moment(this.fecha).format('MMMM DD, YYYY');
   return dateWrapper;
});

module.exports = mongoose.model('Sale', SaleSchema);
