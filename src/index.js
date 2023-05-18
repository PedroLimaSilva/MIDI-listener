import "./styles.css";
import { PianoAudio } from "./services/AudioPlayer";

const currentNotes = {};
// Access MIDI input device
navigator.requestMIDIAccess().then(function (midiAccess) {
  // Get first input device
  var inputDevice = midiAccess.inputs.values().next().value;

  if (inputDevice) {
    // Listen for MIDI input events
    inputDevice.onmidimessage = function (event) {
      switch (event.data[0] & 0xf0) {
        case 0x90: // Check if note on event
          // Display note in container element
          if (event.data[2] !== 0) {
            // if velocity != 0, this is a note-on message
            const notation = getNoteNotation(event.data[1]);
            if (!currentNotes[notation]) {
              currentNotes[notation] = true;
              renderNotes();
              PianoAudio.triggerAttackRelease([notation], 0.5);
            }
            return;
          }
          break;
        case 0x80:
          const notation = getNoteNotation(event.data[1]);
          if (currentNotes[notation]) {
            currentNotes[notation] = false;
          }
          renderNotes();
          break;
        default:
          console.log(event.data);
      }
    };
  }
});

function renderNotes() {
  document.getElementById("note-display").innerText = Object.keys(currentNotes)
    .sort()
    .filter((k) => currentNotes[k])
    .toString();
}

// Function to get note name
function getNoteNotation(noteNumber) {
  var noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
  ];
  var octave = Math.floor(noteNumber / 12) - 1;
  var noteIndex = noteNumber % 12;
  return noteNames[noteIndex] + octave;
}
