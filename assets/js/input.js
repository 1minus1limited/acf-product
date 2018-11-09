

function fill_products(taxon_id , product_field_name){
	console.log(product_field_name);
	jQuery('#'+ product_field_name ).find('option').remove();
	jQuery('#'+ product_field_name ).data("page","2");
	jQuery.ajax({
		url: endpointDetails.ajax_url+'taxons/products?id='+taxon_id+'&per_page=10&page=1&token='+endpointDetails.ajax_token,
		type: 'GET',
		datatype: 'jsonp',
		success: function(json){
			jQuery('#'+ product_field_name ).data('selected_taxon',taxon_id);

			if(json.products.length == 0 ){
				jQuery('#'+ product_field_name ).append('<option value=""></option>');
			} else {
				jQuery.each(json.products, function (key, data) {
					jQuery('#'+ product_field_name ).append('<option  selected value="'+data.id+'_'+taxon_id+'" >'+data.name+'</option>');
				});
			}
		}
	});
}


(function($){

	
	/**
	*  initialize_field
	*
	*  This function will initialize the $field.
	*
	*  @date	30/11/17
	*  @since	5.6.5
	*
	*  @param	n/a
	*  @return	n/a
	*/
	
	function initialize_field( $field ) {
		
		//$field.doStuff();
		
	}
	
	
	if( typeof acf.add_action !== 'undefined' ) {
	
		/*
		*  ready & append (ACF5)
		*
		*  These two events are called when a field element is ready for initizliation.
		*  - ready: on page load similar to $(document).ready()
		*  - append: on new DOM elements appended via repeater field or other AJAX calls
		*
		*  @param	n/a
		*  @return	n/a
		*/
		
		acf.add_action('ready_field/type=product', initialize_field);
		acf.add_action('append_field/type=product', initialize_field);
		
		
	} else {
		
		/*
		*  acf/setup_fields (ACF4)
		*
		*  These single event is called when a field element is ready for initizliation.
		*
		*  @param	event		an event object. This can be ignored
		*  @param	element		An element which contains the new HTML
		*  @return	n/a
		*/
		
		$(document).on('acf/setup_fields', function(e, postbox){
			
			// find all relevant fields
			$(postbox).find('.field[data-field_type="product"]').each(function(){
				
				// initialize
				initialize_field( $(this) );
				
			});
		
		});
	
	}



	$(document).ready(function(){

	  $('.product_loader_overlay').hide();

      $('.loader').hide();

	  $('.prod_select').on('scroll', function(){
	    var sel = $(this);
	    var lasto = sel.find('option:last');
	    if(lasto.position()){
	    var s = sel.position().top + sel.height();
	    var o = lasto.height() + lasto.position().top - 1;
      	var data_url = $(this).data('url');
      	var data_offset = $(this).data('page');	
      	var data_type = $(this).data('type');	
		var taxon_id =  $(this).data('selected_taxon');
      	
	    
	      if(o < s){
	        sel.siblings('.product_loader_overlay').show();

	      	sel.siblings('.loader').show();


	      	console.log(data_offset);

	      	if(data_type == 'product'){
	      		data_url = data_url + '&id=' + 	taxon_id
	      	}
	      	data_url = data_url + "&page=" +data_offset;
			sel.data('page',parseInt(data_offset) + 1);

			jQuery.ajax({
				url: data_url,
				type: 'GET',
				datatype: 'jsonp',
				success: function(json){

					
					if(data_type == 'product'){
						if(json.products.length > 0 ) {
							jQuery.each(json.products, function (key, data) {
								sel.append('<option   value="'+data.id+'_'+taxon_id+'" >'+data.name+'</option>');
							});
						}
					}else if(data_type == 'category'){
						if(json.taxons.length > 0 ) {
							create_flat_taxon_array(json.taxons,sel);

							// jQuery.each(json.taxons, function (key, data) {
							// 	sel.append('<option   value="'+data.id+'" >'+data.name+'</option>');
							// });
						}
					}
	      			sel.siblings('.product_loader_overlay').hide();

	      			sel.siblings('.loader').hide();


				}
			});


	      }
	     }
	    
	  });


	function create_flat_taxon_array(taxon_json,sel){
		// print_r($taxon_json);





		$.each(taxon_json,function(index,value) {

			// echo $value['pretty_name'];
			// code...
			// taxons[value['id']] = value['pretty_name'];
			sel.append('<option   value="'+value.id+'" >'+value.pretty_name+'</option>');

			if(value.taxons.length > 0 ){
				create_flat_taxon_array(value.taxons,sel);
			}

		});

	}


	});



})(jQuery);
