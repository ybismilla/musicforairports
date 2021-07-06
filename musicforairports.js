const SAMPLE_LIBRARY = {
    'viola': [    
           { note: 'A',  octave: 4, file: 'samples/viola/A4-tremolo-PB-loop.wav' },
           { note: 'A',  octave: 5, file: 'samples/viola/A5-tremolo-PB-loop.wav' },
           { note: 'A',  octave: 6, file: 'samples/viola/A6-tremolo-PB-loop.wav' },
           { note: 'C',  octave: 4, file: 'samples/viola/C4-tremolo-PB-loop.wav' },
           { note: 'C',  octave: 5, file: 'samples/viola/C5-tremolo-PB-loop.wav' },
           { note: 'C',  octave: 6, file: 'samples/viola/C6-tremolo-PB-loop.wav' },
           { note: 'D',  octave: 4, file: 'samples/viola/D4-tremolo-PB-loop.wav' },
           { note: 'D',  octave: 5, file: 'samples/viola/D5-tremolo-PB-loop.wav' },
           { note: 'D',  octave: 6, file: 'samples/viola/D6-tremolo-PB-loop.wav' },
           { note: 'F',  octave: 4, file: 'samples/viola/F4-tremolo-PB-loop.wav' },
           { note: 'F',  octave: 5, file: 'samples/viola/F5-tremolo-PB-loop.wav' },
           { note: 'F',  octave: 6, file: 'samples/viola/F6-tremolo-PB-loop.wav' }
    ]
}   

const OCTAVE = ['C', 'C3', 'D', 'D#', 'E', 'F' , 'F#', 'G', 'G#', 'A', 'A#', 'B', 'B#'];

let audioContext = new AudioContext();


function flatToSharp(note) {
    switch (note) {
      case 'Bb': return 'A#';
      case 'Db': return 'C#';
      case 'Eb': return 'D#';
      case 'Gb': return 'F#';
      case 'Ab': return 'G#';
      default:   return note;
    }
  }

function getSample(instrument, noteAndOctave) {
    let [, requestedNote, requestedOctave] = /^(\w[b\#]?)(\d)$/.exec(noteAndOctave);
    requestedOctave = parseInt(requestedOctave, 10);
    requestedNote = flatToSharp(requestedNote);
    let sampleBank = SAMPLE_LIBRARY[instrument];
    let sample = getNearestSample(sampleBank, requestedNote, requestedOctave);
    let distance =
      getNoteDistance(requestedNote, requestedOctave, sample.note, sample.octave);
    return fetchSample(sample.file).then(audioBuffer => ({
      audioBuffer: audioBuffer,
      distance: distance
    }));
}



function noteValue(note, octave) {
    return octave * 12 + OCTAVE.indexOf(note);
}

function getNoteDistance(note1, octave1, note2, octave2) {
    return noteValue(note1, octave1) - noteValue(note2, octave2);
  }

function getNearestSample(sampleBank, note, octave) {
  let sortedBank = sampleBank.slice().sort((sampleA, sampleB) => {
    let distanceToA =
      Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
    let distanceToB =
      Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
    return distanceToA - distanceToB;
  });
  return sortedBank[0];
}

function fetchSample(path) {
    return fetch(encodeURIComponent(path))
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}



function playSample(instrument, note) {
    getSample(instrument, note).then(({audioBuffer, distance}) => {
        let playbackRate = Math.pow(2, distance / 12);
        let bufferSource = audioContext.createBufferSource();
        bufferSource.buffer = audioBuffer;
        bufferSource.playbackRate.value = playbackRate;
        bufferSource.connect(audioContext.destination);
        bufferSource.start();
      });
}

setTimeout(() => playSample('viola', 'F4'),  1000);
setTimeout(() => playSample('viola', 'Ab4'), 2000);
setTimeout(() => playSample('viola', 'C5'),  3000);
setTimeout(() => playSample('viola', 'Db5'), 4000);
setTimeout(() => playSample('viola', 'Eb5'), 5000);
setTimeout(() => playSample('viola', 'F5'),  6000);
setTimeout(() => playSample('viola', 'Ab5'), 7000);