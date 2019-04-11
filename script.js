const url = "https://developer.nps.gov/api/v1/parks?";
const parameters =
{
    limit : 0,
    fields : "addresses",
    api_key : "SjwQfdCD8ZDIBuhAc3CI0bRZpa5GYmNhOTPCyW6z",
}
let states = [];
//example: https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=2FY7TfemxREgaQLczNAOxocGob26t6tRoGZpYeiP

function setUp()
{
    $("#loadList").load("states.html");
    handleSubmit();
    handleAdd();

}

function handleAdd()
{
    $("#add-button").on("click",function(event)
    {
        event.preventDefault();
        if(!doesContain($("#state option:selected").text()))
        {
            states.push({
                name : $("#state option:selected").text(),
                stateCode : $("#state").val(),
                limit : $("#max").val() -1,
            });
            parameters.limit = $("#max").val() -1;
            setAddSection();
        }
    });
}

function doesContain(n)
{
    for(let i = 0; i < states.length; i++)
    {
        if(n == states[i].name)
            return true;
    }
    return false;
}


function handleSubmit()
{
    $("form").submit(function(event)
    {
        event.preventDefault();
        findParks();
    });
}

function getUrl()
{
    let string = url;
    for(let i = 0; i < states.length; i++)
    {
        string += "stateCode="+states[i].stateCode+"&";
    }
    for(let key in parameters)
    {
        string+= key + "=" + parameters[key] + "&";
    }
    return string;
}

function findParks()
{
   // parameters.stateCode = $("#state").val();
    parameters.limit = $("#max").val() -1; // limit starts from 0 according to the site
    let fullUrl = getUrl();
    //let fullUrl = url+"stateCode="+state+"&api_key="+key;
    fetch(fullUrl)
    .then(response =>
    {
        return response.json();
    })
    .then(responseJson =>
    {
        console.log(responseJson);
        setResults(responseJson);
    })
    .catch(error =>{
        console.log(error);
        setFail();
    });

}

function setFail()
{
    $("#results").html("ERROR! Something went wrong!");
}

function setAddSection()
{
    let string = "<ul>";
    for(let i = 0; i < states.length; i++)
    {
        string += "<li>";
        string += states[i].name;
        string += "</li>";
    }
    string += "</ul>";
    $("#states").html(string);
}


function setResults(responseJson)
{
    let string = "<ul>";
    for(let i in responseJson.data)
    {
        string += "<li>";
        string += "<h1>"+responseJson.data[i].name+"</h1>";
        string += "<p>"+responseJson.data[i].description+"</p>";
        string += "<a href="+responseJson.data[i].url+">"+responseJson.data[i].url+"</a>";
        string += "<p>"+getAddress(responseJson.data[i])+"</p>";
        string += "</li>";
    }
    string += "</ul>";
    $("#results").html(string);
    states = [];
    $("#states").html("");
}

function getAddress(area)
{
    let string = "";
    for(let i in area.addresses[0])
    {
        if(i != "type")
            string += area.addresses[0][i] + " ";
    }
    return string;
}


setUp();