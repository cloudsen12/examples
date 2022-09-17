var regions = ee.FeatureCollection("users/csaybar/cloudsen12")

var palette = ee.Dictionary({
  'high': 'red',
  'scribble': 'blue',
  'nolabel': 'green',
});

var image = regions
  .map(function (feature) {
    // Add a style-dictionary property using our chosen palette
    return feature.set('myStyle', {
      'color': palette.get(feature.get('lbl_typ')),
      'pointSize': 1
    });
  })
  .style({
    'styleProperty': 'myStyle',
  });
  
Map.addLayer(image, {});