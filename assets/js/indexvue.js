Vue.component('login', {
    template:`
        <div class="site-slider">
            <div class="slider">
                <div class="flexslider">
                    <ul class="slides">
                        <li>
                            <div class="overlay"></div>
                            <img src="images/home-improvement-apps.jpg" alt="">
                            <div class="slider-caption visible-md visible-lg">
                                <h2>Contractor Buddy</h2>
                                <p>Find Pros near you!</p>
                                <div class="contact-form">                                                                                       
                                        <form name="loginform" id="loginform" @submit="loginFunction" method="post" action="/userLogin">
                                            <input type="text" placeholder="email" id="email" v-model="email" name="email" >                    
                                            <input type="submit" class="mainBtn" id="submit" value="Login">
                                        </form>                                            
                                    </div> <!-- /.contact-form -->
                            </div>
                        </li>                           
                    </ul>
                </div> <!-- /.flexslider -->
            </div> <!-- /.slider -->
        </div> <!-- /.site-slider -->
    `,
    data: function () {
        return {
            email:null
          }
      },
    methods: {
        loginFunction: function() {
            console.log(this.email);
            return true;
          }      
    },
    computed: {
      //TODO
    }
  })

  const app = new Vue({
    el: '#app',
    data: {
      //TODO
    }
  });