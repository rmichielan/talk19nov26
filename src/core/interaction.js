// Presenter controls. No assumptions about any particular slide or scientific model.
  window.addEventListener("resize", () => controllerFor(slide)?.resize?.());
  $("#help").addEventListener("click", () => $("#helpbox").classList.toggle("visible"));
  $("#pause").addEventListener("click", () => {
    paused = !paused;
    $("#pause").textContent = paused ? "PLAY" : "PAUSE";
    $("#slide").dataset.paused = paused ? "true" : "false";
    controllerFor(slide)?.pauseChanged?.(paused || document.hidden);
    TalkFeatures.pauseVisuals?.(paused || document.hidden);
    TalkFeatures.syncCoverAnimation?.();
    TalkFeatures.timeline?.();
  });

  window.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();
    if (key === "escape") {
      TalkFeatures.closeSettings?.();
      $("#helpbox").classList.remove("visible");
      return;
    }
    // The Y shortcut also closes the panel while a slider is focused.
    // Do not steal ordinary text input keystrokes from future form fields.
    const textEditing=event.target?.tagName==='TEXTAREA' ||
      (event.target?.tagName==='INPUT' && ['text','search','email','password','url'].includes(event.target.type));
    if (key === "y" && !textEditing) {
      event.preventDefault();
      TalkFeatures.toggleSettings?.();
      return;
    }
    // Keep arrow keys native on range sliders, but let R/T work even while a slider is focused.
    if (event.target?.tagName === 'INPUT' && event.target.type === 'range') {
      if (key === 'r') { event.preventDefault(); TalkFeatures.reroll?.(event.shiftKey); }
      else if (key === 't') { event.preventDefault(); trigger(); }
      return;
    }
    if (event.target && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (TalkFeatures.settingsOpen?.()) return;

    if (key === "arrowdown") {
      event.preventDefault();
      const detail = AsideNav.forSlide(slide);
      if (detail) AsideNav.open(detail);
    } else if (key === "arrowup") {
      event.preventDefault(); AsideNav.close();
    } else if (key === "r") {
      event.preventDefault();
      TalkFeatures.reroll?.(event.shiftKey);
    } else if (key === "t") {
      event.preventDefault();
      trigger();
    } else if (key === "arrowright" || key === " " || key === "enter") {
      event.preventDefault();
      next();
    } else if (key === "arrowleft") {
      event.preventDefault();
      prev();
    } else if (key === "pagedown") {
      event.preventDefault();
      go(slide + 1);
    } else if (key === "pageup") {
      event.preventDefault();
      go(slide - 1);
    } else if (key === "p") {
      $("#pause").click();
    } else if (key === "f") {
      event.preventDefault();
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen?.();
    } else if (key === "h" || key === "?") {
      $("#help").click();
    }
  });

  document.addEventListener("visibilitychange", () => {
    controllerFor(slide)?.pauseChanged?.(paused || document.hidden);
    TalkFeatures.pauseVisuals?.(paused || document.hidden);
    TalkFeatures.syncCoverAnimation?.();
    TalkFeatures.timeline?.();
  });
