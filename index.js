$(document).ready(function(){


const SpeechRecognition =  webkitSpeechRecognition;
const SpeechGrammarList =  webkitSpeechGrammarList;
const SpeechRecognitionEvent =  webkitSpeechRecognitionEvent;

const phrase = "find"

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
    console.log("1st " + speechResult)
    if(speechResult === phrase) {

        /*  const recognition2 = new SpeechRecognition();
            recognition2.lang = 'en-US';
          recognition2.interimResults = false;
          recognition2.maxAlternatives = 1;
        recognition2.start();
        recognition2.onresult = function(event){
          var speechResult2 = event.results[0][0].transcript

          console.log("2nd " + speechResult2)
        }*/

    } else {
      console.log("you didnt say search")
    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    //testBtn.disabled = false;
    //testBtn.textContent = 'Start new test';
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