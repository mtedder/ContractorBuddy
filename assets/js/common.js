/**
 * Common javascript functions
 */
  
/*
* Common ajax error processing code
*/
function ajaxErrorProcessor(xhr,status,error){
    if(status.localeCompare("error") == 0){
        var errorCode = parseInt(xhr.status);
        switch(errorCode){
        
            case 400:
                console.log("Test400");
                break;		  			

            case 401:
                console.log("Test401");
                break;
                
            case 403:
                console.log("Test403");
                break;	  					

            case 404:
                console.log("Test404");                                    
                break;	  					  				
                                                                                    
            default:
                break;
        }	  			
    }
}

/*
* Get all vendor categories from the rest web service
*/
function getvendorcategories(){
    // Prepopulate the categories dropdown/select from the DB
    axios.get('/getvendorcategories')
    .then(function (response) {
        categories = response.data;
        //populate html select element with the data
        sel = document.getElementById('vendorCategory');

        categories.forEach(function( item, index){                     
            sel.options[sel.options.length] = new Option(item.vendorCategory, item.vendorCategory);                        
        });
        // console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function () {
        // always executed
    });  
}

/*
* Submit user profile update form
*/
function updateFunction(){
var formData = new FormData($("#profileform")[0]);                    

    $.ajax({
        url: '/updateUserProfile',
        type:"POST",	  	 
        data:{
                    "id":formData.get("id"),
                    "name":formData.get("name"),
                    "email":formData.get("email"),
                    "type":formData.get("type"),
                    "vendorCategory":formData.get("vendorCategory"),                             
                },
        success: function(result,status,xhr){
            if(status.localeCompare("success") == 0){
                console.log("success");//TODO update view with success msg
            }
        },
        error: function(xhr,status,error) {	  		
            ajaxErrorProcessor(xhr,status,error);
        }
    });
}