var whichVersion = "ga.js";
var $ = require('jquery');

var sendData = function(dataArray) {
    //console.log(dataArray);

    if (whichVersion === "ga.js") {
        var oldGAarray = ['_trackEvent'];
        // the old GA.js way
        // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
        // _gaq.push(['_trackEvent', 'category', 'action', 'label', value, non-interaction ]);
        oldGAarray.push(dataArray);
        _gaq.push(oldGAarray);

    } else {
        // The new analytics JS way
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
        // ga('send', 'event', 'category', 'action', value, {'nonInteraction': 1});
        ga('send', {
            'hitType': 'event',
            'eventCategory': dataArray[0],
            'eventAction': dataArray[1],
            'eventLabel': dataArray[2],
            'eventValue': dataArray[3],
            'nonInteraction': dataArray[4]
        });
    }
};

var checkDatas = function(e) {
    var link = $(e.currentTarget);
    var eventArray = [];

    var ga_cat = link.attr('data-ga-category') || false;
    var ga_action = link.attr('data-ga-action') || false;

    var ga_label = link.attr('data-ga-label') || null;
    var ga_value = link.attr('data-ga-value') || null;
    var ga_non = link.attr('data-ga-non-interaction') || null;

    if (!ga_cat || !ga_action) {
        console.warn('GA event tags require BOTH a category and an action');
        return false;
    } else {
        eventArray.push(ga_cat, ga_action, ga_label, parseFloat(ga_value) || null);
    }

    if (ga_non !== null && ga_non === "true") {
        eventArray.push(true);
    } else {
        eventArray.push(false);
    }

    sendData(eventArray);

};

var addOldGAlibrary = function(UA) {
    // usign the older ga tracking library: https://developers.google.com/analytics/devguides/collection/gajs/

    window._gaq = window._gaq || [];
    _gaq.push(['_setAccount', UA]);
    _gaq.push(['_trackPageview']);

    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[1];
    s.parentNode.insertBefore(ga, s);

};

var addNewGALibrary = function(UA) {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/

    (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments);
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
        m = s.getElementsByTagName(o)[1];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', UA, 'auto');
    ga('send', 'pageview');

};


/**
 * @param  {string}  UA         the UA account number
 * @param  {string}  version    "ga.js" or "analytics.js" , optional, which version of the analytics library to use.  defaults to "ga.js"
 * @param  {Boolean} hasDynamic true if there are dynamically generated links in the site
 */
module.exports = function(UA, version, hasDynamic) {
    var _UA = UA || false;
    whichVersion = version || "ga.js";
    var _d = hasDynamic || false;

    if (!_UA) {
        console.warn("GA_event: missing UA account ID");
        return false;
    }

    if (whichVersion === "ga.js") {
        addOldGAlibrary(_UA);
    } else {
        addNewGALibrary(_UA);
    }


    if (_d) {
        // since we add the click event on page load any links that are dynamically added after page load won't get the click event attached
        // so we use this method instead.  But we only want to use this if we NEED to, because it adds a click event to the entire <body> and
        // then every time you click on anything is traverses down the DOM to check if that element has the ga_event class which is a lot of work
        $('body').on('click', '.ga_event', function(e) {
            checkDatas(e);
        });
    } else {
        $('.ga_event').on('click', function(e) {
            checkDatas(e);
        });
    }
};