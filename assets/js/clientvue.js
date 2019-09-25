

  Vue.component('profile', {
    template:`
        <div class="service-item" id="service-1">
                                        
          <div class="member-thumb">
                  <img src="images/profile.png" alt="">
                  <div class="team-overlay">
                      <h3>{{name}}</h3>
                      <span>Client Profile</span>

                      <div class="contact-form">                                                                                       
                          <form name="profileform" id="profileform" onsubmit="event.preventDefault();updateFunction(this, event);">
                              <p>
                                  <input name="name" type="text" id="name" placeholder="Your Name" :value="name">
                              </p>
                              <p>
                                  <input name="email" type="text" id="email" placeholder="Your Email" :value="email"> 
                              </p>    
                              <input name="id" type="hidden" :value="id"> 
                              <input name="type" type="hidden" value="client">                                                                                                
                              <input type="submit" class="mainBtn" id="submit" value="Update Profile">
                          </form>
                      </div> <!-- /.contact-form -->

                  </div> <!-- /.team-overlay -->
          </div> <!-- /.member-thumb -->                                              
        </div> <!-- /#service-1 -->
    `,
    data: function() {
      return {
        name:'User1',
        email:'merc2@gc.com',
        id:'sdfgshtrhffgngfngfng'
      }
    },
    methods: {
      //TODO
    },
    computed: {
      //TODO
    }
  })

  Vue.component('search-pros', {
    template:`
      <div class="service-item" id="service-2">

        <div class="member-thumb">
                <!-- <img src="images/profile.png" alt=""> -->
                <div class="team-overlay">
                    <h3>Find Pros</h3>
                    <span>Search</span>
                    <div class="contact-form">                                                                                       
                            <form method="post" name="contactform" id="contactform">                                                        
                                    <!-- <input type="text" placeholder="Search by keyword" aria-label="Search">
                                    <i class="fa fa-search" aria-hidden="true"></i> -->
                                    <select name="vendorCategory" id="vendorCategory" onchange="listVendorsByCat(this.value);">
                                        <option v-for="pro in pros" :value="pro">{{pro}}</option>
                                    </select>                                                                                                           
                            </form>
                    </div> <!-- /.contact-form -->

                </div> <!-- /.team-overlay -->
        </div> <!-- /.member-thumb -->                                                                               

      </div> <!-- /#service-1 -->
    `,
    data: function() {
      return {
        pros: ["no selection", "electrical", "plumbing", "hvac"]
      }
    },
    methods: {
      //TODO
    },
    computed: {
      //TODO
    }
  })
  
  Vue.component('vendor-search-results', {
    template:`
      <div class="service-item" id="service-3">
        <div class="member-thumb">
                <!-- <img src="images/profile.png" alt=""> -->
                <div class="team-overlay">
                    <h3>My Vendor Search Results</h3>
                    <span>Results</span>

                    <ul class="progess-bars" id="vendorList">
                      <li v-for="vendor in vendors">                    
                        <div class="progress">
                          <div class="" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 90%;">
                          {{vendor.name}}&nbsp;<a v-on:click="createQuote(vendor.name, vendor.id, vendor.userid)">Get Quote!</a>
                          </div>
                        </div>                        
                      </li>                                               
                    </ul>

                </div> <!-- /.team-overlay -->
        </div> <!-- /.member-thumb -->
      </div> <!-- /#service-1 -->
    `,
    data: function() {
      return {
        vendors: [
          {name:"Flash's Electrical",
           id:"yMrF3nGhm1joBhq3LULCbArQgWMOkohA1K0Vwl_3-zM",          
           userid:"Tf2s4vqBAkUUXaTft2vKso1hzhwjwfltrcvBEF_PgkY"
           },
           {name:"Virgil's Electrical",
           id:"yZQScMigYV9SwHF1d44FFyeuV-co6AjYY4xC67ljCHg",          
           userid:"Tf2s4vqBAkUUXaTft2vKso1hzhwjwfltrcvBEF_PgkY"
           }           
        ]
      }
    },
    methods: {
      createQuote: function(name,  id, userid) {
        console.log("createQuote");
        console.log(escape(name) + "," + id + "," + userid);
      }
    },
    computed: {
      //TODO
    }
  })

  Vue.component('vendor-quote-request', {
    template:`
          <div class="service-item" id="service-4">
          <div class="member-thumb">
                  <!-- <img src="images/profile.png" alt=""> -->
                  <div class="team-overlay">
                      <h3>My Vendor Quote Request</h3>
                      <span>Quotes</span>

                      <ul class="progess-bars" id="vendorQuoteList">
                      
                        <li v-for="quote in quotes">
                          <div class="progress">
                          <div class="" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 90%;">{{quote.name}}&nbsp;(\${{quote.price}})&nbsp;<a v-on:click="updateQuoteRequest(quote.id, quote.name, quote.vendorId, quote.clientId, quote.state)">{{quote.state}}</a>
                            </div>
                            <input name="price" type="hidden" :id="'price_' + quote.id" placeholder="0" value="0">
                          </div>
                        </li>

                      </ul>

                  </div> <!-- /.team-overlay -->
          </div> <!-- /.member-thumb -->
      </div> <!-- /#service-1 -->
    `,
    data: function() {
      return {
        quotes: [
          {name:"Virgil's Electrical",
           id:"9ms2NuYQ-lhk6b3SkNcWEz1HW2kTln8wFmWOWrdduS0",          
           vendorId:"yZQScMigYV9SwHF1d44FFyeuV-co6AjYY4xC67ljCHg",
           clientId:"Tf2s4vqBAkUUXaTft2vKso1hzhwjwfltrcvBEF_PgkY",
           state:"submitted",
           price:"350.75"
          }         
        ]
      }
    },
    methods: {
      updateQuoteRequest: function(id, vendorName, vendorId, clientId, state) {
        console.log("updateQuoteRequest");
        console.log(id + "," + escape(vendorName) + "," + vendorId + "," + clientId + "," + state);
      }
    },
    computed: {
      //TODO
    }
  }) 


  const app = new Vue({
    el: '#app',
    data: {
      myLocalProperty: 'Im a local property value 3'
    }
  });