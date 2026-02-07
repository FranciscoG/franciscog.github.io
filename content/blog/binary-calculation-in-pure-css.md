---
title: Binary calculation in pure CSS and HTML
date:
draft: true
syntax: true
tags:
  - post
---

<aside class="supports">
  
  <span class="aside-prefix">Warning:</span>

  Your browser doesn't support some of the CSS used on this page. Please update your browser or try it in the latest version of Chrome.

</aside>

More experiments in visualizing with checkboxes. 

This time I wanted to see if I could use the checkboxes to represent an 8-bit binary number and calculate the decimal number from which inputs were checked. Using pure HTML and CSS, no JavaScript. 

I'm going to do this in 2 ways. The easy way and the hard way.

## The easy way

Using CSS `content`, custom properties, and `calc()`.

The one drawback to using CSS `content` is that it is [not good for accessibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content#accessibility).

<fieldset class="binary-container" id="css-content">
<label>
  <span>128</span>
  <input type="checkbox" id="bit-8" value="128">
</label>
<label>
  <span>64</span>
  <input type="checkbox" id="bit-7" value="64">
</label>
<label>
  <span>32</span>
  <input type="checkbox" id="bit-6" value="32">
</label>
<label>
  <span>16</span>
  <input type="checkbox" id="bit-5" value="16">
</label>
<label>
  <span>8</span>
  <input type="checkbox" id="bit-4" value="8">
</label>
<label>
  <span>4</span>
  <input type="checkbox" id="bit-3" value="4">
</label>
<label>
  <span>2</span>
  <input type="checkbox" id="bit-2" value="2">
</label>
<label>
  <span>1</span>
  <input type="checkbox" id="bit-1" value="1">
</label>

<output role="status" aria-live="polite" for="bit-1 bit-2 bit-3 bit-4 bit-5 bit-6 bit-7 bit-8">
</output>
</fieldset>

Since this one is easy, I can show you the CSS:

```css
fieldset#css-content {
  --b1: 0;
  --b2: 0;
  --b3: 0;
  --b4: 0;
  --b5: 0;
  --b6: 0;
  --b7: 0;
  --b8: 0;

  &:has(#bit-1:checked) {--b1: 1; }
  &:has(#bit-2:checked) {--b2: 2; }
  &:has(#bit-3:checked) {--b3: 4; }
  &:has(#bit-4:checked) {--b4: 8; }
  &:has(#bit-5:checked) {--b5: 16; }
  &:has(#bit-6:checked) {--b6: 32; }
  &:has(#bit-7:checked) {--b7: 64; }
  &:has(#bit-8:checked) {--b8: 128; }

  & output::after {
    --result: calc(var(--b1) + var(--b2) + var(--b3) + var(--b4) + var(--b5) + var(--b6) + var(--b7) + var(--b8));
    counter-reset: result-counter var(--result);
    content: "Value: " counter(result-counter);
    display: inline-block;
  }
}
```

## The hard way

The only other way I could think of doing this is by having 256 `<span>` elements and using a ridiculous amount of CSS to hide/show the correct number based on what inputs were checked. 

And that's exactly what I did. I'm using a combination of `:has()` and `:not(:has())` to detect every possible combination of checked inputs. Basically the CSS equivalent of brute forcing the solution.

Disclaimer: I wrote the HTML and most of the CSS for this one, but there's no way I was writing all of the central CSS logic by hand. I asked AI to output that part specifically. It would have taken me forever to do it myself.

Here it is in action:

<fieldset class="binary-container" id="many-spans">
<label>
  <span>128</span>
  <input type="checkbox" id="bit-8" value="128">
</label>
<label>
  <span>64</span>
  <input type="checkbox" id="bit-7" value="64">
</label>
<label>
  <span>32</span>
  <input type="checkbox" id="bit-6" value="32">
</label>
<label>
  <span>16</span>
  <input type="checkbox" id="bit-5" value="16">
</label>
<label>
  <span>8</span>
  <input type="checkbox" id="bit-4" value="8">
</label>
<label>
  <span>4</span>
  <input type="checkbox" id="bit-3" value="4">
</label>
<label>
  <span>2</span>
  <input type="checkbox" id="bit-2" value="2">
</label>
<label>
  <span>1</span>
  <input type="checkbox" id="bit-1" value="1">
</label>

<output role="status" aria-live="polite" for="bit-1 bit-2 bit-3 bit-4 bit-5 bit-6 bit-7 bit-8">
  Value:&nbsp;
  <span>0</span>
  <span>1</span>
  <span>2</span>
  <span>3</span>
  <span>4</span>
  <span>5</span>
  <span>6</span>
  <span>7</span>
  <span>8</span>
  <span>9</span>
  <span>10</span>
  <span>11</span>
  <span>12</span>
  <span>13</span>
  <span>14</span>
  <span>15</span>
  <span>16</span>
  <span>17</span>
  <span>18</span>
  <span>19</span>
  <span>20</span>
  <span>21</span>
  <span>22</span>
  <span>23</span>
  <span>24</span>
  <span>25</span>
  <span>26</span>
  <span>27</span>
  <span>28</span>
  <span>29</span>
  <span>30</span>
  <span>31</span>
  <span>32</span>
  <span>33</span>
  <span>34</span>
  <span>35</span>
  <span>36</span>
  <span>37</span>
  <span>38</span>
  <span>39</span>
  <span>40</span>
  <span>41</span>
  <span>42</span>
  <span>43</span>
  <span>44</span>
  <span>45</span>
  <span>46</span>
  <span>47</span>
  <span>48</span>
  <span>49</span>
  <span>50</span>
  <span>51</span>
  <span>52</span>
  <span>53</span>
  <span>54</span>
  <span>55</span>
  <span>56</span>
  <span>57</span>
  <span>58</span>
  <span>59</span>
  <span>60</span>
  <span>61</span>
  <span>62</span>
  <span>63</span>
  <span>64</span>
  <span>65</span>
  <span>66</span>
  <span>67</span>
  <span>68</span>
  <span>69</span>
  <span>70</span>
  <span>71</span>
  <span>72</span>
  <span>73</span>
  <span>74</span>
  <span>75</span>
  <span>76</span>
  <span>77</span>
  <span>78</span>
  <span>79</span>
  <span>80</span>
  <span>81</span>
  <span>82</span>
  <span>83</span>
  <span>84</span>
  <span>85</span>
  <span>86</span>
  <span>87</span>
  <span>88</span>
  <span>89</span>
  <span>90</span>
  <span>91</span>
  <span>92</span>
  <span>93</span>
  <span>94</span>
  <span>95</span>
  <span>96</span>
  <span>97</span>
  <span>98</span>
  <span>99</span>
  <span>100</span>
  <span>101</span>
  <span>102</span>
  <span>103</span>
  <span>104</span>
  <span>105</span>
  <span>106</span>
  <span>107</span>
  <span>108</span>
  <span>109</span>
  <span>110</span>
  <span>111</span>
  <span>112</span>
  <span>113</span>
  <span>114</span>
  <span>115</span>
  <span>116</span>
  <span>117</span>
  <span>118</span>
  <span>119</span>
  <span>120</span>
  <span>121</span>
  <span>122</span>
  <span>123</span>
  <span>124</span>
  <span>125</span>
  <span>126</span>
  <span>127</span>
  <span>128</span>
  <span>129</span>
  <span>130</span>
  <span>131</span>
  <span>132</span>
  <span>133</span>
  <span>134</span>
  <span>135</span>
  <span>136</span>
  <span>137</span>
  <span>138</span>
  <span>139</span>
  <span>140</span>
  <span>141</span>
  <span>142</span>
  <span>143</span>
  <span>144</span>
  <span>145</span>
  <span>146</span>
  <span>147</span>
  <span>148</span>
  <span>149</span>
  <span>150</span>
  <span>151</span>
  <span>152</span>
  <span>153</span>
  <span>154</span>
  <span>155</span>
  <span>156</span>
  <span>157</span>
  <span>158</span>
  <span>159</span>
  <span>160</span>
  <span>161</span>
  <span>162</span>
  <span>163</span>
  <span>164</span>
  <span>165</span>
  <span>166</span>
  <span>167</span>
  <span>168</span>
  <span>169</span>
  <span>170</span>
  <span>171</span>
  <span>172</span>
  <span>173</span>
  <span>174</span>
  <span>175</span>
  <span>176</span>
  <span>177</span>
  <span>178</span>
  <span>179</span>
  <span>180</span>
  <span>181</span>
  <span>182</span>
  <span>183</span>
  <span>184</span>
  <span>185</span>
  <span>186</span>
  <span>187</span>
  <span>188</span>
  <span>189</span>
  <span>190</span>
  <span>191</span>
  <span>192</span>
  <span>193</span>
  <span>194</span>
  <span>195</span>
  <span>196</span>
  <span>197</span>
  <span>198</span>
  <span>199</span>
  <span>200</span>
  <span>201</span>
  <span>202</span>
  <span>203</span>
  <span>204</span>
  <span>205</span>
  <span>206</span>
  <span>207</span>
  <span>208</span>
  <span>209</span>
  <span>210</span>
  <span>211</span>
  <span>212</span>
  <span>213</span>
  <span>214</span>
  <span>215</span>
  <span>216</span>
  <span>217</span>
  <span>218</span>
  <span>219</span>
  <span>220</span>
  <span>221</span>
  <span>222</span>
  <span>223</span>
  <span>224</span>
  <span>225</span>
  <span>226</span>
  <span>227</span>
  <span>228</span>
  <span>229</span>
  <span>230</span>
  <span>231</span>
  <span>232</span>
  <span>233</span>
  <span>234</span>
  <span>235</span>
  <span>236</span>
  <span>237</span>
  <span>238</span>
  <span>239</span>
  <span>240</span>
  <span>241</span>
  <span>242</span>
  <span>243</span>
  <span>244</span>
  <span>245</span>
  <span>246</span>
  <span>247</span>
  <span>248</span>
  <span>249</span>
  <span>250</span>
  <span>251</span>
  <span>252</span>
  <span>253</span>
  <span>254</span>
  <span>255</span>
</output>
</fieldset>

It works and is more accessible!

This CSS is way too big to show you, so you'll need to view the page source where the CSS is both minified and post-css processed.

<style>
{% css %}

/* base styles for both blocks */
.binary-container {
  margin: 2rem 0;

  & label {
    font-size: 1.5rem;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-right: 1rem;
  }

  & input {
    transform: scale(2);
  }

  & output {
    position: relative;
    display: block;
    margin-top: 3rem;
  }
}

/* for the one that uses the 'content' property */
#css-content {
  --b1: 0;
  --b2: 0;
  --b3: 0;
  --b4: 0;
  --b5: 0;
  --b6: 0;
  --b7: 0;
  --b8: 0;

  &:has(#bit-1:checked) {--b1: 1; }
  &:has(#bit-2:checked) {--b2: 2; }
  &:has(#bit-3:checked) {--b3: 4; }
  &:has(#bit-4:checked) {--b4: 8; }
  &:has(#bit-5:checked) {--b5: 16; }
  &:has(#bit-6:checked) {--b6: 32; }
  &:has(#bit-7:checked) {--b7: 64; }
  &:has(#bit-8:checked) {--b8: 128; }

  & output::after {
    --result: calc(var(--b1) + var(--b2) + var(--b3) + var(--b4) + var(--b5) + var(--b6) + var(--b7) + var(--b8));
    counter-reset: result-counter var(--result);
    content: "Value: " counter(result-counter);
    display: inline-block;
  }
}

#many-spans {
  output span {
    display: none;
  }
  output span:first-child {
    display: inline-block;
  }

  &:has(:checked) output span:first-child {
    display: none;
  }

    &:not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(1) { display: inline-block; }
  &:has(#bit-1:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(2) { display: inline-block; }
  &:has(#bit-2:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(3) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(4) { display: inline-block; }
  &:has(#bit-3:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(5) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(6) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(7) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(8) { display: inline-block; }
  &:has(#bit-4:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(9) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(10) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(11) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(12) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(13) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(14) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):not(:has(#bit-1:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(15) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(16) { display: inline-block; }
  &:has(#bit-5:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(17) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-5:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(18) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-5:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(19) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-5:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(20) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-5:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(21) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-5:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(22) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(23) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(24) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-5:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(25) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-5:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(26) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(27) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(28) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(29) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):not(:has(#bit-2:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(30) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):not(:has(#bit-1:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(31) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(32) { display: inline-block; }
  &:has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(33) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-6:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(34) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(35) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-6:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(36) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(37) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-6:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(38) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(39) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-6:checked):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(40) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(41) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-6:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(42) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(43) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-6:checked):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(44) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(45) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(46) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(47) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(48) { display: inline-block; }
  &:has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(49) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(50) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(51) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(52) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(53) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(54) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(55) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(56) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(57) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(58) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(59) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-3:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(60) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(61) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-2:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(62) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-1:checked)):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(63) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):not(:has(#bit-7:checked)):not(:has(#bit-8:checked)) output span:nth-child(64) { display: inline-block; }
  &:has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(65) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(66) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(67) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-7:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(68) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(69) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(70) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(71) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-7:checked):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(72) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(73) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(74) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(75) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-7:checked):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(76) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(77) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(78) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(79) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-7:checked):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(80) { display: inline-block; }
  &:has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(81) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(82) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(83) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(84) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(85) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(86) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(87) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(88) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(89) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(90) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(91) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(92) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(93) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(94) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(95) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):not(:has(#bit-6:checked)):not(:has(#bit-8:checked)) output span:nth-child(96) { display: inline-block; }
  &:has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(97) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(98) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(99) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(100) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(101) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(102) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(103) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(104) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(105) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(106) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(107) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(108) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(109) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(110) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(111) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-5:checked)):not(:has(#bit-8:checked)) output span:nth-child(112) { display: inline-block; }
  &:has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-8:checked)) output span:nth-child(113) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-8:checked)) output span:nth-child(114) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-8:checked)) output span:nth-child(115) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-8:checked)) output span:nth-child(116) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-8:checked)) output span:nth-child(117) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-8:checked)) output span:nth-child(118) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-8:checked)) output span:nth-child(119) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-4:checked)):not(:has(#bit-8:checked)) output span:nth-child(120) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-8:checked)) output span:nth-child(121) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-8:checked)) output span:nth-child(122) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-8:checked)) output span:nth-child(123) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-3:checked)):not(:has(#bit-8:checked)) output span:nth-child(124) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-8:checked)) output span:nth-child(125) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-2:checked)):not(:has(#bit-8:checked)) output span:nth-child(126) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-1:checked)):not(:has(#bit-8:checked)) output span:nth-child(127) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):not(:has(#bit-8:checked)) output span:nth-child(128) { display: inline-block; }
  &:has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(129) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(130) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(131) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(132) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(133) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(134) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(135) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-8:checked):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(136) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(137) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(138) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(139) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(140) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(141) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(142) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(143) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-8:checked):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(144) { display: inline-block; }
  &:has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(145) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(146) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(147) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(148) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(149) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(150) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(151) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(152) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(153) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(154) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(155) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(156) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(157) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(158) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(159) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-8:checked):not(:has(#bit-6:checked)):not(:has(#bit-7:checked)) output span:nth-child(160) { display: inline-block; }
  &:has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(161) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(162) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(163) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(164) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(165) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(166) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(167) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(168) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(169) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(170) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(171) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(172) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(173) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(174) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(175) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-5:checked)):not(:has(#bit-7:checked)) output span:nth-child(176) { display: inline-block; }
  &:has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)) output span:nth-child(177) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)) output span:nth-child(178) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)) output span:nth-child(179) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)) output span:nth-child(180) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)) output span:nth-child(181) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)) output span:nth-child(182) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)) output span:nth-child(183) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-4:checked)):not(:has(#bit-7:checked)) output span:nth-child(184) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-7:checked)) output span:nth-child(185) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-7:checked)) output span:nth-child(186) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-7:checked)) output span:nth-child(187) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-7:checked)) output span:nth-child(188) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-7:checked)) output span:nth-child(189) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-7:checked)) output span:nth-child(190) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-7:checked)) output span:nth-child(191) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-8:checked):not(:has(#bit-7:checked)) output span:nth-child(192) { display: inline-block; }
  &:has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(193) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(194) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(195) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(196) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(197) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(198) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(199) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(200) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(201) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(202) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(203) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(204) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(205) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(206) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(207) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-5:checked)):not(:has(#bit-6:checked)) output span:nth-child(208) { display: inline-block; }
  &:has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)) output span:nth-child(209) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)) output span:nth-child(210) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)) output span:nth-child(211) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)) output span:nth-child(212) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)) output span:nth-child(213) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)) output span:nth-child(214) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)) output span:nth-child(215) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-4:checked)):not(:has(#bit-6:checked)) output span:nth-child(216) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)) output span:nth-child(217) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)) output span:nth-child(218) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)) output span:nth-child(219) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-6:checked)) output span:nth-child(220) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-6:checked)) output span:nth-child(221) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-6:checked)) output span:nth-child(222) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-6:checked)) output span:nth-child(223) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-6:checked)) output span:nth-child(224) { display: inline-block; }
  &:has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)) output span:nth-child(225) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)) output span:nth-child(226) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)) output span:nth-child(227) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)) output span:nth-child(228) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)) output span:nth-child(229) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)) output span:nth-child(230) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)) output span:nth-child(231) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-4:checked)):not(:has(#bit-5:checked)) output span:nth-child(232) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)) output span:nth-child(233) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)) output span:nth-child(234) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)) output span:nth-child(235) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-5:checked)) output span:nth-child(236) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)) output span:nth-child(237) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-5:checked)) output span:nth-child(238) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-5:checked)) output span:nth-child(239) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-5:checked)) output span:nth-child(240) { display: inline-block; }
  &:has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)) output span:nth-child(241) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)) output span:nth-child(242) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)) output span:nth-child(243) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-3:checked)):not(:has(#bit-4:checked)) output span:nth-child(244) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)) output span:nth-child(245) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-4:checked)) output span:nth-child(246) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-4:checked)) output span:nth-child(247) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-4:checked)) output span:nth-child(248) { display: inline-block; }
  &:has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)) output span:nth-child(249) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)):not(:has(#bit-3:checked)) output span:nth-child(250) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-3:checked)) output span:nth-child(251) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-3:checked)) output span:nth-child(252) { display: inline-block; }
  &:has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)):not(:has(#bit-2:checked)) output span:nth-child(253) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-2:checked)) output span:nth-child(254) { display: inline-block; }
  &:has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked):not(:has(#bit-1:checked)) output span:nth-child(255) { display: inline-block; }
  &:has(#bit-1:checked):has(#bit-2:checked):has(#bit-3:checked):has(#bit-4:checked):has(#bit-5:checked):has(#bit-6:checked):has(#bit-7:checked):has(#bit-8:checked) output span:nth-child(256) { display: inline-block; }
}

.post-content .supports {
  display: none;
}

@supports not (selector(:has(*)) and selector(&) and selector(:scope)) {
   .post-content .supports {
    display: block;
  }
}

{% endcss %}
</style>