// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Ref:

// https://www.sohamkamani.com/blog/2017/09/13/how-to-build-a-web-application-in-golang/
// https://medium.com/the-andela-way/build-a-restful-json-api-with-golang-85a83420c9da
// https://cloud.google.com/appengine/docs/standard/go111/
// https://cloud.google.com/appengine/docs/standard/go111/setting-up-environment
// https://cloud.google.com/sdk/docs/#deb
// https://golang.org/doc/install
// https://eager.io/blog/go-and-json/
// https://golang.org/pkg/net/http/
// https://astaxie.gitbooks.io/build-web-application-with-golang/en/04.1.html
// https://systemoverlord.com/2016/08/24/posting-json-with-an-html-form.html
// https://golang.org/pkg/encoding/json/#Decoder
// https://www.golangprograms.com/golang-program-to-demonstrates-how-to-encode-map-data-into-a-json-string.html
// https://firebase.google.com/docs/firestore/quickstart
// https://medium.com/google-cloud/firebase-developing-serverless-functions-in-go-963cb011265d
// https://stackoverflow.com/questions/52752037/should-a-firestore-client-be-created-per-a-request-with-google-app-engine
// https://www.fullstackfirebase.com/cloud-firestore/notes
// https://meshstudio.io/blog/2017-11-06-serving-html-with-golang/
// https://gowebexamples.com/templates/
// https://forum.golangbridge.org/t/serving-css-files/2386/7
// https://alligator.io/js/axios-vanilla-js/
// https://github.com/axios/axios

// [START gae_go111_app]

// Sample helloworld is an App Engine app.
package main

// [START import]
import (
	"encoding/json"
	"fmt"
	"log"
	//"github.com/mitchellh/mapstructure"
	"net/http"
	"strconv"
	"html/template"
	// "strings"
	//"io/ioutil"
	// "os"
	"google.golang.org/api/iterator"
	"context"
	"github.com/gorilla/mux"
	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
	
  
)

// [END import]
// [START main_func]

//form input as array
// type User struct {
// 	Email []string `json:"email"`
// 	Name []string `json:"name"`
// 	Type []string `json:"type"`
// }

type User struct {
	ID string `json:"id"`
	Email string `json:"email"`
	Name string `json:"name"`
	Type string `json:"type"`
	VendorCategory string `json:"vendorCategory"`
}

type Category struct {		
	VendorCategory string `json:"vendorCategory"`
}

/*
* State can take on the following lifecyle of values of:
* submitted = client submitted to vendor for a quote.
* pending = Vendor provided a quote to the client & waiting for approval from client
* approved = Client approved vendor quote and OK for vendor to start job.
* complete = Vendor marked client job as complete
*/
type QuoteRequest struct {
	ID string `json:"id"`
	VendorName string `json:"vendorName"`
	VendorId string `json:"vendorId"`
	ClientId string `json:"clientId"`
	State string `json:"state"`
	Approved bool `json:"approved"`
	Price float64 `json:"price"`
}

type TodoPageData struct {
    PageTitle string   
}

var client *firestore.Client

var tmplClient *template.Template
var tmplVendor *template.Template

func init(){
		// Use a service account
	// Get a Firestore client.	
	ctx := context.Background()

	//for use with Initialize on your own server (local) - comment for deploy to cloud
	option.WithCredentialsFile("contractorbuddy-ffd0a89386e1.json")

	var err	error

	client, err = firestore.NewClient(ctx, "contractorbuddy")
	//client, err := firestore.NewApp(ctx, "contractorbuddy")
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}

	//tmpl := template.Must(template.ParseFiles("assets/client.html"))
	tmplClient, err = template.ParseFiles("assets/client.html")
	if err != nil {
		log.Fatalf("Failed to create template: %v", err)
	}

	tmplVendor, err = template.ParseFiles("assets/vendor.html")
	if err != nil {
		log.Fatalf("Failed to create template: %v", err)
	}

	// Close client when done.
	//defer client.Close()
}


func main() {

	// [START fs_add_data_1]
	// _, _, err := client.Collection("users").Add(context.Background(), map[string]interface{}{
	// 	"first": "Zoe",
	// 	"last":  "Dee",
	// 	"born":  2001,
	// })
	// if err != nil {
	// 	log.Fatalf("Failed adding alovelace: %v", err)
	// }

	router := mux.NewRouter()

	//router.StrictSlash(true)
	router.HandleFunc("/", indexHandler).Methods("GET")
	router.HandleFunc("/register", registerUserRte).Methods("POST")
	router.HandleFunc("/userLogin", userLoginRte).Methods("POST")
	router.HandleFunc("/updateUserProfile", updateUserProfileRte).Methods("POST")
	router.HandleFunc("/getvendorbycat", getVendorByCategoryRte).Methods("GET")
	router.HandleFunc("/getvendorcategories", getAllCategoriesRte).Methods("GET")
	router.HandleFunc("/createQuoteRequest", createQuoteRequestRte).Methods("POST")
	router.HandleFunc("/updateQuoteRequest", updateQuoteRequestRte).Methods("POST")
	router.HandleFunc("/getQuoteRequestByClientId", getQuoteRequestByClientIdRte).Methods("GET")
	router.HandleFunc("/getQuoteRequestByVendorId", getQuoteRequestByVendorIdRte).Methods("GET")
	router.HandleFunc("/getQuoteRequestByVendorIdAndState", getQuoteRequestByVendorIdAndStateRte).Methods("GET")
		
	//router.HandleFunc("/events", getAllEvents).Methods("GET")
	//router.HandleFunc("/events/{id}", getOneEvent).Methods("GET")

	// Declare the static file directory and point it to the
	// directory we just made
	staticFileDirectory := http.Dir("./assets/")
	// Declare the handler, that routes requests to their respective filename.
	// The fileserver is wrapped in the `stripPrefix` method, because we want to
	// remove the "/assets/" prefix when looking for files.
	// For example, if we type "/assets/index.html" in our browser, the file server
	// will look for only "index.html" inside the directory declared above.
	// If we did not strip the prefix, the file server would look for
	// "./assets/assets/index.html", and yield an error
	staticFileHandler := http.StripPrefix("/assets/", http.FileServer(staticFileDirectory))
	// The "PathPrefix" method acts as a matcher, and matches all routes starting
	// with "/assets/", instead of the absolute route itself
	router.PathPrefix("/assets/").Handler(staticFileHandler).Methods("GET")

	//static css files
	router.PathPrefix("/css/").Handler(http.StripPrefix("/css/",
		http.FileServer(http.Dir("assets/css/"))))

	//static images files
	router.PathPrefix("/images/").Handler(http.StripPrefix("/images/",
		http.FileServer(http.Dir("assets/images/"))))
		
	//static fonts files
	router.PathPrefix("/fonts/").Handler(http.StripPrefix("/fonts/",
		http.FileServer(http.Dir("assets/fonts/"))))
		
	//static js files
	router.PathPrefix("/js/").Handler(http.StripPrefix("/js/",
		http.FileServer(http.Dir("assets/js/"))))			

	log.Fatal(http.ListenAndServe(":8080", router))

	//http.HandleFunc("/", indexHandler)


	
	// http.Handle(
	// 	"/assets/",
	// 	http.StripPrefix(
	// 	  "/assets/",
	// 	  http.FileServer(http.Dir("assets")),
	// 	),
	//   )

	// // [START setting_port]
	// port := os.Getenv("PORT")
	// if port == "" {
	// 	port = "8080"
	// 	log.Printf("Defaulting to port %s", port)
	// }

	// log.Printf("Listening on port %s", port)
	// log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
	// [END setting_port]
}

// [END main_func]

// [START indexHandler]

// indexHandler responds to requests with our greeting.
func indexHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	fmt.Fprint(w, "Hello, World2!")
}

/*
* Login flow. Look up user in DB. If they do not exist redirect to registration page.
*/
func userLoginRte(w http.ResponseWriter, r *http.Request){

	r.ParseForm() //required

	email := r.PostFormValue("email")

	// Create a new instance of User
	user := User{}

		//create query
		iter := client.Collection("users").Where("Email", "==", email).Documents(context.Background())

		for {
			doc, err := iter.Next()
			if err == iterator.Done {
					break
			}
			if err != nil {
					//return err
					fmt.Println(err)
			}
			
			//convert map data to struct
			doc.DataTo(&user)			
		}
		
		//if user not present in DB (registered) send to registration page
		if (User{}) == user {
			http.Redirect(w, r, "/assets/register.html", http.StatusFound)
		}
		
		if user.Type == "client" {			
			tmplClient.Execute(w, user)//client template
		}else if user.Type == "vendor" {//forward to vendor page
			tmplVendor.Execute(w, user)//client template
		}

}
/*
* Register user routing.
*/
func registerUserRte(w http.ResponseWriter, r *http.Request) {	

	// Create a new instance of User
	newUser := User{}
	
	r.ParseForm() //required

	//***NEED A STRUCT WITH ARRAY MEMBER FOR THIS TO WORK
	// data, err := json.Marshal(r.Form) //comvert form data to slice

	// if err != nil {
	// 	fmt.Fprintf(w, "Kindly enter data with the event title and description only in order to update")
	// }
	
	// json.Unmarshal(data, &newUser)//initilize struct w/ form data as array

	// fmt.Println(newUser)	

	// //alternate method using a loop
	// for k, v := range r.Form {
    //     fmt.Println("key:", k)
	// 	fmt.Println("val:", strings.Join(v, ""))
	// }

	//or get form value manually
	newUser.Email = r.PostFormValue("email")
	newUser.Name = r.PostFormValue("name")
	newUser.Type = r.PostFormValue("type")
	newUser.VendorCategory = r.PostFormValue("vendorCategory")

	//add new user to db
	registerUser(newUser)
	
	//fmt.Fprint(w, "User registered")
	if newUser.Type == "client" {
		tmplClient.Execute(w, newUser)//client template
	}else if newUser.Type == "vendor" {//forward to vendor page
		tmplVendor.Execute(w, newUser)//client template
	}
	
	//json.NewEncoder(w).Encode(&newUser)	
}

/*
* Register user by adding to user table.
*/
func registerUser(user User){
	//Add to firestore DB users table
	doc, _, err := client.Collection("users").Add(context.Background(), user)
	//get DB id assigned to this doc and store it in the struct	
	user.ID = doc.ID
	client.Collection("users").Doc(user.ID).Set(context.Background(), map[string]interface{}{
		"ID": user.ID,
	}, firestore.MergeAll)

	if err != nil {
		log.Fatalf("Failed adding registerUser: %v", err)
	}
}

/*
* Update the user profile in the DB routing.
*/
func updateUserProfileRte(w http.ResponseWriter, r *http.Request) {	

	// Create a new instance of User
	user := User{}
	
	r.ParseForm() //required

	//or get form value manually
	user.ID = r.PostFormValue("id")
	user.Email = r.PostFormValue("email")
	user.Name = r.PostFormValue("name")
	user.Type = r.PostFormValue("type")
	user.VendorCategory = r.PostFormValue("vendorCategory")
	
	updateUserProfile(user)
}
/*
* Update the user profile in the DB.
*/
func updateUserProfile(user User){
	client.Collection("users").Doc(user.ID).Set(context.Background(), map[string]interface{}{		
		"Email" : user.Email,
		"Name" : user.Name,
		"Type" : user.Type,
		"VendorCategory" : user.VendorCategory,		
	}, firestore.MergeAll)
}

/*
* Get vendors by category routing
*/
func getVendorByCategoryRte(w http.ResponseWriter, r *http.Request) {	
	r.ParseForm() //required
	
	category := r.Form.Get("vendorCategory")
	// fmt.Println(category)
	vendors := getVendorByCategory(category)

	json.NewEncoder(w).Encode(&vendors)

}

/*
* Return an array of all vendors types for the specified category.
*/
func getVendorByCategory (category string) []User{

	var users []User
	user := User{}

	//create query
	iter := client.Collection("users").Where("VendorCategory", "==", category).Documents(context.Background())

	for {
        doc, err := iter.Next()
        if err == iterator.Done {
                break
        }
        if err != nil {
				//return err
				fmt.Println(err)
        }
		//fmt.Println(doc.Data())
		//convert map data to struct
		doc.DataTo(&user)
		//mapstructure.Decode(doc.Data(), &user)
		users = append(users, user)
	}
	// fmt.Println(users)
	return users
}

/*
* Get all vendor categories routing.
*/
func getAllCategoriesRte(w http.ResponseWriter, r *http.Request){
	
	categories := getAllCategories()

	json.NewEncoder(w).Encode(&categories)
}
/*
* Return a json object of all vendor categories.
*/
func getAllCategories () []Category{
	var categories []Category
	category := Category{}

	//create query
	//client.Collection("categories").Doc("BJ").Get(ctcontext.Background()x)//singel dov by key

	iter := client.Collection("categories").Documents(context.Background())

	for {
        doc, err := iter.Next()
        if err == iterator.Done {
                break
        }
        if err != nil {
				//return err
				fmt.Println(err)
        }
		//fmt.Println(doc.Data())
		doc.DataTo(&category)
		//convert map data to struct
		//mapstructure.Decode(doc.Data(), &category)
		categories = append(categories, category)
	}	
	return categories
}

/*
* Create a quote request in the quotes table routing.
*/
func createQuoteRequestRte(w http.ResponseWriter, r *http.Request){
	// Create a new instance of User
	quoteRequest := QuoteRequest{}	

	r.ParseForm() //required

	var err error
	_ = err // err is now "used"
	//
	var errr error
	_ = errr // errr is now "used"
	
	//or get form value manually
	quoteRequest.VendorName = r.PostFormValue("vendorName")
	quoteRequest.VendorId = r.PostFormValue("vendorId")
	quoteRequest.ClientId = r.PostFormValue("clientId")
	quoteRequest.State = r.PostFormValue("state")
	quoteRequest.Approved, err = strconv.ParseBool(r.PostFormValue("approved"))
	quoteRequest.Price, errr = strconv.ParseFloat(r.PostFormValue("price"), 64)	

	//add new quoteRequest to db
	createQuoteRequest(quoteRequest)
}

/*
* Create a quote request in the quotes table.
*
* State can take on the following lifecyle of values:
* 1. submitted - client has sent quote request to vendor
* 2. pending - awaiting quote from vendor
* 3. processed - vendor has provided a quote for the job request
* 4. live and/or dead - live if the client approved the vendors quote or dead if the client rejected it
* 5. complete - vendor has complete the job for the client
*/
func createQuoteRequest(quoteRequest QuoteRequest){
	//Add to firestore DB users table
	doc, _, err := client.Collection("quotes").Add(context.Background(), quoteRequest)
	//get DB id assigned to this doc and store it in the struct	
	quoteRequest.ID = doc.ID
	client.Collection("quotes").Doc(quoteRequest.ID).Set(context.Background(), map[string]interface{}{
		"ID": quoteRequest.ID,
	}, firestore.MergeAll)

	if err != nil {
		log.Fatalf("Failed adding createQuoteRequest: %v", err)
	}
}

/*
* Update quote request in the quotes table routing.
*/
func updateQuoteRequestRte(w http.ResponseWriter, r *http.Request){
	// Create a new instance of User
	quoteRequest := QuoteRequest{}	

	r.ParseForm() //required

	var err error
	_ = err // err is now "used"
	//
	var errr error
	_ = errr // errr is now "used"

	//or get form value manually
	quoteRequest.ID = r.PostFormValue("ID")
	quoteRequest.VendorName = r.PostFormValue("vendorName")
	quoteRequest.VendorId = r.PostFormValue("vendorId")
	quoteRequest.ClientId = r.PostFormValue("clientId")
	quoteRequest.State = r.PostFormValue("state")
	quoteRequest.Approved, err = strconv.ParseBool(r.PostFormValue("approved"))	
	quoteRequest.Price, errr = strconv.ParseFloat(r.PostFormValue("price"), 64)

	//update quoteRequest to db
	updateQuoteRequest(quoteRequest)
}

/*
* Update the values of the quoteRequest in the DB for the object passed in as a parameter 
*/
func updateQuoteRequest(quoteRequest QuoteRequest){
	
	client.Collection("quotes").Doc(quoteRequest.ID).Set(context.Background(), map[string]interface{}{
		"VendorName":quoteRequest.VendorName,
		"VendorId":quoteRequest.VendorId,
		"ClientId":quoteRequest.ClientId,
		"State":quoteRequest.State,
		"Approved":quoteRequest.Approved,
		"Price":quoteRequest.Price,
	}, firestore.MergeAll)

	// if err != nil {
	// 	log.Fatalf("Failed adding quoteRequest: %v", err)
	// }
}

/*
* Get request - Return all QuoteRequest with this client id routing.
*/
func getQuoteRequestByClientIdRte(w http.ResponseWriter, r *http.Request){
		
		r.ParseForm() //required

		clientId := r.Form.Get("clientId")

		//fmt.Println(clientId)

		quoteRequests := getQuoteRequestByClientId(clientId)

		json.NewEncoder(w).Encode(&quoteRequests)

}

/*
* Return all QuoteRequest with this client id
*/
func getQuoteRequestByClientId(clientId string) []QuoteRequest{
	var quoteRequests []QuoteRequest
	quoteRequest := QuoteRequest{}

	//create query
	iter := client.Collection("quotes").Where("ClientId", "==", clientId).Documents(context.Background())

	for {
        doc, err := iter.Next()
        if err == iterator.Done {
                break
        }
        if err != nil {
				//return err
				fmt.Println(err)
		}
		
		//convert map data to struct
		doc.DataTo(&quoteRequest)
		quoteRequests = append(quoteRequests, quoteRequest)
	}
	//fmt.Println(quoteRequests)
	return quoteRequests
}

/*
* Return all QuoteRequest with this vendor id routing.
*/
func getQuoteRequestByVendorIdRte(w http.ResponseWriter, r *http.Request){	

	r.ParseForm() //required

	

	vendorId := r.Form.Get("vendorId")

	quoteRequests := getQuoteRequestByVendorId(vendorId)

	json.NewEncoder(w).Encode(&quoteRequests)
}

/*
* Return all QuoteRequest with this client id.
*/
func getQuoteRequestByVendorId(vendorId string) [] QuoteRequest{

	var quoteRequests []QuoteRequest
	quoteRequest := QuoteRequest{}

	//create query
	iter := client.Collection("quotes").Where("VendorId", "==", vendorId).Documents(context.Background())

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
				break
		}
		if err != nil {
				//return err
				fmt.Println(err)
		}
		
		//convert map data to struct
		doc.DataTo(&quoteRequest)
		quoteRequests = append(quoteRequests, quoteRequest)
	}

	// fmt.Println(quoteRequests)
	return quoteRequests
}

/*
* Return all QuoteRequest with this client id and live state routing.
*/
func getQuoteRequestByVendorIdAndStateRte(w http.ResponseWriter, r *http.Request){

	r.ParseForm() //required

	vendorId := r.Form.Get("vendorId")
	state := r.Form.Get("state")

	quoteRequests := getQuoteRequestByVendorIdAndState(vendorId, state)
	
	json.NewEncoder(w).Encode(&quoteRequests)
}

/*
* Return all QuoteRequest with this client id and live state.
*/
func getQuoteRequestByVendorIdAndState(vendorId string, state string) []QuoteRequest{

	var quoteRequests []QuoteRequest
	quoteRequest := QuoteRequest{}

	//create query
	iter := client.Collection("quotes").Where("VendorId", "==", vendorId).Where("State", "==", state).Documents(context.Background())

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
				break
		}
		if err != nil {
				//return err
				fmt.Println(err)
		}
		
		//convert map data to struct
		doc.DataTo(&quoteRequest)
		quoteRequests = append(quoteRequests, quoteRequest)
	}
	// fmt.Println(quoteRequests)
	return quoteRequests
}

// [END indexHandler]
// [END gae_go111_app]