var $ = require('jquery');

var defaults = {
    classname: "js-validate",
    debug: false
};

function Validate(options) {
    if (typeof options !== "object") {
        console.warn('Validator: options not defined');
        return false;
    }

    options.classname = options.classname || defaults.classname;
    options.success = options.success || null;
    options.error = options.error || null;
    options.complete = options.complete || null;
    options.debug = options.debug || defaults.debug;

    this.options = options;
    this.errors = 0;
    this.index = 0;
    this.resultTable = [];

    // cache the selector
    this.$classname = $("." + options.classname);

    var self = this;

    this.$classname.each(function(i) {
        self.$elem = $(this);

        var tagname = $(this)[0].tagName.toLowerCase();

        self.index += 1; // this will match .length in the end

        if (tagname === "input") {
            self.handleInput($(this));
        } else {
            self.handleTheRest($(this), false);
        }

    });
}

Validate.prototype.handleInput = function($input) {

    if ($input[0].type !== "text") {
        this.handleTheRest($input, true);
    } else {
        var valType = $input.attr('data-validate-type');
        var valVal = $input.val();
        var valResult = this.validateText(valType, valVal);
        this.handleResult($input, valResult);
    }

};

Validate.prototype.handleTheRest = function($elem, fromInput) {
    var isValid = false;
    var tag, dataAttr, nameGroup;

    if (fromInput) {
        tag = $elem[0].type;
    } else {
        tag = $elem[0].tagName.toLowerCase();
    }

    switch (tag) {
        case "select":
            var $currentOption = $elem.find(":selected");
            dataAttr = $currentOption[0].getAttribute('data-validate-type');
            isValid = (dataAttr === null) ? true : false;
            break;
        case "checkbox":
            nameGroup = $elem.attr('name');
            var $checked = $("input[name='" + nameGroup + "']:checked");
            dataAttr = $elem[0].getAttribute('data-validate-checkbox');

            if (dataAttr !== null) {
                var total = parseFloat(dataAttr.replace(/[min|max]/g, ''));
                var quantifier = dataAttr.replace(/[0-9]/g, '');

                if (quantifier === "max") {
                    isValid = ($checked.length > 0 && $checked.length <= total) ? true : false;
                } else if (quantifier === "min") {
                    isValid = ($checked.length >= total) ? true : false;
                } else {
                    isValid = ($checked.length === total) ? true : false;
                }

            } else {
                isValid = $elem.is(':checked');
            }

            break;
        case "radio":
            nameGroup = $elem.attr('name');
            isValid = ($("input[name='" + nameGroup + "']").is(":checked")) ? true : false;
            break;
        case "textarea":
            isValid = (!$.trim($elem.val())) ? false : true;
            break;
        default:
            console.warn('Validator: ' + tag + ' element is not supported');
            break;
    }

    if (!isValid) {
        this.errors += 1;
    }

    this.handleResult($elem, isValid);
};

Validate.prototype.validateText = function(type, val) {
    var _type = type || false;
    var _val = val || "";
    var validate_result = false; // true is good, means it passed

    if (!_type) {
        console.warn('Validator.validateText: type is undefined');
        return false;
    }

    if (_val === "") {
        // for blank entries we skip the switch and just set it to false
        validate_result = false;
    } else {

        switch (_type) {
            case "name":
                validate_result = /[a-zA-Z\d''-'\s]+/.test(_val);
                break;
            case "phone":
                validate_result = /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/.test(_val);
                break;
            case "email":
                validate_result = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(_val);
                break;
            case "zip":
                validate_result = /^\d{5}$/.test(_val);
                break;
            case "zip4":
                // source: https://www.owasp.org/index.php/Input_Validation_Cheat_Sheet#White_List_Regular_Expression_Examples
                validate_result = /^\d{5}(-\d{4})?$/.test(_val);
                break;
            case "num":
                validate_result = /^\d+$/.test(_val);
                break;
            case "state":
                // source: https://www.owasp.org/index.php/Input_Validation_Cheat_Sheet#White_List_Regular_Expression_Examples
                validate_result = /^(AA|AE|AP|AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY)$/.test(val);
                break;
            default:
                console.warn('Validator: the data-validate-type you are using is not supported');
                break;
        }

    }

    if (!validate_result) {
        this.errors += 1;
    }

    return validate_result;
};

Validate.prototype.handleResult = function($elem, result) {

    if (!result && typeof this.options.error === 'function') {
        this.options.error($elem);
    } else if (result && typeof this.options.success === 'function') {
        this.options.success($elem);
    } else {
        // do nothing for now
    }

    if (this.index === this.$classname.length && typeof this.options.complete === "function") {
        this.options.complete(this.errors);
    }

    // some debugging with nice formating in Chrome
    if (this.options.debug) {
        var currDebug = {
            tag: $elem[0].type || $elem[0].tagName,
            name: $elem.attr('name'),
            value: $elem.val(),
            pass: result
        };

        this.resultTable.push(currDebug);
        if (this.index === this.$classname.length) {
            console.table(this.resultTable);
            console.log(this.errors + " errors found");
        }
    }

};


module.exports = Validate;