var click = 0;
var tname;

$(document).ready(function(){

	$('.alert').hide();
    $('#money').hide();
    $('#calories').hide();
    $('#sidenote').hide();
    $('#search').hide();
    $('#next').hide();
    $('#again').hide();
    $('#menu-table').hide();
    $('#save').hide();
    $('#chart').hide();
});

$('.form-control').keyup(function(event){
    if(event.keyCode == 13){
        if(click % 3 < 2){
            $('#next').click();
        }
        else{
            $('#search').click();
        }
    }
});

$('#next').click(function() {
    click++;
    switch(click){
            case 1:
                tname = $('#restaurant-input').val();
                console.log(click);
                if(tname == '' ){
                    click--;
                    console.log(click);
                } else{
                    $('#restaurant').fadeOut('slow');
                    
                    $('#money').delay("slow").fadeIn('slow'); 
                    $('#sidenote').delay("slow").fadeIn('slow'); 
                    $('#calories-input').val("");
                }
                break;
            case 2:
                var cost = $('#money-input').val();
                if(cost == '' ){
                    click--;
                }
                else{
                    $('#money').fadeOut('slow'); 
                    $('#next').fadeOut("slow");
                    $('#calories').delay("slow").fadeIn('slow'); 
                }
                break;
    }
});

$('#again').click(function() {
    click = 0;
    //reset chart
    //reset variables
    $('#restaurant').delay("slow").fadeIn("slow");
    //reset inputs
    $('#calories-input').val("");
    $('#money-input').val("");
    $('#restaurant-input').val("");
});

$('#search').click(function() {
    
    var calories = $('#calories-input').val();
    if(calories == ''){
    }
    else{
    $('#calories').fadeOut('slow'); 
    $('#sidenote').fadeOut("slow");
    
    click = 0;
    //reset chart
    //reset variables

    
    $('#restaurant').delay("slow").fadeIn("slow");
    
    //reset inputs
    
    $('#money-input').val("");
    $('#restaurant-input').val("");
    // fade in restaurant name
        
    
    
    
	


	// if (navigator.geolocation) {
 //    	navigator.geolocation.getCurrentPosition(function(position){
 //    		console.log('Your latitude is :' + position.coords.latitude + ' and longitude is ' + position.coords.longitude);
 //    	});
	// } else {
 //    	alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
	// }

	var query = {
		ll : '37.3175,-122.0419',
		radius : '1000',
		categoryId : '4d4b7105d754a06374d81259',
		clientId : 'TFXPVJEYX03UAUEMVSNRDWD40BWCECBN14G4SILJLLNQHNHQ',
		clientSecret : 'IIKJYI12T5IUQ5MUFB0STWXU4BZ5WNTESVCLW1HOFJQCUPTV',
		version : '20140806',
		m : 'foursquare'
	};

	$.get('https://api.foursquare.com/v2/venues/search?ll=' + query['ll'] 
		+ '&radius=' + query['radius'] 
		+ '&categoryId=' + query['categoryId'] 
		+ '&client_id=' + query['clientId'] 
		+ '&client_secret=' + query['clientSecret'] 
		+ '&v=' + query['version'] 
		+ '&m=' + query['m'],
		function(data) { 
			var response = data['response'];
			var id = '';
			for( var i = 0; i < response['venues'].length; i++){


				if((response['venues'][i]['name'].toLowerCase().replace(/[^a-z0-9]+/g,''))
					.indexOf(tname.toLowerCase().replace(/[^a-z0-9]+/g,'')) > -1){
					
					// console.log(tname.toLowerCase().replace(/\s/g,''));
					id = response['venues'][i]['id'];
					// console.log(id);
					break;
				}
			}
			if(id.length === 0){
				console.log('unable to find restaurant near location');
				$('.alert').show();
			}
			else{
                $('.form-group').delay("fast").animate({paddingTop: '0'},800, "linear");
                
				$('#menu-table tbody').empty();

				$('.alert').hide();

				$('#searchbox').val(response['venues'][i]['name']);

				var clientSecret = 'IIKJYI12T5IUQ5MUFB0STWXU4BZ5WNTESVCLW1HOFJQCUPTV';
				var clientId = 'TFXPVJEYX03UAUEMVSNRDWD40BWCECBN14G4SILJLLNQHNHQ';
				var food = [];
                var dataObj = [];
                var prices = [];

				$.get('https://api.foursquare.com/v2/venues/' + id + '/menu?' + 'client_id=' + clientId
					+ '&client_secret=' + clientSecret + '&v=20140806&m=foursquare',
					function (data) {
						var menu = data['response']['menu']['menus']['items'][0]['entries']['items'];
						for(var i = 0; i < menu.length; i++){
							for(var j = 0; j < menu[i]['entries']['items'].length; j++){

								
								food.push(menu[i]['entries']['items'][j]['name']);
                                prices.push(menu[i]['entries']['items'][j]['price']);
								
								var nextRow = '<tr><td>' + menu[i]['entries']['items'][j]['name'] + '</td>'
								+ '<td id = "price">' + menu[i]['entries']['items'][j]['price'] + '</td>' + '</tr>';
								$('#menu-table tbody').append(nextRow);
                                
                                
                                
                               


							}
						}
                        
                        
                        
						var q = 'https://api.nutritionix.com/v1_1/search/' 
								+ tname 
								+ '?results=0%3A50&fields='
								+ 'item_name%2Cbrand_name%2Citem_id%2Cnf_calories%2Cnf_protein%2Cnf_total_fat%2Cnf_sodium'
								+ '&appId=afe236a3&appKey=a612738872e7761fa189ce3794796d50';
                    
                        var CAL = 1;
                        var PRICE = 75;
                        var LOW_PROTEIN = 1000;
                        var HIGH_PROTEIN = 10000;
                        var LOW_FAT = 100;
                        var HIGH_FAT = 10;
                     

						$.get(q,function(data){
							for(var i = 0; i < food.length; i++){
								for(var j = 0; j < data['hits'].length; j++){
									var f = food[i].toLowerCase().replace(/[^a-z0-9]+/g,'');
									var of = data['hits'][j]['fields']['item_name'].toLowerCase().replace(/[^a-z0-9]+/g,'');
									if(of.indexOf(f) > -1){
										dataObj.push({
                                            'food' : food[i],
											'calories' : data['hits'][j]['fields']['nf_calories'],
											'fat' : data['hits'][j]['fields']['nf_total_fat'],
											'protein' : data['hits'][j]['fields']['nf_protein'],
                                            'prices' : 0
										});
                                        if(prices[i] !== "undefined") { dataObj['prices'] = prices[i]; }
										break;
									} 
								}
                                
                                for(var z = 0; z < dataObj.length; z++){
									if (prices[z] === undefined){
										var r = Math.floor((Math.random()*5)+1);
										if (r < 3)
											r+=0.99;
										else
											r+=0.49;
										
										dataObj[z]["prices"] = r;

									}
                                    //$('#menu-table tbody:nth-child(' + z + '):nth-child(2)').val(dataObj[z]["prices"]);
                                    
                                }
                                
                                for(var x = 0; x < dataObj.length; x++){
									// take out prices it screws up 
									console.log(dataObj[x]);
									
									var calor = (1 / (((dataObj[x]["calories"])+1)/CAL));
									var prot = ((dataObj[x]["protein"]+1)/LOW_PROTEIN);
									var tfat = (1/((dataObj[x]["fat"]+1)*HIGH_FAT));
									var prce = (1/((dataObj[x]["prices"]+.01)*PRICE));

									dataObj[x]["score"] = (calor * prot * tfat * prce)*10000000;
									
								}   
							}
                            
                            var calUI = 300;
                           
							
							var sum = 0;
							for (var i = 0; i < dataObj.length; i++){
								sum += dataObj[i]["calories"];
							}

							calUI = sum/dataObj.length;
                            
                            var alpha = $('#calories-input').val();
                            if(alpha.toLowerCase().replace(/[^a-z0-9]+/g,'') === 'high'){
                               //calUI +=     
                            }
                            else if(alpha.toLowerCase().replace(/[^a-z0-9]+/g,'') === "medium"){
                                //calUI +=
                            }
                            else if(alpha.toLowerCase().replace(/[^a-z0-9]+/g,'') === "low"){
                                    
                            } else {
                                    
                            }
                                    
                            
                            function compare(a,b) {
									if (a["score"] < b["score"])
     									return 1;
  									if (a["score"] > b["score"])
   										return -1;
  									return 0;
								
							}						
							

							var dataObj2 = [];
							// deletes objects with calories out of bounds	
							for (var i = 0 ; i < dataObj.length; i++){
								if (dataObj[i]["calories"] > calUI){
									//delete dataObj[i];
								}else {
									dataObj2.push(dataObj[i]);
								}
							}


							function compareCal(a,b) {
									if (a["calories"] > b["calories"])
     									return 1;
  									if (a["calories"] < b["calories"])
   										return -1;
  									return 0;
								
							}


							var ans = [];
							var foodNum = 1;
							//console.log(dataObj2);
							dataObj2.sort(compare);

							if (foodNum == 2){	

								for (var i = 0; i < dataObj2.length; i++){
									for (var j = i+1; j < dataObj2.length; j++){
										if (dataObj2[i]["calories"]+dataObj2[j]["calories"] < calUI){
											ans.push(dataObj2[i]);
											ans.push(dataObj2[j]);
										} 
									}
								}

								//console.log(ans);
                                
                                

							} else {
								console.log(dataObj2);
                                var cost = ['Cost'];
                                var calories = ['Calories'];
                                var foodNames = [];    
                            
                                for(var l = 0; l < dataObj2.length; l++){
                                    cost.push(dataObj2[l]["prices"]);
                                    calories.push(dataObj2[l]["calories"]);
                                    foodNames.push(dataObj2[l]["food"]);
                                }
                                
                                 var chart = c3.generate({
                                    data: {
                                        columns: [
                                            cost,
                                            calories
                                        ],
                                        type: 'bar',
                                        colors:{
                                            Cost: '#5cb85c',
                                            Calories: '#000000'
                                        },
                                    },
                                    bar: {
                                        width: {
                                            ratio: 0.5 // this makes bar width 50% of length between ticks
                                        }
                                        // or
                                        //width: 100 // this makes bar width 100px
                                    },
                                    axis: {
                                        x: {
                                            type: 'category',
                                            categories: foodNames
                                        }
                                    }
                                });
                                
                                
                                $('#chart').delay("slow").fadeIn("slow");
                                
                                
                                
                                $('#menu-table').delay('show').fadeIn('slow');
							}
                            
						});

					});

			}


		});
    }
});