$(document).ready(function(){ 

const synth = window.speechSynthesis;
const SpeechRecognition =  webkitSpeechRecognition;
const SpeechGrammarList =  webkitSpeechGrammarList;
const SpeechRecognitionEvent =  webkitSpeechRecognitionEvent;

const phrase = "find"

const resultObj ={
  detectedSpeech:"",
  get speechToUse(){return encodeURIComponent(this.detectedSpeech)},
  get wikiApi(){return ("https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&" +
  "titles="+this.speechToUse+"&format=json&exsentences=2&exsectionformat=raw&explaintext")},
  get wikiImage(){return ("https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&titles="+this.speechToUse+"&prop=pageimages&format=json&pithumbsize=100")},
  resultText:"",
  resultImageUrl:"",
}

const testSpeech= ()=> {
  $("#daLoader").text("Ready to listen to your commands..")

  const grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  const recognition = new SpeechRecognition();
  
  const speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.start();

    recognition.onstart = function() {
    //console.log('Speech recognition service has started');
  }

  recognition.onnomatch = function() {
    console.log('Speech not recognised');
  }

  recognition.onresult = function(event) {
   
    var speechResult = event.results[0][0].transcript;

      $("#daLoader").text("Detected " + speechResult)
      let speechArr =speechResult.split(" ")
      speechArr.shift()
      let speech =speechArr.join(" ")
      console.log(speech)
      resultObj.detectedSpeech=speech
    

    $.ajaxSetup({cache:false});

    $.getJSON(resultObj.wikiApi,(data)=> {  
      resultObj.resultText=data.query.pages[Object.keys(data.query.pages)[0]].extract

      if(resultObj.resultText){
      $("#daTitle").text(speech)
      $("#daMaintext").text(resultObj.resultText)

        const utterThis = new SpeechSynthesisUtterance(resultObj.resultText)
        utterThis.lang ='en-US'
        synth.speak(utterThis)
        
      $("#daLoader").text("Ready to listen to your commands")
    }else{
      $("#daTitle").text("Bad command :please try again with different word")
      $("#daMaintext").text("")
        const utterThis = new SpeechSynthesisUtterance("Bad command :please try again with different word")
        utterThis.lang ='en-US'
        synth.speak(utterThis)
    }
      
      
    })

    $.getJSON(resultObj.wikiImage,(data)=>{
      resultObj.resultImageUrl=data.query.pages[Object.keys(data.query.pages)[0]].thumbnail.source

      $("#daImage").attr("src",resultObj.resultImageUrl)
    })

       
        

   

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechstart = function() {
  $("body").css("background-color","#B0E0E6")
}

  recognition.onspeechend = function() {
    recognition.stop();
    $("body").css("background-color","white")
  }

  recognition.onerror = function(event) {
    console.log("error occured " + event.error)
  }

  recognition.onaudiostart = function() {
  console.log('Audio capturing started');
}

}

$("#daButton").click(testSpeech)

 addEventListener("keydown", function(event) {
    if (event.keyCode == 13)
      testSpeech()
  });

});