(function () {
    "use strict";

    const root = document.documentElement;
    const body = document.body;
    const accessibilityToggle = document.getElementById("accessibility-toggle");
    const accessibilityPanel = document.getElementById("accessibility-panel");
    const increaseTextButton = document.getElementById("increase-text");
    const decreaseTextButton = document.getElementById("decrease-text");
    const contrastToggle = document.getElementById("contrast-toggle");
    const motionToggle = document.getElementById("motion-toggle");
    const expandButton = document.getElementById("expand-chat");
    const chatCard = document.querySelector(".chat-card");
    const chatFrame = document.getElementById("medication-chat");
    const loadingPanel = document.getElementById("loading-panel");
    const restartButton = document.getElementById("restart-chat");
    const offlineBanner = document.getElementById("offline-banner");
    const toast = document.getElementById("toast");
    const storageKey = "preop-review-preferences";
    const textSizes = [16, 18, 20];
    let textSizeIndex = 0;
    let toastTimer;

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("is-visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => {
            toast.classList.remove("is-visible");
        }, 2600);
    }

    function getPreferences() {
        try {
            return JSON.parse(window.localStorage.getItem(storageKey)) || {};
        } catch (_error) {
            return {};
        }
    }

    function savePreferences() {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify({
                textSizeIndex,
                highContrast: body.classList.contains("high-contrast"),
                reduceMotion: body.classList.contains("reduce-motion")
            }));
        } catch (_error) {
            // The page remains fully usable when storage is unavailable.
        }
    }

    function applyTextSize(announce) {
        root.style.setProperty("--base-font-size", `${textSizes[textSizeIndex]}px`);
        decreaseTextButton.disabled = textSizeIndex === 0;
        increaseTextButton.disabled = textSizeIndex === textSizes.length - 1;
        if (announce) {
            showToast(`Text size set to ${textSizes[textSizeIndex]} pixels.`);
        }
        savePreferences();
    }

    function setPressed(button, isPressed) {
        button.setAttribute("aria-pressed", String(isPressed));
    }

    function applySavedPreferences() {
        const preferences = getPreferences();
        textSizeIndex = Math.min(
            textSizes.length - 1,
            Math.max(0, Number(preferences.textSizeIndex) || 0)
        );
        body.classList.toggle("high-contrast", Boolean(preferences.highContrast));
        body.classList.toggle("reduce-motion", Boolean(preferences.reduceMotion));
        setPressed(contrastToggle, body.classList.contains("high-contrast"));
        setPressed(motionToggle, body.classList.contains("reduce-motion"));
        applyTextSize(false);
    }

    function setAccessibilityPanel(isOpen) {
        accessibilityPanel.hidden = !isOpen;
        accessibilityToggle.setAttribute("aria-expanded", String(isOpen));
        if (isOpen) {
            decreaseTextButton.focus();
        }
    }

    accessibilityToggle.addEventListener("click", () => {
        setAccessibilityPanel(accessibilityPanel.hidden);
    });

    document.addEventListener("click", (event) => {
        if (
            !accessibilityPanel.hidden &&
            !accessibilityPanel.contains(event.target) &&
            !accessibilityToggle.contains(event.target)
        ) {
            setAccessibilityPanel(false);
        }
    });

    increaseTextButton.addEventListener("click", () => {
        if (textSizeIndex < textSizes.length - 1) {
            textSizeIndex += 1;
            applyTextSize(true);
        }
    });

    decreaseTextButton.addEventListener("click", () => {
        if (textSizeIndex > 0) {
            textSizeIndex -= 1;
            applyTextSize(true);
        }
    });

    contrastToggle.addEventListener("click", () => {
        const isActive = body.classList.toggle("high-contrast");
        setPressed(contrastToggle, isActive);
        savePreferences();
        showToast(isActive ? "High contrast turned on." : "High contrast turned off.");
    });

    motionToggle.addEventListener("click", () => {
        const isActive = body.classList.toggle("reduce-motion");
        setPressed(motionToggle, isActive);
        savePreferences();
        showToast(isActive ? "Reduced motion turned on." : "Reduced motion turned off.");
    });

    function setExpanded(isExpanded) {
        chatCard.classList.toggle("is-expanded", isExpanded);
        body.classList.toggle("chat-expanded", isExpanded);
        expandButton.setAttribute("aria-pressed", String(isExpanded));
        expandButton.querySelector("span").textContent = isExpanded ? "Close" : "Expand";
        if (isExpanded) {
            expandButton.focus();
        }
    }

    expandButton.addEventListener("click", () => {
        setExpanded(!chatCard.classList.contains("is-expanded"));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (chatCard.classList.contains("is-expanded")) {
                setExpanded(false);
                expandButton.focus();
            } else if (!accessibilityPanel.hidden) {
                setAccessibilityPanel(false);
                accessibilityToggle.focus();
            }
        }
    });

    chatFrame.addEventListener("load", () => {
        window.setTimeout(() => {
            loadingPanel.classList.add("is-hidden");
        }, 450);
    });

    restartButton.addEventListener("click", () => {
        loadingPanel.classList.remove("is-hidden");
        chatFrame.src = chatFrame.src;
        showToast("Medication assistant is reloading.");
    });

    function updateOnlineStatus() {
        const isOffline = !navigator.onLine;
        offlineBanner.hidden = !isOffline;
        if (!isOffline && document.hasFocus()) {
            showToast("You are back online.");
        }
    }

    window.addEventListener("offline", updateOnlineStatus);
    window.addEventListener("online", updateOnlineStatus);

    applySavedPreferences();
    offlineBanner.hidden = navigator.onLine;
}());
