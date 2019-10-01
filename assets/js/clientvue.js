// https://www.freecodecamp.org/news/the-vue-handbook-a-thorough-introduction-to-vue-js-1e86835d8446/
// https://michaelnthiessen.com/this-is-undefined/
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
          //console.log('Request succeeded with JSON response', data);
        })
        .catch(function (error) {
          //console.log('Request failed', error);
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
                                    <select name="vendorCategory" id="vendorCategory" v-on:change="listVendorsByCat">
                                        <option value="noselection" selected>no selection</option>
                                        <option v-for="pro in pros" :value="pro.vendorCategory">{{pro.vendorCategory}}</option>
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
      listVendorsByCat:function (e) {

        vendorCategory = e.target.value;
        this.$root.$emit('get-vendorby-cat', vendorCategory);
      }
    },
    computed: {
      //TODO
    }
  })

  Vue.component('vendor-search-results', {
    props:{     
      userid: String
    },
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
                        {{vendor.name}}&nbsp;<a v-on:click="createQuote(vendor.name, vendor.id, id)">Get Quote!</a>
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
        vendors: [],
        id:null
      }
    },
    mounted(){
      this.$root.$on('get-vendorby-cat', (vendorCategory) => {
        this.getVendorByCat(`${vendorCategory}`);
      });
    },
    created: function(){
      //initialize from props
      this.id= this.userid;
    },
    methods: {
      createQuote: function(vendorName, vendorId, clientId) {
          var formData = new FormData();
          formData.append("vendorName",vendorName);
          formData.append("vendorId",vendorId);
          formData.append("clientId",clientId);
          formData.append("state","submitted");
          formData.append("approved","false");
          formData.append("price",0.0);
  
          fetch('/createQuoteRequest', {
            method: 'POST',
            headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: new URLSearchParams(formData)          
          }).then(() => {//https://michaelnthiessen.com/this-is-undefined/
            this.$root.$emit('get-quotesby-clientid', clientId);
          });        
      },
      getVendorByCat: function(vendorCategory) {
        var formData = new FormData();
        formData.append("vendorCategory",vendorCategory);        

        queryParams = new URLSearchParams(formData);
        
        fetch('/getvendorbycat?' + queryParams.toString(), {
          method: 'GET',
          // headers: {
          //   "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          // },   
        })        
        .then(response => 
          response.json()
        )        
        .then(data => {
          this.vendors = data;
        }); 
      }
    },
    computed: {
      //TODO
    }
  })

  Vue.component('vendor-quote-request', {
    props:{     
      userid: String
    },
    template:`
          <div class="service-item" id="service-4">
          <div class="member-thumb">
                  <!-- <img src="images/profile.png" alt=""> -->
                  <div class="team-overlay">
                      <h3>My Vendor Quote Request</h3>
                      <span>Quotes</span>

                      <ul class="progess-bars" id="vendorQuoteList">
                      
                        <li v-for="quote in quotes">
                        <div class='progress'>
                          <div class='' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 90%;'>
                          {{quote.vendorName}}&nbsp($ {{quote.price}})&nbsp
                          <a v-on:click='updateQuoteRequest(quote.id, quote.vendorName, quote.vendorId, quote.clientId, quote.state, quote.price)'>{{quote.state}}</a>
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
        quotes: [],
        id: null
      }
    },
    mounted(){
      this.$root.$on('get-quotesby-clientid', (clientId) => {
        this.getQuotesByClientId (`${clientId}`);
      });
    },
    created: function(){
      //initialize from props
      this.id= this.userid;
      this.getQuotesByClientId(this.id);
    },
    methods: {
      updateQuoteRequest: function(quoteId, vendorName, vendorId, clientId, state, price) {
        
        // console.log(id + "," + vendorName + "," + vendorId + "," + clientId + "," + state);
        if(state === "pending"){
          state = "approved";
        }
        var formData = new FormData();
        formData.append("ID",quoteId);
        formData.append("vendorName",vendorName);
        formData.append("vendorId",vendorId);
        formData.append("clientId",clientId);
        formData.append("state",state);
        formData.append("approved","false");
        formData.append("price",price);

        fetch('/updateQuoteRequest', {
          method: 'POST',
          headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          body: new URLSearchParams(formData)          
        }).then(() => {//https://michaelnthiessen.com/this-is-undefined/
          // this.$root.$emit('get-quotesby-clientid', clientId);
           //update clients vendor quote request list
          this.getQuotesByClientId(clientId);  
        });

      },
      getQuotesByClientId: function(clientId){
        var formData = new FormData();
        formData.append("clientId",clientId);

        queryParams = new URLSearchParams(formData);

        fetch('/getQuoteRequestByClientId?' + queryParams.toString(), {
          method: 'GET',
          headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
        })      
        .then(response => 
          response.json()
        )        
        .then(data => {
          this.quotes = data;
        });      
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