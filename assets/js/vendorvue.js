// https://www.freecodecamp.org/news/the-vue-handbook-a-thorough-introduction-to-vue-js-1e86835d8446/
// https://michaelnthiessen.com/this-is-undefined/
Vue.component('profile', {
    props:{
      username: String,
      useremail: String,
      userid: String,
      uservendorcategory: String
    },
    template:`
        <div class="service-item" id="service-1">
                                        
          <div class="member-thumb">
                  <img src="images/profile.png" alt="">
                  <div class="team-overlay">
                      <h3></h3>
                      <span>Vendor Profile</span>

                      <div class="contact-form">                                                                                       
                          <form name="profileform" id="profileform" @submit.prevent="updateFunction">
                            <p>
                                <input v-model="name" type="text" id="name" placeholder="Your Name">
                            </p>
                            <p>
                                <input v-model="email" type="text" id="email" placeholder="Your Email"> 
                            </p>
                            <p>
                            <select v-model="vendorcategory" name="vendorCategory" id="vendorCategory">
                                <option value="noselection" selected>no selection</option>
                                <option v-for="pro in pros" :value="pro.vendorCategory">{{pro.vendorCategory}}</option>
                            </select> 
                            </p>                                
                            <input id="id" v-model="id" type="hidden"> 
                            <input id="type" v-model="type" type="hidden" value="vendor">                                                                                                
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
        type:null,
        vendorcategory:null,
        pros: []
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
      this.type = "vendor";
      this.vendorcategory = this.uservendorcategory;
      this.getvendorcategories();
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
        formData.append("vendorCategory",this.vendorcategory);
        

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
    },
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
    }
    },
    computed: {
      //TODO
    }
  })

  Vue.component('client-quote-request', {
    props:{     
      userid: String
    },
    template:`
        <div class="service-item" id="service-3">
        <div class="member-thumb">
                <!-- <img src="images/profile.png" alt=""> -->
                <div class="team-overlay">
                    <h3>My Client Quote Request</h3>
                    <span>Quote Request</span>

                    <ul class="progess-bars" id="vendorQuoteList">                 
                        <li v-for="quote in validQuotes">
                            <div class='progress'>
                            <div class='' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 90%;'>
                            {{quote.vendorName}}&nbsp(\${{quote.price}})&nbsp
                            <a v-on:click='updateQuoteRequest(quote.id, quote.vendorName, quote.vendorId, quote.clientId, "pending")'>{{quote.state}}</a>
                            </div>
                            <input name="price" type="number" step='.01' :id="'price_' + quote.id" placeholder="0" :value="quote.price">
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
    //   this.$root.$on('get-quotesby-clientid', (clientId) => {
    //     this.getQuotesByClientId (`${clientId}`);
    //   });
    },
    created: function(){
      //initialize from props
      this.id= this.userid;
      this.getQuoteRequestByVendorId(this.id);
    },
    methods: {
        getQuoteRequestByVendorId: function(vendorId) {
            // console.log(id + "," + vendorName + "," + vendorId + "," + clientId + "," + state);

            var formData = new FormData();
            formData.append("vendorId",vendorId);
            
            queryParams = new URLSearchParams(formData);

            fetch('/getQuoteRequestByVendorId?' + queryParams.toString(), {
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
            })
            .catch(err => console.error(err));      

      },      
      updateQuoteRequest: function(quoteId, vendorName, vendorId, clientId, state) {
        
        // console.log(id + "," + vendorName + "," + vendorId + "," + clientId + "," + state);
        var price = $("#price_"+ quoteId).val();

        if(state === "approved"){
            state = "complete";
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
          //  getQuotesByClientId(clientId); 
          this.getQuoteRequestByVendorId(vendorId); 
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
        validQuotes: function () {
            //only show qoutes in a submitted or pending state
            console.log(this.quotes);
            return this.quotes.filter(function (quote) {
                return quote.state === "submitted" || quote.state === "pending"
              });
          }
    }
  })

    Vue.component('client-quote-request', {
    props:{     
      userid: String
    },
    template:`
        <div class="service-item" id="service-3">
        <div class="member-thumb">
                <!-- <img src="images/profile.png" alt=""> -->
                <div class="team-overlay">
                    <h3>My Client Quote Request</h3>
                    <span>Quote Request</span>

                    <ul class="progess-bars" id="vendorQuoteList">                 
                        <li v-for="quote in validQuotes">
                            <div class='progress'>
                            <div class='' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 90%;'>
                            {{quote.vendorName}}&nbsp(\${{quote.price}})&nbsp
                            <a v-on:click='updateQuoteRequest(quote.id, quote.vendorName, quote.vendorId, quote.clientId, "pending")'>{{quote.state}}</a>
                            </div>
                            <input name="price" type="number" step='.01' :id="'price_' + quote.id" placeholder="0" :value="quote.price">
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
    //   this.$root.$on('get-quotesby-clientid', (clientId) => {
    //     this.getQuotesByClientId (`${clientId}`);
    //   });
    },
    created: function(){
      //initialize from props
      this.id= this.userid;
      this.getQuoteRequestByVendorId(this.id);
    },
    methods: {
        getQuoteRequestByVendorId: function(vendorId) {
            // console.log(id + "," + vendorName + "," + vendorId + "," + clientId + "," + state);

            var formData = new FormData();
            formData.append("vendorId",vendorId);
            
            queryParams = new URLSearchParams(formData);

            fetch('/getQuoteRequestByVendorId?' + queryParams.toString(), {
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
            })
            .catch(err => console.error(err));      

      },      
      updateQuoteRequest: function(quoteId, vendorName, vendorId, clientId, state) {
        
        // console.log(id + "," + vendorName + "," + vendorId + "," + clientId + "," + state);
        var price = $("#price_"+ quoteId).val();

        if(state === "approved"){
            state = "complete";
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
          //  getQuotesByClientId(clientId); 
          this.getQuoteRequestByVendorId(vendorId); 
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
        validQuotes: function () {
            //only show qoutes in a submitted or pending state
            return this.quotes.filter(function (quote) {
                return quote.state === "submitted" || quote.state === "pending"
              });
          }
    }
  })

  Vue.component('vendor-jobs-inbox', {
    props:{     
      userid: String
    },
    template:`
        <div class="service-item" id="service-4">
            <div class="member-thumb">
                    <!-- <img src="images/profile.png" alt=""> -->
                    <div class="team-overlay">
                        <h3>My Jobs Inbox</h3>
                        <span>Jobs</span>

                        <ul class="progess-bars" id="vendorJobsQuoteList"> 
                            <li v-for="quote in quotes">
                                <div class='progress'>
                                <div class='' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 90%;'>
                                {{quote.vendorName}}&nbsp(\${{quote.price}})&nbsp
                                <a v-on:click='updateQuoteRequest(quote.id, quote.vendorName, quote.vendorId, quote.clientId, quote.state)'>{{quote.state}}</a>
                                </div>
                                <input name="price" type="number" step='.01' :id="'price_' + quote.id" placeholder="0" :value="quote.price">
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
    //TODO
    },
    created: function(){
      //initialize from props
      this.id= this.userid;
      this.getQuoteRequestByVendorIdAndState(this.id, "approved");
    },
    methods: {
        /*
        * Get quotes associated with this client id.
        */
        getQuoteRequestByVendorIdAndState: function(vendorId, state){
            // console.log(id + "," + vendorName + "," + vendorId + "," + clientId + "," + state);

            var formData = new FormData();
            formData.append("vendorId",vendorId);
            formData.append("state",state);

            queryParams = new URLSearchParams(formData);

            fetch('/getQuoteRequestByVendorIdAndState?' + queryParams.toString(), {
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
                //console.log(data);
            })
            .catch(err => console.error(err));      

      },      
      updateQuoteRequest: function(quoteId, vendorName, vendorId, clientId, state) {
        
        // console.log(id + "," + vendorName + "," + vendorId + "," + clientId + "," + state);
        var price = $("#price_"+ quoteId).val();

        if(state === "approved"){
            state = "complete";
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
          //this.getQuoteRequestByVendorId(vendorId); 
          //refresh list after update
          this.getQuoteRequestByVendorIdAndState(this.id, "approved");
        });

      },     
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