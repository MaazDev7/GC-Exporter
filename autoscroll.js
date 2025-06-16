function autoScrollDiv() {
  const targetDiv = document.querySelector(".My2mLb");

  if (!targetDiv) {
    console.error("Target div not found.");
    return;
  }

  const scrollStep = 100;
  const scrollInterval = 30;

  const intervalId = setInterval(() => {
    targetDiv.scrollBy(0, scrollStep);
    console.log("Auto-scrolling...");
  }, scrollInterval);
}

autoScrollDiv();
