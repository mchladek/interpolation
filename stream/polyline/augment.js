
var through = require('through2'),
    analyze = require('../../lib/analyze');

// increase/decrease bbox bounds by this much in order to find houses which
// might be slighly outside the bounds.
// eg: http://geojson.io/#id=gist:anonymous/ce8b0cdd2ba83ef24cfaab49d36d8cdd&map=15/52.5011/13.3222
var FUDGE_FACTOR = 0.005;

/**
  this stream augments the parsed data with additional fields.

  actions:
   - perform libpostal normalization
   - apply 'fudge factor' to bbox
**/
function streamFactory(){
  return through.obj(function( parsed, _, next ){

    // push augmented data downstream
    this.push( map( parsed ) );

    next();
  });
}

/**
  perform libpostal normalization and apply fudge factor to bbox
**/
function map( parsed ){

  var names = [];
  parsed.names.forEach( function( name ){
    names = names.concat( analyze.street( name ) );
  });

  return {
    id: parsed.id,
    line: parsed.line,
    minX: parsed.bbox[0] -FUDGE_FACTOR,
    minY: parsed.bbox[1] -FUDGE_FACTOR,
    maxX: parsed.bbox[2] +FUDGE_FACTOR,
    maxY: parsed.bbox[3] +FUDGE_FACTOR,
    names: names
  };
}

module.exports = streamFactory;
