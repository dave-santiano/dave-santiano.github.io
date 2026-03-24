/**
 * time-palette.js — shared highlight animation + dark mode for davidsantiano.com
 * Provides: time-based palette, rainbow-punct, dark/wave variants, nav palette buttons.
 * All state is persisted via localStorage keys: siteTheme, siteVariant, siteHlOpacity.
 */

// Signal to script.js that it should NOT auto-start its own rainbow animation.
window.__timePaletteActive = true;

(function () {
    'use strict';

    /* ── Constants ── */
    const VARIANTS = [
        'v-none', 'v-dark-static', 'v-gray-static', 'v-dark-anim', 'v-gray-anim',
        'v-rainbow-punct', 'v-time-kelvin', 'v-time-kelvin-anim',
        'v-time-palette', 'v-time-palette-anim'
    ];
    const TIME_VARIANTS    = new Set(['v-time-kelvin', 'v-time-kelvin-anim', 'v-time-palette', 'v-time-palette-anim']);
    const RAINBOW_VARIANTS = new Set(['v-rainbow-punct']);
    const NAV_BTN_MAP = {
        rainbow: { variants: RAINBOW_VARIANTS,  default: 'v-rainbow-punct'    },
        time:    { variants: TIME_VARIANTS,      default: 'v-time-palette-anim' }
    };
    const ANIM_RANGES = {
        light: { 'v-dark-anim': { min: 8,  max: 28 }, 'v-gray-anim': { min: 38, max: 64 } },
        dark:  { 'v-dark-anim': { min: 72, max: 92 }, 'v-gray-anim': { min: 48, max: 68 } }
    };
    const FREQ = 0.6, PHASE_STEP = 0.55, GRADIENT_HUE_PER_SEC = 22;

    /* ── State ── */
    let current    = null;
    let isDarkMode = true;
    let hlOpacity  = 0.5;
    let animFrame  = null, t0         = null;
    let punctFrame = null, punctT0    = null;
    let timeFrame  = null, timeT0     = null;

    /* ── Helpers ── */
    const lerp      = (a, b, t) => a + (b - a) * t;
    const isVisible = el => el.offsetParent !== null;

    function getUnifiedGradientElements() {
        const nav        = Array.from(document.querySelectorAll('nav .rainbow_element')).filter(isVisible);
        const introPunct = Array.from(document.querySelectorAll('.hp-intro-punct')).filter(isVisible);
        const bodyBlocks = Array.from(document.querySelectorAll('article.content .rainbow_element'))
                           .filter(el => !el.closest('.hp-intro') && isVisible(el));
        const projects   = Array.from(document.querySelectorAll('.flex-container .rainbow_element')).filter(isVisible);
        return nav.concat(introPunct, bodyBlocks, projects);
    }

    function clearRainbowInlineStyles() {
        document.querySelectorAll('.rainbow_element').forEach(el => {
            el.style.removeProperty('background-color');
            el.style.removeProperty('color');
        });
        document.querySelectorAll('.hp-intro-punct').forEach(el => {
            el.style.removeProperty('color');
        });
    }

    /* ── Dark mode ── */
    function setDarkMode(on) {
        isDarkMode = on;
        document.body.classList.toggle('dark-mode', on);
        ['btn-dark-mode', 'nav-btn-darkmode'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = on ? '☾ · ·' : '☀ · ·';
        });
        try { localStorage.setItem('siteTheme', on ? 'dark' : 'light'); } catch (e) {}
    }

    function toggleDarkMode() { setDarkMode(!isDarkMode); }

    /* ── Nav palette button sync ── */
    function updateTimeIndicator() {
        const ind  = document.getElementById('nav-time-indicator');
        const hhmm = document.getElementById('nav-time-hhmm');
        if (!ind || !hhmm) return;
        const show = TIME_VARIANTS.has(current);
        ind.style.display = show ? 'inline' : 'none';
        if (show) {
            const d = new Date();
            const h = d.getHours() + d.getMinutes() / 60;
            const hh = String(Math.floor(h) % 24).padStart(2, '0');
            const mm = String(Math.round((h % 1) * 60) % 60).padStart(2, '0');
            hhmm.textContent = `${hh}:${mm}`;
        }
    }

    function syncNavPalBtns() {
        const map = {
            'nav-btn-off':     current === 'v-none',
            'nav-btn-rainbow': RAINBOW_VARIANTS.has(current),
            'nav-btn-time':    TIME_VARIANTS.has(current)
        };
        Object.entries(map).forEach(([id, active]) => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('active', active);
        });
        updateTimeIndicator();
    }

    function navPalBtn(group) {
        const map = NAV_BTN_MAP[group];
        setVariant(map.variants.has(current) ? 'v-dark-static' : map.default);
    }

    /* ── Variant management ── */
    function setVariant(v) {
        if (v === current) return;
        current = v;
        document.body.classList.remove(...VARIANTS);
        document.body.classList.add(v);
        VARIANTS.forEach(name => {
            const btn = document.getElementById('btn-' + name);
            if (btn) btn.classList.toggle('active', name === v);
        });
        syncNavPalBtns();

        if (animFrame)  { cancelAnimationFrame(animFrame);  animFrame  = null; }
        if (punctFrame) { cancelAnimationFrame(punctFrame); punctFrame = null; }
        if (timeFrame)  { cancelAnimationFrame(timeFrame);  timeFrame  = null; }
        punctT0 = null; timeT0 = null;
        clearRainbowInlineStyles();

        if      (v === 'v-rainbow-punct')            { punctFrame = requestAnimationFrame(unifiedRainbowPunctTick); }
        else if (v === 'v-dark-anim' || v === 'v-gray-anim') { t0 = null; animFrame = requestAnimationFrame(tick); }
        else if (TIME_VARIANTS.has(v))               { timeT0 = null; timeFrame = requestAnimationFrame(timeTick); }

        try { localStorage.setItem('siteVariant', v); } catch (e) {}
    }

    /* ── Animations: rainbow-punct ── */
    function applyUnifiedHue(el, hue) {
        if (el.classList.contains('hp-intro-punct')) {
            el.style.setProperty('color', `hsl(${hue.toFixed(0)}, 80%, 46%)`, 'important');
        } else {
            el.style.setProperty('background-color', `hsla(${hue.toFixed(0)}, 80%, 85%, ${hlOpacity})`, 'important');
            el.style.setProperty('color', '#111', 'important');
        }
    }

    function unifiedRainbowPunctTick(timestamp) {
        if (current !== 'v-rainbow-punct') return;
        const items = getUnifiedGradientElements();
        const n = items.length;
        if (!n) { punctFrame = requestAnimationFrame(unifiedRainbowPunctTick); return; }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            items.forEach((el, i) => applyUnifiedHue(el, (i * 360 / n) % 360));
            return;
        }
        if (!punctT0) punctT0 = timestamp;
        const base = ((timestamp - punctT0) / 1000 * GRADIENT_HUE_PER_SEC) % 360;
        items.forEach((el, i) => applyUnifiedHue(el, (base + i * 360 / n) % 360));
        punctFrame = requestAnimationFrame(unifiedRainbowPunctTick);
    }

    /* ── Animations: dark/gray wave ── */
    function tick(timestamp) {
        if (!t0) t0 = timestamp;
        const t     = (timestamp - t0) / 1000;
        const range = ANIM_RANGES[isDarkMode ? 'dark' : 'light'][current];
        if (!range) { animFrame = requestAnimationFrame(tick); return; }
        const amp = (range.max - range.min) / 2;
        const mid = range.min + amp;
        Array.from(document.querySelectorAll('.rainbow_element')).filter(isVisible).forEach((el, i) => {
            const lum = (mid + amp * Math.sin(2 * Math.PI * FREQ * t + i * PHASE_STEP)).toFixed(1);
            el.style.backgroundColor = `hsla(0, 0%, ${lum}%, ${hlOpacity})`;
        });
        animFrame = requestAnimationFrame(tick);
    }

    /* ── Animations: time-based palettes ── */
    function getSolarWarmth() {
        const d = new Date();
        const h = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
        return (1 - Math.cos(Math.PI * h / 12)) / 2;
    }

    function timeTick(timestamp) {
        if (!TIME_VARIANTS.has(current)) return;
        if (!timeT0) timeT0 = timestamp;
        const t = (timestamp - timeT0) / 1000;

        updateTimeIndicator();

        const warmth   = getSolarWarmth();
        const isAnim   = current === 'v-time-kelvin-anim' || current === 'v-time-palette-anim';
        const isKelvin = current === 'v-time-kelvin'      || current === 'v-time-kelvin-anim';
        const items    = getUnifiedGradientElements();
        const n        = items.length;
        if (!n) { timeFrame = requestAnimationFrame(timeTick); return; }

        const sat   = Math.max(0,  Math.min(100, lerp(22, 78, warmth)));
        const light = Math.max(12, Math.min(95, isDarkMode ? lerp(20, 52, warmth) : lerp(32, 87, warmth)));
        const drift = isAnim ? t * 10 : 0;

        items.forEach((el, i) => {
            const pos = n > 1 ? i / (n - 1) : 0.5;
            let hue;
            if (isKelvin) {
                const center = (230 + warmth * 165) % 360;
                hue = (center + (pos - 0.5) * (isAnim ? 80 : 28) + drift + 360) % 360;
            } else {
                const COOL = [215, 232, 248, 262, 278], WARM = [5, 18, 33, 45, 55];
                const speed  = isAnim ? 0.09 : 0.015;
                const dpos   = ((pos + t * speed) % 1 + 1) % 1;
                const fIdx   = dpos * COOL.length;
                const lo = Math.floor(fIdx) % COOL.length, hi = (lo + 1) % COOL.length;
                const fr = fIdx - Math.floor(fIdx);
                hue = (lerp(lerp(COOL[lo], COOL[hi], fr), lerp(WARM[lo], WARM[hi], fr), warmth) + drift) % 360;
            }
            if (el.classList.contains('hp-intro-punct')) {
                // Dark mode: keep text bright enough to read on dark bg; light mode: moderate shade on light bg
                const punctLight = isDarkMode
                    ? Math.max(58, Math.min(88, light + 22))
                    : Math.max(28, Math.min(58, light - 18));
                el.style.setProperty('color', `hsl(${hue.toFixed(0)}, ${sat.toFixed(0)}%, ${punctLight.toFixed(0)}%)`, 'important');
            } else {
                el.style.setProperty('background-color', `hsla(${hue.toFixed(0)}, ${sat.toFixed(0)}%, ${light.toFixed(0)}%, ${hlOpacity})`, 'important');
                el.style.setProperty('color', light < 55 ? '#ddd' : isDarkMode ? '#ddd' : '#111', 'important');
            }
        });
        timeFrame = requestAnimationFrame(timeTick);
    }

    /* ── Init ── */
    window.addEventListener('DOMContentLoaded', function () {
        /* Dark mode — first visit: follow time of day; returning: restore saved preference */
        let dark;
        try {
            const s = localStorage.getItem('siteTheme');
            if (s !== null) {
                dark = s === 'dark';
            } else {
                const h = new Date().getHours();
                dark = h < 7 || h >= 19; // dark 7pm–7am, light 7am–7pm
            }
        } catch (e) { dark = true; }
        setDarkMode(dark);

        /* Opacity */
        try {
            const s = localStorage.getItem('siteHlOpacity');
            hlOpacity = s !== null ? parseInt(s, 10) / 100 : 0.5;
        } catch (e) { hlOpacity = 0.5; }
        document.body.style.setProperty('--hl-opacity', hlOpacity);

        /* Variant */
        let variant = 'v-time-palette-anim';
        try {
            const s = localStorage.getItem('siteVariant');
            if (s && VARIANTS.includes(s)) variant = s;
        } catch (e) {}
        setVariant(variant);

        /* Wire nav buttons */
        const btns = {
            'nav-btn-off':      () => setVariant('v-none'),
            'nav-btn-rainbow':  () => navPalBtn('rainbow'),
            'nav-btn-time':     () => navPalBtn('time'),
            'nav-btn-darkmode': () => toggleDarkMode()
        };
        Object.entries(btns).forEach(([id, fn]) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', fn);
        });
    });

    /* Globals for any inline onclick handlers */
    window.setVariant      = setVariant;
    window.navPalBtn       = navPalBtn;
    window.toggleDarkMode  = toggleDarkMode;

    /* After full page load, clear any stale inline styles from the body onload
       setRainbowElementColors() call that fires before our DOMContentLoaded handler. */
    window.addEventListener('load', function () {
        clearRainbowInlineStyles();
        if (current) {
            const v = current;
            current = null; // force restart
            setVariant(v);
        }
    });

})();
