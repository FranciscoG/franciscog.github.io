---
title: CSS-only logic gates 
date: 2026-02-03
syntax: false
tags:
  - CSS
---

Experimenting to see if I can implement simple [logic gates](https://en.wikipedia.org/wiki/Logic_gate) using pure CSS and HTML, no JavaScript.

<fieldset id="gate-AND">
<legend><b>AND</b></legend>

Only `true` when both `A` and `B` are on

<label for="gate-AND-A">A</label>
<label for="gate-AND-B">B</label>
<br />
<input type="checkbox" id="gate-AND-A" />
<input type="checkbox" id="gate-AND-B" />
<output role="status" for="gate-AND-A gate-AND-B"> A <b>AND</b> B = <span class="output-off">0</span><span class="output-on">1</span> </output>
</fieldset>

<fieldset id="gate-OR">
<legend><b>OR</b></legend>

`True` if either, or both, `A` and `B` are on.

<label for="gate-OR-A">A</label>
<label for="gate-OR-B">B</label>
<br />
<input type="checkbox" id="gate-OR-A" />
<input type="checkbox" id="gate-OR-B" />
<output role="status" for="gate-OR-A gate-OR-B"> A <b>OR</b> B = <span class="output-off">0</span><span class="output-on">1</span> </output>
</fieldset>

<fieldset id="gate-NAND">
<legend><b>NAND</b></legend>

Inverse of AND. `True` _unless_ both `A` and `B` are on, then it's `false`

<label for="gate-NAND-A">A</label>
<label for="gate-NAND-B">B</label>
<br />
<input type="checkbox" id="gate-NAND-A" />
<input type="checkbox" id="gate-NAND-B" />
<output role="status" for="gate-NAND-A gate-NAND-B"> A <b>NAND</b> B = <span class="output-off">0</span><span class="output-on">1</span> </output>
</fieldset>

<fieldset id="gate-NOR">
<legend><b>NOR</b></legend>

Inverse of OR. Only true when both `A` and `B` are off.

<label for="gate-NOR-A">A</label>
<label for="gate-NOR-B">B</label>
<br />
<input type="checkbox" id="gate-NOR-A" />
<input type="checkbox" id="gate-NOR-B" />
<output role="status" for="gate-NOR-A gate-NOR-B"> A <b>NOR</b> B = <span class="output-off">0</span><span class="output-on">1</span> </output>
</fieldset>

<fieldset id="gate-XOR">
<legend><b>XOR</b></legend>

Exclusive OR. Only `true` when either `A` or `B` are on, but not when both are on or off.

<label for="gate-XOR-A">A</label>
<label for="gate-XOR-B">B</label>
<br />
<input type="checkbox" id="gate-XOR-A" />
<input type="checkbox" id="gate-XOR-B" />
<output role="status" for="gate-XOR-A gate-XOR-B"> A <b>XOR</b> B = <span class="output-off">0</span><span class="output-on">1</span> </output>
</fieldset>

<fieldset id="gate-XNOR">
<legend><b>XNOR</b></legend>

Inverse of XOR. `True` when `A` and `B` are either both on or both off.

<label for="gate-XNOR-A">A</label>
<label for="gate-XNOR-B">B</label>
<br />
<input type="checkbox" id="gate-XNOR-A" />
<input type="checkbox" id="gate-XNOR-B" />
<output role="status" for="gate-XNOR-A gate-XNOR-B"> A <b>XNOR</b> B = <span class="output-off">0</span><span class="output-on">1</span> </output>
</fieldset>

Very simple to create using CSS that's been widely available for a long time now

- [`:checked`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:checked) pseudo-class
- [`:not()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:not) pseudo-class
- [next-sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Next-sibling_combinator) [`+`]
- [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/--*) for the background color

Now what can we do with this? I'm not sure. I think I'll try and create a simple calculator in a future post. Stayed tuned kiddos!

<style>
{% css %}
fieldset {
  --bg-color-off: #FFE3E3;
  --bg-color-on: #bfd;
  --logic-bg-color: var(--bg-color-off);
  margin-top: 2rem;
}

label {
 font-weight: bold;
 margin-left: 5px; 
}

.output-on {
  display: none;
}

output {
  background-color: var(--logic-bg-color);
  padding: 2px 5px;
  display: block;
  margin-top: 1rem;
  width: fit-content;
}

/* AND: both have to be checked */

#gate-AND-A:checked + #gate-AND-B:checked + output {
  --logic-bg-color: var(--bg-color-on);
}
#gate-AND-A:checked + #gate-AND-B:checked + output .output-off {
  display: none;
}
#gate-AND-A:checked + #gate-AND-B:checked + output .output-on {
   display: inline;
}

/* OR: anything has to be checked 
For this one we go backwards and default to an on state unless both are unchecked
*/

#gate-OR output {
  --logic-bg-color: var(--bg-color-on);
}
#gate-OR .output-off {
  display:none;
}
#gate-OR .output-on {
  display:inline;
}

#gate-OR-A:not(:checked) + #gate-OR-B:not(:checked) + output {
  --logic-bg-color: var(--bg-color-off);
}
#gate-OR-A:not(:checked) + #gate-OR-B:not(:checked) + output .output-off {
  display: inline;
}
#gate-OR-A:not(:checked) + #gate-OR-B:not(:checked)+ output .output-on {
   display: none;
}

/* NAND. The opposite of AND. 
If both are checked, then it's off, otherwise on.
We start off with a default state of on and only disable when both are checked
*/

#gate-NAND output {
  --logic-bg-color: var(--bg-color-on);
}
#gate-NAND .output-off {
  display:none;
}
#gate-NAND .output-on {
  display:inline;
}

#gate-NAND-A:checked + #gate-NAND-B:checked + output {
  --logic-bg-color: var(--bg-color-off);
}
#gate-NAND-A:checked + #gate-NAND-B:checked + output .output-off {
  display: inline;
}
#gate-NAND-A:checked + #gate-NAND-B:checked + output .output-on {
   display: none;
}

/* NOR. only on when both A and B are off 
So we default to the off state and only turn on when both are UNchecked */

#gate-NOR-A:not(:checked) + #gate-NOR-B:not(:checked) + output {
  --logic-bg-color: var(--bg-color-on);
  
}
#gate-NOR-A:not(:checked) + #gate-NOR-B:not(:checked) + output .output-off {
  display: none;
}
#gate-NOR-A:not(:checked) + #gate-NOR-B:not(:checked)+ output .output-on {
   display: inline;
}

/* XOR: only true when only one side is checked */

#gate-XOR-A:not(:checked) + #gate-XOR-B:checked + output,
#gate-XOR-A:checked + #gate-XOR-B:not(:checked) + output {
  --logic-bg-color: var(--bg-color-on);
}
#gate-XOR-A:not(:checked) + #gate-XOR-B:checked + output .output-off,
#gate-XOR-A:checked + #gate-XOR-B:not(:checked) + output .output-off {
  display: none;
}
#gate-XOR-A:not(:checked) + #gate-XOR-B:checked + output .output-on,
#gate-XOR-A:checked + #gate-XOR-B:not(:checked) + output .output-on {
  display: inline;
}

/* XNOR: only true when either both are checked or both are uncheced */

/* start with a default state of on */
#gate-XNOR output {
  --logic-bg-color: var(--bg-color-on);
}
#gate-XNOR .output-off {
  display:none;
}
#gate-XNOR .output-on {
  display:inline;
}

#gate-XNOR-A:not(:checked) + #gate-XNOR-B:checked + output,
#gate-XNOR-A:checked + #gate-XNOR-B:not(:checked) + output {
  --logic-bg-color: var(--bg-color-off);
}
#gate-XNOR-A:not(:checked) + #gate-XNOR-B:checked + output .output-off,
#gate-XNOR-A:checked + #gate-XNOR-B:not(:checked) + output .output-off {
  display: inline;
}
#gate-XNOR-A:not(:checked) + #gate-XNOR-B:checked + output .output-on,
#gate-XNOR-A:checked + #gate-XNOR-B:not(:checked) + output .output-on {
  display: none;
}

{% endcss %}
</style>