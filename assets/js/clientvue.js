  Vue.component('profile', {
    props:{
      username: String,
      useremail: String,
      userid: String
    },
    template:`
        <div class="service-item" id="service-1">
                                        
          <div class="member-thumb">
                  <img src="images/profile.png" alt="">
                  <div class="team-overlay">
                      <h3></h3>
                      <span>Client Profile</span>

                      <div class="contact-form">                                                                                       
                          <form name="profileform" id="profileform" @submit.prevent="updateFunction">
                              <p>
                                  <input v-model="name" type="text" id="name" placeholder="Your Name">
                              </p>
                              <p>
                                  <input v-model="email" type="text" id="email" placeholder="Your Email"> 
                              </p>    
                              <input id="id" v-model="id" type="hidden"> 
                              <input id="type" v-model="type" type="hidden" value="client">                                                                                                
                              <input type="submit" class="mainBtn" id="submit" value="Update Profile">
                          </form>
                      </div> <!-- /.contact-form -->

                  </div> <!-- /.team-overlay -->
          </div> <!-- /.member-thumb -->                                              
        </div> <!-- /#service-1 -->
    `,
    data: function() {
      return {
        name:null,
        email:null,
        id:null,
        type:null
      }
    },
    ready: function () {
      //this.name = this.username;
      //console.log(this.username);
    },
    created: function(){
      //initialize from props
      this.name = this.username;
      this.email= this.useremail;
      this.id= this.userid;
      this.type = "client";
    },
    methods: {
      updateFunction: function() {
        console.log(this.name);
        // ref: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
        // https://appdividend.com/2018/08/20/javascript-fetch-api-example-tutorial/
        // https://javascript.info/fetch-api
        // https://michaelnthiessen.com/this-is-undefined/

        var formData = new FormData();
        formData.append("id",this.id);
        formData.append("name",this.name);
        formData.append("email",this.email);
        formData.append("type",this.type);

        fetch('/updateUserProfile', {
          method: 'POST',
          headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          body: new URLSearchParams(formData)          
        }).then(function (data) { 
          console.log('Request succeeded with JSON response', data);
        })
        .catch(function (error) {
          console.log('Request failed', error);
        });
      }
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
                                        <option value="noselection" selected>no selection</option>
                                        <option v-for="pro in pros" >{{pro.vendorCategory}}</option>
                                    </select>                                                                                                           
                            </form>
                    </div> <!-- /.contact-form -->

                </div> <!-- /.team-overlay -->
        </div> <!-- /.member-thumb -->                                                                               
      </div> <!-- /#service-1 -->
    `,
    data: function() {
      return {
        pros: []
      }
    },
    created(){
      this.getvendorcategories();
    },
    methods: {
      //Ref: https://michaelnthiessen.com/this-is-undefined/
      getvendorcategories() {
        fetch('/getvendorcategories', {
          method: 'GET'
        })
        .then(response => 
          response.json()
        )        
        .then(data => {
          this.pros = data;
        })
        .catch(err => console.error(err));
      },
      listVendorsByCat: function(){
        //TODO
      }
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
     
    }
  });