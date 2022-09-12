
const razorPayBtn = document.getElementById("rzp-button1");
razorPayBtn.addEventListener("click" , async function(e){
// req to backend for payemnt.
 const response = await fetch(
   "https://64ac-122-161-51-29.in.ngrok.io/checkout" // link with ngrok 
 );
 const data  = await response.json(); // converting unwanted response to the  requird json object data
    console.log(data);
    // this data will reflict to payment paze and match with dashbord info fwd from backend.
   var options = {
     key: "rzp_test_pHxIiDeJJosPVd", // Enter the Key ID generated from the Dashboard(public key)
     amount: data.amount,  //  Default currency is INR. Hence, 50000 refers to 50000 paise
     currency: data.currency,
     name: "Acme Corp",
     description: data.product,
      prefill: {
       name: "Gaurav Kumar",
       email: "gaurav.kumar@example.com",
       contact: "9999999999",
     },
   };
    // create razorPay payment-paze (get url from html page)
    var rzp1 = new Razorpay(options);
    // open razorpay payment paze
     rzp1.open();
     // prevent to relod payment paze 
    e.preventDefault();

})
