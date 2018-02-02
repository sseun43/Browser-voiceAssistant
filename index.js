$(document).ready(function(){


const SpeechRecognition =  webkitSpeechRecognition;
const SpeechGrammarList =  webkitSpeechGrammarList;
const SpeechRecognitionEvent =  webkitSpeechRecognitionEvent;

const phrase = "find"

const resultObj ={
  detectedSpeech:"",
  get speechToUse(){return encodeURIComponent(this.detectedSpeech)},
  get wikiApi(){return ("https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&" +
  "titles="+this.speechToUse+"&format=json&exsentences=3&exsectionformat=raw&explaintext")},
  get wikiImage(){return ("https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&titles="+this.speechToUse+"&prop=pageimages&format=json&pithumbsize=100")},
  resultText:"",
  resultImageUrl:"",
}

const testSpeech= ()=> {
  

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
  console.log('Speech recognition service has started');
}

recognition.onnomatch = function() {
  console.log('Speech not recognised');
}

  recognition.onresult = function(event) {
   
    var speechResult = event.results[0][0].transcript;
    let speechArr =speechResult.split(" ")
    speechArr.shift()
    let speech =speechArr.join(" ")
    console.log(speech)
    resultObj.detectedSpeech=speech
    

    $.ajaxSetup({cache:false});
    $.getJSON(resultObj.wikiApi,(data)=> {
      resultObj.resultText=data.query.pages[Object.keys(data.query.pages)[0]].extract
      
      $("#daTitle").text(speech)
      $("#daMaintext").text(resultObj.resultText)
    })

    /*if(speechResult === phrase) {

        /*  const recognition2 = new SpeechRecognition();
            recognition2.lang = 'en-US';
          recognition2.interimResults = false;
          recognition2.maxAlternatives = 1;
        recognition2.start();
        recognition2.onresult = function(event){
          var speechResult2 = event.results[0][0].transcript

          console.log("2nd " + speechResult2)
        }

    } else {
      console.log("you didnt say find")
    }*/

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
  }

  recognition.onerror = function(event) {
    console.log("error occured " + event.error)
  }

  recognition.onaudiostart = function() {
  console.log('Audio capturing started');
}

}

$("#daButton").click(testSpeech)

});