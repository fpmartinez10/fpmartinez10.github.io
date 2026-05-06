/* script.js — minimal JS for fpmartinez10.github.io */

/* Shared app metadata for global catalog surfaces */
var FOCAL_STUDIO_APPS = [
  {
    id: 'app-wildfocus',
    name: 'WildFocus',
    status: 'released',
    href: 'apps.html#app-wildfocus',
    icon: 'assets/app-icons/wildfocus.svg'
  },
  {
    id: 'app-trailnote',
    name: 'TrailNote',
    status: 'released',
    href: 'apps.html#app-trailnote',
    icon: 'assets/app-icons/trailnote.svg'
  },
  {
    id: 'app-quietlist',
    name: 'QuietList',
    status: 'released',
    href: 'apps.html#app-quietlist',
    icon: 'assets/app-icons/quietlist.svg'
  },
  {
    id: 'app-studysprint',
    name: 'StudySprint',
    status: 'in-development',
    href: 'apps.html#app-studysprint',
    icon: 'assets/app-icons/studysprint.svg'
  },
  {
    id: 'app-pantrymap',
    name: 'PantryMap',
    status: 'in-development',
    href: 'apps.html#app-pantrymap',
    icon: 'assets/app-icons/pantrymap.svg'
  },
  {
    id: 'app-daypebble',
    name: 'DayPebble',
    status: 'coming-soon',
    href: 'apps.html#app-daypebble',
    icon: 'assets/app-icons/daypebble.svg'
  },
  {
    id: 'app-hushtimer',
    name: 'HushTimer',
    status: 'coming-soon',
    href: 'apps.html#app-hushtimer',
    icon: 'assets/app-icons/hushtimer.svg'
  }
];

var FOCAL_STUDIO_APP_LANES = [
  {
    key: 'released',
    label: 'Released',
    title: 'Available now',
    emptyText: 'Released apps will appear here as the catalog grows.',
    duration: 24
  },
  {
    key: 'in-development',
    label: 'In Development',
    title: 'Building now',
    emptyText: 'Nothing is in active development right now.',
    duration: 18
  },
  {
    key: 'coming-soon',
    label: 'Coming Soon',
    title: 'Planned next',
    emptyText: 'New app ideas will show up here soon.',
    duration: 16
  }
];

/* Mobile navigation toggle */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  /* Close menu when a nav link is tapped on mobile */
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* Global app carousel strip */
(function () {
  var resizeTimer = null;

  function getAppsForLane(status) {
    return FOCAL_STUDIO_APPS.filter(function (app) {
      return app.status === status;
    });
  }

  function buildLaneItem(app) {
    return (
      '<a class="app-lane-link" href="' + app.href + '" aria-label="Open ' + app.name + ' in My Apps">' +
        '<img class="app-lane-icon" src="' + app.icon + '" alt="" width="56" height="56" />' +
        '<span class="app-lane-name">' + app.name + '</span>' +
      '</a>'
    );
  }

  function buildLaneMarkup(lane) {
    var apps = getAppsForLane(lane.key);
    var laneSlug = lane.key.replace(/[^a-z0-9]+/g, '-');
    var bodyMarkup = '';

    if (apps.length) {
      bodyMarkup =
        '<div class="app-lane-viewport" data-lane-viewport>' +
          '<div class="app-lane-track" data-lane-track style="--lane-duration: ' + lane.duration + 's">' +
            apps.map(buildLaneItem).join('') +
          '</div>' +
        '</div>';
    } else {
      bodyMarkup =
        '<p class="app-lane-empty">' + lane.emptyText + '</p>';
    }

    return (
      '<section class="app-lane app-lane--' + laneSlug + '" aria-labelledby="lane-' + laneSlug + '">' +
        '<div class="app-lane-head">' +
          '<p class="section-label">' + lane.label + '</p>' +
          '<h2 class="app-lane-title" id="lane-' + laneSlug + '">' + lane.title + '</h2>' +
        '</div>' +
        bodyMarkup +
      '</section>'
    );
  }

  function activateLaneTracks(host) {
    host.querySelectorAll('[data-lane-track]').forEach(function (track) {
      var viewport = track.parentElement;
      var originalItems = Array.prototype.slice.call(track.children);

      track.classList.remove('is-animated');
      track.classList.add('is-static');
      track.style.removeProperty('--lane-distance');

      if (originalItems.length < 2) {
        return;
      }

      while (track.scrollWidth <= viewport.clientWidth * 1.35 && track.children.length < originalItems.length * 4) {
        originalItems.forEach(function (item) {
          track.appendChild(item.cloneNode(true));
        });
      }

      if (track.scrollWidth > viewport.clientWidth + 24) {
        track.classList.remove('is-static');
        track.classList.add('is-animated');
        track.style.setProperty('--lane-distance', (track.scrollWidth - viewport.clientWidth) + 'px');
      }
    });
  }

  function renderAppCarousels() {
    var hosts = Array.prototype.slice.call(document.querySelectorAll('[data-app-carousel]'));

    if (!hosts.length) {
      return;
    }

    hosts.forEach(function (host) {
      host.innerHTML =
        '<div class="container">' +
          '<section class="app-strip" aria-label="Browse the full app catalog">' +
            '<div class="app-strip-header">' +
              '<div>' +
                '<p class="section-label">App Catalog</p>' +
                '<h2 class="app-strip-title">Explore everything in one glance</h2>' +
              '</div>' +
              '<p class="app-strip-copy">Released apps, active builds, and upcoming ideas all link back to their place in <a href="apps.html">My Apps</a>.</p>' +
            '</div>' +
            '<div class="app-strip-lanes">' +
              FOCAL_STUDIO_APP_LANES.map(buildLaneMarkup).join('') +
            '</div>' +
          '</section>' +
        '</div>';
    });

    var schedule = window.requestAnimationFrame || function (callback) {
      window.setTimeout(callback, 0);
    };

    schedule(function () {
      hosts.forEach(activateLaneTracks);
    });
  }

  renderAppCarousels();

  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(renderAppCarousels, 140);
  });
})();

/* Center linked app targets on the catalog page */
(function () {
  function isAppsPage() {
    return /\/apps\.html$/.test(window.location.pathname) || /\/$/.test(window.location.pathname) && /apps\.html/.test(window.location.href);
  }

  function scrollHashTargetToCenter() {
    var targetId;
    var target;

    if (!isAppsPage() || !window.location.hash) {
      return;
    }

    targetId = decodeURIComponent(window.location.hash.slice(1));
    target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    window.requestAnimationFrame(function () {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    });
  }

  if (!isAppsPage()) {
    return;
  }

  window.addEventListener('hashchange', scrollHashTargetToCenter);
  window.addEventListener('load', scrollHashTargetToCenter);
})();
