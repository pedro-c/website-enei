let express = require('express');
let router = express.Router();
let renderer = require('./../util/renderer');
let features = require('./../util/features');
let config = require('./../util/config');

/* GET home page. */
router.get('/', function(req, res, next) {
  // Redirect if speakers feature is disabled
  if(!features.speakers) {
    res.redirect('/notfound');
    return;
  }

  let hasShow = false;
  for(let i = 0; i < config.speakers.length; i++) {
    if(config.speakers[i].show) {
      hasShow = true;
    }
  }
  // Redirect if no visible speakers
  if(!hasShow) {
    res.redirect('/notfound');
    return;
  }

  renderer.render(res, 'speakers', {
    include_navbar: true
  });
});

router.get('/:id', function(req, res, next) {
  // Redirect if speakers feature is disabled
  if(!features.speakers) {
    res.redirect('/notfound');
    return;
  }

  let speaker = undefined;
  let speakerId = req.params.id;
  for(let i = 0; i < config.speakers.length; i++) {
    if(config.speakers[i].id == speakerId) {
      speaker = config.speakers[i];
      break;
    }
  }

  if(speaker === undefined || !speaker.show) {
    res.redirect('/notfound');
    return;
  }

  if(speaker.faqs.length === 0 && speaker.talkSummary === "" && speaker.talkTitle === "") {
    speaker.displayDetails = false;
  } else {
    speaker.displayDetails = true;
  }

  if(speaker.talkSummary === "" && speaker.talkTitle === "") {
    speaker.showTalk = false;
  } else {
    speaker.showTalk = true;
  }

  renderer.render(res, 'speaker', {
    include_navbar: true,
    speaker: speaker
  });
});

module.exports = router;
