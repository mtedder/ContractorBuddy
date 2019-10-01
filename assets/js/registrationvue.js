Vue.component('registration', {
    props:{
      //TODO
    },
    template:`
    <div class="service-item" id="service-1">
                                    
    <div class="member-thumb">
            <img src="images/profile.png" alt="">
            <div class="team-overlay">                                                    
                <div class="contact-form">
                <form name="registerform" id="registerform" method="POST" action="/register">
                  <p>
                      <input v-model="name" name="name" type="text" id="name" placeholder="Your Name">
                  </p>
                  <p>
                      <input v-model="email" name="email" type="email" id="email" placeholder="Your Email"> 
                  </p>
                  <p>
                    <select v-model="type" name="type" id="type" v-on:change="showVendorCat">
                        <option value="client">Client</option>
                        <option value="vendor">Vendor</option>                                                                    
                    </select>  
                  </p>                  
                  <p>
                    <select v-if="showvendorcat" v-model="vendorCategory" name="vendorCategory" id="vendorCategory">
                      <option value="noselection" selected>no selection</option>
                      <option v-for="pro in pros" :value="pro.vendorCategory">{{pro.vendorCategory}}</option>
                    </select>                  
                  </p> 
                  <input type="submit" value="Sign Me Up!" class="mainBtn"/>
                </form>    
                   
                </div> <!-- /.contact-form -->

            </div> <!-- /.team-overlay -->
    </div> <!-- /.member-thumb -->
                                           
</div> <!-- /#service-1 -->
    `,
    data: function() {
      return {
        pros:[],
        name:null,
        email:null,
        vendorCategory:null,
        type:null,
        showvendorcat: false
      }
    },
    ready: function () {
      //this.name = this.username;
      //console.log(this.username);
      // <input type="submit" class="mainBtn" id="submit" value="Sign Me Up!">
    },
    created(){
      this.getvendorcategories();
    },
    methods: {
      registerFunction: function() {
        // ref: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
        // https://appdividend.com/2018/08/20/javascript-fetch-api-example-tutorial/
        // https://javascript.info/fetch-api
        // https://michaelnthiessen.com/this-is-undefined/

        var formData = new FormData();
        formData.append("vendorCategory",this.vendorCategory);
        formData.append("name",this.name);
        formData.append("email",this.email);
        formData.append("type",this.type);

        // console.log((new URLSearchParams(formData)).toString());

        fetch('/register', {
          method: 'POST',
          redirect: 'follow',
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
      },
      showVendorCat(){
        if(this.type === "client"){
          this.showvendorcat = false;
        }else{
          this.showvendorcat = true;
        }
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