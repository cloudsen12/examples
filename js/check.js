var CloudSEN12 = ee.ImageCollection("projects/sat-io/open-datasets/cloudsen12/high");
var s2har = ee.ImageCollection("COPERNICUS/S2_HARMONIZED");
var s2l2ahar = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

// filter images with certain cloud_coverage 
// ['low-cloudy', 'almost-clear', 'mid-cloudy', 'cloudy', 'cloud-free']

var cloud_coverage_filter = 'mid-cloudy';
CloudSEN12 = CloudSEN12.filter(ee.Filter.eq('cloud_coverage', cloud_coverage_filter));

Map.setCenter(0,0,3);

// Add S2 image:
Map.addLayer(CloudSEN12.map(function(image){
  var s2_name = ee.String(image.get("s2_id_gee"));
  var imagecol = s2har.filter(ee.Filter.eq('system:index', s2_name));
  return ee.Image(imagecol.first());
}),
{"min":0,"max":3500, "bands": ["B4", "B3", "B2"]}, 'S2 L1C image');

// Add S2 L2A image:
Map.addLayer(CloudSEN12.map(function(image){
  var s2_name = ee.String(image.get("s2_id_gee"));
  
  var imagecol = s2l2ahar.filter(ee.Filter.eq('system:index', s2_name));
  return ee.Image(imagecol.first());
}),
{"min":0,"max":3500, "bands": ["B4", "B3", "B2"]}, 'S2 L2A image', false);

// Add red squares
var geoms = CloudSEN12.map(function(img){
  return ee.Feature(img.geometry(),{"style":{"color": "FF0000",
                                             "fillColor":"00000000"}});
});
Map.addLayer(geoms.style({styleProperty: "style"}),{},'red borders');

// Add labels
Map.addLayer(CloudSEN12,{"min":0,"max":3, palette:['6F4E37', 'EEEEEE', 'AAAAAA', '333333']}, 'clouds masks');

// Add selector
var ids_names = CloudSEN12.toList(1000).map(function(dic){return ee.Feature(dic).id();}).getInfo();

var select =  ui.Select({
  items: ids_names,
  onChange: function(key) {
    var current_img = ee.Image("projects/sat-io/open-datasets/cloudsen12/high/"+key);
    print(current_img);
    Map.centerObject(current_img);
  }
});

select.setPlaceholder('Choose a ROI...');
print(select);
