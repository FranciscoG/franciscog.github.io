
## Simple Javascript Form Validation

### requires jQuery

A simple library to run form field validation to check if user has correctly filled out a form.  

1. It <b>does not protect against XSS</b>, that should be handled on the server
2. It does not handle UI, you take care of that in the error/success options

Test it out here: <a href="http://jsfiddle.net/87rdD/10/">http://jsfiddle.net/87rdD/10/</a>

####in your JS:

```javascript
var Validate = require('../js/modules/validate/validate.js');

var validator = new Validate({
  classname: "js-validate",         // this is optional, it will default to "js-validate" if not set
  error: function($elem){},         // run this function on each error, handle your UI here.
  success: function($elem){},       // run this function on each success, handle your UI here
  complete: function(errors){},     // runs this function only once at the very end, errors parameter will be the number of errors
  debug: true or false              // adds more detailed info to console.log 
});
```

####in your HTML:

Adding the classname to an input, select, or textarea makes that field a required field and validates it.  Continue reading for more details on each supported type of form element.

#####Text inputs:
You must add a data attribute that specifies what type of validation to perform on this input
```html
<input type="text" class="js-validate" name="first_name" data-validate-type="name" />
```

here are the different text validation types
```
  data-validate-type="name"  
  data-validate-type="phone"  
  data-validate-type="email"  - matches typical emails allowed by the major providers  
  data-validate-type="zip"  
  data-validate-type="zip4"   - allows the optional 4 digits  
  data-validate-type="num"    - for fields that should only have numbers  
  data-validate-type="state"  - in case you decide to use a text input instead of a select for US states
```

#####Textareas

Adding the classname to a textarea only checks if it is empty or not. 

```html
<textarea class="js-validate"></textarea>
```

#####Selects
This one is slightly different. If you require that a user must select an option then you put the data attribute on the default option that shows on page load.  If they leave it on that option it will show an error.

data-validate-type="ignore"  
actually that text can be anything, the code just looks for the existence of the data attribute

```html
<select class="js-validate">
  <option value="none" selected="selected" data-validate-type="ignore">select</option>
  <option value="1">something<option>
  <option value="2">something<option>
</select>
```

#####Individual Checkbox
just add the classname and it will make that checkbox required  
tbd: multiple checkboxes with the same name
```html
<input type="checkbox" class="js-validate" name="consent" /> I agree
```

#####A Group of Checkboxes
You only need to add the classname to one of the checkbox elements in the same name attribute group  
default will be that it makes sure that at least one checkbox is selected.  If you want to make more than one checkbox required then you'll neeed to add a data attibute like in this example:  

```
data-validate-checkbox="max2"  - matches 1 or 2
data-validate-checkbox="min2"  - matches 2 or more
data-validate-checkbox="2"     - matches exactly 2
```

```html
<p> where did you hear about this program , please choose at least 2</p>
<input type="checkbox" class="js-validate" data-validate-checkbox="max2" name="survey" /> Online
<input type="checkbox" name="survey" /> TV
<input type="checkbox" name="survey" /> Radio
<input type="checkbox" name="survey" /> Friend
<input type="checkbox" name="survey" /> Other
```

#####Radios
You only need to add the classname one radio in the same name attribute group. It will require that one of the radios is selected

```html
<input type="radio" class="js-validate" name="options" /> Red
<input type="radio" name="options" /> Blue
<input type="radio" name="options" /> Green
```

