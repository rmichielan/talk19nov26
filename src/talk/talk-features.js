const DetailRenderers={};
const TalkFeatures={
 stopAnimations(){},syncCoverAnimation(){},timeline(){},
 init(){DeckScenes.init();},pauseVisuals(paused){DeckScenes.pause(paused);},
 closeSettings(){},toggleSettings(){},settingsOpen(){return false;},
 copyStateToURL(){},reroll(){const page=Number(document.getElementById('slide').dataset.page);if(page>=11) VDScenes.reroll(page); else DeckScenes.reroll(page);}
};
