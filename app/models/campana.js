var mongoose= require('mongoose');
var Schema= mongoose.Schema;
var campanaFieldSchema = require('./campanaField');
var moment = require('moment-timezone');
moment.lang('es');


var campanaFieldSchema = new Schema({ name: String, value: Number }, { noId: true });

var CampanaSchema   = new Schema({ 
  nombre: { type: String, required: true},
  fechaApertura: { type: Date, default: Date.now },
  fechaCierre: { type: Date, default: Date.now },
  fields: [campanaFieldSchema],
  duplicados: {type: Boolean, default: false},
  active: {type: Boolean, default : false}
});

CampanaSchema.virtual('fechaAperturaFormat').get(function () {
   var dateWrapper = moment(this.fechaApertura).format('lll');
   return dateWrapper;
});

CampanaSchema.virtual('fechaCierreFormat').get(function () {
   var dateWrapper = moment(this.fechaCierre).format('lll');
   return dateWrapper;
});

module.exports = mongoose.model('Campana', CampanaSchema);