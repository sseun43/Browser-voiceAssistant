$(document).ready(function(){

   // jQuery methods go here...


const SpeechRecognition =  webkitSpeechRecognition;
const SpeechGrammarList =  webkitSpeechGrammarList;
const SpeechRecognitionEvent =  webkitSpeechRecognitionEvent;

const phrase = "Search"

const testSpeech= ()=> {
  //testBtn.disabled = true;
  //testBtn.textContent = 'Test in progress';

  //const phrase = "Search"
  

  const grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  const recognition = new SpeechRecognition();
  
  const speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.start();

  recognition.onresult = function(event) {
   
    var speechResult = event.results[0][0].transcript;
    console.log(speechResult)
    //diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
    if(speechResult === phrase) {

      const recognition2 = new SpeechRecognition();
        recognition2.lang = 'en-US';
      recognition2.interimResults = false;
      recognition2.maxAlternatives = 1;
    recognition2.start();
    recognition2.onresult = function(event){
      var speechResult2 = event.results[0][0].transcript
      console.log(speechResult2)
    }
    } else {
      console.log("not searching")
    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    //testBtn.disabled = false;
    //testBtn.textContent = 'Start new test';
  }

  recognition.onerror = function(event) {
    //testBtn.disabled = false;
    //testBtn.textContent = 'Start new test';
    //diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

}

$("#daButton").click(testSpeech)

});