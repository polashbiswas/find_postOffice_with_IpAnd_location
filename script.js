const ip = document.getElementById("ipAdd");
function getData() {
    $.getJSON("https://api.ipify.org?format=json", function (data) {


        console.log("Data", data);
        console.log(data.ip);
        let myIP = data.ip;
        ip.innerText = myIP

        apiRequest(myIP);
        document.querySelector(".container").style.display = "none";
        document.querySelector(".map-container").style.display = "block";
    })
}

function apiRequest(myIP) {
    let token = '6f56b3a1c33ec4';

    fetch(`https://ipinfo.io/${myIP}/geo?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
            console.log("new Data", data);
            time(data);
        })
}
//find the time from timezone
function time(data) {
    const date_time = document.getElementById("dateTime");
    const time_zone = document.getElementById("timeZone");
    const city = document.getElementById("city");
    const org = document.getElementById("organisation");
    const region = document.getElementById("region");
    const host = document.getElementById("host");
    const codepin = document.getElementById("codepin");
    const tz = data.timezone;
    const date = new Date();
    const timeInTz = date.toLocaleString('en-US', { timeZone: tz });
    city.innerHTML = `City: ${data.city}`;
    org.innerHTML = `Organisation: ${data.org}`;
    region.innerHTML = `Region: ${data.region}`;
    host.innerHTML = `Hostname: ${data.hostname}`
    time_zone.innerHTML = `Time Zone: ${data.timezone}`;
    date_time.innerHTML = `Date and Time: ${timeInTz}`;
    codepin.innerHTML = `Pincode: ${data.postal}`;
    console.log(`Time in ${tz}: ${timeInTz}`);
    // const addDiv = document.getElementById("address");
    // addDiv.innerHTML = `<div>
    //                     <h3>City: ${data.city}</h3>
    //                     <h3>Organisation: ${data.org}</h3>
    //                     <div>
    //                     <div>
    //                     <h3>Region: ${data.region}</h3>
    //                     <h3>Hostname: ${data.host}</h3>
    //                     </div>`;
    getLocation();
    let pin = data.postal;
    console.log("postal number is:", pin);
    pincode(pin);

}

//finding lattitude and longitude
const latt = document.getElementById("latt");
const long = document.getElementById("long");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {

    var newlat;
    var newlong;
    newlat = position.coords.latitude;
    newlong = position.coords.longitude;
    console.log(newlat, newlong);
    latt.innerHTML = "Lat: " + position.coords.latitude;
    console.log(latt.innerHTML);
    long.innerHTML = "Long: " + position.coords.longitude;
    console.log(long.innerHTML);
    mapShow(newlat, newlong);
}


//showing map in the page
function mapShow(newlat, newlong) {
    const showMap = document.getElementById("map");
    showMap.innerHTML = `
                        <iframe src = "https://maps.google.com/maps?q=${newlat}, ${newlong}&&output=embed" width="360" height="270" frameborder="0" style="border:0" class = "frameMap"></iframe>
                        `;
}

// function pincode(pin) {
//     fetch(`https://api.postalpincode.in/pincode/${pin}`)
//         .then((res) => res.json())
//         .then((data) => {
//             console.log("new Data", data);
//             console.log(data[0].Message);
//             const msg = document.getElementById("message");
//             msg.innerHTML = `Message: ${data[0].Message}`;
//             data[0].PostOffice.forEach((postOffice) => {
//                 console.log(postOffice.BranchType);
//                 console.log(postOffice.Pincode);
//                 console.log(postOffice.District);
//                 console.log(postOffice.Name);
//                 const postofficeDetails = document.getElementById("postOfficeDetails");
//                 postofficeDetails.innerHTML += `<div class="postDiv">
//                 <p>Name:    ${postOffice.Name}</p>
//                 <p>Branch Type:    ${postOffice.BranchType}</p>
//                 <p>Delivery Status:    ${postOffice.DeliveryStatus}</p>
//                 <p>District:    ${postOffice.District}</p>
//                 <p>Division:    ${postOffice.Division}</p>
//                 </div>`;
//             })
//         })
// }

let arrpin = [];
async function pincode(pin) {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        arrpin = await response.json();
        if (arrpin) {
            console.log("New Data", arrpin);
            console.log(arrpin[0].Message);
    const msg = document.getElementById("message");
    msg.innerHTML = `Message: ${arrpin[0].Message}`;
            apiData(arrpin);
        }
    } catch (e) {
        console.log("Error--", e);
    }
}
//filter
// document.getElementById("search").addEventListener("input", () => {
//     console.log("arrpin[0].PostOffice:", arrpin[0].PostOffice)
//     let filteredArr = arrpin[0].PostOffice.filter((postOffice) => {
//         return postOffice.Name.includes(document.getElementById("search").value);
//     });
//     apiData([{ PostOffice: filteredArr }]);
// });

document.getElementById("search").addEventListener("input", () => {
    let filteredArr = arrpin[0].PostOffice.filter((postOffice) => {
      return (
        postOffice.Name.toLowerCase().includes(document.getElementById("search").value.trim().toLowerCase()) ||
        postOffice.BranchType.toLowerCase().includes(document.getElementById("search").value.trim().toLowerCase())
      );
    });
    apiData([{PostOffice: filteredArr}]);
  });
  



function apiData(arrpin) {
    document.getElementById("postOfficeDetails").innerHTML = "";
    arrpin[0].PostOffice.forEach((postOffice) => {
        console.log(postOffice.BranchType);
        console.log(postOffice.Pincode);
        console.log(postOffice.District);
        console.log(postOffice.Name);
        const postofficeDetails = document.getElementById("postOfficeDetails");
        postofficeDetails.innerHTML += `<div class="postDiv">
        <p>Name:   <span>${postOffice.Name}</span></p>
        <p>Branch Type:    <span>${postOffice.BranchType}</span></p>
        <p>Delivery Status:    <span>${postOffice.DeliveryStatus}</span></p>
        <p>District:    <span>${postOffice.District}</span></p>
        <p>Division:    <span>${postOffice.Division}</span></p>
        </div>`;
    });
}
// let data = [{
//     Message: "Number of pincode(s) found:2",
//     PostOffice : [
//         {
//             Block : "Kolkata",
//             BranchType: "Sub post office",
//             Country: "India",
//             Name: "Bakery Road",
//             Pincode: "700022",
//             Region: "Calcutta"
//         },
//     {
//         Block : "Kolkata",
//             BranchType: "Sub post office",
//             Country: "India",
//             Name: "Bakery Road",
//             Pincode: "700022",
//             Region: "Calcutta"
//     }]
// }]